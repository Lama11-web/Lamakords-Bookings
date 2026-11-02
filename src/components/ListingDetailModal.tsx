import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  MapPin, 
  Star, 
  Heart, 
  Phone, 
  MessageCircle, 
  Share2, 
  Check, 
  Car, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Users, 
  Sparkles,
  Send,
  CornerDownRight
} from 'lucide-react';
import { CustomerReviews } from './CustomerReviews';

export const ListingDetailModal: React.FC = () => {
  const { 
    selectedListing, 
    setSelectedListing, 
    favorites, 
    toggleFavorite, 
    setBookingListing, 
    setRideHailingStay, 
    reviews, 
    addReview,
    isGuest,
    setShowAuthModal
  } = useApp();

  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [showInAppMessageModal, setShowInAppMessageModal] = useState<boolean>(false);
  const [inquiryText, setInquiryText] = useState<string>('');
  const [inquirySent, setInquirySent] = useState<boolean>(false);

  // Review form state
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  if (!selectedListing) return null;

  const isFav = favorites.includes(selectedListing.id);
  const listingReviews = reviews.filter(r => r.listingId === selectedListing.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuest) {
      setShowAuthModal(true);
      return;
    }
    if (!inquiryText.trim()) return;
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setShowInAppMessageModal(false);
      setInquiryText('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col border border-slate-200 dark:border-slate-800">
        
        {/* Modal Top Bar */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/95 dark:bg-slate-900/95">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full">
              {selectedListing.type}
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedListing.locationName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(selectedListing.id)}
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Bookmark stay (FR-04)"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Share listing"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setSelectedListing(null)}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Gallery View */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img 
                src={selectedListing.images[activeImageIdx] || selectedListing.images[0]} 
                alt={selectedListing.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md">
                Photo {activeImageIdx + 1} of {selectedListing.images.length}
              </div>
            </div>

            {/* Thumbnail selector */}
            {selectedListing.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {selectedListing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIdx === idx ? 'border-amber-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title, Host & Rating Summary */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span>{selectedListing.city}, {selectedListing.province}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {selectedListing.rating.toFixed(1)} ({selectedListing.reviewCount} customer reviews)
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {selectedListing.title}
              </h2>

              <div className="flex items-center gap-2 mt-2 text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Managed by {selectedListing.businessName}
                </span>
                {selectedListing.verificationStatus === 'verified' && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Business
                  </span>
                )}
              </div>
            </div>

            {/* Price Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shrink-0 text-right">
              <span className="text-[10px] uppercase text-slate-400 font-medium block">Nightly Stay</span>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                ZMW {selectedListing.pricePerNightZMW.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500">Includes 1.5% Tourism Levy</span>
            </div>
          </div>

          {/* Property Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <Users className="w-4 h-4 text-amber-600" />
              <div>
                <span className="text-slate-400 block text-[10px]">Capacity</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Up to {selectedListing.maxGuests} Guests</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <Calendar className="w-4 h-4 text-amber-600" />
              <div>
                <span className="text-slate-400 block text-[10px]">Available Units</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedListing.roomsAvailable} Rooms / Suites</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <Clock className="w-4 h-4 text-amber-600" />
              <div>
                <span className="text-slate-400 block text-[10px]">Check-in</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedListing.checkInTime}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <Clock className="w-4 h-4 text-amber-600" />
              <div>
                <span className="text-slate-400 block text-[10px]">Check-out</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedListing.checkOutTime}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">About This Stay</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedListing.description}
            </p>
          </div>

          {/* FR-03 & Zambia Amenities */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2.5">
              Property Amenities & Utilities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {selectedListing.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0"></div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FR-07: Interactive Map & Location */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Location & Coordinates (FR-07)</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                {selectedListing.coordinates.lat}, {selectedListing.coordinates.lng}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              {selectedListing.locationName}, {selectedListing.city}, Zambia
            </p>

            {/* Stylized Simulated Map Container */}
            <div className="relative h-44 rounded-xl overflow-hidden bg-emerald-950/20 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="text-center z-10 p-4">
                <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center mx-auto mb-2 shadow-lg animate-bounce">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                  {selectedListing.title}
                </span>
                <span className="text-[11px] text-slate-500">
                  Latitude: {selectedListing.coordinates.lat} · Longitude: {selectedListing.coordinates.lng}
                </span>
              </div>
            </div>
          </div>

          {/* FR-06: Direct Contact Channels (WhatsApp, Phone, In-App) */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
            <h3 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-2">
              Direct Host Contact (FR-06)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              Connect directly with the business owner for custom bookings, group deals, or inquiries.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={`https://wa.me/${selectedListing.businessWhatsApp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedListing.businessName)},%20I%20am%20inquiring%20about%20${encodeURIComponent(selectedListing.title)}%20via%20Lama%20Kords%20App.`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Host</span>
              </a>
              <a
                href={`tel:${selectedListing.businessPhone.replace(/\s+/g, '')}`}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 transition-colors shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Host ({selectedListing.businessPhone})</span>
              </a>
              <button
                onClick={() => setShowInAppMessageModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-amber-600/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send In-App Inquiry</span>
              </button>
            </div>
          </div>

          {/* Customer Reviews & Ratings Component (FR-05) */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <CustomerReviews listingId={selectedListing.id} />
          </div>

        </div>

        {/* Modal Bottom Sticky CTA Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Nightly Rate</span>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white tabular-nums">
              ZMW {selectedListing.pricePerNightZMW.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* FR-10: Uber ride-hailing trigger */}
            <button
              onClick={() => {
                setRideHailingStay(selectedListing);
              }}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Car className="w-4 h-4 text-amber-600" />
              <span>Book Uber</span>
            </button>

            {/* FR-09 & FR-11: Instant Booking */}
            <button
              onClick={() => {
                setBookingListing(selectedListing);
              }}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md transition-colors"
            >
              Book Stay
            </button>
          </div>
        </div>

      </div>

      {/* In-App Direct Messaging Sub-Modal */}
      {showInAppMessageModal && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2 mb-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Message {selectedListing.businessName}
              </h4>
              <button onClick={() => setShowInAppMessageModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {inquirySent ? (
              <div className="py-6 text-center text-emerald-600">
                <Check className="w-8 h-8 mx-auto mb-2" />
                <p className="text-xs font-bold">Your inquiry was sent to {selectedListing.businessName}!</p>
                <p className="text-[11px] text-slate-500 mt-1">They typically respond within 15 minutes.</p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-3">
                <p className="text-xs text-slate-500">
                  Ask about check-in timing, airport pickup, group discounts, or special dietary requirements.
                </p>
                <textarea
                  value={inquiryText}
                  onChange={(e) => setInquiryText(e.target.value)}
                  placeholder="Hello, I would like to inquire about availability for this weekend..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none resize-none"
                  autoFocus
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInAppMessageModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!inquiryText.trim()}
                    className="px-4 py-1.5 text-xs font-bold bg-amber-600 text-white rounded-lg disabled:opacity-50 hover:bg-amber-700"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
