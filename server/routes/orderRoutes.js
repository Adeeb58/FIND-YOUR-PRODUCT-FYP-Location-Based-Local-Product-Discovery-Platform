const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { items, totalAmount, paymentMethod } = req.body;

        if (items && items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            user: req.user._id,
            items,
            totalAmount,
            paymentMethod
        });

        const createdOrder = await order.save();

        // Inventory Sync: Deduct stock from vendors
        const Vendor = require('../models/Vendor');
        
        for (const item of items) {
            if (item.vendorId && item.productId) {
                // Find the vendor
                const vendor = await Vendor.findById(item.vendorId);
                if (vendor) {
                    // Find the specific product in vendor's inventory
                    const inventoryItem = vendor.products.find(p => 
                        p.product.toString() === item.productId.toString()
                    );
                    
                    if (inventoryItem) {
                        // Decrement stock
                        inventoryItem.stockCount -= (item.quantity || 1);
                        if (inventoryItem.stockCount < 0) inventoryItem.stockCount = 0;
                        
                        // Recalculate stock status dynamically
                        if (inventoryItem.stockCount === 0) {
                            inventoryItem.stock = 'Out of Stock';
                        } else if (inventoryItem.stockCount <= 10) {
                            inventoryItem.stock = 'Low';
                        } else {
                            inventoryItem.stock = 'Available';
                        }
                        
                        await vendor.save();
                    }
                }
            }
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get logged in user orders (History)
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
    try {
        // Current time minus 5 seconds
        const visibleThreshold = new Date(Date.now() - 5 * 1000);

        // Find orders created BEFORE 5 seconds ago
        const orders = await Order.find({
            user: req.user._id,
            createdAt: { $lte: visibleThreshold }
        }).sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
