import React, { useState, useEffect } from 'react';
import { Room, LanguageType } from '../types';
import { LUXURY_ROOMS } from '../data';
import { 
  SlidersHorizontal, 
  Wifi, 
  Tv, 
  Utensils, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  DollarSign, 
  Users, 
  Expand, 
  Star, 
  Check, 
  Info, 
  Sparkles, 
  X, 
  TrendingUp, 
  Compass, 
  Grid, 
  Coffee, 
  Clock,
  Briefcase,
  HelpCircle,
  Volume2,
  VolumeX,
  Plus
} from 'lucide-react';

interface RoomsSectionProps {
  language: LanguageType;
  onBookNow: (roomId: string) => void;
}

// In-Room Dining Menu Items Mock Dataset
interface RoomServiceItem {
  id: string;
  name: string;
  nameHI: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'LateNight' | 'Beverages';
  priceINR: number;
  description: string;
  descriptionHI: string;
  isVeg: boolean;
  isJain: boolean;
  image: string;
}

const ROOM_SERVICE_CATALOG: RoomServiceItem[] = [
  // Breakfast
  {
    id: 'rs-1',
    name: 'Saffron Pistachio Royal Idli',
    nameHI: 'शाही केसर पिस्ता इडली',
    category: 'Breakfast',
    priceINR: 599,
    description: 'Fluffy steamed rice cakes infused with pure saffron strands, accompanied by a rich pistachio gravy and fresh coconut chutney cooked in olive oil.',
    descriptionHI: 'केसर से सुगंधित फूली हुई इडली, पिस्ता ग्रेवी और नारियल चटनी के साथ परोसी जाती है।',
    isVeg: true,
    isJain: true,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'rs-2',
    name: 'Mewari Herbed Poha Thali',
    nameHI: 'मेवाड़ी हर्ब पोहा थाली',
    category: 'Breakfast',
    priceINR: 799,
    description: 'Flattened organic rice tempered with local mustard seeds, royal curry leaves, roasted cashews, and traditional Rajasthan heritage herbs.',
    descriptionHI: 'स्थानीय राई, कड़ी पत्ता, भुने काजू और पारंपरिक मेवाड़ी जड़ी-बूटियों के साथ तैयार किया गया पौष्टिक पोहा।',
    isVeg: true,
    isJain: false,
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'rs-3',
    name: 'Imperial British-Mewar Egg Platter',
    nameHI: 'शाही एंग्लो-मेवाड़ी अंडा थाली',
    category: 'Breakfast',
    priceINR: 1499,
    description: 'Organic free-range double-egg benedict over spiced millet toasted buns, served with hand-ground avocado, glazed cherry tomatoes, and Mathania chili hollandaise.',
    descriptionHI: 'मसालेदार बाजरा बन्स पर तैयार फ्री-रेंज अंडा बेनेडिक्ट, मथानिया मिर्च होलंडेस के साथ।',
    isVeg: false,
    isJain: false,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600'
  },
  // Lunch
  {
    id: 'rs-4',
    name: 'Kesari Paneer Shahi Thali',
    nameHI: 'केसरी पनीर शाही थाली',
    category: 'Lunch',
    priceINR: 1299,
    description: 'Bespoke organic cottage cheese simmered in rich Kashmiri gold cashew gravy, served with hot hand-stretched butter naan and saffron pulao.',
    descriptionHI: 'काजू की समृद्ध केसरी ग्रेवी में पकाया गया मखमली पनीर, मक्खन नान और केसर पुलाव के साथ।',
    isVeg: true,
    isJain: true,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'rs-5',
    name: 'Traditional Royal Laal Maas Thali',
    nameHI: 'पारंपरिक शाही लाल मासँ थाली',
    category: 'Lunch',
    priceINR: 1999,
    description: 'Legendary slow-cooked lean lamb prepared with local hot Mathania chilies, organic yogurt curd, smoked clove charcoal, and ghee rotis.',
    descriptionHI: 'प्रसिद्ध मेवाड़ी शैली में धीमी आंच पर पकाया मटन, मथानिया मिर्च और ताजी तंदूरी रोटियों के साथ।',
    isVeg: false,
    isJain: false,
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&q=80&w=600'
  },
  // Dinner
  {
    id: 'rs-6',
    name: 'Anjuman Multi-Course Thali',
    nameHI: 'अंजुमन महाराजा बहु-कोर्स थाली',
    category: 'Dinner',
    priceINR: 2499,
    description: 'The definitive royal banquet offering including Ker Sangri, Gatte ki Sabzi, Daal Baati, Churma, Saffron rice, three types of Indian breads, and home-churned butter.',
    descriptionHI: 'अल्टीमेट शाही थाली जिसमें केर सांगरी, गट्टे की सब्जी, दाल बाटी चूरमा और केसरिया चावल शामिल हैं।',
    isVeg: true,
    isJain: false,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'rs-7',
    name: 'Jain Satvik Panchratan Khichdi',
    nameHI: 'जैन सात्विक पंचरत्न खिचड़ी',
    category: 'Dinner',
    priceINR: 999,
    description: 'Lightly roasted aromatic basmati rice and five premium local lentils cooked with pure organic ghee, cumin, ginger, and served with sweet curd.',
    descriptionHI: 'बिना प्याज-लहसुन के शुद्ध घी और जीरे में तैयार हल्की पंचरत्न खिचड़ी, मीठी दही के साथ।',
    isVeg: true,
    isJain: true,
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=600'
  },
  // Late Night
  {
    id: 'rs-8',
    name: 'Midnight Masala Comfort Khichdi',
    nameHI: 'मिडनाइट मसाला कम्फर्ट खिचड़ी',
    category: 'LateNight',
    priceINR: 699,
    description: 'Steaming comforting light rice and yellow moong bowl, spiced for midnight cravings, served with papadum and pickles.',
    descriptionHI: 'देर रात की भूख के लिए विशेष रूप से तैयार की गई हल्की गरम मूंग दाल खिचड़ी, पापड़ के साथ।',
    isVeg: true,
    isJain: true,
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'rs-9',
    name: 'Butter Chicken Mini Brioche Sliders',
    nameHI: 'बटर चिकन मिनी ब्रियोश स्लाइडर्स',
    category: 'LateNight',
    priceINR: 999,
    description: 'Thrice-glazed creamy chicken chunks stuffed inside roasted butter brioche mini-buns, served with hand-fried masala potato crisps.',
    descriptionHI: 'मक्खन से भरपूर रोटियों के बीच क्रीमी बटर चिकन के बारीक कतरे हुए टुकड़े, गरम कुरकुरे चिप्स के साथ।',
    isVeg: false,
    isJain: false,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600'
  },
  // Beverages
  {
    id: 'rs-10',
    name: 'Rose Petal Mewari Lassi Sherbet',
    nameHI: 'गुलाब की पंखुड़ी वाली मेवाड़ी लस्सी',
    category: 'Beverages',
    priceINR: 399,
    description: 'Chilled rich yogurt cream blended with hand-pressed wild organic rose syrup, topped with dry cardamom crumbs and silver foil.',
    descriptionHI: 'ताजा मथी मलाईदार लस्सी, गुलाब अर्क, इलायची और असली सोने-चांदी के वर्क से सुसज्जित।',
    isVeg: true,
    isJain: true,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'rs-11',
    name: 'Vedic Saffron Almond Immuno-Milk',
    nameHI: 'वैदिक केसर बादाम रोग-प्रतिरोधक दूध',
    category: 'Beverages',
    priceINR: 599,
    description: 'Warm organic cow milk slow-cooked with fresh saffron strands, crushed almonds, green cardamom, long pepper, and wild honey.',
    descriptionHI: 'ताजा गर्म दूध, बादाम कतरन, केसर के रेशे, इलायची और पहाड़ी शहद का उत्तम मेल।',
    isVeg: true,
    isJain: true,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&q=80&w=600'
  }
];

