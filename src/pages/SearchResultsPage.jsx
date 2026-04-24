// src/pages/SearchResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/common/SearchBar';
import { ProductCard } from '../components/product/ProductCard';
import { ProductMap } from '../components/maps/ProductMap';
import { useLocation } from '../context/LocationContext';
import axios from '../api/axios';
import { List, Map, Filter, Loader2, TrendingUp, Search, MapPin, Wifi, WifiOff } from 'lucide-react';
import { formatPrice } from '../utils/currency';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVendorStatsOpen, setIsVendorStatsOpen] = useState(false);
  const [usingLocation, setUsingLocation] = useState(false);
  const [radiusFilterEnabled, setRadiusFilterEnabled] = useState(true);
  const { location } = useLocation(); // Get real GPS from LocationContext
  const viewParam = searchParams.get('view') || 'list';
  const sortParam = searchParams.get('sort') || 'distance';

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'All';
  const shop = searchParams.get('shop') || 'All';

  const [view, setView] = useState(viewParam);

  useEffect(() => {
    setView(viewParam);
  }, [viewParam]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Build API query params
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (category && category !== 'All') params.set('category', category);
        if (shop && shop !== 'All') params.set('shop', shop);
        params.set('sort', sortParam);

        // ✅ Pass real GPS coordinates to backend for $near geospatial query
        const hasGPS = location?.lat && location?.lng;
        if (hasGPS) {
          params.set('lat', location.lat);
          params.set('lng', location.lng);
          // If radius filter is enabled, cap at 15km. Otherwise, huge radius to show all.
          params.set('radius', radiusFilterEnabled ? '15' : '10000'); 
          setUsingLocation(true);
        } else {
          setUsingLocation(false);
        }

        const { data } = await axios.get(`/search?${params.toString()}`);
        setResults(data.results || []);
      } catch (error) {
        console.error('Search failed:', error);
        toast.error('Search failed. Please try again.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, category, shop, sortParam, location?.lat, location?.lng, radiusFilterEnabled]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-primary text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-6 text-center">
              Search Results
            </h1>
            <div className="max-w-4xl mx-auto">
              <SearchBar initialQuery={query} initialCategory={category} initialBrand={shop} />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Results Summary */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-4 flex-wrap">
              <p className="text-gray-700 dark:text-gray-300">
                Found <span className="font-bold text-fypBlue">{results.length}</span> result{results.length !== 1 ? 's' : ''}
              </p>
              {query && (
                <span className="px-3 py-1 rounded-full bg-fypBlue/10 text-fypBlue text-sm font-medium">
                  "{query}"
                </span>
              )}
              {usingLocation && radiusFilterEnabled ? (
                <button 
                  onClick={() => setRadiusFilterEnabled(false)}
                  className="px-3 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200 hover:line-through dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 text-xs font-medium flex items-center gap-1 transition-all"
                  title="Click to remove 15km limit"
                >
                  <MapPin className="h-3 w-3" /> Near you (15km) ✕
                </button>
              ) : usingLocation && !radiusFilterEnabled ? (
                <button 
                  onClick={() => setRadiusFilterEnabled(true)}
                  className="px-3 py-1 rounded-full bg-fypBlue/10 text-fypBlue hover:bg-fypBlue/20 text-xs font-medium flex items-center gap-1 transition-all"
                  title="Click to restrict search to 15km"
                >
                  <MapPin className="h-3 w-3" /> Global (Sorted by Distance) +
                </button>
              ) : (
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 text-xs font-medium flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> All locations
                </span>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border-2 border-gray-200 dark:border-gray-700">
              <Button
                variant={view === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
                className={view === 'list' ? 'bg-gradient-primary text-white' : ''}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
              <Button
                variant={view === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('map')}
                className={view === 'map' ? 'bg-gradient-primary text-white' : ''}
              >
                <Map className="h-4 w-4 mr-2" />
                Map
              </Button>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-fypBlue mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Searching for products...</p>
          </div>
        ) : results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Card className="max-w-md mx-auto p-8 dark:bg-gray-800">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-2xl font-poppins font-bold text-gray-900 dark:text-white">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <div className="flex flex-col gap-3 mt-4">
                  {usingLocation && radiusFilterEnabled && (
                    <Button 
                      variant="outline" 
                      className="w-full border-fypBlue text-fypBlue hover:bg-fypBlue/10"
                      onClick={() => setRadiusFilterEnabled(false)}
                    >
                      Search Globally (Remove 15km Limit)
                    </Button>
                  )}
                  <Button variant="fypPrimary" onClick={() => window.history.back()} className="w-full">
                    Go Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {view === 'list' ? (
              <motion.div
                key="list"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {results.map((result, index) => (
                  <ProductCard
                    key={`${result.product.id}-${result.vendor.id}-${index}`}
                    product={result.product}
                    vendor={result.vendor}
                    price={result.price}
                    stock={result.stock}
                    stockCount={result.stockCount}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[600px] w-full rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg"
              >
                <ProductMap searchResults={results} />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Quick Stats & Interactive Cards */}
        {!loading && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Total Results - Scroll to Top */}
            <Card
              className="p-6 dark:bg-gray-800 cursor-pointer hover:shadow-lg transition-all hover:border-fypBlue/50 group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-fypBlue transition-colors">Total Results</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{results.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Click to view all</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-fypBlue group-hover:scale-110 transition-transform" />
                </div>
              </CardContent>
            </Card>

            {/* Vendors - Open Modal */}
            <Card
              className="p-6 dark:bg-gray-800 cursor-pointer hover:shadow-lg transition-all hover:border-fypGreen/50 group"
              onClick={() => setIsVendorStatsOpen(true)}
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-fypGreen transition-colors">Participating Vendors</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {new Set(results.map(r => r.vendor.id)).size}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Click to view vendors</p>
                  </div>
                  <Map className="h-8 w-8 text-fypGreen group-hover:scale-110 transition-transform" />
                </div>
              </CardContent>
            </Card>

            {/* Price Range - Toggle Sort */}
            <Card
              className="p-6 dark:bg-gray-800 cursor-pointer hover:shadow-lg transition-all hover:border-amber-500/50 group"
              onClick={() => {
                // Cycle sort: distance -> price_asc -> price_desc -> distance
                const newSort = sortParam === 'distance' ? 'price_asc' : sortParam === 'price_asc' ? 'price_desc' : 'distance';
                const params = new URLSearchParams(searchParams);
                params.set('sort', newSort);
                setSearchParams(params);
              }}
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-amber-500 transition-colors">Price Range</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(Math.min(...results.map(r => r.price)))} - {formatPrice(Math.max(...results.map(r => r.price)))}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {sortParam === 'price_asc' ? 'Sorted: Low to High' : sortParam === 'price_desc' ? 'Sorted: High to Low' : 'Click to sort by price'}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-amber-500 group-hover:scale-110 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Vendors List Modal */}
        <Dialog open={isVendorStatsOpen} onOpenChange={setIsVendorStatsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Vendors with matching products</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {Array.from(new Set(results.map(r => r.vendor.id))).map(vendorId => {
                const vendorResult = results.find(r => r.vendor.id === vendorId);
                const vendor = vendorResult?.vendor;
                if (!vendor) return null;

                // Count products from this vendor in results
                const productCount = results.filter(r => r.vendor.id === vendorId).length;

                return (
                  <Link key={vendorId} to={`/vendor/${vendorId}`} className="block">
                    <Card className="hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4 p-4">
                        <img src={vendor.imageUrl} alt={vendor.name} className="w-16 h-16 rounded-md object-cover" />
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{vendor.name}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {vendor.distance} km • {vendor.rating} ★
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold block">{productCount}</span>
                          <span className="text-xs text-muted-foreground">Products Found</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SearchResultsPage;
