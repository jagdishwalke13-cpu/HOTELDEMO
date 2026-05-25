import { Room, Service, MenuItem } from './types';

export const LUXURY_ROOMS: Room[] = [
  {
    id: 'anj-standard-deluxe',
    name: 'Standard Deluxe Room',
    nameHI: 'मानक डीलक्स कमरा',
    category: 'Deluxe',
    priceINR: 8999,
    capacityMax: 3,
    sizeSqFt: 350,
    viewType: 'Imperial Palace Courtyard',
    viewTypeHI: 'शाही महल का प्रांगण',
    description: 'An elegant blend of comfort and traditional Mewari styling, overlooking the landscaped internal palaces. Features dynamic temperature controls and high-speed connections.',
    descriptionHI: 'आराम और पारंपरिक मेवाडी शैली का एक सुंदर मिश्रण, जहां से शाही महल के आंतरिक बगीचों का विहंगम दृश्य दिखाई देता है।',
    amenities: [
      'Free WiFi (100 Mbps)',
      '55" Smart LED TV',
      'Mini Bar',
      '24hr Room Service',
      'Air Conditioning',
      'Rain Shower',
      'Complimentary Breakfast',
      'Daily Housekeeping'
    ],
    amenitiesHI: [
      'निःशुल्क वाईफाई (100 एमबीपीएस)',
      '55 इंच का स्मार्ट एलईडी टीवी',
      'मिनी बार',
      '24 घंटे कमरा सेवा',
      'वातानुकूलन (एसी)',
      'रेन शॉवर',
      'मानार्थ स्वादिष्ट नाश्ता',
      'दैनिक साफ-सफाई'
    ],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1582719478250-c89cae4db85b?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: true
  },
  {
    id: 'anj-premium-room',
    name: 'Premium Room',
    nameHI: 'प्रीमियम कक्ष',
    category: 'Deluxe',
    priceINR: 12999,
    capacityMax: 3,
    sizeSqFt: 500,
    viewType: 'Udaipur City View & Archways',
    viewTypeHI: 'उदयपुर शहर का विहंगम दृश्य',
    description: 'Sophisticated vintage aesthetics paired with generous space and elegant design. Indulge in luxury with deep hand-carved arches and bespoke furniture.',
    descriptionHI: 'भव्य और विशाल जगह के साथ शानदार पारंपरिक डिजाइन और स्थापत्य कला। हाथ से की गई नक्काशी और सुंदर साज-सज्जा का आनंद लें।',
    amenities: [
      'Complimentary Breakfast',
      'Deep Bathtub & Luxury Bathrobe',
      'Bespoke Sitting & Work Lounge',
      '65" OLED Smart TV',
      '24-Hour Palace Butler Service On Demand',
      'Espresso & High Tea Machine',
      'Forest Essentials Bath Toiletries',
      'Pre-stocked Premium Minibar'
    ],
    amenitiesHI: [
      'मानार्थ शाही नाश्ता',
      'भव्य बाथटब और आलीशान गाउन',
      'विशेष बैठक और कार्य लाउंज',
      '65 इंच पुराना ओएलईडी टीवी',
      'मांग पर चौबीसों घंटे बटलर सेवा',
      'नेस्प्रेसो कॉफी और चाय मशीन',
      'फॉरेस्ट एसेंशियल्स स्नान प्रसाधन',
      'प्रीमियम स्टॉक मिनीबार'
    ],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: false
  },
  {
    id: 'anj-junior-suite',
    name: 'Junior Suite',
    nameHI: 'जूनियर सुइट',
    category: 'Suite',
    priceINR: 18999,
    capacityMax: 4,
    sizeSqFt: 700,
    viewType: 'Sunset Gardens & Misty Hills',
    viewTypeHI: 'शाम के बगीचे और धुंधली पहाड़ियां',
    description: 'A sovereign refuge displaying genuine Indian silk textiles and royal Mewar handcrafts. Incorporates a spacious separate sitting area and highly optimized personalized service.',
    descriptionHI: 'भारतीय रेशम और हस्तशिल्प से सुसज्जित एक अनोखा सुइट। इसमें रहने के लिए एक अलग बैठने का विशाल क्षेत्र और समर्पित बटलर सेवा उपलब्ध है।',
    amenities: [
      'Dedicated Royal Butler Support',
      'Separate Living Room & Sofa Suite',
      'Equipped Kitchenette & Pantry Area',
      'Luxury Pillow & Fragrance Menu',
      'Mewari Welcome High Tea Ceremony',
      'Interactive Media Smart Theater',
      'Daily Fresh Fruit Basket & Chocolates',
      'Complimentary Laundrying (2 Pieces)'
    ],
    amenitiesHI: [
      'समर्पित शाही बटलर सहायता',
      'अलग बैठक और सोफा सुइट',
      'सुसज्जित रसोईघर क्षेत्र',
      'शानदार तकिया और सुगंध मेनू',
      'मेवाड़ी पारंपरिक स्वागत हाई टी',
      'इंटरएक्टिव स्मार्ट थिएटर',
      'ताजे फल और चॉकलेट डिश डेली',
      'मानार्थ लांड्री (दैनिक २ जोड़ी)'
    ],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: true
  },
  {
    id: 'anj-deluxe-suite',
    name: 'Deluxe Suite',
    nameHI: 'डीलक्स सुइट',
    category: 'Suite',
    priceINR: 28999,
    capacityMax: 4,
    sizeSqFt: 1000,
    viewType: 'Pichola Lake Waters & Sky Dome',
    viewTypeHI: 'पिछोला झील और सुंदर नीला आकाश',
    description: 'Live in palatial grandeur with panoramic water vistas. Built around high-tech control consoles, vintage Italian marble bathrooms, and bespoke dining layouts.',
    descriptionHI: 'पिछोला झील के मंत्रमुग्ध कर देने वाले दृश्यों के साथ जीएं। सुंदर नक्काशीदार संगमरमर के स्नानघरों और विशेष व्यक्तिगत डाइनिंग क्षेत्र की उत्तम व्यवस्था।',
    amenities: [
      'Dedicated 24/7 Butler Service',
      'Private Dining Area & Dining Table',
      'Royal Jacuzzi Tub in Master Bed Bath',
      'Premium Custom Curated Minibar',
      'Complimentary One-way Airport Transfer',
      'Early Pre-checkin Preference Check',
      'Bespoke Mewar Raga Soundscape System',
      'Access to Elite Maharaja Club Lounge'
    ],
    amenitiesHI: [
      'समर्पित शाही बटलर चौबीसों घंटे',
      'निजी डाइनिंग क्षेत्र और विशाल टेबल',
      'मास्टर बाथरूम में लक्जरी जकूज़ी',
      'प्रीमियम चुनिंदा कस्टमाइज़्ड मिनीबार',
      'मानार्थ हवाई अड्डा एकतरफा पिकअप',
      'प्रारंभिक चेक-इन प्राथमिकता सुविधा',
      'उत्कृष्ट मेवाड़ राग सराउंड साउंड',
      'एलीट महाराजा क्लब लाउंज तक पहुंच'
    ],
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: false
  },
  {
    id: 'anj-royal-suite',
    name: 'Royal Suite',
    nameHI: 'शाही राजपूताना सुइट',
    category: 'Suite',
    priceINR: 45999,
    capacityMax: 5,
    sizeSqFt: 1500,
    viewType: 'Panoramic Sunset Over Lake Pichola',
    viewTypeHI: 'पिछोला झील पर सूर्यास्त का विहंगम नजारा',
    description: 'An expansive masterpiece featuring high ceilings, handcrafted silver arches, dynamic views and a private Jharokha balcony sitting over Udaipur waters.',
    descriptionHI: 'उच्च छतों, हाथ से तराशे गए चांदी के मेहराबों, प्राकृतिक नजारों और पिछोला झील के ठीक ऊपर एक सुंदर निजी झरोखा बालकनी वाला एक शाही मास्टरपीस।',
    amenities: [
      'Exclusive Private Sun Terrace & Bed Lounge',
      'Personal Butler assigned for Absolute Duration',
      'Super Premium Forest Essentials Toiletries',
      'VIP Handcrafted Welcoming Sweets Board',
      'Complimentary Roundtrip Airport Chauffeur',
      'Private Barbeque Setup on Balcony',
      'All-Inclusive Daily High Tea & Cocktails',
      'Bespoke Rajasthani Royal Silk Robes'
    ],
    amenitiesHI: [
      'विशेष निजी सन टेरेस और बेड लाउंज',
      'पूरी यात्रा के लिए समर्पित व्यक्तिगत बटलर',
      'सुपर प्रीमियम फॉरेस्ट एसेंशियल्स प्रसाधन',
      'वीआईपी हस्तनिर्मित स्वागत मेवाड़ी व्यंजन',
      'मानार्थ दोनों तरफ हवाई अड्डा आवागमन',
      'बालकनी पर निजी बारबेक्यू व्यवस्था',
      'सर्व-समावेशी दैनिक संध्या हाई टी',
      'शानदार राजस्थानी शाही रेशमी वस्त्र'
    ],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: true
  },
  {
    id: 'anj-royal-presidential',
    name: 'Presidential Palace Suite',
    nameHI: 'राष्ट्रपति महल सुइट',
    category: 'Presidential',
    priceINR: 85999,
    capacityMax: 6,
    sizeSqFt: 2500,
    viewType: '360° Pichola Lake, Fountains & Aravali Range',
    viewTypeHI: '३६०° पिछोला झील, फव्वारे और अरावली दृश्य',
    description: 'The ultimate pinnacle of Indian hospitality. Sprawled across the penthouse dome floor of the main palace, incorporating a private pool, mini theater, and personal chef.',
    descriptionHI: 'भारतीय आतिथ्य का सर्वोच्च शिखर। महल के मुख्य शीर्ष स्थान पर विस्तृत, जिसमें स्वयं का निजी स्विमिंग पूल, मिनी थिएटर और व्यक्तिगत रसोइया शामिल हैं।',
    amenities: [
      'Private Temperature-Controlled Plunge Pool',
      'Private 4K Dolby Atmos Home Cinema',
      'Personal Palace Chef on Request (Free)',
      'Complimentary Rolls Royce Airport Transfer',
      'Full Access to Elite VIP Secretariat Services',
      'In-Chamber Customized Spa Massage Room',
      'Imported Gold-trimmed Italian Rose Marble Bath',
      'Helipad Landing Check & Logistics Support'
    ],
    amenitiesHI: [
      'निजी तापमान-नियंत्रित प्लंज पूल',
      'निजी 4K डॉल्बी एटमॉस होम सिनेमा',
      'मांग पर व्यक्तिगत महल शेफ (निःशुल्क)',
      'मानार्थ रोल्स रॉयस एयरपोर्ट पिकअप',
      'एलीट वीआईपी सचिवालय सेवाओं तक पहुंच',
      'इन-कक्ष कस्टमाइज़्ड शाही मसाज सैलून',
      'सोने से जड़ित इतालवी रोज संगमरमर स्नानघर',
      'हेलीपैड लैंडिंग और शाही लॉजिस्टिक्स सपोर्ट'
    ],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4db85b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-15711003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: true
  }
];

