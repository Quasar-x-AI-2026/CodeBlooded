import NGO from '../model/Ngo.model.js';
import Issue from '../model/Issue.model.js';
import Payment from '../model/Payment.model.js';
import User from '../model/User.model.js';
import {asyncHandler, ApiResponse} from '../utility/index.js';
import statusCode from '../constants/statusCode.js';

/**
 * GET /api/v1/analytics/dashboard
 * Fetch aggregated stats for the dashboard
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
    // Count NGOs
    const ngoCount = await NGO.countDocuments();

    // Count active crisis zones (OPEN or IN_PROGRESS issues)
    const activeCrisisCount = await Issue.countDocuments({
        status: { $in: ['OPEN', 'IN_PROGRESS'] },
    });

    // Total funds mobilized (sum of paid payments)
    const fundsResult = await Payment.aggregate([
        { $match: { status: 'paid', isVerified: true } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const fundsMobilized = fundsResult[0]?.total || 0;

    // Also add NGO current funds
    const ngoFundsResult = await NGO.aggregate([
        { $group: { _id: null, total: { $sum: '$currentFund' } } },
    ]);
    const ngoFunds = ngoFundsResult[0]?.total || 0;

    // Estimate people impacted based on active issues
    // Using severity and a base population factor
    const issuesWithSeverity = await Issue.find({
        status: { $in: ['OPEN', 'IN_PROGRESS'] },
    }).select('severity aiAnalysis');

    let estimatedPeopleImpacted = 0;
    issuesWithSeverity.forEach((issue) => {
        // Base estimate: severity * 50000 people per issue
        const severity = issue.severity || 0.5;
        estimatedPeopleImpacted += Math.round(severity * 50000);
    });

    return res.status(statusCode.OK).json(
        new ApiResponse(statusCode.OK, 'Dashboard stats fetched successfully', {
            ngoCount,
            activeCrisisCount,
            fundsMobilized: fundsMobilized / 100, // Convert from paise to rupees
            totalNgoFunds: ngoFunds,
            estimatedPeopleImpacted,
        })
    );
});

/**
 * GET /api/v1/analytics/priority-crises
 * Fetch top priority crises for the dashboard panel
 */
export const getPriorityCrises = asyncHandler(async (req, res) => {
    const priorityCrises = await Issue.find({
        status: { $in: ['OPEN', 'IN_PROGRESS'] },
    })
        .sort({ severity: -1 })
        .limit(5)
        .select('title type status severity coordinates aiAnalysis createdAt');

    const formatted = priorityCrises.map((issue) => {
        const severity = Math.round((issue.severity || 0) * 100);
        let level = 'Moderate';
        let color = 'yellow';
        
        if (severity >= 80) {
            level = 'High';
            color = 'red';
        } else if (severity >= 60) {
            level = 'Moderate';
            color = 'orange';
        } else {
            level = 'Low';
            color = 'yellow';
        }

        return {
            _id: issue._id,
            state: issue.aiAnalysis?.location?.name || 'Unknown Location',
            type: issue.type || 'Unknown',
            title: issue.title,
            score: severity,
            level,
            color,
            population: `Est. ${Math.round((issue.severity || 0.5) * 50)}K impacted`,
        };
    });

    return res.status(statusCode.OK).json(
        new ApiResponse(statusCode.OK, 'Priority crises fetched successfully', {
            crises: formatted,
        })
    );
});

/**
 * GET /api/v1/analytics/top-ngos
 * Fetch top performing NGOs by funds raised
 */
export const getTopNGOs = asyncHandler(async (req, res) => {
    // Get NGOs with most funds received
    const topNGOsByFunds = await Payment.aggregate([
        { $match: { status: 'paid', isVerified: true } },
        { $group: { _id: '$ngoId', totalReceived: { $sum: '$amount' }, donationCount: { $sum: 1 } } },
        { $sort: { totalReceived: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: 'ngos',
                localField: '_id',
                foreignField: '_id',
                as: 'ngoDetails',
            },
        },
        { $unwind: '$ngoDetails' },
        {
            $project: {
                _id: 1,
                totalReceived: 1,
                donationCount: 1,
                name: '$ngoDetails.name',
                type: '$ngoDetails.type',
                address: '$ngoDetails.address',
            },
        },
    ]);

    // If no payment data, fallback to NGOs with highest current funds
    if (topNGOsByFunds.length === 0) {
        const ngosByCurrentFund = await NGO.find()
            .sort({ currentFund: -1 })
            .limit(5)
            .select('name type address currentFund');

        const formatted = ngosByCurrentFund.map((ngo) => ({
            _id: ngo._id,
            name: ngo.name,
            type: ngo.type,
            address: ngo.address,
            totalReceived: ngo.currentFund * 100, // In paise for consistency
            donationCount: 0,
        }));

        return res.status(statusCode.OK).json(
            new ApiResponse(statusCode.OK, 'Top NGOs fetched successfully', {
                ngos: formatted,
            })
        );
    }

    return res.status(statusCode.OK).json(
        new ApiResponse(statusCode.OK, 'Top NGOs fetched successfully', {
            ngos: topNGOsByFunds,
        })
    );
});

/**
 * GET /api/v1/analytics/top-donors
 * Fetch top donating users
 */
export const getTopDonors = asyncHandler(async (req, res) => {
    const topDonors = await Payment.aggregate([
        { $match: { status: 'paid', isVerified: true } },
        { $group: { _id: '$userId', totalDonated: { $sum: '$amount' }, donationCount: { $sum: 1 } } },
        { $sort: { totalDonated: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userDetails',
            },
        },
        { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 1,
                totalDonated: 1,
                donationCount: 1,
                name: { $ifNull: ['$userDetails.fullName', 'Anonymous'] },
                email: '$userDetails.email',
            },
        },
    ]);

    return res.status(statusCode.OK).json(
        new ApiResponse(statusCode.OK, 'Top donors fetched successfully', {
            donors: topDonors,
        })
    );
});
