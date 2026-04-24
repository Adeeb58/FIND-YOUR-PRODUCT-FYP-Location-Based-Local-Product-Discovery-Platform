const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor'
        },
        name: String,
        quantity: Number,
        price: Number,
        image: String,
        vendor: String
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Confirmed',
        enum: ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
