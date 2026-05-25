import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Booking, UserSession } from '../types';
import { LUXURY_ROOMS } from '../data';
import { 
  User, 
  Calendar, 
  Award, 
  Heart, 
  History, 
  Bell, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Trash2, 
  Printer, 
  QrCode, 
  Edit3, 
  Lock, 
  ShieldAlert, 
  Clock, 
  Sparkles,
  ChevronRight,
  Gift,
  HelpCircle,
  Smartphone,
  Check,
  FileText
} from 'lucide-react';

interface DashboardProps {
  user: UserSession;
  language: 'EN' | 'HI';
  onLogout: () => void;
  onGoToBooking: () => void;
}

const CHAUFFEUR_STEPS = [
  'Royal Surtout Prepared',
  'Preparing Saffron Welcome High Tea',
  'Rolls Royce Phantom Chauffeur en Route',
  'Sanctuary Keycard Encoded',
  'Butler Assigned & Prepared'
];

const CHAUFFEUR_STEPS_HI = [
  'शाही शिष्टाचार सुसज्जित किया गया है',
  'केसरिया स्वागत हाई टी तैयारी शुरू',
  'शाही रोल्स रॉयस शटल प्रस्थान हेतु सज्ज',
  'सुरक्षित सुइट चाबी कोडित कर दी गई है',
  'निजी बटलर आपके लिए समर्पित व तैनात'
];

interface LoyaltyLog {
  id: string;
  description: string;
  pts: number;
  type: 'earned' | 'redeemed';
  date: string;
}

