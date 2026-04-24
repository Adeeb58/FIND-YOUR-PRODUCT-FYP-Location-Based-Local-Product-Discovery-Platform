// src/pages/VendorPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockVendors } from '../utils/mockData';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { MapPin, Star, Store, ArrowRight, CheckCircle2, Navigation, List, Map as MapIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ProductMap } from '../components/maps/ProductMap';
import { useState } from 'react';

const VendorPage = () => {
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    return (
        <div className="min-h-screen bg-background py-16">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                        Our Trusted Vendors
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Connect with verified local businesses and discover premium products in your neighborhood.
                    </p>
                </motion.div>

                {/* View Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="bg-muted p-1 rounded-lg inline-flex">
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className="gap-2"
                        >
                            <List className="h-4 w-4" />
                            List View
                        </Button>
                        <Button
                            variant={viewMode === 'map' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('map')}
                            className="gap-2"
                        >
                            <MapIcon className="h-4 w-4" />
                            Map View
                        </Button>
                    </div>
                </div>

                {/* Vendors Content */}
                {viewMode === 'list' ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {mockVendors.map((vendor) => (
                            <motion.div key={vendor.id} variants={itemVariants}>
                                <Card
                                    variant="elevated"
                                    interactive
                                    className="h-full overflow-hidden group flex flex-col"
                                >
                                    {/* Cover Image with Overlay */}
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={vendor.imageUrl}
                                            alt={vendor.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                                        {/* Rating Badge */}
                                        <div className="absolute top-4 right-4 glass-strong px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                                            <span className="font-bold text-sm">{vendor.rating}</span>
                                        </div>

                                        {/* Verified Badge with Animation */}
                                        {vendor.isVerified && (
                                            <motion.div
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 200,
                                                    damping: 15,
                                                    delay: 0.3
                                                }}
                                                className="absolute top-4 left-4"
                                            >
                                                <Badge variant="success" className="shadow-lg gap-1.5 px-3 py-1.5">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    <span>Verified</span>
                                                </Badge>
                                            </motion.div>
                                        )}

                                        {/* Vendor Name Overlay */}
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
                                                {vendor.name}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6 flex-grow flex flex-col">
                                        {/* Location */}
                                        <div className="flex items-start gap-2 text-muted-foreground text-sm mb-4">
                                            <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                            <span className="line-clamp-1">{vendor.address}</span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-grow">
                                            {vendor.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-border">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        {vendor.distance} km away
                                                    </span>
                                                </div>
                                                <a
                                                    href={`https://www.openstreetmap.org/?mlat=${vendor.latitude}&mlon=${vendor.longitude}&zoom=16`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-primary hover:underline flex items-center gap-1 pl-4"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Navigation className="h-3 w-3" />
                                                    Get Directions
                                                </a>
                                            </div>

                                            <Link to={`/vendor/${vendor.id}`}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                                                >
                                                    <span>Visit Store</span>
                                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Decorative Glow Effect */}
                                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
                                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-xl overflow-hidden border border-border shadow-xl h-[600px]"
                    >
                        {/* Transform mockVendors to match ProductMap expected format */}
                        <ProductMap
                            searchResults={mockVendors.map(v => ({
                                product: { id: 'vendor-loc', name: 'Store Location' }, // Dummy product for map compatibility
                                vendor: v,
                                price: 0,
                                stock: 'Open',
                                stockCount: 0
                            }))}
                        />
                    </motion.div>
                )}

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mt-16 text-center"
                >
                    <div className="glass-strong rounded-2xl p-8 max-w-2xl mx-auto">
                        <Store className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <h3 className="text-2xl font-bold mb-3">Become a Vendor</h3>
                        <p className="text-muted-foreground mb-6">
                            Join our growing community of trusted vendors and reach thousands of local customers.
                        </p>
                        <Button variant="fypPrimary" size="lg">
                            Start Selling Today
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div >
    );
};

export default VendorPage;
