// src/utils/colors.js - Color standardization utility
// This ensures consistent color usage across the application

export const colors = {
  // Text Colors - Light Mode
  text: {
    primary: 'text-gray-900 dark:text-gray-100',
    secondary: 'text-gray-600 dark:text-gray-400',
    tertiary: 'text-gray-500 dark:text-gray-500',
    inverse: 'text-white dark:text-gray-900',
    muted: 'text-gray-500 dark:text-gray-400',
  },
  
  // Background Colors
  bg: {
    primary: 'bg-white dark:bg-gray-900',
    secondary: 'bg-gray-50 dark:bg-gray-950',
    tertiary: 'bg-gray-100 dark:bg-gray-800',
    card: 'bg-white dark:bg-gray-800',
    overlay: 'bg-white/95 dark:bg-gray-900/95',
  },
  
  // Border Colors
  border: {
    light: 'border-gray-200 dark:border-gray-700',
    medium: 'border-gray-300 dark:border-gray-600',
    dark: 'border-gray-400 dark:border-gray-500',
  },
  
  // Brand Colors
  brand: {
    blue: 'text-fypBlue dark:text-fypBlue',
    green: 'text-fypGreen dark:text-fypGreen',
    gradient: 'bg-gradient-primary',
  },
};

// Helper function to get consistent text color classes
export const getTextColor = (variant = 'primary') => colors.text[variant] || colors.text.primary;

// Helper function to get consistent background color classes
export const getBgColor = (variant = 'primary') => colors.bg[variant] || colors.bg.primary;

// Helper function to get consistent border color classes
export const getBorderColor = (variant = 'light') => colors.border[variant] || colors.border.light;

