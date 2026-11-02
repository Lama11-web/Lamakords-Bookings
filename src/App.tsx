/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { DeviceSimulator } from './components/DeviceSimulator';
import { CustomerHome } from './components/CustomerHome';
import { CustomerExplore } from './components/CustomerExplore';
import { CustomerBookings } from './components/CustomerBookings';
import { CustomerRides } from './components/CustomerRides';
import { CustomerSaved } from './components/CustomerSaved';
import { CustomerProfile } from './components/CustomerProfile';
import { InteractiveMapModal } from './components/InteractiveMapModal';
import { BusinessOwnerPortal } from './components/BusinessOwnerPortal';
import { AdminPortal } from './components/AdminPortal';
import { ListingDetailModal } from './components/ListingDetailModal';
import { BookingModal } from './components/BookingModal';
import { ReceiptModal } from './components/ReceiptModal';
import { RideHailingModal } from './components/RideHailingModal';
import { FlutterCodeViewerModal } from './components/FlutterCodeViewerModal';
import { AuthModal } from './components/AuthModal';
import { BottomNav } from './components/BottomNav';
import { GeminiChatbotModal } from './components/GeminiChatbotModal';
import { CustomerReviews } from './components/CustomerReviews';

const MainContent: React.FC = () => {
  const { role, activeTab } = useApp();

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-slate-900 transition-colors pb-16 md:pb-6">
      {/* Customer Mode Views */}
      {role === 'customer' && (
        <>
          {activeTab === 'home' && <CustomerHome />}
          {activeTab === 'explore' && <CustomerExplore />}
          {activeTab === 'map' && <InteractiveMapModal />}
          {activeTab === 'rides' && <CustomerRides />}
          {activeTab === 'bookings' && <CustomerBookings />}
          {activeTab === 'reviews' && (
            <div className="max-w-4xl mx-auto p-4 sm:p-6 w-full">
              <CustomerReviews showListingSelector={true} />
            </div>
          )}
          {activeTab === 'saved' && <CustomerSaved />}
          {activeTab === 'profile' && <CustomerProfile />}
        </>
      )}

      {/* Business Owner View */}
      {role === 'business_owner' && <BusinessOwnerPortal />}

      {/* Admin View */}
      {role === 'admin' && <AdminPortal />}

      {/* Bottom Navigation for mobile screens */}
      <BottomNav />
    </div>
  );
};

const GlobalModals: React.FC = () => {
  const { showGeminiChat, setShowGeminiChat } = useApp();
  return (
    <>
      <ListingDetailModal />
      <BookingModal />
      <ReceiptModal />
      <RideHailingModal />
      <FlutterCodeViewerModal />
      <AuthModal />
      <GeminiChatbotModal isOpen={showGeminiChat} onClose={() => setShowGeminiChat(false)} />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased selection:bg-amber-100 selection:text-amber-900">
        <Header />
        
        <DeviceSimulator>
          <MainContent />
        </DeviceSimulator>

        {/* Global Modals */}
        <GlobalModals />
      </div>
    </AppProvider>
  );
}
