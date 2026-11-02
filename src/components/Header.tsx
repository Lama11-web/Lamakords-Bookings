import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Smartphone, 
  Monitor, 
  Code2, 
  Zap, 
  MapPin, 
  Compass, 
  Bookmark, 
  CalendarCheck, 
  Car, 
  ShieldCheck, 
  BarChart3, 
  Sparkles, 
  LogOut, 
  User, 
  WifiOff,
  Bell,
  Star,
  Coins
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    role, 
    setRole, 
    platform, 
    setPlatform, 
    lowBandwidthMode, 
    setLowBandwidthMode,
    activeTab, 
    setActiveTab, 
    favorites, 
    bookings, 
    setShowFlutterCode,
    showGeminiChat,
    setShowGeminiChat,
    isGuest,
    loginAsUser,
    logoutToGuest,
    announcements,
    loyaltyPoints,
    loyaltyTier
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);

  // Unread high priority announcements count
  const highPriorityCount = announcements.filter(a => a.priority === 'high').length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Low-bandwidth alert banner if active */}
      {lowBandwidthMode && (
        <div className="bg-amber-600 text-white text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Data-Saver Mode Active: Compressed image previews and offline data caching enabled for Zambia network optimization.</span>
        </div>
      )}

      {/* Main Top Bar following Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-amber-600/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap block leading-tight">
                Lama Kords Stays
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block -mt-0.5">
                Zambia Stays & Travel
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {role === 'customer' && (
            <>
              <button
                onClick={() => setActiveTab('home')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-amber-600 ${
                  activeTab === 'home' ? 'text-amber-600 font-semibold border-b-2 border-amber-600 py-1' : ''
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab('explore')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-amber-600 flex items-center gap-1.5 ${
                  activeTab === 'explore' ? 'text-amber-600 font-semibold border-b-2 border-amber-600 py-1' : ''
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Explore Stays</span>
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-amber-600 flex items-center gap-1.5 ${
                  activeTab === 'map' ? 'text-amber-600 font-semibold border-b-2 border-amber-600 py-1' : ''
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Map</span>
              </button>
              <button
                onClick={() => setActiveTab('rides')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-amber-600 flex items-center gap-1.5 ${
                  activeTab === 'rides' ? 'text-amber-600 font-semibold border-b-2 border-amber-600 py-1' : ''
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Ride Hailing</span>
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-amber-600 flex items-center gap-1.5 ${
                  activeTab === 'reviews' ? 'text-amber-600 font-semibold border-b-2 border-amber-600 py-1' : ''
                }`}
              >
                <Star className="w-4 h-4" />
                <span>Reviews</span>
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-amber-600 flex items-center gap-1.5 ${
                  activeTab === 'bookings' ? 'text-amber-600 font-semibold border-b-2 border-amber-600 py-1' : ''
                }`}
              >
                <CalendarCheck className="w-4 h-4" />
                <span>My Bookings</span>
                {bookings.length > 0 && (
                  <span className="text-[11px] font-bold text-amber-600 ml-0.5">({bookings.length})</span>
                )}
              </button>
            </>
          )}

          {role === 'business_owner' && (
            <>
              <button
                onClick={() => setActiveTab('owner_listings')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-amber-600 ${
                  activeTab === 'owner_listings' ? 'text-amber-600 font-semibold border-b-2 border-amber-600 py-1' : ''
                }`}
              >
                My Listings
              </button>
              <button
                onClick={() => setActiveTab('owner_reservations')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-amber-600 ${
                  activeTab === 'owner_reservations' ? 'text-amber-600 font-semibold border-b-2 border-amber-600 py-1' : ''
                }`}
              >
                Reservation Approvals (FR-8)
              </button>
              <button
                onClick={() => setActiveTab('owner_analytics')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-amber-600 flex items-center gap-1.5 ${
                  activeTab === 'owner_analytics' ? 'text-amber-600 font-semibold border-b-2 border-amber-600 py-1' : ''
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Performance</span>
              </button>
              <button
                onClick={() => setActiveTab('owner_ads')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-amber-600 flex items-center gap-1.5 ${
                  activeTab === 'owner_ads' ? 'text-amber-600 font-semibold border-b-2 border-amber-600 py-1' : ''
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Advertising Tiers</span>
              </button>
            </>
          )}

          {role === 'admin' && (
            <>
              <button
                onClick={() => setActiveTab('admin_businesses')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-amber-600 ${
                  activeTab === 'admin_businesses' ? 'text-amber-600 font-semibold border-b-2 border-amber-600 py-1' : ''
                }`}
              >
                Registrations & Verifications
              </button>
              <button
                onClick={() => setActiveTab('admin_moderation')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-amber-600 ${
                  activeTab === 'admin_moderation' ? 'text-amber-600 font-semibold border-b-2 border-amber-600 py-1' : ''
                }`}
              >
                Listings & Reviews Moderation
              </button>
              <button
                onClick={() => setActiveTab('admin_users')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-amber-600 ${
                  activeTab === 'admin_users' ? 'text-amber-600 font-semibold border-b-2 border-amber-600 py-1' : ''
                }`}
              >
                User Accounts
              </button>
              <button
                onClick={() => setActiveTab('admin_analytics')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-amber-600 ${
                  activeTab === 'admin_analytics' ? 'text-amber-600 font-semibold border-b-2 border-amber-600 py-1' : ''
                }`}
              >
                Platform Analytics & Broadcast
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: 1 primary action & controls cluster */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Low Bandwidth Toggle */}
          <button
            onClick={() => setLowBandwidthMode(!lowBandwidthMode)}
            title="Toggle Low-Bandwidth / Data-Saver Mode for Zambia network conditions (Constraint 2.5)"
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
              lowBandwidthMode 
                ? 'bg-amber-500/10 text-amber-600 border-amber-300 dark:border-amber-700' 
                : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${lowBandwidthMode ? 'fill-amber-600' : ''}`} />
            <span className="hidden xl:inline text-xs">Data Saver</span>
          </button>

          {/* Device Platform Frame Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setPlatform('web')}
              title="Web Responsive View (Chrome, Firefox, Safari)"
              className={`p-1.5 rounded text-xs transition-colors ${
                platform === 'web' 
                  ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-xs font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPlatform('android')}
              title="Android Phone View (Flutter Material 3)"
              className={`p-1.5 rounded text-xs transition-colors ${
                platform === 'android' 
                  ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-xs font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPlatform('ios')}
              title="iOS iPhone View (Flutter Cupertino)"
              className={`p-1.5 rounded text-xs transition-colors ${
                platform === 'ios' 
                  ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-xs font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span className="text-[11px] font-bold px-0.5">iOS</span>
            </button>
          </div>

          {/* Flutter Multi-Platform Code Exporter */}
          <button
            onClick={() => setShowFlutterCode(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
            <span className="whitespace-nowrap">Flutter Code</span>
          </button>

          {/* AI Concierge Chatbot Button */}
          <button
            onClick={() => setShowGeminiChat(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-700 hover:to-amber-600 transition-all flex items-center gap-1.5 shadow-xs"
            title="Open Gemini AI Safari & Stays Chatbot with Google Maps Grounding"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span className="whitespace-nowrap">AI Concierge</span>
          </button>

          {/* Customer Loyalty Points Badge */}
          {role === 'customer' && !isGuest && (
            <button
              onClick={() => setActiveTab('profile')}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-colors shadow-2xs"
              title={`${loyaltyTier}: ${loyaltyPoints.toLocaleString()} points. Click to view profile & rewards.`}
            >
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span className="tabular-nums">{loyaltyPoints.toLocaleString()}</span>
              <span className="text-[10px] text-amber-600/80 uppercase font-semibold">pts</span>
            </button>
          )}

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 hover:border-slate-300 transition-colors"
            >
              <span className="capitalize">{role.replace('_', ' ')}</span>
              <div className="w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-[10px]">
                {role === 'customer' ? 'C' : role === 'business_owner' ? 'B' : 'A'}
              </div>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-2 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Switch Persona</p>
                </div>
                <button
                  onClick={() => { setRole('customer'); setActiveTab('home'); setShowRoleMenu(false); }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                    role === 'customer' ? 'text-amber-600 font-semibold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>Customer (Seeker & Guest)</span>
                  {role === 'customer' && <span className="text-amber-600">✓</span>}
                </button>
                <button
                  onClick={() => { setRole('business_owner'); setActiveTab('owner_listings'); setShowRoleMenu(false); }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                    role === 'business_owner' ? 'text-amber-600 font-semibold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>Business Owner (Host)</span>
                  {role === 'business_owner' && <span className="text-amber-600">✓</span>}
                </button>
                <button
                  onClick={() => { setRole('admin'); setActiveTab('admin_businesses'); setShowRoleMenu(false); }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                    role === 'admin' ? 'text-amber-600 font-semibold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>Administrator (Moderation)</span>
                  {role === 'admin' && <span className="text-amber-600">✓</span>}
                </button>

                <div className="border-t border-slate-100 dark:border-slate-700 my-1 pt-1">
                  <div className="px-3 py-1 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Mode: {isGuest ? 'Guest (Unauthenticated)' : 'Logged In'}</span>
                    <button
                      onClick={() => {
                        if (isGuest) loginAsUser();
                        else logoutToGuest();
                        setShowRoleMenu(false);
                      }}
                      className="text-[11px] text-amber-600 hover:underline font-medium"
                    >
                      {isGuest ? 'Log In' : 'Test Guest'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
