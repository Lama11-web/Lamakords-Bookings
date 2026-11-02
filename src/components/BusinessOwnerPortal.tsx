import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing, AccommodationType } from '../types';
import { 
  Building2, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BarChart3, 
  Sparkles, 
  MessageSquare, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  Calendar, 
  DollarSign, 
  Send,
  Eye,
  MousePointer,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export const BusinessOwnerPortal: React.FC = () => {
  const { 
    listings, 
    addListing, 
    updateListing, 
    deleteListing, 
    bookings, 
    updateBookingStatus, 
    reviews, 
    respondToReview, 
    adPackages, 
    purchaseAdPackage,
    setActiveReceipt
  } = useApp();

  const [activeOwnerTab, setActiveOwnerTab] = useState<'listings' | 'reservations' | 'reviews' | 'analytics' | 'ads'>('listings');
  
  // Listing modal state
  const [showAddListingModal, setShowAddListingModal] = useState<boolean>(false);
  const [editingListingId, setEditingListingId] = useState<string | null>(null);

  // New listing form
  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<AccommodationType>('Lodge');
  const [city, setCity] = useState<string>('Livingstone');
  const [province, setProvince] = useState<string>('Southern Province');
  const [locationName, setLocationName] = useState<string>('');
  const [priceZMW, setPriceZMW] = useState<number>(2500);
  const [description, setDescription] = useState<string>('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Solar Power Backup', 
    'Free High-Speed WiFi', 
    'Swimming Pool'
  ]);
  const [selectedImages, setSelectedImages] = useState<string[]>([
    '/src/assets/images/hero_safari_lodge_1793607521562.jpg',
    '/src/assets/images/boutique_hotel_lusaka_1793607522863.jpg'
  ]);

  // Review reply state
  const [replyTextMap, setReplyTextMap] = useState<{ [reviewId: string]: string }>({});
  const [aiGeneratingReviewId, setAiGeneratingReviewId] = useState<string | null>(null);
  const [isEnhancingListingAI, setIsEnhancingListingAI] = useState<boolean>(false);

  const handleGenerateAIReply = async (rev: any) => {
    setAiGeneratingReviewId(rev.id);
    try {
      const res = await fetch('/api/host-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'reply_review',
          payload: {
            customerName: rev.customerName,
            rating: rev.rating,
            comment: rev.comment,
            stayTitle: 'Zambezi River Safari Lodge'
          }
        })
      });
      const data = await res.json();
      if (data.result) {
        setReplyTextMap(prev => ({ ...prev, [rev.id]: data.result }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiGeneratingReviewId(null);
    }
  };

  const handleAIEnhanceDescription = async () => {
    setIsEnhancingListingAI(true);
    try {
      const res = await fetch('/api/host-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'enhance_listing',
          payload: {
            title: title || 'Safari Chalets',
            type,
            city,
            notes: description || 'Modern suites, solar backup, river views, game drives',
            priceZMW
          }
        })
      });
      const data = await res.json();
      if (data.result) {
        setDescription(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancingListingAI(false);
    }
  };

  // Filter listings belonging to this host
  const ownerListings = listings; // in sandbox, user manages current listings
  const pendingReservations = bookings.filter(b => b.paymentStatus === 'pending_owner_approval');

  // Total analytics calculations (FR-5)
  const totalViews = ownerListings.reduce((sum, l) => sum + l.viewsCount, 0);
  const totalClicks = ownerListings.reduce((sum, l) => sum + l.clicksCount, 0);
  const totalInquiries = ownerListings.reduce((sum, l) => sum + l.inquiriesCount, 0);
  const totalEarningsZMW = bookings
    .filter(b => b.paymentStatus === 'completed' || b.paymentStatus === 'approved')
    .reduce((sum, b) => sum + b.totalZMW, 0);

  const handleSaveListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingListingId) {
      updateListing(editingListingId, {
        title,
        type,
        city,
        province,
        locationName,
        pricePerNightZMW: priceZMW,
        description,
        amenities: selectedAmenities,
        images: selectedImages
      });
    } else {
      addListing({
        title,
        type,
        city,
        province,
        locationName,
        coordinates: { lat: -15.4167, lng: 28.3056 },
        pricePerNightZMW: priceZMW,
        description,
        rating: 5.0,
        reviewCount: 0,
        images: selectedImages,
        amenities: selectedAmenities,
        isFeatured: false,
        isPromoted: false,
        businessOwnerId: 'own-1',
        businessName: 'Zambezi Safari Experiences Ltd',
        businessPhone: '+260 96 845 2210',
        businessWhatsApp: '+260968452210',
        verificationStatus: 'verified',
        roomsAvailable: 4,
        maxGuests: 4,
        checkInTime: '14:00',
        checkOutTime: '11:00'
      });
    }

    setShowAddListingModal(false);
    setEditingListingId(null);
  };

  const openEditModal = (listing: Listing) => {
    setEditingListingId(listing.id);
    setTitle(listing.title);
    setType(listing.type);
    setCity(listing.city);
    setProvince(listing.province);
    setLocationName(listing.locationName);
    setPriceZMW(listing.pricePerNightZMW);
    setDescription(listing.description);
    setSelectedAmenities(listing.amenities);
    setSelectedImages(listing.images);
    setShowAddListingModal(true);
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Business Owner Profile & Verification Card (FR-1) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Zambezi Safari Experiences Ltd
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                PACRA & ZRA Verified
              </span>
            </div>
            <p className="text-xs text-slate-500">
              TPIN: 1004928192 · PACRA: 1209384 · Registered in Zambia (FR-1 Verified Host)
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingListingId(null);
            setTitle('');
            setLocationName('');
            setDescription('');
            setShowAddListingModal(true);
          }}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Accommodation (FR-2)</span>
        </button>
      </div>

      {/* Owner Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveOwnerTab('listings')}
          className={`px-3 py-2 border-b-2 whitespace-nowrap transition-colors ${
            activeOwnerTab === 'listings'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          My Listings ({ownerListings.length})
        </button>
        <button
          onClick={() => setActiveOwnerTab('reservations')}
          className={`px-3 py-2 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
            activeOwnerTab === 'reservations'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          <span>Reservation Approvals (FR-8)</span>
          {pendingReservations.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingReservations.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveOwnerTab('analytics')}
          className={`px-3 py-2 border-b-2 whitespace-nowrap transition-colors ${
            activeOwnerTab === 'analytics'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Performance & Analytics (FR-5)
        </button>
        <button
          onClick={() => setActiveOwnerTab('reviews')}
          className={`px-3 py-2 border-b-2 whitespace-nowrap transition-colors ${
            activeOwnerTab === 'reviews'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Respond to Reviews (FR-4)
        </button>
        <button
          onClick={() => setActiveOwnerTab('ads')}
          className={`px-3 py-2 border-b-2 whitespace-nowrap flex items-center gap-1 transition-colors ${
            activeOwnerTab === 'ads'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Advertising & Promotion Tiers (FR-6)</span>
        </button>
      </div>

      {/* Tab 1: Listings Management (FR-2, FR-3) */}
      {activeOwnerTab === 'listings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ownerListings.map(listing => (
              <div 
                key={listing.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="relative h-44 bg-slate-100 dark:bg-slate-700">
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                      {listing.type} · {listing.city}
                    </div>
                    {listing.isPromoted && (
                      <div className="absolute top-2.5 right-2.5 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                        {listing.promotionTier?.toUpperCase()} BOOST
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{listing.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{listing.description}</p>
                    <div className="text-xs font-bold text-amber-600 tabular-nums">
                      ZMW {listing.pricePerNightZMW.toLocaleString()} / night
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-700/60 mt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{listing.viewsCount}</span>
                    <span className="flex items-center gap-1"><MousePointer className="w-3.5 h-3.5" />{listing.clicksCount}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(listing)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                      title="Edit Listing (FR-2)"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteListing(listing.id)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                      title="Delete Listing (FR-2)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Reservation & Payment Approvals (FR-8) */}
      {activeOwnerTab === 'reservations' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Reservation & Payment Moderation Workflow (FR-8)
              </h4>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                As required by the SRS, business owners have the authority to view and approve payments (if room/service is available) or disapprove/reject payments (if room is sold out or unavailable).
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300">
              Customer Booking Requests ({bookings.length})
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-600">{booking.id}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{booking.customerName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        booking.paymentStatus === 'approved' || booking.paymentStatus === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : booking.paymentStatus === 'disapproved'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {booking.paymentStatus.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Stay: <span className="font-semibold">{booking.listingTitle}</span> · {booking.checkIn} to {booking.checkOut} ({booking.nights} nights, {booking.guests} guests)
                    </p>

                    <div className="text-[11px] text-slate-500 font-mono flex items-center gap-3">
                      <span>Method: {booking.paymentMethod.replace('_', ' ').toUpperCase()}</span>
                      <span>Total: ZMW {booking.totalZMW.toLocaleString()}</span>
                      <span>Phone: {booking.customerPhone}</span>
                    </div>

                    {booking.specialRequests && (
                      <p className="text-[11px] italic text-slate-400">
                        Guest request: "{booking.specialRequests}"
                      </p>
                    )}
                  </div>

                  {/* FR-8 Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setActiveReceipt(booking)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                    >
                      Receipt
                    </button>

                    {booking.paymentStatus === 'pending_owner_approval' ? (
                      <>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'approved')}
                          className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1 shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Payment</span>
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'disapproved')}
                          className="px-3 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-1 shadow-xs"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Disapprove</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400">Processed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Performance Analytics (FR-5) */}
      {activeOwnerTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 font-medium">Total Listing Views</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                {totalViews.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">+18% this week</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 font-medium">Click-Throughs</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                {totalClicks.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">34.2% CTR</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 font-medium">Customer Inquiries</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                {totalInquiries.toLocaleString()}
              </div>
              <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Via WhatsApp & In-App</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 font-medium">Gross Bookings Revenue</span>
              <div className="text-2xl font-black text-amber-600 mt-1 tabular-nums">
                ZMW {totalEarningsZMW.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Paid into Mobile Money</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Listing Performance Breakdown</h4>
            <div className="space-y-3">
              {ownerListings.map(listing => (
                <div key={listing.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 flex items-center justify-between text-xs">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{listing.title}</div>
                  <div className="flex items-center gap-6 tabular-nums font-mono text-slate-600 dark:text-slate-300">
                    <span>{listing.viewsCount} views</span>
                    <span>{listing.clicksCount} clicks</span>
                    <span>{listing.inquiriesCount} inquiries</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Respond to Reviews (FR-4) */}
      {activeOwnerTab === 'reviews' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Customer Reviews for Your Stays (FR-4)</h4>
            
            <div className="space-y-4">
              {reviews.map(rev => (
                <div key={rev.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{rev.customerName}</span>
                      <span className="text-slate-400 ml-2">Rating: {rev.rating} ★</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">{rev.date}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">"{rev.comment}"</p>

                  {/* Existing reply if any */}
                  {rev.ownerResponse ? (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-xs text-amber-900 dark:text-amber-200 border-l-2 border-amber-600">
                      <span className="font-bold block text-[11px]">Your Published Response:</span>
                      <p className="italic mt-0.5">{rev.ownerResponse.text}</p>
                    </div>
                  ) : (
                    /* Write Response Input */
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                      <input 
                        type="text"
                        placeholder="Write a public response to this guest review..."
                        value={replyTextMap[rev.id] || ''}
                        onChange={(e) => setReplyTextMap({ ...replyTextMap, [rev.id]: e.target.value })}
                        className="flex-1 text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleGenerateAIReply(rev)}
                          disabled={aiGeneratingReviewId === rev.id}
                          className="px-3 py-2 text-xs font-semibold rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                          title="Generate culturally warm response using Gemini 3.1 Flash Lite"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>{aiGeneratingReviewId === rev.id ? 'Drafting...' : 'AI Draft'}</span>
                        </button>
                        <button
                          onClick={() => {
                            if (replyTextMap[rev.id]) {
                              respondToReview(rev.id, replyTextMap[rev.id]);
                              setReplyTextMap({ ...replyTextMap, [rev.id]: '' });
                            }
                          }}
                          disabled={!replyTextMap[rev.id]}
                          className="px-4 py-2 text-xs font-bold bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 shrink-0"
                        >
                          Publish
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Advertising Packages (FR-6, FR-7) */}
      {activeOwnerTab === 'ads' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
              Boost Your Stays with Targeted Advertising (FR-6, FR-7)
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Select an advertising package to increase visibility across Zambia, rank first in search results, and get highlighted on the home screen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {adPackages.map(pkg => (
              <div 
                key={pkg.id}
                className={`p-5 rounded-2xl bg-white dark:bg-slate-800 border flex flex-col justify-between ${
                  pkg.recommended 
                    ? 'border-amber-500 ring-2 ring-amber-400/40 shadow-md' 
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                      {pkg.name}
                    </span>
                    {pkg.recommended && (
                      <span className="text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums mb-2">
                    ZMW {pkg.priceZMW.toLocaleString()}
                    <span className="text-xs font-normal text-slate-400 ml-1">/ {pkg.durationDays} days</span>
                  </div>

                  <p className="text-xs text-slate-500 mb-4">{pkg.description}</p>

                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-6">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    purchaseAdPackage(ownerListings[0].id, pkg.id);
                    alert(`Package "${pkg.name}" activated successfully for ${ownerListings[0].title}! Paid via Mobile Money.`);
                  }}
                  className="w-full py-2.5 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
                >
                  Pay & Activate (ZMW {pkg.priceZMW})
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Listing Modal (FR-2, FR-3) */}
      {showAddListingModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingListingId ? 'Edit Property Listing' : 'Create New Accommodation Listing (FR-2)'}
              </h3>
              <button onClick={() => setShowAddListingModal(false)} className="text-slate-400">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveListing} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Property Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Royal Livingstone Bush Chalets"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Property Type</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value as AccommodationType)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  >
                    {['Lodge', 'Hotel', 'Resort', 'Villa', 'Apartment', 'Homestay', 'Guest House'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">City / Region</label>
                  <select 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  >
                    {['Livingstone', 'Lusaka', 'South Luangwa', 'Siavonga', 'Kitwe', 'Ndola'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Nightly Rate (ZMW)</label>
                  <input 
                    type="number"
                    value={priceZMW}
                    onChange={(e) => setPriceZMW(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none tabular-nums"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Specific Area / Address</label>
                  <input 
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. Mosi-oa-Tunya Road"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">Description</label>
                  <button
                    type="button"
                    onClick={handleAIEnhanceDescription}
                    disabled={isEnhancingListingAI}
                    className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isEnhancingListingAI ? 'Generating Copy...' : 'AI Polish Description'}</span>
                  </button>
                </div>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the experience, view, safari excursions, and dining..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none resize-none"
                  required
                />
              </div>

              {/* FR-3: Multi-image selector simulation */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Upload Property Images (FR-3 Multiple Photos)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {selectedImages.map((img, i) => (
                    <div key={i} className="relative h-18 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
                      <img src={img} alt="Property" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddListingModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Save Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
