// src/pages/CategoriesPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockCategories } from '../utils/mockData';
import { Card } from '../components/ui/card';
import {
    ShoppingBag,
    Smartphone,
    Home,
    Shirt,
    Book,
    Utensils,
    Dumbbell,
    Palette,
    Sparkles,
    ChevronRight,
    Milk,
    Croissant,
    Apple,
    Coffee,
    Package,
    Fish,
    Snowflake,
    Cookie,
    Flame,
    Drumstick
} from 'lucide-react';

const categoryIcons = {
    'Electronics': Smartphone,
    'Home & Garden': Home,
    'Fashion': Shirt,
    'Books': Book,
    'Food & Beverages': Utensils,
    'Sports & Outdoors': Dumbbell,
    'Arts & Crafts': Palette,
    'Beauty & Personal Care': Sparkles,
    'Dairy': Milk,
    'Bakery': Croissant,
    'Produce': Apple,
    'Beverages': Coffee,
    'Pantry': Package,
    'Meat': Drumstick,
    'Seafood': Fish,
    'Frozen': Snowflake,
    'Snacks': Cookie,
    'Spices': Flame
};

const categoryColors = {
    'Electronics': 'from-blue-500 to-cyan-500',
    'Home & Garden': 'from-green-500 to-emerald-500',
    'Fashion': 'from-purple-500 to-pink-500',
    'Books': 'from-amber-500 to-orange-500',
    'Food & Beverages': 'from-red-500 to-rose-500',
    'Sports & Outdoors': 'from-teal-500 to-cyan-500',
    'Arts & Crafts': 'from-violet-500 to-purple-500',
    'Beauty & Personal Care': 'from-pink-500 to-rose-500',
    'Dairy': 'from-sky-400 to-blue-500',
    'Bakery': 'from-amber-400 to-orange-500',
    'Produce': 'from-green-400 to-emerald-600',
    'Beverages': 'from-orange-400 to-red-500',
    'Pantry': 'from-slate-400 to-slate-600',
    'Meat': 'from-red-500 to-rose-700',
    'Seafood': 'from-cyan-400 to-blue-600',
    'Frozen': 'from-blue-300 to-cyan-400',
    'Snacks': 'from-yellow-400 to-orange-500',
    'Spices': 'from-red-600 to-orange-600'
};

const CategoriesPage = () => {
    const categories = mockCategories.filter(c => c !== 'All');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
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
                        Browse Categories
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Explore our curated collection of product categories. Find exactly what you need from trusted local vendors.
                    </p>
                </motion.div>

                {/* Categories Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {categories.map((category, index) => {
                        const Icon = categoryIcons[category] || ShoppingBag;
                        const gradientClass = categoryColors[category] || 'from-primary to-secondary';

                        return (
                            <motion.div key={index} variants={itemVariants}>
                                <Link to={`/search?category=${category}`} className="block group">
                                    <Card
                                        variant="elevated"
                                        className="h-64 relative overflow-hidden cursor-pointer"
                                    >
                                        {/* Gradient Background with Animation */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />

                                        {/* Animated Mesh Pattern */}
                                        <div className="absolute inset-0 bg-gradient-mesh opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Content */}
                                        <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                                            {/* Icon Container with Glow */}
                                            <motion.div
                                                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110`}
                                                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <Icon className="h-10 w-10 text-white" />
                                            </motion.div>

                                            {/* Category Name */}
                                            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                                                {category}
                                            </h3>

                                            {/* Browse Link */}
                                            <div className="flex items-center text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">
                                                <span className="font-medium">Explore Products</span>
                                                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                                            </div>

                                            {/* Decorative Elements */}
                                            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-2xl group-hover:scale-150 transition-transform duration-500" />
                                            <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full bg-gradient-to-br from-secondary/10 to-accent/10 blur-2xl group-hover:scale-150 transition-transform duration-500" />
                                        </div>

                                        {/* Border Glow on Hover */}
                                        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/20 transition-colors duration-300" />
                                    </Card>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mt-16 text-center"
                >
                    <p className="text-muted-foreground mb-4">
                        Can't find what you're looking for?
                    </p>
                    <Link
                        to="/search"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                        <span>Try our advanced search</span>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default CategoriesPage;
