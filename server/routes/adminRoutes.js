// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/admin/dashboard-stats
// @desc    Get real analytics stats for the admin dashboard
// @access  Private (admin)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/dashboard-stats', protect, authorize('admin'), async (req, res) => {
    try {
        // 1. Pending Vendors
        const pendingVendorsCount = await Vendor.countDocuments({ isVerified: false });

        // 2. Total Categories
        const categories = await Product.distinct('category');
        const totalCategories = categories.length;

        // 3. Total Products
        const totalProducts = await Product.countDocuments();

        // 4. New Sales (Today)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        
        const todaysOrders = await Order.find({ createdAt: { $gte: today } });
        const newSales = todaysOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        res.json({
            pendingVendors: pendingVendorsCount,
            totalCategories,
            totalProducts,
            newSales
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get dashboard stats', error: error.message });
    }
});

module.exports = router;
