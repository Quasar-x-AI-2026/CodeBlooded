import Issue from '../model/Issue.model.js';
import NGO from '../model/Ngo.model.js';
import {asyncHandler, ApiError, ApiResponse} from '../utility/index.js';
import statusCode from '../constants/statusCode.js';
import {analyzeCrisis} from '../services/ml.service.js';
import getRefinedAnalysis, {
    checkCrisisUpdate,
} from '../services/gemini.service.js';
import NodeGeocoder from 'node-geocoder';

// Initialize Geocoder (OpenStreetMap is free, no key required)
const geocoder = NodeGeocoder({
    provider: 'openstreetmap',
});

// Reusable handler for both API and Cron
export const handleCrisisReporting = async (
    text,
    source = 'manual',
    location = ''
) => {
    // 1. Initial ML Analysis
    const rawAiResult = await analyzeCrisis(text, source, location);
    if (!rawAiResult) return null;

    const {
        is_crisis,
        location: locationData,
        type_classification,
    } = rawAiResult;

    if (!is_crisis) {
        // Run full analysis just to return the structured non-crisis result if needed
        const fullAnalysis = await getRefinedAnalysis(text, rawAiResult);
        return {is_crisis: false, aiAnalysis: fullAnalysis};
    }

    const detectedLocation = locationData?.name || location || 'Unknown';
    let geoCoordinates = {
        type: 'Point',
        coordinates: [0, 0],
    };

    // Try to get coordinates from ML or Geocoder
    if (locationData?.coordinates?.lat && locationData?.coordinates?.lon) {
        geoCoordinates.coordinates = [
            locationData.coordinates.lon,
            locationData.coordinates.lat,
        ];
    } else if (rawAiResult?.location?.coordinates?.lat) {
        geoCoordinates.coordinates = [
            rawAiResult.location.coordinates.lon,
            rawAiResult.location.coordinates.lat,
        ];
    }

    // Fallback Geocoding
    if (
        geoCoordinates.coordinates[0] === 0 &&
        detectedLocation &&
        detectedLocation !== 'Unknown'
    ) {
        try {
            const geoRes = await geocoder.geocode(detectedLocation);
            if (geoRes.length > 0) {
                geoCoordinates.coordinates = [
                    geoRes[0].longitude,
                    geoRes[0].latitude,
                ];
            } else {
                console.warn(
                    `Geocoding returned no results for: ${detectedLocation}`
                );
            }
        } catch (e) {
            console.warn('Geocoding failed', e.message);
        }
    }

    // 2. Duplicate Check
    let existingIssue = null;
    try {
        const query = {
            status: {$in: ['OPEN', 'IN_PROGRESS']},
            type: mapCrisisTypeToEnum(type_classification?.type),
        };

        // If we have valid coordinates, use near query
        if (geoCoordinates.coordinates[0] !== 0) {
            query.coordinates = {
                $near: {
                    $geometry: geoCoordinates,
                    $maxDistance: 20000, // 20km radius
                },
            };
        } else {
            // Fallback to strict location name match
            query.location = {$regex: detectedLocation, $options: 'i'};
        }

        existingIssue = await Issue.findOne(query);
    } catch (err) {
        console.warn(
            'Duplicate check failed (likely missing index). Proceeding as new issue.',
            err.message
        );
    }

    if (existingIssue) {
        console.log(
            `Found existing issue ${existingIssue._id}, checking for updates...`
        );
        const updateCheck = await checkCrisisUpdate(
            text,
            rawAiResult,
            existingIssue
        );

        if (updateCheck.has_updates && updateCheck.updated_analysis) {
            console.log('Updates found, modifying issue...');

            const newAnalysis = updateCheck.updated_analysis;
            existingIssue.aiAnalysis = newAnalysis;
            existingIssue.severity = newAnalysis.severity.overall;
            // Append update note
            const dateStr = new Date().toLocaleString();
            existingIssue.description = `[UPDATED ${dateStr}]\n${text}\n\n---\n\n${existingIssue.description}`;

            await existingIssue.save();
            return {is_crisis: true, status: 'updated', issue: existingIssue};
        } else {
            console.log('Duplicate report - no significant updates.');
            return {is_crisis: true, status: 'duplicate', issue: existingIssue};
        }
    }

    // 3. New Issue Creation
    const aiResult = await getRefinedAnalysis(text, rawAiResult);

    const severityScore = aiResult.severity?.overall || 0;
    const crisisType = aiResult.type_classification?.type || 'Others';

    const matchingNGOs = await NGO.find({
        address: {$regex: detectedLocation, $options: 'i'},
    });

    const newIssue = await Issue.create({
        title: `Crisis Alert: ${crisisType} in ${detectedLocation}`,
        description: text,
        type: mapCrisisTypeToEnum(crisisType),
        severity: severityScore,
        pinCode: '000000',
        location: detectedLocation,
        coordinates: geoCoordinates,
        date: new Date(),
        aiAnalysis: aiResult,
        handledBy: matchingNGOs.map((ngo) => ngo._id),
        isEmailSent: false,
    });

    return {is_crisis: true, status: 'created', issue: newIssue};
};

export const processCrisisReport = asyncHandler(async (req, res) => {
    const {text, source = 'Economic Times'} = req.body;
    const location = ''; // Default if not provided in body, or destructure if available

    if (!text) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            'Crisis report text is required'
        );
    }

    // Delegate to reusable handler
    const result = await handleCrisisReporting(text, source, location);

    if (!result) {
        throw new ApiError(statusCode.INTERNAL_SERVER_ERROR, 'Analysis failed');
    }

    if (!result.is_crisis) {
        return res.status(statusCode.OK).json(
            new ApiResponse(
                statusCode.OK,
                {
                    issue: {
                        title: 'No Crisis Detected',
                        description: text,
                        aiAnalysis: result.aiAnalysis,
                    },
                },
                'Report analyzed: Not a crisis, no action taken.'
            )
        );
    }

    return res
        .status(
            result.status === 'created' ? statusCode.CREATED : statusCode.OK
        )
        .json(
            new ApiResponse(
                result.status === 'created'
                    ? statusCode.CREATED
                    : statusCode.OK,
                {
                    issue: result.issue,
                    status: result.status,
                },
                result.status === 'created'
                    ? 'Crisis Report Created Successfully'
                    : 'Crisis Report Updated Successfully'
            )
        );
});

// Helper to map ML types to Schema Enum
const mapCrisisTypeToEnum = (mlType) => {
    if (!mlType) return 'others';
    const type = mlType.toLowerCase();
    if (
        ['disaster', 'flood', 'earthquake', 'fire', 'cyclone', 'tsunami'].some(
            (t) => type.includes(t)
        )
    )
        return 'disaster';
    if (
        ['disease', 'epidemic', 'virus', 'outbreak', 'health'].some((t) =>
            type.includes(t)
        )
    )
        return 'disease';
    return 'others';
};
