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

  // Dynamic SEO Optimization: Update document title, description, and OG meta tags on view/language change
  useEffect(() => {
    let title = 'ANJUMAN 5-Star Hotel | Royal Luxury Stay in Udaipur';
    let description = 'Experience royal luxury at ANJUMAN 5-Star Hotel, Udaipur. Premium palatial suites, fine dining, and heritage spa hospitality.';

    if (language === 'EN') {
      switch (view) {
        case 'home':
          title = 'ANJUMAN 5-Star Hotel | Royal Luxury Stay in Udaipur | Book Now';
          description = 'Experience royal luxury at ANJUMAN 5-Star Hotel, Udaipur. Premium palatial suites, fine dining, and heritage spa hospitality. Best price guaranteed.';
          break;
        case 'rooms':
          title = 'Palatial Suites & Heritage Rooms | ANJUMAN Luxury Hotel Udaipur';
          description = 'Explore our sovereign suites and heritage rooms at ANJUMAN Hotel. Enjoy modern opulence, regal decor, and 24/7 butler service.';
          break;
        case 'services':
          title = 'Royal Amenities & Wellness Spa | ANJUMAN Hotel Udaipur';
          description = 'Indulge in royal wellness therapies, private lakeside infinity pools, and signature Mewar hospitality services at ANJUMAN.';
          break;
        case 'dining':
          title = 'Fine Dining & Palatial Culinary | ANJUMAN Hotel Udaipur';
          description = 'Savor exquisite heritage cuisine, lake-view rooftop dinners, and curated royal cocktails at ANJUMAN\'s premier restaurants.';
          break;
        case 'contact':
          title = 'Contact & Royal Event Enquiries | ANJUMAN Hotel Udaipur';
          description = 'Plan your dream palace wedding or royal stay. Contact ANJUMAN 5-star hotel in Udaipur for custom packages and concierge enquiries.';
          break;
        case 'enquiry':
          title = 'Book Your Stay | Online Reservation | ANJUMAN Hotel';
          description = 'Reserve your royal suite at ANJUMAN Udaipur. Secure payment, flexible cancellation, and exclusive direct booking privileges.';
          break;
        case 'dashboard':
          title = 'Guest Dashboard | ANJUMAN Royal Court Member';
          description = 'Access your direct booking reservation details, exclusive royal rewards, and personalized concierge desk services.';
          break;
        case 'privacy':
          title = 'Privacy Policy & Terms | ANJUMAN Luxury Hotel';
          description = 'Read our DPDP Act and GDPR compliant privacy policy. Your personal data is highly protected under royal standard security.';
          break;
      }
    } else {
      // Hindi translations for maximum localized search visibility
      switch (view) {
        case 'home':
          title = 'अंजुमन 5-स्टार होटल | उदयपुर में शानदार और राजसी प्रवास | अभी बुक करें';
          description = 'अंजुमन 5-स्टार होटल, उदयपुर में राजसी विलासिता का अनुभव करें। प्रीमियम सुइट्स, बढ़िया भोजन और विश्व स्तरीय स्पा आतिथ्य।';
          break;
        case 'rooms':
          title = 'शानदार सुइट्स और हेरिटेज कमरे | अंजुमन लग्जरी होटल उदयपुर';
          description = 'अंजुमन होटल में हमारे संप्रभु सुइट्स और विरासत कमरों का अन्वेषण करें। आधुनिक विलासिता और शाही सजावट का आनंद लें।';
          break;
        case 'services':
          title = 'शाही सुविधाएं और वेलनेस स्पा | अंजुमन होटल उदयपुर';
          description = 'अंजुमन में शाही कल्याण उपचार, निजी लेकसाइड इन्फिनिटी पूल और हस्ताक्षर आतिथ्य सेवाओं का आनंद लें।';
          break;
        case 'dining':
          title = 'शाही भोजन और व्यंजन | अंजुमन होटल उदयपुर';
          description = 'अंजुमन के प्रमुख रेस्तरां में उत्तम विरासत व्यंजनों, झील-दृश्य वाली छतों पर रात्रिभोज का आनंद लें।';
          break;
        case 'contact':
          title = 'संपर्क और बुकिंग पूछताछ | अंजुमन होटल उदयपुर';
          description = 'अपने सपनों की शादी या शाही प्रवास की योजना बनाएं। कस्टम पैकेज के लिए अंजुमन 5-स्टार होटल से संपर्क करें।';
          break;
        case 'enquiry':
          title = 'अपना कमरा आरक्षित करें | ऑनलाइन बुकिंग | अंजुमन होटल';
          description = 'अंजुमन उदयपुर में अपना शाही सुइट आरक्षित करें। सुरक्षित भुगतान और विशेष प्रत्यक्ष बुकिंग विशेषाधिकार।';
          break;
        case 'dashboard':
          title = 'अतिथि डैशबोर्ड | अंजुमन रॉयल कोर्ट सदस्य';
          description = 'अपने आरक्षण विवरण, विशेष शाही पुरस्कार और व्यक्तिगत कंसीयज सेवाओं तक पहुंचें।';
          break;
        case 'privacy':
          title = 'गोपनीयता नीति | अंजुमन लग्जरी होटल';
          description = 'हमारी गोपनीयता नीति पढ़ें। आपका व्यक्तिगत डेटा उच्चतम सुरक्षा मानकों के तहत सुरक्षित है।';
          break;
      }
    }

    document.title = title;
    
    // Update meta descriptions dynamically
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', description);
    }
    
    // Update Open Graph (og:title / og:description)
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
  }, [view, language]);

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
      <div className={view === 'home' ? '' : 'pt-20'}>
        
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
