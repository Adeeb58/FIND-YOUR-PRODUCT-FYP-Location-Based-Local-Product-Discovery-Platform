import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { mockProducts, mockVendors } from '../utils/mockData';
import { ProductCard } from '../components/product/ProductCard';

const NewArrivalsPage = () => {
    // Simulate new arrivals by picking random products from the end of the array
    const newProducts = [...mockProducts].reverse().slice(0, 8);

    return (
        <div className="min-h-screen bg-background pb-20">
            <section className="py-20 bg-gradient-to-b from-blue-50 to-background dark:from-blue-900/10 dark:to-background">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-1 rounded-full text-sm font-bold mb-4"
                    >
                        <Sparkles className="w-4 h-4" /> Just Landed
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-poppins">New Arrivals</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Discover the latest additions from our local vendor community.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {newProducts.map((product) => {
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

export default NewArrivalsPage;