export const LUXURY_SERVICES: Service[] = [
  {
    id: 'srv-spa',
    name: 'Veda Wellness & Royal Hammam',
    nameHI: 'वेद वैलनेस और शाही हम्माम',
    timing: '07:00 AM - 10:00 PM IST',
    icon: 'fa-sparkles',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
    description: 'Unwind with ancient Ayurvedic rituals, traditional aromatherapy, and a bespoke Turkish-style golden hammam scrub designed for total restoration.',
    descriptionHI: 'प्राचीन आयुर्वेदिक अनुष्ठानों, पारंपरिक अरोमाथेरेपी और संपूर्ण शारीरिक नवजीवन के लिए तैयार विशेष तुर्की शैली के स्वर्ण हम्माम स्क्रब के साथ तनावमुक्त हों।',
    features: ['Ayurvedic Panchakarma Therapies', 'Heated Himalayan Salt Rooms', 'Golden Hammam Bath Experience', 'Sanskrit Mantra Meditation Guided Yoga']
  },
  {
    id: 'srv-pool',
    name: 'Nirvana Infinity Lake Pool',
    nameHI: 'निर्वाण इन्फिनिटी लेक पूल',
    timing: '06:00 AM - 08:00 PM IST',
    icon: 'fa-water',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=800',
    description: 'An expansive temperature-controlled infinity pool merging seamlessly with the skyline. Float in royal comfort with private golden poolside cabanas.',
    descriptionHI: 'पहाड़ी क्षितिज के साथ विलीन होता एक विशाल, तापमान-नियंत्रित अनोखा इन्फिनिटी पूल। निजी पूल-साइड सुनहरे कबाना के साथ शाही आराम में तैरें।',
    features: ['Floating Champagne Breakfast Tray', 'Underwater Mewar Raga Soundscape', 'Heated Soft Water Treatment', ' Sunset Wine Curation Services']
  },
  {
    id: 'srv-banquet',
    name: 'Darbar-e-Azam Grand Banquet Hall',
    nameHI: 'दरबार-ए-आज़म भव्य बैंक्वेट हॉल',
    timing: 'By Reservation / Booking',
    icon: 'fa-hands-holding-ceremony',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
    description: 'Elevate your grand celebrations and sovereign functions with magnificent chandeliers, space seating up to 1200 dignitaries, and fully royal customized culinary hosting.',
    descriptionHI: 'शानदार झाड़-फानूस, 1200 प्रतिष्ठित अतिथियों की बैठक क्षमता और विशेष कस्टमाइज़्ड शाही व्यंजनों के साथ अपने समारोहों को वैभवशाली बनाएं।',
    features: ['State-of-the-art Sound Engineering', 'Heritage Mewari Theme Royal Setups', 'VIP Holding Lounges & Security Gate', 'Michelin-star Level Banquet Chefs']
  },
  {
    id: 'srv-butler',
    name: 'Shahi Concierge & Helipad Service',
    nameHI: 'शाही कंसियर और हेलीपैड सेवा',
    timing: '24/7 At Your Disposal',
    icon: 'fa-helicopter',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&q=80&w=800',
    description: 'Private helipad facilities for seamless arrival, alongside bespoke luxury chauffeur service and specialized security details for our distinguished dignitaries.',
    descriptionHI: 'सहज आगमन के लिए निजी हेलीपैड सेवाएं, साथ ही हमारे विशिष्ट अतिथियों के लिए व्यक्तिगत सुरक्षा और लक्जरी रोल्स रॉयस शटल सेवा।',
    features: ['Private Helipad Landing Grid', 'Elite Chauffeur Rolls Royce Phantom Fleet', 'Local Historical Scholar Guides', '24-hour Custom Art Gallery Tours']
  }
];

