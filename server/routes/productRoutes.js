// server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const { protect, authorize } = require('../middleware/auth');

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/products
// @desc    Get all products with optional category filter
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const query = category && category !== 'All' ? { category } : {};
        const products = await Product.find(query).sort({ name: 1 }).lean();
        res.json({ products, count: products.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/products/:id
// @desc    Get one product + all vendors that sell it (with prices)
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
    try {
        const { lat, lng } = req.query;
        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);

        const product = await Product.findById(req.params.id).lean();
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find all vendors that sell this product
        const vendors = await Vendor.find({
            'products.product': product._id,
        }).lean();

        // Build price comparison list
        const vendorPrices = vendors.map(vendor => {
            const vp = vendor.products.find(
                p => p.product.toString() === product._id.toString()
            );
            const [vLng, vLat] = vendor.location?.coordinates || [0, 0];
            const distance =
                !isNaN(userLat) && !isNaN(userLng)
                    ? parseFloat(
                        (
                            6371 *
                            2 *
                            Math.atan2(
                                Math.sqrt(
                                    Math.sin(((vLat - userLat) * Math.PI) / 180 / 2) ** 2 +
                                    Math.cos((userLat * Math.PI) / 180) *
                                    Math.cos((vLat * Math.PI) / 180) *
                                    Math.sin(((vLng - userLng) * Math.PI) / 180 / 2) ** 2
                                ),
                                Math.sqrt(
                                    1 -
                                    (Math.sin(((vLat - userLat) * Math.PI) / 180 / 2) ** 2 +
                                        Math.cos((userLat * Math.PI) / 180) *
                                        Math.cos((vLat * Math.PI) / 180) *
                                        Math.sin(((vLng - userLng) * Math.PI) / 180 / 2) ** 2)
                                )
                            )
                        ).toFixed(2)
                    )
                    : null;

            return {
                vendorId: vendor._id,
                vendorName: vendor.name,
                vendorAddress: vendor.address,
                vendorImage: vendor.imageUrl,
                vendorRating: vendor.rating,
                latitude: vLat,
                longitude: vLng,
                distance,
                isVerified: vendor.isVerified,
                contactPhone: vendor.contactPhone,
                price: vp?.price,
                stock: vp?.stock,
                stockCount: vp?.stockCount,
            };
        }).sort((a, b) => a.price - b.price); // Sort by lowest price

        res.json({
            product: {
                id: product._id,
                name: product.name,
                brand: product.brand,
                category: product.category,
                description: product.description,
                imageUrl: product.imageUrl,
                tags: product.tags,
            },
            vendors: vendorPrices,
            lowestPrice: vendorPrices[0]?.price || null,
            highestPrice: vendorPrices[vendorPrices.length - 1]?.price || null,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch product', error: error.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/products
// @desc    Create a new product (admin only)
// @access  Private (admin)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', protect, authorize('admin', 'vendor'), async (req, res) => {
    try {
        const { name, brand, category, description, imageUrl, tags } = req.body;
        const product = await Product.create({ name, brand, category, description, imageUrl, tags });
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Failed to create product', error: error.message });
    }
});

module.exports = router;
