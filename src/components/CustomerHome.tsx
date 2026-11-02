import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ListingCard } from './ListingCard';
import { POPULAR_DESTINATIONS } from '../data/initialData';
import { AccommodationType } from '../types';
import { 
  Search, 
  SlidersHorizontal, 
  Building, 
  Home, 
  Hotel, 
  Tent, 
  Palmtree, 
  Building2, 
  Sparkles, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  X
} from 'lucide-react';

const CATEGORIES: { label: string; type: AccommodationType | 'All'; icon: React.ReactNode }[] = [
  { label: 'All Stays', type: 'All', icon: <Building2 className="w-4 h-4" /> },
  { label: 'Lodges', type: 'Lodge', icon: <Tent className="w-4 h-4" /> },
  { label: 'Hotels', type: 'Hotel', icon: <Hotel className="w-4 h-4" /> },
  { label: 'Resorts', type: 'Resort', icon: <Palmtree className="w-4 h-4" /> },
  { label: 'Villas', type: 'Villa', icon: <Home className="w-4 h-4" /> },
  { label: 'Apartments', type: 'Apartment', icon: <Building className="w-4 h-4" /> },
  { label: 'Homestays', type: 'Homestay', icon: <Home className="w-4 h-4" /> },
  { label: 'Guest Houses', type: 'Guest House', icon: <Building2 className="w-4 h-4" /> },
];

