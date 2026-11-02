import { 
  Listing, 
  Review, 
  AdPackage, 
  Booking, 
  BusinessRegistration, 
  UserAccount, 
  PlatformAnnouncement,
  LoyaltyTransaction,
  LoyaltyReward
} from '../types';

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'lst-1',
    title: 'Zambezi River Safari Lodge & Luxury Chalets',
    type: 'Lodge',
    description: 'Immerse yourself in authentic Zambian wildlife luxury. Situated right on the riverbank overlooking South Luangwa National Park, featuring private open-air sun decks, sunset game viewing, and eco-solar powered suites.',
    locationName: 'Mfuwe Riverbank, South Luangwa',
    city: 'South Luangwa',
    province: 'Eastern Province',
    coordinates: { lat: -13.1025, lng: 31.7821 },
    pricePerNightZMW: 3850,
    rating: 4.9,
    reviewCount: 38,
    images: [
      '/src/assets/images/hero_safari_lodge_1793607521562.jpg',
      '/src/assets/images/boutique_hotel_lusaka_1793607522863.jpg'
    ],
    amenities: [
      'Solar Power Backup',
      'Free High-Speed WiFi',
      'Swimming Pool',
      'Safari Game Drives',
      'Complimentary Breakfast',
      'Restaurant & Bush Bar',
      'Airport Shuttle (Mfuwe)',
      '24/7 Armed Security'
    ],
    isFeatured: true,
    isPromoted: true,
    promotionTier: 'featured',
    businessOwnerId: 'own-1',
    businessName: 'Zambezi Safari Experiences Ltd',
    businessPhone: '+260 96 845 2210',
    businessWhatsApp: '+260968452210',
    verificationStatus: 'verified',
    viewsCount: 1420,
    clicksCount: 480,
    inquiriesCount: 94,
    roomsAvailable: 5,
    maxGuests: 4,
    checkInTime: '14:00',
    checkOutTime: '11:00'
  },
  {
    id: 'lst-2',
    title: 'The Palm Horizon Boutique Hotel',
    type: 'Hotel',
    description: 'A five-star sanctuary in the heart of Lusaka. Modern architectural design featuring an azure infinity lap pool, tropical gardens, fine dining lounge, and 24-hour backup generator power for seamless stays.',
    locationName: 'Rhodes Park, Lusaka',
    city: 'Lusaka',
    province: 'Lusaka Province',
    coordinates: { lat: -15.4167, lng: 28.3056 },
    pricePerNightZMW: 2600,
    rating: 4.8,
    reviewCount: 64,
    images: [
      '/src/assets/images/boutique_hotel_lusaka_1793607522863.jpg',
      '/src/assets/images/urban_apartment_kitwe_1793607523523.jpg'
    ],
    amenities: [
      'Full Generator Backup',
      'High-Speed Fiber WiFi',
      'Air Conditioning',
      'Poolside Cocktail Bar',
      'Executive Boardroom',
      'Fitness Center',
      'Borehole Clean Water',
      'Free Valet Parking'
    ],
    isFeatured: true,
    isPromoted: true,
    promotionTier: 'spotlight',
    businessOwnerId: 'own-2',
    businessName: 'Horizon Hospitality Lusaka',
    businessPhone: '+260 97 732 1199',
    businessWhatsApp: '+260977321199',
    verificationStatus: 'verified',
    viewsCount: 2210,
    clicksCount: 790,
    inquiriesCount: 182,
    roomsAvailable: 8,
    maxGuests: 2,
    checkInTime: '13:00',
    checkOutTime: '12:00'
  },
  {
    id: 'lst-3',
    title: 'Kariba Horizon Lakeside Cliff Villas',
    type: 'Resort',
    description: 'Breathtaking waterfront resort perched over Lake Kariba in Siavonga. Enjoy private infinity pools, panoramic views of the Zimbabwean hillside, fresh Kariba bream dining, and sunset boat cruises.',
    locationName: 'Cliff Road, Siavonga',
    city: 'Siavonga',
    province: 'Southern Province',
    coordinates: { lat: -16.5381, lng: 28.7089 },
    pricePerNightZMW: 3200,
    rating: 4.9,
    reviewCount: 42,
    images: [
      '/src/assets/images/kariba_resort_villas_1793607522514.jpg',
      '/src/assets/images/hero_safari_lodge_1793607521562.jpg'
    ],
    amenities: [
      'Private Infinity Pool',
      'Lakefront Sunset Deck',
      'Solar & Inverter Power',
      'Boat Cruise Charters',
      'Fresh Fish BBQ Station',
      'Air Conditioning',
      'High-Speed WiFi',
      'Full Kitchen'
    ],
    isFeatured: true,
    isPromoted: false,
    businessOwnerId: 'own-1',
    businessName: 'Zambezi Safari Experiences Ltd',
    businessPhone: '+260 96 845 2210',
    businessWhatsApp: '+260968452210',
    verificationStatus: 'verified',
    viewsCount: 1890,
    clicksCount: 610,
    inquiriesCount: 110,
    roomsAvailable: 3,
    maxGuests: 6,
    checkInTime: '14:00',
    checkOutTime: '10:30'
  },
  {
    id: 'lst-4',
    title: 'The Copper Executive Serviced Suites',
    type: 'Apartment',
    description: 'Designer modern serviced apartments with skyline views over the Copperbelt. Ideal for business travellers and expatriates, featuring fully fitted induction kitchens, smart LED TVs, ergonomic workspaces, and secure access.',
    locationName: 'Riverside, Kitwe',
    city: 'Kitwe',
    province: 'Copperbelt Province',
    coordinates: { lat: -12.8024, lng: 28.2132 },
    pricePerNightZMW: 1950,
    rating: 4.7,
    reviewCount: 29,
    images: [
      '/src/assets/images/urban_apartment_kitwe_1793607523523.jpg',
      '/src/assets/images/boutique_hotel_lusaka_1793607522863.jpg'
    ],
    amenities: [
      'Full Kitchen & Dishwasher',
      'Dedicated Workstation',
      '100Mbps Fiber WiFi',
      'Automatic Inverter System',
      'Washing Machine & Dryer',
      'Secure Gated Estate',
      'Underground Parking',
      'DSTV HD Premium'
    ],
    isFeatured: false,
    isPromoted: true,
    promotionTier: 'banner',
    businessOwnerId: 'own-3',
    businessName: 'Copperbelt Living Stays',
    businessPhone: '+260 95 510 4488',
    businessWhatsApp: '+260955104488',
    verificationStatus: 'verified',
    viewsCount: 940,
    clicksCount: 310,
    inquiriesCount: 65,
    roomsAvailable: 4,
    maxGuests: 3,
    checkInTime: '12:00',
    checkOutTime: '11:00'
  },
  {
    id: 'lst-5',
    title: 'Mosi-oa-Tunya Royal Victoria Falls Villa',
    type: 'Villa',
    description: 'Private 3-bedroom colonial-meets-contemporary villa located just 7 minutes from the Victoria Falls entrance. Features a private plunge pool, secluded landscaped garden, outdoor braai barbecue, and personal concierge.',
    locationName: 'Musunse Road, Livingstone',
    city: 'Livingstone',
    province: 'Southern Province',
    coordinates: { lat: -17.8419, lng: 25.8544 },
    pricePerNightZMW: 4200,
    rating: 5.0,
    reviewCount: 51,
    images: [
      '/src/assets/images/kariba_resort_villas_1793607522514.jpg',
      '/src/assets/images/hero_safari_lodge_1793607521562.jpg'
    ],
    amenities: [
      'Private Plunge Pool',
      '7 Mins to Victoria Falls',
      'Chef Available on Request',
      'Air Conditioning',
      'Solar Water Heating',
      'Garden Braai Firepit',
      'Airport Pick-up Included',
      'Security Guard On-Site'
    ],
    isFeatured: true,
    isPromoted: true,
    promotionTier: 'featured',
    businessOwnerId: 'own-2',
    businessName: 'Horizon Hospitality Lusaka',
    businessPhone: '+260 97 732 1199',
    businessWhatsApp: '+260977321199',
    verificationStatus: 'verified',
    viewsCount: 2650,
    clicksCount: 920,
    inquiriesCount: 240,
    roomsAvailable: 2,
    maxGuests: 8,
    checkInTime: '15:00',
    checkOutTime: '11:00'
  },
  {
    id: 'lst-6',
    title: 'Mukwa Cultural Garden Homestay',
    type: 'Homestay',
    description: 'Experience genuine Zambian warmth and culture in this tranquil family estate. Enjoy home-cooked nshima with fresh local relishes, fruit orchards, cultural storytelling by the fire, and comfortable en-suite rooms.',
    locationName: 'Maramba Valley, Livingstone',
    city: 'Livingstone',
    province: 'Southern Province',
    coordinates: { lat: -17.825, lng: 25.861 },
    pricePerNightZMW: 850,
    rating: 4.8,
    reviewCount: 31,
    images: [
      '/src/assets/images/boutique_hotel_lusaka_1793607522863.jpg',
      '/src/assets/images/hero_safari_lodge_1793607521562.jpg'
    ],
    amenities: [
      'Home-cooked Zambian Meals',
      'Cultural Firepit Evenings',
      'Free WiFi',
      'Solar Lighting Backup',
      'Borehole Filtered Water',
      'Organic Fruit Orchard',
      'Guided Market Tour'
    ],
    isFeatured: false,
    isPromoted: false,
    businessOwnerId: 'own-4',
    businessName: 'Mukwa Heritage Stays',
    businessPhone: '+260 96 112 8844',
    businessWhatsApp: '+260961128844',
    verificationStatus: 'verified',
    viewsCount: 680,
    clicksCount: 195,
    inquiriesCount: 42,
    roomsAvailable: 3,
    maxGuests: 2,
    checkInTime: '13:00',
    checkOutTime: '10:00'
  },
  {
    id: 'lst-7',
    title: 'Kabulonga Heritage Boutique Guest House',
    type: 'Guest House',
    description: 'An elegant private retreat in the upscale diplomatic suburb of Kabulonga, Lusaka. Shaded gardens with jacaranda trees, homemade breakfasts, fast optical fiber, and proximity to shopping centers and embassy row.',
    locationName: 'Kabulonga, Lusaka',
    city: 'Lusaka',
    province: 'Lusaka Province',
    coordinates: { lat: -15.421, lng: 28.349 },
    pricePerNightZMW: 1450,
    rating: 4.6,
    reviewCount: 22,
    images: [
      '/src/assets/images/urban_apartment_kitwe_1793607523523.jpg',
      '/src/assets/images/boutique_hotel_lusaka_1793607522863.jpg'
    ],
    amenities: [
      'Daily English / Zambian Breakfast',
      'Quiet Diplomatic Area',
      'Automatic Inverter System',
      'High-Speed WiFi',
      'Air Conditioning',
      'Private Garden Patio',
      'Secured Parking'
    ],
    isFeatured: false,
    isPromoted: false,
    businessOwnerId: 'own-3',
    businessName: 'Copperbelt Living Stays',
    businessPhone: '+260 95 510 4488',
    businessWhatsApp: '+260955104488',
    verificationStatus: 'verified',
    viewsCount: 540,
    clicksCount: 160,
    inquiriesCount: 38,
    roomsAvailable: 4,
    maxGuests: 2,
    checkInTime: '14:00',
    checkOutTime: '10:30'
  },
  {
    id: 'lst-8',
    title: 'Kansenshi Hillside Executive Suites',
    type: 'Apartment',
    description: 'Modern luxury 2-bedroom executive duplex in Kansenshi, Ndola. Equipped with standby generator, high-speed fibre internet, and 24-hour security guards. Perfect for corporate travel and long-term relocations.',
    locationName: 'Kansenshi, Ndola',
    city: 'Ndola',
    province: 'Copperbelt Province',
    coordinates: { lat: -12.9694, lng: 28.6366 },
    pricePerNightZMW: 1750,
    rating: 4.7,
    reviewCount: 19,
    images: [
      '/src/assets/images/urban_apartment_kitwe_1793607523523.jpg',
      '/src/assets/images/kariba_resort_villas_1793607522514.jpg'
    ],
    amenities: [
      'Standby Generator',
      'Fibre WiFi',
      'Fully Furnished Kitchen',
      'Smart TV with DSTV',
      'Swimming Pool Access',
      'Housekeeping Service',
      'Gated Complex'
    ],
    isFeatured: false,
    isPromoted: false,
    businessOwnerId: 'own-3',
    businessName: 'Copperbelt Living Stays',
    businessPhone: '+260 95 510 4488',
    businessWhatsApp: '+260955104488',
    verificationStatus: 'verified',
    viewsCount: 420,
    clicksCount: 125,
    inquiriesCount: 26,
    roomsAvailable: 3,
    maxGuests: 4,
    checkInTime: '12:00',
    checkOutTime: '11:00'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    listingId: 'lst-1',
    customerName: 'Chanda Mwila',
    rating: 5,
    date: '2026-10-24',
    comment: 'Spectacular stay! Watching the elephants cross the river while sipping tea on the wooden deck was unforgettable. The staff were exceptionally welcoming and the food was top-notch.',
    ownerResponse: {
      author: 'Zambezi Safari Management',
      text: 'Mwebantu Chanda! Thank you for spending time with us. The elephants love that crossing point! We look forward to welcoming you back during the dry season.',
      date: '2026-10-25'
    }
  },
  {
    id: 'rev-2',
    listingId: 'lst-1',
    customerName: 'Sarah Jenkins',
    rating: 5,
    date: '2026-10-18',
    comment: 'The solar setup worked flawlessly throughout our three days. Super clean rooms and game drives guided by experienced rangers.',
    ownerResponse: {
      author: 'Zambezi Safari Management',
      text: 'Thank you Sarah! We take pride in 100% clean solar energy in the park.',
      date: '2026-10-19'
    }
  },
  {
    id: 'rev-3',
    listingId: 'lst-2',
    customerName: 'Kondwani Banda',
    rating: 5,
    date: '2026-10-29',
    comment: 'Best boutique hotel in Lusaka by far. Quiet, ultra-clean, and when load shedding occurred in town, the generator kicked in within 2 seconds without our meetings skipping a beat.',
    ownerResponse: {
      author: 'Horizon Hospitality General Manager',
      text: 'Zikomo kwambiri Kondwani. We ensure 24/7 uninterrupted power and fast WiFi for our esteemed guests.',
      date: '2026-10-30'
    }
  },
  {
    id: 'rev-4',
    listingId: 'lst-3',
    customerName: 'Thabo Ndlovu',
    rating: 5,
    date: '2026-10-12',
    comment: 'The infinity pool overlooking Lake Kariba is worth every Kwacha. We booked a sunset cruise right at the front desk and caught delicious bream.',
    ownerResponse: {
      author: 'Kariba Cliff Villas Host',
      text: 'Thank you Thabo! Kariba sunsets never fail to amaze. Come again soon!',
      date: '2026-10-13'
    }
  }
];

