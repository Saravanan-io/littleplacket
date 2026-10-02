'use client';

import React, { useState } from 'react';
import Navbar from './Navbar';
import BottomNavigation from './BottomNavigation';
import WhatsAppFloatingButton from './WhatsAppFloatingButton';
import EnquiryDrawer from './EnquiryDrawer';
import { BusinessSettings } from '../types';

interface ClientShellProps {
  settings: BusinessSettings;
  children: React.ReactNode;
}

export default function ClientShell({ settings, children }: ClientShellProps) {
  const [enquiryDrawerOpen, setEnquiryDrawerOpen] = useState(false);

  return (
    <>
      <Navbar
        settings={settings}
        whatsappNumber={settings.whatsappNumber}
        onOpenEnquiry={() => setEnquiryDrawerOpen(true)}
      />

      <main className="flex-grow relative z-10">{children}</main>

      {/* Floating WhatsApp Button */}
      <WhatsAppFloatingButton
        whatsappNumber={settings.whatsappNumber}
        businessName={settings.businessName}
      />

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNavigation onOpenEnquiry={() => setEnquiryDrawerOpen(true)} />

      {/* Global Slide-Over Enquiry Drawer */}
      <EnquiryDrawer
        isOpen={enquiryDrawerOpen}
        onClose={() => setEnquiryDrawerOpen(false)}
        whatsappNumber={settings.whatsappNumber}
      />
    </>
  );
}
