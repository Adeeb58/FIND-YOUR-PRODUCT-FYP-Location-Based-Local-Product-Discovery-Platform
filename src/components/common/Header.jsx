// src/components/common/Header.jsx - Premium Simple Header
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'glass-strong shadow-lg border-b border-border/50'
        : 'bg-background/80 backdrop-blur-sm'
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Simple & Effective like Google/YouTube/Amazon */}
          <Link
            to="/"
            className="flex items-center gap-2 group relative"
          >
            {/* Logo Image */}
            <img
              src="/full-logo.png"
              alt="FYP - Find Your Product"
              className="h-14 w-auto mix-blend-multiply dark:mix-blend-screen object-contain"
            />

            {/* Subtle underline animation on hover */}
            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </Link>

          {/* Center Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products, vendors..."
                className="w-full pl-12 pr-4 py-2.5 rounded-full bg-muted/50 border border-border/50 focus:border-primary focus:bg-background transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {/* Right Navigation */}
          <nav className="flex items-center gap-2">
            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-1 mr-2">
              <Link to="/categories">
                <Button variant="ghost" size="default" className="text-lg font-medium">
                  Categories
                </Button>
              </Link>
              <Link to="/vendors">
                <Button variant="ghost" size="default" className="text-lg font-medium">
                  Vendors
                </Button>
              </Link>
            </div>

            {/* Cart Icon */}
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Order History Icon - Placed outside dropdown for visibility */}
                <Link to="/orders">
                  <Button variant="ghost" size="icon" className="rounded-full" title="Order History">
                    <div className="relative">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 3v5h5" />
                        <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
                        <path d="M12 7v5l4 2" />
                      </svg>
                    </div>
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default" size="icon" className="rounded-full">
                      <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-base">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-base font-medium">{user?.name || 'User'}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="text-base">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="text-base">Orders</Link>
                    </DropdownMenuItem>
                    {user?.role === 'vendor' && (
                      <DropdownMenuItem asChild>
                        <Link to="/vendor" className="text-base">Vendor Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive text-base">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link to="/auth/login">
                <Button size="default" variant="default" className="text-lg font-medium hover:scale-105 active:scale-95 hover:shadow-lg transition-all duration-200 px-6">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-slideDown">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Mobile Links */}
            <div className="flex flex-col gap-2">
              <Link to="/categories" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Categories
                </Button>
              </Link>
              <Link to="/vendors" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Vendors
                </Button>
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  About
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
