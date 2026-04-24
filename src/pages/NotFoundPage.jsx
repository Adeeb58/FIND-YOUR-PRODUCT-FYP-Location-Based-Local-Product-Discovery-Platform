// src/pages/NotFoundPage.jsx - Enhanced with consistent colors
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { Home, AlertCircle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-primary mb-4">
            <AlertCircle className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-8xl font-poppins font-extrabold text-gradient-primary bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-3xl font-poppins font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button size="lg" className="bg-gradient-primary text-white hover:opacity-90 px-8">
            <Home className="h-4 w-4 mr-2" />
            Go to Homepage
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
