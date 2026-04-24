// server/routes/vendorRoutes.js
const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const { protect, authorize } = require('../middleware/auth');

// Haversine distance
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return parseFloat((6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2));
}

// Format vendor for consistent API response
function formatVendor(vendor, userLat, userLng) {
    const [vLng, vLat] = vendor.location?.coordinates || [0, 0];
    const distance =
        userLat && userLng ? haversineDistance(userLat, userLng, vLat, vLng) : null;

    return {
        id: vendor._id,
        name: vendor.name,
        address: vendor.address,
        latitude: vLat,
        longitude: vLng,
        distance,
        rating: vendor.rating,
        reviewCount: vendor.reviewCount,
        openingHours: vendor.openingHours,
        description: vendor.description,
        imageUrl: vendor.imageUrl,
        contactEmail: vendor.contactEmail,
        contactPhone: vendor.contactPhone,
        isVerified: vendor.isVerified,
        featured: vendor.featured,
        products: vendor.products,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/vendors
// @desc    Get all vendors (with optional location for distance calc)
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const { lat, lng } = req.query;
        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);

        const vendors = await Vendor.find()
            .populate('products.product', 'name category imageUrl brand')
            .lean();

        const formatted = vendors.map(v => formatVendor(v, userLat, userLng));

        // Sort by distance if location provided, else by rating
        if (!isNaN(userLat) && !isNaN(userLng)) {
            formatted.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
        } else {
            formatted.sort((a, b) => b.rating - a.rating);
        }

        res.json({ vendors: formatted, count: formatted.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch vendors', error: error.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/vendors/nearby
// @desc    Get NEARBY vendors using MongoDB $near geospatial query
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
router.get('/nearby', async (req, res) => {
    try {
        const { lat, lng, radius = 10 } = req.query;
        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);
        const searchRadius = parseFloat(radius);

        if (isNaN(userLat) || isNaN(userLng)) {
            return res.status(400).json({ message: 'lat and lng query params are required' });
        }

        // ✅ Real MongoDB $near geospatial query
        const vendors = await Vendor.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [userLng, userLat], // GeoJSON: [lng, lat]
                    },
                    $maxDistance: searchRadius * 1000, // km to meters
                },
            },
        })
            .populate('products.product', 'name category imageUrl brand')
            .lean();

        const formatted = vendors.map(v => formatVendor(v, userLat, userLng));

        res.json({
            vendors: formatted,
            count: formatted.length,
            searchRadius,
            center: { lat: userLat, lng: userLng },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Nearby search failed', error: error.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/vendors/:id
// @desc    Get a single vendor by ID with full product details
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
    try {
        const { lat, lng } = req.query;
        const vendor = await Vendor.findById(req.params.id)
            .populate('products.product')
            .lean();

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        const formatted = formatVendor(vendor, parseFloat(lat), parseFloat(lng));
        res.json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch vendor', error: error.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/vendors/:id/products/:productId/stock
// @desc    Vendor updates stock for a specific product
// @access  Private (vendor only)
// ─────────────────────────────────────────────────────────────────────────────
router.put('/:id/products/:productId/stock', protect, authorize('vendor', 'admin'), async (req, res) => {
    try {
        const { stock, stockCount, price } = req.body;
        const vendor = await Vendor.findById(req.params.id);

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        const prodItem = vendor.products.find(
            p => p.product.toString() === req.params.productId
        );

        if (!prodItem) {
            return res.status(404).json({ message: 'Product not found in this vendor' });
        }

        if (stock !== undefined) prodItem.stock = stock;
        if (stockCount !== undefined) prodItem.stockCount = stockCount;
        if (price !== undefined) prodItem.price = price;

        await vendor.save();
        res.json({ message: 'Stock updated successfully', product: prodItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update stock', error: error.message });
    }
});

module.exports = router;
