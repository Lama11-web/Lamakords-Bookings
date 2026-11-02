import React from 'react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, Star, MapPin, Zap, ShieldCheck } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  layout?: 'grid' | 'horizontal';
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, layout = 'grid' }) => {
  const { 
    favorites, 
    toggleFavorite, 
    setSelectedListing, 
    setBookingListing, 
    setRideHailingStay,
    lowBandwidthMode 
  } = useApp();

  const isFav = favorites.includes(listing.id);

  const handleCardClick = () => {
    setSelectedListing(listing);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(listing.id);
  };

  const handleQuickBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBookingListing(listing);
  };

  const handleQuickRide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRideHailingStay(listing);
  };

  if (layout === 'horizontal') {
    return (
      <div 
        onClick={handleCardClick}
        className="group flex flex-col sm:flex-row bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden hover:shadow-md transition-all cursor-pointer"
      >
        {/* Image slot with styled fallback container */}
        <div className="relative w-full sm:w-56 h-48 sm:h-auto shrink-0 bg-slate-100 dark:bg-slate-700 overflow-hidden">
          {listing.images[0] ? (
            <img 
              src={listing.images[0]} 
              alt={listing.title}
              loading={lowBandwidthMode ? 'lazy' : 'eager'}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                lowBandwidthMode ? 'filter contrast-90 brightness-95' : ''
              }`}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-600/10 to-slate-200 dark:to-slate-800 text-slate-400">
              <MapPin className="w-8 h-8 opacity-40" />
            </div>
          )}

          {/* Featured tag - clean text label, no gaudy badges */}
          {listing.isFeatured && (
            <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-xs text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-md">
              Featured Stay
            </div>
          )}

          {/* Favorite heart */}
          <button
            onClick={handleFavoriteClick}
            aria-label="Bookmark listing"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-110 active:scale-95 transition-all shadow-xs"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-300'}`} />
          </button>
        </div>

        {/* Info Column */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Zero-Pill unboxed metadata */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
              <span className="text-amber-700 dark:text-amber-400 font-semibold">{listing.type}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {listing.city}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                {listing.rating.toFixed(1)} ({listing.reviewCount})
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors line-clamp-1">
              {listing.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 leading-relaxed">
              {listing.description}
            </p>

            {/* Amenities Highlights */}
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-2.5">
              {listing.amenities.slice(0, 3).map((amenity, idx) => (
                <span key={idx} className="bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                  {amenity}
                </span>
              ))}
              {listing.amenities.length > 3 && (
                <span className="text-slate-400 self-center">+{listing.amenities.length - 3} more</span>
              )}
            </div>
          </div>

          {/* Pricing & Quick Booking Actions */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-700/60">
            <div>
              <span className="text-xs text-slate-400 block font-normal">Starting from</span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                ZMW {listing.pricePerNightZMW.toLocaleString()}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">/ night</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleQuickRide}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                Book Ride
              </button>
              <button
                onClick={handleQuickBook}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-xs"
              >
                Reserve Stay
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Grid Card
  return (
    <div 
      onClick={handleCardClick}
      className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden hover:shadow-md transition-all cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-700 overflow-hidden">
        {listing.images[0] ? (
          <img 
            src={listing.images[0]} 
            alt={listing.title}
            loading={lowBandwidthMode ? 'lazy' : 'eager'}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              lowBandwidthMode ? 'filter contrast-90 brightness-95' : ''
            }`}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-600/10 to-slate-200 dark:to-slate-800 text-slate-400">
            <MapPin className="w-8 h-8 opacity-40" />
          </div>
        )}

        {/* Featured Tag */}
        {listing.isFeatured && (
          <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-xs text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded">
            Featured
          </div>
        )}

        {/* Bookmark Heart */}
        <button
          onClick={handleFavoriteClick}
          aria-label="Bookmark listing"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-110 active:scale-95 transition-all shadow-xs"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-300'}`} />
        </button>

        {/* Rating overlay at bottom edge */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{listing.rating.toFixed(1)}</span>
          <span className="text-slate-300 font-normal">({listing.reviewCount})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Zero-Pill Metadata */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
            <span className="text-amber-700 dark:text-amber-400 font-semibold">{listing.type}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{listing.city}</span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors line-clamp-1">
            {listing.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Bottom Price & Button */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-700/60">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Per night</span>
            <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tabular-nums">
              ZMW {listing.pricePerNightZMW.toLocaleString()}
            </div>
          </div>

          <button
            onClick={handleQuickBook}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-600 dark:hover:bg-amber-700 transition-colors"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
};
