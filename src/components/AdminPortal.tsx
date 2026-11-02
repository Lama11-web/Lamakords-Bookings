import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  AlertTriangle, 
  Check, 
  X, 
  Trash2, 
  Bell, 
  BarChart3, 
  Package, 
  Send,
  Building,
  UserCheck,
  UserX
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { 
    registrations, 
    approveBusiness, 
    rejectBusiness, 
    listings, 
    deleteListing, 
    reviews, 
    users, 
    toggleUserSuspension, 
    adPackages, 
    broadcastAnnouncement, 
    announcements,
    bookings
  } = useApp();

  const [adminTab, setAdminTab] = useState<'registrations' | 'moderation' | 'users' | 'packages' | 'analytics' | 'announcements'>('registrations');

  // Announcement composer
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annTarget, setAnnTarget] = useState<'all' | 'customer' | 'business_owner'>('all');
  const [annPriority, setAnnPriority] = useState<'normal' | 'high'>('normal');
  const [annSent, setAnnSent] = useState(false);

  // Platform analytics calculations (Admin FR-5)
  const totalGMVZMW = bookings.reduce((sum, b) => sum + b.totalZMW, 0);
  const activeBusinessesCount = registrations.filter(r => r.status === 'approved').length;
  const pendingRegistrationsCount = registrations.filter(r => r.status === 'pending').length;

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) return;
    broadcastAnnouncement(annTitle, annMessage, annTarget, annPriority);
    setAnnTitle('');
    setAnnMessage('');
    setAnnSent(true);
    setTimeout(() => setAnnSent(false), 2500);
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Admin Summary Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold">Platform Governance & Moderation Console</h2>
            <p className="text-xs text-slate-400">
              Lama Kords Technologies Administrator Portal (FR-1 through FR-6)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            System: 99.8% Uptime (NFR-05)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Zambia Node Active
          </span>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          onClick={() => setAdminTab('registrations')}
          className={`px-3 py-2 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
            adminTab === 'registrations'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          <span>Business Registrations (FR-1)</span>
          {pendingRegistrationsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] flex items-center justify-center font-bold">
              {pendingRegistrationsCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setAdminTab('moderation')}
          className={`px-3 py-2 border-b-2 whitespace-nowrap transition-colors ${
            adminTab === 'moderation'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Listings & Reviews Moderation (FR-2)
        </button>
        <button
          onClick={() => setAdminTab('users')}
          className={`px-3 py-2 border-b-2 whitespace-nowrap transition-colors ${
            adminTab === 'users'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          User Accounts & Access (FR-3)
        </button>
        <button
          onClick={() => setAdminTab('packages')}
          className={`px-3 py-2 border-b-2 whitespace-nowrap transition-colors ${
            adminTab === 'packages'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Ad Packages & Pricing (FR-4)
        </button>
        <button
          onClick={() => setAdminTab('analytics')}
          className={`px-3 py-2 border-b-2 whitespace-nowrap transition-colors ${
            adminTab === 'analytics'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Platform Analytics (FR-5)
        </button>
        <button
          onClick={() => setAdminTab('announcements')}
          className={`px-3 py-2 border-b-2 whitespace-nowrap flex items-center gap-1 transition-colors ${
            adminTab === 'announcements'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          <Bell className="w-3.5 h-3.5 text-amber-600" />
          <span>Announcements (FR-6)</span>
        </button>
      </div>

      {/* Admin Tab 1: Business Registrations (FR-1) */}
      {adminTab === 'registrations' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
          <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300">
            Business Verification Requests (PACRA & ZRA TPIN Compliance)
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {registrations.map(reg => (
              <div key={reg.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{reg.businessName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      reg.status === 'approved' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : reg.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {reg.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300">
                    Owner: {reg.ownerName} · {reg.email} · {reg.phone}
                  </p>

                  <div className="text-[11px] text-slate-500 font-mono flex items-center gap-4">
                    <span>PACRA Ref: {reg.registrationNumber}</span>
                    <span>ZRA TPIN: {reg.taxPayerTpin}</span>
                    <span>Property: {reg.propertyType} in {reg.city}</span>
                  </div>

                  {reg.notes && (
                    <p className="text-[11px] text-amber-600 italic">Note: {reg.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {reg.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => approveBusiness(reg.id)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Registration</span>
                      </button>
                      <button
                        onClick={() => rejectBusiness(reg.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400">Decision Recorded</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Tab 2: Listings & Reviews Moderation (FR-2) */}
      {adminTab === 'moderation' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active Accommodation Listings ({listings.length})</h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {listings.map(item => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white">{item.title}</h5>
                    <p className="text-slate-500">{item.type} · {item.city} · Host: {item.businessName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold tabular-nums text-slate-800 dark:text-slate-200">
                      ZMW {item.pricePerNightZMW.toLocaleString()}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`Remove listing "${item.title}"?`)) {
                          deleteListing(item.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                      title="Remove listing (FR-2)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Admin Tab 3: User Accounts Management (FR-3) */}
      {adminTab === 'users' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
          <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300">
            Platform User Directory ({users.length} accounts)
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {users.map(u => (
              <div key={u.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {u.status.toUpperCase()}
                    </span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 font-medium capitalize">
                      {u.role.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">{u.email} · {u.phone} · Joined {u.joinedDate}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleUserSuspension(u.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                      u.status === 'active'
                        ? 'border border-red-300 text-red-600 hover:bg-red-50'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {u.status === 'active' ? (
                      <>
                        <UserX className="w-3.5 h-3.5" />
                        <span>Suspend Account (FR-3)</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Reinstate Account</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Tab 4: Ad Packages Management (FR-4) */}
      {adminTab === 'packages' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {adPackages.map(pkg => (
              <div key={pkg.id} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{pkg.name}</h4>
                  <span className="text-xs font-mono font-bold text-amber-600">ZMW {pkg.priceZMW}</span>
                </div>
                <p className="text-xs text-slate-500">{pkg.description}</p>
                <div className="text-[11px] text-slate-400 font-mono">
                  Duration: {pkg.durationDays} Days · Active Host Tier
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Tab 5: Platform Analytics (FR-5) */}
      {adminTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500">Gross Platform Bookings</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                ZMW {totalGMVZMW.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">Processed via MTN & Airtel</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500">Active Business Hosts</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                {activeBusinessesCount}
              </div>
              <span className="text-[11px] text-slate-400">Verified properties</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500">Published Listings</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                {listings.length}
              </div>
              <span className="text-[11px] text-slate-400">Across 6 Zambian provinces</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500">Completed Reservations</span>
              <div className="text-2xl font-black text-amber-600 mt-1 tabular-nums">
                {bookings.length}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">100% receipted</span>
            </div>
          </div>
        </div>
      )}

      {/* Admin Tab 6: Broadcast Announcements (FR-6) */}
      {adminTab === 'announcements' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Send Platform-Wide Announcement or Push Notification (FR-6)
            </h4>

            {annSent && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">
                ✓ Announcement broadcasted across the platform successfully!
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Announcement Title</label>
                <input 
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Special Victoria Falls Weekend Flash Promotion"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Message Content</label>
                <textarea 
                  value={annMessage}
                  onChange={(e) => setAnnMessage(e.target.value)}
                  placeholder="Type the message to be displayed to users..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Target Audience</label>
                  <select
                    value={annTarget}
                    onChange={(e) => setAnnTarget(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                  >
                    <option value="all">All Users (Customers & Business Owners)</option>
                    <option value="customer">Customers Only</option>
                    <option value="business_owner">Business Owners Only</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Priority</label>
                  <select
                    value={annPriority}
                    onChange={(e) => setAnnPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                  >
                    <option value="normal">Normal Banner</option>
                    <option value="high">High Priority Alert</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Notification</span>
                </button>
              </div>
            </form>
          </div>

          {/* Past Announcements */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Broadcast History</h4>
            <div className="space-y-2.5">
              {announcements.map(ann => (
                <div key={ann.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-1">
                    <span>{ann.title}</span>
                    <span className="text-[10px] font-mono text-slate-400">{ann.date}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{ann.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
