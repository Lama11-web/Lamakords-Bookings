import React from 'react';
import { useApp } from '../context/AppContext';
import { LoyaltyPointsView } from './LoyaltyPointsView';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Bell, 
  WifiOff, 
  CreditCard, 
  LogOut, 
  LogIn, 
  Globe, 
  CalendarCheck,
  Building2,
  Star,
  Coins,
  Crown,
  Gift
} from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const { 
    isGuest, 
    loginAsUser, 
    logoutToGuest, 
    lowBandwidthMode, 
    setLowBandwidthMode, 
    bookings, 
    favorites,
    setRole,
    setActiveTab,
    loyaltyPoints,
    loyaltyTier
  } = useApp();

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-800 dark:text-amber-300 font-black text-xl shrink-0">
          {isGuest ? (
            <User className="w-8 h-8 text-slate-400" />
          ) : (
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
              alt="Mubiana Lamaswala" 
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {isGuest ? 'Guest Explorer' : 'Mubiana Lamaswala'}
            </h2>
            {!isGuest && (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-600" />
                <span>{loyaltyTier}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {isGuest ? 'Unauthenticated browsing mode (FR-28)' : 'mubianalamaswala311@gmail.com · +260 97 123 4567'}
          </p>
        </div>

        <button
          onClick={() => {
            if (isGuest) loginAsUser();
            else logoutToGuest();
          }}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 shrink-0"
        >
          {isGuest ? <LogIn className="w-3.5 h-3.5 text-amber-600" /> : <LogOut className="w-3.5 h-3.5" />}
          <span>{isGuest ? 'Sign In' : 'Sign Out'}</span>
        </button>
      </div>

      {/* Quick Stats including Loyalty Points */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">{bookings.length}</span>
          <span className="text-[10px] text-slate-400 block uppercase font-medium mt-0.5">Stay Bookings</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">{favorites.length}</span>
          <span className="text-[10px] text-slate-400 block uppercase font-medium mt-0.5">Saved Stays</span>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 dark:from-amber-950/40 dark:to-amber-900/20 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/60 shadow-xs">
          <span className="text-xl font-black text-amber-700 dark:text-amber-400 tabular-nums">
            {loyaltyPoints.toLocaleString()}
          </span>
          <span className="text-[10px] text-amber-800/80 dark:text-amber-300/80 block uppercase font-bold mt-0.5">
            Loyalty Points
          </span>
        </div>
      </div>

      {/* Full Loyalty Points & Rewards System View */}
      <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <LoyaltyPointsView />
      </div>

      {/* Settings list */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700 text-xs">
        
        {/* Low bandwidth */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WifiOff className="w-4 h-4 text-amber-600" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Data-Saver Mode (Constraint 2.5)</p>
              <p className="text-[11px] text-slate-500">Reduce mobile data usage on 2G/3G networks across Zambia</p>
            </div>
          </div>
          <input 
            type="checkbox"
            checked={lowBandwidthMode}
            onChange={(e) => setLowBandwidthMode(e.target.checked)}
            className="w-4 h-4 accent-amber-600"
          />
        </div>

        {/* Currency & Region */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-amber-600" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Regional Currency & Tax</p>
              <p className="text-[11px] text-slate-500">Zambian Kwacha (ZMW) · 1.5% Tourism Levy compliant</p>
            </div>
          </div>
          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">ZMW (K)</span>
        </div>

        {/* Reviews and Ratings */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Community Reviews & Ratings (FR-05)</p>
              <p className="text-[11px] text-slate-500">Read verified guest feedback and review Zambian lodges</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('reviews')}
            className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            View Reviews
          </button>
        </div>

        {/* Host mode */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-4 h-4 text-amber-600" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Switch to Host Portal</p>
              <p className="text-[11px] text-slate-500">Manage listings, approve reservation payments, and view analytics</p>
            </div>
          </div>
          <button
            onClick={() => setRole('business_owner')}
            className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold"
          >
            Open Host Portal
          </button>
        </div>

      </div>

    </div>
  );
};
