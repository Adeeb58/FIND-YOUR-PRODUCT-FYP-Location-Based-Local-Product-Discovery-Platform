// src/pages/VendorDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, CheckCircle2, XCircle, ShoppingBag, Clock, Star, ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { getVendorById, mockProducts } from '../utils/mockData';
import { ProductCard } from '../components/product/ProductCard';
import { ProductMap } from '../components/maps/ProductMap';
import { Loader2 } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

const VendorDetailsPage = () => {
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState(null);
  const [productsSold, setProductsSold] = useState([]);
  const [loading, setLoading] = useState(true);
  const { location } = useLocation();

  useEffect(() => {
    setLoading(true);
    const foundVendor = getVendorById(vendorId);

    if (foundVendor) {
      setVendor(foundVendor);
      const products = foundVendor.products.map(vp => {
        const productData = mockProducts.find(p => p.id === vp.productId);
        return productData ? {
          ...productData,
          price: vp.price,
          stock: vp.stock,
          stockCount: vp.stockCount
        } : null;
      }).filter(Boolean);
      setProductsSold(products);
    } else {
      setVendor(null);
    }
    setLoading(false);
  }, [vendorId]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-8">
        <Loader2 className="h-10 w-10 animate-spin text-fypBlue" />
        <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Loading vendor details...</span>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center p-8 text-center">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-poppins font-bold text-gray-900 dark:text-white">Vendor Not Found</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">The vendor you are looking for does not exist or has been removed.</p>
        <Link to="/" className="mt-6">
          <Button variant="fypPrimary">Go to Homepage</Button>
        </Link>
      </div>
    );
  }

  const mapResults = [{
    product: { id: 'dummy', name: vendor.name, imageUrl: '', description: '' },
    vendor: {
      id: vendor.id,
      name: vendor.name,
      address: vendor.address,
      latitude: vendor.latitude,
      longitude: vendor.longitude,
      distance: vendor.distance,
    },
    price: 0,
    stock: 'Available'
  }];

  const getDirections = () => {
    if (location && location.lat && location.lng) {
      // OpenStreetMap OSRM routing — 100% free, no API key needed
      window.open(`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${location.lat},${location.lng};${vendor.latitude},${vendor.longitude}`, '_blank');
    } else {
      // Fallback: show vendor pin on OpenStreetMap
      window.open(`https://www.openstreetmap.org/?mlat=${vendor.latitude}&mlon=${vendor.longitude}&zoom=16`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header with Gradient */}
      <div className="bg-gradient-primary text-white py-12">
        <div className="container mx-auto px-4">
          <Link to="/search">
            <Button variant="ghost" className="mb-4 text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl md:text-5xl font-poppins font-bold">{vendor.name}</h1>
                {vendor.isVerified && (
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{vendor.address}</span>
                  {vendor.distance && <span className="text-sm">({vendor.distance} km away)</span>}
                </div>
                {vendor.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-current text-yellow-300" />
                    <span className="font-semibold">{vendor.rating}</span>
                    <span className="text-sm">({vendor.reviewCount} reviews)</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={getDirections}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
              {vendor.contactPhone && (
                <a href={`tel:${vendor.contactPhone}`}>
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </a>
              )}
              {vendor.contactEmail && (
                <a href={`mailto:${vendor.contactEmail}`}>
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* About Section */}
        <Card className="p-6 dark:bg-gray-800 shadow-xl border-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-poppins font-bold text-gray-900 dark:text-white mb-4">
                About {vendor.name}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {vendor.description || 'A trusted local vendor providing quality products to the community. We pride ourselves on fresh, locally-sourced items and excellent customer service.'}
              </p>

              <div className="space-y-3">
                {vendor.openingHours && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-fypBlue mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Opening Hours</p>
                      <p className="text-gray-600 dark:text-gray-400">{vendor.openingHours}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  {vendor.isVerified ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-fypGreen" />
                      <span className="font-semibold text-fypGreen">Verified Vendor</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-yellow-500" />
                      <span className="font-semibold text-yellow-500">Pending Verification</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-poppins font-bold text-gray-900 dark:text-white mb-4">
                Location
              </h2>
              <div className="h-64 w-full rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                <ProductMap searchResults={mapResults} className="h-full" />
              </div>
            </div>
          </div>
        </Card>

        {/* Products Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-poppins font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-fypBlue" />
              Products ({productsSold.length})
            </h2>
          </div>

          {productsSold.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {productsSold.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  vendor={vendor}
                  price={product.price}
                  stock={product.stock}
                  stockCount={product.stockCount}
                />
              ))}
            </motion.div>
          ) : (
            <Card className="p-12 text-center dark:bg-gray-800">
              <CardContent>
                <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  This vendor currently has no products listed.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDetailsPage;
