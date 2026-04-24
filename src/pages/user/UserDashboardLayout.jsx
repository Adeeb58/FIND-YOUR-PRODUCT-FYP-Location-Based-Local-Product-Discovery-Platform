// src/layouts/UserDashboardLayout.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { User, Heart, Settings, LogOut, MenuIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';

export function UserDashboardLayout() {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Profile', icon: User, path: '/user/profile' },
    { name: 'Favorites', icon: Heart, path: '/user/favorites' },
    // Add 'Orders' or 'History' if needed
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for Desktop */}
      <motion.aside
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-64 bg-white dark:bg-gray-800 shadow-md p-6 hidden md:flex flex-col border-r border-gray-200 dark:border-gray-700"
      >
        <div className="mb-8 text-2xl font-poppins font-bold text-fypBlue">
          User Dashboard
        </div>
        <nav className="grow">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors duration-200
                    ${isActive
                      ? 'bg-fypBlue text-white shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={logout} variant="ghost" className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar for Mobile/Tablet (using Sheet for menu) */}
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 md:hidden flex items-center justify-between">
          <div className="text-xl font-poppins font-bold text-fypBlue">User Dashboard</div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-white dark:bg-gray-800 p-6 flex flex-col">
              {/* Mobile nav content (same as desktop nav) */}
              <div className="mb-8 text-2xl font-poppins font-bold text-fypBlue">User Dashboard</div>
              {navItems.map((item) => (
                <NavLink key={item.name} to={item.path} className="...">
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
              <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button onClick={logout} variant="ghost" className="w-full justify-start text-red-600">
                  <LogOut className="h-5 w-5 mr-3" /> Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
