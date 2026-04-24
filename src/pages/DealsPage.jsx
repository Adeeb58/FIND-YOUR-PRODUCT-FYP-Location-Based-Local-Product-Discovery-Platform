import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { mockProducts, mockVendors } from '../utils/mockData';
import { ProductCard } from '../components/product/ProductCard';

const DealsPage = () => {
    // Simulate deals by picking random products
    const dealProducts = mockProducts.slice(0, 8);

    return (
        <div className="min-h-screen bg-background pb-20">
            <section className="py-20 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-1 rounded-full text-sm font-bold mb-4"
                    >
                        <Clock className="w-4 h-4" /> Limited Time Offers
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 font-poppins">Hot <span className="text-red-500">Deals</span></h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Grab the best discounts on your favorite local products before they're gone!
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {dealProducts.map((product) => {
                        // Find a vendor that sells this product, or just pick the first one as fallback
                        const vendor = mockVendors.find(v => v.products.some(p => p.productId === product.id)) || mockVendors[0];
                        const productInfo = vendor.products.find(p => p.productId === product.id) || { price: 10, stock: 'Available', stockCount: 10 };

                        return (
                            <ProductCard
                                key={product.id}
                                product={product}
                                vendor={vendor}
                                price={productInfo.price}
                                stock={productInfo.stock}
                                stockCount={productInfo.stockCount}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DealsPage;
