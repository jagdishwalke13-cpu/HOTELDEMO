import React, { useState, FormEvent, useEffect } from 'react';
import { LanguageType } from '../types';
import { 
  Compass, 
  Utensils, 
  Clock, 
  Sparkles, 
  Search, 
  ShoppingCart, 
  Check, 
  Users, 
  ChevronRight, 
  Flame, 
  ShieldAlert, 
  HelpCircle, 
  ChefHat, 
  CheckCircle2, 
  Smartphone,
  Info
} from 'lucide-react';

interface DiningSectionProps {
  language: LanguageType;
}

interface DiningItem {
  id: string;
  name: string;
  nameHI: string;
  category: 'Appetizers' | 'Mains' | 'Breads' | 'Rice' | 'Desserts' | 'Beverages';
  priceINR: number;
  isVeg: boolean;
  dietTags: ('Veg' | 'Non-Veg' | 'Jain' | 'Vegan' | 'Gluten-Free')[];
  spiceLevel: 0 | 1 | 2 | 3;
  isChefSpecial: boolean;
  isPopular: boolean;
  ingredients: string;
  image: string;
}

// 1. RESTRUCTURED FULL DETAILED MASTER MENU ARRAY WITH METRICS
const MASTER_MENU_DATA: DiningItem[] = [
  // STARTERS (Appetizers)
  {
    id: 'food-c-tikka',
    name: 'Tandoori Chicken Tikka',
    nameHI: 'तंदूरी चिकन टिक्का',
    category: 'Appetizers',
    priceINR: 549,
    isVeg: false,
    dietTags: ['Non-Veg'],
    spiceLevel: 2,
    isChefSpecial: false,
    isPopular: true,
    ingredients: 'Boneless chicken, sour cream, hand-ground red chili paste, smoked tandoori spices.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'food-p-tikka',
    name: 'Mewari Malai Paneer Tikka',
    nameHI: 'मेवाड़ी मलाई पनीर टिक्का',
    category: 'Appetizers',
    priceINR: 449,
    isVeg: true,
    dietTags: ['Veg', 'Gluten-Free'],
    spiceLevel: 1,
    isChefSpecial: true,
    isPopular: false,
    ingredients: 'Rich organic cottage cheese, fresh cream, green cardamom dust, grilled in clay tandoor.',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'food-seekh',
    name: 'Awadhi Mutton Seekh Kebab',
    nameHI: 'अवधी मटन सीख कबाब',
    category: 'Appetizers',
    priceINR: 599,
    isVeg: false,
    dietTags: ['Non-Veg'],
    spiceLevel: 3,
    isChefSpecial: false,
    isPopular: true,
    ingredients: 'Minced Himalayan mutton, royal cloves, saffron water, skewered over coal.',
    image: 'https://images.unsplash.com/photo-1532636875304-0c8fe1197e1e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'food-hara-bhara',
    name: 'Crispy Hara Bhara Kabab',
    nameHI: 'हरा भरा कबाब क्रिस्पी',
    category: 'Appetizers',
    priceINR: 399,
    isVeg: true,
    dietTags: ['Veg', 'Vegan', 'Gluten-Free'],
    spiceLevel: 1,
    isChefSpecial: false,
    isPopular: false,
    ingredients: 'Farm baby spinach, mashed green peas, fresh mint leaf extract, shallow fried in vegetable oil.',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'food-prawn-kol',
    name: 'Koliwada Crispy Jumbo Prawns',
    nameHI: 'कोलीवाड़ा क्रिस्पी जंबो झींगा',
    category: 'Appetizers',
    priceINR: 699,
    isVeg: false,
    dietTags: ['Non-Veg'],
    spiceLevel: 2,
    isChefSpecial: true,
    isPopular: true,
    ingredients: 'Bay of Bengal tiger prawns, chickpea batter crust, carom seeds, ginger dust.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'food-dahi-sholay',
    name: 'Udaipur Dahi Ke Sholay',
    nameHI: 'उदयपुर दही के शोले',
    category: 'Appetizers',
    priceINR: 349,
    isVeg: true,
    dietTags: ['Veg', 'Jain'],
    spiceLevel: 1,
    isChefSpecial: true,
    isPopular: false,
    ingredients: 'Double Hung curd cheese, bell pepper juliennes, golden fried bread pocket sleeve.',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=400'
  },

  // MAIN COURSE (Mains)
  {
    id: 'food-dal-makhani',
    name: 'Signature Shahi Dal Anjuman',
    nameHI: 'शाही दाल मखनी अंजुमन',
    category: 'Mains',
    priceINR: 449,
    isVeg: true,
    dietTags: ['Veg', 'Gluten-Free'],
    spiceLevel: 1,
    isChefSpecial: false,
    isPopular: true,
    ingredients: 'Black urad lentils slow simmered for 36 hours, white butter, organic tomato puree, fenugreek leaf dust.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'food-butter-chicken',
    name: 'Old-Delhi Butter Chicken',
    nameHI: 'पुरानी दिल्ली बटर चिकन',
    category: 'Mains',
    priceINR: 649,
    isVeg: false,
    dietTags: ['Non-Veg'],
    spiceLevel: 2,
    isChefSpecial: true,
    isPopular: true,
    ingredients: 'Clay-tandoor roasted chicken, golden cashew cream gravy, butter glaze, fresh tomatoes flavor.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'food-paneer-butter',
    name: 'Mughlai Paneer Butter Masala',
    nameHI: 'मुगलई पनीर बटर मसाला',
    category: 'Mains',
    priceINR: 549,
    isVeg: true,
    dietTags: ['Veg', 'Gluten-Free'],
    spiceLevel: 1,
    isChefSpecial: false,
    isPopular: false,
    ingredients: 'Crumbled cottage cheese cubes, sweet cashew-onion butter reduction, kashmiri deghi chili grease.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'food-rogan-josh',
    name: 'Kashmiri Rogan Josh',
    nameHI: 'कश्मीरी रोगन जोश',
    category: 'Mains',
    priceINR: 799,
    isVeg: false,
    dietTags: ['Non-Veg', 'Gluten-Free'],
    spiceLevel: 3,
    isChefSpecial: false,
    isPopular: true,
    ingredients: 'Highland tender mutton shoulder chunks cooked with Alkanet flower root extract, fennel powder, cardamom.',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'food-prawn-masala',
    name: 'Konkan Coast Coconut Prawn Masala',
    nameHI: 'कोंकण नारियल झींगा मसाला',
    category: 'Mains',
    priceINR: 999,
    isVeg: false,
    dietTags: ['Non-Veg'],
    spiceLevel: 2,
    isChefSpecial: true,
    isPopular: false,
    ingredients: 'Gulf jumbo prawns roasted in fresh grated coconut meat mud, tamarind reduction, mustard seeds.',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'food-palak-paneer',
    name: 'Lasanila Palak Paneer Sativa',
    nameHI: 'लहसुनी पालक पनीर सैटिवा',
    category: 'Mains',
    priceINR: 499,
    isVeg: true,
    dietTags: ['Veg', 'Jain', 'Gluten-Free'],
    spiceLevel: 1,
    isChefSpecial: false,
    isPopular: false,
    ingredients: 'Pureed raw organic baby spinach, roasted garlic nuggets, soft organic paneer cubes, pure cow ghee.',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400'
  },

  // BREADS
  {
    id: 'bread-naan-butter',
    name: 'Tandoori Butter Naan',
    nameHI: 'तंदूरी बटर नान',
    category: 'Breads',
    priceINR: 79,
    isVeg: true,
    dietTags: ['Veg'],
    spiceLevel: 0,
    isChefSpecial: false,
    isPopular: true,
    ingredients: 'Fine refined wheat flour leavened with sweet milk, hand stretched, glazed with salted butter.',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'bread-naan-garlic',
    name: 'Gilded Garlic Naan',
    nameHI: 'शाही लहसुनी लहसुन नान',
    category: 'Breads',
    priceINR: 89,
    isVeg: true,
    dietTags: ['Veg'],
    spiceLevel: 0,
    isChefSpecial: false,
    isPopular: false,
    ingredients: 'Leavened wheat dough studded with chopped mountain garlic, coriander leaves, baked inside hot clay.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'bread-kulcha',
    name: 'Amritsari Stuffed Aloo Kulcha',
    nameHI: 'अमृतसरी स्टफ्ड आलू कुलचा',
    category: 'Breads',
    priceINR: 119,
    isVeg: true,
    dietTags: ['Veg'],
    spiceLevel: 1,
    isChefSpecial: true,
    isPopular: false,
    ingredients: 'Flaky layered bread stuffed with spiced potato mash, green chili nuggets, baked with dollops of white butter.',
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'bread-roti-missi',
    name: 'Rajasthani Golden Missi Roti',
    nameHI: 'राजस्थानी मिस्सी रोटी',
    category: 'Breads',
    priceINR: 69,
    isVeg: true,
    dietTags: ['Veg', 'Vegan', 'Gluten-Free'],
    spiceLevel: 1,
    isChefSpecial: false,
    isPopular: false,
    ingredients: 'Chana chickpea flour, organic wheat, roasted carom, chopped mint and coriander leaves.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=400'
  },

  // RICE (Biryani)
  {
    id: 'rice-biry-veg',
    name: 'Saffron Nizami Veg Biryani',
    nameHI: 'केसरिया निजामी वेज बिरयानी',
    category: 'Rice',
    priceINR: 599,
    isVeg: true,
    dietTags: ['Veg', 'Jain', 'Gluten-Free'],
    spiceLevel: 2,
    isChefSpecial: false,
    isPopular: false,
    ingredients: 'Aromatic aged Basmati grains layered with garden carrots, beans, rose water droplets, saffron stamens.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'rice-biry-chick',
    name: 'Murgh Dum Biryani Deccani',
    nameHI: 'शाही मुर्ग दम बिरयानी',
    category: 'Rice',
    priceINR: 749,
    isVeg: false,
    dietTags: ['Non-Veg'],
    spiceLevel: 2,
    isChefSpecial: true,
    isPopular: true,
    ingredients: 'Aged basmati rice, tender chicken pieces marinated in mint-cardamom yogurt, slow cooked under heavy flour seal.',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'rice-biry-mutt',
    name: 'Kachche Gosht Ki Shahi Biryani',
    nameHI: 'शाही कच्चे गोश्त की बिरयानी',
    category: 'Rice',
    priceINR: 899,
    isVeg: false,
    dietTags: ['Non-Veg'],
    spiceLevel: 3,
    isChefSpecial: true,
    isPopular: true,
    ingredients: 'Premium Basmati, raw goat mutton slices slow baked with ghee, brown crisp onions, screw-pine water extraction.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=400'
  },

  // DESSERTS
  {
    id: 'dess-gulab',
    name: 'Golden Saffron Gulab Jamun',
    nameHI: 'स्वर्ण केसरिया गुलाब जामुन',
    category: 'Desserts',
    priceINR: 249,
    isVeg: true,
    dietTags: ['Veg'],
    spiceLevel: 0,
    isChefSpecial: false,
    isPopular: true,
    ingredients: 'Condensed milk solid spheres fried in cow ghee, stuffed with pistachio bits, sweet cardamom syrup.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'dess-phirni',
    name: 'Kashmiri Rose Clay-Pot Phirni',
    nameHI: 'कश्मीरी गुलाब मिट्टी बर्तन फिरनी',
    category: 'Desserts',
    priceINR: 299,
    isVeg: true,
    dietTags: ['Veg', 'Gluten-Free'],
    spiceLevel: 0,
    isChefSpecial: false,
    isPopular: false,
    ingredients: 'Creamy hand-ground rice pudding infused with rose petals water, chilled inside natural earthen clay cups.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'dess-malpua',
    name: 'Pushkar Rabri Malpua Jugalbandi',
    nameHI: 'पुष्कर रबड़ी मालपुआ जुगलबंदी',
    category: 'Desserts',
    priceINR: 349,
    isVeg: true,
    dietTags: ['Veg'],
    spiceLevel: 0,
    isChefSpecial: true,
    isPopular: false,
    ingredients: 'Crispy fried semolina pancakes soaked in rose-cardamom sweet water, ladled with thick almond condensed rabri.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'dess-lava',
    name: 'Melted Chocolate Lava Crown',
    nameHI: 'चॉकलेट लावा केक शाही क्राउन',
    category: 'Desserts',
    priceINR: 449,
    isVeg: true,
    dietTags: ['Veg'],
    spiceLevel: 0,
    isChefSpecial: false,
    isPopular: true,
    ingredients: 'Warm cocoa dark sponge cake, liquid belgian chocolate core center, served with organic vanilla cream.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'dess-mithai-gold',
    name: 'Elite Mewari Shahi Mithai with 24K Gold',
    nameHI: 'एलीट मेवाड़ी स्वर्ण मिठाई २४-कैरेट',
    category: 'Desserts',
    priceINR: 599,
    isVeg: true,
    dietTags: ['Veg', 'Gluten-Free'],
    spiceLevel: 0,
    isChefSpecial: true,
    isPopular: true,
    ingredients: 'Pistachio and cashew royal fudge layers, silver dust, crowned with authentic 24-Karat edible gold foil sheets.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400'
  },

  // BEVERAGES
  {
    id: 'bev-juice',
    name: 'Fresh Orange Sun-Squeezed Juice',
    nameHI: 'ताजा संतरा रस प्राकृतिक',
    category: 'Beverages',
    priceINR: 249,
    isVeg: true,
    dietTags: ['Veg', 'Vegan', 'Gluten-Free'],
    spiceLevel: 0,
    isChefSpecial: false,
    isPopular: false,
    ingredients: 'Handpicked Nagpur orange citrus slices cold-pressed with zero added sugars.',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'bev-lassi',
    name: 'Mango Cardamom Royal Lassi',
    nameHI: 'आम इलायची शाही लस्सी',
    category: 'Beverages',
    priceINR: 199,
    isVeg: true,
    dietTags: ['Veg', 'Gluten-Free'],
    spiceLevel: 0,
    isChefSpecial: false,
    isPopular: true,
    ingredients: 'Alphanso organic mango pulp blended with premium yogurt, green cardamom seeds, served chilled.',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'bev-mocktail',
    name: 'Anjuman Sunset Sunrise Citrus Mocktail',
    nameHI: 'अंजुमन सनसेट संतरा मॉकटेल',
    category: 'Beverages',
    priceINR: 349,
    isVeg: true,
    dietTags: ['Veg', 'Vegan', 'Gluten-Free'],
    spiceLevel: 0,
    isChefSpecial: true,
    isPopular: false,
    ingredients: 'Fresh blood orange squeeze, lemon soda, fresh mint leaves, kaffir lime essence flavor.',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'bev-soft',
    name: 'Premium aerated Soft Drinks',
    nameHI: 'प्रीमियम कोला वातित सोडे',
    category: 'Beverages',
    priceINR: 99,
    isVeg: true,
    dietTags: ['Veg', 'Vegan', 'Gluten-Free'],
    spiceLevel: 0,
    isChefSpecial: false,
    isPopular: false,
    ingredients: 'Served chilled in pristine crystalline tumbler flutes with fresh lime garnish caps.',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400'
  }
];

