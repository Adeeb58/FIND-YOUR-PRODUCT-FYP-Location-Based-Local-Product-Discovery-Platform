// src/pages/user/UserFavoritesPage.jsx - Enhanced with consistent colors
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Store, Package, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Link } from 'react-router-dom';
import { ProductCard } from '../../components/product/ProductCard';
import { mockProducts, mockVendors } from '../../utils/mockData';
import { Button } from '../../components/ui/button';
import { formatPrice } from '../../utils/currency';

const mockFavoriteVendors = mockVendors.slice(0, 2);
const mockFavoriteProducts = [
    {
        product: mockProducts[0],
        vendor: mockVendors[0],
        price: 3.99,
        stock: 'Available',
        stockCount: 10
    },
    {
        product: mockProducts[2],
        vendor: mockVendors[1],
        price: 2.49,
        stock: 'Low',
        stockCount: 5
    }
];

const UserFavoritesPage = () => {
    const [loading, setLoading] = useState(true);
    const [favProducts, setFavProducts] = useState([]);
    const [favVendors, setFavVendors] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setFavProducts(mockFavoriteProducts);
            setFavVendors(mockFavoriteVendors);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-fypBlue" />
                <span className="ml-3 text-lg text-gray-900 dark:text-gray-100">Loading your favorites...</span>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
        >
            <h1 className="text-4xl font-poppins font-bold text-gray-900 dark:text-gray-100 flex items-center">
                <Heart className="h-8 w-8 mr-3 text-red-500 fill-current" /> My Favorites
            </h1>

            {/* Favorite Vendors Section */}
            <Card className="border-2 dark:bg-gray-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center text-gray-900 dark:text-white">
                        <Store className="h-6 w-6 mr-2 text-fypGreen" /> Favorite Shops
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {favVendors.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {favVendors.map(vendor => (
                                <Link to={`/vendor/${vendor.id}`} key={vendor.id}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-all bg-white dark:bg-gray-700/50 flex items-center justify-between"
                                    >
                                        <div>
                                            <h4 className="font-semibold text-lg text-fypBlue dark:text-fypBlue">{vendor.name}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{vendor.address}</p>
                                        </div>
                                        <Button variant="ghost" size="sm">View</Button>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">You haven't saved any favorite shops yet.</p>
                    )}
                </CardContent>
            </Card>

            {/* Favorite Products Section */}
            <Card className="border-2 dark:bg-gray-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center text-gray-900 dark:text-white">
                        <Package className="h-6 w-6 mr-2 text-fypBlue" /> Saved Products
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {favProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {favProducts.map(item => (
                                <ProductCard
                                    key={item.product.id}
                                    product={item.product}
                                    vendor={item.vendor}
                                    price={item.price}
                                    stock={item.stock}
                                    stockCount={item.stockCount}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">You haven't saved any favorite products yet.</p>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default UserFavoritesPage;
