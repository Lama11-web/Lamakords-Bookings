import React from 'react';
import { useApp } from '../context/AppContext';
import { ListingCard } from './ListingCard';
import { Bookmark, Heart } from 'lucide-react';

export const CustomerSaved: React.FC = () => {
  const { listings, favorites, setActiveTab } = useApp();

  const favoriteListings = listings.filter(l => favorites.includes(l.id));

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <span>Saved Stays & Bookmarks (FR-04)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your shortlisted accommodation properties across Zambia
          </p>
        </div>
      </div>

      {favoriteListings.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <Heart className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-40" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No saved favorites yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Tap the heart icon on any hotel, safari lodge, or villa to save it for your itinerary.
          </p>
          <button
            onClick={() => setActiveTab('explore')}
            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-semibold"
          >
            Explore Accommodations
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {favoriteListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

    </div>
  );
};