// REPRESENTATION OF RESTAURANTS
const RESTAURANT_LIST = [
  {
    id: 'rest-nawab',
    name: 'NAWAB',
    nameHI: 'नवाब शाही भोजनशाला',
    desc: 'Ultra luxury fine-dining displaying age-old slow-cooked heritage Mughlai and Rajputana multi-cuisine delicacies.',
    descHI: 'भव्य और वैभवशाली बारीक सजा कढ़ाई वाला कक्ष जहां सदियों पुराने मुग़ल और राजपूताना व्यंजनों का आनंद लिया जा सकता है।',
    time: '7:00 PM - 11:00 PM IST',
    dress: 'Smart Royal Casuals / Sovereign Attire',
    price: '₹1,500 per cover',
    reservation: 'Reservation Mandatory',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'rest-terrace',
    name: 'THE TERRACE',
    nameHI: 'दि टेरेस रूफटॉप',
    desc: 'Breathtaking 360-degree panoramic overlook of Udaipur skyline, Pichola waters and palaces serving elite International cuisines.',
    descHI: 'उदयपुर पैलेस फव्वारों और पिछोला झील पर ३६० डिग्री का सुंदर विहंगम दृश्य प्रदान करने वाला रूफटॉप रेस्टोरेंट।',
    time: '12:00 PM - 11:00 PM IST',
    dress: 'Smart Casuals / Evening Chic',
    price: '₹1,200 per cover',
    reservation: 'Weekend Reservations Advised',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'rest-cafe',
    name: 'CAFÉ ANJUMAN',
    nameHI: 'कैफे अंजुमन २४ घंटे',
    desc: 'Magnificent all-day diner with interactive live pasta, south indian stations, family-friendly spaces and premium buffet setups.',
    descHI: 'अंजुमन का २४ घंटे खुला रहने वाला पारिवारिक डाइनिंग हॉल जहां भव्य बुफे नाश्ता और वैश्विक भोजन उपलब्ध है।',
    time: '7:00 AM - 12:00 AM IST',
    dress: 'Comfortable Cas',
    price: '₹600 per cover',
    reservation: 'Walk-ins Welcomed',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800'
  }
];

