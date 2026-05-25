import { useState, useEffect } from 'react';
import { ViewType, LanguageType, UserSession } from './types';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RoomsSection from './components/RoomsSection';
import ServicesSection from './components/ServicesSection';
import DiningSection from './components/DiningSection';
import BookingForm from './components/BookingForm';
import Dashboard from './components/Dashboard';
import ContactEnquiry from './components/ContactEnquiry';
import PrivacyPolicy from './components/PrivacyPolicy';
import LoginModal from './components/LoginModal';
import HomeSections from './components/HomeSections';
import CookieBanner from './components/CookieBanner';
import FooterAndWidgets from './components/FooterAndWidgets';

export default function App() {
  const [view, setView] = useState<ViewType>('home');
  const [language, setLanguage] = useState<LanguageType>('EN');
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  // Selected Room parameter for booking pre-selection
  const [bookingPreSelectRoomId, setBookingPreSelectRoomId] = useState<string | undefined>(undefined);

  // Check LocalStorage of session on reload/mount
  useEffect(() => {
    const stored = localStorage.getItem('anjuman_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === 'EN' ? 'HI' : 'EN'));
  };

  const handleLoginSuccess = (session: UserSession) => {
    setUser(session);
    setView('dashboard'); // Redirect immediately to dashboard of client
  };

  const handleLogout = () => {
    localStorage.removeItem('anjuman_user');
    setUser(null);
    setView('home');
  };

  // Pre-populations for quick booking
  const handleGoToBookingWithParams = (params: { roomId: string; checkIn: string; checkOut: string; guests: number }) => {
    setBookingPreSelectRoomId(params.roomId);
    setView('enquiry'); // Switch immediately to check calculations and parameters
  };

  const handleRoomBookNow = (roomId: string) => {
    setBookingPreSelectRoomId(roomId);
    setView('enquiry');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-brand-black text-brand-white relative">
      {/* 0. Luxury preloaded load animation */}
      <Preloader />

      {/* 1. Custom Royal Circle Cursor */}
      <Cursor />

      {/* 2. Global Luxury Transparent Navigation Header */}
      <Navbar
        currentView={view}
        onViewChange={(v) => {
          setView(v);
          setBookingPreSelectRoomId(undefined); // Clear preselection on direct click
        }}
        language={language}
        onLanguageToggle={handleLanguageToggle}
        user={user}
        onLogout={handleLogout}
        triggerLogin={() => setIsLoginOpen(true)}
      />

      {/* 3. Main Dynamic Content View Switch */}
      <div className="pt-20">
        
        {view === 'home' && (
          <div className="space-y-0 relative">
            {/* Full 100vh Slideshow Hero */}
            <Hero
              language={language}
              onGoToBookingWithParams={handleGoToBookingWithParams}
            />

            {/* Comprehensive Home Page Premium Sections (1 to 8) */}
            <HomeSections
              language={language}
              onBookNow={handleRoomBookNow}
              onGoToEnquiry={() => {
                setView('contact');
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {view === 'rooms' && (
          <div className="animate-fade-in pt-6">
            <RoomsSection
              language={language}
              onBookNow={handleRoomBookNow}
            />
          </div>
        )}

        {view === 'services' && (
          <div className="animate-fade-in pt-6">
            <ServicesSection
              language={language}
              onGoToEnquiry={() => setView('contact')}
            />
          </div>
        )}

        {view === 'dining' && (
          <div className="animate-fade-in pt-6">
            <DiningSection
              language={language}
            />
          </div>
        )}

        {view === 'contact' && (
          <div className="animate-fade-in pt-6">
            <ContactEnquiry
              language={language}
            />
          </div>
        )}

        {view === 'privacy' && (
          <div className="animate-fade-in pt-6">
            <PrivacyPolicy
              language={language}
            />
          </div>
        )}

        {view === 'enquiry' && (
          <div className="animate-fade-in pt-6 md:pt-10">
            <BookingForm
              onBookingSuccess={() => setView('dashboard')}
              selectedRoomId={bookingPreSelectRoomId}
              language={language}
              user={user}
              triggerLogin={() => setIsLoginOpen(true)}
            />
          </div>
        )}

        {view === 'dashboard' && user && (
          <div className="animate-fade-in pt-6">
            <Dashboard
              user={user}
              language={language}
              onLogout={handleLogout}
              onGoToBooking={() => setView('enquiry')}
            />
          </div>
        )}

      </div>

      {/* 4. Global Palatial Footer & Floating Accessible Widgets */}
      <FooterAndWidgets
        currentView={view}
        onViewChange={(v) => {
          setView(v);
          setBookingPreSelectRoomId(undefined); // Clear preselection on direct click
        }}
        language={language}
      />

      {/* 5. Sovereign Login Modal Popup Trigger */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        language={language}
      />

      {/* Cookie Consent Banner (DPDP Act + GDPR Compliant) */}
      <CookieBanner />
    </div>
  );
}
