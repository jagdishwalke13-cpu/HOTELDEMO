import React, { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { LanguageType, EnquirySubmission } from '../types';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  Check, 
  FileUp, 
  X, 
  HelpCircle, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  MessageCircle,
  Map,
  Plane,
  Train,
  Car,
  Calendar,
  Users,
  DollarSign,
  AlertCircle,
  ArrowRight,
  Info
} from 'lucide-react';

interface ContactEnquiryProps {
  language: LanguageType;
}

interface PrioritySubmission {
  id: string;
  enquiryType: string;
  name: string;
  mobile: string;
  email: string;
  expectedDate: string;
  guests: number;
  budgetRange: number;
  specialRequirements: string;
  urgency: 'Normal' | 'Urgent' | 'ASAP';
  callbackRequested: boolean;
  submittedAt: string;
}

export default function ContactEnquiry({ language }: ContactEnquiryProps) {
  // Tab Controller
  const [activeTab, setActiveTab] = useState<'contact' | 'enquiry'>('contact');

  // Load and store existing submissions
  const [submissions, setSubmissions] = useState<EnquirySubmission[]>([]);
  const [prioritySubmissions, setPrioritySubmissions] = useState<PrioritySubmission[]>([]);

  useEffect(() => {
    const rawEnq = localStorage.getItem('anjuman_enquiries');
    if (rawEnq) setSubmissions(JSON.parse(rawEnq));

    const rawPri = localStorage.getItem('anjuman_priority_enquiries');
    if (rawPri) setPrioritySubmissions(JSON.parse(rawPri));
  }, []);

  // --- TAB A: GENERAL CONTACT FORM STATE ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [subject, setSubject] = useState('Room Booking');
  const [prefMethod, setPrefMethod] = useState<'Call' | 'Email' | 'WhatsApp'>('Email');
  const [prefTime, setPrefTime] = useState<'Morning' | 'Afternoon' | 'Evening'>('Afternoon');
  const [message, setMessage] = useState('');
  
  // File Attachment State
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CAPTCHA State
  const [captchaNum1, setCaptchaNum1] = useState(5);
  const [captchaNum2, setCaptchaNum2] = useState(3);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState(false);

  // Form Handling Statuses
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalSuccess, setGeneralSuccess] = useState('');

  // Generate CAPTCHA helper
  const generateCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 9) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 9) + 1);
    setCaptchaInput('');
    setCaptchaError(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // Set file details on selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      });
    }
  };

  // Drag and drop mock events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setAttachedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      });
    }
  };

  // Form submit algorithm
  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCaptchaError(false);

    // Validate CAPTCHA
    const parsed = parseInt(captchaInput, 10);
    if (isNaN(parsed) || parsed !== (captchaNum1 + captchaNum2)) {
      setCaptchaError(true);
      return;
    }

    // Validate message length
    if (message.length < 20) {
      alert(language === 'EN' 
        ? 'Message description must contain at least 20 character coordinates.' 
        : 'राजसी संदेश का विवरण कम से कम २० शब्दों का होना अनिवार्य है।');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const code = `ENQ-GEN-${Math.floor(1000 + Math.random() * 9000)}`;
      const newSubmission: EnquirySubmission = {
        id: code,
        fullName: `${firstName} ${lastName}`.trim(),
        email,
        phone: mobile,
        subject,
        message: `${message} [Preferred Method: ${prefMethod}, Time: ${prefTime}, File Attach: ${attachedFile ? attachedFile.name : 'None'}]`,
        submittedAt: new Date().toISOString(),
        status: 'Concierge Assigned'
      };

      const updated = [newSubmission, ...submissions];
      localStorage.setItem('anjuman_enquiries', JSON.stringify(updated));
      setSubmissions(updated);

      setGeneralSuccess(
        language === 'EN'
          ? `✔ Namaste! Your communication has been dispatched under Tracking Code: ${code}. Our 5-star concierge desks will reach out within 2 hours of verification.`
          : `✔ नमस्ते! आपका संदेश पंजीकृत कोड: ${code} के अधीन प्राप्त हुआ। हम आगामी २ घंटों में आपसे संपर्क करेंगे।`
      );

      // Reset fields
      setFirstName('');
      setLastName('');
      setEmail('');
      setMobile('');
      setSubject('Room Booking');
      setMessage('');
      setAttachedFile(null);
      generateCaptcha();
      setIsSubmitting(false);

      // Auto clear alert
      setTimeout(() => setGeneralSuccess(''), 10000);
    }, 1500);
  };


  // --- TAB B: PRIORITY ENQUIRY NOW STATE ---
  const [priEngType, setPriEngType] = useState<'Room' | 'Wedding' | 'Corporate' | 'Occasion' | 'Package'>('Room');
  const [priName, setPriName] = useState('');
  const [priMobile, setPriMobile] = useState('');
  const [priEmail, setPriEmail] = useState('');
  const [priDate, setPriDate] = useState('');
  const [priGuests, setPriGuests] = useState(10);
  const [priBudget, setPriBudget] = useState(150000);
  const [priReqs, setPriReqs] = useState('');
  const [priUrgency, setPriUrgency] = useState<'Normal' | 'Urgent' | 'ASAP'>('Normal');
  const [priCallback, setPriCallback] = useState(true);

  // Success priority display Modal State
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [modalDetails, setModalDetails] = useState<any>(null);

  const handlePrioritySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!priName || !priMobile || !priEmail) {
      alert(language === 'EN' ? 'Please supply essential identity elements.' : 'कृपया आवश्यक पहचान विवरण साझा करें।');
      return;
    }

    const uniqueId = `PRI-${priEngType.substring(0,3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPrioritySubmission: PrioritySubmission = {
      id: uniqueId,
      enquiryType: priEngType,
      name: priName,
      mobile: priMobile,
      email: priEmail,
      expectedDate: priDate || 'TBD (Flexible dates)',
      guests: priGuests,
      budgetRange: priBudget,
      specialRequirements: priReqs,
      urgency: priUrgency,
      callbackRequested: priCallback,
      submittedAt: new Date().toISOString()
    };

    const updated = [newPrioritySubmission, ...prioritySubmissions];
    localStorage.setItem('anjuman_priority_enquiries', JSON.stringify(updated));
    setPrioritySubmissions(updated);

    // Save metadata details to show in success popup
    setModalDetails(newPrioritySubmission);
    setShowPriorityModal(true);

    // Setup clear fields
    setPriName('');
    setPriMobile('');
    setPriEmail('');
    setPriDate('');
    setPriReqs('');
    setPriGuests(10);
    setPriBudget(150000);
    setPriUrgency('Normal');
    setPriCallback(true);
  };


  // --- FAQ ACCORDION COMPONENT ACTIONS ---
  const [faqStates, setFaqStates] = useState<{ [key: number]: boolean }>({ 0: true });

  const toggleFaq = (index: number) => {
    setFaqStates((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const FAQS = [
    {
      q: 'What are the check-in and check-out timings?',
      qHI: 'आगमन (चेक-इन) और प्रस्थान (चेक-आउट) का समय क्या है?',
      a: 'Standard Check-in is at 2:00 PM IST, and Check-out is at 12:00 PM. Early check-in or late check-out requests are accommodated complimentary based on suite vacancy, especially for privileged loyalty members.',
      aHI: 'शाही आवास हेतु आगमन का समय दोपहर २:०० बजे और प्रस्थान का समय दोपहर १२:०० बजे निश्चित है। उपलब्धता के आधार पर शीघ्र प्रवेश की अनुमति दी जा सकती है।'
    },
    {
      q: 'What is the package cancellation policy?',
      qHI: 'आरक्षण निरस्त करने की शर्ते क्या हैं?',
      a: 'We offer fee-free cancellation up to 48 hours prior to the standard check-in hour on general room blocks. Customized event hall reservations or Peak Sovereign holiday bookings require a 15-day prior alert.',
      aHI: 'आप आगमन से ४८ घंटे पूर्व बिना किसी शुल्क के बुकिंग रद्द कर सकते हैं। विशेष राजकीय समारोह ब्लॉक हेतु १५ दिन पूर्व सूचना आवश्यक है।'
    },
    {
      q: 'Is organic breakfast buffet included in the rates?',
      qHI: 'क्या दैनिक शुल्क में नाश्ता सम्मिलित है?',
      a: 'Yes, Royal Breakfast is complimentary with all Palace Suites, Club chambers, and Panoramic Villas. Standard rooms can optionally scale buffet dining cards at ₹899+ taxes per guest.',
      aHI: 'हाँ, शाही सुइट्स एवं विला श्रेणी के आवासों के साथ दैनिक भव्य नाश्ता पैकेज निःशुल्क उपलब्ध कराया जाता है।'
    },
    {
      q: 'What is your pet accommodation rules?',
      qHI: 'क्या पालतू पशुओं को महल में रखने की अनुमति है?',
      a: 'To guarantee heritage room conservation and absolute tranquility for all state dignitaries, pets are general restricted from staying in principal guest suites. However, custom ultra-luxury boarding pens near the lakefront garden can be reserved on request.',
      aHI: 'ऐतिहासिक धरोहर सुइट्स की सुरक्षा व शांति बनाये रखने हेतु पालतू जानवरों को मुख्य कमरों में रखना वर्जित है, उनके लिए विशेष सरोवर किनारे आवास की व्यवस्था की जा सकती है।'
    },
    {
      q: 'Is parking space available, and what are the rates?',
      qHI: 'क्या पार्किंग व्यवस्था उपलब्ध है और इसके क्या शुल्क हैं?',
      a: 'Complimentary state chamber Valet Parking is provided 24/7 inside protected underground chambers equipped with CCTV and VIP bulletproof surveillance patrols.',
      aHI: 'हमारे समस्त अतिथियों हेतु सीसीटीवी और सुरक्षा गार्ड्स युक्त उच्च कोटि की भूमिगत वैले पार्किंग सेवा पूर्णतः निःशुल्क और सक्रिय है।'
    },
    {
      q: 'Can you customize bespoke wedding packages and mandaps?',
      qHI: 'क्या आप विवाह मंडप और शाही विवाह योजनाएं बना सकते हैं?',
      a: 'Indeed! Our palace specializes in executing fairytale destination weddings ranging from lakeside mandaps to the Darbar Courtyard banquet tables. Custom catering configurations, structural floral works, and VIP suite allocations start at ₹15,00,000 INR.',
      aHI: 'जी हाँ! हमारा पैलेस राजस्थान के सर्वोत्तम गंतव्य विवाह स्थलों में गिना जाता है। विस्तृत शाही विवाह एवं भोजन के पैकेजेस १५,००,००० रुपये से शुरू होते हैं।'
    },
    {
      q: 'What payment modes are globally accepted?',
      qHI: 'भुगतान के कौन-से वैश्विक माध्यम स्वीकार्य हैं?',
      a: 'We welcome all international and domestic credit cards (Visa, MasterCard, Amex, RuPay), UPI, and certified Bank Wire Transfers. Standard corporate bookings can process payment on GST terms.',
      aHI: 'हम सभी वैश्विक और घरेलू क्रेडिट/डेबिट कार्ड्स (अमेक्स सहित), यूपीआई एवं बैंक डायरेक्ट ट्रांसफर स्वीकार करते हैं।'
    },
    {
      q: 'Do you provide verified GST tax invoices?',
      qHI: 'क्या आप अधिकृत जीएसटी टैक्स इनवॉइस प्रदान करते हैं?',
      a: 'Yes, certified GST compliant invoice cards with corporate input credentials will be generated automatically at checkout or during invoice settlement. Please supply corporate GSTIN details during form checking.',
      aHI: 'हाँ, कंपनियों और राजकीय प्रतिनिधियों हेतु इनपुट टैक्स छूट हेतु जीएसटी कर बिल चेक-आउट के समय प्रेषित किया जाता है।'
    },
    {
      q: 'Do you operate airport or railway pickup and drop systems?',
      qHI: 'क्या हवाई अड्डे से लेने व छोड़ने की गाड़ी सेवा उपलब्ध है?',
      a: 'Yes! Our custom travel desk arranges premium sedan transfers, state SUV convoys, or private luxury limousines to/from Udaipur Maharana Pratap Airport (22 km) and Udaipur City Railway Station (3 km).',
      aHI: 'हाँ! हमारी प्रीमियम राजकीय ट्रेवल डेस्क हवाई अड्डे एवं रेलवे स्टेशन से आलीशान लग्जरी कारों द्वारा सुरक्षित आवागमन सुनिश्चित करती है।'
    },
    {
      q: 'Is late checked-out allowed on holiday departures?',
      qHI: 'क्या छुट्टियों में विलंबित प्रस्थान (लेट चेक-आउट) संभव है?',
      a: 'Late checkout up to 3:00 PM is offered complimentary subject to suite room turnover schedules. Priority is given to verified members of our Royal Loyalty Club.',
      aHI: 'शेड्यूल और कमरों की उपलब्धता के आधार पर दोपहर ३:०० बजे तक निःशुल्क विलंबित प्रस्थान की स्वीकृति दी जा सकती है।'
    }
  ];


  // --- GOOGLE MAPS PANEL DIRECTIONS MULTITAB ---
  const [directionsTab, setDirectionsTab] = useState<'Air' | 'Train' | 'Road'>('Air');


  // --- LIVE CHAT WIDGET STATE ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'bot' | 'user'; text: string; time: string }[]>([
    { sender: 'bot', text: 'Namaste! Welcome to Anjuman Palace support. 🙏 I am your Royal Concierge Assistant. How may I assist you today?', time: '09:00' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const currentTimeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const userMsg = chatInput.trim();
    
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: currentTimeStr }]);
    setChatInput('');

    // Trigger smart response matching
    setTimeout(() => {
      let botResp = "Our physical Royal Concierges operate live between 9:00 AM and 11:00 PM IST. Since we are checking your request, we can coordinate a direct WhatsApp transfer or log your details.";
      const query = userMsg.toLowerCase();

      if (query.includes('room') || query.includes('suite') || query.includes('price') || query.includes('book')) {
        botResp = "Great! Splendid. Our luxury Suites span Standard Deluxe, Premium Imperial, and Presidential Villas. Rates start from ₹7,999/night. You can explore our 'Rooms' tab first or I can trigger an advisor call.";
      } else if (query.includes('wedding') || query.includes('event') || query.includes('marry')) {
        botResp = "Anjuman is Udaipur's premier palace wedding venue! Our lakeshore mandaps accommodate up to 500 elite delegates. Go to the 'Priority Event Inquiry' tab next to get a customized proposal in 30 minutes.";
      } else if (query.includes('contact') || query.includes('phone') || query.includes('number')) {
        botResp = "You can call us directly 24/7 at +91-294-242-8888 or +91-294-242-9999 for instant assistance.";
      } else if (query.includes('food') || query.includes('dining') || query.includes('restaurant') || query.includes('menu')) {
        botResp = "We have 3 signature restaurants: NAWAB (Heritage fine-dining), THE TERRACE (Lake-view rooftop), and CAFE ANJUMAN (24/7 buffet). Room service is also available 24/7.";
      } else if (query.includes('hello') || query.includes('namaste') || query.includes('hi')) {
        botResp = "Namaste! Welcome back. 🙏 Let me know if you would like to book a chamber, reserve a feast dining slot, or request a Callback.";
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botResp, time: currentTimeStr }]);
    }, 1000);
  };

  // Helper for quick FAQs click in chat
  const handleQuickChatClick = (text: string) => {
    const currentTimeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    setChatMessages(prev => [...prev, { sender: 'user', text, time: currentTimeStr }]);
    
    setTimeout(() => {
      let response = "I have logged your request. Let me match that for you.";
      if (text.includes('Price')) {
        response = "Palace Chambers start from ₹7,999/night. Standard Suites at ₹14,999 and the Grand Presidential Dome with private pool at ₹49,999. Select the 'Priority Event Inquiry' tab to lock in special rates!";
      } else if (text.includes('Wedding')) {
        response = "Wonderful. Custom Royal Weddings offer curated floral designs, grand entry with royal horses, and lakeside catering. We can arrange a call with our elite decor planners immediately.";
      } else if (text.includes('Reach')) {
        response = "The Palace is conveniently located 22 km from Udaipur Maharana Pratap Airport (UDR) and just 3 km from the Udaipur City Railway Station on Lake Pichola Promenade.";
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: response, time: currentTimeStr }]);
    }, 800);
  };


  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-12 text-brand-white relative" id="contact-outer-wrapper">
      
      {/* 24/7 WHATSAPP FIXED FLOATING TRIGGER BUTTON */}
      <a 
        href="https://wa.me/912942428888?text=Namaste!%20I%20am%20interested%20in%20reserving%20a%20luxury%20stay%20at%20Anjuman%20Hotel.%20Please%20connect%20me%20to%20the%20concierge."
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-20 sm:right-24 z-50 bg-[#25D366] hover:bg-[#128C7E] px-4 py-3 rounded-full flex items-center gap-2 shadow-2xl text-white font-mono text-[11px] font-extrabold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all border border-emerald-400/40"
        title="Chat 24/7 on WhatsApp"
        id="global-floating-whatsapp-btn"
      >
        <MessageCircle className="w-4 h-4 fill-white" />
        <span className="hidden sm:inline">WhatsApp Chat</span>
        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping absolute -top-1 -right-1" />
      </a>

      {/* EXPANDABLE LIVE CHAT WIDGET WINDOW */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="global-live-chat-panel">
        
        {/* Toggle bubble button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`p-3.5 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform scale-100 hover:scale-110 cursor-pointer text-brand-navy border ${
            isChatOpen 
              ? 'bg-brand-cream border-brand-gold text-brand-navyRotate' 
              : 'bg-brand-gold border-brand-gold text-brand-black rotate-0'
          }`}
          title="Live Support Chat Desk"
        >
          {isChatOpen ? <X className="w-5 h-5 font-bold" /> : <MessageSquare className="w-5 h-5 font-bold" />}
        </button>

        {/* The Chat Panel Card */}
        {isChatOpen && (
          <div className="absolute bottom-16 right-0 w-[320px] sm:w-[360px] h-[480px] bg-[#090b14] border border-brand-gold/30 rounded-2xl flex flex-col justify-between shadow-2xl overflow-hidden animate-fade-in z-50">
            {/* Header */}
            <div className="bg-brand-navy p-4 border-b border-brand-gold/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-brand-gold/20 flex items-center justify-center border border-brand-gold/30">
                    <span className="font-serif text-[10px] text-brand-gold font-bold">AJ</span>
                  </div>
                  <div className="w-2.5 h-2.5 bg-emerald-500 border border-[#090b14] rounded-full absolute bottom-0 right-0 animate-ping" />
                </div>
                <div>
                  <h4 className="font-serif text-[11px] text-brand-cream uppercase font-bold tracking-wider">Anjuman Royal Concierge</h4>
                  <span className="text-[9px] text-[#A1BBA1] font-mono font-medium block">9:00 AM - 11:00 PM IST</span>
                </div>
              </div>
              <span className="text-[8px] bg-brand-gold/10 text-brand-gold border border-brand-gold/20 font-mono px-1.5 py-0.5 rounded">ONLINE</span>
            </div>

            {/* Message Area */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3 scrollbar-thin bg-black/30">
              
              {/* Outside hours warning info */}
              <div className="p-2.5 bg-[#0e101d] rounded border border-brand-gold/10 text-[9px] text-brand-cream/70 flex gap-2 leading-relaxed">
                <Info className="w-3.5 h-3.5 text-brand-gold shrink-0 mt-0.5" />
                <span>Our elite butler guides respond instantly. Outside office hours a bot fallback captures questions.</span>
              </div>

              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-2.5 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-brand-gold/90 text-brand-black rounded-tr-none font-medium' 
                      : 'bg-brand-navy text-brand-cream border border-brand-gold/10 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className="block text-[8px] opacity-60 text-right mt-1 font-mono">{msg.time}</span>
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick helper buttons */}
            <div className="p-2 border-t border-brand-gold/10 bg-[#06070c] flex flex-wrap gap-1">
              <button onClick={() => handleQuickChatClick('Rooms Pricing & Bookings')} className="text-[8px] bg-brand-black hover:bg-brand-navy p-1 px-2 border border-brand-gold/15 text-brand-cream rounded-full">Suite Rates</button>
              <button onClick={() => handleQuickChatClick('Wedding Services Quotation')} className="text-[8px] bg-brand-black hover:bg-brand-navy p-1 px-2 border border-brand-gold/15 text-brand-cream rounded-full">Royal Wedding</button>
              <button onClick={() => handleQuickChatClick('How to Reach from Airport')} className="text-[8px] bg-brand-black hover:bg-brand-navy p-1 px-2 border border-brand-gold/15 text-brand-cream rounded-full">Reach Route</button>
            </div>

            {/* Form Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-brand-gold/15 bg-brand-navy/60 flex gap-2">
              <input 
                type="text" 
                className="flex-1 bg-brand-black border border-brand-gold/15 rounded-lg py-1.5 px-3 text-[11px] text-brand-cream focus:outline-none focus:border-brand-gold"
                placeholder="Namaste! Ask concierge..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button type="submit" className="p-1.5 bg-brand-gold hover:bg-brand-cream text-brand-black rounded-lg transition-colors cursor-pointer">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        )}
      </div>

      {/* HEADER SECTION WITH DESIGNER BACKDROP */}
      <div className="text-center space-y-3 mb-8" id="contact-banner-branding">
        <span className="text-brand-gold font-mono tracking-[0.25em] text-[10px] uppercase font-extrabold px-3 py-1 bg-brand-gold/10 border border-brand-gold/25 rounded-full inline-block">
          {language === 'EN' ? 'REQUISITIONS & CONCIERGE NETWORK' : 'शाही संकलन विभाग एवं संपर्क केंद्र'}
        </span>
        <h1 className="font-serif text-3xl md:text-5xl text-brand-cream tracking-wide uppercase">
          {language === 'EN' ? 'Lakeside Palace Helpdesk' : 'हेल्प डेस्क एवं आरक्षित पूछताछ'}
        </h1>
        <p className="text-xs text-brand-cream/60 max-w-2xl mx-auto font-sans leading-relaxed">
          {language === 'EN' 
            ? 'Connect directly to our imperial guides, lodge bespoke banquet inquiries, or navigate secure coordinates to Pichola Lake with zero friction.'
            : 'शाही महल में ठहरने, शादी-समारोह के आयोजन अथवा किसी भी प्रकार की सहायता हेतु सीधे हमारे राजकीय कर्मियों से विमर्श करें।'}
        </p>

        {/* TAB CONTROLLER STRIP */}
        <div className="flex justify-center gap-4 pt-6 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-3 text-[10px] font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer border ${
              activeTab === 'contact' 
                ? 'bg-gold-gradient text-brand-navy border-transparent shadow-lg font-black scale-105' 
                : 'bg-brand-black border-brand-gold/15 text-brand-cream/70 hover:border-brand-gold/40'
            }`}
          >
            📞 {language === 'EN' ? 'General Contact' : 'सामान्य संपर्क'}
          </button>
          
          <button
            onClick={() => setActiveTab('enquiry')}
            className={`flex-1 py-3 text-[10px] font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer border relative ${
              activeTab === 'enquiry' 
                ? 'bg-gold-gradient text-brand-navy border-transparent shadow-lg font-black scale-105' 
                : 'bg-brand-black border-brand-gold/15 text-brand-cream/70 hover:border-brand-gold/40'
            }`}
            id="priority-enquiry-tab-trigger"
          >
            💍 {language === 'EN' ? 'Priority Events' : 'शाही प्रायिकता पूछताछ'}
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-[8px] font-black uppercase text-white px-1 py-0.5 rounded-full border border-[#090b14]">ASAP</span>
          </button>
        </div>
      </div>

      {/* =========================================
          TAB A: GENERAL REACH-OUT DESK (contact.html)
          ========================================= */}
      {activeTab === 'contact' && (
        <div className="space-y-12 animate-fade-in" id="contact-tab-pane">
          
          {/* THREE DETAILED COORDINATES ROW CARD STACKS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* CARD 1: PHONE */}
            <div className="bg-[#0b0c15] border border-brand-gold/15 rounded-2xl p-6 space-y-4 hover:border-brand-gold/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/15 flex items-center justify-center border border-brand-gold/25 text-brand-gold">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif text-md text-brand-cream uppercase tracking-wide">
                  {language === 'EN' ? 'Call Concierge Desk' : 'दरबार संपर्क दूरभाष'}
                </h3>
                <div className="space-y-1 text-xs text-brand-cream/80 font-mono flex flex-col">
                  <a href="tel:+912942428888" className="text-sm text-brand-gold font-bold hover:underline py-1.5 min-h-[44px] flex items-center gap-1.5 transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                    <span>+91-294-242-8888</span>
                  </a>
                  <a href="tel:+919929428888" className="text-sm text-brand-gold font-bold hover:underline py-1.5 min-h-[44px] flex items-center gap-1.5 transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                    <span>+91-99294-28888</span>
                  </a>
                  <a href="https://wa.me/919929428888" target="_blank" referrerPolicy="no-referrer" className="text-sm text-emerald-400 font-bold hover:underline py-1.5 min-h-[44px] flex items-center gap-1.5 transition-colors">
                    <i className="fa-brands fa-whatsapp text-md"></i>
                    <span>WhatsApp Reservations</span>
                  </a>
                </div>
                <div className="pt-2 border-t border-brand-gold/10 space-y-0.5 text-[10px] text-brand-cream/60 font-mono">
                  <p className="flex justify-between"><span>Reception / Butler Desk:</span> <span className="text-brand-cream">24/7 Active</span></p>
                  <p className="flex justify-between"><span>Holiday Reservations:</span> <span className="text-brand-cream">9AM-9PM IST</span></p>
                </div>
              </div>
            </div>

            {/* CARD 2: EMAILS */}
            <div className="bg-[#0b0c15] border border-brand-gold/15 rounded-2xl p-6 space-y-4 hover:border-brand-gold/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/15 flex items-center justify-center border border-brand-gold/25 text-brand-gold">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif text-md text-brand-cream uppercase tracking-wide">
                  {language === 'EN' ? 'Secure Electronic Correspondence' : 'वैद्युत ईमेल पेटी'}
                </h3>
                <div className="space-y-1 text-xs text-brand-cream/80 font-mono flex flex-col">
                  <a href="mailto:info@anjumanhotel.com" className="text-brand-gold font-medium hover:underline py-1 min-h-[44px] flex items-center gap-1.5 transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                    <span>info@anjumanhotel.com</span>
                  </a>
                  <a href="mailto:reservations@anjumanhotel.com" className="text-brand-gold font-medium hover:underline py-1 min-h-[44px] flex items-center gap-1.5 transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                    <span>reservations@anjumanhotel.com</span>
                  </a>
                  <a href="mailto:events@anjumanhotel.com" className="text-brand-gold font-medium hover:underline py-1 min-h-[44px] flex items-center gap-1.5 transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                    <span>events@anjumanhotel.com</span>
                  </a>
                </div>
                <div className="pt-2 border-t border-brand-gold/10 text-[10px] text-brand-cream/60 font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" />
                  <span>Avg Response Speed: <strong>Within 2 Hours</strong></span>
                </div>
              </div>
            </div>

            {/* CARD 3: MAPS COORDINATES */}
            <div className="bg-[#0b0c15] border border-brand-gold/15 rounded-2xl p-6 space-y-4 hover:border-brand-gold/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/15 flex items-center justify-center border border-brand-gold/25 text-brand-gold">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif text-md text-brand-cream uppercase tracking-wide">
                  {language === 'EN' ? 'Palace Sanctuary Grounds' : 'राजकीय परिसर पता'}
                </h3>
                <p className="text-xs text-brand-cream/75 leading-relaxed font-sans">
                  The Anjuman Palace Sanctuary, Lake Pichola West Promenade Road, Near Jagdish Temple, Udaipur - 313001, Rajasthan, India.
                </p>
                <div className="pt-2">
                  <a 
                    href="https://maps.google.com/?q=Lake+Pichola,+Udaipur,+Rajasthan,+India" 
                    target="_blank" 
                    referrerPolicy="no-referrer"
                    className="inline-flex items-center gap-1.5 text-xs text-brand-gold hover:underline py-2 min-h-[44px] transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{language === 'EN' ? 'Open in Google Maps App' : 'गूगल मैप्स में खोलें'}</span>
                  </a>
                </div>
                <div className="pt-2 border-t border-brand-gold/10 space-y-1 text-[10px] text-brand-cream/60 font-mono">
                  <p>📍 Landmarks: Lake Palace lookout, City Palace (500m)</p>
                  <p>✈️ Airport Hub: 22 km distance</p>
                  <p>🚂 Central Train Hub: 3 km distance</p>
                </div>
              </div>
            </div>

          </div>

          {/* MAIN INTERACTIVE FORM & SUB COORDINATES COLUMN GROUP */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* CONVIER CORNER FORM FOR INTAKES */}
            <div className="lg:col-span-8 bg-[#0b0c15] border border-brand-gold/20 rounded-2xl p-6 md:p-8 space-y-6">
              
              <div className="border-b border-brand-gold/10 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-xl tracking-wider text-brand-gold uppercase">
                    {language === 'EN' ? 'Bespoke Enquiry Form' : 'पारंपरिक संपर्क प्रपत्र'}
                  </h2>
                  <p className="text-[10px] text-brand-cream/50 uppercase font-mono mt-0.5">Please populate precise elements below</p>
                </div>
                <span className="text-[9px] text-[#A1BBA1] font-mono bg-[#A1BBA1]/10 px-2 py-0.5 border border-[#A1BBA1]/20 rounded">SECURE CORNER</span>
              </div>

              {generalSuccess && (
                <div className="p-4 bg-brand-gold text-brand-black text-xs font-semibold rounded-lg text-center animate-fade-in shadow-lg">
                  {generalSuccess}
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-5">
                
                {/* Real First + Last name fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wide">First Name*</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream placeholder-brand-white/10 focus:outline-none focus:border-brand-gold"
                      placeholder="e.g. Maharana"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wide">Last Name*</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream placeholder-brand-white/10 focus:outline-none focus:border-brand-gold"
                      placeholder="e.g. Mewar-Sinha"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Email and validated mobile +91 fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wide">E-Mail Address*</label>
                    <input 
                      type="email" 
                      required
                      className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream placeholder-brand-white/15 focus:outline-none focus:border-brand-gold"
                      placeholder="dignitary@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wide">Mobile Number* (+91 Format)</label>
                    <input 
                      type="tel" 
                      required
                      pattern="^[+]91[0-9]{10}$"
                      className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream font-mono placeholder-brand-white/15 focus:outline-none focus:border-brand-gold"
                      placeholder="e.g. +919988776655"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                    <span className="text-[9px] text-brand-cream/40 block">Requires +91 prefix and exactly 10 decimals.</span>
                  </div>
                </div>

                {/* Subject selection dropdown list */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wide">Subject Query</label>
                    <select 
                      className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream focus:outline-none focus:border-brand-gold cursor-pointer"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    >
                      <option value="Room Booking">🏨 Room Booking</option>
                      <option value="Restaurant Reservation">🍽️ Restaurant Reservation</option>
                      <option value="Event/Banquet Inquiry">💍 Event/Banquet Inquiry</option>
                      <option value="Spa Appointment">🌸 Spa Appointment</option>
                      <option value="Corporate Inquiry">💼 Corporate Inquiry</option>
                      <option value="Feedback">⭐ Feedback / Testimonial</option>
                      <option value="Complaint">⚠️ Service Complaint</option>
                      <option value="Other">❓ Other general query</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wide">Preferred Contact</label>
                    <div className="flex gap-1.5 pt-1">
                      {(['Call', 'Email', 'WhatsApp'] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPrefMethod(method)}
                          className={`flex-1 py-1.5 text-[9px] font-bold uppercase rounded cursor-pointer transition-colors ${
                            prefMethod === method ? 'bg-brand-gold text-brand-black font-extrabold' : 'bg-brand-black text-brand-cream border border-brand-gold/15'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wide">Preferred Call Slot</label>
                    <div className="flex gap-1.5 pt-1">
                      {(['Morning', 'Afternoon', 'Evening'] as const).map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setPrefTime(time)}
                          className={`flex-1 py-1.5 text-[8px] font-bold uppercase rounded cursor-pointer transition-colors ${
                            prefTime === time ? 'bg-indigo-600 text-white font-extrabold' : 'bg-brand-black text-brand-cream border border-brand-gold/15'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Secure Message requirement text with count validator */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <label className="uppercase font-bold text-brand-cream tracking-wide">Historical Requirement message*</label>
                    <span className={`font-mono ${message.length >= 20 ? 'text-emerald-400' : 'text-amber-500'}`}>
                      {message.length} / 20 chars min
                    </span>
                  </div>
                  <textarea 
                    required
                    rows={4}
                    className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream placeholder-brand-white/10 focus:outline-none focus:border-brand-gold"
                    placeholder="Write details of your royal stay or query in detail (minimum 20 characters)..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                {/* File Attachment Drag & Drop Mock Area */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wide block">Event / RFP Document Attachment (Optional)</label>
                  
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                      dragOver ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-gold/15 hover:border-brand-gold/30'
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      onChange={handleFileChange} 
                      accept=".pdf,.doc,.docx,.jpg,.png"
                    />
                    
                    {attachedFile ? (
                      <div className="flex items-center justify-between bg-brand-black/60 p-2 rounded-lg text-xs leading-none">
                        <div className="flex items-center gap-2 text-brand-cream">
                          <FileUp className="w-4 h-4 text-brand-gold" />
                          <span className="font-medium max-w-[200px] truncate">{attachedFile.name}</span>
                          <span className="text-[10px] text-brand-cream/50">({attachedFile.size})</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setAttachedFile(null);
                          }}
                          className="p-1 hover:text-red-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 text-brand-cream/60">
                        <FileUp className="w-5 h-5 text-brand-gold/50 mx-auto" />
                        <p className="text-[10px]">Drag & drop event requirement PDF/images here, or <span className="text-brand-gold underline font-bold">browse</span></p>
                        <p className="text-[8px] font-mono opacity-50">Supported: PDF, DOCX, PNG, JPG (Max 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* CAPTCHA calculation row */}
                <div className="p-3 bg-brand-black/60 rounded-xl border border-brand-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-brand-navy rounded font-mono text-xs font-bold text-brand-gold">{captchaNum1}</span>
                    <span className="text-brand-cream text-xs">+</span>
                    <span className="px-2 py-1 bg-brand-navy rounded font-mono text-xs font-bold text-brand-gold">{captchaNum2}</span>
                    <span className="text-brand-cream text-xs">=</span>
                    <input 
                      type="text" 
                      required
                      placeholder="Calculate sum"
                      className="w-24 bg-brand-black border border-brand-gold/25 rounded-lg py-1 px-2.5 text-xs text-brand-cream font-mono focus:outline-none"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                    />
                  </div>

                  {captchaError && (
                    <span className="text-[10px] text-red-400 font-mono font-bold">⚠️ Correct sum verification required.</span>
                  )}

                  <button 
                    type="button" 
                    onClick={generateCaptcha} 
                    className="text-[9px] underline text-brand-gold font-mono uppercase bg-transparent border-none cursor-pointer"
                  >
                    Refresh math
                  </button>
                </div>

                {/* Submit button with loader */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gold-gradient hover:brightness-110 disabled:brightness-75 text-brand-navy text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Verifying Coordinates...' : 'Transmit Sovereign Request'}</span>
                </button>

              </form>
            </div>

            {/* SIDEBAR CORNER: PRIVATE HELIPAD COORDINATES & COILED INFO */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* EMERGENCY CONTACTS CRIT PANEL */}
              <div className="bg-[#0b0c15] border border-red-500/20 rounded-2xl p-5 space-y-3 shadow-xl">
                <span className="text-[8px] text-red-400 font-bold uppercase tracking-widest font-mono block">🚑 EMERGENCY CONSOL</span>
                <h3 className="font-serif text-sm text-brand-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  <span>On-Premise Helplines</span>
                </h3>
                <p className="text-[10px] text-brand-cream/60 leading-relaxed font-sans">
                  The palace supports certified 24/7 on-call physicians, active defibrillators, and advanced fire response crews.
                </p>

                <div className="space-y-2 pt-2 border-t border-red-500/10 font-mono text-[10px]">
                  <div className="flex justify-between border-b border-red-500/5 pb-1 text-red-200">
                    <span>🚨 Medical Emergency:</span>
                    <strong className="text-white">+91 294 242 8111</strong>
                  </div>
                  <div className="flex justify-between border-b border-red-500/5 pb-1 text-orange-200">
                    <span>🏥 Clinic & Call Doctor:</span>
                    <strong className="text-white">+91 294 242 8222</strong>
                  </div>
                  <div className="flex justify-between text-yellow-100">
                    <span>🔥 Fire Safety desk:</span>
                    <strong className="text-white">+91 294 242 8333</strong>
                  </div>
                </div>
              </div>

              {/* Private Arrival / Transit guides */}
              <div className="bg-[#0b0c15] border border-brand-gold/15 rounded-2xl p-5 space-y-3.5 shadow-xl text-xs">
                <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-widest font-mono block">Arriving at Anjuman</span>
                <h3 className="font-serif text-xs text-brand-cream uppercase tracking-wider flex items-center gap-1.5">
                  <Map className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Travel Desk Coordinates</span>
                </h3>

                <div className="flex border-b border-brand-gold/10 pb-1 gap-1">
                  {(['Air', 'Train', 'Road'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setDirectionsTab(tab)}
                      className={`px-2 py-1 text-[9px] font-bold rounded cursor-pointer ${
                        directionsTab === tab ? 'bg-brand-gold text-brand-black' : 'bg-brand-black text-brand-cream'
                      }`}
                    >
                      {tab === 'Air' && <Plane className="w-3 h-3 inline-block mr-1" />}
                      {tab === 'Train' && <Train className="w-3 h-3 inline-block mr-1" />}
                      {tab === 'Road' && <Car className="w-3 h-3 inline-block mr-1" />}
                      {tab}
                    </button>
                  ))}
                </div>

                {directionsTab === 'Air' && (
                  <div className="space-y-1.5 text-[10px] leading-relaxed text-brand-cream/80 animate-fade-in">
                    <p>✈️ <strong>Maharana Pratap Airport (UDR):</strong> 22 km distance mapped via NH-48.</p>
                    <p>🚙 Elite Cadillac or sedan airport transport coordinates can be pre-arranged with the reception for ₹2,499+ taxes.</p>
                  </div>
                )}

                {directionsTab === 'Train' && (
                  <div className="space-y-1.5 text-[10px] leading-relaxed text-brand-cream/80 animate-fade-in">
                    <p>🚂 <strong>Udaipur Central Train Grid:</strong> 3 km distance.</p>
                    <p>🚕 Hotel shuttle departs every 2 hours on scheduled passenger train arrivals during daylight windows.</p>
                  </div>
                )}

                {directionsTab === 'Road' && (
                  <div className="space-y-1.5 text-[10px] leading-relaxed text-brand-cream/80 animate-fade-in">
                    <p>🚗 <strong>National Highways NH-48 & NH-58:</strong> Connected via tollways directly into Pichola west wing.</p>
                    <p>⚓ Secure gated checkpoints verify guest reservation PDFs before authorizing royal car park entrance.</p>
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>
      )}


      {/* =========================================
          TAB B: PRIORITY EVENTS & ENQUIRY (enquiry.html)
          ========================================= */}
      {activeTab === 'enquiry' && (
        <div className="space-y-12 animate-fade-in" id="enquiry-tab-pane">
          
          {/* TOP BENEFITS HEADER GRID */}
          <div className="bg-brand-navy/30 border border-brand-gold/25 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
            
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[17px]">💍</span>
              <h4 className="font-serif text-sm text-brand-cream uppercase font-bold tracking-wider">Dream Palace Weddings</h4>
              <p className="text-[10px] text-brand-cream/60 leading-relaxed font-sans">Full lakeside stage setup, royal horses, grand fireworks, and gourmet Mewar cooks.</p>
            </div>

            <div className="space-y-1 text-center md:text-left border-y md:border-y-0 md:border-x border-brand-gold/10 py-4 md:py-0 md:px-6">
              <span className="text-[17px]">💼</span>
              <h4 className="font-serif text-sm text-brand-cream uppercase font-bold tracking-wider">Corporate Banquets</h4>
              <p className="text-[10px] text-brand-cream/60 leading-relaxed font-sans font-medium">Bespoke projectors, seating layouts, organic buffets, and private helicopter transport grids.</p>
            </div>

            <div className="space-y-1 text-center md:text-left">
              <span className="text-[17px]">⏱</span>
              <h4 className="font-serif text-sm text-[#A1BBA1] uppercase font-bold tracking-wider">ASAP Call Response</h4>
              <p className="text-[10px] text-[#A1BBA1]/75 leading-relaxed font-sans">Tick the 30-minute recall badge to dispatch an experienced event butler coordinator immediately.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* PRIORITY FORM BODY */}
            <div className="lg:col-span-8 bg-[#0b0c15] border border-brand-gold/20 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
              
              <div className="border-b border-brand-gold/15 pb-3">
                <span className="text-[9px] text-[#A1BBA1] font-bold block uppercase tracking-widest font-mono">Guaranteed Dispatch Priority</span>
                <h2 className="font-serif text-xl text-brand-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-gold" />
                  <span>Sovereign Inquiry Portal</span>
                </h2>
              </div>

              <form onSubmit={handlePrioritySubmit} className="space-y-5">
                
                {/* SELECTOR TYPE BULLET PILLS */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wider block">1. Royal Event / Booking Category*</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { type: 'Room', label: '🏨 Suite Stay', desc: 'Suite blocks' },
                      { type: 'Wedding', label: '💍 Matrimony', desc: 'Destination wed' },
                      { type: 'Corporate', label: '💼 Corporate', desc: 'Luxury summits' },
                      { type: 'Occasion', label: '🎉 Occasion', desc: 'Birth Anniversary' },
                      { type: 'Package', label: '📦 Custom Pkg', desc: '3N/4D retreats' }
                    ].map((entry) => (
                      <button
                        key={entry.type}
                        type="button"
                        onClick={() => setPriEngType(entry.type as any)}
                        className={`p-3 rounded-xl cursor-pointer transition-all border text-left flex flex-col justify-between ${
                          priEngType === entry.type 
                            ? 'bg-brand-navy border-brand-gold text-brand-gold scale-[1.03] shadow-md' 
                            : 'bg-brand-black border-brand-gold/10 text-brand-cream/80 hover:bg-brand-navy/25'
                        }`}
                      >
                        <span className="text-xs font-extrabold">{entry.label}</span>
                        <span className="text-[8px] opacity-65 mt-1 font-mono leading-none block">{entry.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* VISUAL QUICK DETAILS (Name | Mobile | Email) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wide block">Your name*</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream focus:outline-none focus:border-brand-gold"
                      placeholder="e.g. Maharaja Ranjit"
                      value={priName}
                      onChange={(e) => setPriName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wide block">Mobile* (+91 Prefix)</label>
                    <input 
                      type="tel" 
                      required
                      pattern="^[+]91[0-9]{10}$"
                      className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream font-mono focus:outline-none focus:border-brand-gold"
                      placeholder="+919988776655"
                      value={priMobile}
                      onChange={(e) => setPriMobile(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wide block">Email Address*</label>
                    <input 
                      type="email" 
                      required
                      className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream focus:outline-none focus:border-brand-gold"
                      placeholder="noble@royalretreat.com"
                      value={priEmail}
                      onChange={(e) => setPriEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* TRIP METRICS (Expected date select & guests numerical metric) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wide block flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Target Celebration Date*</span>
                    </label>
                    <input 
                      type="date" 
                      className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream font-mono focus:outline-none focus:border-brand-gold"
                      value={priDate}
                      onChange={(e) => setPriDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wide block flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Expected Companion Guests Count*</span>
                    </label>
                    <input 
                      type="number" 
                      min={1} 
                      max={800}
                      className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream font-mono focus:outline-none focus:border-brand-gold"
                      value={priGuests}
                      onChange={(e) => setPriGuests(parseInt(e.target.value, 10))}
                    />
                  </div>
                </div>

                {/* BUDGET ESTIMATION INTERACTIVE RANGE SLIDER */}
                <div className="space-y-2 bg-brand-black/50 p-4 rounded-xl border border-brand-gold/10">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="uppercase font-bold text-brand-cream tracking-wider flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Curated Banquet Budget Range Allocation</span>
                    </span>
                    <span className="font-serif text-xs text-brand-gold font-bold">
                      ₹{priBudget.toLocaleString('en-IN')} INR
                    </span>
                  </div>
                  
                  <input 
                    type="range" 
                    min={50000} 
                    max={5000000} 
                    step={25000}
                    className="w-full h-1 bg-brand-navy rounded-lg appearance-none cursor-pointer accent-brand-gold"
                    value={priBudget}
                    onChange={(e) => setPriBudget(parseInt(e.target.value, 10))}
                  />
                  
                  <div className="flex justify-between text-[8px] text-brand-cream/40 font-mono">
                    <span>₹50K (Chamber stay option)</span>
                    <span>₹15L+ (Bespoke Udaipur courtyard weddings)</span>
                    <span>₹50 Lakhs (Ultra Imperial custom buyouts)</span>
                  </div>
                </div>

                {/* URGENCY RADIAL AND CALL OPTION TRAY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-brand-navy/20 border border-brand-gold/15 rounded-xl">
                  
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold tracking-wider text-brand-cream block">Inquiry Priority Mode</label>
                    <div className="flex gap-2">
                      {(['Normal', 'Urgent', 'ASAP'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setPriUrgency(mode)}
                          className={`flex-1 py-1 px-2.5 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                            priUrgency === mode 
                              ? 'bg-brand-gold text-brand-black scale-105 shadow-md font-extrabold' 
                              : 'bg-brand-black border border-brand-gold/10 text-brand-cream'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={priCallback}
                        onChange={(e) => setPriCallback(e.target.checked)}
                      />
                      <div className="w-9 h-5 bg-black peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                      <span className="ml-2 text-[10px] uppercase font-bold tracking-wider text-[#A1BBA1]">
                        📞 Callback in 30 Mins Guaranteed
                      </span>
                    </label>
                  </div>

                </div>

                {/* OPTIONAL SPECIAL REQUIREMENTS */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wide block">Specific requirements details</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-brand-black border border-brand-gold/15 rounded-lg py-2 px-3 text-xs text-brand-cream placeholder-brand-white/10 focus:outline-none focus:border-brand-gold"
                    placeholder="Provide dietary rules, high-security specifications, room count breakdowns, or structural mandap decoration themes..."
                    value={priReqs}
                    onChange={(e) => setPriReqs(e.target.value)}
                  />
                </div>

                {/* BUTTONS STACK (Primary Submit + Floating prefilled instant whatsapp trigger) */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-gold-gradient hover:brightness-110 text-brand-navy rounded-xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Secure Priority Bid Proposal</span>
                  </button>

                  <a
                    href={`https://wa.me/912942428888?text=Namaste!%20My%20name%20is%20interested%20in%20arranging%20a%20priority%20heritage%20booking.%20Details:%20Guests:%20${priGuests},%20Budget:%20INR%20${priBudget}.%20Connect%20me%20to%20coordinator%20promptly.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-4 px-6 bg-emerald-900/30 hover:bg-emerald-900/60 text-[#25D366] rounded-xl text-xs font-mono font-black uppercase tracking-wider border border-[#25D366]/30 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-[#25D366]" />
                    <span>Direct WhatsApp Inquiry</span>
                  </a>

                </div>

              </form>

            </div>

            {/* SIDEBAR STATISTICS FEEDBACK INPRIORITY */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* STATUS INDICATOR CARD */}
              <div className="bg-[#0b0c15] border border-brand-gold/20 rounded-2xl p-5 space-y-3.5 shadow-xl text-xs">
                <span className="text-[8px] text-amber-400 font-bold uppercase tracking-widest font-mono block">LIVE QUEUE METRICS</span>
                
                <h3 className="font-serif text-xs text-brand-cream uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-gold" />
                  <span>Interactive Butler Response status</span>
                </h3>

                <div className="space-y-2.5 pt-2 text-[11px] leading-relaxed">
                  <div className="p-2 bg-brand-black/40 border border-[#A1BBA1]/15 rounded flex items-center justify-between">
                    <span className="text-brand-cream/60">Active Coordinators now:</span>
                    <strong className="text-[#A1BBA1] font-mono">14 Active Duty</strong>
                  </div>
                  <div className="p-2 bg-brand-black/40 border border-[#A1BBA1]/15 rounded flex items-center justify-between">
                    <span className="text-brand-cream/60">Typical Call Delay:</span>
                    <strong className="text-brand-gold font-mono">11 Mins Response</strong>
                  </div>
                </div>

                <p className="text-[10px] text-brand-cream/60 border-t border-brand-gold/10 pt-3 italic">
                  "Udaipur's most trusted royal events organizers since 1996."
                </p>
              </div>

              {/* Secure Booking Policy Badge */}
              <div className="p-4 bg-brand-navy/30 border border-brand-gold/10 rounded-xl space-y-1">
                <span className="text-brand-gold text-[9px] font-bold uppercase tracking-widest block font-mono">🔓 sovereign privacy assurance</span>
                <p className="text-[10px] text-brand-cream/70 leading-relaxed font-medium">
                  We guarantee that your high-profile identity details are never logged in search indexes. High security protocol shields all visitor correspondence.
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* =========================================
          PRIORITY DISPATCH SUBMISSION SUCCESS MODAL
          ========================================= */}
      {showPriorityModal && modalDetails && (
        <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4" id="priority-success-modal">
          <div className="bg-[#090b14] border-2 border-brand-gold/60 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative overflow-hidden animate-fade-in text-xs text-brand-white">
            
            {/* Crown graphic backdrop */}
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-brand-gold/5 rounded-full blur-2xl pointer-events-none" />

            <div className="text-center space-y-2 pb-3 border-b border-brand-gold/15">
              <span className="text-2xl">👑</span>
              <h3 className="font-serif text-lg text-brand-gold uppercase tracking-wider">Mewar Protocol Acknowledged</h3>
              <p className="text-[9px] text-brand-cream/60 font-mono">UNIQUE CALL-SIGN TRAY CODE: {modalDetails.id}</p>
            </div>

            <p className="text-brand-cream/80 text-[11px] leading-relaxed text-center font-sans">
              Namaste, <strong>{modalDetails.name}</strong>. Your priority banquet bid for <strong>{modalDetails.enquiryType}</strong> event holds high-standing queues inside our concierge ledger. Note your reservation logistics below:
            </p>

            <div className="p-3 bg-brand-navy border border-brand-gold/20 rounded-lg space-y-1.5 font-mono text-[10px]">
              <div className="flex justify-between">
                <span className="text-brand-cream/50">Target Date:</span>
                <span className="text-white font-bold">{modalDetails.expectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-cream/50">Guests:</span>
                <span className="text-white font-bold">{modalDetails.guests} Nobles</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-cream/50">Estimated Budget Range:</span>
                <span className="text-brand-gold font-bold">₹{modalDetails.budgetRange.toLocaleString('en-IN')} INR</span>
              </div>
              <div className="flex justify-between text-[#A1BBA1]">
                <span>Concierge Recall Status:</span>
                <span className="font-bold underline">{modalDetails.callbackRequested ? 'GUARANTEED IN 30 MINS' : 'STANDARD 2 HOUR WINDOW'}</span>
              </div>
            </div>

            <div className="space-y-1 text-center">
              <span className="text-[9px] text-[#A1BBA1] block font-mono">📢 SMS & WHATSAPP AUTO-CONFIRMATION REPORT RETRIEVED</span>
              <p className="text-[10px] text-brand-cream/60 leading-tight">A response message has been automatically logged dynamically at phone {modalDetails.mobile}.</p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setShowPriorityModal(false)}
                className="flex-1 py-2.5 bg-brand-navy border border-brand-gold/20 text-brand-gold text-[10px] uppercase tracking-widest font-bold rounded-lg cursor-pointer"
              >
                Close Ticket
              </button>
              
              <a 
                href={`https://wa.me/912942428888?text=Namaste!%20Confirmed%20receipt%20for%20enquiry%20code%20${modalDetails.id}%20under%20the%20name%20${modalDetails.name}.%20Requesting%20call.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] uppercase font-mono tracking-wider rounded-lg flex items-center justify-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Verify WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}


      {/* =========================================
          SECTION 3: ACCORDION STYLE REQUISITE FAQS
          ========================================= */}
      <div className="space-y-6 pt-10 border-t border-brand-gold/15" id="contact-sec-faqs">
        
        <div className="text-center space-y-1">
          <span className="text-[8px] text-brand-gold font-bold uppercase tracking-widest font-mono">CURATED ROYAL REQUISITE MANUAL</span>
          <h2 className="font-serif text-xl md:text-2xl text-brand-cream uppercase tracking-wide">
            {language === 'EN' ? 'Elite Travelers Frequently Asked Questions' : 'शाही आगंतुकों के सामान्य प्रश्न संग्रह'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {FAQS.map((faq, index) => {
            const isOpen = !!faqStates[index];
            return (
              <div 
                key={index} 
                className="bg-[#0b0c15] border border-brand-gold/15 rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 flex items-center justify-between gap-3 bg-brand-black/40 hover:bg-brand-navy/20 cursor-pointer"
                >
                  <span className="font-serif text-xs md:text-sm text-brand-cream hover:text-brand-gold transition-colors font-semibold pr-2">
                    {language === 'EN' ? faq.q : faq.qHI}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-brand-gold shrink-0" /> : <ChevronDown className="w-4 h-4 text-brand-gold shrink-0" />}
                </button>

                {isOpen && (
                  <div className="p-4 pt-1.5 border-t border-brand-gold/10 text-xs text-brand-cream/70 leading-relaxed font-sans bg-[#0c0d16]">
                    {language === 'EN' ? faq.a : faq.aHI}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>


      {/* =========================================
          SECTION 4: GOOGLE MAPS EMBED & ROAD INSTRUCTS
          ========================================= */}
      <div className="space-y-6 border-t border-brand-gold/15 pt-10" id="contact-sec-maps">
        
        <div className="text-center space-y-1.5">
          <span className="text-[8px] text-brand-gold font-semibold uppercase tracking-widest block font-mono">UDAIPUR PICHOLA SATELLITE PLACEMENT</span>
          <h2 className="font-serif text-lg md:text-xl text-brand-white uppercase tracking-wider flex items-center justify-center gap-2">
            <Map className="w-5 h-5 text-brand-gold" />
            <span>Interactive Palace Location Coordinates</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch max-w-6xl mx-auto">
          
          {/* MAPS IFRAME BOX */}
          <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-brand-gold/25 h-72 lg:h-[350px] relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14508.411130635293!2d73.67431782633055!3d24.5761399723528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967e564bd9f0cb5%3A0x6a13d7494f479ee3!2sCity%20Palace%2C%20Udaipur!5e0!3m2!1sen!2sin!4v1716613517000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer"
              title="ANJUMAN Pichola Lake Site Position Map"
              className="filter grayscale brightness-[0.75] contrast-[1.1] hover:grayscale-0 transition-all duration-700"
            />
          </div>

          {/* TRAVEL SPECIFICATIONS SIDE COLUMN */}
          <div className="lg:col-span-4 bg-[#0b0c15] border border-brand-gold/15 rounded-2xl p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-widest font-mono block">Udaipur Route Guide</span>
              <h4 className="font-serif text-xs text-brand-gold uppercase tracking-wider">How to Navigate Here</h4>
              
              <div className="space-y-3 font-sans text-[11px] leading-relaxed text-brand-cream/80">
                <p>📍 <strong>City Palace Entrance:</strong> Located 500 meters from our main checkpoint gates.</p>
                <p>🚉 <strong>Airport Shuttle:</strong> Standard pick-ups occur near column terminal 2 of Udaipur Airport.</p>
                <p>🛣️ <strong>Secure Lake Boat:</strong> Private dock transfers are active 24/7 coordinates directly mapping to Jag Mandir dock.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-gold/10 text-[9px] text-brand-cream/40 font-mono text-center">
              Coordinated via <strong className="text-brand-gold">ANJUMAN concierge satellite grid</strong> 2026.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
