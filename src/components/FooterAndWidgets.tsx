import React, { useState, useEffect } from 'react';
import { ViewType, LanguageType } from '../types';
import { 
  ArrowUp, 
  Phone, 
  Mail, 
  Sparkles, 
  HelpCircle, 
  Award, 
  Check, 
  CheckCircle,
  Accessibility,
  VolumeX,
  Plus,
  Minus,
  Sparkle
} from 'lucide-react';

interface FooterAndWidgetsProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  language: LanguageType;
}

export default function FooterAndWidgets({ 
  currentView, 
  onViewChange, 
  language 
}: FooterAndWidgetsProps) {
  
  // Newsletter Subscribe state
  const [newsEmail, setNewsEmail] = useState('');
  const [newsSuccess, setNewsSuccess] = useState(false);
  
  // Back to Top Button state
  const [showToTop, setShowToTop] = useState(false);
  
  // Booking Reminder state
  const [showReminder, setShowReminder] = useState(false);

  // Royal notice modal
  const [royalModal, setRoyalModal] = useState<{ title: string; content: string; titleHI?: string; contentHI?: string } | null>(null);
  
  // Accessibility Widget state
  const [isAccessMenuOpen, setIsAccessMenuOpen] = useState(false);
  const [fontSizeScale, setFontSizeScale] = useState(1); // multiplier: 1, 1.05, 1.1, 1.15
  const [isContrastMode, setIsContrastMode] = useState(false);
  const [isDyslexiaFont, setIsDyslexiaFont] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Monitor page scroll to render back to top
  useEffect(() => {
    const handleScroll = () => {
      setShowToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Monitor 30-seconds Booking Reminder prompt
  useEffect(() => {
    // Check if reminder was already dismissed in this session
    const isDismissed = sessionStorage.getItem('anjuman_reminder_closed');
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setShowReminder(true);
      }, 30000); // exactly 30 seconds as requested!
      return () => clearTimeout(timer);
    }
  }, []);

  // Sync accessibility states with HTML root class names
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast toggle
    if (isContrastMode) {
      root.classList.add('accessibility-high-contrast');
    } else {
      root.classList.remove('accessibility-high-contrast');
    }

    // Dyslexia font toggle
    if (isDyslexiaFont) {
      root.classList.add('accessibility-dyslexic');
    } else {
      root.classList.remove('accessibility-dyslexic');
    }

    // Reduced motion toggle
    if (isReducedMotion) {
      root.classList.add('accessibility-reduced-motion');
    } else {
      root.classList.remove('accessibility-reduced-motion');
    }
  }, [isContrastMode, isDyslexiaFont, isReducedMotion]);

  // Handle Font Size scaling
  const changeFontSize = (increase: boolean) => {
    setFontSizeScale((prev) => {
      const next = increase ? Math.min(prev + 0.05, 1.25) : Math.max(prev - 0.05, 0.85);
      document.documentElement.style.fontSize = `${next * 100}%`;
      return next;
    });
  };

  const resetFontSize = () => {
    setFontSizeScale(1);
    document.documentElement.style.fontSize = '100%';
  };

  // Back to top scroll handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Subscriptions submission handler
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail.trim()) return;
    setNewsSuccess(true);
    setNewsEmail('');
    setTimeout(() => {
      setNewsSuccess(false);
    }, 5000);
  };

  const dismissReminderPopup = () => {
    sessionStorage.setItem('anjuman_reminder_closed', 'true');
    setShowReminder(false);
  };

  const handleApplyOffer = () => {
    dismissReminderPopup();
    onViewChange('enquiry');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <>
      <div className="mt-20 relative z-20">
        
        {/* ========================================== */}
        {/* GOLD BRAND NEWSLETTER BAR */}
        {/* ========================================== */}
        <div className="w-full bg-gradient-to-r from-brand-gold to-[#8B6914] text-brand-black py-8 px-4 sm:px-6 lg:px-8 border-y border-brand-gold/30">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="font-serif text-lg md:text-xl font-bold tracking-wide uppercase flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="w-5 h-5 text-brand-black" />
                {language === 'EN' ? 'Subscribe for Exclusive Offers & Updates' : 'शाही कूपन एवं विशेष विश्राम सूचनाएं पाएं'}
              </h3>
              <p className="text-xs font-sans text-brand-black/80 font-medium">
                {language === 'EN' ? 'Join our Inner Circle and enjoy 15% VIP discount on your next luxury booking.' : 'अंजुमन क्लब में शामिल हों और अपनी अगली शाही बुकिंग पर तुरंत लाभ पाएं।'}
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-2.5">
              <div className="flex-1 relative">
                <input 
                  type="email" 
                  required
                  placeholder={language === 'EN' ? "Enter your noble email address" : "अपना राजकीय ईमेल दर्ज करें"}
                  className="w-full bg-brand-black/10 border border-brand-black/20 placeholder-brand-black/50 text-brand-black font-semibold rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-brand-black"
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="bg-brand-black text-brand-gold hover:bg-brand-black/90 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md select-none touch-target"
              >
                {language === 'EN' ? 'Subscribe' : 'सदस्य बनें'}
              </button>
            </form>
          </div>

          {newsSuccess && (
            <div className="max-w-7xl mx-auto mt-3 text-center md:text-left animate-fade-in">
              <span className="text-xs bg-brand-black text-brand-gold border border-brand-gold/30 px-3 py-1 rounded inline-block font-mono font-bold font-sans">
                ✓ {language === 'EN' ? 'Namaste! Your email has been added to our royal ledger. Check your inbox.' : 'नमस्ते! आपकी ईमेल विवरण सुरक्षित रूप से रिकॉर्ड कर ली गई है।'}
              </span>
            </div>
          )}
        </div>


        {/* ========================================== */}
        {/* MEGA 4-COLUMN FOOTER */}
        {/* ========================================== */}
        <footer className="bg-[#10101F] border-t border-brand-gold/25 pt-16 pb-8 text-brand-white relative overflow-hidden">
          
          {/* Subtle gold flare background */}
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-0 left-0 w-80 h-80 bg-brand-gold/3 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            
            {/* COLUMN 1: BRAND IDENTITY & HONORS */}
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <svg className="h-7 w-7 text-brand-gold fill-current drop-shadow" viewBox="0 0 24 24">
                  <path d="M2 4l3 6 7-7 7 7 3-6-2 16H4L2 4z" />
                </svg>
                <span className="font-serif text-xl tracking-[0.25em] text-brand-gold gold-glow font-black">
                  ANJUMAN
                </span>
              </div>
              <p className="text-[10px] uppercase font-mono font-bold tracking-[0.2em] text-brand-gold/80 block italic">
                "Where Royalty Meets Comfort"
              </p>
              <p className="text-[11px] text-brand-cream/70 leading-relaxed font-sans">
                {language === 'EN' 
                  ? 'ANJUMAN is Udaipur\'s preeminent 5-star palatial sanctuary, overlooking the sparkling waters of Lake Pichola. Merging the regal hospitality of Mewar heritage with cutting-edge global luxury, we deliver transcendent experiences for discerning kings and queens from across the world.'
                  : 'अंजुमन उदयपुर का एक अति-विशिष्ट पांच सितारा महल है, जो झीलों की नगरी में स्थित है। हम दुनिया भर के वैश्विक पर्यटकों के लिए मेवाड़ विरासत के शाही आतिथ्य और अत्याधुनिक सुख-सुविधाओं का संगम प्रस्तुत करते हैं।'}
              </p>

              {/* Verified Award Badges */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-1.5 p-1.5 bg-brand-black/55 border border-brand-gold/25 rounded">
                  <Award className="w-5 h-5 text-brand-gold shrink-0" />
                  <div>
                    <span className="text-[7.5px] text-white/50 block font-mono">CERTIFIED VIP</span>
                    <span className="text-[8.5px] text-brand-gold font-bold uppercase font-sans">5-STAR HERITAGE</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 bg-brand-black/55 border border-brand-gold/25 rounded">
                  <i className="fa-brands fa-tripadvisor text-brand-gold text-lg shrink-0"></i>
                  <div>
                    <span className="text-[7.5px] text-white/50 block font-mono">TRIPADVISOR</span>
                    <span className="text-[8.5px] text-emerald-400 font-bold uppercase font-sans">EXCELLENCE WINNER</span>
                  </div>
                </div>
              </div>

              {/* Animated Social Icons */}
              <div className="space-y-2 pt-1">
                <h5 className="text-[9px] uppercase font-mono tracking-widest text-[#B0B0C4]">{language === 'EN' ? 'Imperial Social Log' : 'शाही नेटवर्किंग'}</h5>
                <div className="flex gap-2.5">
                  {[
                    { icon: 'fa-instagram', url: 'https://instagram.com/anjumanhotel' },
                    { icon: 'fa-facebook-f', url: 'https://facebook.com/anjumanhotel' },
                    { icon: 'fa-x-twitter', url: 'https://twitter.com/anjumanhotel' },
                    { icon: 'fa-youtube', url: 'https://youtube.com/anjumanhotel' },
                    { icon: 'fa-linkedin-in', url: 'https://linkedin.com/company/anjumanhotel' }
                  ].map((soc, i) => (
                    <a 
                      key={i} 
                      href={soc.url} 
                      target="_blank" 
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full border border-brand-gold/20 flex items-center justify-center text-[#B0B0C4] hover:text-brand-black hover:bg-brand-gold hover:scale-110 hover:shadow-lg transition-all"
                    >
                      <i className={`fa-brands ${soc.icon} text-xs`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUMN 2: QUICK LINKS */}
            <div className="space-y-4 lg:pl-6">
              <h4 className="font-serif text-xs text-brand-gold uppercase tracking-widest border-b border-brand-gold/15 pb-2">
                {language === 'EN' ? 'Quick Links' : 'त्वरित सूची'}
              </h4>
              <ul className="space-y-2 text-xs font-sans text-brand-cream/80">
                <li>
                  <button 
                    onClick={() => { onViewChange('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-brand-gold transition-colors flex items-center gap-1 select-none cursor-pointer"
                  >
                    <span>✦</span> {language === 'EN' ? 'Home Sanctuary' : 'मुख्य गृह'}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { onViewChange('rooms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-brand-gold transition-colors flex items-center gap-1 select-none cursor-pointer"
                  >
                    <span>✦</span> {language === 'EN' ? 'Imperial Rooms' : 'शाही शयनकक्ष'}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { onViewChange('dining'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-brand-gold transition-colors flex items-center gap-1 select-none cursor-pointer"
                  >
                    <span>✦</span> {language === 'EN' ? 'Dining & Menu' : 'कला रसोई'}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { onViewChange('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-brand-gold transition-colors flex items-center gap-1 select-none cursor-pointer"
                  >
                    <span>✦</span> {language === 'EN' ? 'Services & Amenities' : 'राजसी विलासिता'}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { onViewChange('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-brand-gold transition-colors flex items-center gap-1 select-none cursor-pointer"
                  >
                    <span>✦</span> {language === 'EN' ? 'Photo Gallery' : 'शाही चित्र दीर्घा'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onViewChange('home');
                      setTimeout(() => {
                        const el = document.getElementById('about-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 180);
                    }}
                    className="hover:text-brand-gold transition-colors flex items-center gap-1 select-none cursor-pointer"
                  >
                    <span>✦</span> {language === 'EN' ? 'About Us' : 'हमारे बारे में'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setRoyalModal({
                      title: "♛ ROYAL CAREERS & PALACE VOCATIONS",
                      titleHI: "♛ राजसी करियर और सेवा भर्ती",
                      content: "Let your craftsmanship meet Indian royalty. We are always seeking refined curators, traditional Mewar chefs, bespoke housekeepers, and master butlers to serve high dignitaries. Submit your CV and portfolio directly to careers@anjumanhotel.com or connect at +91-294-242-8888.",
                      contentHI: "अंजुमन में सेवा का अर्थ है राजसी परंपराओं का हिस्सेदार बनना। हम हमेशा अनुभवी शेफ, विनम्र प्रबंधकों और प्रशिक्षित बटलर की खोज में रहते हैं। अपना विवरण careers@anjumanhotel.com पर भेजें या +91-294-242-8888 पर संपर्क करें।"
                    })}
                    className="hover:text-brand-gold transition-colors flex items-center gap-1 select-none cursor-pointer"
                  >
                    <span>✦</span> {language === 'EN' ? 'Careers & Jobs' : 'शाही नौकरियां'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setRoyalModal({
                      title: "♛ ANJUMAN PALACE MEDIA CENTRE",
                      titleHI: "♛ अंजुमन प्रेस और मीडिया केंद्र",
                      content: "For high-resolution media brochures, official press kits, editorial photography permits and television filming permissions, please contact our Media Sanctuary directly at press@anjumanhotel.com.",
                      contentHI: "उच्च-चित्र रिज़ॉल्यूशन मीडिया ब्रोशर, प्रेस और सूचना किट, या प्रामाणिक चित्र लेने की अनुमति के लिए सीधे press@anjumanhotel.com पर संपर्क कर सकते हैं।"
                    })}
                    className="hover:text-brand-gold transition-colors flex items-center gap-1 select-none cursor-pointer"
                  >
                    <span>✦</span> {language === 'EN' ? 'Press & Media' : 'मीडिया समाचार'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setRoyalModal({
                      title: "♛ ECO-STEWARDSHIP & SUSTAINABLE HERITAGE",
                      titleHI: "♛ पर्यावरण संरक्षण और सामाजिक पहल",
                      content: "ANJUMAN acts in integration with the Mewar Traditional Artisans Fund. 100% of our cooling water systems are recycled, we utilize complete solar arrays, and we prohibit single-use plastics to protect Udaipur's pristine lake ecology.",
                      contentHI: "अंजुमन उदयपुर की प्राचीन झीलों और पारिस्थिकी की सुरक्षा के लिए प्रतिबद्ध है। १००% रीसाइकिल पानी प्रणाली, सौर ऊर्जा और पारंपरिक मेवाड़ कारीगरों का समर्थन ही हमारी प्राथमिकता है।"
                    })}
                    className="hover:text-brand-gold transition-colors flex items-center gap-1 select-none cursor-pointer"
                  >
                    <span>✦</span> {language === 'EN' ? 'CSR Initiatives' : 'सामाजिक पहल'}
                  </button>
                </li>
              </ul>
            </div>

            {/* COLUMN 3: GUEST SERVICES */}
            <div className="space-y-4">
              <h4 className="font-serif text-xs text-brand-gold uppercase tracking-widest border-b border-brand-gold/15 pb-2">
                {language === 'EN' ? 'Guest Services' : 'अतिथि सेवाएं'}
              </h4>
              <ul className="space-y-2 text-xs font-sans text-brand-cream/80">
                <li>
                  <button 
                    onClick={() => { onViewChange('enquiry'); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                    className="hover:text-brand-gold transition-colors flex items-center gap-1 select-none cursor-pointer text-left"
                  >
                    <span>✦</span> {language === 'EN' ? 'Booking & Reservations' : 'आरक्षण प्रविष्टि'}
                  </button>
                </li>
                <li className="text-white/40 hover:text-white/60 transition-colors flex items-center gap-1 cursor-help" onClick={() => alert('Sovereign Check-in: 14:00 (2 PM IST) | Checkout: 12:00 (12 PM IST). Direct flights are available to Udaipur महाराणा प्रताप हवाई अड्डा.')}>
                  <span>✦</span> {language === 'EN' ? 'Check-in / Check-out Check' : 'आगमन / प्रस्थान समय'}
                </li>
                <li>
                  <button 
                    onClick={() => setRoyalModal({
                      title: "♛ 24/7 BESPOKE BUTLER & ROYAL ROOM SERVICE",
                      titleHI: "♛ चौबीसों घंटे राजसी बटलर सेवा",
                      content: "Your Imperial Chamber includes dedicated, discrete butler assistance round-the-clock. To make initial in-room private dining requests or specific food preference configurations, please write to service@anjumanhotel.com or contact the desk.",
                      contentHI: "आपके कमरे में हमारी राजसी भोजन और विशेष सहायता सेवा बिना रुके उपलब्ध है। आगमन से पहले अपनी पसंद का चयन करने के लिए service@anjumanhotel.com पर संपर्क करें।"
                    })}
                    className="hover:text-brand-gold transition-colors flex items-center gap-1 select-none cursor-pointer text-left"
                  >
                    <span>✦</span> {language === 'EN' ? '24/7 Butler & Room Service' : 'शाही भोजन चौबीसों घंटे'}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setRoyalModal({
                      title: "♛ SOMA SPA & AYURVEDA WELLNESS SANCTUARY",
                      titleHI: "♛ सोम स्पा और आयुर्वेद वेलनेस",
                      content: "Rejuvenate with ancient royal wellness therapy. We recommend booking your treatments at least 72 hours prior to arrival. Direct appointments are coordinated at spa@anjumanhotel.com or via guest portal.",
                      contentHI: "प्राचीन आयुर्वेदिक जड़ी-बूटियों और उपचार प्रणालियों से शरीर को पुनर्जीवित करें। बुकिंग के लिए आगमन से 72 घंटे पहले spa@anjumanhotel.com पर सूचित करें।"
                    })}
                    className="hover:text-brand-gold transition-colors flex items-center gap-1 select-none cursor-pointer text-left"
                  >
                    <span>✦</span> {language === 'EN' ? 'Bespoke Spa Appointments' : 'शाही स्पा बुकिंग'}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      onViewChange('contact');
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="hover:text-brand-gold transition-colors flex items-center gap-1 select-none cursor-pointer text-left"
                  >
                    <span>✦</span> {language === 'EN' ? 'Heritage Event Planning' : 'राजसी विवाह एवं उत्सव'}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      onViewChange('contact');
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="hover:text-brand-gold transition-colors flex items-center gap-1 select-none cursor-pointer text-left"
                  >
                    <span>✦</span> {language === 'EN' ? 'Chauffeur Airport Transfer' : 'राजकीय कार पिकअप'}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setRoyalModal({
                      title: "♛ GIFT THE ROYALTY: EXPERIENCES OF ANJUMAN",
                      titleHI: "♛ अंजुमन उपहार वाउचर",
                      content: "Pamper your loved ones with an unforgettable royal getaway voucher or fine heritage dining gift bundle. Custom digital vouchers starting at ₹5,000 can be arranged instantly by emailing reservations@anjumanhotel.com.",
                      contentHI: "अपने प्रियजनों को अंजुमन आतिथ्य का वाउचर उपहार में दें। ₹5,000 से शुरू होने वाले अद्वितीय डिजिटल वाउचर सीधे reservations@anjumanhotel.com से ईमेल द्वारा प्राप्त कर सकते हैं।"
                    })}
                    className="hover:text-brand-gold transition-colors flex items-center gap-1 select-none cursor-pointer text-left"
                  >
                    <span>✦</span> {language === 'EN' ? 'Gift Vouchers & Luxuries' : 'उपहार कूपन'}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setRoyalModal({
                      title: "♛ THE CROWN CLUB: LOYALTY REGISTRY",
                      titleHI: "♛ द क्राउन क्लब: वफादारी कार्ड",
                      content: "Join our exclusive patronage program. Dignitaries receive complimentary suite upgrades, early check-in parameters, and bespoke spa invitations. Create your free profile by registering a guest session at the top of the page.",
                      contentHI: "अंजुमन के विशेष विशेषाधिकार क्लब से जुड़ें। मुफ्त सुइट अपग्रेड और आगमन प्राथमिकताओं जैसे लाभों के लिए ऊपर दिए गए 'Guest Login' बटन पर अपनी प्रोफाइल बनाएं।"
                    })}
                    className="hover:text-brand-gold transition-colors flex items-center gap-1 select-none cursor-pointer text-left"
                  >
                    <span>✦</span> {language === 'EN' ? 'Anjuman Loyalty Registry' : 'रॉयल वफादारी कार्ड'}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      onViewChange('contact');
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="hover:text-brand-gold transition-colors flex items-center gap-1 select-none cursor-pointer text-left"
                  >
                    <span>✦</span> {language === 'EN' ? 'Corporate Retreat Reservations' : 'कॉर्पोरेट बैठक समूह'}
                  </button>
                </li>
              </ul>
            </div>

            {/* COLUMN 4: REVENUE & CONTACT COORDINATES */}
            <div className="space-y-4">
              <h4 className="font-serif text-xs text-brand-gold uppercase tracking-widest border-b border-brand-gold/15 pb-2">
                {language === 'EN' ? 'Contact Coordinates' : 'शाही संपर्क सूत्र'}
              </h4>
              <div className="space-y-4 text-xs font-sans text-brand-cream/80">
                
                {/* Map location address */}
                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0 mt-0.5">
                    <span className="text-[10px]">📍</span>
                  </div>
                  <a 
                    href="https://maps.google.com/?q=Lake+Pichola,+Udaipur,+Rajasthan,+India" 
                    target="_blank" 
                    referrerPolicy="no-referrer"
                    className="hover:text-brand-gold hover:underline transition-colors"
                  >
                    The Anjuman Palace Sanctuary, Lake Pichola West Promenade Road, Udaipur - 313001, Rajasthan, India
                  </a>
                </div>

                {/* Unified dynamic clickable links for tel, mail, wa */}
                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0 mt-0.5">
                    <Phone className="w-2.5 h-2.5" />
                  </div>
                  <div className="flex flex-col font-mono text-brand-gold font-semibold">
                    <a href="tel:+912942428888" className="hover:underline transition-colors">+91-294-242-8888</a>
                    <a href="tel:+919929428888" className="hover:underline transition-colors">+91-99294-28888</a>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0 mt-0.5">
                    <Mail className="w-2.5 h-2.5" />
                  </div>
                  <a href="mailto:info@anjumanhotel.com" className="font-mono text-brand-gold hover:underline font-semibold overflow-hidden text-ellipsis block max-w-full">
                    info@anjumanhotel.com
                  </a>
                </div>

                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-full border border-[#10b981]/50 bg-emerald-950/20 flex items-center justify-center text-[#10b981] shrink-0 mt-0.5">
                    <i className="fa-brands fa-whatsapp text-xs"></i>
                  </div>
                  <a href="https://wa.me/919929428888" target="_blank" referrerPolicy="no-referrer" className="text-emerald-400 hover:underline font-semibold font-mono">
                    +91-99294-28888 (WhatsApp)
                  </a>
                </div>

                {/* Desk Timings */}
                <div className="pt-2 border-t border-brand-gold/10 space-y-1 text-[10px] font-mono text-[#B0B0C4]">
                  <p className="flex justify-between">
                    <span>👑 Reception Desk:</span>
                    <span className="text-brand-gold font-bold">24 Hours / 7 Days Active</span>
                  </p>
                  <p className="flex justify-between">
                    <span>📅 Reservations Desk:</span>
                    <span className="text-[#FAFAFA]">9:00 AM - 9:00 PM IST</span>
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* BOTTOM COPYRIGHT SUMMARY & LEGAL COMPLIANCE */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-brand-gold/10 text-center text-[10px] text-brand-white/40 font-mono tracking-wider flex flex-col items-center justify-between gap-6 md:flex-row">
            
            <div className="text-center md:text-left space-y-1.5">
              <p className="font-semibold uppercase tracking-widest text-[#B0B0C4]">
                &copy; {new Date().getFullYear()} ANJUMAN HOTEL & SPA RESORTS. ALL PRIVILEGES SECURED.
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center md:justify-start text-[9.5px]">
                <button onClick={() => { onViewChange('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand-gold transition-colors select-none cursor-pointer">Privacy Charter</button>
                <span>|</span>
                <button onClick={() => { onViewChange('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand-gold transition-colors select-none cursor-pointer">Terms & Conditions</button>
                <span>|</span>
                <button onClick={() => { onViewChange('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand-gold transition-colors select-none cursor-pointer">Cookie Policy</button>
                <span>|</span>
                <a href="/sitemap.xml" target="_blank" className="hover:text-brand-gold transition-colors">Sitemap XML</a>
              </div>
              <p className="text-[9px] text-[#C9A84C]/60 pt-0.5">
                Government of India Registered GSTIN: <strong className="text-brand-gold select-all">08AAACO0101R1Z8</strong>
              </p>
            </div>

            {/* Developed with love & Payment support icons list */}
            <div className="text-center md:text-right space-y-2 shrink-0">
              <div className="flex gap-2 justify-center md:justify-end text-[16px] text-[#B0B0C4]/70">
                <i className="fa-brands fa-cc-visa hover:text-white transition-colors" title="Visa Cards Approved" />
                <i className="fa-brands fa-cc-mastercard hover:text-white transition-colors" title="Mastercard VIP Support" />
                <span className="text-[9px] font-bold border border-brand-white/10 px-1 rounded hover:border-white transition-colors self-center" title="RuPay & UPI Integrated">UPI / RUPAY</span>
                <span className="text-[9px] font-bold border border-brand-white/10 px-1 rounded hover:border-white transition-colors self-center" title="Razorpay Secure Enclave">RAZORPAY SECURE</span>
              </div>
              <p className="text-[9px] text-[#B0B0C4]/60">
                Developed styled with ❤️ in India 🇮🇳 for global luxury heritage.
              </p>
            </div>

          </div>
        </footer>

      </div>


      {/* ========================================== */}
      {/* 1. BACK TO TOP BUTTON */}
      {/* ========================================== */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-6 right-20 z-40 w-11 h-11 rounded-full bg-brand-navy border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black flex items-center justify-center transition-all duration-300 shadow-2xl scale-95 hover:scale-105 active:scale-90 ${
          showToTop ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible'
        }`}
        title="Scroll to Royal Peak"
      >
        <ArrowUp className="w-5 h-5 animate-bounce" />
      </button>


      {/* ========================================== */}
      {/* 2. WHATSAPP FLOATING SPEED DIAL */}
      {/* ========================================== */}
      <div className="fixed bottom-6 right-6 z-40 group select-none">
        {/* Tooltip Hover banner */}
        <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 duration-200 pointer-events-none whitespace-nowrap">
          👑 Chat with Royal Concierge
        </span>
        <a 
          href="https://wa.me/919929428888?text=Namaste!%20I%20am%20enquiring%20about%20booking%20a%20luxury%20palatial%20suite%20at%20ANJUMAN%20Hotel,%20Udaipur.%20Please%20guide%20me%20for%20reservations." 
          target="_blank" 
          referrerPolicy="no-referrer"
          className="w-12 h-12 rounded-full bg-[#10b981] text-white flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 animate-whatsapp-pulse cursor-pointer relative"
        >
          <i className="fa-brands fa-whatsapp text-2xl"></i>
        </a>
      </div>


      {/* ========================================== */}
      {/* 3. ACCESSIBILITY USERWAY WIDGET BUTTON & MENU */}
      {/* ========================================== */}
      <div className="fixed bottom-6 left-6 z-40 select-none">
        {/* Accessibility Floating Trigger Icon */}
        <button 
          onClick={() => setIsAccessMenuOpen(!isAccessMenuOpen)}
          className={`w-11 h-11 rounded-full bg-brand-navy border-2 flex items-center justify-center shadow-3xl hover:scale-105 duration-300 cursor-pointer active:scale-95 ${
            isAccessMenuOpen ? 'border-brand-gold bg-brand-gold text-brand-black' : 'border-brand-gold/60 text-brand-gold hover:border-brand-gold'
          }`}
          title="Open Royal Accessibility Controls"
        >
          <Accessibility className="w-5 h-5" />
        </button>

        {/* Floating Controls Dropdown Card */}
        {isAccessMenuOpen && (
          <div className="absolute bottom-14 left-0 w-64 bg-brand-navy/95 border-2 border-brand-gold rounded-xl p-4 shadow-3xl text-white font-sans animate-scale-in text-xs space-y-4 backdrop-blur-md">
            
            <div className="flex items-center justify-between border-b border-brand-gold/20 pb-2">
              <span className="font-serif text-[11px] uppercase tracking-wider text-brand-gold font-bold flex items-center gap-1.5">
                <Accessibility className="w-4 h-4 text-brand-gold animate-pulse" />
                {language === 'EN' ? 'Accessibility Desk' : 'सुलभता केंद्र'}
              </span>
              <button 
                onClick={() => setIsAccessMenuOpen(false)}
                className="text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Menu Options */}
            <div className="space-y-3">
              
              {/* Option A: Font Size scale */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] text-brand-cream uppercase font-bold tracking-wider">
                  <span>{language === 'EN' ? 'Adjust Font Scaling' : 'अक्षर का आकार'}</span>
                  <span className="font-mono text-white">{(fontSizeScale * 100).toFixed(0)}%</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => changeFontSize(false)}
                    className="flex-1 py-1.5 bg-brand-black/40 border border-brand-gold/20 rounded hover:border-brand-gold flex items-center justify-center text-xs font-bold font-mono"
                    title="Scale Down Fonts"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={resetFontSize}
                    className="px-2 bg-brand-black/40 border border-brand-gold/20 rounded hover:border-brand-gold text-[9px] uppercase font-bold tracking-widest"
                  >
                    Reset
                  </button>
                  <button 
                    onClick={() => changeFontSize(true)}
                    className="flex-1 py-1.5 bg-brand-black/40 border border-brand-gold/20 rounded hover:border-brand-gold flex items-center justify-center text-xs font-bold font-mono"
                    title="Scale Up Fonts"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Option B: High Contrast Switch */}
              <div 
                onClick={() => setIsContrastMode(!isContrastMode)}
                className="flex items-center justify-between p-2 bg-brand-black/40 border border-brand-gold/15 rounded-lg hover:border-brand-gold/50 cursor-pointer transition-all"
              >
                <div className="space-y-0.5 pointer-events-none">
                  <span className="font-bold text-brand-cream/90 block text-[10px] uppercase tracking-wider">{language === 'EN' ? 'High Contrast Mode' : 'उच्च विपरीतता रंग'}</span>
                  <p className="text-[9px] text-[#B0B0C4]">{language === 'EN' ? 'Best for high-sunlight or low-vision visibility' : 'तेज धूप या कम रोशनी में सहायक'}</p>
                </div>
                <div className={`w-8 h-4.5 rounded-full transition-colors flex items-center p-0.5 shrink-0 ${isContrastMode ? 'bg-[#C9A84C]' : 'bg-white/10'}`}>
                  <div className={`w-3.5 h-3.5 bg-brand-black rounded-full shadow transform transition-transform ${isContrastMode ? 'translate-x-3.5' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Option C: Dyslexia Friendly font */}
              <div 
                onClick={() => setIsDyslexiaFont(!isDyslexiaFont)}
                className="flex items-center justify-between p-2 bg-brand-black/40 border border-brand-gold/15 rounded-lg hover:border-brand-gold/50 cursor-pointer transition-all"
              >
                <div className="space-y-0.5 pointer-events-none">
                  <span className="font-bold text-brand-cream/90 block text-[10px] uppercase tracking-wider">{language === 'EN' ? 'Dyslexia Friendly Font' : 'पठन-अनुकूल फोंट्स'}</span>
                  <p className="text-[9px] text-[#B0B0C4]">{language === 'EN' ? 'Increases letter heights and readability spacing' : 'सुपाठ्य अक्षरों में प्रदर्शित करें'}</p>
                </div>
                <div className={`w-8 h-4.5 rounded-full transition-colors flex items-center p-0.5 shrink-0 ${isDyslexiaFont ? 'bg-[#C9A84C]' : 'bg-white/10'}`}>
                  <div className={`w-3.5 h-3.5 bg-brand-black rounded-full shadow transform transition-transform ${isDyslexiaFont ? 'translate-x-3.5' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Option D: Disable animations */}
              <div 
                onClick={() => setIsReducedMotion(!isReducedMotion)}
                className="flex items-center justify-between p-2 bg-brand-black/40 border border-brand-gold/15 rounded-lg hover:border-brand-gold/50 cursor-pointer transition-all"
              >
                <div className="space-y-0.5 pointer-events-none">
                  <span className="font-bold text-brand-cream/90 block text-[10px] uppercase tracking-wider">{language === 'EN' ? 'Reduce Animations' : 'कम गतिशीलता'}</span>
                  <p className="text-[9px] text-[#B0B0C4]">{language === 'EN' ? 'Dampens high-frequency effects and flashes' : 'तेज झिलमिलाहट एवं एनिमेशन बंद करें'}</p>
                </div>
                <div className={`w-8 h-4.5 rounded-full transition-colors flex items-center p-0.5 shrink-0 ${isReducedMotion ? 'bg-[#C9A84C]' : 'bg-white/10'}`}>
                  <div className={`w-3.5 h-3.5 bg-brand-black rounded-full shadow transform transition-transform ${isReducedMotion ? 'translate-x-3.5' : 'translate-x-0'}`} />
                </div>
              </div>

            </div>

            {/* Accent Footer inside desk */}
            <div className="text-[9px] text-center font-mono text-brand-gold block border-t border-brand-gold/15 pt-2">
              🏆 COGNITIVE WCAG 2.1 COMPLIANT
            </div>

          </div>
        )}
      </div>


      {/* ========================================== */}
      {/* 4. DYNAMIC PROMO BOOKING REMINDER POPUP */}
      {/* ========================================== */}
      {showReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay background blur */}
          <div className="absolute inset-0 bg-brand-black/85 backdrop-blur-md" onClick={dismissReminderPopup} />
          
          <div className="relative w-full max-w-md bg-[#13132B] border-2 border-brand-gold rounded-2xl overflow-hidden shadow-2xl text-white font-sans animate-scale-in p-6 text-center space-y-4">
            
            {/* Close button */}
            <button 
              onClick={dismissReminderPopup}
              className="absolute top-4 right-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full w-7 h-7 flex items-center justify-center text-sm cursor-pointer"
              title="Dismiss promotion"
            >
              ✕
            </button>

            {/* Glowing Crown Icon */}
            <div className="w-14 h-14 rounded-full border border-brand-gold/30 bg-brand-black flex items-center justify-center text-brand-gold text-2xl mx-auto shadow-lg">
              👑
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-brand-gold font-bold block">
                {language === 'EN' ? 'EXCLUSIVE IMPERIAL WELCOME OFFER' : 'शाही विशेष आमंत्रण कूपन'}
              </span>
              <h3 className="font-serif text-lg md:text-xl font-bold uppercase text-brand-cream">
                {language === 'EN' ? 'Special Limited Direct Booking Privilege' : 'सीधे बुक करें - पायरें विशेष छूट'}
              </h3>
            </div>

            {/* Promo contents message */}
            <p className="text-xs text-brand-cream/80 leading-relaxed max-w-sm mx-auto">
              {language === 'EN' 
                ? 'Book your Royal Chamber within the next 24 hours directly through our portal and enjoy an instant flat 15% OFF + complimentary airport chauffeur pickup and royal organic breakfast!'
                : 'अगले २४ घंटो में इस वेबसाइट द्वारा सीधे बुकिंग पूरा करें और तुरंत फ्लैट १५% छूट के साथ हवाई अड्डा स्थानान्तरण एवं शानदार शाही जलपान उपहार में पाएं!'}
            </p>

            {/* Discount Ribbon Card */}
            <div className="bg-brand-navy p-3 border border-brand-gold/25 rounded-xl block">
              <span className="text-[10px] text-[#A1BBA1] tracking-widest font-mono uppercase font-bold block">ACTIVATE ROYAL COUPON CODE</span>
              <strong className="text-lg text-brand-gold font-mono tracking-widest uppercase select-all">ANJUMANDIRECT15</strong>
            </div>

            {/* Action buttons CTAs */}
            <div className="flex gap-2.5 pt-2 text-xs uppercase tracking-widest font-bold">
              <button 
                onClick={dismissReminderPopup}
                className="flex-1 py-3 border border-brand-white/15 hover:bg-brand-white/5 rounded-lg text-[#B0B0C4] hover:text-white cursor-pointer"
              >
                {language === 'EN' ? 'Dismiss' : 'फिर कभी'}
              </button>
              <button 
                onClick={handleApplyOffer}
                className="flex-1 py-3 bg-gold-gradient text-brand-black hover:bg-none hover:bg-brand-gold hover:scale-103 transition-all rounded-lg cursor-pointer flex items-center justify-center gap-1"
              >
                <Sparkle className="w-3.5 h-3.5 text-brand-black fill-current animate-pulse animate-spin duration-3000" />
                <span>{language === 'EN' ? 'Book Now (15% OFF)' : 'अभी बुक करें'}</span>
              </button>
            </div>

            <span className="text-[8.5px] text-[#B0B0C4]/40 block pt-1 font-mono">
              ★ Premium Direct channels privilege terms apply. Complimentary breakfast valid on all Mewar Royal and Udaipur Lake suites.
            </span>

          </div>
        </div>
      )}

      {/* ROYAL NOTICE POPUP MODAL */}
      {royalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#0c0d1b] border border-brand-gold/40 rounded-xl p-6 md:p-8 shadow-2xl space-y-4">
            
            {/* Crown icon decoration */}
            <div className="w-12 h-12 mx-auto rounded-full border border-brand-gold/20 flex items-center justify-center text-brand-gold text-xl">
              ♛
            </div>

            <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-brand-gold text-center">
              {language === 'EN' ? royalModal.title : royalModal.titleHI || royalModal.title}
            </h3>

            <div className="font-sans text-xs text-brand-cream/90 leading-relaxed text-center py-2 space-y-2">
              <p>{language === 'EN' ? royalModal.content : royalModal.contentHI || royalModal.content}</p>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={() => setRoyalModal(null)}
                className="px-6 py-2 border border-brand-gold/40 hover:border-brand-gold hover:bg-brand-gold/5 text-brand-gold text-[10px] uppercase tracking-widest font-extrabold rounded transition-all cursor-pointer"
              >
                {language === 'EN' ? 'Acknowledge' : 'स्वीकार करें'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
