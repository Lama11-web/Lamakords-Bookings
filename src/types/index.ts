export type AccommodationType = 
  | 'Resort' 
  | 'Homestay' 
  | 'Hotel' 
  | 'Lodge' 
  | 'Villa' 
  | 'Apartment' 
  | 'Guest House';

export type UserRole = 'customer' | 'business_owner' | 'admin';

export type PlatformMode = 'web' | 'android' | 'ios';

export interface Listing {
  id: string;
  title: string;
  type: AccommodationType;
  description: string;
  locationName: string;
  city: string; // e.g. Livingstone, Lusaka, South Luangwa, Siavonga, Ndola, Kitwe
  province: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  pricePerNightZMW: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  isFeatured: boolean;
  isPromoted: boolean;
  promotionTier?: 'featured' | 'banner' | 'spotlight';
  businessOwnerId: string;
  businessName: string;
  businessPhone: string;
  businessWhatsApp: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  viewsCount: number;
  clicksCount: number;
  inquiriesCount: number;
  roomsAvailable: number;
  maxGuests: number;
  checkInTime: string;
  checkOutTime: string;
}

export interface Review {
  id: string;
  listingId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  ownerResponse?: {
    text: string;
    date: string;
    author: string;
  };
}

export type PaymentMethod = 'mtn_momo' | 'airtel_money' | 'zamtel_kwacha' | 'bank_card';

export type BookingStatus = 'completed' | 'pending_owner_approval' | 'approved' | 'disapproved' | 'cancelled';

export interface Booking {
  id: string; // LK-2026-XXXX
  listingId: string;
  listingTitle: string;
  listingImage: string;
  listingLocation: string;
  businessName: string;
  businessPhone: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  roomRatePerNightZMW: number;
  serviceFeeZMW: number;
  tourismLevyZMW: number;
  totalZMW: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: PaymentMethod;
  paymentPhoneOrCard: string;
  paymentStatus: BookingStatus;
  createdAt: string;
  receiptNumber: string;
  specialRequests?: string;
}

export interface RideHailingBooking {
  id: string;
  destinationStayId: string;
  destinationStayTitle: string;
  pickupLocation: string;
  dropoffLocation: string;
  rideType: 'Uber ChapChap' | 'UberX' | 'Uber Safari 4x4' | 'Airport Executive';
  estimatedFareZMW: number;
  distanceKm: number;
  durationMins: number;
  status: 'searching' | 'driver_assigned' | 'arriving' | 'in_trip' | 'completed';
  driverName?: string;
  vehicleModel?: string;
  licensePlate?: string;
  driverRating?: number;
  estimatedArrivalMins?: number;
}

export interface AdPackage {
  id: string;
  name: string;
  type: 'featured' | 'banner' | 'spotlight';
  durationDays: number;
  priceZMW: number;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface BusinessRegistration {
  id: string;
  ownerId: string;
  ownerName: string;
  email: string;
  phone: string;
  businessName: string;
  registrationNumber: string;
  taxPayerTpin: string; // Zambian ZRA TPIN
  propertyType: AccommodationType;
  city: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  notes?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'suspended';
  joinedDate: string;
}

export interface PlatformAnnouncement {
  id: string;
  title: string;
  message: string;
  targetRole: 'all' | 'customer' | 'business_owner';
  date: string;
  priority: 'normal' | 'high';
}

export type LoyaltyTier = 'Bronze Safari' | 'Silver Explorer' | 'Gold Victoria' | 'Platinum Luangwa';

export interface LoyaltyTransaction {
  id: string;
  date: string;
  type: 'earned_booking' | 'earned_review' | 'earned_bonus' | 'redeemed_discount';
  points: number; // positive for earned, negative for redeemed
  title: string;
  description: string;
  bookingId?: string;
  listingTitle?: string;
  referenceCode?: string;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  pointsCost: number;
  discountZMW: number;
  description: string;
  tierRequired: LoyaltyTier;
  code: string;
  category: 'discount' | 'perk';
}
