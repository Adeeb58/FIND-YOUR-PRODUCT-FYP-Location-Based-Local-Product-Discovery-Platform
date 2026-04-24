// src/utils/currency.js - Currency formatting utility

/**
 * Format price in Indian Rupees (INR)
 * @param {number} price - Price in USD (will be converted to INR)
 * @param {boolean} showSymbol - Whether to show currency symbol (default: true)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, showSymbol = true) => {
  if (price === undefined || price === null || isNaN(price)) {
    return showSymbol ? '₹0.00' : '0.00';
  }

  // Convert USD to INR (approximate rate: 1 USD = 83 INR)
  const exchangeRate = 83;
  const inrPrice = price * exchangeRate;

  // Format with Indian number system (lakhs, crores)
  const formatted = new Intl.NumberFormat('en-IN', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(inrPrice);

  return formatted;
};

/**
 * Format price without currency symbol (for display in cards)
 */
export const formatPriceNumber = (price) => {
  const exchangeRate = 83;
  const inrPrice = price * exchangeRate;
  return Math.round(inrPrice).toLocaleString('en-IN');
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = () => '₹';

