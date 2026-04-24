import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchProductsAndVendors } from '../utils/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Search, TrendingDown, ArrowRight, MapPin, Loader2, Trophy, ShoppingBag, Package } from 'lucide-react';
import { formatPrice } from '../utils/currency';
import { motion, AnimatePresence } from 'framer-motion';

const PriceComparisonPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [inputValue, setInputValue] = useState(query);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bestDeal, setBestDeal] = useState(null);

    useEffect(() => {
        if (query) {
            setLoading(true);
            setTimeout(() => {
                const searchResults = searchProductsAndVendors(query, 'All', 'All');
                // Sort by price ascending
                searchResults.sort((a, b) => a.price - b.price);
                setResults(searchResults);

                if (searchResults.length > 0) {
                    setBestDeal(searchResults[0]);
                } else {
                    setBestDeal(null);
                }
                setLoading(false);
            }, 600);
        } else {
            setResults([]);
            setBestDeal(null);
        }
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            setSearchParams({ q: inputValue });
        }
    };

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Badge variant="outline" className="mb-4 border-emerald-500/50 text-emerald-600 dark:text-emerald-400">
                            <TrendingDown className="mr-2 h-4 w-4" /> Smart Saver
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Compare & <span className="text-gradient-secondary">Save</span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Find the absolute lowest price for your favorite products across all local vendors instantly.
                        </p>
                    </motion.div>

                    {/* Search Input */}
                    <form onSubmit={handleSearch} className="mt-8 relative max-w-2xl mx-auto">
                        <Input
                            type="text"
                            placeholder="What are you looking for? (e.g., 'Milk', 'Bread')"
                            className="h-14 pl-12 pr-32 text-lg shadow-lg border-2 focus-visible:ring-emerald-500"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                        <Button
                            type="submit"
                            className="absolute right-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            Compare
                        </Button>
                    </form>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                    </div>
                )}

                {/* Results */}
                {!loading && query && results.length > 0 && (
                    <div className="space-y-8">
                        {/* Best Deal Highlight */}
                        {bestDeal && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Card className="border-2 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-4">
                                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-3 py-1">
                                            <Trophy className="w-3 h-3 mr-1" /> Best Deal
                                        </Badge>
                                    </div>
                                    <CardContent className="p-0 flex flex-col md:flex-row">
                                        <div className="w-full md:w-1/3 h-64 md:h-auto relative">
                                            <img
                                                src={bestDeal.product.imageUrl || 'https://via.placeholder.com/300'}
                                                alt={bestDeal.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                                            <h2 className="text-2xl font-bold mb-2">{bestDeal.product.name}</h2>
                                            <p className="text-muted-foreground mb-4">Found at <span className="font-semibold text-foreground">{bestDeal.vendor.name}</span></p>

                                            <div className="flex items-baseline gap-4 mb-6">
                                                <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                                                    {formatPrice(bestDeal.price)}
                                                </span>
                                                {results.length > 1 && (
                                                    <span className="text-sm text-muted-foreground">
                                                        Save up to {formatPrice(results[results.length - 1].price - bestDeal.price)} compared to other vendors!
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex gap-4">
                                                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto">
                                                    Order Now
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" asChild>
                                                    <Link to={`/vendor/${bestDeal.vendor.id}`}>Visit Store</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Comparison Table */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>All Prices for "{query}"</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Product</TableHead>
                                                <TableHead>Vendor</TableHead>
                                                <TableHead>Distance</TableHead>
                                                <TableHead>Stock</TableHead>
                                                <TableHead className="text-right">Price</TableHead>
                                                <TableHead></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {results.map((item, idx) => (
                                                <TableRow key={`${item.product.id}-${item.vendor.id}`} className={idx === 0 ? "bg-emerald-50/30 dark:bg-emerald-900/10 font-medium" : ""}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <img src={item.product.imageUrl} alt="" className="w-10 h-10 rounded-md object-cover" />
                                                            <span>{item.product.name}</span>
                                                            {idx === 0 && <Badge variant="secondary" className="ml-2 text-[10px] h-5">Lowest</Badge>}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">{item.vendor.name}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center text-muted-foreground text-sm">
                                                            <MapPin className="h-3 w-3 mr-1" />
                                                            {item.vendor.distance} km
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.stock === 'Available' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                            item.stock === 'Low' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                            }`}>
                                                            {item.stock}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right text-lg">
                                                        {formatPrice(item.price)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link to={`/product/${item.product.id}`}>View</Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && query && results.length === 0 && (
                    <div className="text-center py-20 bg-muted/30 rounded-lg">
                        <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">No products found matching "{query}"</h3>
                        <p className="text-muted-foreground">Try searching for a different product like "Milk", "Bread", or "Eggs"</p>
                    </div>
                )}

                {/* Initial State (Product Directory) */}
                {!query && !loading && (
                    <div className="space-y-12 mt-12">
                        {/* Daily Essentials */}
                        <section>
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <ShoppingBag className="text-emerald-500" /> Daily Essentials
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { name: 'Organic Fresh Milk', label: 'Milk', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=300' },
                                    { name: 'Artisan Sourdough Bread', label: 'Bread', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300' },
                                    { name: 'Free Range Eggs (Dozen)', label: 'Eggs', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=300' },
                                    { name: 'Greek Yogurt (500g)', label: 'Yogurt', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291774?q=80&w=300' }
                                ].map(item => (
                                    <Card
                                        key={item.name}
                                        className="cursor-pointer hover:border-emerald-500 hover:shadow-lg transition-all group overflow-hidden"
                                        onClick={() => {
                                            setInputValue(item.name);
                                            setSearchParams({ q: item.name });
                                        }}
                                    >
                                        <div className="h-32 overflow-hidden">
                                            <img src={item.image} alt={item.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <CardContent className="p-4 text-center">
                                            <span className="font-semibold group-hover:text-emerald-600 transition-colors">{item.label}</span>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        {/* Pantry Staples */}
                        <section>
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Package className="text-amber-500" /> Pantry Staples
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { name: 'Basmati Rice (5kg)', label: 'Rice', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=300' },
                                    { name: 'Premium Arabica Coffee Beans', label: 'Coffee', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=300' },
                                    { name: 'Raw Organic Honey', label: 'Honey', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=300' },
                                    { name: 'Extra Virgin Olive Oil', label: 'Olive Oil', image: 'https://images.unsplash.com/photo-1474979266404-7ea07b5e5cfe?q=80&w=300' }
                                ].map(item => (
                                    <Card
                                        key={item.name}
                                        className="cursor-pointer hover:border-amber-500 hover:shadow-lg transition-all group overflow-hidden"
                                        onClick={() => {
                                            setInputValue(item.name);
                                            setSearchParams({ q: item.name });
                                        }}
                                    >
                                        <div className="h-32 overflow-hidden">
                                            <img src={item.image} alt={item.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <CardContent className="p-4 text-center">
                                            <span className="font-semibold group-hover:text-amber-600 transition-colors">{item.label}</span>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        {/* Fresh Produce */}
                        <section>
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <MapPin className="text-green-500" /> Fresh Produce
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { name: 'Fresh Hass Avocados (Pack of 3)', label: 'Avocados', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=300' },
                                    { name: 'Fresh Strawberries (500g)', label: 'Strawberries', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=300' },
                                    { name: 'Fresh Tomatoes (1kg)', label: 'Tomatoes', image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?q=80&w=300' },
                                    { name: 'Fresh Spinach (250g)', label: 'Spinach', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=300' }
                                ].map(item => (
                                    <Card
                                        key={item.name}
                                        className="cursor-pointer hover:border-green-500 hover:shadow-lg transition-all group overflow-hidden"
                                        onClick={() => {
                                            setInputValue(item.name);
                                            setSearchParams({ q: item.name });
                                        }}
                                    >
                                        <div className="h-32 overflow-hidden">
                                            <img src={item.image} alt={item.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <CardContent className="p-4 text-center">
                                            <span className="font-semibold group-hover:text-green-600 transition-colors">{item.label}</span>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PriceComparisonPage;