export const POPULAR_DESTINATIONS = [
  {
    id: 'dest-1',
    name: 'Livingstone & Victoria Falls',
    tagline: 'Home of the mighty Mosi-oa-Tunya',
    staysCount: 38,
    image: '/src/assets/images/kariba_resort_villas_1793607522514.jpg',
    city: 'Livingstone'
  },
  {
    id: 'dest-2',
    name: 'Lusaka Capital City',
    tagline: 'Diplomatic hub, vibrant nightlife & commerce',
    staysCount: 54,
    image: '/src/assets/images/boutique_hotel_lusaka_1793607522863.jpg',
    city: 'Lusaka'
  },
  {
    id: 'dest-3',
    name: 'South Luangwa National Park',
    tagline: 'World-renowned walking safaris & leopard density',
    staysCount: 22,
    image: '/src/assets/images/hero_safari_lodge_1793607521562.jpg',
    city: 'South Luangwa'
  },
  {
    id: 'dest-4',
    name: 'Lake Kariba & Siavonga',
    tagline: 'The Zambian Riviera, houseboats & freshwater bream',
    staysCount: 19,
    image: '/src/assets/images/kariba_resort_villas_1793607522514.jpg',
    city: 'Siavonga'
  },
  {
    id: 'dest-5',
    name: 'Copperbelt (Ndola & Kitwe)',
    tagline: 'Mining executive suites & business stays',
    staysCount: 27,
    image: '/src/assets/images/urban_apartment_kitwe_1793607523523.jpg',
    city: 'Kitwe'
  }
];

