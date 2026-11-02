import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing, AccommodationType } from '../types';
import { 
  MapPin, 
  X, 
  Star, 
  Layers, 
  Navigation, 
  Car, 
  Calendar,
  Compass
} from 'lucide-react';

export const InteractiveMapModal: React.FC = () => {
  const { listings, setSelectedListing, setBookingListing, setRideHailingStay, setActiveTab } = useApp();
  const [filterType, setFilterType] = useState<string>('All');
  const [activePinStay, setActivePinStay] = useState<Listing | null>(listings[0]);

  const filtered = filterType === 'All' 
    ? listings 
    : listings.filter(l => l.type === filterType);

  // Map coordinates projection for Zambia
  // Approx bounds: Lat: -8 to -18, Lng: 22 to 34
  const getPositionPercent = (lat: number, lng: number) => {
    const minLat = -18.5;
    const maxLat = -8.0;
    const minLng = 22.0;
    const maxLng = 34.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100; // inverted for screen Y

    // Clamp inside container
    return {
      left: `${Math.max(10, Math.min(90, x))}%`,
      top: `${Math.max(10, Math.min(88, y))}%`
    };
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Interactive Zambia Stays Map (FR-07)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Explore accommodation locations, coordinates, and nearby safari hubs across Zambia
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['All', 'Lodge', 'Hotel', 'Resort', 'Villa', 'Apartment', 'Homestay'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                filterType === type
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas and Split Detail Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        
        {/* Interactive Zambia Map Viewport */}
        <div className="lg:col-span-8 relative bg-gradient-to-br from-emerald-950 via-slate-900 to-amber-950 rounded-3xl overflow-hidden border border-slate-700 p-4 shadow-xl flex items-center justify-center">
          
          {/* Subtle topographic grid texture */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]"></div>
          
          {/* Stylized Zambia Country Border Outline SVG */}
          <svg className="w-full h-full max-h-[500px] opacity-25 pointer-events-none" viewBox="0 0 800 600" fill="none">
            <path 
              d="M180,220 C220,180 340,150 420,130 C490,110 570,160 620,140 C670,190 730,260 710,340 C690,410 610,480 520,510 C460,530 380,510 320,490 C260,510 210,480 180,440 C140,380 130,300 180,220 Z" 
              stroke="#fbbf24" 
              strokeWidth="3" 
              strokeDasharray="6 6"
              fill="#fbbf24"
              fillOpacity="0.05"
            />
            {/* Zambezi River trace */}
            <path 
              d="M170,430 Q280,480 390,490 T540,510 T720,380" 
              stroke="#38bdf8" 
              strokeWidth="2.5" 
              fill="none" 
              strokeOpacity="0.5" 
            />
          </svg>

          {/* Region Label Watermarks */}
          <div className="absolute top-12 left-16 text-[11px] font-bold uppercase tracking-widest text-emerald-400/40 pointer-events-none">
            North-Western Province
          </div>
          <div className="absolute top-24 right-24 text-[11px] font-bold uppercase tracking-widest text-amber-400/40 pointer-events-none">
            Luangwa Valley Safari Reserve
          </div>
          <div className="absolute bottom-14 left-24 text-[11px] font-bold uppercase tracking-widest text-sky-400/50 pointer-events-none">
            Mosi-oa-Tunya / Victoria Falls
          </div>
          <div className="absolute bottom-10 right-36 text-[11px] font-bold uppercase tracking-widest text-sky-400/50 pointer-events-none">
            Lake Kariba (Siavonga)
          </div>

          {/* Pins for each accommodation */}
          {filtered.map((item) => {
            const pos = getPositionPercent(item.coordinates.lat, item.coordinates.lng);
            const isSelected = activePinStay?.id === item.id;

            return (
              <div
                key={item.id}
                style={{ left: pos.left, top: pos.top }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
              >
                <button
                  onClick={() => setActivePinStay(item)}
                  className={`relative p-2 rounded-full transition-transform focus:outline-none flex items-center justify-center shadow-lg ${
                    isSelected 
                      ? 'bg-amber-500 text-slate-950 scale-125 ring-4 ring-amber-400/50 z-30' 
                      : 'bg-slate-900 text-amber-400 border border-amber-500/60 hover:scale-110'
                  }`}
                >
                  <MapPin className="w-4 h-4 fill-current" />
                  
                  {/* Subtle Pulse ring */}
                  {isSelected && (
                    <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-30"></span>
                  )}
                </button>

                {/* Pin hover tooltip */}
                <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] font-bold transition-all pointer-events-none shadow-md ${
                  isSelected 
                    ? 'bg-slate-950 text-amber-300 border border-amber-500/40' 
                    : 'bg-black/80 text-white opacity-0 group-hover:opacity-100'
                }`}>
                  {item.title} (ZMW {item.pricePerNightZMW})
                </div>
              </div>
            );
          })}

          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md p-2 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Showing {filtered.length} stay pins</span>
            </div>
            <div className="text-[10px] text-slate-500">Tap pin to preview stay</div>
          </div>

        </div>

        {/* Selected Stay Sheet Preview */}
        <div className="lg:col-span-4 flex flex-col">
          {activePinStay ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-md flex-1 flex flex-col justify-between">
              <div>
                <div className="relative h-44 rounded-2xl overflow-hidden mb-3.5 bg-slate-100">
                  <img 
                    src={activePinStay.images[0]} 
                    alt={activePinStay.title} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {activePinStay.type}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span>{activePinStay.locationName}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {activePinStay.rating.toFixed(1)}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight mb-2">
                  {activePinStay.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-3">
                  {activePinStay.description}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                  Coordinates: {activePinStay.coordinates.lat}° S, {activePinStay.coordinates.lng}° E
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2 mt-4">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xs text-slate-400">Nightly Rate</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                    ZMW {activePinStay.pricePerNightZMW.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setRideHailingStay(activePinStay)}
                    className="py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5"
                  >
                    <Car className="w-3.5 h-3.5 text-amber-600" />
                    <span>Ride to Stay</span>
                  </button>
                  <button
                    onClick={() => setBookingListing(activePinStay)}
                    className="py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Stay</span>
                  </button>
                </div>

                <button
                  onClick={() => setSelectedListing(activePinStay)}
                  className="w-full py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 text-center"
                >
                  View Full Details & Photos
                </button>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 flex items-center justify-center flex-1">
              Select any pin on the map to inspect details
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
