import React from 'react';
import { mockVendors } from '../utils/mockData';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { CheckCircle2, Star, MapPin, ArrowRight, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const VerifiedVendorsPage = () => {
    const verifiedVendors = mockVendors.filter(v => v.isVerified);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <Badge variant="success" size="lg" className="mb-6 px-4 py-2 text-base">
                        <Shield className="mr-2 h-5 w-5" />
                        Official Verified Partners
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Shop with <span className="text-gradient-primary">Confidence</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-xl">
                        Our verified partners are vetted for authenticity, quality, and service excellence.
                    </p>
                </motion.div>

                {/* Vendors List */}
                <div className="space-y-8 max-w-5xl mx-auto">
                    {verifiedVendors.map((vendor, idx) => (
                        <motion.div
                            key={vendor.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-emerald-500">
                                <div className="flex flex-col md:flex-row">
                                    {/* Image Section */}
                                    <div className="md:w-1/3 relative h-64 md:h-auto">
                                        <img
                                            src={vendor.imageUrl}
                                            alt={vendor.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-white/90 text-emerald-700 backdrop-blur-md shadow-sm hover:bg-white">
                                                <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-500" />
                                                Verified & Trusted
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="md:w-2/3 p-8 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                                        {vendor.name}
                                                        <Shield className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                                                    </h3>
                                                    <div className="flex items-center text-muted-foreground mb-4">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        {vendor.address}
                                                        <span className="mx-2">•</span>
                                                        {vendor.distance} km away
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center justify-end gap-1 mb-1">
                                                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                                        <span className="text-xl font-bold">{vendor.rating}</span>
                                                        <span className="text-muted-foreground text-sm">/ 5.0</span>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground underline decoration-dotted cursor-pointer">
                                                        {vendor.reviewCount} verified reviews
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                                {vendor.description}
                                            </p>

                                            {/* Verification Details */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-muted/30 p-4 rounded-lg">
                                                <div className="text-center">
                                                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Response Time</div>
                                                    <div className="font-semibold text-emerald-600">~15 Mins</div>
                                                </div>
                                                <div className="text-center border-l dark:border-gray-700">
                                                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Since</div>
                                                    <div className="font-semibold">2023</div>
                                                </div>
                                                <div className="text-center border-l dark:border-gray-700">
                                                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Orders</div>
                                                    <div className="font-semibold">1.2k+</div>
                                                </div>
                                                <div className="text-center border-l dark:border-gray-700">
                                                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">License</div>
                                                    <div className="font-semibold text-emerald-600 flex items-center justify-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3" /> Valid
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                                <span className="font-semibold text-foreground">Open:</span> {vendor.openingHours}
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
                                            <Button variant="outline" onClick={() => navigate(`/vendor/${vendor.id}`)}>
                                                View Products
                                            </Button>
                                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                                Contact Vendor <ArrowRight className="ml-2 w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Footer */}
                <div className="mt-20 text-center max-w-3xl mx-auto bg-muted/20 p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold mb-4">Want to become a Verified Partner?</h3>
                    <p className="text-muted-foreground mb-6">
                        Join our network of trusted local businesses. We verify identity, location, and business licenses to ensure the highest quality for our customers.
                    </p>
                    <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
                        Apply for Verification
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default VerifiedVendorsPage;