export const CustomerHome: React.FC = () => {
  const { 
    listings, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery, 
    setActiveTab, 
    isGuest,
    setSelectedListing,
    setBookingListing,
    setShowGeminiChat
  } = useApp();

  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Unique amenities available across listings
  const allAmenities = useMemo(() => {
    const set = new Set<string>();
    listings.forEach(l => l.amenities.forEach(a => set.add(a)));
    return Array.from(set);
  }, [listings]);

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      const matchesSearch = 
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        selectedCategory === 'All' || item.type === selectedCategory;

      const matchesCity = 
        selectedCity === 'All' || item.city.toLowerCase() === selectedCity.toLowerCase();

      const matchesPrice = item.pricePerNightZMW <= maxPrice;

      const matchesAmenities = 
        selectedAmenities.length === 0 || 
        selectedAmenities.every(a => item.amenities.includes(a));

      return matchesSearch && matchesCategory && matchesCity && matchesPrice && matchesAmenities;
    });
  }, [listings, searchQuery, selectedCategory, selectedCity, maxPrice, selectedAmenities]);

  // Hero Spotlight item
  const spotlightListing = listings.find(l => l.promotionTier === 'spotlight') || listings[0];

  // Recommended Listings (FR-15)
  const recommendedListings = useMemo(() => {
    return listings.filter(l => l.isFeatured || l.rating >= 4.8).slice(0, 4);
  }, [listings]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  return (
    <div className="flex-1 pb-16">
      
      {/* FR-17: Customer profile & greeting header banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-300 shadow-md shrink-0 bg-amber-900 flex items-center justify-center text-amber-200 font-bold">
              {isGuest ? (
                <span>G</span>
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                  alt="Mubiana Lamaswala" 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <span className="text-xs text-amber-200 font-medium tracking-wide uppercase">
                {isGuest ? 'Welcome Guest' : 'Welcome back'}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {isGuest ? 'Explore Zambia Stays' : 'Mubiana Lamaswala'}
              </h1>
            </div>
          </div>

          <div className="text-xs text-amber-100/90 max-w-sm">
            Discover verified hotels, safari lodges, apartments, and guest houses across Zambia with mobile money checkout.
          </div>
        </div>

        {/* Search Bar & Filter trigger */}
        <div className="max-w-7xl mx-auto mt-6">
          <div className="bg-white dark:bg-slate-800 p-2 sm:p-2.5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center gap-2 text-slate-900 dark:text-white">
            <div className="flex-1 flex items-center gap-2.5 px-3 w-full">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city (Livingstone, Lusaka, Siavonga) or hotel name..."
                className="w-full text-xs sm:text-sm bg-transparent outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-700 pt-2 sm:pt-0 sm:pl-2">
              <button
                onClick={() => setShowFiltersModal(true)}
                className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  selectedAmenities.length > 0 || selectedCity !== 'All' || maxPrice < 5000
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {(selectedAmenities.length > 0 || selectedCity !== 'All') ? '• Active' : ''}</span>
              </button>

              <button
                onClick={() => setActiveTab('explore')}
                className="flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
              >
                Search Stays
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-10">

        {/* Gemini AI Stays & Google Maps Concierge Feature Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-transparent dark:from-amber-950/30 dark:via-amber-900/20 rounded-2xl border border-amber-300 dark:border-amber-700/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-600/20 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Need Personalized Travel or Safari Advice?
                </h3>
                <span className="text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Google Maps Grounded
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Chat with our Gemini 3.8 Flash AI concierge to plan multi-day itineraries, compare Zambian lodges, or locate verified restaurants & scenic spots.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowGeminiChat(true)}
            className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Ask AI Concierge</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* FR-13: Category Browser with Icons */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Browse by Property Type
            </h2>
            <button 
              onClick={() => { setSelectedCategory('All'); setActiveTab('explore'); }}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>See All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.type;
              return (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat.type)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-sm font-semibold'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className={isSelected ? 'text-white' : 'text-amber-600 dark:text-amber-400'}>
                    {cat.icon}
                  </span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Hero Spotlight Property */}
        {spotlightListing && (
          <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
              
              {/* Media */}
              <div className="lg:col-span-7 relative h-64 lg:h-auto overflow-hidden">
                <img 
                  src={spotlightListing.images[0]} 
                  alt={spotlightListing.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-md shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Spotlight Stays</span>
                </div>
              </div>

              {/* Pitch */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-2">
                    <span>{spotlightListing.type}</span>
                    <span aria-hidden="true">·</span>
                    <span>{spotlightListing.locationName}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
                    {spotlightListing.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {spotlightListing.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {spotlightListing.amenities.slice(0, 3).map((a, i) => (
                      <span key={i} className="text-[11px] bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-md text-slate-200">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-medium block">Special Nightly Rate</span>
                    <div className="text-lg sm:text-xl font-extrabold text-white tabular-nums">
                      ZMW {spotlightListing.pricePerNightZMW.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedListing(spotlightListing)}
                      className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setBookingListing(spotlightListing)}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-md transition-colors"
                    >
                      Instant Book
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* FR-14: Popular Destinations in Zambia */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Popular Zambian Destinations
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Trending hubs and travel destinations across Zambia
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {POPULAR_DESTINATIONS.map((dest) => (
              <div
                key={dest.id}
                onClick={() => {
                  setSelectedCity(dest.city);
                  setSearchQuery(dest.city);
                  setActiveTab('explore');
                }}
                className="group relative rounded-2xl overflow-hidden h-40 bg-slate-100 dark:bg-slate-800 cursor-pointer shadow-xs hover:shadow-md transition-all"
              >
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-xs sm:text-sm font-bold leading-tight drop-shadow-xs line-clamp-1">
                    {dest.name}
                  </h3>
                  <p className="text-[10px] text-amber-300 font-medium mt-0.5">
                    {dest.staysCount} verified stays
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FR-15: Recommended Stays */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Recommended for You
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Top rated guest reviews and verified business listings
              </p>
            </div>
            <button
              onClick={() => setActiveTab('explore')}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>

        {/* All / Filtered Results Stream */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Available Accommodations ({filteredListings.length})
              </h2>
              {selectedCategory !== 'All' && (
                <span className="text-xs text-amber-600 font-medium">
                  Showing {selectedCategory} listings
                </span>
              )}
            </div>
          </div>

          {filteredListings.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <Search className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No properties match your filter</h3>
              <p className="text-xs text-slate-500 mt-1">Try resetting the city or price filter to view all stays.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedCity('All');
                  setMaxPrice(5000);
                  setSelectedAmenities([]);
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} layout="horizontal" />
              ))}
            </div>
          )}
        </section>

      </div>

      {/* Filter Modal */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Filter Accommodations</h3>
              <button onClick={() => setShowFiltersModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* City Selection */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">City / Destination</label>
              <div className="grid grid-cols-3 gap-2">
                {['All', 'Livingstone', 'Lusaka', 'South Luangwa', 'Siavonga', 'Kitwe', 'Ndola'].map(city => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border text-center transition-colors ${
                      selectedCity === city
                        ? 'bg-amber-600 text-white border-amber-600 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Max Nightly Rate</label>
                <span className="text-xs font-bold text-amber-600 tabular-nums">ZMW {maxPrice.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min={500} 
                max={5000} 
                step={250}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>ZMW 500</span>
                <span>ZMW 2,500</span>
                <span>ZMW 5,000+</span>
              </div>
            </div>

            {/* Amenities Checklist */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">Key Amenities (Zambia Essentials)</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                {allAmenities.map(amenity => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs text-left border flex items-center justify-between transition-colors ${
                        isChecked
                          ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span className="truncate">{amenity}</span>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={() => {
                  setSelectedCity('All');
                  setMaxPrice(5000);
                  setSelectedAmenities([]);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="flex-1 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs"
              >
                Apply Filters ({filteredListings.length} stays found)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
