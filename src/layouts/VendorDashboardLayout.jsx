// src/layouts/VendorDashboardLayout.jsx - Enhanced with consistent colors
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Package, User2, LogOut, MenuIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';

export function VendorDashboardLayout() {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/vendor' },
    { name: 'My Products', icon: Package, path: '/vendor/products' },
    { name: 'Profile Settings', icon: User2, path: '/vendor/profile' },
  ];

  const sidebarVariants = {
    hidden: { x: -200, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar for Desktop */}
      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className="w-64 bg-white dark:bg-gray-900 shadow-lg p-6 hidden md:flex flex-col border-r-2 border-gray-200 dark:border-gray-800"
      >
        <div className="mb-8 text-2xl font-poppins font-bold text-gradient-primary bg-clip-text text-transparent">
          Vendor Panel
        </div>
        <nav className="grow">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  end={item.path === '/vendor'}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors duration-200
                    ${isActive
                      ? 'bg-gradient-primary text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto pt-6 border-t-2 border-gray-200 dark:border-gray-800">
          <Button onClick={logout} variant="ghost" className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar for Mobile/Tablet */}
        <header className="bg-white dark:bg-gray-900 shadow-sm p-4 md:hidden flex items-center justify-between border-b-2 border-gray-200 dark:border-gray-800">
          <div className="text-xl font-poppins font-bold text-fypBlue">Vendor Panel</div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-white dark:bg-gray-900 p-6 flex flex-col border-r-2 border-gray-200 dark:border-gray-800">
              <div className="mb-8 text-2xl font-poppins font-bold text-gradient-primary bg-clip-text text-transparent">
                Vendor Panel
              </div>
              <nav className="grow">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.path}
                        end={item.path === '/vendor'}
                        className={({ isActive }) =>
                          `flex items-center p-3 rounded-lg transition-colors duration-200
                          ${isActive
                            ? 'bg-gradient-primary text-white shadow-md'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.name}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-auto pt-6 border-t-2 border-gray-200 dark:border-gray-800">
                <Button onClick={logout} variant="ghost" className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