export const AD_PACKAGES: AdPackage[] = [
  {
    id: 'pkg-1',
    name: 'Featured Listing Boost',
    type: 'featured',
    durationDays: 14,
    priceZMW: 1200,
    description: 'Pin your stay at the top of search results and category filters with a prominent Featured badge.',
    features: [
      'Rank in top 3 of your category',
      'Prominent Featured badge on card',
      '3.5x higher view-to-inquiry rate',
      'Weekly performance analytics summary'
    ],
    recommended: true
  },
  {
    id: 'pkg-2',
    name: 'Home Spotlight Hero',
    type: 'spotlight',
    durationDays: 30,
    priceZMW: 3200,
    description: 'The premier placement. Showcase your property directly on the home screen hero carousel to all visitors.',
    features: [
      'Full-width hero placement on Home',
      'Direct WhatsApp and Call button in hero',
      'Featured in push notification blast',
      'Dedicated marketing promotion across app'
    ]
  },
  {
    id: 'pkg-3',
    name: 'Category Top Banner',
    type: 'banner',
    durationDays: 7,
    priceZMW: 650,
    description: 'High visibility banner ad whenever customers search for stays in your province or business type.',
    features: [
      'Header banner on category pages',
      'Direct 1-tap booking link',
      'Click-through analytics tracker'
    ]
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'LK-2026-8491',
    listingId: 'lst-1',
    listingTitle: 'Zambezi River Safari Lodge & Luxury Chalets',
    listingImage: '/src/assets/images/hero_safari_lodge_1793607521562.jpg',
    listingLocation: 'Mfuwe Riverbank, South Luangwa',
    businessName: 'Zambezi Safari Experiences Ltd',
    businessPhone: '+260 96 845 2210',
    checkIn: '2026-11-14',
    checkOut: '2026-11-17',
    nights: 3,
    guests: 2,
    roomRatePerNightZMW: 3850,
    serviceFeeZMW: 250,
    tourismLevyZMW: 173,
    totalZMW: 11973,
    customerName: 'Mubiana Lamaswala',
    customerEmail: 'mubianalamaswala311@gmail.com',
    customerPhone: '+260 97 123 4567',
    paymentMethod: 'mtn_momo',
    paymentPhoneOrCard: '+260 96 554 9901',
    paymentStatus: 'pending_owner_approval',
    createdAt: '2026-11-01 14:22',
    receiptNumber: 'REC-ZMW-8491-LK',
    specialRequests: 'River view room preferred and airport transfer from Mfuwe.'
  },
  {
    id: 'LK-2026-7910',
    listingId: 'lst-2',
    listingTitle: 'The Palm Horizon Boutique Hotel',
    listingImage: '/src/assets/images/boutique_hotel_lusaka_1793607522863.jpg',
    listingLocation: 'Rhodes Park, Lusaka',
    businessName: 'Horizon Hospitality Lusaka',
    businessPhone: '+260 97 732 1199',
    checkIn: '2026-11-05',
    checkOut: '2026-11-07',
    nights: 2,
    guests: 1,
    roomRatePerNightZMW: 2600,
    serviceFeeZMW: 180,
    tourismLevyZMW: 117,
    totalZMW: 5497,
    customerName: 'Mubiana Lamaswala',
    customerEmail: 'mubianalamaswala311@gmail.com',
    customerPhone: '+260 97 123 4567',
    paymentMethod: 'airtel_money',
    paymentPhoneOrCard: '+260 97 889 0012',
    paymentStatus: 'completed',
    createdAt: '2026-10-28 09:15',
    receiptNumber: 'REC-ZMW-7910-LK'
  }
];

