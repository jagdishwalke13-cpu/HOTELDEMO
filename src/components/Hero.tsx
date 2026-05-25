import { useState, useEffect, FormEvent } from 'react';
import anime from 'animejs';
import { ViewType, LanguageType } from '../types';
import { LUXURY_ROOMS } from '../data';

interface HeroProps {
  language: LanguageType;
  onGoToBookingWithParams: (params: { roomId: string; checkIn: string; checkOut: string; guests: number }) => void;
}

const HERO_SLIDES = [
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1582719478250-c89cae4db85b?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1600'
];

export default function Hero({ language, onGoToBookingWithParams }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [roomId, setRoomId] = useState(LUXURY_ROOMS[0].id);
  const [isLoading, setIsLoading] = useState(false);

  // Auto slideshow rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // 15. Real-time inputs bounds
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setCheckIn(today);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setCheckOut(tomorrow.toISOString().split('T')[0]);
  }, []);

  // Set up Anime.js Entrance timeline + Floating particles on mount
  useEffect(() => {
    // Wait slightly to align with the preloader fading out
    const timeoutId = setTimeout(() => {
      // 2. HERO ENTRANCE TIMELINE
      anime.timeline({
        easing: 'easeOutExpo',
      })
      .add({
        targets: '.hero-tagline',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 800
      })
      .add({
        targets: '.hero-title span', // Split letters stagger
        translateY: [100, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: anime.stagger(80)
      }, '-=400')
      .add({
        targets: '.hero-subtitle',
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 600
      }, '-=600')
      .add({
        targets: '.hero-stars i',
        scale: [0, 1],
        opacity: [0, 1],
        delay: anime.stagger(150),
        duration: 400
      }, '-=400')
      .add({
        targets: '.booking-bar',
        translateY: [60, 0],
        opacity: [0, 1],
        duration: 800
      }, '-=200');

      // 13. FLOATING PARTICLES
      for (let i = 0; i < 30; i++) {
        anime({
          targets: `.particle-${i}`,
          translateX: () => [0, anime.random(-150, 150)],
          translateY: () => [0, anime.random(-150, 150)],
          scale: [0, anime.random(0.5, 1.5)],
          opacity: {
            value: [0, anime.random(0.2, 0.6), 0],
            duration: anime.random(4000, 7000),
            easing: 'easeInOutSine'
          },
          duration: () => anime.random(4000, 8000),
          delay: () => anime.random(0, 3000),
          loop: true,
          easing: 'easeInOutSine'
        });
      }
    }, 1200);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      onGoToBookingWithParams({
        roomId,
        checkIn,
        checkOut,
        guests
      });
    }, 1000);
  };

  return (
    <div className="relative w-full flex flex-col">
      
      {/* Main 100vh Hero visual container */}
      <div className="relative min-h-[100vh] md:h-[100vh] w-full overflow-hidden flex flex-col justify-center pb-8 md:pb-0" id="hero-palace-section">
        
        {/* Dynamic Background Image Slideshow with Parallax overlay */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-out select-none scale-105"
            style={{
              backgroundImage: `url(${slide})`,
              opacity: currentSlide === idx ? 1 : 0,
              transform: currentSlide === idx ? 'scale(1) translateZ(0)' : 'scale(1.05) translateZ(0)',
              transition: 'opacity 2.5s ease-out, transform 5s ease-out'
            }}
          />
        ))}

        {/* Deep luxurious radial gradient overlay to protect text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/45 to-brand-black/60 pointer-events-none" />

        {/* Floating particles background wrapper (Anime.js controlled particles) */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className={`particle-${i} absolute w-1 h-1 bg-brand-gold rounded-full pointer-events-none opacity-0`}
              style={{
                left: `${(i % 6) * 16 + Math.random() * 8}%`,
                top: `${Math.floor(i / 6) * 18 + Math.random() * 8}%`,
              }}
            />
          ))}
        </div>

        {/* Micro floating golden legacy layout stars background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.06)_1.5px,transparent_1.5px)] bg-[size:48px_48px] mix-blend-screen opacity-50 z-10 pointer-events-none" />

        {/* Main Center content structure */}
        <div className="relative md:absolute md:inset-0 flex flex-col items-center justify-center text-center px-4 z-20 pt-24 pb-8 md:pt-0 md:pb-0" id="hero-center-content">
          
          {/* Editorial Welcome Span with hero entrance tagline */}
          <div className="mb-2 overflow-hidden py-1">
            <span className="hero-tagline opacity-0 inline-block text-brand-gold tracking-[0.4em] uppercase text-xs font-semibold font-sans">
              {language === 'EN' ? 'Welcome to Royalty' : 'शाही दरबार में आपका स्वागत है'}
            </span>
          </div>

          {/* Massive Golden Shimmer title with individual split-letters staggered entrance */}
          <h1 className="hero-title font-playfair text-5xl sm:text-7xl md:text-[85px] lg:text-[105px] leading-none mb-3 font-black tracking-widest uppercase mb-1 select-none flex justify-center gap-1 overflow-hidden py-2 select-none">
            {"ANJUMAN".split("").map((char, index) => (
              <span key={index} className="inline-block opacity-0 shimmer gold-glow">
                {char}
              </span>
            ))}
          </h1>

          {/* Editorial Star divider with horizontal lines */}
          <div className="flex items-center gap-3.5 mb-5 w-64 justify-center hero-stars">
            <div className="h-[1px] w-12 bg-brand-gold/30"></div>
            <div className="text-brand-gold text-xs tracking-[0.15em] font-medium leading-none flex gap-1.5 justify-center">
              <i className="fa-solid fa-star opacity-0" />
              <i className="fa-solid fa-star opacity-0" />
              <i className="fa-solid fa-star opacity-0" />
              <i className="fa-solid fa-star opacity-0" />
              <i className="fa-solid fa-star opacity-0" />
            </div>
            <div className="h-[1px] w-12 bg-brand-gold/30"></div>
          </div>

          {/* Subtitle - Cormorant Italic */}
          <div className="overflow-hidden py-1">
            <p className="hero-subtitle opacity-0 font-cormorant text-xl md:text-[25px] text-brand-cream/90 max-w-2xl mb-4 font-normal">
              {language === 'EN' 
                ? 'Where Heritage Meets Modern Opulence' 
                : 'जहां राजसी आतिथ्य आधुनिक विलासिता से मिलता है'}
            </p>
          </div>

          {/* Description line */}
          <p className="font-sans text-xs text-brand-white/50 tracking-[0.05em] text-sm max-w-xl leading-relaxed">
            {language === 'EN' 
              ? 'Experience the pinnacle of Indian hospitality in a sanctuary designed for those who seek the extraordinary.' 
              : 'असाधारण की तलाश करने वालों के लिए बनाए गए इस अभयारण्य में भारतीय आतिथ्य के शिखर का अनुभव करें।'}
          </p>
        </div>

        {/* FLOATING QUICK BOOKING BAR (At bottom of viewport. 10th child of hero-palace-section for selector specificity) */}
        <div className="relative md:absolute md:bottom-6 md:left-0 md:right-0 z-30 max-w-5xl mx-auto w-full px-0 sm:px-4 mt-8 md:mt-0" id="royal-booking-bar-wrapper">
          <div className="booking-bar opacity-0 bg-[#0c0d1b]/95 rounded-xl border border-brand-gold/20 shadow-2xl p-5 md:p-6 transition-luxury">
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              
              {/* Arrival check */}
              <div className="md:col-span-3">
                <label className="block text-[10px] uppercase tracking-widest text-brand-cream font-semibold mb-1.5 flex items-center gap-1.5">
                  <i className="fa-solid fa-arrow-right-to-bracket text-brand-gold"></i>
                  {language === 'EN' ? 'Arrival (Check-in)' : 'आगमन तिथि'}
                </label>
                <input
                  type="date"
                  required
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded border border-brand-gold/15 bg-brand-black/95 text-brand-white focus:outline-none focus:border-brand-gold transition-luxury cursor-pointer"
                />
              </div>

              {/* Departure check */}
              <div className="md:col-span-3">
                <label className="block text-[10px] uppercase tracking-widest text-brand-cream font-semibold mb-1.5 flex items-center gap-1.5">
                  <i className="fa-solid fa-arrow-right-from-bracket text-brand-gold"></i>
                  {language === 'EN' ? 'Departure (Check-out)' : 'प्रस्थान तिथि'}
                </label>
                <input
                  type="date"
                  required
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded border border-brand-gold/15 bg-brand-black/95 text-brand-white focus:outline-none focus:border-brand-gold transition-luxury cursor-pointer"
                />
              </div>

              {/* Dignitary sizes */}
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest text-brand-cream font-semibold mb-1.5 flex items-center gap-1.5">
                  <i className="fa-solid fa-user-group text-brand-gold"></i>
                  {language === 'EN' ? 'Guests' : 'अतिथि'}
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2.5 rounded border border-brand-gold/15 bg-brand-black/95 text-brand-white focus:outline-none focus:border-brand-gold transition-luxury cursor-pointer shadow-inner"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Dignitary' : 'Dignitaries'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Suite Category selection */}
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest text-brand-cream font-semibold mb-1.5 flex items-center gap-1.5">
                  <i className="fa-solid fa-crown text-brand-gold"></i>
                  {language === 'EN' ? 'Suite Type' : 'सुइट विकल्प'}
                </label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded border border-brand-gold/15 bg-brand-black/95 text-brand-white focus:outline-none focus:border-brand-gold transition-luxury cursor-pointer template-select"
                >
                  {LUXURY_ROOMS.map((room) => (
                    <option key={room.id} value={room.id}>
                      {language === 'EN' ? room.name.split(' ')[0] : room.nameHI.split(' ')[0]} Suite
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability submit button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 md:h-[46px] bg-gold-gradient text-[#1A1A2E] font-black uppercase tracking-[0.2em] text-[11px] hover:brightness-115 active:scale-95 transition-all rounded shadow-xl text-center cursor-pointer flex items-center justify-center"
                >
                  {isLoading ? (
                    <i className="fa-solid fa-spinner animate-spin text-sm"></i>
                  ) : (
                    (language === 'EN' ? 'Check Rates' : 'दरें खोजें')
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>

      </div>

    </div>
  );
}
