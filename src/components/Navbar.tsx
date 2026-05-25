import { useState, useEffect } from 'react';
import anime from 'animejs';
import { ViewType, LanguageType, UserSession } from '../types';

interface NavbarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  language: LanguageType;
  onLanguageToggle: () => void;
  user: UserSession | null;
  onLogout: () => void;
  triggerLogin: () => void;
}

export default function Navbar({
  currentView,
  onViewChange,
  language,
  onLanguageToggle,
  user,
  onLogout,
  triggerLogin,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // 3. NAVBAR SCROLL EFFECT WITH ANIME.JS
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      if (scrollPos > 80) {
        if (!isScrolled) {
          setIsScrolled(true);
          anime({
            targets: '#main-hotel-navbar',
            backgroundColor: 'rgba(13, 13, 13, 0.95)',
            paddingTop: '10px',
            paddingBottom: '10px',
            duration: 300,
            easing: 'easeOutQuart'
          });
        }
      } else {
        if (isScrolled) {
          setIsScrolled(false);
          anime({
            targets: '#main-hotel-navbar',
            backgroundColor: 'rgba(13, 13, 13, 0)',
            paddingTop: '20px',
            paddingBottom: '20px',
            duration: 300,
            easing: 'easeOutQuart'
          });
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  // 10. MOBILE MENU ANIMATION EFFECT
  useEffect(() => {
    if (mobileMenuOpen) {
      anime({
        targets: '.mobile-menu',
        translateX: ['100%', '0%'],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutQuart'
      });

      anime({
        targets: '.mobile-menu-item',
        translateX: [50, 0],
        opacity: [0, 1],
        delay: anime.stagger(80),
        duration: 400,
        easing: 'easeOutQuart'
      });
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { value: 'home', label: 'Home', labelHI: 'मुख्य पृष्ठ' },
    { value: 'rooms', label: 'Rooms', labelHI: 'शाही कक्ष' },
    { value: 'services', label: 'Services', labelHI: 'शाही सेवाएं' },
    { value: 'dining', label: 'Dining', labelHI: 'शाही भोजन' },
    { value: 'contact', label: 'Contact', labelHI: 'संपर्क करें' }
  ];

  const handleLinkClick = (val: ViewType) => {
    onViewChange(val);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav
      id="main-hotel-navbar"
      className={`fixed top-0 left-0 right-0 z-[99999] pointer-events-auto border-b transition-colors duration-300 ${
        isScrolled ? 'border-brand-gold/20 shadow-lg bg-[#0c0d1b]' : 'border-transparent bg-transparent lg:bg-transparent md:bg-transparent max-md:bg-[#0c0d1b]'
      }`}
      style={{
        paddingTop: isScrolled ? '10px' : '20px',
        paddingBottom: isScrolled ? '10px' : '20px',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Crown and Title branding */}
        <div
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 flex items-center justify-center border border-brand-gold rounded-full transition-transform duration-500 group-hover:scale-110">
            <span className="text-brand-gold text-[13px] leading-none mb-0.5">♚</span>
          </div>
          <span className="font-playfair text-xl md:text-2xl font-bold tracking-[0.2em] text-brand-gold gold-glow">
            ANJUMAN
          </span>
        </div>

        {/* Center: Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.value}
              onClick={() => handleLinkClick(link.value as ViewType)}
              className={`text-[11px] uppercase tracking-[0.15em] font-semibold transition-luxury relative py-1.5 ${
                currentView === link.value
                  ? 'text-brand-gold'
                  : 'text-brand-white/80 hover:text-brand-gold'
              }`}
            >
              {language === 'EN' ? link.label : link.labelHI}
              {currentView === link.value && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-brand-gold" />
              )}
            </button>
          ))}
          {/* Extra Static Information View Links */}
          <button
            onClick={() => handleLinkClick('privacy')}
            className={`text-[11px] uppercase tracking-[0.15em] font-semibold transition-luxury ${
              currentView === 'privacy' ? 'text-brand-gold' : 'text-brand-white/60 hover:text-brand-gold'
            }`}
          >
            {language === 'EN' ? 'Policy' : 'नीति'}
          </button>
        </div>

        {/* Right side Actions */}
        <div className="flex items-center gap-4">
          
          {/* Bilingual Language Selector */}
          <button
            onClick={onLanguageToggle}
            className="px-2.5 py-1 text-[11px] font-bold border border-brand-gold/20 hover:border-brand-gold text-brand-gold rounded hover:bg-brand-gold/10 transition-luxury uppercase tracking-wider font-mono"
            title={language === 'EN' ? 'Switch to Hindi (हिन्दी)' : 'अंग्रेजी में बदलें (EN)'}
          >
            {language === 'EN' ? 'हिं' : 'EN'}
          </button>

          {/* Login Dropdown */}
          <div className="relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded bg-brand-navy/60 border border-brand-gold/25 hover:border-brand-gold transition-luxury focus:outline-none"
                >
                  <span className="text-brand-gold text-xs leading-none">♚</span>
                  <span className="text-xs font-semibold text-brand-gold hidden sm:inline max-w-[80px] truncate leading-none">
                    {user.fullName.split(' ')[0]}
                  </span>
                  <i className="fa-solid fa-chevron-down text-[9px] text-brand-cream leading-none"></i>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-48 glass-dropdown py-2 rounded shadow-2xl scale-100 origin-top-right transition-all">
                    <button
                      onClick={() => handleLinkClick('dashboard')}
                      className="w-full text-left px-4 py-2.5 hover:bg-[#C9A84C] hover:text-[#1A1A2E] text-xs font-semibold text-brand-white uppercase tracking-wider flex items-center gap-2"
                    >
                      <i className="fa-solid fa-chart-line"></i>
                      {language === 'EN' ? 'Guest Dashboard' : 'अतिथि डैशबोर्ड'}
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-red-800 hover:text-brand-white text-xs font-semibold text-red-300 uppercase tracking-wider flex items-center gap-2 border-t border-brand-gold/10"
                    >
                      <i className="fa-solid fa-right-from-bracket"></i>
                      {language === 'EN' ? 'Vacate Session' : 'लॉग आउट'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={triggerLogin}
                className="text-brand-white hover:text-brand-gold text-sm p-1.5 focus:outline-none"
                title={language === 'EN' ? 'Sign In' : 'लॉगिन करें'}
              >
                <i className="fa-regular fa-user text-base"></i>
              </button>
            )}
          </div>

          {/* Quick Book Now button */}
          <button
            onClick={() => handleLinkClick('enquiry')}
            className="hidden sm:inline-block px-6 py-2.5 bg-gold-gradient text-[#1A1A2E] text-[11px] font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg rounded"
          >
            {language === 'EN' ? 'Book Now' : 'आरक्षण करें'}
          </button>

          {/* Mobile responsive Hambuger Icon */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-1 text-brand-white hover:text-brand-gold focus:outline-none"
          >
            <i className="fa-solid fa-bars-staggered text-xl"></i>
          </button>
        </div>
      </div>

      {/* MOBILE FULL-SCREEN OVERLAY MENU */}
      <div className={`fixed inset-0 z-[99999] flex flex-col justify-center bg-brand-black/98 p-6 text-center transition-all duration-300 ease-out ${
        mobileMenuOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : 'translate-x-full opacity-0 pointer-events-none'
      }`}>
        {/* Close trigger */}
        <button
          onClick={handleMobileMenuClose}
          className="absolute top-6 right-6 text-brand-gold hover:text-brand-white text-2xl focus:outline-none"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <svg className="h-10 w-10 text-brand-gold fill-current mx-auto mb-4 mobile-menu-item" viewBox="0 0 24 24">
          <path d="M2 4l3 6 7-7 7 7 3-6-2 16H4L2 4z" />
        </svg>

        <div className="space-y-6">
          {navLinks.map((link) => (
            <button
              key={link.value}
              onClick={() => handleLinkClick(link.value as ViewType)}
              className={`mobile-menu-item block w-full text-center font-serif text-xl tracking-widest uppercase py-2 focus:outline-none ${
                currentView === link.value ? 'text-brand-gold font-bold' : 'text-brand-white/90'
              }`}
            >
              {language === 'EN' ? link.label : link.labelHI}
            </button>
          ))}

          <button
            onClick={() => handleLinkClick('privacy')}
            className={`mobile-menu-item block w-full text-center font-serif text-lg tracking-widest uppercase py-1 focus:outline-none ${
              currentView === 'privacy' ? 'text-brand-gold' : 'text-brand-white/40'
            }`}
          >
            {language === 'EN' ? 'Privacy Policy' : 'गोपनीयता नीति'}
          </button>
        </div>

        <div className="mt-12 flex flex-col gap-4 items-center">
          {user ? (
            <button
              onClick={() => handleLinkClick('dashboard')}
              className="mobile-menu-item px-6 py-2 border border-brand-gold text-brand-gold text-xs uppercase tracking-widest rounded-full bg-brand-navy/30"
            >
              {language === 'EN' ? 'Open Dashboard' : 'डैशबोर्ड खोलें'}
            </button>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                triggerLogin();
              }}
              className="mobile-menu-item px-6 py-2 border border-brand-gold text-brand-gold text-xs uppercase tracking-widest rounded-full bg-brand-navy/30"
            >
              {language === 'EN' ? 'Guest Login' : 'अतिथि लॉगिन'}
            </button>
          )}

          <button
            onClick={() => handleLinkClick('enquiry')}
            className="mobile-menu-item px-8 py-3 bg-gold-gradient text-brand-navy text-xs font-black uppercase tracking-widest rounded shadow-xl hover:brightness-110 transition-all active:scale-95"
          >
            {language === 'EN' ? 'Book Suite' : 'आरक्षण प्रारंभ करें'}
          </button>
        </div>
      </div>
    </nav>
  );
}
