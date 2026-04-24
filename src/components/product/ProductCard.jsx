import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Tag, MapPin, Star, ShoppingCart, Zap, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '../../utils/currency';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { PaymentModal } from '../common/PaymentModal';

export function ProductCard({ product, vendor, price, stock, stockCount }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const stockColor =
    stock === 'Available' ? 'text-fypGreen' :
      stock === 'Low' ? 'text-yellow-500' :
        'text-red-500';

  const stockBadge =
    stock === 'Available' ? 'bg-fypGreen/10 text-fypGreen border-fypGreen/20' :
      stock === 'Low' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
        'bg-red-500/10 text-red-500 border-red-500/20';

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    },
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsAdding(true);
    addToCart({ ...product, price, vendor });
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setShowPaymentModal(true);
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{
          y: -8,
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        className="h-full"
      >
        <Link to={`/product/${product.id}`} state={{ product, vendor, price, stock }}>
          <Card className="flex flex-col h-full overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 dark:bg-gray-800 border-2 hover:border-fypBlue/50 group relative">
            {/* Image Section */}
            <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
              <img
                src={product.imageUrl || 'https://placehold.co/400x300/e2e8f0/94a3b8?text=No+Image'}
                alt={product.name}
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/e2e8f0/94a3b8?text=No+Image'; }}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              />

              {/* Distance Badge */}
              <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md bg-black/40 text-white flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{vendor.distance} km</span>
              </div>

              {/* Verified Badge */}
              {vendor.isVerified && (
                <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold bg-fypGreen/90 text-white flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  <span>Verified</span>
                </div>
              )}

              {/* Stock Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-md ${stockBadge} border`}>
                  {stock} {stockCount !== undefined && `(${stockCount})`}
                </span>
              </div>

              {/* Quick Actions Overlay (Visible on Hover) */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                {/* Can add quick view here later */}
              </div>
            </div>

            <CardHeader className="p-4 flex-grow">
              <h3 className="text-lg font-poppins font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-fypBlue transition-colors">
                {product.name}
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                <span>{vendor.name}</span>
                {vendor.rating && (
                  <>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs">{vendor.rating}</span>
                    </div>
                  </>
                )}
              </div>
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.tags.slice(0, 2).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </CardHeader>

            <CardContent className="p-4 pt-0 mt-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-poppins font-bold text-fypBlue">
                    {formatPrice(price)}
                  </span>
                  {product.brand && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {product.brand}
                    </span>
                  )}
                </div>
                <div className="flex items-center text-fypGreen">
                  <Tag className="w-4 h-4 mr-1" />
                  <span className="text-sm font-semibold">{product.category}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-auto pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors flex items-center justify-center gap-1"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                >
                  {isAdding ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-3.5 w-3.5" />
                  )}
                  <span className="text-xs">Add</span>
                </Button>
                <Button
                  variant="fypPrimary"
                  size="sm"
                  className="w-full shadow-md flex items-center justify-center gap-1"
                  onClick={handleBuyNow}
                >
                  <Zap className="h-3.5 w-3.5 fill-current" />
                  <span className="text-xs">Buy</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        totalAmount={price}
        items={[{ ...product, price, vendor }]}
      />
    </>
  );
}
