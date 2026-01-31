import Router from 'express';
import { 
    getFeedPosts, 
    createFeedPost, 
    toggleLike, 
    likeAsGuest,
    deleteFeedPost 
} from '../controllers/feed.controller.js';
import { verifyAccessToken } from '../middlewares/index.js';

const router = Router();

// Public routes
router.get('/', getFeedPosts);
router.post('/:postId/like-guest', likeAsGuest);

// Protected routes (require authentication)
router.post('/', verifyAccessToken, createFeedPost);
router.post('/:postId/like', verifyAccessToken, toggleLike);
router.delete('/:postId', verifyAccessToken, deleteFeedPost);

export default router;
