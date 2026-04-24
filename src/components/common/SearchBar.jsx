// src/components/common/SearchBar.jsx - Enhanced with consistent colors
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { mockCategories, mockVendors } from '../../utils/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

export function SearchBar({ initialQuery = '', initialCategory = 'All', initialBrand = 'All' }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState(initialBrand);
  const navigate = useNavigate();

  // Sync state with props (e.g., when navigating via browser back/forward)
  React.useEffect(() => {
    setQuery(initialQuery);
    setCategory(initialCategory);
    setBrand(initialBrand);
  }, [initialQuery, initialCategory, initialBrand]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category !== 'All') params.set('category', category);
    if (brand !== 'All') params.set('shop', brand); // Using 'shop' param, state variable still named 'brand' for minimal diff
    navigate(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-4xl mx-auto border-2 border-gray-200 dark:border-gray-700">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
        <Input
          type="text"
          placeholder="Search for products or vendors..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-fypBlue focus:border-fypBlue transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Category Dropdown */}
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full md:w-[180px] rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-fypBlue focus:border-fypBlue">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent className="dark:bg-gray-800">
          {mockCategories.map((cat) => (
            <SelectItem key={cat} value={cat} className="dark:text-white">
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Brand Dropdown */}
      <Select value={brand} onValueChange={setBrand}>
        <SelectTrigger className="w-full md:w-[180px] rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-fypBlue focus:border-fypBlue">
          <SelectValue placeholder="Select Shop" />
        </SelectTrigger>
        <SelectContent className="dark:bg-gray-800">
          <SelectItem value="All" className="dark:text-white">All</SelectItem>
          {mockVendors.map((v) => (
            <SelectItem key={v.id} value={v.name} className="dark:text-white">
              {v.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" className="w-full md:w-auto px-6 bg-gradient-primary text-white hover:opacity-90 transition-opacity shadow-lg">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
}
