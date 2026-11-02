import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ListingCard } from './ListingCard';
import { AccommodationType } from '../types';
import { Search, Filter, ArrowUpDown, Building2 } from 'lucide-react';

export const CustomerExplore: React.FC = () => {
  const { listings, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useApp();
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'rating'>('recommended');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'horizontal'>('grid');

  const cities = ['All', 'Livingstone', 'Lusaka', 'South Luangwa', 'Siavonga', 'Kitwe', 'Ndola'];
  const categories: (AccommodationType | 'All')[] = [
    'All', 'Lodge', 'Hotel', 'Resort', 'Villa', 'Apartment', 'Homestay', 'Guest House'
  ];

  const processedListings = useMemo(() => {
    let list = listings.filter(item => {
      const matchSearch = 
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.locationName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat = selectedCategory === 'All' || item.type === selectedCategory;
      const matchCity = selectedCity === 'All' || item.city.toLowerCase() === selectedCity.toLowerCase();

      return matchSearch && matchCat && matchCity;
    });

    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.pricePerNightZMW - b.pricePerNightZMW);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.pricePerNightZMW - a.pricePerNightZMW);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [listings, searchQuery, selectedCategory, selectedCity, sortBy]);

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Title & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Explore All Accommodations (FR-18)
          </h2>
          <p className="text-xs text-slate-500">
            Browse through verified lodges, hotels, villas and homestays across Zambia
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stays..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
            />
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold outline-none"
            >
              <option value="recommended">Featured First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category & City Pills */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pl-1">City:</span>
          {cities.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                selectedCity === city
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Results */}
      {processedListings.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-40" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No properties found</h3>
          <p className="text-xs text-slate-500 mt-1">Try relaxing your search terms or picking a different province.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {processedListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} layout="grid" />
          ))}
        </div>
      )}

    </div>
  );
};
