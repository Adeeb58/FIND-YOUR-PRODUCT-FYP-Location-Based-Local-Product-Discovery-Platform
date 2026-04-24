// server/routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');

// ─────────────────────────────────────────────────────────────────────────────
// Haversine distance utility (returns km between two lat/lng points)
// ─────────────────────────────────────────────────────────────────────────────
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
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
}

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/search
// @desc    Full search: Text search products + geospatial vendor filtering
// @access  Public
// @params  q, category, lat, lng, radius (km), sort (distance|price_asc|price_desc), page, limit
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const {
            q = '',
            category = 'All',
            lat,
            lng,
            radius = 10,         // default 10km radius
            sort = 'distance',
            page = 1,
            limit = 50,
        } = req.query;

        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);
        const searchRadius = parseFloat(radius);
        const hasLocation = !isNaN(userLat) && !isNaN(userLng);

        // ── STEP 1: Find matching products using $text search ──────────────
        let productQuery = {};

        if (q && q.trim()) {
            // MongoDB $text search — uses the text index we created on Product
            productQuery.$text = { $search: q.trim() };
        }

        if (category && category !== 'All') {
            productQuery.category = category;
        }

        let productDbQuery = Product.find(productQuery);

        // Add text score for relevance sorting when query is provided
        if (q && q.trim()) {
            productDbQuery = productDbQuery.select({ score: { $meta: 'textScore' } });
        }

        const matchingProducts = await productDbQuery.lean();

        if (matchingProducts.length === 0) {
            return res.json({ results: [], count: 0, message: 'No products found' });
        }

        // Extract matched product IDs
        const matchedProductIds = matchingProducts.map(p => p._id);

        // Map products by ID for quick lookup
        const productMap = {};
        matchingProducts.forEach(p => {
            productMap[p._id.toString()] = p;
        });

        // ── STEP 2: Find vendors that have these products ──────────────────
        // Apply geospatial filter if user location is available
        let vendorQuery = {
            'products.product': { $in: matchedProductIds }
        };

        let vendors;

        if (hasLocation) {
            // ✅ MongoDB $near Geospatial Query
            // Returns vendors sorted by proximity to the user
            // maxDistance is in METERS (10km = 10000m)
            vendors = await Vendor.find({
                ...vendorQuery,
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [userLng, userLat], // GeoJSON: [longitude, latitude]
                        },
                        $maxDistance: searchRadius * 1000, // convert km to meters
                    },
                },
            })
                .populate('products.product')
                .lean();
        } else {
            // No location provided — return all vendors with matching products
            vendors = await Vendor.find(vendorQuery)
                .populate('products.product')
                .lean();
        }

        // ── STEP 3: Build unified result array ─────────────────────────────
        const results = [];

        vendors.forEach(vendor => {
            // Calculate actual distance
            let distance = null;
            if (hasLocation && vendor.location?.coordinates) {
                const [vLng, vLat] = vendor.location.coordinates;
                distance = haversineDistance(userLat, userLng, vLat, vLng);
            }

            // Find vendor products that match the search
            vendor.products.forEach(vp => {
                if (!vp.product) return; // skip if populate failed

                const productIdStr = vp.product._id.toString();
                const isMatch = matchedProductIds.some(id => id.toString() === productIdStr);

                if (!isMatch) return;

                results.push({
                    product: {
                        id: vp.product._id,
                        name: vp.product.name,
                        brand: vp.product.brand,
                        category: vp.product.category,
                        description: vp.product.description,
                        imageUrl: vp.product.imageUrl,
                        tags: vp.product.tags,
                        textScore: productMap[productIdStr]?.score || 0,
                    },
                    vendor: {
                        id: vendor._id,
                        name: vendor.name,
                        address: vendor.address,
                        latitude: vendor.location?.coordinates[1],
                        longitude: vendor.location?.coordinates[0],
                        distance,
                        rating: vendor.rating,
                        reviewCount: vendor.reviewCount,
                        imageUrl: vendor.imageUrl,
                        isVerified: vendor.isVerified,
                        contactPhone: vendor.contactPhone,
                        contactEmail: vendor.contactEmail,
                        openingHours: vendor.openingHours,
                    },
                    price: vp.price,
                    stock: vp.stock,
                    stockCount: vp.stockCount,
                });
            });
        });

        // ── STEP 4: Sort results ───────────────────────────────────────────
        if (sort === 'price_asc') {
            results.sort((a, b) => a.price - b.price);
        } else if (sort === 'price_desc') {
            results.sort((a, b) => b.price - a.price);
        } else if (sort === 'distance' && hasLocation) {
            results.sort((a, b) => (a.vendor.distance ?? 999) - (b.vendor.distance ?? 999));
        } else if (sort === 'rating') {
            results.sort((a, b) => b.vendor.rating - a.vendor.rating);
        } else if (q) {
            // Sort by text relevance score when no location/sort specified
            results.sort((a, b) => (b.product.textScore || 0) - (a.product.textScore || 0));
        }

        // ── STEP 5: Paginate ──────────────────────────────────────────────
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const startIndex = (pageNum - 1) * limitNum;
        const paginated = results.slice(startIndex, startIndex + limitNum);

        res.json({
            results: paginated,
            count: results.length,
            page: pageNum,
            totalPages: Math.ceil(results.length / limitNum),
            hasLocation,
            searchRadius: hasLocation ? searchRadius : null,
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Search failed', error: error.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/search/suggestions
// @desc    Fast autocomplete suggestions (partial name match)
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
router.get('/suggestions', async (req, res) => {
    try {
        const { q = '' } = req.query;

        if (!q || q.trim().length < 2) {
            return res.json({ suggestions: [] });
        }

        // Use regex for partial/prefix matching (fast for autocomplete)
        const products = await Product.find({
            name: { $regex: q.trim(), $options: 'i' },
        })
            .select('name category brand')
            .limit(8)
            .lean();

        const suggestions = products.map(p => ({
            id: p._id,
            name: p.name,
            category: p.category,
            brand: p.brand,
        }));

        res.json({ suggestions });
    } catch (error) {
        console.error('Suggestions error:', error);
        res.status(500).json({ message: 'Suggestions failed', error: error.message });
    }
});

module.exports = router;
