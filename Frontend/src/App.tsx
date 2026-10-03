import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ClientShell from './components/ClientShell';
import Footer from './components/Footer';
import BabyDecorative3D from './components/BabyDecorative3D';
import HomePage from './pages/HomePage';
import BoysPage from './pages/BoysPage';
import GirlsPage from './pages/GirlsPage';
import CollectionsPage from './pages/CollectionsPage';
import SelectionPage from './pages/SelectionPage';
import ProductDetailPage from './pages/ProductDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import { fetchSettings, DEFAULT_SETTINGS } from './lib/api';
import { BusinessSettings } from './types';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [settings, setSettings] = useState<BusinessSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      try {
        const s = await fetchSettings();
        if (isMounted && s) {
          setSettings(s);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    }
    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-baby-pink selection:text-charcoal-900 bg-cream-50/40">
      <ScrollToTop />
      <BabyDecorative3D />
      <ClientShell settings={settings}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/boys" element={<BoysPage />} />
          <Route path="/girls" element={<GirlsPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/selection" element={<SelectionPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer
          whatsappNumber={settings.whatsappNumber}
          phone={settings.phone}
          address={settings.address}
        />
      </ClientShell>
    </div>
  );
}
