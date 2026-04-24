// src/pages/vendor/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '../../components/ui/card';
import {
  Package, Store, TrendingUp, Star, Eye, ShoppingCart,
  AlertCircle, ArrowRight, CheckCircle, XCircle, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { formatPrice } from '../../utils/currency';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/inventory/dashboard-stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        toast.error('Could not load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = stats ? [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      sub: `${stats.availableProducts} available`,
      icon: Package,
      color: 'text-fypBlue',
      bgColor: 'bg-fypBlue/10',
    },
    {
      title: 'Low / Out of Stock',
      value: stats.lowStockProducts + stats.outOfStockProducts,
      sub: `${stats.outOfStockProducts} out of stock`,
      icon: AlertCircle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Store Rating',
      value: stats.rating ? `${stats.rating} ★` : 'N/A',
      sub: `${stats.reviewCount || 0} reviews`,
      icon: Star,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Verified Status',
      value: stats.isVerified ? 'Verified' : 'Pending',
      sub: stats.isVerified ? 'Trust badge active' : 'Awaiting review',
      icon: CheckCircle,
      color: stats.isVerified ? 'text-fypGreen' : 'text-gray-400',
      bgColor: stats.isVerified ? 'bg-fypGreen/10' : 'bg-gray-100 dark:bg-gray-700',
    },
  ] : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Welcome Header */}
      <div className="bg-gradient-primary rounded-2xl p-8 text-white">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-2">
            Welcome back, {user?.name || 'Vendor'}! 👋
          </h1>
          <p className="text-xl text-white/90">
            {stats?.hasStore
              ? `Managing ${stats.totalProducts} products in your store`
              : "Here's your vendor overview"}
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-32 animate-pulse dark:bg-gray-800 border-2">
              <div className="p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-2/3" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statCards.map((stat) => (
            <motion.div key={stat.title} variants={cardVariants}>
              <Card className="h-full hover:shadow-lg transition-all border-2 hover:border-fypBlue/50 dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{stat.sub}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* No store prompt */}
      {!loading && stats && !stats.hasStore && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-2 border-fypBlue/30 bg-fypBlue/5 dark:bg-fypBlue/10">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-full bg-fypBlue/20">
                <Store className="h-6 w-6 text-fypBlue" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Register Your Store
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set up your vendor profile to start selling products.
                </p>
              </div>
              <Link to="/vendor/profile">
                <Button variant="fypPrimary" size="sm">
                  Setup Store <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Low Stock Alert */}
      {!loading && stats?.lowStockItems?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-2 border-yellow-500/50 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-500/30">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-500/20">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <CardTitle className="text-base text-gray-900 dark:text-white">
                    ⚠️ Low / Out of Stock Alert ({stats.lowStockItems.length} items)
                  </CardTitle>
                  <CardDescription>These products need restocking soon.</CardDescription>
                </div>
                <Link to="/vendor/products" className="ml-auto">
                  <Button variant="outline" size="sm">
                    Manage Stock <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stats.lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.stockCount} units left</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                      item.stock === 'Out of Stock'
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {item.stock}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Grid: Quick Actions + Top Product */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card className="h-full dark:bg-gray-800 border-2">
            <CardHeader>
              <CardTitle className="text-2xl font-poppins font-bold text-gray-900 dark:text-white">
                Quick Actions
              </CardTitle>
              <CardDescription>Manage your store and products quickly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/vendor/products" className="block">
                <Button variant="fypPrimary" className="w-full justify-start" size="lg">
                  <Package className="mr-2 h-5 w-5" /> Manage Inventory
                </Button>
              </Link>
              <Link to="/vendor/profile" className="block">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Store className="mr-2 h-5 w-5" /> Update Store Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Product / Store Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
          <Card className="h-full bg-gradient-to-br from-fypBlue/10 to-fypGreen/10 dark:from-fypBlue/20 dark:to-fypGreen/20 border-2 border-fypBlue/20 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl font-poppins font-bold text-gray-900 dark:text-white">
                🏆 Store Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              ) : stats?.hasStore ? (
                <>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/60 dark:bg-gray-700/60">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Top Product</span>
                    <span className="font-bold text-gray-900 dark:text-white text-sm">
                      {stats.topProduct || 'No products yet'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/60 dark:bg-gray-700/60">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Available Stock</span>
                    <span className="font-bold text-fypGreen">{stats.availableProducts} products</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/60 dark:bg-gray-700/60">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Store Rating</span>
                    <span className="font-bold text-amber-500">{stats.rating ? `${stats.rating} ★` : 'Not rated'}</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Register your store to see your summary stats here.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