export default function Dashboard({ user, language, onLogout, onGoToBooking }: DashboardProps) {
  // Sidebar states: 'profile' | 'bookings' | 'rewards' | 'wishlist' | 'history' | 'notifications' | 'settings'
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'rewards' | 'wishlist' | 'history' | 'notifications' | 'settings'>('profile');
  
  // Local lists
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['royal_suite', 'maharani_suite']);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(1000);
  const [loyaltyTier, setLoyaltyTier] = useState<string>('Silver');
  const [loyaltyLogs, setLoyaltyLogs] = useState<LoyaltyLog[]>([]);
  const [notifications, setNotifications] = useState<string[]>([
    'Welcome Privilege: 1,000 complimentary loyalty starter points have been successfully uploaded to your treasury.',
    'Royal pickup scheduled: Your luxury chauffeured Rolls Royce Phantom coordinate is updated for Lake Pichola port.',
    'Saffron high tea concierge briefing: Our kitchen has logged your organic saffron diet notes for morning sunrise.',
  ]);

  // Animated butler trackers
  const [butlerIndex, setButlerIndex] = useState(0);

  // Profile Edit fields
  const [profFullName, setProfFullName] = useState(user.fullName);
  const [profEmail, setProfEmail] = useState(user.email);
  const [profPhone, setProfPhone] = useState(user.phone);
  const [profDob, setProfDob] = useState('1990-05-15');
  const [profAnniversary, setProfAnniversary] = useState('2018-12-25');
  const [profPhotoUrl, setProfPhotoUrl] = useState<string | null>(null);
  const [profPassCurrent, setProfPassCurrent] = useState('password123');
  const [profPassNew, setProfPassNew] = useState('');
  const [profPassConfirm, setProfPassConfirm] = useState('');
  const [prefNotifySms, setPrefNotifySms] = useState(true);
  const [prefNotifyEmail, setPrefNotifyEmail] = useState(true);

  // Settings Configuration states
  const [sessionExpiry, setSessionExpiry] = useState<number>(30); // minutes
  const [csrfProtection, setCsrfProtection] = useState<boolean>(true);

  // Action responses feedback notifications
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Active Booking reference popup QR
  const [activeQrBooking, setActiveQrBooking] = useState<Booking | null>(null);

  // Initialize and load
  useEffect(() => {
    // Bookings
    const bRaw = localStorage.getItem('anjuman_bookings');
    if (bRaw) {
      setBookings(JSON.parse(bRaw));
    } else {
      // Create a default initial booking if empty to populate the dashboard!
      const initialBook: Booking = {
        id: 'ANJ-2026-88019',
        roomId: 'royal_suite',
        roomName: 'Presidential Lake Suite',
        checkIn: '2026-06-12',
        checkOut: '2026-06-15',
        guests: 2,
        totalPrice: 182810,
        status: 'confirmed',
        bookedAt: new Date().toISOString()
      };
      localStorage.setItem('anjuman_bookings', JSON.stringify([initialBook]));
      setBookings([initialBook]);
    }

    // Loyalty points
    const lpRaw = localStorage.getItem('anjuman_loyalty_points');
    if (lpRaw) {
      setLoyaltyPoints(Number(lpRaw));
    } else {
      localStorage.setItem('anjuman_loyalty_points', '1000');
    }

    // Loyalty history logs
    const lhRaw = localStorage.getItem('anjuman_loyalty_history');
    if (lhRaw) {
      setLoyaltyLogs(JSON.parse(lhRaw));
    } else {
      const initialLogs: LoyaltyLog[] = [
        { id: 'AC-1', description: 'Elite Membership Welcome Gift', pts: 1000, type: 'earned', date: '25/05/2026' }
      ];
      localStorage.setItem('anjuman_loyalty_history', JSON.stringify(initialLogs));
      setLoyaltyLogs(initialLogs);
    }

    // Wishlist
    const wlRaw = localStorage.getItem('anjuman_wishlist');
    if (wlRaw) {
      setWishlist(JSON.parse(wlRaw));
    } else {
      localStorage.setItem('anjuman_wishlist', JSON.stringify(['royal_suite', 'maharani_suite']));
    }

    // Butler interval rotation loop
    const intv = setInterval(() => {
      setButlerIndex((prev) => (prev + 1) % CHAUFFEUR_STEPS.length);
    }, 8000);

    return () => clearInterval(intv);
  }, []);

  // Update profile handler
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    if (!profFullName || !profEmail || !profPhone) {
      setProfileError('Mandated name, email, and phone contact details are strictly required.');
      return;
    }

    // Change password update
    if (profPassNew) {
      if (profPassNew.length < 8) {
        setProfileError('The new secret passkey must contain at least 8 characters.');
        return;
      }
      if (profPassNew !== profPassConfirm) {
        setProfileError('The new password verification and new password targets do not match.');
        return;
      }
      setProfPassCurrent(profPassNew);
      setProfPassNew('');
      setProfPassConfirm('');
    }

    // Save updated user data
    const updatedUser: UserSession = {
      ...user,
      fullName: profFullName,
      email: profEmail,
      phone: profPhone
    };
    localStorage.setItem('anjuman_user', JSON.stringify(updatedUser));
    
    setProfileSuccess('✔ Royal profile details revised successfully inside Mewar registries.');
    setTimeout(() => setProfileSuccess(''), 4000);
  };

  // Modify dynamic check-in check-out dates of an active booking
  const handleModifyBookingDates = (bId: string) => {
    const dCheckIn = window.prompt(language === 'EN' ? 'Enter new Check-in date (YYYY-MM-DD):' : 'नई चेक-इन प्रविष्ट करें (YYYY-MM-DD):', '2026-06-14');
    const dCheckOut = window.prompt(language === 'EN' ? 'Enter new Check-out date (YYYY-MM-DD):' : 'नई चेक-आउट प्रविष्ट करें (YYYY-MM-DD):', '2026-06-17');
    
    if (dCheckIn && dCheckOut) {
      const updated = bookings.map((b) => {
        if (b.id === bId) {
          return { ...b, checkIn: dCheckIn, checkOut: dCheckOut };
        }
        return b;
      });
      localStorage.setItem('anjuman_bookings', JSON.stringify(updated));
      setBookings(updated);
      alert(language === 'EN' ? '✔ Chronology modifications verified successfully.' : '✔ तिथियों का संशोधन सफलतापूर्वक स्वीकृत हुआ।');
    }
  };

  // Cancel reservation with refund details calculations
  const handleCancelStay = (bId: string) => {
    const confirmation = window.confirm(
      language === 'EN' 
        ? 'Are you certain you wish to cancel this booking? Policy: 100% refund applies if cancelled >48 hours in advance, 50% refund on 24-48 hours.'
        : 'क्या आप इस आरक्षण को निरस्त करना चाहते हैं? निरस्तीकरण नीति के अनुसार राशि वापस की जाएगी।'
    );

    if (confirmation) {
      const updated = bookings.map((b) => {
        if (b.id === bId) {
          return { ...b, status: 'cancelled' as const };
        }
        return b;
      });
      localStorage.setItem('anjuman_bookings', JSON.stringify(updated));
      setBookings(updated);

      // Add notification update
      setNotifications(prev => [
        `Cancellation Secured: Booking ${bId} was successfully retracted. Advanced deposit refund is routed back to source treasury.`,
        ...prev
      ]);
      
      // Reduce loyalty points slightly or log cancellation
      const alertLog: LoyaltyLog = {
        id: `CN-${Math.floor(100+Math.random()*900)}`,
        description: `Retracted stay compensation log: ${bId}`,
        pts: 0,
        type: 'redeemed',
        date: '25/05/2026'
      };
      const existingLogs = [...loyaltyLogs, alertLog];
      localStorage.setItem('anjuman_loyalty_history', JSON.stringify(existingLogs));
      setLoyaltyLogs(existingLogs);
    }
  };

  // Manage Wishlist deletion/add
  const handleRemoveWishlist = (rId: string) => {
    const nextArr = wishlist.filter(id => id !== rId);
    localStorage.setItem('anjuman_wishlist', JSON.stringify(nextArr));
    setWishlist(nextArr);
  };

  // Add loyalty points redemption mockup (deducts 500pts -> gives ₹5,000 stay coupon)
  const handleRedeemPointsCoupon = () => {
    if (loyaltyPoints < 500) {
      alert(language === 'EN' ? 'Overdue! You require at least 500 points to claim a royal stay coupon voucher.' : 'अपरियाप्त पॉइंट! कूपन रिडीम करने के लिए न्यूनतम ५०० पॉइंट्स आवश्यक हैं।');
      return;
    }
    const nextPts = loyaltyPoints - 500;
    setLoyaltyPoints(nextPts);
    localStorage.setItem('anjuman_loyalty_points', String(nextPts));

    // Update Logs
    const newLog: LoyaltyLog = {
      id: `RD-${Math.floor(100+Math.random()*900)}`,
      description: 'Redeemed 500 Privilege Points for ₹5,000 Suite Coupon',
      pts: 500,
      type: 'redeemed',
      date: '25/05/2026'
    };
    const nextLogs = [newLog, ...loyaltyLogs];
    localStorage.setItem('anjuman_loyalty_history', JSON.stringify(nextLogs));
    setLoyaltyLogs(nextLogs);

    // Alert user
    alert(language === 'EN' 
      ? '✔ Sovereign Rewards code claimed! Your unique luxury stay code: "RAJASTHAN2026" is verified with ₹5,000 credit limit.' 
      : '✔ पॉइंट भुनाए गए! आपका नया लक्जरी वाउचर सुइट रिडेम्पशन के लिए जारी किया गया है।'
    );
  };

  // Add simulated profile photo upload
  const handleDashboardPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfPhotoUrl(reader.result as string);
        alert(language === 'EN' ? '✔ Profile photo updated successfully' : '✔ प्रोफाइल फ़ोटो सफलतापूर्वक बदला गया।');
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 text-brand-white" id="mewar-sovereign-guest-dashboard">
      
      {/* 1. UPPER GOLD BANNER OVERVIEW PROFILE CARD */}
      <div className="bg-gradient-to-r from-brand-navy via-brand-black to-brand-navy border border-brand-gold/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-3xl relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-radial-gradient from-brand-gold/5 to-transparent pointer-events-none" />
        
        {/* Guest credentials row */}
        <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10 text-center sm:text-left">
          <div className="relative group cursor-pointer">
            <div className="w-20 h-20 rounded-full border-2 border-brand-gold bg-brand-black flex items-center justify-center overflow-hidden shadow-xl">
              {profPhotoUrl ? (
                <img src={profPhotoUrl} alt="custom-p" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <span className="font-serif text-3xl font-bold text-brand-gold">{user.fullName.charAt(0)}</span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-1.5 bg-brand-gold text-brand-black rounded-full cursor-pointer hover:scale-110 shadow-lg">
              <Plus className="w-3.5 h-3.5" />
              <input type="file" accept="image/*" className="hidden" onChange={handleDashboardPhotoChange} />
            </label>
          </div>

          <div>
            <span className="text-[9px] px-2.5 py-0.5 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 font-bold uppercase tracking-[0.2em] rounded-full inline-flex items-center gap-1 mb-2">
              <Award className="w-3.5 h-3.5" />
              {loyaltyTier} {language === 'EN' ? 'Privilege Holder' : 'विशिष्ठ शाही सदस्य'}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl tracking-wide text-brand-white uppercase">
              {profFullName}
            </h2>
            <p className="text-xs text-brand-cream/80 font-mono mt-0.5">
              📧 {profEmail} •  📞 {profPhone}
            </p>
          </div>
        </div>

        {/* Dynamic points & tier details widget */}
        <div className="flex items-center gap-4 bg-brand-black/40 border border-brand-gold/15 p-4 rounded-xl relative z-10 shrink-0 select-none">
          <div className="text-center bg-brand-navy/60 p-2.5 px-4 rounded-lg border border-brand-gold/10">
            <span className="text-[8px] text-brand-cream/60 uppercase tracking-widest block font-bold">{language === 'EN' ? 'Privilege Points' : 'पॉइंट्स बैलेंस'}</span>
            <span className="font-serif text-2xl text-brand-gold font-extrabold">{loyaltyPoints}</span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-400 font-bold block">✔ SILVER REWARDS UNLOCKED</span>
            <span className="text-[9px] text-brand-cream/60 block mt-0.5">Next Tier: Gold (5k pts)</span>
            
            {/* Tier Progress bar indicator */}
            <div className="w-32 h-1.5 bg-brand-navy border border-brand-gold/10 rounded-full overflow-hidden mt-1 inline-block">
              <div className="h-full bg-brand-gold" style={{ width: `${Math.min((loyaltyPoints / 5000) * 100, 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. DOKO GRID LAYOUT: SIDEBAR ON LEFT, CONTENT TABS ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SIDE BAR NAVIGATION COLUMNS */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#0b0c15] border border-brand-gold/25 rounded-2xl p-4 space-y-2 text-xs select-none shadow-xl">
            
            <p className="text-[9px] text-brand-gold font-bold uppercase tracking-widest px-3 mb-2">
              {language === 'EN' ? 'Sovereign Navigation' : 'शाही नेविगेशन'}
            </p>

            {[
              { id: 'profile', icon: User, label: language === 'EN' ? 'Profile Credentials' : 'प्रोफ़ाइल विवरण' },
              { id: 'bookings', icon: Calendar, label: language === 'EN' ? 'My Blocked Bookings' : 'मेरे आरक्षित सुइट्स' },
              { id: 'rewards', icon: Award, label: language === 'EN' ? 'Loyalty Reward Points' : 'शाही कूपन पुरस्कार' },
              { id: 'wishlist', icon: Heart, label: language === 'EN' ? 'Lux Chambers Wishlist' : 'अनुशंसित विशलिस्ट' },
              { id: 'history', icon: History, label: language === 'EN' ? 'Historic Stay Records' : 'इतिहास एवं मूल्यांकन' },
              { id: 'notifications', icon: Bell, label: language === 'EN' ? 'Concierge Notifications' : 'सहायक सूचनाएं', count: notifications.length },
              { id: 'settings', icon: Settings, label: language === 'EN' ? 'Security & Settings' : 'सुरक्षा और व्यवस्था' }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setProfileError('');
                    setProfileSuccess('');
                  }}
                  className={`w-full text-left py-3 px-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-between border ${
                    isActive 
                      ? 'bg-brand-navy border-brand-gold/40 text-brand-gold shadow-md font-bold' 
                      : 'border-transparent text-brand-cream/70 hover:bg-brand-gold/5 hover:text-brand-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <TabIcon className="w-4 h-4 shrink-0" />
                    <span className="text-[11px] uppercase tracking-wider">{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-red-950/60 text-red-400 border border-red-800/20 font-bold rounded-full font-mono">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-4 border-t border-brand-gold/10 mt-4">
              <button 
                onClick={onLogout}
                className="w-full py-2.5 bg-red-950/20 hover:bg-red-950/55 text-red-300 font-bold uppercase text-[10px] tracking-widest border border-red-800/25 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{language === 'EN' ? 'Vacate Profile' : 'लॉग आउट'}</span>
              </button>
            </div>

          </div>

          {/* BUTLER TRACKER LIVE PROGRESS */}
          <div className="bg-brand-navy/35 border border-brand-gold/15 p-5 rounded-2xl space-y-4">
            <h4 className="font-serif text-xs text-brand-gold uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{language === 'EN' ? 'Butler Preparation' : 'बटलर तैयारी ट्रैकर'}</span>
            </h4>
            
            <p className="text-[10px] text-brand-cream/80 leading-relaxed font-sans">
              Coordination tracking for your next scheduled arrival check-in:
            </p>

            <div className="p-3 bg-brand-black/40 rounded border border-brand-gold/10 text-center font-serif text-[11px] text-brand-gold italic">
              &ldquo;{language === 'EN' ? CHAUFFEUR_STEPS[butlerIndex] : CHAUFFEUR_STEPS_HI[butlerIndex]}&rdquo;
            </div>

            <div className="space-y-2 bg-[#02020a]/40 p-2 rounded-lg">
              {CHAUFFEUR_STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[10px]">
                  <div className={`w-1.5 h-1.5 rounded-full ${idx <= butlerIndex ? 'bg-brand-gold animate-ping' : 'bg-brand-gold/20'}`} />
                  <span className={`${idx <= butlerIndex ? 'text-brand-white font-semibold' : 'text-brand-white/20'}`}>{language === 'EN' ? step : CHAUFFEUR_STEPS_HI[idx]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR CONTENT SECTIONS LOGIC */}
        <div className="lg:col-span-9">
          <div className="bg-[#0b0c15]/90 border border-brand-gold/25 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md min-h-[500px]">
            
            {/* TAB CONTENT: PROFILE CREDENTIALS */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-fade-in">
                
                <div className="border-b border-brand-gold/15 pb-3">
                  <h3 className="font-serif text-lg text-brand-gold uppercase tracking-widest">
                    {language === 'EN' ? 'Your Personal Profile Registry' : 'व्यक्तिगत प्रोफ़ाइल प्रविष्टि'}
                  </h3>
                  <p className="text-[10px] text-brand-cream/60 uppercase font-mono mt-0.5">
                    {language === 'EN' ? 'Credentials verified with Indian Ministry database' : 'पहचान विवरण सुरक्षित सुरक्षित'}
                  </p>
                </div>

                {profileSuccess && (
                  <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{profileSuccess}</span>
                  </div>
                )}
                {profileError && (
                  <div className="p-3.5 bg-red-950/60 border border-red-500/20 text-red-300 text-xs rounded-xl flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{profileError}</span>
                  </div>
                )}

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'Honorary Title & Full Name' : 'सम्मानित पूरा नाम'}</label>
                      <input 
                        type="text" required
                        className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream focus:border-brand-gold"
                        value={profFullName} onChange={(e) => setProfFullName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'Communication Email Address' : 'पंजिकृत ईमेल'}</label>
                      <input 
                        type="email" required
                        className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream focus:border-brand-gold"
                        value={profEmail} onChange={(e) => setProfEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'Contact Mobile (+91 format)' : 'संपर्क मोबाइल संख्या'}</label>
                      <input 
                        type="tel" required
                        className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream focus:border-brand-gold"
                        value={profPhone} onChange={(e) => setProfPhone(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'Date of Birth' : 'जन्म तिथि'}</label>
                      <input 
                        type="date"
                        className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-[#ccd5e0] focus:border-brand-gold"
                        value={profDob} onChange={(e) => setProfDob(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'Anniversary (Offers Opt-in)' : 'विवाह वर्षगांठ'}</label>
                      <input 
                        type="date"
                        className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-[#ccd5e0] focus:border-brand-gold"
                        value={profAnniversary} onChange={(e) => setProfAnniversary(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* SECURITY: CHANGE PASSWORD SEGMENT */}
                  <div className="p-4 bg-brand-black/40 rounded-xl border border-brand-gold/10 space-y-4">
                    <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider block flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      {language === 'EN' ? 'Change Security Passcode Passphrase' : 'सुरक्षा पासवर्ड पासवर्ड बदलें'}
                    </span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase text-brand-cream">{language === 'EN' ? 'New Password Phrase' : 'नया पासवर्ड'}</label>
                        <input 
                          type="password"
                          className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream focus:border-brand-gold"
                          placeholder="min 8 chars, 1 capital, 1 symbol"
                          value={profPassNew} onChange={(e) => setProfPassNew(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase text-brand-cream">{language === 'EN' ? 'Verify New Password' : 'नया पासवर्ड पुन: दर्ज करें'}</label>
                        <input 
                          type="password"
                          className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream focus:border-brand-gold"
                          placeholder="matching entries"
                          value={profPassConfirm} onChange={(e) => setProfPassConfirm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* PREFERENCES: SMS/EMAIL COMMUNICATIONS */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider block">
                      {language === 'EN' ? 'Privilege Communications Preferences' : 'विशिष्ठाधिकार संचार विकल्प'}
                    </span>
                    
                    <div className="space-y-2 select-none">
                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input type="checkbox" className="accent-brand-gold" checked={prefNotifySms} onChange={(e) => setPrefNotifySms(e.target.checked)} />
                        <span className="text-brand-cream/80">{language === 'EN' ? 'Send instant Room booking confirmation SMS on matching Indian phone' : 'सुरक्षित बुकिंग की सूचना तुरंत एसएमएस द्वारा भेजें'}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input type="checkbox" className="accent-brand-gold" checked={prefNotifyEmail} onChange={(e) => setPrefNotifyEmail(e.target.checked)} />
                        <span className="text-brand-cream/80">{language === 'EN' ? 'Receive full detailed Invoice PDFs on email address' : 'पूर्ण रसीद पीडीएफ विवरण ईमेल पर प्राप्त करें'}</span>
                      </label>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-gold-gradient text-brand-black text-[10px] uppercase tracking-widest font-black rounded-lg transition-transform hover:brightness-110 active:scale-95 cursor-pointer"
                  >
                    {language === 'EN' ? 'REVISE RESERVATIONS PROFILE' : 'प्रोफ़ाइल विवरण सहेजें'}
                  </button>

                </form>

              </div>
            )}

            {/* TAB CONTENT: MY BOOKINGS LIST */}
            {activeTab === 'bookings' && (
              <div className="space-y-6 animate-fade-in" id="active-bookings-list-block">
                
                <div className="border-b border-brand-gold/15 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-serif text-lg text-brand-gold uppercase tracking-widest">
                      {language === 'EN' ? 'Active & Up-Coming Stays' : 'सक्रिय एवं आगामी शाही प्रवास'}
                    </h3>
                    <p className="text-[10px] text-brand-cream/60 uppercase font-mono mt-0.5">
                      {language === 'EN' ? 'Standard 24-hour check-out limits apply' : '२४ घंटे प्रस्थान नियम लागू'}
                    </p>
                  </div>
                  <button 
                    onClick={onGoToBooking}
                    className="px-4 py-1.5 bg-brand-gold text-brand-black border border-brand-gold font-bold uppercase text-[9px] tracking-wider rounded-lg hover:bg-brand-cream transition-colors cursor-pointer"
                  >
                    + NEW BOOKING
                  </button>
                </div>

                {bookings.filter(b => b.status === 'confirmed').length > 0 ? (
                  <div className="space-y-4">
                    {bookings.filter(b => b.status === 'confirmed').map((b) => {
                      const roomObj = LUXURY_ROOMS.find(r => r.id === b.roomId) || LUXURY_ROOMS[0];
                      return (
                        <div key={b.id} className="p-5 bg-brand-black/60 border border-brand-gold/25 rounded-2xl flex flex-col md:flex-row justify-between gap-6 hover:border-brand-gold transition-colors">
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] px-2 py-0.5 bg-emerald-950/40 text-[#A1BBA1] font-bold border border-emerald-800/20 uppercase rounded">CONFIRMED</span>
                              <span className="font-mono text-brand-gold font-bold text-[10px]">{b.id}</span>
                            </div>
                            
                            <h4 className="font-serif text-lg text-brand-white font-medium">{b.roomName}</h4>
                            
                            <p className="text-brand-cream/80 leading-relaxed max-w-lg">
                              A luxurious Mewar sanctuary with breathtaking panoramic views of Lake Pichola Udaipur, complete with organic private spa and state-of-the-art climate mechanics.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 font-mono text-[10px]">
                              <div>
                                <span className="block text-brand-white/40 uppercase">Check-In</span>
                                <span className="text-brand-cream font-bold">{b.checkIn} • 2:00 PM</span>
                              </div>
                              <div>
                                <span className="block text-brand-white/40 uppercase">Check-Out</span>
                                <span className="text-brand-cream font-bold">{b.checkOut} • 12:00 PM</span>
                              </div>
                              <div>
                                <span className="block text-brand-white/40 uppercase">Guests</span>
                                <span className="text-brand-cream font-bold">{b.guests} People max</span>
                              </div>
                              <div>
                                <span className="block text-brand-white/40 uppercase">Total Deposit</span>
                                <span className="text-brand-gold font-bold">₹{b.totalPrice.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Interactive Actions */}
                          <div className="w-full md:w-36 shrink-0 flex flex-col justify-between gap-2 border-t md:border-t-0 md:border-l border-brand-gold/10 pt-4 md:pt-0 md:pl-4">
                            <button 
                              onClick={() => {
                                setActiveQrBooking(b);
                              }}
                              className="w-full py-1.5 bg-brand-navy hover:bg-brand-navy/60 text-brand-gold border border-brand-gold/15 text-[9px] uppercase font-bold tracking-widest rounded flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <QrCode className="w-3 h-3" />
                              <span>View QR Pass</span>
                            </button>
                            <button 
                              onClick={() => handleModifyBookingDates(b.id)}
                              className="w-full py-1.5 bg-brand-black hover:bg-brand-navy text-brand-cream border border-brand-gold/15 text-[9px] uppercase font-bold tracking-widest rounded flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Modify Dates</span>
                            </button>
                            <button 
                              onClick={() => window.print()}
                              className="w-full py-1.5 bg-brand-black hover:bg-brand-navy text-brand-cream border border-brand-gold/15 text-[9px] uppercase font-bold tracking-widest rounded flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Printer className="w-3 h-3" />
                              <span>Print Invoice</span>
                            </button>
                            <button 
                              onClick={() => handleCancelStay(b.id)}
                              className="w-full py-1.5 bg-red-950/20 hover:bg-red-950 text-red-300 border border-red-500/10 text-[9px] uppercase font-bold tracking-widest rounded flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Cancel Stay</span>
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-brand-gold/20 rounded-2xl bg-brand-black/20 space-y-4">
                    <Calendar className="w-10 h-10 text-brand-gold/40 mx-auto" />
                    <p className="text-xs text-brand-cream/70 max-w-xs mx-auto">
                      Currently you have no upcoming active stays reserved. Begin exploring our suites class.
                    </p>
                    <button 
                      onClick={onGoToBooking}
                      className="px-6 py-2.5 bg-gold-gradient text-brand-black text-[10px] font-black uppercase tracking-widest rounded-lg cursor-pointer"
                    >
                      Book Royal Suite Now
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* TAB CONTENT: REWARDS LOYAL TABLE */}
            {activeTab === 'rewards' && (
              <div className="space-y-6 animate-fade-in" id="royal-loyalty-rewards-points-sheet">
                
                <div className="border-b border-brand-gold/15 pb-3">
                  <h3 className="font-serif text-lg text-brand-gold uppercase tracking-widest">
                    {language === 'EN' ? 'Anjuman Royal Treasury & Privilege points' : 'शाही विशेषाधिकार पॉइंट एवं पुरस्कार'}
                  </h3>
                  <p className="text-[10px] text-brand-cream/60 uppercase font-mono mt-0.5">
                    {language === 'EN' ? 'Earn 1 reward point for every 1 INR paid' : '१ रुपया भुगतान = १ विशिष्टता पॉइंट अर्जित करें'}
                  </p>
                </div>

                {/* Big Reward metrics grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  <div className="p-4 bg-brand-black/60 border border-brand-gold/25 rounded-xl space-y-1">
                    <span className="text-[8px] text-brand-cream/50 uppercase font-bold block">Consolidated Treasury</span>
                    <span className="font-serif text-2xl text-brand-gold font-bold block">{loyaltyPoints} PTS</span>
                    <span className="text-[9px] text-[#A1BBA1] block">Value Equivalent: ₹{Math.round(loyaltyPoints * 10)} stay credit</span>
                  </div>

                  <div className="p-4 bg-brand-black/60 border border-brand-gold/25 rounded-xl space-y-1">
                    <span className="text-[8px] text-brand-cream/50 uppercase font-bold block">Current Loyalty Order</span>
                    <span className="font-serif text-lg text-[#D4AF37] font-bold block uppercase flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      Silver Privilege
                    </span>
                    <span className="text-[9px] text-brand-cream/60 block">Welcome level starter status unlocked</span>
                  </div>

                  {/* Redeem Action call Card */}
                  <div className="p-4 bg-brand-gold/5 border-2 border-brand-gold/30 rounded-xl space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] text-[#ccd5e0] uppercase font-bold block">Instant Redemption</span>
                      <p className="text-[9px] text-brand-cream/70 leading-relaxed">Exchange <strong>500 points</strong> for ₹5k cash-stay Coupon.</p>
                    </div>
                    <button 
                      onClick={handleRedeemPointsCoupon}
                      className="w-full py-1.5 bg-brand-gold text-brand-black text-[9px] uppercase font-bold rounded hover:bg-brand-cream transition-colors cursor-pointer"
                    >
                      Redeem 500 PTS
                    </button>
                  </div>

                </div>

                {/* POINTS HISTORY TABLE */}
                <div className="space-y-3">
                  <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest block">Privilege Points Transaction History</span>
                  
                  <div className="border border-brand-gold/15 rounded-xl overflow-hidden text-xs">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-brand-navy p-3 text-[10px] text-brand-gold font-bold uppercase border-b border-brand-gold/15 tracking-wider text-left">
                          <th className="p-3">Reference ID</th>
                          <th className="p-3">Activity Description</th>
                          <th className="p-3">Dignity Points</th>
                          <th className="p-3">Recording Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-gold/10 font-mono text-[11px] bg-brand-black/30">
                        {loyaltyLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-brand-gold/5">
                            <td className="p-3 text-brand-cream/60">{log.id}</td>
                            <td className="p-3 text-brand-white font-sans">{log.description}</td>
                            <td className={`p-3 font-semibold ${log.type === 'earned' ? 'text-emerald-400' : 'text-red-400'}`}>
                              {log.type === 'earned' ? '+' : '-'}{log.pts} PTS
                            </td>
                            <td className="p-3 text-brand-cream/50">{log.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: WISHLIST CHAMBERS */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6 animate-fade-in" id="royal-chambers-wishlist">
                
                <div className="border-b border-brand-gold/15 pb-3">
                  <h3 className="font-serif text-lg text-brand-gold uppercase tracking-widest">
                    {language === 'EN' ? 'Lux Imperial Chambers Favorites List' : 'पसंदीदा कक्ष एवं विलासिता मार्ग'}
                  </h3>
                  <p className="text-[10px] text-brand-cream/60 uppercase font-mono mt-0.5">
                    {language === 'EN' ? 'Monitor vacancy of Udaipur private palace chambers' : 'शाही कमरों की उपलब्धता पर त्वरित नज़र रखें'}
                  </p>
                </div>

                {wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlist.map((rId) => {
                      const roomObj = LUXURY_ROOMS.find(r => r.id === rId) || LUXURY_ROOMS[0];
                      return (
                        <div key={rId} className="bg-brand-black/50 border border-brand-gold/20 rounded-2xl overflow-hidden hover:border-brand-gold transition-colors flex flex-col justify-between">
                          <div className="p-4 space-y-2">
                            <div className="flex justify-between items-start">
                              <span className="text-[9px] font-mono text-brand-gold tracking-widest uppercase font-bold">{roomObj.category} SUITE</span>
                              <button 
                                onClick={() => handleRemoveWishlist(rId)}
                                className="text-red-400 hover:text-red-500 font-bold text-xs"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <h4 className="font-serif text-base text-brand-white font-medium">{roomObj.name}</h4>
                            <p className="text-[11px] text-brand-cream/70 leading-relaxed font-sans">{roomObj.description}</p>
                            <span className="text-xs text-brand-gold font-bold block font-mono">₹{roomObj.priceINR.toLocaleString('en-IN')} / per night stay</span>
                          </div>

                          <div className="bg-brand-navy/60 p-3 border-t border-brand-gold/10 text-center">
                            <button 
                              onClick={onGoToBooking}
                              className="w-full py-1.5 bg-brand-gold hover:bg-brand-cream text-brand-black text-[9px] uppercase font-bold tracking-widest rounded transition-colors cursor-pointer"
                            >
                              Instant Reserve Stay ➔
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-brand-gold/20 rounded-2xl bg-brand-black/20 space-y-4">
                    <Heart className="w-10 h-10 text-brand-gold/40 mx-auto" />
                    <p className="text-xs text-brand-cream/70 max-w-xs mx-auto">
                      Your visual luxury wishlist is currently empty. Star accommodations to pin them here!
                    </p>
                  </div>
                )}

              </div>
            )}

            {/* TAB CONTENT: BOOKING HISTORY LOG */}
            {activeTab === 'history' && (
              <div className="space-y-6 animate-fade-in" id="historic-booking-stay-logs">
                
                <div className="border-b border-brand-gold/15 pb-3">
                  <h3 className="font-serif text-lg text-brand-gold uppercase tracking-widest">
                    {language === 'EN' ? 'Historic Stay Logs & Valedictions' : 'पूर्व प्रवासों का लेखा-जोखा व मूल्यांकन'}
                  </h3>
                  <p className="text-[10px] text-brand-cream/60 uppercase font-mono mt-0.5">
                    {language === 'EN' ? 'Track historic reservation logs with feedback ratings' : 'आपके ऐतिहासिक विश्राम अनुभवों की प्रविष्टि'}
                  </p>
                </div>

                {bookings.filter(b => b.status === 'cancelled').length > 0 ? (
                  <div className="space-y-4">
                    {bookings.filter(b => b.status === 'cancelled').map((b) => (
                      <div key={b.id} className="p-4 bg-brand-black/40 border border-brand-gold/10 rounded-xl flex justify-between items-center text-xs opacity-75">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] px-1.5 py-0.5 bg-red-950/40 text-red-300 font-bold rounded uppercase">RETRACTED CANCELLED</span>
                            <span className="font-mono text-brand-cream/60">{b.id}</span>
                          </div>
                          <h4 className="font-serif text-sm text-brand-white font-medium">{b.roomName}</h4>
                          <p className="text-[10px] text-brand-cream/60 font-mono">Date Range: {b.checkIn} to {b.checkOut}</p>
                        </div>
                        <span className="text-brand-cream/60 font-mono">refund processed</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-brand-gold/20 rounded-2xl bg-brand-black/20 text-xs text-brand-cream/70">
                    No cancelled or historic finished records exist under your registered credential registry yet.
                  </div>
                )}

              </div>
            )}

            {/* TAB CONTENT: NOTIFICATIONS SHEET */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in" id="royal-notifications-list">
                
                <div className="border-b border-brand-gold/15 pb-3">
                  <h3 className="font-serif text-lg text-brand-gold uppercase tracking-widest">
                    {language === 'EN' ? 'Palace Concierge Live Messages' : 'शाही संदेश केंद्र'}
                  </h3>
                  <p className="text-[10px] text-brand-cream/60 uppercase font-mono mt-0.5">
                    {language === 'EN' ? 'Live alerts coordinates with butler services' : 'द्वारपाल एवं बटलर समन्वयक सूचनाएं'}
                  </p>
                </div>

                <div className="space-y-3.5">
                  {notifications.map((msg, i) => (
                    <div key={i} className="p-4 bg-brand-navy/35 border border-brand-gold/15 rounded-xl flex items-start gap-3.5 text-xs">
                      <div className="p-2 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full shrink-0">
                        <Bell className="w-4 h-4 text-brand-gold" />
                      </div>
                      <div className="space-y-1 text-xs">
                        <p className="text-brand-white leading-relaxed font-sans">{msg}</p>
                        <span className="text-[9px] text-brand-gold block font-mono">RECORED TIME: 25 MAY 2026 • 2:15 PM IST</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB CONTENT: GENERAL SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fade-in" id="security-dashboard-settings">
                
                <div className="border-b border-brand-gold/15 pb-3">
                  <h3 className="font-serif text-lg text-brand-gold uppercase tracking-widest">
                    {language === 'EN' ? 'Security Configurations & Settings' : 'सुरक्षा और व्यवस्था'}
                  </h3>
                  <p className="text-[10px] text-brand-cream/60 uppercase font-mono mt-0.5">
                    {language === 'EN' ? 'Alter security timers, active sessions mechanisms and credentials' : 'सुरक्षा पैरामीटर्स सेट करें'}
                  </p>
                </div>

                <div className="space-y-6">
                  
                  {/* Session Timeout */}
                  <div className="bg-brand-black/40 p-4 border border-brand-gold/15 rounded-xl text-xs space-y-4">
                    <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider block flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-brand-gold" />
                      Session Timers
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] text-brand-cream uppercase block mb-1">AUTOMATIC SESSION IDLE TIMEOUT</label>
                        <select 
                          className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2 px-3 text-[#ccd5e0]"
                          value={sessionExpiry}
                          onChange={(e) => setSessionExpiry(Number(e.target.value))}
                        >
                          <option value={15}>15 Minutes (High Security)</option>
                          <option value={30}>30 Minutes (Recommended)</option>
                          <option value={60}>60 Minutes (Leisure Access)</option>
                        </select>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#ccd5e0] uppercase block font-semibold mb-1">INFORMATION SECURITY CODE</span>
                        <p className="text-[10px] text-brand-cream/60 leading-relaxed">The server enforces automatic signature revocation if session is silent for {sessionExpiry} minutes. Protect and secure keys accordingly.</p>
                      </div>
                    </div>
                  </div>

                  {/* CSRF Security placeholder */}
                  <div className="bg-brand-black/40 p-4 border border-brand-gold/15 rounded-xl text-xs space-y-4">
                    <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider block flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-brand-gold" />
                      CSRF Cross-Site Request Securities
                    </span>

                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="space-y-1 flex-1">
                        <span className="text-[10px] text-brand-white block uppercase">Toggle CSRF Headers protection</span>
                        <p className="text-[9px] text-brand-cream/60 leading-relaxed max-w-lg">Enable state secure anti-forgery headers on standard checkout endpoints to block unauthorized external API replay.</p>
                      </div>
                      
                      <button 
                        type="button"
                        onClick={() => {
                          setCsrfProtection(!csrfProtection);
                        }}
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded border cursor-pointer transition-colors ${csrfProtection ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300' : 'bg-red-950/40 border-red-700 text-red-300'}`}
                      >
                        {csrfProtection ? 'ENABLED [CSRF]' : 'DISABLED'}
                      </button>
                    </div>
                  </div>

                  {/* Sanitization status logs */}
                  <div className="p-4 bg-brand-navy/20 border border-brand-gold/10 rounded-xl text-[10px] leading-relaxed text-[#A1BBA1] font-mono">
                    ✔ All text input fields inside the reservation panels employ <strong>strict anti-XSS validation sanitization patterns</strong> to reject illegal SQL code blocks. Local payload keycode is: AES-256-GCM.
                  </div>

                </div>

              </div>
            )}

          </div>
        </div>

      </div>

      {/* POPUP: QR REFERENCE CONVENE REF PASS */}
      {activeQrBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#000000]/80 backdrop-blur-md" onClick={() => setActiveQrBooking(null)} />
          
          <div className="relative w-full max-w-sm rounded-2xl border-2 border-brand-gold bg-[#131422] p-6 text-brand-white text-center space-y-5 shadow-2xl animate-scale-in">
            
            <div className="border-b border-brand-gold/15 pb-4">
              <span className="text-[9px] text-brand-gold font-bold uppercase tracking-widest block">MEWAR PALACE PASS</span>
              <h3 className="font-serif text-lg text-brand-white uppercase font-black">{activeQrBooking.roomName}</h3>
              <span className="font-mono text-xs text-brand-cream/60 mt-1 block">Booking Reference: {activeQrBooking.id}</span>
            </div>

            <div className="p-4 bg-brand-white rounded-xl inline-block shadow-lg mx-auto">
              <div className="w-32 h-32 bg-brand-black flex flex-wrap p-1 relative rounded border-2 border-brand-gold">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map((n) => (
                  <div key={n} className={`w-6 h-6 rounded-sm ${n % 3 === 0 ? 'bg-brand-gold' : 'bg-brand-gold/25'}`} />
                ))}
                <span className="absolute bottom-1 right-2 font-mono text-[7px] text-brand-gold">SECURE</span>
              </div>
            </div>

            <p className="text-[10px] text-brand-cream/80 max-w-xs leading-relaxed mx-auto font-sans">
              Present this verified digital QR certificate pass coordinates on arrival at the Pichola main gateway to execute express helicopter/chauffeur check-in.
            </p>

            <button 
              onClick={() => setActiveQrBooking(null)}
              className="w-full py-2 bg-brand-navy border border-brand-gold/20 text-brand-gold text-[10px] uppercase font-bold tracking-widest rounded-lg cursor-pointer"
            >
              Close Pass Window
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
