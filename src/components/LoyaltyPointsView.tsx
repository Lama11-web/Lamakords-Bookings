import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LoyaltyReward, LoyaltyTransaction, LoyaltyTier } from '../types';
import { 
  Award, 
  Gift, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  Info, 
  ArrowRight, 
  Coins, 
  Ticket, 
  Star, 
  Crown,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Zap,
  CalendarCheck
} from 'lucide-react';

interface LoyaltyPointsViewProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const LoyaltyPointsView: React.FC<LoyaltyPointsViewProps> = ({ isModal = false, onClose }) => {
  const { 
    loyaltyPoints, 
    loyaltyTier, 
    nextTierPoints, 
    tierProgressPct, 
    tierMultiplier, 
    tierPerks, 
    loyaltyTransactions, 
    availableRewards, 
    redeemedVouchers, 
    activeVoucher, 
    applyVoucher, 
    redeemReward,
    setActiveTab,
    isGuest,
    setShowAuthModal
  } = useApp();

  const [activeTab, setActiveSubTab] = useState<'overview' | 'ledger' | 'redeem' | 'vouchers' | 'tiers'>('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleRedeem = (reward: LoyaltyReward) => {
    if (isGuest) {
      setShowAuthModal(true);
      return;
    }
    const success = redeemReward(reward);
    if (success) {
      setRedeemSuccessMsg(`Successfully redeemed ${reward.title}! Voucher is ready for use.`);
      setTimeout(() => setRedeemSuccessMsg(null), 4000);
    }
  };

  const getTierColor = (tier: LoyaltyTier) => {
    switch (tier) {
      case 'Platinum Luangwa':
        return {
          gradient: 'from-slate-900 via-indigo-950 to-slate-900',
          badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
          accent: 'text-indigo-400',
          bar: 'bg-gradient-to-r from-indigo-500 to-amber-400',
          border: 'border-indigo-800/40'
        };
      case 'Gold Victoria':
        return {
          gradient: 'from-amber-900 via-amber-800 to-amber-950',
          badgeBg: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
          accent: 'text-amber-400',
          bar: 'bg-gradient-to-r from-amber-400 to-yellow-300',
          border: 'border-amber-600/40'
        };
      case 'Silver Explorer':
        return {
          gradient: 'from-slate-800 via-slate-700 to-slate-900',
          badgeBg: 'bg-slate-300/20 text-slate-200 border-slate-400/30',
          accent: 'text-slate-300',
          bar: 'bg-gradient-to-r from-slate-300 to-slate-100',
          border: 'border-slate-600/40'
        };
      case 'Bronze Safari':
      default:
        return {
          gradient: 'from-amber-950 via-stone-800 to-stone-900',
          badgeBg: 'bg-amber-700/20 text-amber-400 border-amber-700/30',
          accent: 'text-amber-500',
          bar: 'bg-gradient-to-r from-amber-600 to-amber-400',
          border: 'border-stone-700/40'
        };
    }
  };

  const tierStyles = getTierColor(loyaltyTier);

