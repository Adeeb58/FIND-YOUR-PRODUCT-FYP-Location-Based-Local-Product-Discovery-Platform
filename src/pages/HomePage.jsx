// src/pages/HomePage.jsx - Mind-Blowing Premium Homepage
import React, { useEffect, useState } from 'react';
import { SearchBar } from '../components/common/SearchBar';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  MapPin, TrendingUp, Store, Star, ArrowRight, Sparkles,
  ShoppingBag, Shield, Truck, Headphones, Zap, Heart,
  CheckCircle2, Users, Package, Clock
} from 'lucide-react';
import { mockCategories, mockVendors, mockProducts, getVendorsForProduct } from '../utils/mockData';
import { ProductCard } from '../components/product/ProductCard';

const HomePage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const featuredVendors = mockVendors.filter(v => v.featured).slice(0, 3);
  const popularCategories = mockCategories.filter(c => c !== 'All').slice(0, 8);
  const featuredProducts = mockProducts.slice(0, 6);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* HERO SECTION - Absolutely Stunning */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient-xy">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>

        {/* Mesh Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />

        {/* Floating Orbs with Mouse Parallax */}
        <motion.div
          style={{
            x: mousePosition.x * 2,
            y: mousePosition.y * 2
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl opacity-30 animate-pulse-slow"
        />
        <motion.div
          style={{
            x: mousePosition.x * -1.5,
            y: mousePosition.y * -1.5
          }}
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-3xl opacity-30 animate-pulse-slow"
        />
        <motion.div
          style={{
            x: mousePosition.x * 1,
            y: mousePosition.y * 1
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-3xl opacity-20 animate-pulse-slow"
        />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />

        {/* Main Content */}
        <div className="container mx-auto px-4 relative z-10 pt-32 pb-20">
          <motion.div
            style={{ opacity, scale }}
            className="max-w-6xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2
              }}
              className="inline-flex items-center gap-2 glass-strong px-6 py-3 rounded-full mb-8 shadow-2xl"
            >
              <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold tracking-wide uppercase text-foreground">
                🚀 The Future of Local Shopping
              </span>
              <Badge variant="success" size="sm" className="ml-2">New</Badge>
            </motion.div>

            {/* Main Headline - Absolutely Massive */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold mb-8 leading-none tracking-tighter"
            >
              <span className="block text-white drop-shadow-2xl">
                Discover
              </span>
              <span className="block bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl animate-shimmer bg-[length:200%_100%]">
                Local Magic
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-3xl text-black mb-12 max-w-4xl mx-auto leading-relaxed font-light drop-shadow-lg"
            >
              Connect with <span className="font-bold text-yellow-600">premium local vendors</span>,
              compare prices instantly, and experience shopping reimagined.
            </motion.p>

            {/* Search Bar - Premium Glass Design */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="w-full max-w-3xl mx-auto mb-12"
            >
              <div className="glass-strong p-3 rounded-3xl shadow-2xl border-2 border-white/30 hover:border-white/50 transition-all duration-300">
                <SearchBar />
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap gap-4 justify-center items-center"
            >
              <Link to="/search">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 shadow-2xl border-2 border-white/50 text-white hover:bg-white/10">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Start Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/vendors">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 shadow-2xl border-2 border-white/50 text-white hover:bg-white/10">
                  <Store className="mr-2 h-5 w-5" />
                  Browse Vendors
                </Button>
              </Link>
            </motion.div>

            {/* Stats - Impressive Numbers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20"
            >
              {[
                { number: '10K+', label: 'Products' },
                { number: '500+', label: 'Vendors' },
                { number: '50K+', label: 'Happy Customers' }
              ].map((stat, idx) => (
                <div key={idx} className="glass-strong p-6 rounded-2xl">
                  <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">{stat.number}</div>
                  <div className="text-muted-foreground text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* FEATURES SECTION - Bento Grid Style */}
      <section className="py-32 bg-background relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge variant="outline" size="lg" className="mb-6">
              <Zap className="mr-2 h-4 w-4" />
              Why Choose Us
            </Badge>
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              Shopping <span className="text-gradient-primary">Reimagined</span>
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-xl leading-relaxed">
              Experience the perfect blend of technology and community with features designed for the modern shopper.
            </p>
          </motion.div>

          {/* Uniform Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                icon: MapPin,
                title: 'Hyperlocal Discovery',
                desc: 'Find products within walking distance. Our AI-powered location engine shows you exactly what\'s available nearby.',
                color: 'from-blue-500 to-cyan-500',
                link: '/search?view=map'
              },
              {
                icon: TrendingUp,
                title: 'Smart Price Comparison',
                desc: 'Never overpay again. Compare prices across all local vendors in real-time.',
                color: 'from-emerald-500 to-teal-500',
                link: '/price-comparison'
              },
              {
                icon: Shield,
                title: 'Verified Vendors',
                desc: 'Shop with confidence from trusted, verified local businesses.',
                color: 'from-purple-500 to-pink-500',
                link: '/verified-vendors'
              },
              {
                icon: Truck,
                title: 'Fast Delivery',
                desc: 'Same-day delivery from local stores.',
                color: 'from-amber-500 to-orange-500',
                link: '/fast-delivery'
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="h-full"
              >
                <Link to={feature.link} className='h-full block'>
                  <Card
                    variant="elevated"
                    interactive
                    className="h-full p-8 group relative overflow-hidden flex flex-col items-center text-center hover:ring-2 hover:ring-primary/50 transition-all"
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {feature.desc}
                    </p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES - Scroll Snap Carousel */}
      <section className="py-32 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Popular <span className="text-gradient-primary">Categories</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Explore our most loved product categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {popularCategories.map((category, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link to={`/search?category=${category}`}>
                  <Card
                    variant="filled"
                    interactive
                    className="p-8 text-center group h-full"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ShoppingBag className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                      {category}
                    </h3>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/categories">
              <Button variant="outline" size="lg">
                View All Categories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FEATURED PRODUCTS - New Section */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="default" size="lg" className="mb-6">
              <Sparkles className="mr-2 h-4 w-4 fill-current" />
              Fresh Arrivals
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Trending <span className="text-gradient-primary">Products</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Handpicked daily essentials just for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {featuredProducts.map((product, idx) => {
              // Find best vendor for this product to display price
              const vendors = getVendorsForProduct(product.id);
              const bestVendor = vendors[0]; // Sorted by distance in mockData, but let's assume first is best for now or use logic

              if (!bestVendor) return null;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
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
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link to="/search">
              <Button size="lg" variant="default" className="px-8">
                Explore All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED VENDORS - Premium Showcase */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="default" size="lg" className="mb-6">
              <Star className="mr-2 h-4 w-4 fill-current" />
              Featured Vendors
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Meet Our <span className="text-gradient-primary">Top Sellers</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredVendors.map((vendor, idx) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link to={`/vendor/${vendor.id}`}>
                  <Card variant="elevated" interactive className="overflow-hidden group">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={vendor.imageUrl}
                        alt={vendor.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                      {/* Verified Badge */}
                      {vendor.isVerified && (
                        <Badge variant="success" className="absolute top-4 left-4 shadow-lg">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      )}

                      {/* Rating */}
                      <div className="absolute top-4 right-4 glass-strong px-3 py-1.5 rounded-full flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-sm text-foreground">{vendor.rating}</span>
                      </div>

                      {/* Name Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white mb-1">{vendor.name}</h3>
                        <div className="flex items-center text-white/90 text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          {vendor.distance} km away
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {vendor.description}
                      </p>
                      <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                        Visit Store
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Shield, text: 'Secure Payments', color: 'text-green-500' },
              { icon: Truck, text: 'Fast Delivery', color: 'text-blue-500' },
              { icon: Headphones, text: '24/7 Support', color: 'text-purple-500' },
              { icon: Heart, text: 'Community First', color: 'text-pink-500' },
            ].map((badge, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <badge.icon className={`h-12 w-12 mx-auto mb-3 ${badge.color}`} />
                <p className="font-semibold">{badge.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA - Absolutely Stunning */}
      <section className="py-32 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)] opacity-30" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Ready to Transform Your Shopping Experience?
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-white/90 leading-relaxed">
              Join thousands of happy customers discovering the best local products every day.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" variant="default" className="text-lg px-10 py-7 bg-white !text-blue-600 hover:bg-white/90 hover:scale-105 transition-transform duration-200 shadow-2xl">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/vendors">
                <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2 border-white text-white !bg-transparent hover:bg-white hover:text-primary transition-all duration-300 shadow-2xl">
                  Become a Vendor
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
