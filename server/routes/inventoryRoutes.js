// server/routes/inventoryRoutes.js
// Full CRUD for vendor's own inventory (products they sell + stock management)

const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// Helper: find the vendor record that belongs to the logged-in user
async function getMyVendor(userId) {
    return Vendor.findOne({ owner: userId });
}

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/inventory/my-store
// @desc    Get the logged-in vendor's store profile + all their products
// @access  Private (vendor)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/my-store', protect, authorize('vendor', 'admin'), async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ owner: req.user._id })
            .populate('products.product')
            .lean();

        if (!vendor) {
            // No vendor profile yet — return empty state so frontend can prompt registration
            return res.json({ vendor: null, hasStore: false });
        }

        res.json({ vendor, hasStore: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get store info', error: error.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/inventory/dashboard-stats
// @desc    Get real analytics stats for the vendor dashboard
// @access  Private (vendor)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/dashboard-stats', protect, authorize('vendor', 'admin'), async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ owner: req.user._id })
            .populate('products.product')
            .lean();

        if (!vendor) {
            return res.json({
                totalProducts: 0,
                availableProducts: 0,
                lowStockProducts: 0,
                outOfStockProducts: 0,
                lowStockItems: [],
                topProduct: null,
                hasStore: false,
            });
        }

        const totalProducts = vendor.products.length;
        const availableProducts = vendor.products.filter(p => p.stock === 'Available').length;
        const lowStockProducts = vendor.products.filter(p => p.stock === 'Low').length;
        const outOfStockProducts = vendor.products.filter(p => p.stock === 'Out of Stock').length;

        // Low stock items for the alert panel
        const lowStockItems = vendor.products
            .filter(p => p.stock === 'Low' || p.stock === 'Out of Stock')
            .map(p => ({
                id: p._id,
                productId: p.product?._id,
                name: p.product?.name || 'Unknown Product',
                imageUrl: p.product?.imageUrl,
                stock: p.stock,
                stockCount: p.stockCount,
                price: p.price,
            }));

        // Top product: the one with highest stock count available (proxy for demand)
        let topProduct = null;
        const available = vendor.products
            .filter(p => p.stock === 'Available')
            .sort((a, b) => b.stockCount - a.stockCount);
        if (available.length > 0 && available[0].product) {
            topProduct = available[0].product.name;
        }

        res.json({
            vendorId: vendor._id,
            vendorName: vendor.name,
            totalProducts,
            availableProducts,
            lowStockProducts,
            outOfStockProducts,
            lowStockItems,
            topProduct,
            rating: vendor.rating,
            reviewCount: vendor.reviewCount,
            hasStore: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get dashboard stats', error: error.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/inventory/products
// @desc    Get ALL products in the system (for vendor to pick from when adding)
// @access  Private (vendor)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/products', protect, authorize('vendor', 'admin'), async (req, res) => {
    try {
        const products = await Product.find().sort({ name: 1 }).lean();
        res.json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get products', error: error.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/inventory/store
// @desc    Create/register vendor's store profile (first-time setup)
// @access  Private (vendor)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/store', protect, authorize('vendor', 'admin'), async (req, res) => {
    try {
        const existing = await Vendor.findOne({ owner: req.user._id });
        if (existing) {
            return res.status(400).json({ message: 'Store already registered. Use PUT to update.' });
        }

        const { name, address, latitude, longitude, contactPhone, contactEmail, description, openingHours } = req.body;

        if (!name || !address || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: 'name, address, latitude, and longitude are required.' });
        }

        const vendor = await Vendor.create({
            name,
            owner: req.user._id,
            address,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)], // GeoJSON: [lng, lat]
            },
            contactPhone,
            contactEmail,
            description,
            openingHours,
            products: [],
        });

        res.status(201).json({ message: 'Store created successfully', vendor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create store', error: error.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/inventory/add-product
// @desc    Add a product to vendor's inventory (from system product catalog)
// @access  Private (vendor)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/add-product', protect, authorize('vendor', 'admin'), async (req, res) => {
    try {
        const { productId, price, stockCount, stock } = req.body;

        if (!productId || price === undefined) {
            return res.status(400).json({ message: 'productId and price are required.' });
        }

        const vendor = await getMyVendor(req.user._id);
        if (!vendor) {
            return res.status(404).json({ message: 'Store not found. Please register your store first.' });
        }

        // Prevent duplicate product entries
        const alreadyAdded = vendor.products.some(p => p.product?.toString() === productId);
        if (alreadyAdded) {
            return res.status(400).json({ message: 'This product is already in your inventory. Edit it instead.' });
        }

        // Verify the product exists
        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found in catalog.' });
        }

        // Map stockCount to stock status automatically
        let stockStatus = stock;
        if (!stockStatus) {
            const count = parseInt(stockCount) || 0;
            stockStatus = count === 0 ? 'Out of Stock' : count <= 10 ? 'Low' : 'Available';
        }

        vendor.products.push({
            product: productId,
            price: parseFloat(price),
            stock: stockStatus,
            stockCount: parseInt(stockCount) || 0,
        });

        await vendor.save();
        await vendor.populate('products.product');

        res.status(201).json({
            message: `"${productExists.name}" added to your inventory!`,
            vendor,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add product', error: error.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/inventory/products/:inventoryItemId
// @desc    Update a product's price and stock in vendor's inventory
// @access  Private (vendor)
// ─────────────────────────────────────────────────────────────────────────────
router.put('/products/:inventoryItemId', protect, authorize('vendor', 'admin'), async (req, res) => {
    try {
        const { price, stock, stockCount } = req.body;
        const vendor = await getMyVendor(req.user._id);

        if (!vendor) {
            return res.status(404).json({ message: 'Store not found.' });
        }

        const item = vendor.products.id(req.params.inventoryItemId);
        if (!item) {
            return res.status(404).json({ message: 'Product not found in your inventory.' });
        }

        if (price !== undefined) item.price = parseFloat(price);
        if (stockCount !== undefined) {
            item.stockCount = parseInt(stockCount);
            // Auto-update stock status based on count
            if (!stock) {
                item.stock = item.stockCount === 0 ? 'Out of Stock'
                    : item.stockCount <= 10 ? 'Low'
                    : 'Available';
            }
        }
        if (stock !== undefined) item.stock = stock;

        await vendor.save();
        await vendor.populate('products.product');

        res.json({ message: 'Product updated successfully', vendor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   DELETE /api/inventory/products/:inventoryItemId
// @desc    Remove a product from vendor's inventory
// @access  Private (vendor)
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/products/:inventoryItemId', protect, authorize('vendor', 'admin'), async (req, res) => {
    try {
        const vendor = await getMyVendor(req.user._id);

        if (!vendor) {
            return res.status(404).json({ message: 'Store not found.' });
        }

        const itemIndex = vendor.products.findIndex(p => p._id.toString() === req.params.inventoryItemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Product not found in your inventory.' });
        }

        vendor.products.splice(itemIndex, 1);
        await vendor.save();

        res.json({ message: 'Product removed from inventory successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete product', error: error.message });
    }
});

module.exports = router;
