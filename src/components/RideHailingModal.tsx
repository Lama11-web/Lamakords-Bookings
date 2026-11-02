import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Car, 
  MapPin, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Phone, 
  ArrowRight,
  Loader2
} from 'lucide-react';

const PICKUP_HUBS = [
  'Kenneth Kaunda International Airport (KKIA), Lusaka',
  'Harry Mwaanga Nkumbula International Airport, Livingstone',
  'Lusaka Intercity Bus Terminus, Central Lusaka',
  'Simon Mwansa Kapwepwe International Airport, Ndola',
  'Current GPS Location (Simulated Zambia Central)'
];

const RIDE_OPTIONS = [
  {
    type: 'Uber ChapChap' as const,
    name: 'Uber ChapChap',
    capacity: '3 seats',
    description: 'Compact, economical city runaround',
    priceMultiplier: 1.0,
    etaMins: 4
  },
  {
    type: 'UberX' as const,
    name: 'UberX',
    capacity: '4 seats',
    description: 'Comfortable air-conditioned sedan',
    priceMultiplier: 1.35,
    etaMins: 6
  },
  {
    type: 'Uber Safari 4x4' as const,
    name: 'Uber Safari 4x4',
    capacity: '6 seats',
    description: 'Rugged high-clearance SUV for lodge access & bush roads',
    priceMultiplier: 2.1,
    etaMins: 12
  },
  {
    type: 'Airport Executive' as const,
    name: 'Airport Executive',
    capacity: '4 seats',
    description: 'Premium executive transfer with complimentary bottled water',
    priceMultiplier: 2.8,
    etaMins: 8
  }
];

export const RideHailingModal: React.FC = () => {
  const { rideHailingStay, setRideHailingStay, bookRide, activeRides } = useApp();

  const [pickup, setPickup] = useState<string>(PICKUP_HUBS[0]);
  const [selectedRideType, setSelectedRideType] = useState<any>('UberX');
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [bookedRide, setBookedRide] = useState<any>(null);

  if (!rideHailingStay) return null;

  // Base distance estimation based on location
  const isLivingstone = rideHailingStay.city.toLowerCase().includes('livingstone');
  const distanceKm = isLivingstone ? 18 : 26;
  const baseRateZMW = 180;
  const selectedOption = RIDE_OPTIONS.find(o => o.type === selectedRideType) || RIDE_OPTIONS[1];
  const calculatedFareZMW = Math.round(baseRateZMW * selectedOption.priceMultiplier);

  const handleConfirmRide = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);

    setTimeout(() => {
      const ride = bookRide(rideHailingStay, pickup, selectedRideType);
      setBookedRide(ride);
      setIsBooking(false);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold">
              <Car className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Ride-Hailing Integration (FR-10)
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Book Ride to Stay
              </h3>
            </div>
          </div>
          <button 
            onClick={() => setRideHailingStay(null)}
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!bookedRide ? (
            <form onSubmit={handleConfirmRide} className="space-y-5">
              
              {/* Route Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                {/* Pickup */}
                <div className="flex items-start gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1 shrink-0"></div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 block">Pickup Location</label>
                    <select
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full text-xs font-semibold bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-slate-900 dark:text-white outline-none"
                    >
                      {PICKUP_HUBS.map(hub => (
                        <option key={hub} value={hub} className="dark:bg-slate-800">{hub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dropoff */}
                <div className="flex items-start gap-2.5">
                  <div className="w-3 h-3 rounded-xs bg-amber-600 mt-1 shrink-0"></div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 block">Destination Stay</label>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {rideHailingStay.title}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {rideHailingStay.locationName}, {rideHailingStay.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ride Types */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                  Select Ride Vehicle Class
                </label>
                <div className="space-y-2">
                  {RIDE_OPTIONS.map((opt) => {
                    const isSelected = selectedRideType === opt.type;
                    const fare = Math.round(baseRateZMW * opt.priceMultiplier);
                    return (
                      <button
                        type="button"
                        key={opt.type}
                        onClick={() => setSelectedRideType(opt.type)}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50/60 dark:bg-amber-950/30 ring-2 ring-amber-500/40'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}>
                            <Car className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">{opt.name}</span>
                              <span className="text-[10px] text-slate-400 font-medium">{opt.capacity}</span>
                            </div>
                            <p className="text-[11px] text-slate-500">{opt.description}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums block">
                            ZMW {fare}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">~{opt.etaMins} mins away</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ride confirmation button */}
              <button
                type="submit"
                disabled={isBooking}
                className="w-full py-3 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-600 dark:hover:bg-amber-700 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isBooking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Matching Nearest Driver in Zambia...</span>
                  </>
                ) : (
                  <>
                    <span>Request {selectedRideType} (ZMW {calculatedFareZMW})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          ) : (
            /* Live Driver Dispatched View */
            <div className="space-y-5 py-2">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Driver Dispatched & On the Way!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Arriving in approximately <span className="font-bold text-emerald-600">{bookedRide.estimatedArrivalMins} minutes</span>
                </p>
              </div>

              {/* Driver Details Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-700 dark:text-slate-200">
                      {bookedRide.driverName?.charAt(0)}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">{bookedRide.driverName}</h5>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{bookedRide.driverRating}</span>
                        <span>· Verified Zambian Driver</span>
                      </div>
                    </div>
                  </div>

                  <a 
                    href="tel:+260968452210"
                    className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 shadow-xs"
                    title="Call Driver"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Vehicle Model</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{bookedRide.vehicleModel}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Zambia License Plate</span>
                    <p className="font-mono font-bold text-slate-800 dark:text-slate-200">{bookedRide.licensePlate}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-xs">
                  <span className="text-slate-500">Trip Fare:</span>
                  <span className="font-bold text-amber-600 tabular-nums">ZMW {bookedRide.estimatedFareZMW} (Pay via Mobile Money or Cash)</span>
                </div>
              </div>

              <button
                onClick={() => setRideHailingStay(null)}
                className="w-full py-2.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 rounded-xl"
              >
                Done
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
