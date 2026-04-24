// src/pages/ProductDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag, MapPin, ExternalLink, Phone, Mail, CheckCircle2, XCircle, Loader2, Star, TrendingUp, TrendingDown, ArrowLeft, ShoppingCart, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Separator } from '../components/ui/separator';
import { ProductMap } from '../components/maps/ProductMap';
import { formatPrice } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PaymentModal } from '../components/common/PaymentModal';
import axios from '../api/axios';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [productDetails, setProductDetails] = useState(location.state?.product || null);
  const [sellingVendors, setSellingVendors] = useState([]);
  const [lowestPrice, setLowestPrice] = useState(null);
  const [highestPrice, setHighestPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cart & Payment Integration
  const { addToCart } = useCart();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedVendorForPayment, setSelectedVendorForPayment] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        // We attempt to get the user's location to correctly sort the distance of the vendors
        let lat = '';
        let lng = '';
        
        const locString = localStorage.getItem('userLocation');
        if (locString) {
          const loc = JSON.parse(locString);
          lat = loc.lat;
          lng = loc.lon || loc.lng;
        }

        const { data } = await axios.get(`/products/${productId}`, {
            params: { lat, lng }
        });

        if (data.product) {
          setProductDetails(data.product);
          // Set vendors mapping them to the format expected by the UI
          const vendorsFormatted = (data.vendors || []).map(v => ({
              id: v.vendorId, // Ensure it's passed as id for UI interactions
              name: v.vendorName,
              address: v.vendorAddress,
              latitude: v.latitude,
              longitude: v.longitude,
              distance: v.distance,
              rating: v.vendorRating,
              isVerified: v.isVerified,
              productPrice: v.price,
              productStock: v.stock,
              productStockCount: v.stockCount
          }));
          setSellingVendors(vendorsFormatted);
          setLowestPrice(data.lowestPrice);
          setHighestPrice(data.highestPrice);
        } else {
          setProductDetails(null);
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        setProductDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-8">
        <Loader2 className="h-10 w-10 animate-spin text-fypBlue" />
        <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Loading product details...</span>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center p-8 text-center">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-poppins font-bold text-gray-900 dark:text-white">Product Not Found</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">The product you are looking for does not exist or has been removed.</p>
        <Link to="/" className="mt-6">
          <Button variant="fypPrimary">Go to Homepage</Button>
        </Link>
      </div>
    );
  }

  // Map markers for all selling vendors
  const mapResults = sellingVendors.map(vendor => ({
    product: productDetails,
    vendor: {
      id: vendor.id,
      name: vendor.name,
      address: vendor.address,
      latitude: vendor.latitude,
      longitude: vendor.longitude,
      distance: vendor.distance,
    },
    price: vendor.productPrice,
    stock: vendor.productStock,
  }));

  const handleAddToCart = (vendor) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart({ ...productDetails, price: vendor.productPrice, vendor });
  };

  const handleBuyNow = (vendor) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedVendorForPayment(vendor);
    setPaymentModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-10"
      >
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="inline-block">
          <Button variant="ghost" className="hover:bg-transparent hover:text-primary pl-0 text-lg">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image and Basic Info */}
          <div className="space-y-8">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-white dark:bg-gray-800 shadow-2xl border border-white/20">
                <img
                  src={productDetails.imageUrl || 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Product+Image'}
                  alt={productDetails.name}
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Product+Image'; }}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                    {productDetails.category}
                  </span>
                  {productDetails.tags?.includes('organic') && (
                    <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Organic
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                  {productDetails.name}
                </h1>
                {productDetails.brand && (
                  <p className="text-xl text-gray-500 dark:text-gray-400 mt-2 font-medium">
                    by {productDetails.brand}
                  </p>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">About this item</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {productDetails.description || 'No description available for this product.'}
                </p>
              </div>

              {productDetails.tags && productDetails.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {productDetails.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-gray-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Vendors Selling This Product & Price Comparison */}
          <div className="space-y-8">
            <Card className="p-8 dark:bg-gray-800 shadow-xl border-0 ring-1 ring-gray-200 dark:ring-gray-700 bg-white/50 backdrop-blur-sm">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                  Available Offers
                </CardTitle>
              </CardHeader>

              {sellingVendors.length > 0 ? (
                <>
                  {/* Price Range Info */}
                  <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium mb-1">Best Price</p>
                        <p className="text-4xl font-bold text-green-400">{formatPrice(lowestPrice)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm font-medium mb-1">Highest</p>
                        <p className="text-2xl font-semibold text-white/80">{formatPrice(highestPrice)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {sellingVendors.map((vendor, idx) => {
                      const isLowestPrice = vendor.productPrice === lowestPrice;
                      return (
                        <motion.div
                          key={vendor.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <div className={`group p-5 rounded-xl border transition-all duration-300 ${isLowestPrice
                            ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30 hover:shadow-md'
                            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md'
                            }`}>
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <Link to={`/vendor/${vendor.id}`} className="flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {vendor.name}
                                  </h4>
                                  <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {vendor.distance ? `${vendor.distance} km` : 'N/A'}
                                  </span>
                                  {vendor.rating && (
                                    <span className="flex items-center gap-1 text-amber-500 font-medium">
                                      <Star className="h-3 w-3 fill-current" /> {vendor.rating}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white block">
                                  {formatPrice(vendor.productPrice)}
                                </span>
                                {isLowestPrice && (
                                  <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                                    Best Deal
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 gap-3">
                              <span className={`text-sm font-medium ${vendor.productStock === 'Available' ? 'text-green-600' : 
                                vendor.productStock === 'Out of Stock' || vendor.productStockCount === 0 ? 'text-red-500' : 'text-yellow-600'
                                }`}>
                                {vendor.productStockCount === 0 ? 'Out of Stock' : vendor.productStock}
                                {vendor.productStockCount > 0 && <span className="text-gray-400 font-normal ml-1">({vendor.productStockCount} left)</span>}
                              </span>

                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAddToCart(vendor)}
                                  disabled={vendor.productStockCount === 0}
                                >
                                  <ShoppingCart className="h-4 w-4 mr-1" />
                                  Add
                                </Button>
                                <Button
                                  size="sm"
                                  variant={isLowestPrice ? "fypPrimary" : "secondary"}
                                  onClick={() => handleBuyNow(vendor)}
                                  disabled={vendor.productStockCount === 0}
                                >
                                  <Zap className="h-4 w-4 mr-1 fill-current" />
                                  Buy Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No vendors available</h3>
                  <p className="text-gray-500">Check back later for stock updates.</p>
                </div>
              )}
            </Card>

            {/* Map View */}
            {sellingVendors.length > 0 && mapResults.some(m => m.vendor.latitude) && (
              <Card className="p-1 overflow-hidden border-0 shadow-xl ring-1 ring-gray-200 dark:ring-gray-700">
                <div className="h-[400px] w-full rounded-lg overflow-hidden">
                  <ProductMap searchResults={mapResults} />
                </div>
              </Card>
            )}
          </div>
        </div>
      </motion.div>

      {/* Payment Modal */}
      {selectedVendorForPayment && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          totalAmount={selectedVendorForPayment.productPrice}
          items={[{ ...productDetails, price: selectedVendorForPayment.productPrice, vendor: selectedVendorForPayment }]}
        />
      )}
    </div>
  );
};

export default ProductDetailsPage;
