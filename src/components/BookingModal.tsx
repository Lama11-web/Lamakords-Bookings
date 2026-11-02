import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  Calendar, 
  Users, 
  CreditCard, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck,
  Receipt,
  ArrowRight,
  Coins,
  Sparkles,
  Ticket
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const { 
    bookingListing, 
    setBookingListing, 
    createBooking, 
    setActiveReceipt,
    loyaltyPoints,
    loyaltyTier,
    tierMultiplier,
    activeVoucher,
    applyVoucher
  } = useApp();

  const [checkIn, setCheckIn] = useState<string>('2026-11-15');
  const [checkOut, setCheckOut] = useState<string>('2026-11-18');
  const [guests, setGuests] = useState<number>(2);
  const [customerName, setCustomerName] = useState<string>('Mubiana Lamaswala');
  const [customerEmail, setCustomerEmail] = useState<string>('mubianalamaswala311@gmail.com');
  const [customerPhone, setCustomerPhone] = useState<string>('+260 97 123 4567');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mtn_momo');
  const [momoPhone, setMomoPhone] = useState<string>('0968452210');
  const [cardNumber, setCardNumber] = useState<string>('4234 •••• •••• 9812');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('742');

  // Simulation step
  const [step, setStep] = useState<'details' | 'processing' | 'momo_ussd_prompt' | 'success' | 'failed'>('details');
  const [ussdPin, setUssdPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [simulateFailure, setSimulateFailure] = useState<boolean>(false);

  if (!bookingListing) return null;

  // Calculate nights
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.max(end.getTime() - start.getTime(), 86400000);
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const roomRatePerNight = bookingListing.pricePerNightZMW;
  const subtotal = roomRatePerNight * nights;
  const tourismLevy = Math.round(subtotal * 0.015); // 1.5% Zambia Tourism Levy
  const serviceFee = 150;
  
  // Loyalty voucher discount calculation
  const voucherDiscount = activeVoucher ? Math.min(subtotal, activeVoucher.discountZMW) : 0;
  const grandTotalZMW = Math.max(0, subtotal + tourismLevy + serviceFee - voucherDiscount);

  // Projected points to earn
  const projectedPoints = Math.round(Math.floor(grandTotalZMW / 10) * tierMultiplier);

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setErrorMessage('');

    setTimeout(() => {
      if (simulateFailure) {
        setStep('failed');
        setErrorMessage('Mobile network timeout from MTN/Airtel switch. Please verify your wallet balance and retry.');
        return;
      }

      if (paymentMethod === 'mtn_momo' || paymentMethod === 'airtel_money' || paymentMethod === 'zamtel_kwacha') {
        setStep('momo_ussd_prompt');
      } else {
        completePaymentSuccess();
      }
    }, 1500);
  };

  const handleApproveUSSD = () => {
    if (ussdPin.length < 4) {
      alert('Please enter your 4-digit mobile money PIN');
      return;
    }
    setStep('processing');
    setTimeout(() => {
      completePaymentSuccess();
    }, 1200);
  };

  const completePaymentSuccess = () => {
    // Generate Booking
    const newBooking = createBooking({
      listingId: bookingListing.id,
      listingTitle: bookingListing.title,
      listingImage: bookingListing.images[0] || '',
      listingLocation: bookingListing.locationName,
      businessName: bookingListing.businessName,
      businessPhone: bookingListing.businessPhone,
      checkIn,
      checkOut,
      nights,
      guests,
      roomRatePerNightZMW: roomRatePerNight,
      serviceFeeZMW: serviceFee,
      tourismLevyZMW: tourismLevy,
      totalZMW: grandTotalZMW,
      customerName,
      customerEmail,
      customerPhone,
      paymentMethod,
      paymentPhoneOrCard: paymentMethod === 'bank_card' ? cardNumber : momoPhone,
      paymentStatus: 'completed',
      specialRequests
    });

    // Fire festive celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    setStep('success');
    setTimeout(() => {
      setBookingListing(null);
      setActiveReceipt(newBooking);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 my-auto">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">
              Secure Reservation
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
              Book {bookingListing.title}
            </h3>
          </div>
          <button 
            onClick={() => setBookingListing(null)}
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          
          {step === 'details' && (
            <form onSubmit={handleStartPayment} className="space-y-5">
              
              {/* Stay Quick Summary */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <img 
                  src={bookingListing.images[0]} 
                  alt={bookingListing.title} 
                  className="w-16 h-14 rounded-xl object-cover" 
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{bookingListing.title}</h4>
                  <p className="text-[11px] text-slate-500">{bookingListing.city} · {bookingListing.type}</p>
                  <p className="text-xs font-bold text-amber-600 tabular-nums">ZMW {bookingListing.pricePerNightZMW.toLocaleString()} / night</p>
                </div>
              </div>

              {/* Dates & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">Check-in Date</label>
                  <input 
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">Check-out Date</label>
                  <input 
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Guest Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">Lead Guest Full Name</label>
                  <input 
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">Contact Phone Number</label>
                  <input 
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    required
                  />
                </div>
              </div>

              {/* Zambian Payment Method Selection (FR-09, FR-11, Constraint 2.5) */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white block mb-2">
                  Select Payment Method (Zambia Supported)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  
                  {/* MTN MoMo */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mtn_momo')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'mtn_momo' 
                        ? 'border-yellow-500 bg-yellow-500/10 text-yellow-900 dark:text-yellow-400 font-bold ring-2 ring-yellow-400' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-yellow-400 text-slate-950 font-black text-[10px] flex items-center justify-center mx-auto mb-1 shadow-xs">
                      MTN
                    </div>
                    <span className="text-xs block">MTN MoMo</span>
                  </button>

                  {/* Airtel Money */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('airtel_money')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'airtel_money' 
                        ? 'border-red-500 bg-red-500/10 text-red-900 dark:text-red-400 font-bold ring-2 ring-red-400' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center mx-auto mb-1 shadow-xs">
                      airtel
                    </div>
                    <span className="text-xs block">Airtel Money</span>
                  </button>

                  {/* Zamtel Kwacha */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('zamtel_kwacha')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'zamtel_kwacha' 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-400 font-bold ring-2 ring-emerald-400' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center mx-auto mb-1 shadow-xs">
                      Z
                    </div>
                    <span className="text-xs block">Zamtel</span>
                  </button>

                  {/* Bank Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_card')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'bank_card' 
                        ? 'border-slate-900 dark:border-white bg-slate-900/10 text-slate-900 dark:text-white font-bold ring-2 ring-slate-800' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mx-auto mb-1 text-slate-700 dark:text-slate-300" />
                    <span className="text-xs block">Bank Card</span>
                  </button>

                </div>

                {/* Sub-inputs based on payment type */}
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {paymentMethod !== 'bank_card' ? (
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                        {paymentMethod === 'mtn_momo' ? 'MTN' : paymentMethod === 'airtel_money' ? 'Airtel' : 'Zamtel'} Mobile Number (09x or +260)
                      </label>
                      <input 
                        type="text"
                        value={momoPhone}
                        onChange={(e) => setMomoPhone(e.target.value)}
                        placeholder="e.g. 0968452210"
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none font-mono"
                        required
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        An instant USSD push approval prompt will be sent to your handset.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-3">
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">Card Number</label>
                        <input 
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block mb-1">Expiry</label>
                        <input 
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block mb-1">CVV</label>
                        <input 
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Breakdown in ZMW */}
              <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>ZMW {roomRatePerNight.toLocaleString()} × {nights} Night{nights > 1 ? 's' : ''}</span>
                  <span className="font-semibold tabular-nums">ZMW {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Zambia Tourism Levy (1.5%)</span>
                  <span className="font-semibold tabular-nums">ZMW {tourismLevy.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Platform Service Fee</span>
                  <span className="font-semibold tabular-nums">ZMW {serviceFee.toLocaleString()}</span>
                </div>

                {/* Loyalty Voucher Discount if applied */}
                {activeVoucher && voucherDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded-lg">
                    <span className="flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Loyalty Voucher ({activeVoucher.code})</span>
                    </span>
                    <span className="tabular-nums">- ZMW {voucherDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t border-amber-200 dark:border-amber-900/60 text-sm font-extrabold text-slate-900 dark:text-white">
                  <span>Total Amount Due</span>
                  <span className="tabular-nums text-amber-600 dark:text-amber-400">
                    ZMW {grandTotalZMW.toLocaleString()}
                  </span>
                </div>

                {/* Projected Loyalty Points to Earn */}
                <div className="pt-2 border-t border-amber-100 dark:border-amber-900/40 flex items-center justify-between text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-500" />
                    <span>Lama Kords Rewards to earn:</span>
                  </span>
                  <span className="font-bold bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                    +{projectedPoints} pts ({tierMultiplier}x)
                  </span>
                </div>
              </div>

              {/* Error Simulation checkbox for NFR-08 test */}
              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                <input 
                  type="checkbox"
                  id="sim-fail"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                  className="rounded text-amber-600 accent-amber-600"
                />
                <label htmlFor="sim-fail">Test payment failure handling (NFR-08 error verification)</label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>Authorize & Pay ZMW {grandTotalZMW.toLocaleString()}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}

          {/* Processing State */}
          {step === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <Loader2 className="w-10 h-10 text-amber-600 animate-spin mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Contacting {paymentMethod.toUpperCase()} Gateway...</h4>
                <p className="text-xs text-slate-500 mt-1">Connecting to Zambian payment gateway switch</p>
              </div>
            </div>
          )}

          {/* Zambian USSD Push Prompt Modal (MoMo / Airtel) */}
          {step === 'momo_ussd_prompt' && (
            <div className="py-6 space-y-5">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
                <Smartphone className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Handset USSD Prompt Received
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-mono">
                  "Authorize payment of ZMW {grandTotalZMW.toLocaleString()} to LAMA KORDS TECHNOLOGIES for reservation at {bookingListing.title}?"
                </p>
              </div>

              <div className="max-w-xs mx-auto">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 text-center">
                  Enter your 4-Digit Mobile Money PIN to Confirm:
                </label>
                <input 
                  type="password"
                  maxLength={4}
                  value={ussdPin}
                  onChange={(e) => setUssdPin(e.target.value)}
                  placeholder="••••"
                  className="w-full text-center text-xl tracking-[1em] p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-mono"
                  autoFocus
                />
                <p className="text-[10px] text-slate-400 text-center mt-1">
                  Simulating *115# (MTN) or *778# (Airtel) prompt confirmation
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setStep('details')}
                  className="w-1/3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveUSSD}
                  className="w-2/3 py-2.5 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-md transition-colors"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          )}

          {/* Success State */}
          {step === 'success' && (
            <div className="py-10 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Payment Confirmed & Reservation Booked!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Your reservation is secured. Generating your official printable receipt now...
                </p>
              </div>
            </div>
          )}

          {/* Failed State (NFR-08) */}
          {step === 'failed' && (
            <div className="py-8 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Transaction Unsuccessful</h4>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 px-4">{errorMessage}</p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => { setSimulateFailure(false); setStep('details'); }}
                  className="px-5 py-2 text-xs font-bold bg-amber-600 text-white rounded-xl shadow-xs"
                >
                  Retry Payment
                </button>
                <button
                  onClick={() => setBookingListing(null)}
                  className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400"
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