export const INITIAL_BUSINESS_REGISTRATIONS: BusinessRegistration[] = [
  {
    id: 'reg-1',
    ownerId: 'own-1',
    ownerName: 'Kasapo Mulenga',
    email: 'kasapo@zambezisafari.co.zm',
    phone: '+260 96 845 2210',
    businessName: 'Zambezi Safari Experiences Ltd',
    registrationNumber: 'PACRA-1209384',
    taxPayerTpin: '1004928192',
    propertyType: 'Lodge',
    city: 'South Luangwa',
    status: 'approved',
    submittedDate: '2026-10-01'
  },
  {
    id: 'reg-2',
    ownerId: 'own-2',
    ownerName: 'Natasha Phiri',
    email: 'natasha@horizonlusaka.com',
    phone: '+260 97 732 1199',
    businessName: 'Horizon Hospitality Lusaka',
    registrationNumber: 'PACRA-994821',
    taxPayerTpin: '1008821943',
    propertyType: 'Hotel',
    city: 'Lusaka',
    status: 'approved',
    submittedDate: '2026-10-05'
  },
  {
    id: 'reg-3',
    ownerId: 'own-5',
    ownerName: 'Bwalya Chileshe',
    email: 'bwalya@samfyaresort.co.zm',
    phone: '+260 96 443 1188',
    businessName: 'Samfya White Beach Resort Ltd',
    registrationNumber: 'PACRA-445892',
    taxPayerTpin: '1003328114',
    propertyType: 'Resort',
    city: 'Samfya',
    status: 'pending',
    submittedDate: '2026-11-01',
    notes: 'Awaiting verified PACRA certificate upload.'
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-cust-1',
    name: 'Mubiana Lamaswala',
    email: 'mubianalamaswala311@gmail.com',
    phone: '+260 97 123 4567',
    role: 'customer',
    status: 'active',
    joinedDate: '2026-09-15'
  },
  {
    id: 'usr-own-1',
    name: 'Kasapo Mulenga',
    email: 'kasapo@zambezisafari.co.zm',
    phone: '+260 96 845 2210',
    role: 'business_owner',
    status: 'active',
    joinedDate: '2026-10-01'
  },
  {
    id: 'usr-own-2',
    name: 'Natasha Phiri',
    email: 'natasha@horizonlusaka.com',
    phone: '+260 97 732 1199',
    role: 'business_owner',
    status: 'active',
    joinedDate: '2026-10-05'
  },
  {
    id: 'usr-adm-1',
    name: 'Lama Kords Admin',
    email: 'admin@lamakords.com',
    phone: '+260 96 000 0001',
    role: 'admin',
    status: 'active',
    joinedDate: '2026-01-01'
  }
];

