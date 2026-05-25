import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Waves, 
  Dumbbell, 
  Car, 
  Utensils, 
  Wifi, 
  Tv, 
  AirVent, 
  Users, 
  Bed, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  Calendar, 
  ArrowUpRight, 
  Gift, 
  Briefcase, 
  Camera, 
  ZoomIn, 
  X, 
  Landmark, 
  Heart, 
  Building, 
  Check 
} from 'lucide-react';
import { LanguageType } from '../types';

interface HomeSectionsProps {
  language: LanguageType;
  onBookNow: (roomId: string) => void;
  onGoToEnquiry: () => void;
}

// Stats Counter Component with elegant tick animation
function StatsCounter({ endVal, duration = 2000, suffix = "" }: { endVal: number; duration?: number; suffix?: string }) {
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!countRef.current) return;
    const obj = { value: 0 };
    const anim = anime({
      targets: obj,
      value: endVal,
      round: 1,
      duration: duration,
      easing: 'easeOutExpo',
      update: () => {
        if (countRef.current) {
          countRef.current.innerText = obj.value.toLocaleString() + suffix;
        }
      }
    });
    return () => anim.pause();
  }, [endVal, duration, suffix]);

  return (
    <span ref={countRef} className="stat-number font-playfair text-3xl sm:text-4xl lg:text-5xl text-brand-gold font-bold">
      0{suffix}
    </span>
  );
}

