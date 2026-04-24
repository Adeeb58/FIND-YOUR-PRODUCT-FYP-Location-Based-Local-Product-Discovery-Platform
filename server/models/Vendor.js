// server/models/Vendor.js
const mongoose = require('mongoose');

const vendorProductSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    stock: {
        type: String,
        enum: ['Available', 'Low', 'Out of Stock'],
        default: 'Available',
    },
    stockCount: {
        type: Number,
        default: 0,
        min: 0,
    },
});

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vendor name is required'],
        trim: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
    },

    // ✅ GeoJSON for MongoDB Geospatial Queries ($near, $geoWithin)
    // Stores as [longitude, latitude] — note: MongoDB is [lng, lat] NOT [lat, lng]
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },

    rating: {
        type: Number,
        default: 4.0,
        min: 0,
        max: 5,
    },
    reviewCount: {
        type: Number,
        default: 0,
    },
    openingHours: {
        type: String,
        default: 'Mon-Sun: 9:00 AM - 9:00 PM',
    },
    description: {
        type: String,
        default: '',
    },
    imageUrl: {
        type: String,
        default: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
    },
    contactEmail: {
        type: String,
        trim: true,
        lowercase: true,
    },
    contactPhone: {
        type: String,
        trim: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    featured: {
        type: Boolean,
        default: false,
    },

    // Embedded products list with price and stock per vendor
    products: [vendorProductSchema],

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// ✅ 2dsphere Index — required for ALL MongoDB geospatial queries
// This makes $near, $nearSphere, $geoWithin work on the location field
vendorSchema.index({ location: '2dsphere' });

// Text index on vendor name for vendor search
vendorSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Vendor', vendorSchema);