export const INITIAL_ANNOUNCEMENTS: PlatformAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Peak Safari Season Promotion Active',
    message: 'Business owners can now boost their lodges and homestays with our 14-day Featured placement at 20% off ahead of the tourism season.',
    targetRole: 'business_owner',
    date: '2026-11-01',
    priority: 'high'
  },
  {
    id: 'ann-2',
    title: 'MTN MoMo & Airtel Money Instant Checkouts Available',
    message: 'Guests can now book stays and reserve rides seamlessly using their Zambian Mobile Money wallets with automated instant SMS verification.',
    targetRole: 'all',
    date: '2026-10-28',
    priority: 'normal'
  }
];

export const AVAILABLE_LOYALTY_REWARDS: LoyaltyReward[] = [
  {
    id: 'rew-1',
    title: 'K100 Stay Discount Voucher',
    pointsCost: 500,
    discountZMW: 100,
    description: 'Instant K100 deduction applied to your room rate on any lodge, hotel, or apartment booking in Zambia.',
    tierRequired: 'Bronze Safari',
    code: 'LK-KW-100',
    category: 'discount'
  },
  {
    id: 'rew-2',
    title: 'K250 Luxury Safari Voucher',
    pointsCost: 1000,
    discountZMW: 250,
    description: 'Save K250 on premium resorts and safari lodges in Livingstone, South Luangwa, or Lake Kariba.',
    tierRequired: 'Silver Explorer',
    code: 'LK-SAFARI-250',
    category: 'discount'
  },
  {
    id: 'rew-3',
    title: 'K500 Victoria Falls VIP Voucher',
    pointsCost: 1800,
    discountZMW: 500,
    description: 'Major K500 discount for multi-night stays and villas across Zambia.',
    tierRequired: 'Gold Victoria',
    code: 'LK-MOSI-500',
    category: 'discount'
  },
  {
    id: 'rew-4',
    title: 'Livingstone / Lusaka Airport Transfer Perk',
    pointsCost: 1200,
    discountZMW: 350,
    description: 'Free private chauffeur transfer from Harry Mwaanga Nkumbula (LVI) or Kenneth Kaunda (KKIA) airport to your stay.',
    tierRequired: 'Silver Explorer',
    code: 'LK-AIRPORT-RIDE',
    category: 'perk'
  },
  {
    id: 'rew-5',
    title: 'K1,000 Executive Presidential Voucher',
    pointsCost: 3200,
    discountZMW: 1000,
    description: 'The highest tier loyalty award: K1,000 off luxury suites and private safari villas.',
    tierRequired: 'Platinum Luangwa',
    code: 'LK-VIP-1000',
    category: 'discount'
  }
];