export default function HomeSections({ language, onBookNow, onGoToEnquiry }: HomeSectionsProps) {
  // Section 2: Active Room Slide for Tablet/Mobile Carousel
  const [activeRoomSlide, setActiveRoomSlide] = useState(0);

  // Section 4: Active Offer Index
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);

  // Section 5: Testimonial index
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Section 6: Lightbox Gallery State
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Section 8: Newsletter state
  const [email, setEmail] = useState('');
  const [newsError, setNewsError] = useState('');
  const [newsSuccess, setNewsSuccess] = useState(false);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Setup all Anime.js integrations within HomeSections (Scroll Trigger, Card Hover, Lightbox)
  useEffect(() => {
    // 1. Scroll-Triggered Animations (IntersectionObserver + Anime.js)
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target,
            opacity: [0, 1],
            translateY: [40, 0],
            duration: 900,
            easing: 'easeOutCubic'
          });
          scrollObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const scrollTargets = document.querySelectorAll('.scroll-animate');
    scrollTargets.forEach((target) => scrollObserver.observe(target));

    // 2. Room Card Hover Event Handlers with clean bindings
    const cards = document.querySelectorAll('.room-card');
    const hoverListeners: (() => void)[] = [];

    cards.forEach((card) => {
      const enter = () => {
        anime({
          targets: card,
          translateY: -10,
          boxShadow: '0 20px 45px rgba(201, 168, 76, 0.12)',
          borderColor: 'rgba(201, 168, 76, 0.5)',
          duration: 350,
          easing: 'easeOutCubic'
        });
      };
      const leave = () => {
        anime({
          targets: card,
          translateY: 0,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderColor: 'rgba(201, 168, 76, 0.15)',
          duration: 350,
          easing: 'easeOutCubic'
        });
      };

      card.addEventListener('mouseenter', enter);
      card.addEventListener('mouseleave', leave);

      hoverListeners.push(() => {
        card.removeEventListener('mouseenter', enter);
        card.removeEventListener('mouseleave', leave);
      });
    });

    return () => {
      scrollTargets.forEach((target) => scrollObserver.unobserve(target));
      hoverListeners.forEach((stop) => stop());
    };
  }, []);

  // Lightbox dynamic zoom/opacity animation via AnimeJS
  useEffect(() => {
    if (selectedImageIndex !== null) {
      setTimeout(() => {
        anime({
          targets: '.lightbox-overlay',
          opacity: [0, 1],
          duration: 300,
          easing: 'easeOutQuad'
        });

        anime({
          targets: '.lightbox-img-container',
          scale: [0.9, 1],
          opacity: [0, 1],
          duration: 400,
          easing: 'easeOutQuart'
        });
      }, 50);
    }
  }, [selectedImageIndex]);

  // Section 2 Rooms Data according to the request specifications
  const roomsPreview = [
    {
      id: 'anj-aravali-premier', // Matches existing ID
      name: 'Deluxe Heritage Chamber',
      nameHI: 'डीलक्स हेरिटेज चैंबर',
      price: 8999,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
      beds: 'Super King Bed',
      bedsHI: 'सुपर किंग बेड',
      capacity: '2 Adults',
      capacityHI: '२ वयस्क',
      badge: 'Available',
      badgeHI: 'उपलब्ध',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      rating: 5,
    },
    {
      id: 'anj-executive-club', // Matches corporate/club
      name: 'Premium Silk Suite',
      nameHI: 'प्रीमियम सिल्क सुइट',
      price: 15999,
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800',
      beds: 'Royal King Bed',
      bedsHI: 'रॉयल किंग बेड',
      capacity: '3 Adults',
      capacityHI: '३ वयस्क',
      badge: 'Limited Outbound',
      badgeHI: 'सीमित कक्ष',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      rating: 5,
    },
    {
      id: 'anj-rajputana-suite', // Matches existing
      name: 'Royal Rajputana Vista',
      nameHI: 'शाही राजपूताना विस्टा',
      price: 25999,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
      beds: 'Grand Imperial King',
      bedsHI: 'ग्रैंड इंपीरियल किंग',
      capacity: '3 Adults + 1 Child',
      capacityHI: '३ वयस्क + १ बच्चा',
      badge: 'Available',
      badgeHI: 'उपलब्ध',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      rating: 5,
    },
    {
      id: 'anj-royal-presidential', // Matches existing
      name: 'Presidential Palace Suite',
      nameHI: 'राष्ट्रपति महल सुइट',
      price: 49999,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4db85b?auto=format&fit=crop&q=80&w=800',
      beds: 'Double Maharaja King',
      bedsHI: 'डबल महाराजा किंग',
      capacity: '4 Adults + 2 Children',
      capacityHI: '४ वयस्क + २ बच्चे',
      badge: 'Sold Out Today',
      badgeHI: 'आज बुक हो चुका',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      rating: 5,
    }
  ];

  // Section 4 Offers Data
  const offers = [
    {
      title: 'Royal Honeymoon Package',
      titleHI: 'शाही हनीमून विशेष पैकेज',
      desc: 'Celebrate sovereign union under Rajasthani stars. Includes private lake champagne high tea, rose petal bath, and 20% discount on boutique spa treatments.',
      descHI: 'राजस्थानी सितारों के नीचे शाही मिलन का उत्सव मनाएं। इसमें निजी झील हाई टी, गुलाब की पंखुड़ियों वाला शाही स्नान और २०% छूट शामिल है।',
      discount: '20% OFF',
      discountHI: '२०% छूट',
      validity: 'Valid till Aug 31, 2026',
      validityHI: '३१ अगस्त २०२६ तक वैध',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'Sovereign Corporate Retreat',
      titleHI: 'राजकीय कॉर्पोरेट सम्मेलन उत्सव',
      desc: 'Host majestic leadership Summits with premium boardroom accessibility, state-of-the-art visual theaters, curated grand Mewari gala lunches, and custom rates.',
      descHI: 'प्रीमियम लाउंज और भव्य मेवाड़ी दोपहर के भोजन के आतिथ्य के साथ अद्वितीय व्यावसायिक सम्मेलनों का आयोजन करें।',
      discount: 'Special Rates',
      discountHI: 'विशेष राजकीय दरें',
      validity: 'Corporate credentials required',
      validityHI: 'कॉर्पोरेट क्रेडेंशियल आवश्यक',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'Long Stay Palace Respite',
      titleHI: 'दीर्घकालीन महल विश्राम आतिथ्य',
      desc: 'Immerse deeply in the golden peace of Udaipur. Reserve any premium chamber or boutique palace suite for 3 continuous nights and enjoy the 4th night complimentarily.',
      descHI: 'उदयपुर की स्वर्णिम शांति में गहराई से उतरें। लगातार ३ रातों के लिए सुइट्स आरक्षित करें और चौथी रात मुफ्त पाएं।',
      discount: 'Buy 3 Get 1 Free',
      discountHI: '३ खरीदें १ मुफ्त पाएं',
      validity: 'Valid across peak seasons',
      validityHI: 'सभी पीक सीज़न के दौरान मान्य',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
    }
  ];

  // Section 5 Testimonials Data
  const testimonials = [
    {
      name: 'Pranav Mehta',
      city: 'Delhi',
      cityHI: 'दिल्ली',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      review: 'An incredible royal experience. The personal butler anticipated our every need. Having morning tea overlooking Pichola Lake was a memory we will treasure forever. Truly five-star diamond standard.',
      reviewHI: 'एक अविश्वसनीय शाही अनुभव। व्यक्तिगत बटलर ने हमारी हर ज़रूरत का ध्यान रखा। पिछोला झील को देखते हुए सुबह की चाय पीना एक ऐसी याद है जिसे हम हमेशा संजोकर रखेंगे।'
    },
    {
      name: 'Aishwarya Sen',
      city: 'Mumbai',
      cityHI: 'मुंबई',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      review: 'No other resort compares. The attention to detail, magnificent Rajputana vaults, and the incredible traditional live music in the grand courtyard made us feel like kings. Outstanding services.',
      reviewHI: 'अन्य किसी भी होटल से इसकी तुलना नहीं की जा सकती। बारीकियाँ, शानदार राजपूताना गुंबद और अनोखे संगीत ने हमें बिल्कुल महाराजाओं जैसा महसूस कराया।'
    },
    {
      name: 'Vikram Hegde',
      city: 'Bangalore',
      cityHI: 'बैंगलोर',
      image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300',
      review: 'We arranged our executive retreat here and the service was pristine. Fast secure networks, spectacular dining, and the helidrone logistics support from their local secretariat was world class.',
      reviewHI: 'हमने अपनी शीर्ष प्रबंधन बैठक यहाँ आयोजित की थी। सुदृढ़ सुरक्षा, उत्कृष्ट भोजन और उनकी टीम द्वारा हेलीपैड व्यवस्था की सुविधा सर्वोत्कृष्ट थी।'
    },
    {
      name: 'Ananya Mukherjee',
      city: 'Kolkata',
      cityHI: 'कोलकाता',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      review: 'The Shahi culinary team crafted personalized meals catering to our absolute requirements. The Royal Hammam spa is an therapeutic marvel of sheer rejuvenation. A palace beyond imagination.',
      reviewHI: 'शाही रसोइयों ने हमारी विशिष्ट प्राथमिकताओं के अनुरूप उत्तम व्यंजन तैयार किए। रॉयल हम्माम भी परम विश्राम का एक अद्भुत चमत्कार है।'
    },
    {
      name: 'Devendra Singh',
      city: 'Jaipur',
      cityHI: 'जयपुर',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
      review: 'Being from Rajasthan, I have seen many heritage properties. ANJUMAN captures authentic Mewar design and royalty with a flawless layer of modern convenience. Highly recommended.',
      reviewHI: 'स्वयं राजस्थान से होने के कारण मैंने कई महल देखे हैं। अंजुमन् आधुनिक तकनीक व परम सुख के उत्कृष्ट संतुलन के साथ मेवाड़ के सच्चे वैभव को सहेजता है।'
    }
  ];

  // Section 6 Gallery Images
  const gallery = [
    { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000', caption: 'Imperial Palace Sunset Over Lake Pichola', captionHI: 'पिछोला झील पर महल का विहंगम सूर्यास्त' },
    { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000', caption: 'Golden Archways and Mewar Courtyard Fountains', captionHI: 'स्वर्ण मेहराब और मेवाड़ प्रांगण फव्वारे' },
    { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4db85b?q=80&w=1000', caption: 'The Royal Presidential Suite Living Chamber', captionHI: 'शाही राष्ट्रपति महल सुइट का बैठक कक्ष' },
    { url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000', caption: 'The Infinity Pool Overlooking Majestic Aravali Hills', captionHI: 'भव्य अरावली पहाड़ियों को देखता हुआ अनंत पूल' },
    { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000', caption: 'Bespoke Shahi Gastronomy & Dining Sittings', captionHI: 'बेजोड़ शाही व्यंजन और कलात्मक डाइनिंग' },
    { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000', caption: 'Veda Wellness Sanctuary & Royal Hammam Bath', captionHI: 'वेद वैलनेस और ऐतिहासिक शाही हम्माम स्नान' }
  ];

  const handleNextOffer = () => {
    setActiveOfferIndex((prev) => (prev + 1) % offers.length);
  };

  const handlePrevOffer = () => {
    setActiveOfferIndex((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsError('');
    if (!email || !email.includes('@')) {
      setNewsError(language === 'EN' ? 'Please enter a valid email address.' : 'कृपया मान्य ईमेल पता दर्ज करें।');
      return;
    }
    setNewsSuccess(true);
    setEmail('');
  };

  return (
    <div className="w-full bg-brand-black text-brand-white space-y-0" id="homepage-sections-container">
      
      {/* ---------------------------------------------------- */}
      {/* SECTION 1 - ABOUT SNIPPET (The Anjuman Legacy)     */}
      {/* ---------------------------------------------------- */}
      <section className="w-full py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden" id="about-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Luxury Image with subtle gold border frame */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -top-4 -left-4 w-full h-full border border-brand-gold/20 rounded-lg pointer-events-none transform -translate-x-2 -translate-y-2"></div>
            <div className="relative overflow-hidden rounded-lg shadow-2xl group border border-brand-gold/15">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000" 
                alt="Imperial Courtyard" 
                loading="lazy"
                className="w-full h-[320px] sm:h-[450px] object-cover duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-brand-black/20 group-hover:bg-transparent transition-all duration-700"></div>
            </div>
            
            {/* Absolute badge floating */}
            <div className="absolute -bottom-6 -right-6 bg-brand-navy/90 border border-brand-gold p-4 rounded-lg shadow-xl hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-brand-gold flex items-center justify-center text-brand-gold font-bold">★</div>
              <div>
                <p className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">Inherited Royalty</p>
                <p className="text-xs text-brand-white font-serif italic">Mewari Rajput Legacy</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="space-y-2 scroll-animate opacity-0">
              <span className="text-brand-gold font-accent tracking-[0.3em] text-[11px] uppercase font-bold block">
                {language === 'EN' ? 'THE ANJUMAN LEGACY' : 'अंजुमन की ऐतिहासिक विरासत'}
              </span>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-brand-white leading-tight font-black uppercase">
                {language === 'EN' ? 'Where Heritage Meets Modern Opulence' : 'जहां राजसी विरासत मिलती है आधुनिक विलासिता से'}
              </h2>
              <div className="w-20 h-[1.5px] bg-brand-gold"></div>
            </div>

            <p className="text-brand-white/80 leading-relaxed text-sm sm:text-base font-sans font-medium">
              {language === 'EN' 
                ? 'Rising majestically from the tranquil banks of Pichola Lake in Udaipur, ANJUMAN stands as an architectural wonder celebrating Rajputana royalty. Every intricately carved pillar, hand-applied gold leaf dome, and vintage chandelier speaks to the grand Mewar heritage of high hospitality.'
                : 'उदयपुर की शांत पिछोला झील के सुरम्य तट पर भव्य रूप से स्थापित, अंजुमन राजपूत राजशाही के गौरव का एक अनूठा स्थापत्य वैभव है। यहाँ का प्रत्येक बारीक नक्काशीदार स्तंभ, उत्कृष्ट गुंबद और झूमर आपको मेवाड़ के समृद्ध ऐश्वर्य और उच्च राजकीय आतिथ्य का जीवंत अनुभव कराते हैं।'}
            </p>

            <p className="text-brand-cream/80 text-xs sm:text-sm font-sans italic border-l-2 border-brand-gold/45 pl-4 py-1">
              {language === 'EN'
                ? '“Our sanctuary is designed solely for those who see hospitality not merely as temporary accommodation, but as a lifelong sovereign memory.”'
                : '“हमारा महल उन चुनिंदा अतिथियों के लिए है जिनके लिए आतिथ्य सत्कार सिर्फ ठहरना नहीं, बल्कि जीवन भर के लिए एक अनमोल और यादगार अनुभव है।”'}
            </p>

            {/* Stats Counter Animation Block - Clean, high contrast grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-4 border-y border-brand-gold/15">
              <div className="text-center sm:text-left">
                <p className="block"><StatsCounter endVal={500} suffix="+" /></p>
                <p className="text-[10px] uppercase text-brand-white/60 tracking-wider font-bold mt-1">
                  {language === 'EN' ? 'Royal Chambers' : 'शाही कमरे'}
                </p>
              </div>
              <div className="text-center sm:text-left">
                <p className="block"><StatsCounter endVal={15} suffix="+" /></p>
                <p className="text-[10px] uppercase text-brand-white/60 tracking-wider font-bold mt-1">
                  {language === 'EN' ? 'Years Celebrated' : 'वर्षों की सेवा'}
                </p>
              </div>
              <div className="text-center sm:text-left">
                <p className="block"><StatsCounter endVal={50} suffix="K+" /></p>
                <p className="text-[10px] uppercase text-brand-white/60 tracking-wider font-bold mt-1">
                  {language === 'EN' ? 'Honored Guests' : 'प्रिय अतिथि'}
                </p>
              </div>
              <div className="text-center sm:text-left">
                <p className="block"><StatsCounter endVal={98} suffix="%" /></p>
                <p className="text-[10px] uppercase text-brand-white/60 tracking-wider font-bold mt-1">
                  {language === 'EN' ? 'Guest Devotion' : 'अतिथि संतुष्टि'}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={onGoToEnquiry}
                className="px-8 py-3.5 bg-gold-gradient text-brand-navy font-black text-xs uppercase tracking-[0.2em] hover:scale-105 hover:brightness-110 active:scale-95 transition-all rounded shadow-lg flex items-center gap-2"
              >
                <span>{language === 'EN' ? 'Discover Our Story' : 'हमारी कहानी जानें'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SECTION 2 - FEATURED ROOMS                           */}
      {/* ---------------------------------------------------- */}
      <section className="w-full py-16 sm:py-24 bg-brand-navy/15 border-t border-brand-gold/10" id="featured-rooms-preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Title */}
          <div className="text-center mb-12 sm:mb-16 scroll-animate opacity-0">
            <span className="text-brand-gold font-accent tracking-[0.25em] text-xs uppercase font-bold block mb-1">
              {language === 'EN' ? 'MAJESTIC CHAMBERS' : 'परम विलासिता पूरित शयनकक्ष'}
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-brand-white font-black uppercase tracking-wide">
              {language === 'EN' ? 'Our Luxurious Rooms' : 'विशेष चुनिंदा सुइट्स एवं कमरे'}
            </h2>
            <div className="w-24 h-[1.5px] bg-brand-gold mx-auto mt-4"></div>
          </div>

          {/* Desktop Responsive Grid (4 columns) & Mobile Horizontal Touch Caravan */}
          <div className="block">
            {/* Carousel Navigation buttons (visible on mobile/tablet to turn indices) */}
            <div className="flex sm:hidden justify-between items-center mb-6">
              <span className="text-xs text-brand-cream font-mono">
                {language === 'EN' ? `Suite ${activeRoomSlide + 1} of 4` : `सुइट ${activeRoomSlide + 1} / ४`}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveRoomSlide((prev) => Math.max(0, prev - 1))}
                  disabled={activeRoomSlide === 0}
                  className="w-10 h-10 border border-brand-gold/20 flex items-center justify-center rounded-full text-brand-gold hover:bg-brand-gold/15 transition-all text-xs disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setActiveRoomSlide((prev) => Math.min(3, prev + 1))}
                  disabled={activeRoomSlide === 3}
                  className="w-10 h-10 border border-brand-gold/20 flex items-center justify-center rounded-full text-brand-gold hover:bg-brand-gold/15 transition-all text-xs disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Cards Element Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {roomsPreview.map((room, idx) => {
                // Determine responsive visibility based on activeRoomSlide on small displays
                const isHiddenOnMobile = activeRoomSlide !== idx;

                return (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                    className={`room-card bg-brand-black/45 glass-panel rounded-xl overflow-hidden border border-brand-gold/15 transition-all duration-300 flex flex-col group ${isHiddenOnMobile ? 'hidden sm:flex' : 'flex'}`}
                  >
                    
                    {/* Image with hover zoom effect and Availability badge */}
                    <div className="relative h-56 sm:h-48 overflow-hidden">
                      <img 
                        src={room.image} 
                        alt={room.name} 
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-black/20"></div>
                      
                      {/* Availability badge */}
                      <span className={`absolute top-3 left-3 px-2.5 py-0.5 border text-[9px] font-mono font-bold uppercase rounded ${room.badgeColor}`}>
                        {language === 'EN' ? room.badge : room.badgeHI}
                      </span>

                      {/* Star Rating badge */}
                      <span className="absolute top-3 right-3 text-[10px] text-brand-gold bg-brand-black/85 px-2 py-0.5 rounded border border-brand-gold/10 font-bold flex items-center gap-1 font-sans">
                        <Star className="w-3 h-3 fill-brand-gold text-brand-gold" />
                        5.0
                      </span>
                    </div>

                    {/* Metadata Package */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-serif text-lg text-brand-gold font-bold uppercase tracking-wide group-hover:text-brand-cream transition-colors">
                            {language === 'EN' ? room.name : room.nameHI}
                          </h3>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="font-serif text-lg text-brand-white font-bold">₹{room.price.toLocaleString('en-IN')}</span>
                            <span className="text-[10px] text-brand-cream/60 uppercase tracking-widest">/ {language === 'EN' ? 'night' : 'रात्रि'}</span>
                          </div>
                        </div>

                        {/* Standard Specifications Icons Checklist */}
                        <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-[11px] text-brand-white/80 border-t border-brand-gold/10 pt-4">
                          <div className="flex items-center gap-2">
                            <Bed className="w-3.5 h-3.5 text-brand-gold/80 shrink-0" />
                            <span className="truncate">{language === 'EN' ? room.beds : room.bedsHI}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Wifi className="w-3.5 h-3.5 text-brand-gold/80 shrink-0" />
                            <span>1 Gbps Wifi</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AirVent className="w-3.5 h-3.5 text-brand-gold/80 shrink-0" />
                            <span>Climate AC</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Tv className="w-3.5 h-3.5 text-brand-gold/80 shrink-0" />
                            <span>4K Smart TV</span>
                          </div>
                          <div className="flex items-center gap-2 col-span-2">
                            <Users className="w-3.5 h-3.5 text-brand-gold/80 shrink-0" />
                            <span>{language === 'EN' ? `Accommodates ${room.capacity}` : `क्षमता: ${room.capacityHI}`}</span>
                          </div>
                        </div>
                      </div>

                      {/* Dual Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 mt-6 border-t border-brand-gold/10 pt-4">
                        <button 
                          onClick={() => onBookNow(room.id)}
                          className="py-2 px-3 bg-gold-gradient text-brand-navy text-[10px] font-black uppercase tracking-widest text-center rounded hover:brightness-110 active:scale-95 transition-all w-full"
                        >
                          {language === 'EN' ? 'Book Now' : 'आरक्षण करें'}
                        </button>
                        <button 
                          onClick={() => onBookNow(room.id)}
                          className="py-2 px-3 border border-brand-gold/35 text-brand-gold hover:bg-brand-gold hover:text-brand-black text-[10px] font-bold uppercase tracking-widest text-center rounded active:scale-95 transition-all w-full"
                        >
                          {language === 'EN' ? 'View Details' : 'विवरण देखें'}
                        </button>
                      </div>

                    </div>

                  </motion.div>
                );
              })}
            </div>

            {/* Bullet Indicators for active mobile slides */}
            <div className="flex sm:hidden justify-center gap-1.5 mt-6">
              {[0, 1, 2, 3].map((bulletIdx) => (
                <button
                  key={bulletIdx}
                  onClick={() => setActiveRoomSlide(bulletIdx)}
                  className={`w-2 h-2 rounded-full transition-all ${activeRoomSlide === bulletIdx ? 'bg-brand-gold w-4' : 'bg-brand-white/20'}`}
                ></button>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SECTION 3 - SERVICES HIGHLIGHT (World-Class Amenities) */}
      {/* ---------------------------------------------------- */}
      <section className="w-full py-16 sm:py-24 bg-brand-black relative" id="amenities-highlights">
        
        {/* Subtle royal background layout overlays */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 scroll-animate opacity-0">
            <span className="text-brand-gold font-accent tracking-[0.25em] text-xs uppercase font-bold block mb-1">
              {language === 'EN' ? 'SOVEREIGN SERVICES' : 'सर्वोपरि शाही राजसी विलासिता'}
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-brand-white font-black uppercase tracking-wide">
              {language === 'EN' ? 'World-Class Amenities' : 'अतिविशिष्ट सुख-सुविधाएं'}
            </h2>
            <div className="w-24 h-[1.5px] bg-brand-gold mx-auto mt-4"></div>
          </div>

          {/* 6 Grid items in 3col -> 2col -> 1col format */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* AMENITY 1 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              whileHover={{ scale: 1.03 }}
              className="bg-brand-navy/35 glass-panel p-6 sm:p-8 rounded-xl border border-brand-gold/15 hover:border-brand-gold/45 transition-all text-left space-y-4 group cursor-pointer hover:shadow-xl hover:shadow-brand-gold/5"
            >
              <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center text-brand-gold group-hover:bg-gold-gradient group-hover:text-brand-navy transition-all">
                <Utensils className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-brand-gold uppercase tracking-wider group-hover:text-brand-white transition-colors">
                {language === 'EN' ? 'Fine Dining Restaurant' : 'कला डाइनिंग रेस्तरां'}
              </h3>
              <p className="text-xs sm:text-sm text-brand-white/75 leading-relaxed">
                {language === 'EN' 
                  ? 'Savor custom royal culinary feasts. Tailored menus prepared by traditional master chefs with historic Mewari secret recipes.' 
                  : 'शाही राजसी भोज का स्वाद चखें। पुरानी मेवाड़ी गोपनीय पाक गृह शैलियों द्वारा रसोइया प्रमुखों द्वारा परोसा गया उत्तम भोजन।'}
              </p>
            </motion.div>

            {/* AMENITY 2 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              whileHover={{ scale: 1.03 }}
              className="bg-brand-navy/35 glass-panel p-6 sm:p-8 rounded-xl border border-brand-gold/15 hover:border-brand-gold/45 transition-all text-left space-y-4 group cursor-pointer hover:shadow-xl hover:shadow-brand-gold/5"
            >
              <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center text-brand-gold group-hover:bg-gold-gradient group-hover:text-brand-navy transition-all">
                <Waves className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-brand-gold uppercase tracking-wider group-hover:text-brand-white transition-colors">
                {language === 'EN' ? 'Infinity Swimming Pool' : 'शाही विलासिता अनंत पूल'}
              </h3>
              <p className="text-xs sm:text-sm text-brand-white/75 leading-relaxed">
                {language === 'EN' 
                  ? 'Recline instantly by our massive temperature-controlled infinity plunge pool offering direct panoramic sights of Pichola Lake.' 
                  : 'पिछोला झील के लुभावने प्राकृतिक दृश्यों को देखते हुए हमारे गर्म पानी के बड़े अनंत स्विमिंग पूल में आराम करें।'}
              </p>
            </motion.div>

            {/* AMENITY 3 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.25 }}
              whileHover={{ scale: 1.03 }}
              className="bg-brand-navy/35 glass-panel p-6 sm:p-8 rounded-xl border border-brand-gold/15 hover:border-brand-gold/45 transition-all text-left space-y-4 group cursor-pointer hover:shadow-xl hover:shadow-brand-gold/5"
            >
              <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center text-brand-gold group-hover:bg-gold-gradient group-hover:text-brand-navy transition-all">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-brand-gold uppercase tracking-wider group-hover:text-brand-white transition-colors">
                {language === 'EN' ? 'Royal Spa & Wellness' : 'मुकुट आरोग्यम आयुर्वेदिक स्पा'}
              </h3>
              <p className="text-xs sm:text-sm text-brand-white/75 leading-relaxed">
                {language === 'EN' 
                  ? 'Experience holistic restoration. Ancient Ayurvedic therapies, herbal mud treatments, and organic aromatherapy oils.' 
                  : 'वेद आरोग्य आयुर्वेदिक प्राचीन पद्धती, प्राकृतिक उपचार, और दुर्लभ जड़ी-बूटियों के सुगंध तेलों द्वारा संपूर्ण विश्राम प्राप्त करें।'}
              </p>
            </motion.div>

            {/* AMENITY 4 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.35 }}
              whileHover={{ scale: 1.03 }}
              className="bg-brand-navy/35 glass-panel p-6 sm:p-8 rounded-xl border border-brand-gold/15 hover:border-brand-gold/45 transition-all text-left space-y-4 group cursor-pointer hover:shadow-xl hover:shadow-brand-gold/5"
            >
              <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center text-brand-gold group-hover:bg-gold-gradient group-hover:text-brand-navy transition-all">
                <Dumbbell className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-brand-gold uppercase tracking-wider group-hover:text-brand-white transition-colors">
                {language === 'EN' ? 'Imperial Fitness Loft' : 'व्यायाम लॉफ्ट एवं योग शाला'}
              </h3>
              <p className="text-xs sm:text-sm text-brand-white/75 leading-relaxed">
                {language === 'EN' 
                  ? 'Modern cardio equipment paired with bespoke private personal sessions with certified coaches and meditation masters.' 
                  : 'आधुनिक विश्व-स्तरीय जिम कसरत उपकरणों से सुसज्जित कक्ष, योग प्रशिक्षकों, और एकाग्रता ध्यान कक्षों का अनूठा सम्मिश्रण।'}
              </p>
            </motion.div>

            {/* AMENITY 5 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.45 }}
              whileHover={{ scale: 1.03 }}
              className="bg-brand-navy/35 glass-panel p-6 sm:p-8 rounded-xl border border-brand-gold/15 hover:border-brand-gold/45 transition-all text-left space-y-4 group cursor-pointer hover:shadow-xl hover:shadow-brand-gold/5"
            >
              <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center text-brand-gold group-hover:bg-gold-gradient group-hover:text-brand-navy transition-all">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-brand-gold uppercase tracking-wider group-hover:text-brand-white transition-colors">
                {language === 'EN' ? 'Banquet & Imperial Events' : 'दर्पण पैलेस उत्सव हॉल'}
              </h3>
              <p className="text-xs sm:text-sm text-brand-white/75 leading-relaxed">
                {language === 'EN' 
                  ? 'Celebrate high-level weddings and conventions in glittering crystal halls equipped with royal-vibe canopies.' 
                  : 'भव्य शाही शादियों, राजकीय सम्मेलनों और विलासिता पूरित भव्य प्रीतिभोजों के लिए उत्कृष्ट कांच जड़ित स्वर्ण महल प्रांगण।'}
              </p>
            </motion.div>

            {/* AMENITY 6 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.55 }}
              whileHover={{ scale: 1.03 }}
              className="bg-brand-navy/35 glass-panel p-6 sm:p-8 rounded-xl border border-brand-gold/15 hover:border-brand-gold/45 transition-all text-left space-y-4 group cursor-pointer hover:shadow-xl hover:shadow-brand-gold/5"
            >
              <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center text-brand-gold group-hover:bg-gold-gradient group-hover:text-brand-navy transition-all">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-brand-gold uppercase tracking-wider group-hover:text-brand-white transition-colors">
                {language === 'EN' ? 'Palace Airport Transfer' : 'रॉल्स रॉयस हवाई अड्डा सेवा'}
              </h3>
              <p className="text-xs sm:text-sm text-brand-white/75 leading-relaxed">
                {language === 'EN' 
                  ? 'Enjoy seamless transportation in ultra-luxurious Rolls Royce or private helicopter charters with high security.' 
                  : 'सुरक्षित हवाई अड्डा आवागमन की अभूतपूर्व सेवा। रॉल्स रॉयस या निजी चार्टर हेलीकॉप्टर की विशेष सुविधा।'}
              </p>
            </motion.div>

          </div>

          {/* Prompt action */}
          <div className="text-center mt-12">
            <button 
              onClick={onGoToEnquiry}
              className="px-8 py-3.5 bg-gold-gradient text-brand-navy font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all rounded shadow-lg"
            >
              {language === 'EN' ? 'Enquire Premium Facilities' : 'विशेष सुविधाओं के लिए पूछताछ करें'}
            </button>
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SECTION 4 - SPECIAL OFFERS                           */}
      {/* ---------------------------------------------------- */}
      <section className="w-full py-16 sm:py-24 bg-brand-navy/15 border-t border-brand-gold/10" id="special-offers-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 scroll-animate opacity-0">
            <span className="text-brand-gold font-accent tracking-[0.25em] text-xs uppercase font-bold block mb-1">
              {language === 'EN' ? 'PRIVILEGES & REWARDS' : 'शाही विशेषाधिकार उपहार'}
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-brand-white font-black uppercase tracking-wide">
              {language === 'EN' ? 'Special Limited Offers' : 'विशेष सीमित ऑफर'}
            </h2>
            <div className="w-24 h-[1.5px] bg-brand-gold mx-auto mt-4"></div>
          </div>

          {/* Carousel Slider with 3 offer cards */}
          <div className="relative max-w-4xl mx-auto">
            
            {/* Slide block with AnimatePresence */}
            <div className="overflow-hidden min-h-[350px] sm:min-h-[280px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeOfferIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="bg-brand-black/50 glass-panel border border-brand-gold/25 p-6 sm:p-10 rounded-2xl flex flex-col md:flex-row gap-6 md:gap-10 items-center hover:border-brand-gold/60 transition-all shadow-2xl"
                >
                  {/* Offer Image Left */}
                  <div className="w-full md:w-2/5 h-48 md:h-56 relative shrink-0 overflow-hidden rounded-lg border border-brand-gold/15">
                    <img 
                      src={offers[activeOfferIndex].image} 
                      alt={offers[activeOfferIndex].title} 
                      loading="lazy"
                      className="w-full h-full object-cover select-none"
                    />
                    <div className="absolute top-3 left-3 bg-brand-navy text-brand-gold text-[10px] uppercase tracking-widest px-3 py-1 font-mono font-bold border border-brand-gold/40 rounded shadow-md">
                      {language === 'EN' ? offers[activeOfferIndex].discount : offers[activeOfferIndex].discountHI}
                    </div>
                  </div>

                  {/* Offer Text content Right */}
                  <div className="flex-1 text-left space-y-4">
                    <span className="text-brand-gold text-[10px] tracking-widest font-bold uppercase rounded border border-brand-gold/25 p-1 px-2.5 font-mono">
                      {language === 'EN' ? offers[activeOfferIndex].validity : offers[activeOfferIndex].validityHI}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-brand-white font-bold uppercase tracking-wide pt-2">
                      {language === 'EN' ? offers[activeOfferIndex].title : offers[activeOfferIndex].titleHI}
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-white/80 leading-relaxed font-sans font-medium">
                      {language === 'EN' ? offers[activeOfferIndex].desc : offers[activeOfferIndex].descHI}
                    </p>
                    
                    {/* Action */}
                    <div className="pt-2">
                      <button 
                        onClick={() => onBookNow('all')}
                        className="px-6 py-2.5 bg-gold-gradient text-brand-navy font-black text-[10px] uppercase tracking-widest rounded hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center gap-1.5"
                      >
                        <span>{language === 'EN' ? 'Claim Offer Privileges' : 'शाही ऑफर प्राप्त करें'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Navigation arrows */}
            <div className="absolute -left-4 sm:-left-6 lg:-left-16 top-1/2 transform -translate-y-1/2">
              <button 
                onClick={handlePrevOffer}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-brand-gold/20 hover:border-brand-gold hover:bg-brand-gold/10 text-brand-gold flex items-center justify-center transition-all bg-brand-black/95 shadow-md"
              >
                <ChevronLeft className="w-5 h-5 pointer-events-none" />
              </button>
            </div>
            <div className="absolute -right-4 sm:-right-6 lg:-right-16 top-1/2 transform -translate-y-1/2">
              <button 
                onClick={handleNextOffer}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-brand-gold/20 hover:border-brand-gold hover:bg-brand-gold/10 text-brand-gold flex items-center justify-center transition-all bg-brand-black/95 shadow-md"
              >
                <ChevronRight className="w-5 h-5 pointer-events-none" />
              </button>
            </div>

            {/* Dot bullets */}
            <div className="flex justify-center gap-2 mt-6">
              {[0, 1, 2].map((it) => (
                <button
                  key={it}
                  onClick={() => setActiveOfferIndex(it)}
                  className={`w-2 h-2 rounded-full transition-all ${activeOfferIndex === it ? 'bg-brand-gold w-4' : 'bg-brand-white/25'}`}
                ></button>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SECTION 5 - TESTIMONIALS (Auto-rotating slider)      */}
      {/* ---------------------------------------------------- */}
      <section className="w-full py-16 sm:py-24 bg-brand-black relative overflow-hidden" id="royal-reviews">
        
        {/* Luxury subtle pattern background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=10&w=100')", filter: 'grayscale(100%)' }}></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          
          {/* Title banner */}
          <div className="mb-10 text-center scroll-animate opacity-0">
            <span className="text-brand-gold font-accent tracking-[0.25em] text-xs uppercase font-bold block mb-1">
              {language === 'EN' ? 'HONORED ECHOES' : 'अतिथियों के सुखद उद्गार'}
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl text-brand-white font-black uppercase tracking-wide">
              {language === 'EN' ? 'Sovereign Testimonials' : 'अतिथियों के अनुभव'}
            </h2>
            <div className="w-20 h-[1px] bg-brand-gold/30 mx-auto mt-3"></div>
          </div>

          {/* Slider box */}
          <div className="relative">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 md:space-y-8 py-4 px-4 sm:px-8"
              >
                {/* Five gold stars */}
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4.5 h-4.5 fill-brand-gold text-brand-gold" />
                  ))}
                </div>

                {/* Big typography quote */}
                <blockquote className="font-playfair text-lg sm:text-2xl md:text-3xl text-brand-cream/90 leading-relaxed font-light italic max-w-3xl mx-auto">
                  “{language === 'EN' ? testimonials[activeTestimonial].review : testimonials[activeTestimonial].reviewHI}”
                </blockquote>

                {/* Portrait Circle, Name, City */}
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-brand-gold/45 shadow-lg p-0.5 bg-brand-black">
                    <img 
                      src={testimonials[activeTestimonial].image} 
                      alt={testimonials[activeTestimonial].name} 
                      loading="lazy"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif text-[15px] sm:text-lg text-brand-white font-semibold tracking-wider">
                      {testimonials[activeTestimonial].name}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-brand-gold uppercase tracking-widest font-mono font-bold mt-0.5">
                      📍 {language === 'EN' ? testimonials[activeTestimonial].city : testimonials[activeTestimonial].cityHI}, India
                    </p>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

            {/* Micro Navigation triggers inside block */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button 
                onClick={handlePrevTestimonial}
                className="w-8 h-8 rounded-full border border-brand-gold/15 text-brand-gold/70 hover:text-brand-gold hover:border-brand-gold transition-all flex items-center justify-center text-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Bullets */}
              <div className="flex gap-1.5">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${activeTestimonial === index ? 'bg-brand-gold w-3' : 'bg-brand-white/20'}`}
                  ></button>
                ))}
              </div>

              <button 
                onClick={handleNextTestimonial}
                className="w-8 h-8 rounded-full border border-brand-gold/15 text-brand-gold/70 hover:text-brand-gold hover:border-brand-gold transition-all flex items-center justify-center text-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SECTION 6 - GALLERY PREVIEW                          */}
      {/* ---------------------------------------------------- */}
      <section className="w-full py-16 sm:py-24 bg-brand-navy/15 border-t border-brand-gold/10" id="palace-gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section title */}
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-brand-gold font-accent tracking-[0.25em] text-xs uppercase font-bold block mb-1">
              {language === 'EN' ? 'VISUAL CHRONICLE' : 'अंजुमन छायाचित्र दीर्घा'}
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-brand-white font-black uppercase tracking-wide">
              {language === 'EN' ? 'Our Palace Gallery' : 'राजसी छायाचित्र प्रदर्शिनी'}
            </h2>
            <div className="w-24 h-[1.5px] bg-brand-gold mx-auto mt-4"></div>
          </div>

          {/* Masonry Matrix Grid (6 Images) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item, index) => {
              // Create dynamic spans to output a masonry grid feel
              let masonryClass = "h-64 sm:h-72";
              if (index === 0) masonryClass = "h-72 sm:h-80 lg:col-span-2";
              if (index === 3) masonryClass = "h-64 sm:h-84 lg:row-span-2";
              if (index === 5) masonryClass = "h-72 sm:h-80";

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative ${masonryClass} overflow-hidden rounded-xl border border-brand-gold/15 hover:border-brand-gold/45 group cursor-pointer shadow-xl`}
                >
                  <img 
                    src={item.url} 
                    alt={language === 'EN' ? item.caption : item.captionHI} 
                    loading="lazy"
                    className="w-full h-full object-cover duration-1000 group-hover:scale-105"
                  />
                  {/* Hover Overlay with search and zoom icons */}
                  <div className="absolute inset-0 bg-brand-black/75 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full border border-brand-gold text-brand-gold flex items-center justify-center bg-brand-black/55">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                    <p className="font-serif text-[15px] sm:text-base text-brand-gold uppercase tracking-wider font-semibold">
                      {language === 'EN' ? 'Enlarge View' : 'चित्र विस्तार देखें'}
                    </p>
                    <p className="text-[10px] sm:text-xs text-brand-white/80 font-sans italic max-w-xs">
                      {language === 'EN' ? item.caption : item.captionHI}
                    </p>
                  </div>

                  {/* Tiny indicator at bottom */}
                  <div className="absolute bottom-3 left-3 bg-brand-black/60 px-2 py-0.5 rounded text-[9px] uppercase tracking-widest text-brand-cream/80 border border-brand-gold/10 lg:hidden">
                    {language === 'EN' ? 'Click to Zoom' : 'विस्तार करें'}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Action button */}
          <div className="text-center mt-12">
            <button 
              onClick={onGoToEnquiry}
              className="px-8 py-3.5 border border-brand-gold/30 hover:bg-brand-gold hover:text-brand-black text-brand-gold text-xs font-black uppercase tracking-[0.2em] rounded transition-all shadow-lg active:scale-95"
            >
              {language === 'EN' ? 'Request Photo Brocard' : 'प्रदर्शिनी ब्रोशर डाउनलोड करें'}
            </button>
          </div>

        </div>

        {/* --- LIGHTBOX MODAL --- */}
        <AnimatePresence>
          {selectedImageIndex !== null && (
            <div className="lightbox-overlay fixed inset-0 z-[100] bg-brand-black/95 flex flex-col items-center justify-center p-4 sm:p-6 select-none opacity-0">
              
              {/* Close button absolute top right */}
              <button 
                onClick={() => setSelectedImageIndex(null)}
                className="absolute top-4 sm:top-6 right-4 sm:right-6 w-12 h-12 bg-zinc-900 border border-brand-gold/20 flex items-center justify-center text-brand-gold rounded-full hover:bg-brand-gold hover:text-brand-black hover:border-brand-gold transition-all z-[110]"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Main Image content body inside animatable container */}
              <div className="lightbox-img-container opacity-0 scale-90 flex flex-col items-center max-w-5xl w-full">
                
                {/* Main Image content body */}
                <div className="relative w-full h-[60vh] sm:h-[70vh] flex items-center justify-center">
                  
                  {/* Left handler */}
                  <button 
                    onClick={() => setSelectedImageIndex((prev) => (prev! - 1 + gallery.length) % gallery.length)}
                    className="absolute left-1 sm:left-4 w-12 h-12 rounded-full border border-brand-gold/20 hover:border-brand-gold hover:bg-zinc-900 text-brand-gold flex items-center justify-center transition-all bg-brand-black/85 z-20"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                <motion.img 
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  src={gallery[selectedImageIndex].url}
                  alt={gallery[selectedImageIndex].caption}
                  className="max-w-full max-h-full object-contain rounded-lg border border-brand-gold/25 shadow-2xl"
                />

                {/* Right handler */}
                <button 
                  onClick={() => setSelectedImageIndex((prev) => (prev! + 1) % gallery.length)}
                  className="absolute right-1 sm:right-4 w-12 h-12 rounded-full border border-brand-gold/20 hover:border-brand-gold hover:bg-zinc-900 text-brand-gold flex items-center justify-center transition-all bg-brand-black/85"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

              </div>

              {/* Caption and status bar below */}
              <div className="mt-6 text-center max-w-lg space-y-2">
                <span className="text-[10px] text-brand-gold font-mono uppercase tracking-widest font-bold block">
                  {language === 'EN' ? `SCENE ${selectedImageIndex + 1} OF ${gallery.length}` : `चित्र ${selectedImageIndex + 1} / ${gallery.length}`}
                </span>
                <p className="font-serif text-lg sm:text-xl text-brand-white uppercase tracking-wide">
                  {language === 'EN' ? gallery[selectedImageIndex].caption : gallery[selectedImageIndex].captionHI}
                </p>
                <div className="w-16 h-[1px] bg-brand-gold/25 mx-auto"></div>
              </div>

              </div>

            </div>
          )}
        </AnimatePresence>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SECTION 7 - LOCATION / MAP                           */}
      {/* ---------------------------------------------------- */}
      <section className="w-full py-16 sm:py-24 bg-brand-black border-t border-brand-gold/10" id="palace-location">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left: Metadata details coordinates (4cols) */}
            <div className="lg:col-span-5 text-left space-y-6 sm:space-y-8">
              
              <div className="space-y-2 scroll-animate opacity-0">
                <span className="text-brand-gold font-accent tracking-[0.25em] text-xs uppercase font-bold block">
                  {language === 'EN' ? 'ROYAL COORDINATES' : 'शाही महल क्षेत्र स्थान'}
                </span>
                <h2 className="font-playfair text-3xl sm:text-4xl text-brand-white font-black uppercase leading-tight">
                  {language === 'EN' ? 'Sanctuary Location' : 'अंजुमन की पावन स्थली'}
                </h2>
                <div className="w-20 h-[1.5px] bg-brand-gold mt-4"></div>
              </div>

              <p className="text-brand-white/80 text-sm sm:text-base leading-relaxed">
                {language === 'EN' 
                  ? 'ANJUMAN stands proudly at the premium banks of Pichola Lake in Udaipur, Rajasthan. The destination is accessible within 45 minutes travel from Maharana Pratap Domestic Airport (UDR) and major royal railway circuits.' 
                  : 'अंजुमन राजस्थान के झीलों के शहर उदयपुर में पिछोला झील के सुरम्य मुहाने पर बसा है। महाराणा प्रताप राष्ट्रीय हवाई अड्डे (UDR) और रेलवे सर्किट स्टेशन से ४५ मिनट की विलासिता पूरित यात्रा करके यहाँ आसानी से पहुँचा जा सकता है।'}
              </p>

              {/* Coordinates List blocks */}
              <div className="space-y-4 border-t border-brand-gold/15 pt-6 text-xs sm:text-sm">
                
                {/* 1. Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-full border border-brand-gold/25 flex items-center justify-center text-brand-gold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif text-brand-gold uppercase tracking-wider text-xs font-bold">{language === 'EN' ? 'Royal Address' : 'शाही मार्ग पता'}</h4>
                    <p className="text-brand-white/95 font-medium mt-1">Pichola Lake Road, Udaipur, Rajasthan, Pin 313001, India</p>
                  </div>
                </div>

                {/* 2. Contact */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-full border border-brand-gold/25 flex items-center justify-center text-brand-gold transition-colors hover:bg-brand-gold/10">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif text-brand-gold uppercase tracking-wider text-xs font-bold">{language === 'EN' ? 'Noble Communications' : 'शाही संपर्क'}</h4>
                    <div className="text-brand-white/95 font-medium flex flex-wrap gap-x-3 gap-y-1">
                      <a href="mailto:concierge@anjuman.com" className="hover:text-brand-gold hover:underline transition-colors py-1 min-h-[44px] flex items-center">
                        concierge@anjuman.com
                      </a>
                      <span className="text-brand-white/30 self-center hidden sm:inline">|</span>
                      <a href="tel:+912942428888" className="hover:text-brand-gold hover:underline transition-colors py-1 min-h-[44px] flex items-center font-mono">
                        +91 294 242 8888
                      </a>
                      <span className="text-brand-white/30 self-center hidden sm:inline">|</span>
                      <a href="https://wa.me/912942428888" target="_blank" referrerPolicy="no-referrer" className="text-emerald-400 hover:text-emerald-300 transition-colors py-1 min-h-[44px] flex items-center gap-1">
                        <i className="fa-brands fa-whatsapp text-sm"></i>
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* 3. Timings */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-full border border-brand-gold/25 flex items-center justify-center text-brand-gold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif text-brand-gold uppercase tracking-wider text-xs font-bold">{language === 'EN' ? 'Temporal Check Rules' : 'चेक-इन और चेक-आउट समय'}</h4>
                    <p className="text-brand-white/95 mt-1">
                      {language === 'EN' 
                        ? 'Check-In: 2:00 PM IST | Check-Out: 12:00 PM IST' 
                        : 'आगमन Check-In: दोपहर २:०० बजे | प्रस्थान Check-Out: दोपहर १२:०० बजे'}
                    </p>
                  </div>
                </div>

              </div>

              {/* Direct Link */}
              <div className="pt-2">
                <a 
                  href="https://maps.google.com/?q=Lake+Pichola,+Udaipur,+Rajasthan,+India" 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-brand-black text-[11px] uppercase tracking-widest font-black rounded transition-all shadow-md active:scale-95 min-h-[44px]"
                >
                  <span>{language === 'EN' ? 'Get Directions' : 'मार्ग का नक्शा प्राप्त करें'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

            </div>

            {/* Right: Map Embed Placeholder with fine styling (7cols) */}
            <div className="lg:col-span-7 w-full h-80 sm:h-[450px] relative rounded-2xl overflow-hidden border border-brand-gold/25 shadow-2xl">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1d14515.688175402631!2d73.67389552809618!3d24.574673322434444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967e56555555555%3A0xe5a1b3beeed52b36!2sLake%20Pichola!5e0!3m2!1sen!2sin!4v1716612111111!5m2!1sen!2sin" 
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-[2000ms]"
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer"
                title="Pichola Lake Udaipur"
              />
            </div>

          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SECTION 8 - NEWSLETTER                               */}
      {/* ---------------------------------------------------- */}
      <section className="w-full py-16 sm:py-20 relative bg-brand-black" id="royal-newsletter">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="relative bg-gold-gradient rounded-3xl p-8 sm:p-12 lg:p-16 text-center text-brand-navy shadow-2xl overflow-hidden border border-brand-gold/10">
            
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none transform translate-x-10 translate-y-[-10px]"></div>
            <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-brand-navy/5 rounded-full blur-xl pointer-events-none"></div>

            <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 relative z-10">
              
              <div className="space-y-3">
                <span className="text-brand-navy/70 tracking-[0.3em] text-[11px] uppercase font-black block font-sans">
                  {language === 'EN' ? 'SOVEREIGN GAZETTES' : 'शाही समाचार संवाद प्रविष्टि'}
                </span>
                <h2 className="font-playfair text-2xl sm:text-4xl lg:text-5xl text-brand-navy font-black uppercase tracking-wide leading-none">
                  {language === 'EN' ? 'Stay Updated with Exclusive Offers' : 'शाही समाचार संवाद की सदस्यता लें'}
                </h2>
                <p className="text-brand-navy/85 font-semibold text-xs sm:text-sm font-sans max-w-lg mx-auto leading-relaxed">
                  {language === 'EN' 
                    ? 'Subscribe today to receive direct notifications of boutique palace openings, exclusive limited holiday charters, and concierge privileges.'
                    : 'निजी महल उद्घाटनों, विशेष सीमित राजकीय उत्सव पैकेजों, और मानार्थ लाभों की प्रत्यक्ष सूचना ईमेल पर पाने के लिए आज ही सदस्यता लें।'}
                </p>
              </div>

              {/* Form Input Container */}
              <AnimatePresence mode="wait">
                {!newsSuccess ? (
                  <motion.form 
                    key="form"
                    onSubmit={handleNewsletterSubmit}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2 max-w-md mx-auto"
                  >
                    <div className="w-full relative">
                      <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-brand-navy/60 w-4 h-4 pointer-events-none" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={language === 'EN' ? 'Enter private email address' : 'अपना ईमेल यहाँ दर्ज करें'}
                        className="w-full pl-10 pr-4 py-3.5 rounded bg-white/20 border border-brand-navy/25 text-brand-navy placeholder-brand-navy/50 font-sans text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-navy focus:bg-white/35 font-semibold"
                        required
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full sm:w-auto shrink-0 px-8 py-3.5 bg-brand-navy text-brand-gold text-xs sm:text-sm font-black uppercase tracking-widest rounded transition-all hover:bg-brand-black active:scale-95 shadow-xl cursor-pointer"
                    >
                      {language === 'EN' ? 'Subscribe' : 'सक्रिय करें'}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-brand-navy text-brand-gold rounded-xl max-w-md mx-auto text-center border border-brand-navy/30 shadow-xl space-y-3"
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-brand-gold/60 flex items-center justify-center mx-auto bg-brand-navy text-lg text-brand-gold">
                      <Check className="w-5 h-5 text-brand-gold" />
                    </div>
                    <h4 className="font-serif text-base sm:text-lg font-bold uppercase tracking-wider">
                      {language === 'EN' ? 'Subscription Complete' : 'सदस्यता सफलता पूर्वक पूर्ण'}
                    </h4>
                    <p className="text-xs text-brand-white/80 leading-relaxed font-sans">
                      {language === 'EN' 
                        ? 'Your credentials have been securely registered to our master directory list. A royal welcome message has been dispatched.' 
                        : 'अंजुमन की राजकीय समाचार सूची में आपका स्वागत है। आपके ईमेल पर विवरण प्रेषित कर दिया गया है।'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {newsError && (
                <p className="text-[11px] font-bold text-red-800 font-mono mt-2">{newsError}</p>
              )}

              {/* Privacy note */}
              <p className="text-[10px] text-brand-navy/60 font-semibold uppercase tracking-widest pt-2 font-mono">
                🛡️ {language === 'EN' ? 'Secure Tokenized Data Compliance. No third-party syndications.' : 'संपूर्ण डेटा सुरक्षा अनुपालन। कोई तृतीय पक्ष साझाकरण नहीं।'}
              </p>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
