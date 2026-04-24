// src/layouts/AdminDashboardLayout.jsx - Enhanced with consistent colors
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Tag, LogOut, MenuIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';

export function AdminDashboardLayout() {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Vendor Mgmt', icon: Users, path: '/admin/vendors' },
    { name: 'Category Mgmt', icon: Tag, path: '/admin/categories' },
  ];

  const SidebarContent = () => (
    <>
      <div className="mb-8 text-3xl font-poppins font-extrabold text-gradient-primary bg-clip-text text-transparent">
        Admin Portal
      </div>
      <nav className="grow">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                end
                to={item.path}
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
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar for Desktop */}
      <motion.aside
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-64 bg-white dark:bg-gray-900 shadow-lg p-6 hidden md:flex flex-col border-r-2 border-gray-200 dark:border-gray-800"
      >
        <SidebarContent />
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar for Mobile/Tablet */}
        <header className="bg-white dark:bg-gray-900 shadow-sm p-4 md:hidden flex items-center justify-between sticky top-0 z-10 border-b-2 border-gray-200 dark:border-gray-800">
          <div className="text-xl font-poppins font-bold text-fypBlue">Admin Portal</div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-white dark:bg-gray-900 p-6 flex flex-col border-r-2 border-gray-200 dark:border-gray-800">
              <SidebarContent />
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
