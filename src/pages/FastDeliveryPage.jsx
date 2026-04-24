import React from 'react';
import { mockProducts, getVendorsForProduct } from '../utils/mockData';
import { ProductCard } from '../components/product/ProductCard';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Truck, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FastDeliveryPage = () => {
    // Logic: Find products available at nearby vendors. 
    // In a real app, this would query backend for 'same-day delivery' eligible items.
    // For mock, we'll take a subset of products and assume they are eligible.
    const fastDeliveryProducts = mockProducts.slice(0, 8);

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <Badge variant="warning" size="lg" className="mb-6 px-4 py-2 text-base">
                        <Clock className="mr-2 h-5 w-5" />
                        Express Delivery
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Get it <span className="text-gradient-secondary">Today</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-xl">
                        Shop from local stores offering same-day delivery. Ultra-fast convenience at your doorstep.
                    </p>
                </motion.div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {fastDeliveryProducts.map((product, idx) => {
                        const vendors = getVendorsForProduct(product.id);
                        const bestVendor = vendors[0];
                        if (!bestVendor) return null;

                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <ProductCard
                                    product={product}
                                    vendor={bestVendor}
                                    price={bestVendor.productPrice}
                                    stock={bestVendor.productStock}
                                    stockCount={bestVendor.productStockCount}
                                />
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default FastDeliveryPage;