  // Filtered transactions
  const filteredTransactions = loyaltyTransactions.filter(tx => {
    if (filterType === 'all') return true;
    if (filterType === 'earned') return tx.points > 0;
    if (filterType === 'redeemed') return tx.points < 0;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {redeemSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-600 text-white text-xs font-semibold flex items-center justify-between shadow-lg shadow-emerald-600/20 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{redeemSuccessMsg}</span>
          </div>
          <button 
            onClick={() => setActiveSubTab('vouchers')}
            className="text-[11px] underline font-bold ml-2 hover:opacity-90"
          >
            View Active Vouchers
          </button>
        </div>
      )}

      {/* Main Loyalty Tier & Balance Hero Card */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${tierStyles.gradient} text-white p-6 sm:p-7 shadow-xl border ${tierStyles.border}`}>
        
        {/* Subtle Background Pattern Accent */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute right-6 top-6 text-white/10 pointer-events-none">
          <Crown className="w-32 h-32" />
        </div>

        <div className="relative z-10 space-y-5">
          
          {/* Top Bar: Brand & Tier Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 backdrop-blur-xs flex items-center justify-center text-amber-400 border border-amber-500/30">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300/80 block leading-none">
                  Lama Kords Rewards
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  Zambia Travel Loyalty Club
                </span>
              </div>
            </div>

            <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${tierStyles.badgeBg}`}>
              <Crown className="w-3.5 h-3.5" />
              <span>{loyaltyTier}</span>
            </div>
          </div>

          {/* Center Points Value & Kwacha Savings */}
          <div className="pt-1 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs text-slate-300 font-medium block">
                Available Loyalty Balance
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-4xl sm:text-5xl font-black tabular-nums tracking-tight text-white">
                  {loyaltyPoints.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-amber-400">
                  POINTS
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                <span>Worth</span>
                <span className="font-bold text-emerald-400 tabular-nums">
                  ZMW {(loyaltyPoints * 0.1).toFixed(2)}
                </span>
                <span>in accommodation discounts</span>
              </p>
            </div>

            {/* Multiplier Tag */}
            <div className="sm:text-right">
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-xs font-bold text-white">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{tierMultiplier}x Points Multiplier Active</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Earn {Math.round(10 * tierMultiplier)} pts per K100 spent
              </p>
            </div>
          </div>

          {/* Progress Bar to Next Tier */}
          <div className="pt-2 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-200">{loyaltyTier}</span>
              {nextTierPoints > 0 ? (
                <span className="text-amber-300">
                  {nextTierPoints.toLocaleString()} pts to next tier
                </span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Top Tier Status Achieved
                </span>
              )}
            </div>

            <div className="w-full h-2.5 rounded-full bg-white/15 overflow-hidden p-0.5">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${tierStyles.bar}`}
                style={{ width: `${Math.max(5, tierProgressPct)}%` }}
              />
            </div>
          </div>

          {/* Quick Perks Pill Strip */}
          <div className="pt-1 flex flex-wrap gap-2">
            {tierPerks.map((perk, idx) => (
              <span 
                key={idx}
                className="text-[11px] bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-lg border border-white/10 text-slate-100 flex items-center gap-1.5 transition-colors"
              >
                <Check className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{perk}</span>
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Rewards Hub</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ledger')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'ledger'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Points History ({loyaltyTransactions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('redeem')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'redeem'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>Redeem Catalog</span>
        </button>

        <button
          onClick={() => setActiveSubTab('vouchers')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'vouchers'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Active Vouchers ({redeemedVouchers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tiers')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'tiers'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Tier Benefits</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & HIGHLIGHTS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Quick Action Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Action 1: Redeem Voucher */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Redeem Discount Vouchers</h4>
                  <p className="text-[11px] text-slate-500">From 500 pts for instant stay savings</p>
                </div>
              </div>
              <button
                onClick={() => setActiveSubTab('redeem')}
                className="px-3 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 shrink-0 flex items-center gap-1"
              >
                <span>Redeem</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Action 2: Book Stay to Earn */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 shrink-0">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Earn on Your Next Trip</h4>
                  <p className="text-[11px] text-slate-500">Book any lodge or resort across Zambia</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('explore')}
                className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 shrink-0 flex items-center gap-1"
              >
                <span>Explore Stays</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Active Applied Voucher Alert (if any) */}
          {activeVoucher && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Ticket className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Active Booking Discount Applied:</span>
                    <span className="font-mono text-xs font-black bg-amber-200 dark:bg-amber-800/60 px-2 py-0.5 rounded text-amber-900 dark:text-amber-200">
                      {activeVoucher.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Will deduct <strong className="text-emerald-600">ZMW {activeVoucher.discountZMW}</strong> from your next checkout.
                  </p>
                </div>
              </div>

              <button
                onClick={() => applyVoucher(null)}
                className="text-xs text-slate-500 hover:text-red-600 font-medium shrink-0"
              >
                Remove
              </button>
            </div>
          )}

          {/* Recent Points Activity Preview */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Recent Points Activity</span>
              </h3>
              <button
                onClick={() => setActiveSubTab('ledger')}
                className="text-xs font-bold text-amber-600 hover:underline"
              >
                View Full Ledger ({loyaltyTransactions.length})
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {loyaltyTransactions.slice(0, 3).map(tx => (
                <div key={tx.id} className="py-3 flex items-center justify-between gap-3 first:pt-1">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{tx.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{tx.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{tx.description}</p>
                  </div>
                  <span className={`text-xs font-extrabold tabular-nums shrink-0 ${
                    tx.points > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                  }`}>
                    {tx.points > 0 ? `+${tx.points}` : tx.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* How to Earn Points Guide */}
          <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600" />
              <span>How Zambian Travelers Earn & Spend Points</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-amber-600 block mb-1">1. Book Any Stay</span>
                <p className="text-slate-500 text-[11px]">
                  Earn 1 point per K10 spent on confirmed bookings. Higher tiers earn up to 1.5x bonus points.
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-amber-600 block mb-1">2. Review Your Experience</span>
                <p className="text-slate-500 text-[11px]">
                  Earn 50 bonus points every time you submit a verified star rating and review for a stay.
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-amber-600 block mb-1">3. Redeem at Checkout</span>
                <p className="text-slate-500 text-[11px]">
                  Exchange points for instant Kwacha discount vouchers applied directly at Mobile Money checkout.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: POINTS LEDGER (ACTIVITY HISTORY) */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Transaction History</h3>
              <p className="text-xs text-slate-500">Complete record of points earned and redeemed</p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                  filterType === 'all' 
                    ? 'bg-white dark:bg-slate-700 text-amber-600 font-bold shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                All ({loyaltyTransactions.length})
              </button>
              <button
                onClick={() => setFilterType('earned')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                  filterType === 'earned' 
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 font-bold shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Earned
              </button>
              <button
                onClick={() => setFilterType('redeemed')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                  filterType === 'redeemed' 
                    ? 'bg-white dark:bg-slate-700 text-red-600 font-bold shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Redeemed
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-slate-700">
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No transactions match this filter.
              </div>
            ) : (
              filteredTransactions.map(tx => (
                <div key={tx.id} className="p-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.points > 0 
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600' 
                        : 'bg-red-50 dark:bg-red-950/60 text-red-500'
                    }`}>
                      {tx.type === 'earned_booking' ? (
                        <CalendarCheck className="w-4 h-4" />
                      ) : tx.type === 'earned_review' ? (
                        <Star className="w-4 h-4" />
                      ) : tx.type === 'redeemed_discount' ? (
                        <Ticket className="w-4 h-4" />
                      ) : (
                        <Award className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{tx.title}</h4>
                        {tx.bookingId && (
                          <span className="font-mono text-[10px] text-amber-600 font-semibold bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                            {tx.bookingId}
                          </span>
                        )}
                        {tx.referenceCode && (
                          <span className="font-mono text-[10px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                            {tx.referenceCode}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{tx.description}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">{tx.date}</span>
                    </div>
                  </div>

                  <span className={`text-sm font-black tabular-nums shrink-0 ${
                    tx.points > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                  }`}>
                    {tx.points > 0 ? `+${tx.points}` : tx.points} pts
                  </span>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* TAB 3: REDEEM CATALOG */}
      {activeTab === 'redeem' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Redeem Rewards & Vouchers</h3>
            <p className="text-xs text-slate-500">
              Exchange your points for stay discount vouchers or travel perks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRewards.map(reward => {
              const canAfford = loyaltyPoints >= reward.pointsCost;
              return (
                <div 
                  key={reward.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full">
                        {reward.category === 'discount' ? `ZMW ${reward.discountZMW} OFF` : 'TRAVEL PERK'}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-black text-slate-900 dark:text-white">
                        <Coins className="w-3.5 h-3.5 text-amber-500" />
                        <span>{reward.pointsCost.toLocaleString()} pts</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {reward.title}
                    </h4>

                    <p className="text-xs text-slate-500">
                      {reward.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
                    <span className="text-[10px] text-slate-400">
                      Min tier: {reward.tierRequired}
                    </span>

                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        canAfford
                          ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>{canAfford ? 'Redeem Voucher' : 'Not Enough Points'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: MY ACTIVE VOUCHERS */}
      {activeTab === 'vouchers' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">My Active Travel Vouchers</h3>
            <p className="text-xs text-slate-500">
              Apply these promo codes during booking checkout for instant deductions
            </p>
          </div>

          {redeemedVouchers.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <Ticket className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">No active vouchers redeemed yet</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Head over to the Redeem Catalog tab to exchange your loyalty points for stay vouchers.
              </p>
              <button
                onClick={() => setActiveSubTab('redeem')}
                className="mt-3 px-4 py-2 text-xs font-bold bg-amber-600 text-white rounded-xl"
              >
                Browse Rewards
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {redeemedVouchers.map((v, i) => {
                const isCurrentActive = activeVoucher?.code === v.code;
                return (
                  <div 
                    key={i}
                    className={`p-5 rounded-2xl border transition-all ${
                      isCurrentActive
                        ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-400/20'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        ZMW {v.discountZMW} Deduction
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Issued {v.date}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-3">
                      {v.title}
                    </h4>

                    {/* Voucher Code Box */}
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between font-mono text-xs font-black text-slate-900 dark:text-white mb-3">
                      <span>{v.code}</span>
                      <button
                        onClick={() => copyToClipboard(v.code)}
                        className="text-amber-600 hover:text-amber-700 text-xs flex items-center gap-1"
                        title="Copy code"
                      >
                        {copiedCode === v.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-[10px]">{copiedCode === v.code ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          if (isCurrentActive) {
                            applyVoucher(null);
                          } else {
                            applyVoucher({ code: v.code, title: v.title, discountZMW: v.discountZMW });
                          }
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                          isCurrentActive
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                            : 'bg-amber-600 hover:bg-amber-700 text-white'
                        }`}
                      >
                        {isCurrentActive ? 'Applied for Checkout ✓' : 'Apply to Next Booking'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: TIER BENEFITS COMPARISON */}
      {activeTab === 'tiers' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Lama Kords Rewards Tier Structure</h3>
            <p className="text-xs text-slate-500">
              The more you travel across Zambia, the greater your privileges and savings
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Bronze Safari */}
            <div className={`p-5 rounded-2xl border ${loyaltyTier === 'Bronze Safari' ? 'ring-2 ring-amber-600 bg-amber-50/20 dark:bg-amber-950/20 border-amber-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300">Bronze Safari</span>
                <span className="text-[10px] font-semibold text-slate-400">0 - 499 pts</span>
              </div>
              <p className="text-xs text-amber-600 font-bold mb-3">1.0x Base Accrual</p>
              <ul className="text-[11px] text-slate-500 space-y-1.5">
                <li>• 1 pt per K10 spent</li>
                <li>• K100 Stay Voucher eligibility</li>
                <li>• +50 pts per review</li>
                <li>• Mobile Money cashback access</li>
              </ul>
            </div>

            {/* Silver Explorer */}
            <div className={`p-5 rounded-2xl border ${loyaltyTier === 'Silver Explorer' ? 'ring-2 ring-amber-600 bg-amber-50/20 dark:bg-amber-950/20 border-amber-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Silver Explorer</span>
                <span className="text-[10px] font-semibold text-slate-400">500 - 1,499 pts</span>
              </div>
              <p className="text-xs text-amber-600 font-bold mb-3">1.1x Points Multiplier</p>
              <ul className="text-[11px] text-slate-500 space-y-1.5">
                <li>• Everything in Bronze</li>
                <li>• 5% off select stays</li>
                <li>• Free welcome local beverage</li>
                <li>• K250 Safari Voucher eligibility</li>
              </ul>
            </div>

            {/* Gold Victoria */}
            <div className={`p-5 rounded-2xl border ${loyaltyTier === 'Gold Victoria' ? 'ring-2 ring-amber-600 bg-amber-50/20 dark:bg-amber-950/20 border-amber-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Gold Victoria</span>
                <span className="text-[10px] font-semibold text-slate-400">1,500 - 3,499 pts</span>
              </div>
              <p className="text-xs text-amber-600 font-bold mb-3">1.25x Points Multiplier</p>
              <ul className="text-[11px] text-slate-500 space-y-1.5">
                <li>• Everything in Silver</li>
                <li>• Free airport transfer perks</li>
                <li>• Priority check-in & breakfast upgrade</li>
                <li>• K500 Victoria Falls Voucher</li>
              </ul>
            </div>

            {/* Platinum Luangwa */}
            <div className={`p-5 rounded-2xl border ${loyaltyTier === 'Platinum Luangwa' ? 'ring-2 ring-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 border-indigo-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Platinum Luangwa</span>
                <span className="text-[10px] font-semibold text-slate-400">3,500+ pts</span>
              </div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-3">1.5x VIP Multiplier</p>
              <ul className="text-[11px] text-slate-500 space-y-1.5">
                <li>• Everything in Gold</li>
                <li>• 15% VIP discount vouchers</li>
                <li>• Safari lounge & late 14:00 checkout</li>
                <li>• K1,000 Executive Voucher</li>
              </ul>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
