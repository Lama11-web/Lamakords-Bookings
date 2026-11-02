import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Compass, Search, User, MapPin, CalendarCheck } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, role, bookings, platform } = useApp();

  if (role !== 'customer') return null;

  const isSimulator = platform !== 'web';

  return (
    <nav className={`${
      isSimulator 
        ? 'sticky bottom-0 left-0 right-0 z-40' 
        : 'md:hidden fixed bottom-0 left-0 right-0 z-40'
    } bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors shrink-0`}>
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'home' 
              ? 'text-amber-600 font-bold' 
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-1">Home</span>
        </button>

        {/* Explore */}
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'explore' 
              ? 'text-amber-600 font-bold' 
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          <Compass className={`w-5 h-5 ${activeTab === 'explore' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-1">Explore</span>
        </button>

        {/* Map */}
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'map' 
              ? 'text-amber-600 font-bold' 
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          <MapPin className={`w-5 h-5 ${activeTab === 'map' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-1">Map</span>
        </button>

        {/* Bookings */}
        <button
          onClick={() => setActiveTab('bookings')}
          className={`relative flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'bookings' 
              ? 'text-amber-600 font-bold' 
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          <CalendarCheck className={`w-5 h-5 ${activeTab === 'bookings' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-1">Bookings</span>
          {bookings.length > 0 && (
            <span className="absolute top-1 right-3 w-4 h-4 bg-amber-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              {bookings.length}
            </span>
          )}
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'profile' 
              ? 'text-amber-600 font-bold' 
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-1">Profile</span>
        </button>

      </div>
    </nav>
  );
};