export default function DiningSection({ language }: DiningSectionProps) {
  // Navigation tabs, queries, filters
  const [activeCategory, setActiveCategory] = useState<'All' | 'Appetizers' | 'Mains' | 'Breads' | 'Rice' | 'Desserts' | 'Beverages'>('All');
  const [dietFilter, setDietFilter] = useState<'All' | 'Veg' | 'Non-Veg' | 'Jain' | 'Vegan' | 'Gluten-Free'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Table reserve state
  const [selectedRestId, setSelectedRestId] = useState('rest-nawab');
  const [tbName, setTbName] = useState('');
  const [tbContact, setTbContact] = useState('');
  const [tbDate, setTbDate] = useState('');
  const [tbTime, setTbTime] = useState('19:30');
  const [tbGuests, setTbGuests] = useState(2);
  const [tbOccasion, setTbOccasion] = useState(false);
  const [tbOccasionText, setTbOccasionText] = useState('Anniversary');
  const [tbRequests, setTbRequests] = useState('');
  const [reserveSuccess, setReserveSuccess] = useState('');

  // Real-Time Room Service Cart state
  const [cartItems, setCartItems] = useState<{ item: DiningItem; qty: number }[]>([]);
  const [deliveryRoom, setDeliveryRoom] = useState('anj-standard-deluxe');
  const [orderNotification, setOrderNotification] = useState('');
  const [orderCountdown, setOrderCountdown] = useState<number | null>(null);

  // Age Disclaimer for separate alcohol bar
  const [isAgeDisclVerified, setIsAgeDisclVerified] = useState(false);

  // Auto scroll to reservation anchor wrapper
  const handleBookTableTrigger = (restName: string) => {
    // autofill request
    setTbRequests(language === 'EN' ? `Table reservation request specifically for ${restName}. Preferably lakeside view alcove.` : `${restName} में झील किनारे का सुंदर टेबल स्थान प्राथमिकता पर रखें।`);
    const elem = document.getElementById('sovereign-reservation-booking-panel');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter Catalog algorithm
  const filteredCatalog = MASTER_MENU_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'All' ? true : item.category === activeCategory;
    
    // Diet filter match
    let matchesDiet = true;
    if (dietFilter !== 'All') {
      matchesDiet = item.dietTags.includes(dietFilter as any);
    }

    // Search query match
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameHI.includes(searchQuery) ||
      item.ingredients.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDiet && matchesSearch;
  });

  // Table Reservation Submission Handler
  const handleReserveTable = (e: FormEvent) => {
    e.preventDefault();
    if (!tbName || !tbContact || !tbDate) {
      alert(language === 'EN' ? 'Please supply contact ID name, phone & date targets!' : 'कृपया अपना नाम, नंबर एवं वांछित तिथि दर्ज करें।');
      return;
    }

    const restName = RESTAURANT_LIST.find(r => r.id === selectedRestId)?.name || 'NAWAB';
    const uniqueResCode = `RES-${Math.floor(1000 + Math.random() * 9000)}`;

    setReserveSuccess(
      language === 'EN'
        ? `✔ Crown Booking Accepted! Unique token code: ${uniqueResCode}. Confirmed with SMS & WhatsApp to ${tbContact} for ${tbGuests} companions on ${tbDate} at ${tbTime} inside ${restName}.`
        : `✔ आपका टेबल आरक्षण स्वीकृत हुआ! बुकिंग कोड: ${uniqueResCode} मोबाइल ${tbContact} पर एसएमएस और व्हाट्सएप द्वारा प्रेषित कर दिया गया है।`
    );

    // Reset fields
    setTimeout(() => {
      setReserveSuccess('');
      setTbName('');
      setTbContact('');
      setTbDate('');
      setTbRequests('');
    }, 8500);
  };

  // Room Service cart modifiers
  const addToCart = (item: DiningItem) => {
    setCartItems((prev) => {
      const existing = prev.find(entry => entry.item.id === item.id);
      if (existing) {
        return prev.map(entry => entry.item.id === item.id ? { ...entry, qty: entry.qty + 1 } : entry);
      }
      return [...prev, { item, qty: 1 }];
    });
  };

  const updateCartQty = (itemId: string, delta: number) => {
    setCartItems((prev) => {
      return prev.map((entry) => {
        if (entry.item.id === itemId) {
          const nextQty = entry.qty + delta;
          return nextQty > 0 ? { ...entry, qty: nextQty } : null;
        }
        return entry;
      }).filter(Boolean) as { item: DiningItem; qty: number }[];
    });
  };

  const clearCart = () => setCartItems([]);

  // Calculate cart costs
  const cartSubtotal = cartItems.reduce((acc, entry) => acc + (entry.item.priceINR * entry.qty), 0);
  const isMinimumReached = cartSubtotal >= 299;

  // Real room service order dispatch simulation
  const handleDispatchRoomService = () => {
    if (cartItems.length === 0) return;
    if (!isMinimumReached) {
      alert(language === 'EN' ? 'Minimum room service delivery limit counts ₹299.' : 'न्यूनतम ऑर्डर राशि ₹२९९ आवश्यक है।');
      return;
    }

    const targetRoomStr = deliveryRoom === 'anj-standard-deluxe' ? 'Standard Deluxe (Room 101)' : 
                          deliveryRoom === 'anj-premium-room' ? 'Premium Imperial Suite (Room 302)' : 'Presidential Panoramic Dome (Room 805)';

    setOrderNotification(
      language === 'EN'
        ? `✔ ORDER SECURED! Kitchen Chef notified. Delivering fresh meals to your ${targetRoomStr} in 30 minutes.`
        : `✔ ऑर्डर स्वीकृत हुआ! भोजन की ताजा खेप आपके कमरे ${targetRoomStr} में आगामी ३० मिनटों में प्रेषित की जा रही है।`
    );

    setOrderCountdown(30);
    clearCart();
  };

  useEffect(() => {
    let intv: any;
    if (orderCountdown !== null && orderCountdown > 0) {
      intv = setInterval(() => {
        setOrderCountdown(prev => (prev !== null && prev > 1) ? prev - 1 : null);
      }, 60000); // Reduce minute every 60s
    }
    return () => clearInterval(intv);
  }, [orderCountdown]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-12 text-brand-white" id="mewar-luxury-dining-module">
      
      {/* HEADER SECTION WITH HERO BANNER OVERLAY */}
      <div className="relative rounded-3xl overflow-hidden border border-brand-gold/30 bg-brand-black shadow-2xl p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[300px]" id="dining-palace-hero-panel">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1400')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/70 to-transparent" />
        
        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="text-brand-gold font-mono text-[9px] uppercase tracking-[0.25em] font-extrabold px-3 py-1 bg-brand-gold/10 border border-brand-gold/25 rounded-full inline-block">
            {language === 'EN' ? 'Elite royal gastronomy' : 'दरबार-ए-अंजुमन की पाक कला'}
          </span>
          <h1 className="font-serif text-3xl md:text-5xl tracking-wide text-brand-cream uppercase text-shadow">
            {language === 'EN' ? 'Shahi Heritage Dining & Room Service' : 'शाही मेवाड़ी सांस्कृतिक भोजन और कक्ष सेवा'}
          </h1>
          <p className="text-xs md:text-sm text-brand-cream/80 leading-relaxed font-sans font-medium">
            {language === 'EN' 
              ? 'Indulge in 5-star culinary mastery spanning award-winning slow-cooked tandoors, rooftop lake lookouts, organic local ingredients, and 24/7 sovereign room order deliveries.'
              : 'वैश्विक ५-सितारा रसोइयों द्वारा निर्मित मरोड़ी कबाब, सुप्रसिद्ध लाल मांस और केसरिया मिठाइयों की विस्तृत सुरम्य श्रृंखला कालखंड।'}
          </p>
        </div>
      </div>

      {/* =========================================
          SECTION 1: THE 3 PALACE RESTAURANTS OVERVIEW
          ========================================= */}
      <div className="space-y-6">
        <div className="border-b border-brand-gold/15 pb-2">
          <h2 className="font-serif text-xl tracking-wider text-brand-gold uppercase flex items-center gap-2">
            <Compass className="w-5 h-5" />
            <span>{language === 'EN' ? 'Our Three Sovereign Restaurants' : 'अंजुमन के ३ प्रमुख भव्य रेस्तरां'}</span>
          </h2>
          <p className="text-[10px] text-brand-cream/60 uppercase font-mono mt-0.5">
            {language === 'EN' ? 'Signature covers, dress codes, & times calibrated for your dignity' : 'समय, परिधान एवं आतिथ्य सत्कार विवरणी'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RESTAURANT_LIST.map((rest) => (
            <div key={rest.id} className="bg-[#0b0c15] border border-brand-gold/20 rounded-2xl overflow-hidden hover:border-brand-gold/40 transition-all flex flex-col justify-between group">
              <div className="relative h-44 overflow-hidden">
                <img src={rest.image} alt={rest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute top-3 left-3 bg-brand-navy/90 text-brand-gold font-mono text-[9px] font-bold px-2.5 py-1 rounded uppercase border border-brand-gold/20">
                  {rest.time}
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-serif text-lg tracking-wide text-brand-cream uppercase font-bold flex items-center justify-between">
                    <span>{language === 'EN' ? rest.name : rest.nameHI}</span>
                    <span className="text-[10px] text-brand-gold font-mono font-medium">{rest.price}</span>
                  </h3>
                  <p className="text-xs text-brand-cream/75 leading-relaxed font-sans">
                    {language === 'EN' ? rest.desc : rest.descHI}
                  </p>
                </div>

                {/* Sub features details list */}
                <div className="space-y-1.5 pt-2 border-t border-brand-gold/10 text-[10px] text-brand-cream/60 font-mono">
                  <span className="block">👔 Dress Limit: <strong className="text-brand-cream">{rest.dress}</strong></span>
                  <span className="block font-semibold text-brand-gold">📢 {rest.reservation}</span>
                </div>

                <button 
                  onClick={() => {
                    setSelectedRestId(rest.id);
                    handleBookTableTrigger(rest.name);
                  }}
                  className="w-full py-2 bg-brand-navy hover:bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[9px] uppercase font-bold tracking-widest rounded transition-colors cursor-pointer"
                >
                  {language === 'EN' ? 'Reserve Shahi Table' : 'स्थान आरक्षित करें'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================
          SECTION 2: THE ANJUMAN DAILY BUFFETS MATRIX
          ========================================= */}
      <div className="bg-brand-navy/40 border border-brand-gold/20 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-brand-gold/5 to-transparent pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-brand-gold/10 pb-4">
          <div>
            <span className="text-[9px] text-[#A1BBA1] font-bold uppercase tracking-widest block font-mono">Premium Gastronomic Feast</span>
            <h3 className="font-serif text-lg text-brand-gold uppercase tracking-wider flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-brand-gold" />
              <span>{language === 'EN' ? 'Daily Imperial Buffet Calendars' : 'शाही अनलिमिटेड दैनिक बुफे उत्सव'}</span>
            </h3>
          </div>
          <span className="text-center sm:text-right text-[10px] text-brand-cream/50 uppercase font-mono">No bookings required for buffets • Kids Half Charge</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Breakfast Buffet', time: '7:00 AM - 11:00 AM', price: '₹899+', perks: 'Cold cuts, organic fruits, active South Indian station', cls: 'border-slate-500/20' },
            { title: 'Royal Lunch Buffet', time: '1:00 PM - 3:00 PM', price: '₹1,299+', perks: 'Biryanis, Ker Sangri, multi-cuisine cold bar platters', cls: 'border-indigo-500/25' },
            { title: 'Grande Dinner Feast', time: '7:30 PM - 10:30 PM', price: '₹1,599+', perks: 'Laal Maas mutton live, gold-leaf desserts, Live Sitar', cls: 'border-[#c19a4e]/20' },
            { title: 'Weekend Special Brunch', time: 'Sat-Sun All day', price: '₹1,999+', perks: 'Mewar special organic venisons, wines, poolside seats', cls: 'border-[#ffce54]/30' }
          ].map((buf, idx) => (
            <div key={idx} className={`bg-[#02020a]/60 border rounded-xl p-4 space-y-2 flex flex-col justify-between ${buf.cls}`}>
              <div className="space-y-1">
                <span className="text-xs text-brand-white font-bold uppercase tracking-wide block">{buf.title}</span>
                <span className="text-[9px] text-brand-gold font-mono block">{buf.time}</span>
                <p className="text-[10px] text-brand-cream/60 leading-snug">{buf.perks}</p>
              </div>
              <div className="pt-2 border-t border-brand-gold/10 flex justify-between items-center">
                <span className="text-[9px] text-[#ccd5e0] uppercase font-mono">Price Net:</span>
                <span className="font-serif text-sm text-brand-gold font-black">{buf.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================
          SECTION 3: INTERACTIVE EXPANSIVE MENU CATALOG
          ========================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* CATALOG COLUMN (8 Columns Wide) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-[#0b0c15] border border-brand-gold/20 rounded-2xl p-5 md:p-6 space-y-4 shadow-xl">
            
            {/* SEARCH AND DIET FILTERS ROW */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
              
              <div className="relative w-full sm:w-64">
                <input 
                  type="text" 
                  className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-1.5 pl-8 pr-3 text-xs text-brand-cream placeholder-brand-white/30 focus:outline-none focus:border-brand-gold"
                  placeholder={language === 'EN' ? 'Search tikka, rogan josh, paneer...' : 'खोजें: टिक्का, पनीर, बिरयानी...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="w-3.5 h-3.5 text-brand-gold/50 absolute left-2.5 top-2.5" />
              </div>

              {/* Tag filters bar */}
              <div className="flex flex-wrap gap-1.5 justify-center">
                {(['All', 'Veg', 'Non-Veg', 'Jain', 'Vegan', 'Gluten-Free'] as const).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setDietFilter(tag)}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full cursor-pointer transition-colors border ${
                      dietFilter === tag 
                        ? 'bg-brand-gold text-brand-black border-brand-gold' 
                        : 'bg-brand-black border-brand-gold/15 text-[#ccd5e0] hover:border-brand-gold/40'
                    }`}
                  >
                    <span>{tag}</span>
                    {tag === 'Veg' && ' 🟢'}
                    {tag === 'Non-Veg' && ' 🔴'}
                  </button>
                ))}
              </div>

            </div>

            {/* CATEGORY TABS RULER */}
            <div className="flex overflow-x-auto gap-2 pb-2 pr-2 custom-scroll border-t border-brand-gold/10 pt-4">
              {(['All', 'Appetizers', 'Mains', 'Breads', 'Rice', 'Desserts', 'Beverages'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg cursor-pointer transition-all whitespace-nowrap shrink-0 border ${
                    activeCategory === cat 
                      ? 'bg-gold-gradient text-brand-navy border-transparent font-black shadow-md' 
                      : 'bg-brand-black/40 border-brand-gold/10 text-brand-cream/70 hover:bg-brand-gold/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* MENUS DENSE GRID */}
          {filteredCatalog.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="shahi-filterable-menu-grid">
              {filteredCatalog.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-[#0b0c15] border border-brand-gold/15 hover:border-brand-gold/40 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group h-full transition-all"
                >
                  <div className="relative h-44 overflow-hidden bg-brand-navy">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Floating indicators */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                      {item.isChefSpecial && (
                        <span className="px-2 py-0.5 bg-brand-gold text-brand-black text-[8px] font-black uppercase rounded shadow-md tracking-wider flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> Chef Special
                        </span>
                      )}
                      {item.isPopular && (
                        <span className="px-2 py-0.5 bg-indigo-600 text-white text-[8px] font-black uppercase rounded shadow-md tracking-wider">
                          Bestseller
                        </span>
                      )}
                    </div>

                    <span className="absolute bottom-3 right-3 bg-brand-black/85 text-brand-gold font-serif text-xs font-bold px-2.5 py-1 rounded-full border border-brand-gold/20 shadow-md">
                      ₹{item.priceINR}
                    </span>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-serif text-[15px] text-brand-white font-medium group-hover:text-brand-gold transition-colors">
                          {language === 'EN' ? item.name : item.nameHI}
                        </h4>
                        
                        {/* Diet standard dot marker */}
                        <div className={`p-0.5 border rounded-sm shrink-0 ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                          <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                        </div>
                      </div>

                      {/* Highlighted Ingredients in description */}
                      <p className="text-[11px] text-brand-cream/70 leading-relaxed font-sans min-h-[48px]">
                        {item.ingredients}
                      </p>

                      {/* Spice indicator metric */}
                      {item.spiceLevel > 0 && (
                        <div className="flex items-center gap-1 text-[10px]">
                          <span className="text-brand-cream/50">Spiciness:</span>
                          <span className="flex">
                            {Array.from({ length: item.spiceLevel }).map((_, i) => (
                              <span key={i} className="text-red-500 text-xs">🌶️</span>
                            ))}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-brand-gold/10 flex items-center justify-between text-[10px]">
                      <div className="flex flex-wrap gap-1">
                        {item.dietTags.map((t) => (
                          <span key={t} className="px-2 py-0.5 bg-brand-black text-[8px] border border-brand-gold/10 text-brand-cream/80 rounded font-mono uppercase">{t}</span>
                        ))}
                      </div>

                      <button 
                        onClick={() => addToCart(item)}
                        className="p-1.5 px-3 bg-brand-gold hover:bg-brand-cream text-brand-black font-extrabold uppercase rounded-lg flex items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>add</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-brand-gold/20 rounded-2xl bg-[#0b0c15] text-xs text-brand-cream/60">
              <Utensils className="w-8 h-8 text-brand-gold/30 mx-auto mb-2.5" />
              <p>No magnificent heritage recipes correspond to your query criteria.</p>
            </div>
          )}

          {/* SEPARATE SECTION: ALCOHOLIC PEV BAR (Age Limit verification) */}
          <div className="bg-[#0b0c15] border border-brand-gold/20 rounded-2xl p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2 justify-between border-b border-brand-gold/10 pb-2.5">
              <span className="text-xs text-red-400 font-bold uppercase tracking-widest block font-mono">⚠️ STRICT AGE 21+ MINIMUM DISCLAIMER</span>
              <span className="px-2 py-0.5 bg-red-950/40 text-red-400 text-[8px] font-bold rounded uppercase border border-red-900/10">GOVERNMENT REGULATED</span>
            </div>

            <p className="text-[10px] text-brand-cream/65 leading-relaxed">
              Alcoholic beverages, vintage scotch collections, organic liquors, and champagne wines are strictly delivered matching age verification on legal IDs only.
            </p>

            {isAgeDisclVerified ? (
              <div className="p-4 bg-brand-navy/40 border border-brand-gold/15 rounded-xl space-y-3 animate-fade-in">
                <span className="text-[10px] text-brand-gold font-bold block">ROYAL MEWAR ALCOHOL CATALOG (Prices on Request)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold block text-brand-cream">🍾 Sula Cabernet Shiraz Red Wine</span>
                    <p className="text-[10px] text-brand-cream/60">Rich local grape fermentation with vintage berry flavors.</p>
                  </div>
                  <div>
                    <span className="font-bold block text-brand-cream">🍹 Rajput Heritage Shahi Gin Punch</span>
                    <p className="text-[10px] text-brand-cream/60">Saffron, cardamom dust, and triple-distilled English dry gin.</p>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAgeDisclVerified(true)}
                className="py-1.5 px-4 bg-red-950/30 hover:bg-red-950/60 text-red-300 font-bold uppercase text-[9px] tracking-widest border border-red-800/20 rounded-lg cursor-pointer"
              >
                I verify I am 21+ Years Old to view Alcohol Drinks
              </button>
            )}
          </div>

        </div>

        {/* 24/7 ROOM SERVICE SIDEBAR CART TRAY (4 Columns Wide) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-[#0b0c15] border border-brand-gold/25 rounded-2xl p-5 space-y-4 shadow-xl text-xs sticky top-4">
            
            <div className="flex justify-between items-center border-b border-brand-gold/15 pb-2">
              <div>
                <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-widest font-mono block">Connected to Suites</span>
                <h3 className="font-serif text-sm text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingCart className="w-4 h-4 text-brand-gold" />
                  <span>{language === 'EN' ? 'Room Order Tray' : 'कक्ष सेवा डिलीवरी ट्रे'}</span>
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-emerald-950/30 text-emerald-400 text-[8px] font-bold border border-emerald-900/10 rounded font-mono uppercase">24/7 OPEN</span>
            </div>

            <p className="text-[10px] text-brand-cream/60 leading-relaxed font-sans">
              Order premium freshly-fired creations in matching hot cases delivered to your Udaipur suite room in <strong>30-45 minutes</strong>.
            </p>

            {/* Room delivery details select dropdown */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[9px] uppercase font-bold text-brand-cream tracking-wider block">Deliver To Active Suite Room*</label>
              <select 
                className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream focus:outline-none"
                value={deliveryRoom}
                onChange={(e) => setDeliveryRoom(e.target.value)}
              >
                <option value="anj-standard-deluxe">Standard Deluxe Suite (Room 101)</option>
                <option value="anj-premium-room">Premium Heritage Room (Room 302)</option>
                <option value="anj-royal-suite">Presidential Lake Suite (Room 805)</option>
              </select>
            </div>

            {/* Simulated Live Orders Alerts countdown */}
            {orderNotification && (
              <div className="p-3.5 bg-indigo-950/50 border border-indigo-500/20 text-indigo-200 rounded-lg animate-pulse">
                <span>{orderNotification}</span>
                {orderCountdown !== null && (
                  <span className="block font-mono font-bold text-brand-gold text-[9px] mt-1 text-center">⏱ SIMULATED REST TIME: {orderCountdown} MINS</span>
                )}
              </div>
            )}

            {/* Tray items loops */}
            {cartItems.length > 0 ? (
              <div className="space-y-3 pt-2">
                <span className="text-[9px] text-brand-gold font-bold uppercase tracking-widest block border-b border-brand-gold/10 pb-1">Tray Breakdown</span>
                
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                  {cartItems.map((entry) => (
                    <div key={entry.item.id} className="flex justify-between items-center text-[11px] bg-[#02020a]/40 p-2 rounded border border-brand-gold/5">
                      <div className="space-y-0.5">
                        <span className="font-medium text-brand-white block">{language === 'EN' ? entry.item.name : entry.item.nameHI}</span>
                        <span className="text-brand-gold font-mono font-bold text-[10px]">₹{entry.item.priceINR * entry.qty}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateCartQty(entry.item.id, -1)} className="w-5 h-5 bg-brand-navy border border-brand-gold/20 text-brand-gold rounded font-bold flex items-center justify-center">-</button>
                        <span className="font-mono text-[11px] font-bold w-4 text-center">{entry.qty}</span>
                        <button onClick={() => updateCartQty(entry.item.id, 1)} className="w-5 h-5 bg-brand-navy border border-brand-gold/20 text-brand-gold rounded font-bold flex items-center justify-center">+</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals and totals calculations */}
                <div className="space-y-1.5 border-t border-brand-gold/10 pt-3 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-brand-cream/60">Subtotal</span>
                    <span className="font-mono">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-cream/60">Delivery Fee (VIP)</span>
                    <span className="text-emerald-400 font-mono uppercase font-bold">₹0 Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-xs border-t border-brand-gold/10 pt-1.5 text-brand-gold">
                    <span>Order Total</span>
                    <span className="font-mono">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Minimum Order Verification checks */}
                {!isMinimumReached && (
                  <div className="p-2 bg-red-950/30 border border-red-500/20 text-red-300 text-[9px] rounded flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>Tray total must reach ₹299 to dispatch. Add ₹{299 - cartSubtotal} more.</span>
                  </div>
                )}

                <div className="pt-2 grid grid-cols-2 gap-2 text-[9px] font-bold uppercase tracking-wider">
                  <button onClick={clearCart} className="py-2 border border-brand-gold/20 text-brand-cream rounded hover:bg-brand-gold/5 cursor-pointer">clear</button>
                  <button 
                    onClick={handleDispatchRoomService} 
                    disabled={!isMinimumReached}
                    className="py-2 bg-gold-gradient text-brand-navy rounded hover:brightness-110 cursor-pointer disabled:opacity-45"
                  >
                    Place Order
                  </button>
                </div>

              </div>
            ) : (
              <div className="text-center py-8 bg-brand-black/45 rounded-xl border border-dashed border-brand-gold/15 text-brand-cream/60">
                <ShoppingCart className="w-7 h-7 text-brand-gold/20 mx-auto mb-2" />
                <span>Your room service tray is currently empty. Add tasty cuisines to begin room service.</span>
              </div>
            )}

          </div>

          {/* SIDE INFORMATION CARD: PRIVATE SARANGI MUSIC PERFORMANCE */}
          <div className="p-5 bg-gradient-to-br from-brand-navy to-brand-black border border-brand-gold/20 rounded-2xl text-center space-y-2">
            <span className="text-[8px] text-brand-gold font-mono uppercase tracking-[0.2em] block font-bold">★ PRIVATE MUSICAL RECEPTION ★</span>
            <span className="font-serif text-sm text-brand-white block">Exclusive Sitar Performance</span>
            <p className="text-[10px] text-brand-cream/70 leading-relaxed font-sans mt-1">
              Dignitaries staying inside our Presidential Suites can request classic sitar performers directly inside rooms during dessert periods. Dial extension *9.
            </p>
          </div>

        </div>

      </div>

      {/* =========================================
          SECTION 4: HIGH FIDELITY TABLE RESERVATION PANEL
          ========================================= */}
      <div className="bg-[#0b0c15] border border-brand-gold/25 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative" id="sovereign-reservation-booking-panel">
        
        <div className="border-b border-brand-gold/15 pb-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[9px] text-[#A1BBA1] font-bold uppercase tracking-widest block font-mono">ESTABLISH TABLE RESERVATION</span>
            <h3 className="font-serif text-2xl text-brand-cream uppercase tracking-wider flex items-center gap-2">
              <Utensils className="w-6 h-6 text-brand-gold" />
              <span>{language === 'EN' ? 'Elite Table Reservation System' : 'शाही पैविलियन व डाइनिंग टेबल आरक्षक प्रणाली'}</span>
            </h3>
            <p className="text-xs text-brand-cream/60 leading-relaxed font-sans mt-0.5">
              Available lunch and twilight dinner slots verified instantly with SMS text confirmations 24/7.
            </p>
          </div>
          <p className="text-[10px] text-brand-cream/50 uppercase font-mono tracking-widest">Secure Seat • No payment required today</p>
        </div>

        {reserveSuccess && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl flex items-center gap-3 animate-pulse">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold block">RESERVATION CONCIERGE ASSIGNED</span>
              <p className="mt-0.5">{reserveSuccess}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleReserveTable} className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          <div className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase font-bold tracking-widest text-brand-cream block">Target Restaurant Pavilion*</label>
              <select 
                className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2.5 px-3 text-xs text-brand-cream focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                value={selectedRestId}
                onChange={(e) => setSelectedRestId(e.target.value)}
              >
                {RESTAURANT_LIST.map((rest) => (
                  <option key={rest.id} value={rest.id}>{rest.name} - ({rest.time})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase font-bold tracking-widest text-brand-cream block">Dining Date (IST)*</label>
                <input 
                  type="date" required
                  className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream focus:border-brand-gold font-sans"
                  value={tbDate}
                  onChange={(e) => setTbDate(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase font-bold tracking-widest text-brand-cream block">Time Slot Frame*</label>
                <select 
                  className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2.5 px-3 text-xs text-brand-cream focus:border-brand-gold focus:outline-none"
                  value={tbTime}
                  onChange={(e) => setTbTime(e.target.value)}
                >
                  <option value="12:30">12:30 PM (Lunch)</option>
                  <option value="13:30">01:30 PM (Lunch)</option>
                  <option value="19:00">07:00 PM (Dinner)</option>
                  <option value="19:30">07:30 PM (Dinner)</option>
                  <option value="20:00">08:00 PM (Dinner)</option>
                  <option value="20:30">08:30 PM (Dinner)</option>
                  <option value="21:15">09:15 PM (Slow Dinner)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] uppercase font-bold tracking-widest text-brand-cream block">Guests Count (Covers)*</label>
              <select 
                className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2.5 px-3 text-xs text-brand-cream focus:border-brand-gold"
                value={tbGuests}
                onChange={(e) => setTbGuests(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Guest Companion' : 'Guest Companions'}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase font-bold tracking-widest text-brand-cream block">Guest Representative Name*</label>
              <input 
                type="text" required
                className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream focus:border-brand-gold"
                placeholder="e.g. Maharaja Jagdish Walke"
                value={tbName}
                onChange={(e) => setTbName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] uppercase font-bold tracking-widest text-brand-cream block">Mobile (+91 Indian format)*</label>
              <input 
                type="tel" required
                className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream focus:border-brand-gold"
                placeholder="+91 99999 88888"
                value={tbContact}
                onChange={(e) => setTbContact(e.target.value)}
              />
            </div>

            <div className="p-3 bg-brand-navy/30 border border-brand-gold/10 rounded-lg space-y-2 select-none">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-brand-gold">
                <input 
                  type="checkbox" 
                  className="accent-brand-gold" 
                  checked={tbOccasion}
                  onChange={(e) => setTbOccasion(e.target.checked)}
                />
                <span>Celebrate Special Occasion?</span>
              </label>

              {tbOccasion && (
                <div className="grid grid-cols-2 gap-2 text-[10px] animate-fade-in text-brand-cream">
                  {['Anniversary', 'Birthday', 'Proposal', 'Business Deal'].map((occ) => (
                    <label key={occ} className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="radio" 
                        name="occ-radio-btn"
                        className="accent-brand-gold"
                        checked={tbOccasionText === occ}
                        onChange={() => setTbOccasionText(occ)}
                      />
                      <span>{occ}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="space-y-4 flex flex-col justify-between">
            
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase font-bold tracking-widest text-brand-cream block">Special Requests & Saffron Spice Dietary Notes</label>
              <textarea 
                className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream focus:border-brand-gold focus:outline-none min-h-[96px] resize-none"
                placeholder="e.g. Lakeside window table alcove, child-friendly high-chairs request, organic saffron spices note."
                value={tbRequests}
                onChange={(e) => setTbRequests(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4.5 bg-gold-gradient text-brand-black text-xs font-black uppercase tracking-widest rounded-xl transition-transform hover:brightness-110 active:scale-95 shadow-lg flex items-center justify-center gap-1 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Reserve Shahi Seat ➔</span>
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