export default function RoomsSection({ language, onBookNow }: RoomsSectionProps) {
  // Catalog View and Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [selectedCapacity, setSelectedCapacity] = useState<string>('All');
  const [selectedFloor, setSelectedFloor] = useState<string>('All');
  const [selectedView, setSelectedView] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('popular');

  // Carousel Image Index tracking per room
  const [activeImageIndex, setActiveImageIndex] = useState<{ [roomId: string]: number }>({});

  // Expand / collapse section state per room
  const [expandedAmenities, setExpandedAmenities] = useState<{ [roomId: string]: boolean }>({});

  // Room Detailed Modal Status
  const [selectedDetailRoom, setSelectedDetailRoom] = useState<Room | null>(null);

  // Comparison Tray State
  const [comparedRoomIds, setComparedRoomIds] = useState<string[]>([]);
  const [isCompareTrayOpen, setIsCompareTrayOpen] = useState<boolean>(false);

  // 360 virtual tour state
  const [virtualTourRoom, setVirtualTourRoom] = useState<Room | null>(null);
  const [virtualTourAngle, setVirtualTourAngle] = useState<number>(0);
  const [isVirtualTourMusic, setIsVirtualTourMusic] = useState<boolean>(true);

  // In-Room Dining State
  const [diningCategory, setDiningCategory] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'LateNight' | 'Beverages'>('Breakfast');
  const [diningSearch, setDiningSearch] = useState<string>('');
  const [diningPrefs, setDiningPrefs] = useState<{ vegOnly: boolean; jainOnly: boolean }>({ vegOnly: false, jainOnly: false });
  const [placedOrders, setPlacedOrders] = useState<{ id: string; itemName: string; status: string; timer: number }[]>([]);

  // Generated results list
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(LUXURY_ROOMS);

  // Apply filters function
  const handleApplyFilters = () => {
    let result = [...LUXURY_ROOMS];

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(r => r.category === selectedCategory);
    }

    // Filter by Price Limit
    result = result.filter(r => r.priceINR <= maxPrice);

    // Filter by Capacity
    if (selectedCapacity !== 'All') {
      if (selectedCapacity === '1-2') {
        result = result.filter(r => r.capacityMax <= 3);
      } else if (selectedCapacity === '3-4') {
        result = result.filter(r => r.capacityMax >= 3 && r.capacityMax <= 5);
      } else if (selectedCapacity === '5+') {
        result = result.filter(r => r.capacityMax >= 5);
      }
    }

    // Filter by Floor limits
    if (selectedFloor !== 'All') {
      if (selectedFloor === 'low') {
        result = result.filter(r => r.sizeSqFt < 600 || r.id.includes('standard') || r.id.includes('premium'));
      } else if (selectedFloor === 'mid') {
        result = result.filter(r => r.id.includes('junior') || r.id.includes('deluxe-suite'));
      } else if (selectedFloor === 'high') {
        result = result.filter(r => r.id.includes('royal-suite') || r.id.includes('presidential'));
      }
    }

    // Filter by View
    if (selectedView !== 'All') {
      if (selectedView === 'lake') {
        result = result.filter(r => r.viewType.toLowerCase().includes('lake') || r.viewType.toLowerCase().includes('sunset'));
      } else if (selectedView === 'courtyard') {
        result = result.filter(r => r.viewType.toLowerCase().includes('courtyard'));
      } else if (selectedView === 'city') {
        result = result.filter(r => r.viewType.toLowerCase().includes('city'));
      }
    }

    // Sorting implementation
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.priceINR - b.priceINR);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.priceINR - a.priceINR);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else if (sortBy === 'size') {
      result.sort((a, b) => b.sizeSqFt - a.sizeSqFt);
    }

    setFilteredRooms(result);
  };

  // Run on change of filter states automatically to count search results live
  useEffect(() => {
    handleApplyFilters();
  }, [selectedCategory, maxPrice, selectedCapacity, selectedFloor, selectedView, sortBy]);

  // Image rotation controller
  const handleNextImage = (roomId: string, images: string[], e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIndex(prev => {
      const idx = prev[roomId] || 0;
      return { ...prev, [roomId]: (idx + 1) % images.length };
    });
  };

  const handlePrevImage = (roomId: string, images: string[], e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIndex(prev => {
      const idx = prev[roomId] || 0;
      return { ...prev, [roomId]: (idx - 1 + images.length) % images.length };
    });
  };

  // Toggle comparison state room
  const toggleComparison = (roomId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setComparedRoomIds(prev => {
      if (prev.includes(roomId)) {
        const next = prev.filter(id => id !== roomId);
        if (next.length === 0) setIsCompareTrayOpen(false);
        return next;
      } else {
        if (prev.length >= 3) {
          alert(language === 'EN' ? 'You can compare up to 3 sovereign rooms at once!' : 'आप एक बार में अधिकतम 3 भव्य कमरों की तुलना कर सकते हैं!');
          return prev;
        }
        setIsCompareTrayOpen(true);
        return [...prev, roomId];
      }
    });
  };

  // Visual availability simulation for next 7 days
  const getAvailabilityCalendar = (roomId: string) => {
    // Generate dates starting today
    const dates = [];
    const baseDate = new Date();
    // Use some deterministic statuses based on room id
    const hash = roomId.length;
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(baseDate.getDate() + i);
      const isAvailable = (hash + i) % 3 !== 0; // Simulated available
      dates.push({
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        available: isAvailable
      });
    }
    return dates;
  };

  // Gyro simulation loop
  useEffect(() => {
    let interval: any;
    if (virtualTourRoom) {
      interval = setInterval(() => {
        setVirtualTourAngle(prev => (prev + 0.35) % 360);
      }, 30);
    }
    return () => clearInterval(interval);
  }, [virtualTourRoom]);

  // Ordering food process simulator
  const handleOrderDiningItem = (item: RoomServiceItem) => {
    const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: orderId,
      itemName: language === 'EN' ? item.name : item.nameHI,
      status: 'In Imperial Kitchen',
      timer: 35 // Minutes count down
    };
    setPlacedOrders(prev => [newOrder, ...prev]);

    // Fast-foward countdown simulator
    const alertMsg = language === 'EN' 
      ? `👑 Your royal order for ${item.name} of ₹${(item.priceINR * 1.18).toFixed(0)} (incl. 18% GST) has been successfully placed! Preparation time: 30-45 minutes notice. Watch live dispatch tracking below.` 
      : `👑 ${item.nameHI} का आपका शाही ऑर्डर ₹${(item.priceINR * 1.18).toFixed(0)} (18% जीएसटी सहित) सफलतापूर्वक स्वीकार कर लिया गया है! इसे 30-45 मिनट में आपके सुइट में परोसा जाएगा।`;
    
    alert(alertMsg);
  };

  // Live timer tick for food orders
  useEffect(() => {
    const timerId = setInterval(() => {
      setPlacedOrders(prev => {
        return prev.map(o => {
          if (o.timer > 1) {
            let nextStatus = o.status;
            if (o.timer === 25) nextStatus = 'Plated in Silverware Tray';
            if (o.timer === 10) nextStatus = 'Dispatched with Butler';
            if (o.timer === 3) nextStatus = 'Approaching Your Suite Door';
            return { ...o, timer: o.timer - 1, status: nextStatus };
          } else if (o.timer === 1) {
            return { ...o, timer: 0, status: 'Served & Placed on Table Enjoy!' };
          }
          return o;
        });
      });
    }, 4500); // Fast simulation
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="w-full bg-brand-black text-brand-white min-h-screen relative" id="rooms-catalog-page">
      
      {/* 1. PALACE ROOM BANNER & HEADER */}
      <div 
        className="w-full h-[32rem] md:h-[38rem] relative flex items-center justify-center overflow-hidden bg-cover bg-center select-none"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1600")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/95 via-brand-black/45 to-brand-black" />
        
        {/* Intricately carved arch overlay */}
        <div className="absolute inset-x-8 top-12 bottom-12 border border-brand-gold/15 flex flex-col items-center justify-center p-6 text-center rounded-2xl">
          <div className="max-w-3xl space-y-4">
            <span className="text-brand-gold font-accent tracking-[0.3em] text-xs uppercase font-extrabold block">
              {language === 'EN' ? 'THE PINNACLE OF MEWAR HOSPITALITY' : 'मेवाड़ की सर्वोत्कृष्ट आतिथ्य सत्कार परंपरा'}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-brand-cream tracking-wide uppercase font-light">
              {language === 'EN' ? 'Our Rooms & Suites' : 'शाही शयनकक्ष और सुइट्स'}
            </h1>
            <div className="w-24 h-[1.5px] bg-brand-gold/40 mx-auto"></div>
            <p className="font-sans text-xs md:text-base text-brand-cream/80 italic max-w-2xl leading-relaxed">
              {language === 'EN' 
                ? 'Step into a world crafted for Kings. Each chamber honors Rajasthani heritage through exquisite carving, golden domes, and bespoke 24/7 dedicated butler service.'
                : 'राजाओं के अनुकूल तैयार की गई भव्य दुनिया में कदम रखें। प्रत्येक कक्ष उत्तम नक्काशी, स्वर्ण-गुंबद और चौबीसों घंटे चलने वाली बटलर सेवा के माध्यम से राजस्थानी विरासत को गौरवान्वित करता है।'}
            </p>

            {/* Breadcrumb Navigation Trail */}
            <div className="flex items-center justify-center gap-2 mt-6 text-[11px] font-mono tracking-widest uppercase text-brand-gold/60">
              <span className="hover:text-brand-gold cursor-pointer transition-colors" onClick={() => window.location.reload()}>HOME</span>
              <span>/</span>
              <span className="text-brand-white font-bold">ROOMS CATALOG</span>
            </div>
          </div>
        </div>

        {/* Checkout time physical reminder ribbon */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md bg-brand-navy/90 border border-brand-gold/30 rounded-full px-6 py-2 flex items-center justify-between text-[11px] tracking-wider text-brand-cream/90 backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-brand-gold shrink-0 animate-pulse" />
            <span>{language === 'EN' ? 'Checkout Time Policy Reminder:' : 'चेकआउट समय नीति स्मरण:'}</span>
          </div>
          <span className="font-bold text-brand-gold text-right shrink-0">12:00 PM IST (Strict)</span>
        </div>
      </div>

      {/* 2. DYNAMIC WORKSPACE: MULTI-LEVEL FILTER BAR & RESULTS COUNT */}
      <div className="w-full max-w-7xl mx-auto px-4 py-8 relative z-10 -mt-10">
        <div className="bg-[#111122]/90 border border-brand-gold/20 rounded-2xl shadow-3xl p-6 md:p-8 backdrop-blur-xl">
          <div className="flex flex-col gap-6">
            
            <div className="flex items-center justify-between border-b border-brand-gold/10 pb-4">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="h-5 w-5 text-brand-gold" />
                <h3 className="font-serif text-lg tracking-widest uppercase text-brand-cream">
                  {language === 'EN' ? 'Sovereign Selection Filters' : 'शाही चयन फ़िल्टर'}
                </h3>
              </div>
              <div className="bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20 text-xs font-mono text-brand-gold">
                {language === 'EN' ? `${filteredRooms.length} Chambers Available` : `${filteredRooms.length} उपलब्ध शाही विकल्प`}
              </div>
            </div>

            {/* Filter Sliders & Dropdowns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
              
              {/* Category selector */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                  {language === 'EN' ? 'Room Type' : 'कमरे का प्रकार'}
                </label>
                <select 
                  className="w-full bg-brand-navy border border-brand-gold/20 rounded px-3 py-2 text-brand-cream focus:border-brand-gold focus:outline-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">{language === 'EN' ? 'All Room Categories' : 'सभी श्रेणियाँ'}</option>
                  <option value="Deluxe">{language === 'EN' ? 'Deluxe Rooms' : 'डीलक्स कमरे'}</option>
                  <option value="Suite">{language === 'EN' ? 'Suites & Penthouses' : 'शाही सुइट्स'}</option>
                  <option value="Presidential">{language === 'EN' ? 'Presidential Retreat' : 'राष्ट्रपति निवास'}</option>
                </select>
              </div>

              {/* Price range selector slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-brand-cream">
                  <span>{language === 'EN' ? 'Price Limit' : 'मूल्य सीमा'}</span>
                  <span className="text-brand-gold font-mono font-bold">₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
                <input 
                  type="range" 
                  min="5000" 
                  max="100000" 
                  step="5000"
                  className="w-full accent-brand-gold bg-brand-navy border-none h-1.5 rounded-lg cursor-pointer"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
                <div className="flex justify-between text-[8px] font-mono text-brand-cream/60">
                  <span>₹5,000</span>
                  <span>₹1,00,000</span>
                </div>
              </div>

              {/* Capacity Selector */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                  {language === 'EN' ? 'Capacity' : 'अतिथि क्षमता'}
                </label>
                <select 
                  className="w-full bg-brand-navy border border-brand-gold/20 rounded px-3 py-2 text-brand-cream focus:border-brand-gold focus:outline-none"
                  value={selectedCapacity}
                  onChange={(e) => setSelectedCapacity(e.target.value)}
                >
                  <option value="All">{language === 'EN' ? 'Any Guests' : 'कितने भी अतिथि'}</option>
                  <option value="1-2">{language === 'EN' ? '1 to 2 Adults (+Child)' : '1 से 2 वयस्क'}</option>
                  <option value="3-4">{language === 'EN' ? '3 to 4 Dignitaries' : '3 से 4 विशिष्ट जन'}</option>
                  <option value="5+">{language === 'EN' ? '5+ Extended Royalty' : '5 से अधिक लोग'}</option>
                </select>
              </div>

              {/* Floor Level Selector */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                  {language === 'EN' ? 'Floor Elevation' : 'मंजिल ऊंचाई'}
                </label>
                <select 
                  className="w-full bg-brand-navy border border-brand-gold/20 rounded px-3 py-2 text-brand-cream focus:border-brand-gold focus:outline-none"
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(e.target.value)}
                >
                  <option value="All">{language === 'EN' ? 'Any Floor Height' : 'कोई भी मंजिल'}</option>
                  <option value="low">{language === 'EN' ? '2nd to 5th Floors' : 'दूसरी से पांचवीं'}</option>
                  <option value="mid">{language === 'EN' ? '6th to 10th Floors' : 'छठी से दसवीं'}</option>
                  <option value="high">{language === 'EN' ? 'Absolute Crown Penthouse' : 'महल का शिखर'}</option>
                </select>
              </div>

              {/* View Type selection */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                  {language === 'EN' ? 'Sought View' : 'प्रकृति दृश्य'}
                </label>
                <select 
                  className="w-full bg-brand-navy border border-brand-gold/20 rounded px-3 py-2 text-brand-cream focus:border-brand-gold focus:outline-none"
                  value={selectedView}
                  onChange={(e) => setSelectedView(e.target.value)}
                >
                  <option value="All">{language === 'EN' ? 'Any Imperial Vistas' : 'कोई भी प्राकृतिक दृश्य'}</option>
                  <option value="lake">{language === 'EN' ? 'Lake Pichola & Sunset' : 'पिछोला झील / सूर्यास्त'}</option>
                  <option value="courtyard">{language === 'EN' ? 'Inner Palatial Gardens' : 'आंतरिक शाही बाग'}</option>
                  <option value="city">{language === 'EN' ? 'Historical City Arches' : 'ऐतिहासिक उदयपुर शहर'}</option>
                </select>
              </div>

            </div>

            {/* Sorter and Action reset container */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-brand-gold/10 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-brand-cream/70 shrink-0">{language === 'EN' ? 'Sort By:' : 'क्रमबद्ध करें:'}</span>
                <div className="inline-flex rounded-lg overflow-hidden border border-brand-gold/25 p-0.5 bg-brand-navy/60">
                  <button 
                    onClick={() => setSortBy('popular')}
                    className={`px-3 py-1.5 rounded-md transition-all uppercase tracking-wider text-[10px] font-bold ${sortBy === 'popular' ? 'bg-gold-gradient text-brand-black' : 'text-brand-cream/80 hover:text-brand-gold'}`}
                  >
                    {language === 'EN' ? 'Featured First' : 'लोकप्रियता'}
                  </button>
                  <button 
                    onClick={() => setSortBy('price-low')}
                    className={`px-3 py-1.5 rounded-md transition-all uppercase tracking-wider text-[10px] font-bold ${sortBy === 'price-low' ? 'bg-gold-gradient text-brand-black' : 'text-brand-cream/80 hover:text-brand-gold'}`}
                  >
                    {language === 'EN' ? 'Price: Low to High' : 'मूल्य: कम से ज्यादा'}
                  </button>
                  <button 
                    onClick={() => setSortBy('price-high')}
                    className={`px-3 py-1.5 rounded-md transition-all uppercase tracking-wider text-[10px] font-bold ${sortBy === 'price-high' ? 'bg-gold-gradient text-brand-black' : 'text-brand-cream/80 hover:text-brand-gold'}`}
                  >
                    {language === 'EN' ? 'Price: High to Low' : 'मूल्य: ज्यादा से कम'}
                  </button>
                </div>
              </div>

              {/* Filter Apply & Reset buttons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setSelectedCategory('All');
                    setMaxPrice(100000);
                    setSelectedCapacity('All');
                    setSelectedFloor('All');
                    setSelectedView('All');
                    setSortBy('popular');
                  }}
                  className="px-4 py-2 border border-brand-gold/25 rounded text-brand-cream hover:bg-brand-gold hover:text-brand-black font-semibold uppercase tracking-wider text-[10px] cursor-pointer transition-all"
                >
                  {language === 'EN' ? 'Clear All Filters' : 'फ़िल्टर हटाएं'}
                </button>
                <button 
                  onClick={handleApplyFilters}
                  className="px-6 py-2 bg-gold-gradient text-brand-black font-extrabold uppercase tracking-widest text-[10px] rounded hover:shadow-gold transition-all cursor-pointer shadow-lg active:scale-95"
                >
                  {language === 'EN' ? 'Apply Advanced Filters' : 'फ़िल्टर लागू करें'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. DYNAMIC ROOMS CATALOG SECTION HANDLER */}
      <div className="w-full max-w-7xl mx-auto px-4 py-12 md:py-16">
        
        {filteredRooms.length === 0 ? (
          /* Empty Search results placeholder */
          <div className="text-center py-20 border border-brand-gold/15 rounded-2xl bg-[#111122]/60 max-w-lg mx-auto p-8 space-y-4">
            <Info className="h-12 w-12 text-brand-gold/60 mx-auto animate-bounce" />
            <h4 className="font-serif text-xl text-brand-gold">
              {language === 'EN' ? 'No Accommodations Match Your Search' : 'खोज के अनुसार कोई कमरा नहीं मिला'}
            </h4>
            <p className="text-xs text-brand-cream/70">
              {language === 'EN' 
                ? 'Adjust your pricing slider, guests criteria, or sought views to reveal our palace suites.' 
                : 'कृपया अपनी मूल्य सीमा बढ़ाएं या श्रेणियां बदलकर पुनः प्रयास करें।'}
            </p>
            <button 
              onClick={() => {
                setSelectedCategory('All');
                setMaxPrice(100000);
                setSelectedCapacity('All');
                setSelectedFloor('All');
                setSelectedView('All');
              }}
              className="px-6 py-2 bg-gold-gradient text-brand-black text-xs font-bold uppercase tracking-widest rounded shadow-xl"
            >
              {language === 'EN' ? 'Show All Palace Suites' : 'सभी महल सूट्स दिखाएं'}
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Rooms Cards Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {filteredRooms.map((room) => {
                const imgIdx = activeImageIndex[room.id] || 0;
                const currentImg = room.images[imgIdx];
                const isExpanded = expandedAmenities[room.id] || false;
                const datesAvailability = getAvailabilityCalendar(room.id);
                const isCompared = comparedRoomIds.includes(room.id);

                // Assign decorative mock tags based on ID features
                let tagLabel = 'EXCLUSIVE';
                if (room.id === 'anj-standard-deluxe') tagLabel = 'BEST SELLER';
                if (room.id === 'anj-premium-room') tagLabel = 'NEW';
                if (room.id === 'anj-royal-presidential') tagLabel = 'MAJESTIC LEADER';

                // Display calculations for absolute clarity
                const baseCharge = room.priceINR;
                // Double check tax details from user: GST 18% included in final amount
                const taxAmount = Math.round(baseCharge * 0.18);
                const finalAmount = baseCharge + taxAmount;

                return (
                  <div 
                    key={room.id}
                    className="bg-[#111122]/50 border border-brand-gold/15 hover:border-brand-gold/50 rounded-2xl overflow-hidden shadow-3xl flex flex-col group transition-all duration-500 hover:-translate-y-1 scroll-m-24 relative"
                    id={`room-card-${room.id}`}
                  >
                    
                    {/* Carousel slides on top */}
                    <div className="relative h-72 md:h-84 overflow-hidden select-none">
                      <img 
                        src={currentImg} 
                        alt={room.name} 
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[6000ms]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-black/30" />
                      
                      {/* Left Badge pill */}
                      <span className="absolute top-4 left-4 bg-brand-gold text-brand-black font-extrabold text-[9px] tracking-[0.2em] uppercase px-3 py-1 rounded shadow-lg">
                        {tagLabel}
                      </span>

                      {/* Right Specs pill */}
                      <span className="absolute top-4 right-4 bg-brand-black/80 text-brand-gold border border-brand-gold/30 font-mono text-[9px] px-2.5 py-1 rounded">
                        {room.sizeSqFt} SQ FT
                      </span>

                      {/* Slideshow controls */}
                      {room.images.length > 1 && (
                        <>
                          <button 
                            onClick={(e) => handlePrevImage(room.id, room.images, e)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-brand-black/75 hover:bg-brand-gold hover:text-brand-black text-brand-cream flex items-center justify-center transition-all cursor-pointer border border-brand-gold/10"
                            title="Previous Image"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => handleNextImage(room.id, room.images, e)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-brand-black/75 hover:bg-brand-gold hover:text-brand-black text-brand-cream flex items-center justify-center transition-all cursor-pointer border border-brand-gold/10"
                            title="Next Image"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          {/* Dots list indicator */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-brand-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                            {room.images.map((_, i) => (
                              <span 
                                key={i} 
                                className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-brand-gold w-3' : 'bg-brand-white/40'}`} 
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Room details area */}
                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6 bg-brand-navy/15">
                      
                      {/* Name, price in INR, GST breakdown label */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <h2 className="font-serif text-xl md:text-2xl text-brand-gold uppercase tracking-wider font-semibold">
                              {language === 'EN' ? room.name : room.nameHI}
                            </h2>
                            <span className="text-[10px] uppercase font-mono tracking-widest text-[#B39359] block mt-0.5">
                              {language === 'EN' ? `${room.category} Class` : `${room.category} शेड्युल`}
                            </span>
                          </div>
                          
                          {/* Rich Price representation with included taxes */}
                          <div className="text-right shrink-0">
                            <span className="text-[10px] text-brand-cream/60 uppercase block">{language === 'EN' ? 'Rate / Night' : 'प्रति रात्रि शुल्क'}</span>
                            <span className="font-serif text-xl md:text-2xl text-brand-white font-black block">₹{room.priceINR.toLocaleString('en-IN')}</span>
                            <span className="text-[9px] text-[#A1D1A1] tracking-wide block font-semibold">
                              {language === 'EN' ? `₹${finalAmount.toLocaleString('en-IN')} incl. 18% GST` : `₹${finalAmount.toLocaleString('en-IN')} (18% जीएसटी सहित)`}
                            </span>
                          </div>
                        </div>

                        {/* High density specs preview badge row */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 pt-2 text-[10px] text-brand-cream/95 font-medium border-t border-brand-gold/10">
                          <div className="flex items-center gap-1.5 py-1">
                            <Compass className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                            <span className="truncate">{language === 'EN' ? room.viewType : room.viewTypeHI}</span>
                          </div>
                          <div className="flex items-center gap-1.5 py-1">
                            <Users className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                            <span>{language === 'EN' ? `Up to ${room.capacityMax} Guests` : `अधिकतम ${room.capacityMax} मेहमान`}</span>
                          </div>
                          <div className="flex items-center gap-1.5 py-1">
                            <Wifi className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                            <span>{language === 'EN' ? 'Elite WiFi (100 Mbps)' : 'फ्री वाईफाई १०० Mbps'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 py-1">
                            <Sparkles className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                            <span>{language === 'EN' ? 'VIP Butler Service' : 'शाही बटलर सेवा'}</span>
                          </div>
                        </div>

                        <p className="text-xs text-brand-cream/80 leading-relaxed font-sans pt-1">
                          {language === 'EN' ? room.description : room.descriptionHI}
                        </p>
                      </div>

                      {/* Expand list of features */}
                      <div className="border-t border-brand-gold/5 pt-3">
                        <button 
                          onClick={() => setExpandedAmenities(prev => ({ ...prev, [room.id]: !prev[room.id] }))}
                          className="text-[10px] uppercase tracking-widest text-[#B39359] hover:text-brand-gold font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isExpanded ? (language === 'EN' ? 'Collapse Amenities' : 'कम सुविधाएं देखें') : (language === 'EN' ? '✓ View All 8 Sovereign Amenities' : '✓ सभी ८ सुख-सुविधाएं देखें')}</span>
                          <span className="font-mono text-[9px]">{isExpanded ? '▲' : '▼'}</span>
                        </button>

                        {isExpanded && (
                          <div className="grid grid-cols-2 gap-2 mt-3 p-3 bg-brand-navy/35 rounded-lg border border-brand-gold/10 text-[10px] text-brand-cream animate-fade-in font-sans">
                            {(language === 'EN' ? room.amenities : room.amenitiesHI).map((p, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 py-0.5">
                                <Check className="w-3 h-3 text-brand-gold shrink-0" />
                                <span>{p}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 7-DAY DATES AVAILABILITY PREVIEW PANEL */}
                      <div className="bg-[#15152a]/60 border border-brand-gold/5 rounded-xl p-3.5">
                        <div className="flex items-center justify-between text-[10px] text-brand-cream/75 uppercase tracking-widest font-mono font-semibold mb-2.5">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                            {language === 'EN' ? 'Availability Calendar Guide' : 'उपलब्धता कैलेंडर संकेतक'}
                          </span>
                          <span className="text-[8px] opacity-80">{language === 'EN' ? '(May/June 2026 Live Status)' : '(मई/जून २०२६ की लाइव स्थिति)'}</span>
                        </div>
                        
                        {/* 7 date block circles with colors */}
                        <div className="grid grid-cols-7 gap-1.5 text-center">
                          {datesAvailability.map((day, dIdx) => (
                            <div 
                              key={dIdx} 
                              className={`p-1.5 rounded-lg flex flex-col items-center justify-center border text-[9px] ${
                                day.available 
                                  ? 'bg-[#1a3a1a]/40 border-emerald-500/20 text-emerald-300' 
                                  : 'bg-[#3a1a1a]/40 border-red-500/20 text-red-300 opacity-60'
                              }`}
                              title={day.available ? 'Chamber Available' : 'Chamber Reserved'}
                            >
                              <span className="text-[8px] uppercase tracking-tight opacity-75">{day.dayName}</span>
                              <span className="font-serif font-black text-xs my-0.5">{day.dayNum}</span>
                              <span className="text-[8px] uppercase scale-90 opacity-75">{day.month}</span>
                              
                              <span className={`w-1 h-1 rounded-full mt-1 ${day.available ? 'bg-emerald-400' : 'bg-red-400'}`} />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* FOUR CTA INTERCONNECTING BUTTON ACTIONS */}
                      <div className="pt-4 border-t border-brand-gold/10 flex flex-wrap items-center justify-between gap-3 ready-actions">
                        
                        <div className="flex gap-2.5">
                          {/* Compare Button */}
                          <button 
                            onClick={(e) => toggleComparison(room.id, e)}
                            className={`px-3 py-2 rounded text-[10px] font-bold uppercase tracking-wider transition-all border flex items-center gap-1 cursor-pointer ${
                              isCompared 
                                ? 'bg-indigo-900/60 border-indigo-400 text-indigo-200' 
                                : 'border-brand-gold/25 text-brand-cream hover:border-brand-gold/80'
                            }`}
                          >
                            <span>{isCompared ? 'Compared' : 'Compare'}</span>
                            <span className="opacity-60">{isCompared ? '✓' : '+'}</span>
                          </button>

                          {/* 360 virtual tour shortcut */}
                          <button 
                            onClick={() => {
                              setVirtualTourRoom(room);
                              setVirtualTourAngle(0);
                            }}
                            className="px-3 py-2 rounded border border-[#B39359]/30 text-brand-gold hover:bg-brand-gold/10 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                          >
                            🎥 360° Tour
                          </button>
                        </div>

                        <div className="flex gap-2 items-center">
                          {/* Room Details pop Trigger */}
                          <button 
                            onClick={() => setSelectedDetailRoom(room)}
                            className="px-4 py-2.5 bg-brand-navy border border-brand-gold/20 text-brand-cream rounded hover:border-brand-gold text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all active:scale-95"
                          >
                            {language === 'EN' ? 'Room Info' : 'कमरे की जानकारी'}
                          </button>

                          {/* Book Now trigger */}
                          <button 
                            onClick={() => onBookNow(room.id)}
                            className="px-6 py-2.5 bg-gold-gradient text-brand-black text-[10px] font-black uppercase tracking-widest rounded hover:shadow-gold transition-all cursor-pointer hover:scale-[1.03] shadow-lg active:scale-95 text-right shrink-0"
                          >
                            {language === 'EN' ? 'Book Now' : 'आरक्षित करें'}
                          </button>
                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>

      {/* 4. IMMERSIVE VIRTUAL 360° TOUR DIALOG OVERLAY */}
      {virtualTourRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-black/95 backdrop-blur-xl animate-fade-in select-none">
          <div className="relative w-full max-w-4xl bg-[#111126] border border-brand-gold/30 rounded-2xl overflow-hidden shadow-3xl text-center">
            
            <div className="p-4 bg-brand-navy flex items-center justify-between border-b border-brand-gold/10">
              <div className="flex items-center gap-2">
                <span className="animate-pulse w-2 h-2 rounded-full bg-emerald-400" />
                <h4 className="font-serif text-sm md:text-md text-brand-gold uppercase tracking-wider font-bold">
                  {language === 'EN' ? `Sovereign 360° VR View: ${virtualTourRoom.name}` : `360° वर्चुअल टूर: ${virtualTourRoom.nameHI}`}
                </h4>
              </div>
              <div className="flex items-center gap-4">
                {/* Audio simulation toggle */}
                <button 
                  onClick={() => setIsVirtualTourMusic(!isVirtualTourMusic)}
                  className="text-brand-cream hover:text-brand-gold text-xs flex items-center gap-1.5 focus:outline-none cursor-pointer"
                  title="Toggle Ambience Sitar Music"
                >
                  {isVirtualTourMusic ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-brand-cream/50" />}
                  <span className="text-[9px] uppercase font-mono tracking-widest hidden sm:inline">{isVirtualTourMusic ? 'Sitar ON' : 'Sitar Muted'}</span>
                </button>
                <button 
                  onClick={() => setVirtualTourRoom(null)}
                  className="text-brand-cream/75 hover:text-brand-gold p-1 focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Immersive Panoramic Iframe simulation container */}
            <div className="relative h-[22rem] md:h-[28rem] bg-black overflow-hidden flex items-center justify-center">
              
              {/* Spinning panorama room canvas preview */}
              <div 
                className="absolute inset-0 w-[400%] h-full opacity-70 transition-transform duration-75 select-none pointer-events-none"
                style={{
                  backgroundImage: `url("${virtualTourRoom.images[0]}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: `translateX(-${(virtualTourAngle / 360) * 100}%)`
                }}
              />
              
              {/* Golden Ambient Vignette mapping real glass */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-black/40 via-transparent to-brand-black/40" />
              <div className="absolute inset-0 border-[10px] border-brand-navy/60 pointer-events-none" />

              {/* Floating hotspot tag visual on screen */}
              <div className="absolute z-10 bottom-20 left-1/2 -translate-x-1/2 bg-brand-black/85 border border-brand-gold/40 rounded-xl p-3 px-5 text-center text-xs space-y-1 backdrop-blur max-w-xs shadow-2xl animate-bounce">
                <StarsRow text="CROWN VERDICT" />
                <h5 className="font-serif text-brand-gold uppercase tracking-wider text-[11px] font-bold">
                  {language === 'EN' ? 'Bespoke Handcarved Bed Dome' : 'हाथ से नक्काशीदार बेड गुंबद'}
                </h5>
                <p className="text-[9px] text-brand-cream/80 font-sans">
                  {language === 'EN' ? 'Finished in 24K real gold foil with heritage fabrics.' : '२४कैरेट असली सोने के वर्क से सुसज्जित।'}
                </p>
              </div>

              {/* VR Interface Compass HUD Overlay */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center justify-center text-brand-gold/80 bg-brand-black/50 p-3 rounded-full border border-brand-gold/10 backdrop-blur-md">
                <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '40s' }} />
                <span className="text-[8px] font-mono tracking-widest font-black uppercase mt-1">ANGLE: {virtualTourAngle.toFixed(0)}° N</span>
              </div>

              {/* Simulated Left and Right Rotation buttons */}
              <button 
                onMouseDown={() => {}}
                onClick={() => setVirtualTourAngle(p => (p - 15 + 360) % 360)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-brand-navy/80 hover:bg-brand-gold text-brand-white hover:text-brand-black border border-brand-gold/30 flex items-center justify-center text-lg shadow-xl cursor-pointer"
                title="Pan Left"
              >
                ◀
              </button>
              <button 
                onClick={() => setVirtualTourAngle(p => (p + 15) % 360)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-brand-navy/80 hover:bg-brand-gold text-brand-white hover:text-brand-black border border-brand-gold/30 flex items-center justify-center text-lg shadow-xl cursor-pointer"
                title="Pan Right"
              >
                ▶
              </button>

              {/* Music playing indicator bar viz */}
              {isVirtualTourMusic && (
                <div className="absolute z-10 bottom-6 right-6 flex items-end gap-0.5 bg-brand-black/60 px-3 py-1.5 rounded-lg text-xs text-brand-gold/90 font-mono">
                  <span className="text-[9px] uppercase tracking-wider mr-2">Royal Sitar Loop:</span>
                  <span className="w-1 h-3 bg-brand-gold animate-pulse rounded-full" />
                  <span className="w-1 h-5 bg-brand-gold animate-pulse rounded-full" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1 h-2 bg-brand-gold animate-pulse rounded-full" style={{ animationDelay: '0.4s' }} />
                  <span className="w-1 h-4 bg-brand-gold animate-pulse rounded-full" style={{ animationDelay: '0.6s' }} />
                </div>
              )}
            </div>

            {/* Instruction Footer */}
            <div className="bg-brand-navy p-4 px-6 text-xs text-brand-cream/80 font-sans text-center space-y-1">
              <p>
                {language === 'EN' 
                  ? '💡 Interaction Hint: Use the left / right arrows or click to manually navigate around the high-definition palace dome scenery.' 
                  : '💡 नेविगेशन हिंट: हाई-डेफिनिशन शाही सुइट दृश्य को चारों ओर से देखने के लिए बाएँ / दाएँ तीरों पर क्लिक करें।'}
              </p>
              <p className="text-[10px] text-brand-gold font-mono uppercase tracking-widest font-bold">
                {language === 'EN' ? 'Anjuman Royal Secretariat Virtual Concierge' : 'अंजुमन रॉयल सचिवालय वर्चुअल कंसियर सेवा'}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* 5. INDIVIDUAL ROOM DETAIL MODAL PANEL */}
      {selectedDetailRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 overflow-y-auto bg-brand-black/95 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-brand-black border border-brand-gold/30 rounded-2xl overflow-hidden shadow-3xl text-left my-8">
            
            {/* Modal sticky header */}
            <div className="p-5 bg-[#111124] flex items-center justify-between border-b border-brand-gold/15 sticky top-0 z-10">
              <div>
                <span className="text-[10px] text-brand-gold tracking-widest uppercase font-mono">{language === 'EN' ? 'CHAMBER INFORMATION SPECIFICATION' : 'शयनकक्ष विवरण निर्देशिका'}</span>
                <h3 className="font-serif text-xl md:text-2xl text-brand-cream uppercase font-bold">
                  {language === 'EN' ? selectedDetailRoom.name : selectedDetailRoom.nameHI}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedDetailRoom(null)}
                className="text-brand-cream/70 hover:text-brand-gold p-2 border border-brand-gold/10 hover:border-brand-gold rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inner scrollable area */}
            <div className="p-6 md:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
              
              {/* Detailed Image Gallery Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-64 sm:h-76 md:h-84 overflow-hidden rounded-xl border border-brand-gold/10 relative">
                  <img 
                    src={selectedDetailRoom.images[0]} 
                    alt="Main Bed style" 
                    loading="lazy"
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 left-3 bg-brand-black/85 px-3 py-1 text-[9px] text-brand-gold uppercase tracking-widest rounded border border-brand-gold/25 font-mono">
                    {language === 'EN' ? 'MAIN CHAMBER DOME' : 'शाही मुख्य शयनकक्ष'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 h-64 sm:h-76 md:h-84">
                  {selectedDetailRoom.images.slice(1).map((pic, idx) => (
                    <div key={idx} className="overflow-hidden rounded-lg border border-brand-gold/10 relative">
                      <img 
                        src={pic} 
                        alt="Restroom details" 
                        loading="lazy"
                        className="w-full h-full object-cover select-none"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-2 left-2 bg-brand-black/90 px-2 py-0.5 text-[8px] text-brand-gold uppercase tracking-widest rounded font-mono">
                        {idx === 0 ? (language === 'EN' ? 'MAJESTIC BATH' : 'रॉयल बाथ') : (language === 'EN' ? 'VISTA SCENERY' : 'कमरे का दृश्य')}
                      </div>
                    </div>
                  ))}
                  {/* Default supplementary luxury graphic context in case room only has 2 images in dataset */}
                  {selectedDetailRoom.images.length < 4 && (
                    <div className="overflow-hidden rounded-lg border border-brand-gold/10 bg-[#111124] flex flex-col items-center justify-center p-3 text-center text-brand-gold/70">
                      <Utensils className="w-6 h-6 mb-1 text-brand-gold" />
                      <span className="text-[8px] font-mono uppercase tracking-widest font-black block">{language === 'EN' ? 'FINE DINING' : 'उत्कृष्ट भोजन'}</span>
                      <p className="text-[7px] text-brand-cream/60 leading-tight mt-0.5">{language === 'EN' ? '24hr gourmet service Included' : 'चौबीसों घंटे सेवा'}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic responsive grid info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Section 1: Detailed Specifications */}
                <div className="bg-brand-navy/20 border border-brand-gold/10 rounded-xl p-5 space-y-4">
                  <h4 className="font-serif text-sm text-brand-gold uppercase tracking-widest border-b border-brand-gold/10 pb-2">
                    {language === 'EN' ? 'Sovereign Specs' : 'शाही विशेष विवरण'}
                  </h4>
                  <ul className="space-y-3 text-xs text-brand-cream/90 font-sans">
                    <li className="flex justify-between">
                      <span className="opacity-75">{language === 'EN' ? 'Ensuite Area size:' : 'कक्ष का कुल क्षेत्रफल:'}</span>
                      <span className="font-bold text-brand-white font-mono">{selectedDetailRoom.sizeSqFt} Sq Ft</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="opacity-75">{language === 'EN' ? 'Elevation Floor:' : 'शयनकक्ष की मंजिल:'}</span>
                      <span className="font-bold text-brand-white">
                        {selectedDetailRoom.id === 'anj-royal-presidential' ? 'Penthouse (Highest)' : '4th to 12th Elevation'}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="opacity-75">{language === 'EN' ? 'Standard Bedding:' : 'बिस्तरों का आकार:'}</span>
                      <span className="font-bold text-brand-white text-right">
                        {selectedDetailRoom.sizeSqFt < 600 ? 'Imperial King Bed' : 'Hand-Carved Canopy Bed'}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="opacity-75">{language === 'EN' ? 'Max Occupants:' : 'अधिकतम अनुमत संख्या:'}</span>
                      <span className="font-bold text-brand-white">{selectedDetailRoom.capacityMax} Dignitaries</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="opacity-75">{language === 'EN' ? 'External View type:' : 'बाहरी प्राकृतिक दृष्टि:'}</span>
                      <span className="font-bold text-brand-gold text-right truncate max-w-[130px]">{language === 'EN' ? selectedDetailRoom.viewType : selectedDetailRoom.viewTypeHI}</span>
                    </li>
                  </ul>
                </div>

                {/* Section 2: Complete Amenities Full check list */}
                <div className="bg-brand-navy/20 border border-brand-gold/10 rounded-xl p-5 space-y-3 md:col-span-2">
                  <h4 className="font-serif text-sm text-brand-gold uppercase tracking-widest border-b border-brand-gold/10 pb-2">
                    {language === 'EN' ? 'All-Inclusive Royal Amenities (Free)' : 'सर्वसमावेशी मुफ्त शाही सुख-सुविधाएं'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-brand-cream">
                    {(language === 'EN' ? selectedDetailRoom.amenities : selectedDetailRoom.amenitiesHI).map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-brand-gold shrink-0 bg-brand-gold/10 rounded-full p-0.5 border border-brand-gold/20" />
                        <span>{p}</span>
                      </div>
                    ))}
                    {/* Extra standard inclusions required */}
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-brand-gold shrink-0 bg-brand-gold/10 rounded-full p-0.5 border border-brand-gold/20" />
                      <span>{language === 'EN' ? 'In-Room Royal Safe Locker' : 'कमरे में शाही डिजिटल लाकॅर'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-brand-gold shrink-0 bg-brand-gold/10 rounded-full p-0.5 border border-brand-gold/20" />
                      <span>{language === 'EN' ? 'Complimentary Bottled Springs' : 'प्रतिदिन मानार्थ पेयजल बोतलें'}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* HAND-CRAFTED DETAILED INTERACTIVE VECTOR SVG FLOOR PLAN */}
              <div className="bg-[#111124] border border-brand-gold/15 rounded-xl p-5 md:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-brand-gold/10 pb-3">
                  <div>
                    <h4 className="font-serif text-md text-brand-gold uppercase tracking-wider font-semibold">
                      {language === 'EN' ? 'Sovereign Architectural Floor Plan' : 'प्रमाणित वास्तुकार लेआउट योजना'}
                    </h4>
                    <p className="text-[10px] text-brand-cream/60 font-sans mt-0.5">
                      {language === 'EN' ? `Scale outline representing ${selectedDetailRoom.sizeSqFt} SQ FT luxury layout.` : `शाही शयनकक्ष का प्रमाणिक त्रि-आयामी लेआउट पैमाना।`}
                    </p>
                  </div>
                  <span className="text-[9px] font-mono bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-3 py-1 rounded">
                    {language === 'EN' ? 'NORTH-FACING LAYOUT' : 'उत्तरमुखी विन्यास'}
                  </span>
                </div>

                {/* SVG Blueprint Draw */}
                <div className="flex items-center justify-center p-3 md:p-6 bg-brand-black/90 rounded-lg border border-brand-gold/5 overflow-x-auto select-none">
                  <svg viewBox="0 0 500 280" className="w-full max-w-lg h-auto stroke-brand-gold/40 fill-none text-[10px] font-sans">
                    {/* Outer walls layout */}
                    <rect x="15" y="15" width="470" height="250" rx="10" strokeWidth="3" className="stroke-brand-gold/75" />
                    
                    {/* Bedroom Area separator */}
                    <line x1="280" y1="15" x2="280" y2="265" strokeWidth="1.5" strokeDasharray="4 3" />

                    {/* Left side: Bedroom & sitting space */}
                    <text x="35" y="40" className="fill-brand-gold font-bold font-serif text-[11px] uppercase tracking-wide">I. MASTER SLEEPING SUITE</text>
                    
                    {/* Double Bed layout */}
                    <rect x="70" y="80" width="130" height="120" rx="6" strokeWidth="2" className="stroke-brand-gold/60 fill-brand-navy/60" />
                    <rect x="85" y="90" width="45" height="25" rx="2" className="stroke-brand-gold/20" />
                    <rect x="140" y="90" width="45" height="25" rx="2" className="stroke-brand-gold/20" />
                    <text x="105" y="145" className="fill-brand-cream/90 font-mono text-[9px] font-bold">MAHARAJA BED</text>

                    {/* Smart screen representation */}
                    <rect x="15" y="125" width="5" height="50" rx="1" className="fill-brand-gold" />
                    <text x="25" y="153" className="fill-brand-cream/50 scale-90 text-[8px] transform rotate-90 origin-left">65" LED SMART TV</text>

                    {/* Sitting sofa Jharokha side */}
                    <rect x="230" y="55" width="35" height="170" rx="4" strokeWidth="1" className="stroke-brand-gold/20 fill-[#221a15]" />
                    <text x="245" y="145" className="fill-brand-gold/60 text-[8px] font-bold font-mono tracking-widest uppercase [writing-mode:vertical-lr]">JHAROKHA SOFA</text>

                    {/* Right side: Restroom, bath & closet */}
                    <text x="295" y="40" className="fill-brand-gold font-bold font-serif text-[11px] uppercase tracking-wide">II. ROYAL EN-SUITE RESTROOM</text>
                    
                    {/* Jacuzzi / Bathtub representation in right top */}
                    <rect x="330" y="65" width="120" height="70" rx="35" strokeWidth="2" className="stroke-brand-gold/50 fill-brand-navy/80" />
                    <circle cx="390" cy="100" r="10" className="stroke-brand-gold/30" />
                    <text x="355" y="105" className="fill-brand-cream text-[9px] font-bold">JACUZZI SPA TUB</text>

                    {/* Double Vanities with gold glass */}
                    <circle cx="320" cy="200" r="12" className="stroke-brand-gold/30" />
                    <circle cx="370" cy="200" r="12" className="stroke-brand-gold/30" />
                    <text x="310" y="235" className="fill-brand-cream/75 text-[8px]">GOLD DOUBLE SINK VANITIES</text>

                    {/* Dedicated Butler closet niche */}
                    <rect x="430" y="170" width="40" height="80" rx="4" strokeWidth="1" className="stroke-brand-gold/20" />
                    <text x="435" y="215" className="fill-brand-cream/50 text-[8px] tracking-wide font-sans">BUTLER PANTRY</text>
                  </svg>
                </div>
              </div>

              {/* ROOM GUEST REVIEWS */}
              <div className="bg-[#111124] border border-brand-gold/15 rounded-xl p-5 md:p-6 space-y-4">
                <h4 className="font-serif text-md text-brand-gold uppercase tracking-wider font-semibold border-b border-brand-gold/10 pb-2">
                  {language === 'EN' ? `Sovereign Reviews for ${selectedDetailRoom.name}` : `विशिष्ट अतिथियों के सत्य अनुभव पत्र`}
                </h4>
                
                {/* 2 Detailed premium reviews based on room style */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  
                  <div className="p-4 bg-brand-navy/20 border border-brand-gold/5 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-brand-white">{selectedDetailRoom.id.includes('presidential') ? 'H.H. Maharaja of Bhavnagar' : 'Dr. Alistair Sterling'}</span>
                      <span className="text-brand-gold font-serif text-right text-xs">⭐⭐⭐⭐⭐</span>
                    </div>
                    <p className="text-brand-cream/85 italic leading-relaxed">
                      {selectedDetailRoom.id.includes('presidential') 
                        ? '"To spend a week at the Anjuman Presidential Palace is to experience historical Mewar lineage first-hand. The plunge pool had perfect 28°C control, and butler Rohit anticipated our every whim. Absolute state of art!"'
                        : '"A beautiful standard of accommodation. The Jharokha sitting, hand-woven Indian silk, and organic bath essentials created an immersive sanctuary. Exemplary room service that delivered within 30 minutes every day."'}
                    </p>
                    <span className="text-[10px] text-brand-gold/60 block font-mono">Verified Royal Guest Residence • Jan 2026</span>
                  </div>

                  <div className="p-4 bg-brand-navy/20 border border-brand-gold/5 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-brand-white">{selectedDetailRoom.id.includes('presidential') ? 'Lady Victoria Cavendish' : 'Rajesh & Shreya Singhania'}</span>
                      <span className="text-brand-gold font-serif text-right text-xs">⭐⭐⭐⭐⭐</span>
                    </div>
                    <p className="text-brand-cream/85 italic leading-relaxed">
                      {selectedDetailRoom.id.includes('presidential') 
                        ? '"The Rolls Royce pick-up directly from the runway transition, Private spa sessions, and dining with custom Mewari spice blends designed by chef made our anniversary unforgettable. Unmatched hospitality globally."'
                        : '"The premium bedding, wonderful sunrise lighting, and deep copper bathtub made this room worth every rupee. Having high teas arranged directly inside our chamber was outstanding. Will revisit!"'}
                    </p>
                    <span className="text-[10px] text-brand-gold/60 block font-mono">Verified Royal Guest Residence • April 2026</span>
                  </div>

                </div>
              </div>

              {/* PRICE INVOICE BREAKDOWN & BOOKING LAUNCH PORT */}
              <div className="bg-brand-navy/40 border-2 border-brand-gold/25 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <h4 className="font-serif text-lg text-brand-white uppercase font-bold tracking-wide">
                    {language === 'EN' ? 'Transparent Royal Accountancy' : 'पारदर्शी शाही लेखा-जोखा विवरण'}
                  </h4>
                  <p className="text-xs text-brand-cream/70 max-w-md leading-relaxed">
                    {language === 'EN' 
                      ? 'Anjuman supports complete transparent billing. All rates show base room cost, necessary 18% statutory GST, and structural luxury palace service charge.' 
                      : 'अंजुमन होटल पूर्ण पारदर्शिता में विश्वास रखता है। यहाँ आपके द्वारा चुने गए शयनकक्ष की बेस दर, १८% वैधानिक जीएसटी और ५% पैलेस सेवा शुल्क का विवरण दिया गया है।'}
                  </p>
                  
                  {/* Ledger invoice sheet */}
                  <div className="bg-brand-black/50 p-3 rounded border border-brand-gold/10 text-[11px] space-y-1.5 font-mono max-w-xs text-brand-cream">
                    <div className="flex justify-between">
                      <span>Base Room Rate:</span>
                      <span>₹{selectedDetailRoom.priceINR.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-brand-gold font-semibold">
                      <span>+ SGST & CGST (18%):</span>
                      <span>₹{Math.round(selectedDetailRoom.priceINR * 0.18).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[#B39359]">
                      <span>+ Palace Service Fee (5%):</span>
                      <span>₹{Math.round(selectedDetailRoom.priceINR * 0.05).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-t border-brand-gold/20 pt-1.5 flex justify-between text-brand-white font-extrabold text-xs">
                      <span>{language === 'EN' ? 'Total / Night Rate:' : 'कुल प्रति रात्रि देय:'}</span>
                      <span>₹{Math.round(selectedDetailRoom.priceINR * 1.23).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 shrink-0 text-center md:text-right w-full md:w-auto">
                  <div className="text-xs">
                    <span className="text-brand-cream/60 uppercase block">{language === 'EN' ? 'Total Estimated Stay' : 'अनुमानित कुल लागत'}</span>
                    <span className="text-3xl font-serif text-brand-gold font-black mt-1 block">₹{Math.round(selectedDetailRoom.priceINR * 1.23).toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-brand-cream/80 block mt-1">{language === 'EN' ? 'Includes All Taxes & Levies' : 'सभी करों और पैलेस सेवा शुल्क सहित'}</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => setSelectedDetailRoom(null)}
                      className="px-5 py-3 border border-brand-gold/25 mx-auto rounded text-brand-cream hover:bg-brand-gold/10 text-xs font-bold uppercase tracking-widest cursor-pointer transition-all"
                    >
                      {language === 'EN' ? 'Close & Search' : 'बंद करें'}
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedDetailRoom(null);
                        onBookNow(selectedDetailRoom.id);
                      }}
                      className="px-8 py-3 bg-gold-gradient text-brand-black text-xs font-black uppercase tracking-widest rounded transition-all hover:scale-[1.03] shadow-lg active:scale-95 cursor-pointer"
                    >
                      {language === 'EN' ? 'Proceed with Booking' : 'आरक्षण सम्बन्धी आगे बढ़ें'}
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 6. ROOM COMPARISON OVERLAY DRAWER */}
      {isCompareTrayOpen && comparedRoomIds.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-[#0B0B14]/95 border-t border-brand-gold/30 shadow-3xl z-40 p-5 md:p-6 animate-fade-in text-xs">
          <div className="w-full max-w-7xl mx-auto space-y-4">
            
            <div className="flex items-center justify-between border-b border-brand-gold/15 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-ping" />
                <h4 className="font-serif text-sm text-brand-gold uppercase tracking-widest font-bold">
                  {language === 'EN' ? 'Sovereign Spec Comparison Suite' : 'शाही शयनकक्ष तुलना केंद्र'}
                </h4>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-brand-cream/75 uppercase font-mono">{comparedRoomIds.length} / 3 Selected</span>
                <button 
                  onClick={() => {
                    setComparedRoomIds([]);
                    setIsCompareTrayOpen(false);
                  }}
                  className="text-brand-cream hover:text-brand-gold font-bold uppercase tracking-widest text-[10px]"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setIsCompareTrayOpen(false)}
                  className="bg-brand-gold text-brand-black px-4 py-1.5 rounded uppercase font-bold text-[9px] cursor-pointer"
                >
                  Minimize COMPARISON
                </button>
              </div>
            </div>

            {/* Compared items column blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {LUXURY_ROOMS.filter(r => comparedRoomIds.includes(r.id)).map(room => (
                <div key={room.id} className="p-4 bg-brand-navy/35 border border-brand-gold/10 rounded-lg flex flex-col justify-between space-y-3 relative">
                  <button 
                    onClick={(e) => toggleComparison(room.id, e)}
                    className="absolute top-2 right-2 text-brand-cream hover:text-brand-gold text-[10px] font-mono leading-none border border-brand-gold/10 p-1 px-1.5 rounded"
                  >
                    X
                  </button>
                  
                  <div>
                    <h5 className="font-serif text-brand-gold uppercase tracking-wider text-[11px] font-bold">
                      {language === 'EN' ? room.name : room.nameHI}
                    </h5>
                    {/* Compact list */}
                    <div className="space-y-1.5 mt-2 font-mono text-[9px] text-brand-cream">
                      <div className="flex justify-between">
                        <span>Rate:</span>
                        <span className="text-brand-white font-bold">₹{room.priceINR.toLocaleString('en-IN')} (Base)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>With GST:</span>
                        <span className="text-emerald-400">₹{Math.round(room.priceINR * 1.18).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span className="text-brand-white">{room.sizeSqFt} Sq Ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Guests:</span>
                        <span>{room.capacityMax} Dignitaries</span>
                      </div>
                      <div className="flex justify-between truncate">
                        <span>View Vistas:</span>
                        <span className="text-brand-gold italic truncate max-w-[130px]">{language === 'EN' ? room.viewType : room.viewTypeHI}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Butler:</span>
                        <span className="text-emerald-400">24/7 Included</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Special:</span>
                        <span className="text-brand-white truncate max-w-[120px]">{room.amenities[0]}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setIsCompareTrayOpen(false);
                      onBookNow(room.id);
                    }}
                    className="w-full py-1.5 bg-gold-gradient text-brand-black text-[9px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer shadow"
                  >
                    Book This Room
                  </button>
                </div>
              ))}
              
              {/* Empty placeholder comparison column blocks */}
              {Array.from({ length: Math.max(0, 3 - comparedRoomIds.length) }).map((_, placeholderIdx) => (
                <div key={placeholderIdx} className="border border-dashed border-brand-gold/15 rounded-lg flex flex-col items-center justify-center p-6 text-center text-brand-cream/40 py-10">
                  <Plus className="w-5 h-5 text-brand-gold/20 mb-1" />
                  <span className="text-[10px] uppercase font-mono tracking-widest">Select Room Above</span>
                  <p className="text-[8px] mt-0.5">{language === 'EN' ? 'Add up to 3 rooms for comparison' : 'तुलना के लिए कमरे जोड़ें'}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* 7. ROOM SERVICE DINING CATALOG - SEPARATE SECTION */}
      <div className="w-full bg-brand-navy/20 border-t border-brand-gold/15 py-16 md:py-24" id="in-room-dining">
        <div className="w-full max-w-7xl mx-auto px-4">
          
          {/* Header section catalog */}
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-brand-gold font-accent tracking-[0.3em] text-xs uppercase font-extrabold flex items-center justify-center gap-1">
              👑 {language === 'EN' ? 'IN-ROOM SOVEREIGN PALACE DINING' : 'कक्ष में ही राजसी भोजन सेवा'}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-brand-white uppercase tracking-wide">
              {language === 'EN' ? 'Shahi Diners Catalog' : 'शाही व्यंजन सूची और इन-रूम ऑर्डर'}
            </h2>
            <div className="w-20 h-[1px] bg-brand-gold/30 mx-auto"></div>
            <p className="text-xs md:text-sm text-brand-cream/80 italic font-sans">
              {language === 'EN' 
                ? 'Delivered inside silver cloches by specialized butler cart escorts directly from our main kitchen. Average preparation notice of 30-45 minutes.'
                : 'मुख्य शाही रसोई से सीधे चांदी के बर्तनों में सजे विशिष्ट और स्वादिष्ट व्यंजन सीधे आपके सुइट के दरवाजे पर सेवा बटलर द्वारा पहुंचाए जाएंगे।'}
            </p>
          </div>

          {/* Dynamic Interactive workspace dining filter tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left side dining control board */}
            <div className="bg-[#111124] border border-brand-gold/15 rounded-2xl p-5 md:p-6 space-y-6 h-fit">
              
              <div className="space-y-2">
                <span className="text-[10px] text-brand-gold font-mono uppercase tracking-widest block">{language === 'EN' ? 'DINING WORKSPACE' : 'भोजन नियंत्रण बोर्ड'}</span>
                <h4 className="font-serif text-sm text-brand-white uppercase font-bold">{language === 'EN' ? 'Curate Your Cravings' : 'विशेष व्यंजन खोजें'}</h4>
              </div>

              {/* Text Search field */}
              <div className="space-y-1 text-xs">
                <label className="text-brand-cream/70 text-[9px] uppercase tracking-widest">{language === 'EN' ? 'Search Dishes:' : 'व्यंजन का नाम खोजें:'}</label>
                <input 
                  type="text"
                  placeholder={language === 'EN' ? 'Enter keywords (e.g., Saffron, Poha)...' : 'अक्षर डालें...'}
                  value={diningSearch}
                  onChange={(e) => setDiningSearch(e.target.value)}
                  className="w-full bg-brand-navy border border-brand-gold/20 rounded p-2.5 text-brand-cream focus:border-brand-gold focus:outline-none"
                />
              </div>

              {/* Category buttons list */}
              <div className="space-y-2 text-xs">
                <span className="text-brand-cream/70 text-[9px] uppercase tracking-widest block">{language === 'EN' ? 'Menu Category:' : 'भोजन श्रेणी चुनें:'}</span>
                <div className="flex flex-col gap-1.5">
                  {(['Breakfast', 'Lunch', 'Dinner', 'LateNight', 'Beverages'] as const).map(catName => {
                    let catIcon = '🌅';
                    let label = 'Breakfast';
                    let timing = '7AM - 11AM';
                    if (catName === 'Breakfast') { catIcon = '🌅'; label = language === 'EN' ? 'Breakfast' : 'नाश्ता'; timing = '7AM - 11AM'; }
                    if (catName === 'Lunch') { catIcon = '🍽️'; label = language === 'EN' ? 'Lunch' : 'दोपहर भोजन'; timing = '12PM - 3PM'; }
                    if (catName === 'Dinner') { catIcon = '🌙'; label = language === 'EN' ? 'Dinner' : 'शाही रात्रि भोज'; timing = '7PM - 11PM'; }
                    if (catName === 'LateNight') { catIcon = '🌃'; label = language === 'EN' ? 'Late-Night' : 'देर रात भोजन'; timing = '11PM - 6AM'; }
                    if (catName === 'Beverages') { catIcon = '☕'; label = language === 'EN' ? 'All Day Beverages' : 'शाही पेय बार'; timing = '199-599 All Day'; }

                    return (
                      <button 
                        key={catName}
                        onClick={() => setDiningCategory(catName)}
                        className={`w-full text-left p-2.5 rounded transition-all uppercase tracking-wider text-[10px] font-bold flex items-center justify-between border ${
                          diningCategory === catName 
                            ? 'bg-gold-gradient text-brand-black border-brand-gold' 
                            : 'bg-brand-navy/40 border-brand-gold/10 text-brand-cream hover:border-brand-gold/30'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{catIcon}</span>
                          <span>{label}</span>
                        </span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded ${diningCategory === catName ? 'bg-brand-black/20 text-brand-black font-semibold' : 'bg-brand-black text-brand-gold/80 font-mono'}`}>
                          {timing}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Strict Dietary controls */}
              <div className="space-y-3.5 border-t border-brand-gold/10 pt-4 text-xs font-sans">
                <span className="text-brand-cream/70 text-[9px] uppercase tracking-widest block">{language === 'EN' ? 'Indian Dietary Filters' : 'भारतीय आहार प्राथमिकता'}</span>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer text-brand-cream/90 hover:text-brand-gold">
                    <input 
                      type="checkbox" 
                      className="accent-brand-gold scale-105"
                      checked={diningPrefs.vegOnly} 
                      onChange={(e) => setDiningPrefs(prev => ({ ...prev, vegOnly: e.target.checked }))} 
                    />
                    <span className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 border-2 border-emerald-500 flex items-center justify-center bg-white p-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /></span>
                      {language === 'EN' ? 'Veg Only' : 'केवल शाकाहारी'}
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-brand-cream/90 hover:text-brand-gold">
                    <input 
                      type="checkbox" 
                      className="accent-brand-gold scale-105"
                      checked={diningPrefs.jainOnly} 
                      onChange={(e) => setDiningPrefs(prev => ({ ...prev, jainOnly: e.target.checked }))} 
                    />
                    <span className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 border-2 border-emerald-500 flex items-center justify-center bg-white p-0.5"><span className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6.5px] border-b-emerald-500" /></span>
                      {language === 'EN' ? 'Jain Satvik Only' : 'केवल जैन सात्विक'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Direct Checkout time physical reminder bottom */}
              <div className="bg-brand-black p-3.5 rounded-lg border border-brand-gold/10 text-[9px] tracking-wide text-center space-y-1.5 font-mono text-brand-cream">
                <span className="text-brand-gold font-bold block">🛎️ {language === 'EN' ? 'Checkout Rule' : 'चेकआउट नियम'}</span>
                <p className="leading-relaxed">{language === 'EN' ? 'In-room food can order until 11:30 AM on departure day. Checkout is 12:00 PM IST.' : 'चेकआउट प्रस्थान सुबह ११:३० बजे तक भोजन ऑर्डर कर सकते हैं। समय १२:०० दोपहर।'}</p>
              </div>

            </div>

            {/* Right side dining menu items grid */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* Filter implementation on dining menu catalog items */}
              {(() => {
                let items = ROOM_SERVICE_CATALOG.filter(it => it.category === diningCategory);
                if (diningSearch) {
                  items = items.filter(it => it.name.toLowerCase().includes(diningSearch.toLowerCase()) || it.nameHI.includes(diningSearch));
                }
                if (diningPrefs.vegOnly) {
                  items = items.filter(it => it.isVeg === true);
                }
                if (diningPrefs.jainOnly) {
                  items = items.filter(it => it.isJain === true);
                }

                if (items.length === 0) {
                  return (
                    <div className="text-center py-16 border border-brand-gold/10 rounded-xl bg-[#111124]/40 max-w-sm mx-auto p-6 space-y-3">
                      <HelpCircle className="w-10 h-10 text-brand-gold/40 mx-auto" />
                      <h5 className="font-serif text-brand-gold text-sm">{language === 'EN' ? 'No Indian Dishes Found' : 'कोई व्यंजन नहीं मिला'}</h5>
                      <span className="text-[10px] text-brand-cream/75 block">{language === 'EN' ? 'Adjust your text search or Veg/Jain parameters.' : 'कृप्या आहार प्राथमिकता बदलें।'}</span>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {items.map(dish => {
                      const finalDishCost = Math.round(dish.priceINR * 1.18); // Show 18% GST included

                      return (
                        <div key={dish.id} className="bg-[#111124]/60 border border-brand-gold/15 rounded-xl overflow-hidden p-4 flex gap-4 transition-all hover:border-brand-gold/40">
                          
                          {/* Left photo dish */}
                          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden border border-brand-gold/10 shrink-0 relative select-none">
                            <img 
                              src={dish.image} 
                              alt={dish.name} 
                              loading="lazy"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            
                            {/* Food color badges in Indian custom rules */}
                            <div className="absolute top-2 left-2 bg-white/90 p-1 rounded shadow-md border border-gray-200">
                              {dish.isVeg ? (
                                <div className="w-3.5 h-3.5 border-2 border-emerald-500 flex items-center justify-center p-0.5">
                                  {dish.isJain ? (
                                    /* Jain Triangle indicator inside green box */
                                    <span className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6.5px] border-b-emerald-500" />
                                  ) : (
                                    /* Veg Dot indicator inside green box */
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  )}
                                </div>
                              ) : (
                                /* Non veg red indicator */
                                <div className="w-3.5 h-3.5 border-2 border-red-500 flex items-center justify-center p-0.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right text descriptions */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div className="space-y-1">
                              
                              <div className="flex justify-between items-start gap-1">
                                <h4 className="font-serif text-sm text-brand-gold font-bold uppercase tracking-wide">
                                  {language === 'EN' ? dish.name : dish.nameHI}
                                </h4>
                                <span className="font-mono text-xs text-brand-white font-extrabold shrink-0">
                                  ₹{dish.priceINR}
                                </span>
                              </div>

                              <p className="text-[10px] text-brand-cream/80 leading-normal font-sans line-clamp-2">
                                {language === 'EN' ? dish.description : dish.descriptionHI}
                              </p>

                              {/* Veg / non vegetarian labels */}
                              <div className="flex gap-1.5">
                                {dish.isVeg && (
                                  <span className="text-[8px] bg-emerald-990 border border-emerald-500/30 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                                    VEG
                                  </span>
                                )}
                                {dish.isJain && (
                                  <span className="text-[8px] bg-amber-990 border border-amber-500/30 text-amber-300 font-bold px-1.5 py-0.5 rounded">
                                    JAIN OPTION
                                  </span>
                                )}
                                {!dish.isVeg && (
                                  <span className="text-[8px] bg-red-990 border border-red-500/30 text-red-300 font-bold px-1.5 py-0.5 rounded">
                                    ROYAL NON-VEG
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Servings price inclusive checkout instructions */}
                            <div className="pt-2 flex justify-between items-center border-t border-brand-gold/10">
                              <span className="text-[9px] text-emerald-400 font-mono font-medium">
                                ₹{finalDishCost} (incl. 18% GST)
                              </span>
                              <button 
                                onClick={() => handleOrderDiningItem(dish)}
                                className="px-3 py-1.5 bg-brand-gold/10 border border-brand-gold text-brand-gold text-[9px] uppercase tracking-wider font-extrabold rounded hover:bg-brand-gold hover:text-brand-black transition-all cursor-pointer"
                              >
                                {language === 'EN' ? 'Order Now' : 'ऑर्डर करें'}
                              </button>
                            </div>

                          </div>

                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Placed orders live butler dispatch screen drawer */}
              {placedOrders.length > 0 && (
                <div className="bg-[#111124] border-2 border-[#B39359] rounded-2xl p-5 md:p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-brand-gold/15 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <h4 className="font-serif text-xs md:text-sm text-brand-gold uppercase tracking-widest font-bold">
                        {language === 'EN' ? 'Active In-Room Service Butler Dispatch Board' : 'सक्रिय इन-रूम ऑर्डर एवं बटलर प्रेषण पट्टिका'}
                      </h4>
                    </div>
                    <span className="text-[10px] text-brand-cream/60 font-mono">Real-time Tracker</span>
                  </div>

                  <div className="space-y-3">
                    {placedOrders.map(ord => (
                      <div key={ord.id} className="p-3 bg-brand-black/50 border border-brand-gold/10 rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-brand-white font-mono">{ord.id}</span>
                            <span className="text-brand-gold font-serif font-black">—</span>
                            <span className="text-brand-cream font-bold">{ord.itemName}</span>
                          </div>
                          <p className="text-[10px] text-brand-cream/60">
                            {language === 'EN' ? `Delivery destination: Assigned Butler Cart • Estimated notice: 30-45 minutes.` : `वितरण स्थान: आपके आरक्षित कक्ष बटलर द्वारा।`}
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3.5 border-t sm:border-t-0 border-brand-gold/10 pt-2 sm:pt-0">
                          <div className="text-right">
                            <span className="text-[9px] text-[#A1D1A1] block font-mono font-bold uppercase tracking-wider">{ord.status}</span>
                            <span className="text-[9px] text-brand-cream/60 block">{ord.timer > 0 ? `${ord.timer} mins remaining notice` : 'Butler Arrived'}</span>
                          </div>

                          {/* Progress bar visual spinner */}
                          <div className="w-8 h-8 rounded-full border-2 border-brand-gold/15 border-t-brand-gold animate-spin shrink-0 flex items-center justify-center p-1" style={{ animationDuration: ord.timer > 0 ? '2s' : '0s' }}>
                            <span className="text-[8px] font-mono text-brand-gold select-none -rotate-45 block transform">B</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}

// Visual helpers
interface StarsRowProps {
  text: string;
}

function StarsRow({ text }: StarsRowProps) {
  return (
    <div className="flex items-center justify-center gap-1">
      <span className="text-[8px] tracking-widest font-mono text-brand-gold/60 uppercase">{text}</span>
    </div>
  );
}
