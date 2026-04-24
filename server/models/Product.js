// server/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    brand: {
        type: String,
        required: [true, 'Brand is required'],
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Dairy', 'Bakery', 'Produce', 'Beverages', 'Pantry', 'Meat', 'Seafood', 'Frozen', 'Snacks', 'Spices', 'Other'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    imageUrl: {
        type: String,
        default: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=500',
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// ✅ MongoDB Full-Text Search Index
// This enables $text search queries on name, brand, description, and tags
productSchema.index(
    {
        name: 'text',
        brand: 'text',
        description: 'text',
        tags: 'text',
    },
    {
        weights: {
            name: 10,       // Name matches are most important
            brand: 5,       // Brand matches are second
            tags: 3,        // Tag matches are third
            description: 1, // Description matches are last
        },
        name: 'product_text_index',
    }
);

// Category index for fast filtering
productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);