export const INITIAL_LOYALTY_TRANSACTIONS: LoyaltyTransaction[] = [
  {
    id: 'tx-1',
    date: '2026-10-01',
    type: 'earned_bonus',
    points: 200,
    title: 'Welcome to Lama Kords Rewards',
    description: 'Sign-up welcome points credited to your Zambian Explorer profile.'
  },
  {
    id: 'tx-2',
    date: '2026-10-28',
    type: 'earned_booking',
    points: 550,
    title: 'Stay at The Palm Horizon Hotel',
    description: 'Points earned on booking LK-2026-7910 (ZMW 5,497 total).',
    bookingId: 'LK-2026-7910',
    listingTitle: 'The Palm Horizon Boutique Hotel'
  },
  {
    id: 'tx-3',
    date: '2026-10-29',
    type: 'earned_review',
    points: 50,
    title: 'Verified Stay Review Bonus',
    description: 'Earned 50 points for reviewing The Palm Horizon Boutique Hotel.'
  },
  {
    id: 'tx-4',
    date: '2026-11-01',
    type: 'earned_booking',
    points: 1197,
    title: 'Stay at Zambezi River Safari Lodge',
    description: 'Points earned on booking LK-2026-8491 (ZMW 11,973 total).',
    bookingId: 'LK-2026-8491',
    listingTitle: 'Zambezi River Safari Lodge & Luxury Chalets'
  }
];