export const SHAHI_MENU: MenuItem[] = [
  {
    id: 'menu-1',
    name: 'Heritage Mewari Laal Maas',
    nameHI: 'विरासत मेवाड़ी लाल मासँ',
    category: 'Main Heritage',
    priceINR: 1850,
    description: 'Award-winning slow-cooked tender meat with royal Mathania chilies, authentic Indian ghee, and smoked with clove charcoal.',
    descriptionHI: 'मथानिया मिर्च और गाय के शुद्ध घी के साथ धीमी आंच पर पकाया गया कोमल मांस, कोयले और लौंग के धुएं से दम दिया हुआ।',
    isVeg: false
  },
  {
    id: 'menu-2',
    name: 'Royal Ker Sangri Jugalbandi',
    nameHI: 'शाही केर सांगरी जुगलबंदी',
    category: 'Main Heritage',
    priceINR: 1150,
    isVeg: true,
    description: 'Exquisite wild desert berries and beans stir-fried with rich cashew paste, dry raisins, and age-old secret herbs.',
    descriptionHI: 'काजू पेस्ट, सूखी किशमिश और प्राचीन पारंपरिक जड़ी-बूटियों के साथ तली हुई उत्तम जंगली रेगिस्तानी सांगरी।'
  },
  {
    id: 'menu-3',
    name: 'Smoked Dal Baati Churma Thali',
    nameHI: 'मेवाड़ी दाल बाटी चूरमा थाली',
    category: 'Main Heritage',
    priceINR: 1450,
    isVeg: true,
    description: 'Wood-fired crispy wheat balls served with 5-lentil aromatic slow-cook broth, pure organic ghee, and cardamom dry fruit churma crumbs.',
    descriptionHI: 'सुगंधित पंचमेल दाल, शुद्ध जैविक घी और इलायची-मेवे से भरपूर चूरमे के साथ भुने हुए पारंपरिक बाटी।'
  },
  {
    id: 'menu-4',
    name: 'Saffron Shahi Tukda Gold-Leaf',
    nameHI: 'केसरिया शाही टुकड़ा स्वर्ण-पत्र',
    category: 'Dessert',
    priceINR: 950,
    isVeg: true,
    description: 'Crispy ghee brioche soaked in dense saffron rabri, roasted pistachios, and crowned with real 24-karat edible gold leaf.',
    descriptionHI: 'केसरिया गाढ़ी रबड़ी में डूबा क्रिस्पी घी ब्रियोश, पिस्ता कतरन और 24-कैरेट खाने योग्य सोने के उत्तम वर्क से सजाया हुआ।'
  },
  {
    id: 'menu-5',
    name: 'Rose-Water Royal Lassi Sherbet',
    nameHI: 'शाही गुलाब जल लस्सी शरबत',
    category: 'Beverage',
    priceINR: 650,
    isVeg: true,
    description: 'Double-churned rich Indian yogurt infused with wild rose extract, organic wild forest honey, and topped with dry rose petals.',
    descriptionHI: 'जंगली गुलाब के अर्क और शुद्ध पहाड़ी शहद से भरपूर मथी हुई स्वादिष्ट गाढ़ी लस्सी, गुलाब की पंखुड़ियों से सजी।'
  },
  {
    id: 'menu-6',
    name: 'Vedic Golden Almond Milk',
    nameHI: 'वैदिक स्वर्ण बादाम दूध',
    category: 'Beverage',
    priceINR: 750,
    isVeg: true,
    description: 'Saffron-infused warm hand-ground organic badam beverage with wild ginger, holy basil, and dynamic immunity spices.',
    descriptionHI: 'केसर, पिसे हुए जैविक बादाम, अदरक और रोग-प्रतिरोधक जड़ी-बूटियों से युक्त वैदिक परंपरा का गर्म पौष्टिक पेय।'
  }
];

export const GALLERY_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800', caption: 'Palatial Pichola Frontage' },
  { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800', caption: 'Maharani Suite Balcony view' },
  { url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800', caption: 'Sovereign Dining Room' },
  { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800', caption: 'Our Sparkling Waters' },
  { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800', caption: 'Royal Gateway At Sunset' },
  { url: 'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&q=80&w=800', caption: 'Veda Welcoming Lobby' }
];
