import FeedPost from '../model/FeedPost.model.js';
import {asyncHandler, ApiResponse} from '../utility/index.js';
import statusCode from '../constants/statusCode.js';

/**
 * GET /api/v1/feed
 * Fetch all active feed posts (public)
 */
export const getFeedPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await FeedPost.find({ isActive: true })
        .populate('ngoId', 'name type NGOcode')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await FeedPost.countDocuments({ isActive: true });

    return res.status(statusCode.OK).json(
        new ApiResponse(statusCode.OK, 'Feed posts fetched successfully', {
            posts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        })
    );
});

/**
 * POST /api/v1/feed
 * Create a new feed post (NGO only)
 */
export const createFeedPost = asyncHandler(async (req, res) => {
    const { headline, content, imageUrl, category, location } = req.body;
    
    // Get NGO ID from authenticated user
    const ngoId = req.user?.userId;
    
    if (!ngoId) {
        return res.status(statusCode.UNAUTHORIZED).json(
            new ApiResponse(statusCode.UNAUTHORIZED, 'Authentication required')
        );
    }

    if (!headline || !content) {
        return res.status(statusCode.BAD_REQUEST).json(
            new ApiResponse(statusCode.BAD_REQUEST, 'Headline and content are required')
        );
    }

    const post = await FeedPost.create({
        ngoId,
        headline,
        content,
        imageUrl: imageUrl || '',
        category: category || 'other',
        location: location || '',
    });

    await post.populate('ngoId', 'name type NGOcode');

    return res.status(statusCode.CREATED).json(
        new ApiResponse(statusCode.CREATED, 'Post created successfully', { post })
    );
});

/**
 * POST /api/v1/feed/:postId/like
 * Like or unlike a post (toggle)
 */
export const toggleLike = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(statusCode.UNAUTHORIZED).json(
            new ApiResponse(statusCode.UNAUTHORIZED, 'Authentication required to like posts')
        );
    }

    const post = await FeedPost.findById(postId);
    
    if (!post) {
        return res.status(statusCode.NOT_FOUND).json(
            new ApiResponse(statusCode.NOT_FOUND, 'Post not found')
        );
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
        // Unlike
        post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
        // Like
        post.likes.push(userId);
    }

    await post.save();

    return res.status(statusCode.OK).json(
        new ApiResponse(statusCode.OK, alreadyLiked ? 'Post unliked' : 'Post liked', {
            liked: !alreadyLiked,
            likeCount: post.likeCount,
        })
    );
});

/**
 * POST /api/v1/feed/:postId/like-guest
 * Like a post as guest (using localStorage tracking on frontend)
 */
export const likeAsGuest = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { action } = req.body; // 'like' or 'unlike'

    const post = await FeedPost.findById(postId);
    
    if (!post) {
        return res.status(statusCode.NOT_FOUND).json(
            new ApiResponse(statusCode.NOT_FOUND, 'Post not found')
        );
    }

    if (action === 'like') {
        post.likeCount = (post.likeCount || 0) + 1;
    } else if (action === 'unlike' && post.likeCount > 0) {
        post.likeCount = post.likeCount - 1;
    }

    await post.save();

    return res.status(statusCode.OK).json(
        new ApiResponse(statusCode.OK, action === 'like' ? 'Post liked' : 'Post unliked', {
            likeCount: post.likeCount,
        })
    );
});

/**
 * DELETE /api/v1/feed/:postId
 * Delete a post (NGO owner only)
 */
export const deleteFeedPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const ngoId = req.user?.userId;

    const post = await FeedPost.findById(postId);
    
    if (!post) {
        return res.status(statusCode.NOT_FOUND).json(
            new ApiResponse(statusCode.NOT_FOUND, 'Post not found')
        );
    }

    if (post.ngoId.toString() !== ngoId?.toString()) {
        return res.status(statusCode.FORBIDDEN).json(
            new ApiResponse(statusCode.FORBIDDEN, 'Not authorized to delete this post')
        );
    }

    post.isActive = false;
    await post.save();

    return res.status(statusCode.OK).json(
        new ApiResponse(statusCode.OK, 'Post deleted successfully')
    );
});
