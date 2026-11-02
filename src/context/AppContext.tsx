import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Listing, 
  Review, 
  Booking, 
  AdPackage, 
  BusinessRegistration, 
  UserAccount, 
  PlatformAnnouncement,
  UserRole,
  PlatformMode,
  BookingStatus,
  RideHailingBooking,
  LoyaltyTransaction,
  LoyaltyReward,
  LoyaltyTier
} from '../types';
import { 
  INITIAL_LISTINGS, 
  INITIAL_REVIEWS, 
  INITIAL_BOOKINGS, 
  AD_PACKAGES, 
  INITIAL_BUSINESS_REGISTRATIONS, 
  INITIAL_USERS, 
  INITIAL_ANNOUNCEMENTS,
  INITIAL_LOYALTY_TRANSACTIONS,
  AVAILABLE_LOYALTY_REWARDS
} from '../data/initialData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  platform: PlatformMode;
  setPlatform: (mode: PlatformMode) => void;
  lowBandwidthMode: boolean;
  setLowBandwidthMode: (val: boolean) => void;
  isGuest: boolean;
  setIsGuest: (val: boolean) => void;
  
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  
  // Data
  listings: Listing[];
  reviews: Review[];
  bookings: Booking[];
  adPackages: AdPackage[];
  registrations: BusinessRegistration[];
  users: UserAccount[];
  announcements: PlatformAnnouncement[];
  favorites: string[];
  
  // Modals & Active Flows
  selectedListing: Listing | null;
  setSelectedListing: (listing: Listing | null) => void;
  bookingListing: Listing | null;
  setBookingListing: (listing: Listing | null) => void;
  activeReceipt: Booking | null;
  setActiveReceipt: (booking: Booking | null) => void;
  rideHailingStay: Listing | null;
  setRideHailingStay: (listing: Listing | null) => void;
  showFlutterCode: boolean;
  setShowFlutterCode: (show: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  showGeminiChat: boolean;
  setShowGeminiChat: (show: boolean) => void;

  // Actions
  toggleFavorite: (listingId: string) => boolean;
  addListing: (listing: Omit<Listing, 'id' | 'viewsCount' | 'clicksCount' | 'inquiriesCount'>) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  addReview: (listingId: string, rating: number, comment: string) => void;
  respondToReview: (reviewId: string, replyText: string) => void;
  createBooking: (bookingData: Omit<Booking, 'id' | 'createdAt' | 'receiptNumber'>) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  bookRide: (stay: Listing, pickup: string, rideType: any) => RideHailingBooking;
  activeRides: RideHailingBooking[];
  purchaseAdPackage: (listingId: string, packageId: string) => void;
  approveBusiness: (regId: string) => void;
  rejectBusiness: (regId: string) => void;
  toggleUserSuspension: (userId: string) => void;
  broadcastAnnouncement: (title: string, message: string, targetRole: 'all' | 'customer' | 'business_owner', priority: 'normal' | 'high') => void;
  loginAsUser: () => void;
  logoutToGuest: () => void;

  // Loyalty Points System
  loyaltyTransactions: LoyaltyTransaction[];
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  nextTierPoints: number;
  tierProgressPct: number;
  tierMultiplier: number;
  tierPerks: string[];
  availableRewards: LoyaltyReward[];
  redeemedVouchers: { code: string; title: string; discountZMW: number; date: string }[];
  activeVoucher: { code: string; title: string; discountZMW: number } | null;
  applyVoucher: (voucher: { code: string; title: string; discountZMW: number } | null) => void;
  redeemReward: (reward: LoyaltyReward) => boolean;
  clearActiveVoucher: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const getLoyaltyTierInfo = (points: number) => {
  if (points >= 3500) {
    return {
      tier: 'Platinum Luangwa' as LoyaltyTier,
      nextTier: null,
      pointsToNext: 0,
      progressPct: 100,
      multiplier: 1.5,
      perks: [
        '15% Off VIP Voucher eligibility',
        '1.5x Points Accrual on all Zambian stays',
        'Complimentary VIP Safari Lounge & Airport Transfers',
        'Late 14:00 Checkout & Welcome Zambian Gift Hamper'
      ]
    };
  } else if (points >= 1500) {
    const progress = Math.min(100, Math.round(((points - 1500) / (3500 - 1500)) * 100));
    return {
      tier: 'Gold Victoria' as LoyaltyTier,
      nextTier: 'Platinum Luangwa' as LoyaltyTier,
      pointsToNext: 3500 - points,
      progressPct: progress,
      multiplier: 1.25,
      perks: [
        '10% Room Discount vouchers',
        '1.25x Points Accrual on bookings',
        'Complimentary Airport Pick-up in Livingstone/Lusaka',
        'Priority check-in & breakfast upgrade'
      ]
    };
  } else if (points >= 500) {
    const progress = Math.min(100, Math.round(((points - 500) / (1500 - 500)) * 100));
    return {
      tier: 'Silver Explorer' as LoyaltyTier,
      nextTier: 'Gold Victoria' as LoyaltyTier,
      pointsToNext: 1500 - points,
      progressPct: progress,
      multiplier: 1.1,
      perks: [
        '5% Room rate discounts',
        '1.1x Points Accrual',
        'Free welcome drink (Mosi / fruit juice)',
        'Exclusive member seasonal offers'
      ]
    };
  } else {
    const progress = Math.min(100, Math.round((points / 500) * 100));
    return {
      tier: 'Bronze Safari' as LoyaltyTier,
      nextTier: 'Silver Explorer' as LoyaltyTier,
      pointsToNext: 500 - points,
      progressPct: progress,
      multiplier: 1.0,
      perks: [
        'Earn 1 pt per K10 spent on stays',
        'Redeemable for K100 instant discount vouchers',
        'Review bonus: 50 pts per verified review',
        'Mobile Money instant cashback eligibility'
      ]
    };
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('customer');
  const [platform, setPlatform] = useState<PlatformMode>('web');
  const [lowBandwidthMode, setLowBandwidthMode] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Data with local persistence
  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('lama_listings_v1');
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('lama_reviews_v1');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('lama_bookings_v1');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [adPackages] = useState<AdPackage[]>(AD_PACKAGES);

  const [registrations, setRegistrations] = useState<BusinessRegistration[]>(() => {
    const saved = localStorage.getItem('lama_registrations_v1');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS_REGISTRATIONS;
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('lama_users_v1');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [announcements, setAnnouncements] = useState<PlatformAnnouncement[]>(() => {
    const saved = localStorage.getItem('lama_announcements_v1');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('lama_favorites_v1');
    return saved ? JSON.parse(saved) : ['lst-1', 'lst-5'];
  });

  const [activeRides, setActiveRides] = useState<RideHailingBooking[]>([]);

  // Loyalty System State
  const [loyaltyTransactions, setLoyaltyTransactions] = useState<LoyaltyTransaction[]>(() => {
    const saved = localStorage.getItem('lama_loyalty_tx_v1');
    return saved ? JSON.parse(saved) : INITIAL_LOYALTY_TRANSACTIONS;
  });

  const [redeemedVouchers, setRedeemedVouchers] = useState<{ code: string; title: string; discountZMW: number; date: string }[]>(() => {
    const saved = localStorage.getItem('lama_redeemed_vouchers_v1');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeVoucher, setActiveVoucher] = useState<{ code: string; title: string; discountZMW: number } | null>(null);

  // Modal states
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [bookingListing, setBookingListing] = useState<Listing | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<Booking | null>(null);
  const [rideHailingStay, setRideHailingStay] = useState<Listing | null>(null);
  const [showFlutterCode, setShowFlutterCode] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showGeminiChat, setShowGeminiChat] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('lama_listings_v1', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('lama_reviews_v1', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('lama_bookings_v1', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('lama_favorites_v1', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('lama_registrations_v1', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('lama_users_v1', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('lama_announcements_v1', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('lama_loyalty_tx_v1', JSON.stringify(loyaltyTransactions));
  }, [loyaltyTransactions]);

  useEffect(() => {
    localStorage.setItem('lama_redeemed_vouchers_v1', JSON.stringify(redeemedVouchers));
  }, [redeemedVouchers]);

  // Derived points & tier info
  const loyaltyPoints = loyaltyTransactions.reduce((acc, tx) => acc + tx.points, 0);
  const tierInfo = getLoyaltyTierInfo(loyaltyPoints);

  const applyVoucher = (voucher: { code: string; title: string; discountZMW: number } | null) => {
    setActiveVoucher(voucher);
  };

  const clearActiveVoucher = () => {
    setActiveVoucher(null);
  };

  const redeemReward = (reward: LoyaltyReward): boolean => {
    if (loyaltyPoints < reward.pointsCost) return false;

    const voucherCode = `${reward.code}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx: LoyaltyTransaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'redeemed_discount',
      points: -reward.pointsCost,
      title: `Redeemed: ${reward.title}`,
      description: `Voucher Code: ${voucherCode} (-${reward.pointsCost} pts)`,
      referenceCode: voucherCode
    };

    setLoyaltyTransactions(prev => [newTx, ...prev]);

    setRedeemedVouchers(prev => [
      {
        code: voucherCode,
        title: reward.title,
        discountZMW: reward.discountZMW,
        date: new Date().toISOString().split('T')[0]
      },
      ...prev
    ]);

    // Automatically set as active voucher for next booking
    if (reward.discountZMW > 0) {
      setActiveVoucher({
        code: voucherCode,
        title: reward.title,
        discountZMW: reward.discountZMW
      });
    }

    return true;
  };

  const toggleFavorite = (listingId: string): boolean => {
    if (isGuest) {
      setShowAuthModal(true);
      return false;
    }
    let updated = false;
    setFavorites(prev => {
      if (prev.includes(listingId)) {
        updated = false;
        return prev.filter(id => id !== listingId);
      } else {
        updated = true;
        return [...prev, listingId];
      }
    });
    return updated;
  };

  const addListing = (data: Omit<Listing, 'id' | 'viewsCount' | 'clicksCount' | 'inquiriesCount'>) => {
    const newListing: Listing = {
      ...data,
      id: `lst-${Date.now()}`,
      viewsCount: 0,
      clicksCount: 0,
      inquiriesCount: 0
    };
    setListings(prev => [newListing, ...prev]);
  };

  const updateListing = (id: string, updates: Partial<Listing>) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const addReview = (listingId: string, rating: number, comment: string) => {
    if (isGuest) {
      setShowAuthModal(true);
      return;
    }
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      listingId,
      customerName: 'Mubiana Lamaswala',
      customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      rating,
      date: new Date().toISOString().split('T')[0],
      comment
    };
    setReviews(prev => [newRev, ...prev]);

    // Recalculate listing rating
    setListings(prev => prev.map(l => {
      if (l.id === listingId) {
        const itemReviews = [...reviews.filter(r => r.listingId === listingId), newRev];
        const avg = itemReviews.reduce((acc, r) => acc + r.rating, 0) / itemReviews.length;
        return {
          ...l,
          rating: Number(avg.toFixed(1)),
          reviewCount: itemReviews.length
        };
      }
      return l;
    }));

    // Award review bonus points (+50 pts)
    const reviewBonusTx: LoyaltyTransaction = {
      id: `tx-rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'earned_review',
      points: 50,
      title: 'Verified Stay Review Bonus',
      description: 'Earned 50 loyalty points for reviewing accommodation.'
    };
    setLoyaltyTransactions(prev => [reviewBonusTx, ...prev]);
  };

  const respondToReview = (reviewId: string, replyText: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          ownerResponse: {
            author: 'Property Manager',
            text: replyText,
            date: new Date().toISOString().split('T')[0]
          }
        };
      }
      return r;
    }));
  };

  const createBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'receiptNumber'>): Booking => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      ...bookingData,
      id: `LK-2026-${randomNum}`,
      createdAt: new Date().toLocaleString(),
      receiptNumber: `REC-ZMW-${randomNum}-LK`
    };

    setBookings(prev => [newBooking, ...prev]);

    // Award loyalty points for booking
    const basePts = Math.floor(newBooking.totalZMW / 10);
    const earnedPts = Math.round(basePts * tierInfo.multiplier);

    const loyaltyTx: LoyaltyTransaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'earned_booking',
      points: earnedPts,
      title: `Stay at ${newBooking.listingTitle}`,
      description: `Earned on booking ${newBooking.id} (ZMW ${newBooking.totalZMW.toLocaleString()} total · ${tierInfo.tier} tier ${tierInfo.multiplier}x).`,
      bookingId: newBooking.id,
      listingTitle: newBooking.listingTitle
    };

    setLoyaltyTransactions(prev => [loyaltyTx, ...prev]);

    // Clear active voucher if used
    if (activeVoucher) {
      clearActiveVoucher();
    }

    // Update listing inquiries & booking counts
    setListings(prev => prev.map(l => {
      if (l.id === bookingData.listingId) {
        return {
          ...l,
          inquiriesCount: l.inquiriesCount + 1,
          clicksCount: l.clicksCount + 1
        };
      }
      return l;
    }));

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, paymentStatus: status } : b));
  };

  const bookRide = (stay: Listing, pickup: string, rideType: any): RideHailingBooking => {
    const drivers = [
      { name: 'Kabwe Chileshe', car: 'Toyota Passo (Silver)', plate: 'ALB 4492 ZM', rating: 4.9 },
      { name: 'Mumba Musonda', car: 'Toyota Corolla Axio (White)', plate: 'BAE 1820 ZM', rating: 4.8 },
      { name: 'Mulenga Banda', car: 'Toyota Fortuner 4x4 (Black)', plate: 'CAG 9912 ZM', rating: 5.0 },
      { name: 'Chileshe Tembo', car: 'Mercedes-Benz E250', plate: 'LU 7701 ZM', rating: 4.95 }
    ];
    const assigned = drivers[Math.floor(Math.random() * drivers.length)];
    
    // Distances
    const distanceKm = Math.floor(12 + Math.random() * 25);
    const ratePerKm = rideType.includes('Safari') ? 28 : rideType.includes('Chap') ? 14 : 18;
    const fare = Math.round(distanceKm * ratePerKm + 50);

    const newRide: RideHailingBooking = {
      id: `RIDE-${Date.now()}`,
      destinationStayId: stay.id,
      destinationStayTitle: stay.title,
      pickupLocation: pickup,
      dropoffLocation: `${stay.title}, ${stay.locationName}`,
      rideType: rideType,
      estimatedFareZMW: fare,
      distanceKm: distanceKm,
      durationMins: Math.round(distanceKm * 2.2),
      status: 'driver_assigned',
      driverName: assigned.name,
      vehicleModel: assigned.car,
      licensePlate: assigned.plate,
      driverRating: assigned.rating,
      estimatedArrivalMins: Math.floor(4 + Math.random() * 8)
    };

    setActiveRides(prev => [newRide, ...prev]);
    return newRide;
  };

  const purchaseAdPackage = (listingId: string, packageId: string) => {
    const selectedPkg = adPackages.find(p => p.id === packageId);
    if (!selectedPkg) return;

    setListings(prev => prev.map(l => {
      if (l.id === listingId) {
        return {
          ...l,
          isPromoted: true,
          isFeatured: selectedPkg.type === 'featured' || l.isFeatured,
          promotionTier: selectedPkg.type
        };
      }
      return l;
    }));
  };

  const approveBusiness = (regId: string) => {
    setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status: 'approved' } : r));
  };

  const rejectBusiness = (regId: string) => {
    setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status: 'rejected' } : r));
  };

  const toggleUserSuspension = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
      }
      return u;
    }));
  };

  const broadcastAnnouncement = (
    title: string, 
    message: string, 
    targetRole: 'all' | 'customer' | 'business_owner', 
    priority: 'normal' | 'high'
  ) => {
    const newAnn: PlatformAnnouncement = {
      id: `ann-${Date.now()}`,
      title,
      message,
      targetRole,
      priority,
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const loginAsUser = () => {
    setIsGuest(false);
  };

  const logoutToGuest = () => {
    setIsGuest(true);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        platform,
        setPlatform,
        lowBandwidthMode,
        setLowBandwidthMode,
        isGuest,
        setIsGuest,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        listings,
        reviews,
        bookings,
        adPackages,
        registrations,
        users,
        announcements,
        favorites,
        selectedListing,
        setSelectedListing,
        bookingListing,
        setBookingListing,
        activeReceipt,
        setActiveReceipt,
        rideHailingStay,
        setRideHailingStay,
        showFlutterCode,
        setShowFlutterCode,
        showAuthModal,
        setShowAuthModal,
        showGeminiChat,
        setShowGeminiChat,
        toggleFavorite,
        addListing,
        updateListing,
        deleteListing,
        addReview,
        respondToReview,
        createBooking,
        updateBookingStatus,
        bookRide,
        activeRides,
        purchaseAdPackage,
        approveBusiness,
        rejectBusiness,
        toggleUserSuspension,
        broadcastAnnouncement,
        loginAsUser,
        logoutToGuest,

        // Loyalty Points System
        loyaltyTransactions,
        loyaltyPoints,
        loyaltyTier: tierInfo.tier,
        nextTierPoints: tierInfo.pointsToNext,
        tierProgressPct: tierInfo.progressPct,
        tierMultiplier: tierInfo.multiplier,
        tierPerks: tierInfo.perks,
        availableRewards: AVAILABLE_LOYALTY_REWARDS,
        redeemedVouchers,
        activeVoucher,
        applyVoucher,
        redeemReward,
        clearActiveVoucher
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
