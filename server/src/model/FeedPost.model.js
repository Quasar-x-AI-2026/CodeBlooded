import mongoose from 'mongoose';

const feedPostSchema = new mongoose.Schema(
    {
        ngoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'NGO',
            required: true,
            index: true,
        },
        headline: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
        imageUrl: {
            type: String,
            default: '',
        },
        category: {
            type: String,
            enum: ['relief', 'rescue', 'donation', 'awareness', 'volunteer', 'other'],
            default: 'other',
        },
        location: {
            type: String,
            default: '',
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        likeCount: {
            type: Number,
            default: 0,
            index: true,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    { timestamps: true }
);

// Update likeCount when likes array changes
feedPostSchema.pre('save', function (next) {
    if (this.isModified('likes')) {
        this.likeCount = this.likes.length;
    }
    next();
});

const FeedPost = mongoose.model('FeedPost', feedPostSchema);
export default FeedPost;
