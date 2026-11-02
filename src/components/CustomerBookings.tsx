import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CalendarCheck, 
  Receipt, 
  Car, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Coins
} from 'lucide-react';

export const CustomerBookings: React.FC = () => {
  const { bookings, setActiveReceipt, setRideHailingStay, listings, setActiveTab } = useApp();

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-amber-600" />
            <span>My Bookings & Proof of Payments (FR-12)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View active stay reservations, generate printable receipts, and arrange ride-hailing transfers
          </p>
        </div>

        <button
          onClick={() => setActiveTab('explore')}
          className="px-4 py-2 text-xs font-bold bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors shrink-0"
        >
          Book Another Stay
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <CalendarCheck className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-40" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No bookings yet</h3>
          <p className="text-xs text-slate-500 mt-1">Explore lodges, hotels, and apartments to make your first stay reservation.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => {
            const stayObj = listings.find(l => l.id === booking.listingId) || listings[0];
            const isPending = booking.paymentStatus === 'pending_owner_approval';

            return (
              <div 
                key={booking.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4">
                  <img 
                    src={booking.listingImage || stayObj.images[0]} 
                    alt={booking.listingTitle} 
                    className="w-24 h-24 rounded-2xl object-cover shrink-0 bg-slate-100" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-600">{booking.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        booking.paymentStatus === 'completed' || booking.paymentStatus === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : booking.paymentStatus === 'disapproved'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {booking.paymentStatus.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {booking.listingTitle}
                    </h3>

                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {booking.listingLocation}
                    </p>

                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium pt-1 flex flex-wrap items-center gap-3">
                      <span>{booking.checkIn} to {booking.checkOut} ({booking.nights} nights)</span>
                      <span>·</span>
                      <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                        ZMW {booking.totalZMW.toLocaleString()}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                        <Coins className="w-3 h-3 text-amber-500" />
                        <span>+{Math.floor(booking.totalZMW / 10).toLocaleString()} Loyalty Pts</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700 shrink-0">
                  {/* FR-12: Printable receipt */}
                  <button
                    onClick={() => setActiveReceipt(booking)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 flex items-center gap-1.5 shadow-xs"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Print Receipt (FR-12)</span>
                  </button>

                  {/* FR-10: Book an Uber to this accommodation */}
                  <button
                    onClick={() => setRideHailingStay(stayObj)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5"
                  >
                    <Car className="w-3.5 h-3.5 text-amber-600" />
                    <span>Book Uber (FR-10)</span>
                  </button>

                  {/* Direct Contact */}
                  <a
                    href={`tel:${booking.businessPhone.replace(/\s+/g, '')}`}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900"
                    title="Call Accommodation Front Desk"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
