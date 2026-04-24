// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-lg font-bold text-white">FYP</div>
          <nav className="flex space-x-6">
            <Link to="/privacy" className="hover:text-white transition duration-200">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition duration-200">Terms of Service</Link>
            <Link to="/contact" className="hover:text-white transition duration-200">Contact Us</Link>
          </nav>
          <div className="flex space-x-4">
            {/* Social Media Icons - Placeholder for actual icons */}
            <a href="#" className="hover:text-white transition duration-200"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="hover:text-white transition duration-200"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-white transition duration-200"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
        <p className="mt-8 text-sm">&copy; {new Date().getFullYear()} Find Your Product. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;