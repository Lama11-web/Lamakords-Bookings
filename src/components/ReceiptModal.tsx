import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  QrCode, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  Copy,
  Check
} from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { activeReceipt, setActiveReceipt } = useApp();
  const [copied, setCopied] = useState<boolean>(false);

  if (!activeReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRef = () => {
    navigator.clipboard?.writeText(activeReceipt.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-55 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 my-auto flex flex-col">
        
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Proof of Payment & Reservation (FR-12)
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button 
              onClick={() => setActiveReceipt(null)}
              className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div id="printable-receipt" className="p-6 sm:p-8 bg-white text-slate-900 space-y-6 overflow-y-auto">
          
          {/* Company Branding */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2 text-amber-700 mb-1">
                <Building2 className="w-6 h-6" />
                <span className="text-lg font-black tracking-tight uppercase">
                  Lama Kords Technologies
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Accommodation Booking & Business Advertising Platform
              </p>
              <p className="text-[11px] text-slate-400">
                Lusaka, Zambia · support@lamakords.com
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                Paid & Confirmed
              </span>
              <div className="text-xs font-mono font-bold text-slate-800 mt-2">
                {activeReceipt.receiptNumber}
              </div>
              <span className="text-[10px] text-slate-400 block">{activeReceipt.createdAt}</span>
            </div>
          </div>

          {/* Booking Key Information */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Guest Information</span>
              <p className="font-bold text-slate-900">{activeReceipt.customerName}</p>
              <p className="text-slate-600">{activeReceipt.customerEmail}</p>
              <p className="text-slate-600">{activeReceipt.customerPhone}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Booking Reference</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-sm text-amber-700">{activeReceipt.id}</span>
                <button onClick={handleCopyRef} className="text-slate-400 hover:text-slate-600">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Status: {activeReceipt.paymentStatus.toUpperCase()}</p>
            </div>
          </div>

          {/* Reserved Accommodation Particulars */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Accommodation Property</span>
                <h4 className="font-bold text-sm text-slate-900">{activeReceipt.listingTitle}</h4>
                <p className="text-slate-500">{activeReceipt.listingLocation}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Host Contact</span>
                <p className="font-semibold text-slate-800">{activeReceipt.businessName}</p>
                <p className="text-slate-500 font-mono text-[11px]">{activeReceipt.businessPhone}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-[11px]">
              <div>
                <span className="text-slate-400 block">Check-in</span>
                <span className="font-bold text-slate-800">{activeReceipt.checkIn}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Check-out</span>
                <span className="font-bold text-slate-800">{activeReceipt.checkOut}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Duration / Guests</span>
                <span className="font-bold text-slate-800">{activeReceipt.nights} Nights · {activeReceipt.guests} Guests</span>
              </div>
            </div>
          </div>

          {/* Itemized Financial Breakdown */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100 px-3.5 py-2 font-bold text-slate-700 flex justify-between">
              <span>Description</span>
              <span>Amount (ZMW)</span>
            </div>
            <div className="p-3.5 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Room Rate ({activeReceipt.nights} nights @ ZMW {activeReceipt.roomRatePerNightZMW.toLocaleString()})</span>
                <span className="font-mono tabular-nums">ZMW {(activeReceipt.roomRatePerNightZMW * activeReceipt.nights).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Zambia Statutory Tourism Levy (1.5%)</span>
                <span className="font-mono tabular-nums">ZMW {activeReceipt.tourismLevyZMW.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Booking & Reservation Fee</span>
                <span className="font-mono tabular-nums">ZMW {activeReceipt.serviceFeeZMW.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                <span>Total Paid</span>
                <span className="font-mono tabular-nums text-amber-700">
                  ZMW {activeReceipt.totalZMW.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method & QR Code Verification */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Payment Method</span>
              <p className="font-bold text-slate-800 uppercase">
                {activeReceipt.paymentMethod.replace('_', ' ')}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Account: {activeReceipt.paymentPhoneOrCard}
              </p>
            </div>

            {/* Verification QR representation */}
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 bg-white border border-slate-300 p-1 rounded-lg flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="text-left text-[10px] text-slate-500 max-w-[120px]">
                Scan at check-in for instant front-desk verification.
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
            Thank you for booking with Lama Kords Technologies. Present this electronic or printed receipt upon arrival.
          </div>

        </div>

      </div>
    </div>
  );
};
