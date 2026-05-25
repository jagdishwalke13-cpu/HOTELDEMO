import React, { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { UserSession } from '../types';
import { 
  Camera, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  KeyRound, 
  MapPin, 
  CreditCard, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Award, 
  Clock, 
  Sparkles, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  X,
  Facebook,
  Smartphone
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserSession) => void;
  language: 'EN' | 'HI';
}

const INDIAN_STATES_LIST = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry'
];

export default function LoginModal({ isOpen, onClose, onLoginSuccess, language }: LoginModalProps) {
  // Modal states: 'login' | 'register' | 'forgot' | 'otp_verify'
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot' | 'otp_verify'>('login');
  
  // Login standard fields
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('AnjumanPass123!');
  const [rememberMe, setRememberMe] = useState(true);
  const [loginWithOtpMode, setLoginWithOtpMode] = useState(false);

  // Registration fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [anniversaryDate, setAnniversaryDate] = useState('');

  // Address
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Rajasthan');
  const [pinCode, setPinCode] = useState('');
  const [country] = useState('India');

  // ID Verification
  const [idType, setIdType] = useState('Aadhaar Card');
  const [idNumber, setIdNumber] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);

  // Profile photo attachment
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [cropScale, setCropScale] = useState(1);

  // Password assessment utility
  const [passStrength, setPassStrength] = useState({ score: 0, text: 'Weak', color: 'bg-red-500' });

  // OTP Verification state
  const [otpSentTo, setOtpSentTo] = useState('');
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [otpVerificationPurpose, setOtpVerificationPurpose] = useState<'login' | 'register' | 'forgot'>('register');

  // Forgot Password
  const [forgotInput, setForgotInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Notifications
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Password strength checker trigger
  useEffect(() => {
    if (!password) {
      setPassStrength({ score: 0, text: 'No password', color: 'bg-gray-600' });
      return;
    }
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let text = 'Weak';
    let color = 'bg-red-500';
    if (score === 2) {
      text = 'Medium';
      color = 'bg-orange-400';
    } else if (score === 3) {
      text = 'Strong';
      color = 'bg-yellow-400';
    } else if (score >= 4) {
      text = 'Sovereign-Grade!';
      color = 'bg-emerald-500';
    }

    setPassStrength({ score, text, color });
  }, [password]);

  // Handle countdown Timer
  useEffect(() => {
    let interval: any = null;
    if (activeTab === 'otp_verify' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTab, resendTimer]);

  // Autofill City/State based on Indian Pincode mock
  useEffect(() => {
    if (pinCode.length === 6) {
      const pinPrefix = pinCode.substring(0, 3);
      if (pinPrefix === '313' || pinPrefix === '302') {
        setCity('Udaipur');
        setStateName('Rajasthan');
      } else if (pinPrefix === '110') {
        setCity('New Delhi');
        setStateName('Delhi');
      } else if (pinPrefix === '400') {
        setCity('Mumbai');
        setStateName('Maharashtra');
      } else {
        setCity('Udaipur');
        setStateName('Rajasthan');
      }
    }
  }, [pinCode]);

  if (!isOpen) return null;

  // Simulate verification OTP trigger
  const triggerOtpDispatch = (target: string, purpose: 'login' | 'register' | 'forgot') => {
    setErrorMsg('');
    setSuccessMsg('');
    setOtpSentTo(target);
    setOtpVerificationPurpose(purpose);
    setResendTimer(30);
    setOtpValues(['', '', '', '', '', '']);
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg(language === 'EN' ? `✔ Security OTP code logged & sent to ${target}` : `✔ सुरक्षा ओटीपी कोड ${target} पर भेजा गया है`);
      setActiveTab('otp_verify');
      setTimeout(() => otpInputsRef.current[0]?.focus(), 100);
    }, 1200);
  };

  // Mock Photo selector
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // OTP Digits change management
  const handleOtpDigitChange = (val: string, index: number) => {
    if (/[^0-9]/.test(val)) return;
    const nextArr = [...otpValues];
    nextArr[index] = val;
    setOtpValues(nextArr);
    
    // Auto shift focus forward
    if (val && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // OTP Code Verification Trigger
  const handleVerifyOtpInput = (e: FormEvent) => {
    e.preventDefault();
    const joined = otpValues.join('');
    if (joined.length < 6) {
      setErrorMsg(language === 'EN' ? 'Please complete the full 6-digit credential token.' : 'कृपया ६ अंकों का पूरा कूपन टोकन प्रविष्ट करें।');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg(language === 'EN' ? '✔ Integrity token authorized.' : '✔ सुरक्षा प्रमाणीकरण टोकन स्वीकृत।');
      
      if (otpVerificationPurpose === 'register') {
        // Complete registration write to LocalStorage
        const finalSession: UserSession = {
          fullName: `${firstName} ${lastName}`,
          email: email || 'connoisseur@anjuman.com',
          phone: phone || '+91 99999 88888',
          isRegistered: true,
          avatarSeed: photoPreview ? 'custom-uploaded-photo' : Math.random().toString(36).substring(2, 6)
        };
        
        // Save loyalty points initialization (1,000 points welcome bonus!)
        localStorage.setItem('anjuman_user', JSON.stringify(finalSession));
        localStorage.setItem('anjuman_loyalty_points', '1000');
        localStorage.setItem('anjuman_loyalty_tier', 'Silver');
        
        // Add default Achievement points log
        const initialLog = [
          { id: 'AC-1', description: 'Elite Membership Starter Bonus', pts: 1000, type: 'earned', date: '2026-05-25' }
        ];
        localStorage.setItem('anjuman_loyalty_history', JSON.stringify(initialLog));

        // Create a default initial booking if none exists to populate dashboard
        const defaultCreatedBooking = {
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
        localStorage.setItem('anjuman_bookings', JSON.stringify([defaultCreatedBooking]));

        setTimeout(() => {
          onLoginSuccess(finalSession);
          onClose();
        }, 1200);

      } else if (otpVerificationPurpose === 'forgot') {
        // Switch to setting new password
        setActiveTab('forgot');
        setForgotInput('verified_stage_code');
      } else {
        // Login verified
        const mockUser: UserSession = {
          fullName: 'Maharaja Jagdish Walke',
          email: 'jagdishwalke13@gmail.com',
          phone: '+91 99999 88888',
          isRegistered: true,
          avatarSeed: 'maharaja-13'
        };
        localStorage.setItem('anjuman_user', JSON.stringify(mockUser));
        onLoginSuccess(mockUser);
        onClose();
      }
    }, 1500);
  };

  // Primary Login Submission
  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmailOrPhone) {
      setErrorMsg(language === 'EN' ? 'Please provide credentials.' : 'कृपया प्रमाणपत्र दर्ज करें।');
      return;
    }

    if (loginWithOtpMode) {
      triggerOtpDispatch(loginEmailOrPhone, 'login');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Demo logic
      const stored = localStorage.getItem('anjuman_user');
      const parsedUser = stored ? JSON.parse(stored) : null;
      
      const loggedUser: UserSession = parsedUser || {
        fullName: 'Maharaja Jagdish Walke',
        email: 'jagdishwalke13@gmail.com',
        phone: '+91 99999 88888',
        isRegistered: true,
        avatarSeed: 'maharaja-13'
      };

      // Set user
      localStorage.setItem('anjuman_user', JSON.stringify(loggedUser));
      setSuccessMsg(language === 'EN' ? '✔ Access granted. Welcome back!' : '✔ पहुंच स्वीकृत। सुस्वागतम!');
      
      setTimeout(() => {
        onLoginSuccess(loggedUser);
        onClose();
      }, 1200);
    }, 1500);
  };

  // Primary Registration Submission
  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !password || !dob) {
      setErrorMsg(language === 'EN' ? 'Please enter all mandated star fields.' : 'कृपया सभी आवश्यक फ़ील्ड दर्ज करें।');
      return;
    }

    // Password matches validation check
    if (password !== confirmPassword) {
      setErrorMsg(language === 'EN' ? 'Lease Passcode and verification passcode do not match.' : 'पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।');
      return;
    }

    // Dob age verification
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      setErrorMsg(language === 'EN' ? 'You must be at least 18 years old to establish a legal royalty account.' : 'शाही खाता स्थापित करने के लिए न्यूनतम आयु १८ वर्ष है।');
      return;
    }

    // Verification ID cards checks
    if (!idNumber.trim()) {
      setErrorMsg(language === 'EN' ? 'Identity verification code is mandated.' : 'पहचान पत्र संख्या आवश्यक है।');
      return;
    } else {
      if (idType === 'Aadhaar Card' && idNumber.replace(/\D/g, '').length !== 12) {
        setErrorMsg(language === 'EN' ? 'Aadhaar Card contains 12 digits.' : 'आधार संख्या १२ अंक होनी चाहिए।');
        return;
      } else if (idType === 'PAN Card' && !/[A-Z]{5}[0-9]{4}[A-Z]{1}/i.test(idNumber)) {
        setErrorMsg(language === 'EN' ? 'PAN Card layout invalid (eg: ABCDE1234F).' : 'पैन प्रारूप अमान्य है (उदा: ABCDE1234F)।');
        return;
      }
    }

    if (!acceptTerms || !acceptPrivacy) {
      setErrorMsg(language === 'EN' ? 'You must acknowledge the sovereign charter regulations.' : 'आपको नियमों को स्वीकृत करना होगा।');
      return;
    }

    // Dispatch verification OTP code to phone
    triggerOtpDispatch(phone, 'register');
  };

  // Forgotten Password Code submission
  const handleForgotSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (activeTab === 'forgot' && forgotInput !== 'verified_stage_code') {
      if (!forgotInput || (!forgotInput.includes('@') && forgotInput.replace(/\D/g, '').length < 10)) {
        setErrorMsg(language === 'EN' ? 'Please enter a valid email or 10-digit mobile.' : 'कृपया वैध ईमेल या मोबाइल नंबर दर्ज करें।');
        return;
      }
      triggerOtpDispatch(forgotInput, 'forgot');
    } else {
      // Password resetting state updates
      if (newPassword.length < 8) {
        setErrorMsg(language === 'EN' ? 'Min 8 chars with upper case & specials are required.' : 'कम से कम ८ अंक और विशेष अक्षर आवश्यक हैं।');
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setErrorMsg(language === 'EN' ? 'Retype matching passcodes.' : 'नया पासवर्ड मेल नहीं खाता।');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSuccessMsg(language === 'EN' ? '✔ Passtoken altered successfully! Redirecting...' : '✔ नया पासवर्ड बदल दिया गया है! पुनर्निर्देशित किया जा रहा है...');
        
        setTimeout(() => {
          setActiveTab('login');
          setLoginEmailOrPhone(forgotInput);
        }, 1500);
      }, 1500);
    }
  };

  const handleInstantDemo = () => {
    const demo: UserSession = {
      fullName: 'Maharaja Jagdish Walke',
      email: 'jagdishwalke13@gmail.com',
      phone: '+91 99999 88888',
      isRegistered: true,
      avatarSeed: 'maharaja-13'
    };
    localStorage.setItem('anjuman_user', JSON.stringify(demo));
    localStorage.setItem('anjuman_loyalty_points', '1000');
    localStorage.setItem('anjuman_loyalty_tier', 'Silver');
    onLoginSuccess(demo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 overflow-y-auto" id="anjuman-sovereign-registry-modal">
      
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#02020a]/90 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container Card */}
      <div className="relative w-full max-w-4xl bg-[#0b0c15] border border-brand-gold/30 rounded-2xl text-brand-white shadow-3xl overflow-hidden my-8 z-10 flex flex-col md:flex-row max-h-[90vh]">
        
        {/* LEFT EMBEDDED COLUMN: PRIVILEGES LOYALTY SIGNUP BANNER */}
        <div className="w-full md:w-80 shrink-0 bg-[#08080f] p-6 border-b md:border-b-0 md:border-r border-brand-gold/15 flex flex-col justify-between overflow-y-auto pb-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6 text-brand-gold fill-current" viewBox="0 0 24 24">
                <path d="M2 4l3 6 7-7 7 7 3-6-2 16H4L2 4z" />
              </svg>
              <span className="font-serif text-sm tracking-[0.25em] text-brand-gold gold-glow font-extrabold uppercase">
                ANJUMAN PRIVILEGE
              </span>
            </div>

            <div className="p-4 bg-brand-gold/5 border border-brand-gold/20 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-brand-gold text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Privilege Club Tiers</span>
              </div>
              <p className="text-[10px] text-brand-cream/70 leading-relaxed">
                Enjoy world-class upgrades, complimentary spallations, and heliport pickup amenities matching your sovereign stature.
              </p>
            </div>

            {/* Loyalty tier lists */}
            <div className="space-y-3">
              {[
                { name: 'Silver Tier', pts: '1,000+ points', perks: 'Welcome upgrade + Complimentary Hammam Entry', cls: 'border-slate-500/20 text-slate-300' },
                { name: 'Gold Tier', pts: '5,000+ points', perks: 'Room upgrade + Royal High Tea lounge hospitality', cls: 'border-[#c19a4e]/20 text-[#D4AF37]' },
                { name: 'Platinum Tier', pts: '15,000+ points', perks: 'Private butler assignment + Free pick up service', cls: 'border-[#dfdfdf]/20 text-indigo-200' },
                { name: 'Royal Order', pts: '50,000+ points', perks: 'Helipad transfers + All-Meals Mewar organic catering', cls: 'border-[#ffce54]/30 text-emerald-300' }
              ].map((tier, idx) => (
                <div key={idx} className={`p-3 rounded-lg border bg-brand-black/40 text-[10px] space-y-1 ${tier.cls}`}>
                  <div className="flex justify-between font-bold uppercase tracking-wider">
                    <span>{tier.name}</span>
                    <span className="font-mono">{tier.pts}</span>
                  </div>
                  <p className="text-brand-white/50 text-[9px] italic">✔ {tier.perks}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-brand-gold/10 text-center">
            <p className="text-[9px] text-brand-cream/40 font-mono">
              ★ NO INITIAL FEES • 1 INR = 1 POINT • 1,000 PTS WELCOME GIFT ★
            </p>
          </div>
        </div>

        {/* RIGHT INTERACTIVE COLUMN: REGISTRATION AND LOGIN FIELDS */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto relative flex flex-col justify-between">
          
          {/* HEADER ROW */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[9px] text-brand-gold font-bold uppercase tracking-[0.2em] block mb-0.5">
                {activeTab === 'login' && 'CONNOISSEUR GATEWAY'}
                {activeTab === 'register' && 'LOYALTY REGISTRY'}
                {activeTab === 'forgot' && 'CREDENTIAL RETRIEVAL'}
                {activeTab === 'otp_verify' && 'SECURITY VALIDATOR'}
              </span>
              <h2 className="font-serif text-2xl text-brand-cream tracking-wide uppercase">
                {activeTab === 'login' && (language === 'EN' ? 'Sovereign Sign In' : 'शाही लॉगिन')}
                {activeTab === 'register' && (language === 'EN' ? 'Create Anjuman Account' : 'शाही विश्राम पंजीकरण')}
                {activeTab === 'forgot' && (language === 'EN' ? 'Forgotten Passcode' : 'पासकोड सुधारें')}
                {activeTab === 'otp_verify' && (language === 'EN' ? 'Verify Secure Token' : 'ओटीपी सत्यापन प्रविष्टि')}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 px-2.5 bg-brand-black hover:bg-brand-navy border border-brand-gold/20 text-brand-gold font-bold rounded-lg cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Feedback logs */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-500/20 text-red-300 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/20 text-emerald-300 text-xs rounded-lg flex items-center gap-2 animate-pulse">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* =========================================
              VIEW FLOW: LOGIN DETAILS FORM
              ========================================= */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-[#ccd5e0] block">
                  {language === 'EN' ? 'Registered Email or Mobile ID*' : 'पंजीकृत ईमेल या मोबाइल नंबर*'}
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    required
                    className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2.5 pl-9 pr-3.5 text-xs text-brand-cream focus:border-brand-gold focus:outline-none transition-luxury"
                    placeholder="e.g. jagdishwalke13@gmail.com"
                    value={loginEmailOrPhone}
                    onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                  />
                  <Mail className="w-4 h-4 text-brand-gold/60 absolute left-3 top-3" />
                </div>
              </div>

              {!loginWithOtpMode && (
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#ccd5e0] block">
                    {language === 'EN' ? 'Secret Passphrase*' : 'गोपनीय पासवर्ड*'}
                  </label>
                  <div className="relative">
                    <input 
                      type="password"
                      required
                      className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2.5 pl-9 pr-3.5 text-xs text-brand-cream focus:border-brand-gold focus:outline-none transition-luxury animate-fade-in"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <KeyRound className="w-4 h-4 text-brand-gold/60 absolute left-3 top-3" />
                  </div>
                </div>
              )}

              {/* Login mode and settings checkbox */}
              <div className="flex justify-between items-center text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    className="accent-brand-gold rounded font-medium" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-brand-cream/80">{language === 'EN' ? 'Remember login session' : 'लॉगिन याद रखें'}</span>
                </label>
                
                <button 
                  type="button" 
                  onClick={() => {
                    setErrorMsg('');
                    setSuccessMsg('');
                    setActiveTab('forgot');
                  }}
                  className="text-brand-gold/90 hover:underline font-semibold"
                >
                  {language === 'EN' ? 'Forget Passcode?' : 'पासवर्ड भूल गए?'}
                </button>
              </div>

              {/* OTP toggle helper link */}
              <div className="pt-2 text-center">
                <button 
                  type="button" 
                  onClick={() => setLoginWithOtpMode(!loginWithOtpMode)}
                  className="text-[11px] text-indigo-300 font-bold hover:underline flex items-center justify-center gap-1.5 mx-auto"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  {loginWithOtpMode 
                    ? (language === 'EN' ? 'Use Standard Password Code' : 'पासवर्ड द्वारा लॉगिन करें') 
                    : (language === 'EN' ? 'Sign In Easily via OTP Verification' : 'मोबाइल ओटीपी द्वारा त्वरित प्रवेश करें')}
                </button>
              </div>

              {/* Action submission row */}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gold-gradient text-brand-black text-xs font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-1 hover:brightness-110 active:scale-[0.98] transition-transform cursor-pointer"
              >
                {isLoading ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{loginWithOtpMode ? (language === 'EN' ? 'DESPATCH VERIFICATION OTP' : 'ओटीपी कोड भेजें') : (language === 'EN' ? 'UNLOCK SANCTUARY DOORS ➔' : 'शाही प्रवेश अनलॉक करें ➔')}</span>
                )}
              </button>

              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-brand-gold/10" /></div>
                <span className="relative bg-[#0b0c15] px-2.5 text-[9px] text-brand-cream/40 uppercase tracking-widest">or continue with credentials</span>
              </div>

              {/* SOCIAL REGISTRATION BUTTONS */}
              <div className="grid grid-cols-3 gap-2 text-[10px] font-bold uppercase tracking-wider">
                <button 
                  type="button"
                  onClick={handleInstantDemo}
                  className="py-2.5 border border-brand-gold text-brand-gold rounded hover:bg-brand-gold/10 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  ⚡ demo user
                </button>
                <button 
                  type="button"
                  onClick={() => handleInstantDemo()}
                  className="py-2.5 border border-brand-gold/15 text-brand-cream rounded hover:bg-brand-gold/10 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Facebook className="w-3.5 h-3.5" /> facebook
                </button>
                <button 
                  type="button"
                  onClick={() => handleInstantDemo()}
                  className="py-2.5 border border-brand-gold/15 text-brand-cream rounded hover:bg-brand-gold/10 flex items-center justify-center gap-1 cursor-pointer"
                >
                  🌐 google
                </button>
              </div>

              <div className="text-center pt-4 text-xs">
                <span className="text-brand-cream/60">{language === 'EN' ? 'New Guest Tier?' : 'क्या आप नये अतिथि हैं?'} </span>
                <button 
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setSuccessMsg('');
                    setActiveTab('register');
                  }}
                  className="text-brand-gold font-bold underline"
                >
                  {language === 'EN' ? 'Join Loyalty System' : 'अभी शामिल हों'}
                </button>
              </div>

            </form>
          )}

          {/* =========================================
              VIEW FLOW: REGISTER FORM WIZARD
              ========================================= */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scroll">
              
              {/* PROFILE PHOTO LOGIC WITH CROP TOOL MOCK */}
              <div className="bg-brand-black/40 p-4 rounded-xl border border-brand-gold/15 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-full border-2 border-brand-gold bg-brand-navy flex items-center justify-center overflow-hidden">
                    {photoPreview ? (
                      <img 
                        src={photoPreview} 
                        alt="cropping-prev" 
                        style={{ transform: `scale(${cropScale})` }}
                        className="w-full h-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <User className="w-8 h-8 text-brand-gold/50" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-1.5 bg-brand-gold hover:bg-brand-cream text-brand-black rounded-full cursor-pointer shadow-lg transition-transform hover:scale-105">
                    <Camera className="w-3.5 h-3.5" />
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
                  </label>
                </div>
                
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <span className="text-[10px] text-brand-gold uppercase tracking-wider font-bold block">{language === 'EN' ? 'Palace Profile Photo' : 'प्रोफ़ाइल फ़ोटो प्रविष्टि'}</span>
                  <p className="text-[9px] text-brand-cream/60">{language === 'EN' ? 'Optional upload. Circular crop window calibrated automatically.' : 'वैकल्पिक चित्र चयन। जेपीजी/पीएनजी चित्र अपलोड करें।'}</p>
                  
                  {isCropping && (
                    <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 animate-scale-in">
                      <span className="text-[9px] text-brand-gold font-mono uppercase font-bold">Zoom Scale: </span>
                      <input 
                        type="range" min="1" max="2.5" step="0.1" 
                        value={cropScale} 
                        onChange={(e) => setCropScale(parseFloat(e.target.value))}
                        className="w-24 accent-brand-gold cursor-pointer"
                      />
                      <button 
                        type="button" 
                        onClick={() => setIsCropping(false)}
                        className="px-2 py-0.5 bg-brand-navy text-[8px] text-brand-gold font-bold rounded uppercase border border-brand-gold/20"
                      >
                        ✔ crop
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION: PERSONAL DETAILS */}
              <div className="space-y-4">
                <h4 className="font-serif text-[11px] text-brand-gold tracking-[0.2em] uppercase border-b border-brand-gold/15 pb-1">
                  {language === 'EN' ? 'Personal Registrations' : 'व्यक्तिगत विवरण प्रमाण'}
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'First Name*' : 'प्रथम नाम*'}</label>
                    <input 
                      type="text" required
                      className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2 px-3 text-xs text-brand-cream focus:border-brand-gold focus:outline-none"
                      placeholder="e.g. Maharaja Jagdish"
                      value={firstName} onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'Last Name*' : 'उपनाम*'}</label>
                    <input 
                      type="text" required
                      className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2 px-3 text-xs text-brand-cream focus:border-brand-gold focus:outline-none"
                      placeholder="e.g. Walke"
                      value={lastName} onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'Email Address*' : 'ईमेल पता*'}</label>
                    <input 
                      type="email" required
                      className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2 px-3 text-xs text-brand-cream focus:border-brand-gold focus:outline-none"
                      placeholder="jagdishwalke13@gmail.com"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'Mobile Number (+91 format)*' : 'भारतीय मोबाइल मोबाइल नंबर*'}</label>
                    <input 
                      type="tel" required
                      className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2 px-3 text-xs text-brand-cream focus:border-brand-gold focus:outline-none"
                      placeholder="+91 99999 88888"
                      value={phone} onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'Secret Account Passcode*' : 'गोपनीय पासवर्ड*'}</label>
                    <input 
                      type="password" required
                      className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2 px-3 text-xs text-brand-cream focus:border-brand-gold focus:outline-none"
                      placeholder="At least 8 characters"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    {password && (
                      <div className="flex items-center gap-1 text-[9px] mt-1">
                        <span className="text-brand-cream/60">Strength: </span>
                        <div className="h-1.5 w-16 bg-gray-700 rounded-full overflow-hidden flex">
                          <div className={`h-full ${passStrength.color}`} style={{ width: `${(passStrength.score + 1) * 25}%` }} />
                        </div>
                        <span className="font-bold text-brand-gold">{passStrength.text}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'Confirm Passcode*' : 'पासवर्ड पुनः दर्ज करें*'}</label>
                    <input 
                      type="password" required
                      className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2 px-3 text-xs text-brand-cream focus:border-brand-gold focus:outline-none"
                      placeholder="matching passphrase"
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'Date of Birth (18+)*' : 'जन्म तिथि*'}</label>
                    <input 
                      type="date" required
                      className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2 px-3 text-xs text-[#ccd5e0] focus:border-brand-gold focus:outline-none"
                      value={dob} onChange={(e) => setDob(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'Gender Priority' : 'लिंग वर्ग'}</label>
                    <select 
                      className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2 px-3 text-xs text-[#ccd5e0] focus:border-brand-gold focus:outline-none"
                      value={gender} onChange={(e) => setGender(e.target.value)}
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                      <option>Prefer not to say</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'Anniversary (Optional)' : 'विवाह वर्षगांठ (वैकल्पिक)'}</label>
                    <input 
                      type="date" 
                      className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2 px-3 text-xs text-[#ccd5e0] focus:border-brand-gold focus:outline-none"
                      value={anniversaryDate} onChange={(e) => setAnniversaryDate(e.target.value)}
                    />
                  </div>
                </div>

              </div>

              {/* SECTION: ADDRESS DETAILS */}
              <div className="space-y-4">
                <h4 className="font-serif text-[11px] text-brand-gold tracking-[0.2em] uppercase border-b border-brand-gold/15 pb-1">
                  {language === 'EN' ? 'Residential Addresses' : 'स्थानीय आवासीय पता विवरण'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'Address Line 1*' : 'पता पंक्ति १*'}</label>
                    <input 
                      type="text" required
                      className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2 px-3 text-xs text-brand-cream focus:border-brand-gold"
                      placeholder="e.g. 101 Lake View Palace Road"
                      value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'Address Line 2' : 'पता पंक्ति २'}</label>
                    <input 
                      type="text"
                      className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2 px-3 text-xs text-brand-cream focus:border-brand-gold"
                      placeholder="Apartment, suite, block room"
                      value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'Pin Code (Rajasthan auto-fill)*' : 'पिन कोड*'}</label>
                    <input 
                      type="text" required maxLength={6}
                      className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2 px-3 text-xs text-brand-cream focus:border-brand-gold focus:outline-none"
                      placeholder="6 digits (e.g. 313001)"
                      value={pinCode} onChange={(e) => setPinCode(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'City*' : 'शहर*'}</label>
                    <input 
                      type="text" required
                      className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2 px-3 text-xs text-brand-cream focus:border-brand-gold focus:outline-none"
                      placeholder="Udaipur"
                      value={city} onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'State*' : 'राज्य*'}</label>
                    <select 
                      className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2 px-3 text-xs text-[#ccd5e0] focus:border-brand-gold focus:outline-none"
                      value={stateName} onChange={(e) => setStateName(e.target.value)}
                    >
                      {INDIAN_STATES_LIST.map((st) => <option key={st}>{st}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'Country' : 'देश'}</label>
                    <input 
                      type="text" disabled
                      className="w-full bg-brand-navy border border-brand-gold/10 rounded-lg py-2 px-3 text-xs text-brand-gold/80"
                      value="India"
                    />
                  </div>
                </div>

              </div>

              {/* ID PROOF & COMPLIANCE */}
              <div className="space-y-4">
                <h4 className="font-serif text-[11px] text-brand-gold tracking-[0.2em] uppercase border-b border-brand-gold/15 pb-1">
                  {language === 'EN' ? 'Sovereign ID Proof Proofs' : 'संवैधानिक पहचान पत्र सत्यापन'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'ID Proof Type*' : 'पहचान पत्र प्रकार*'}</label>
                    <select 
                      className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2 px-3 text-xs text-[#ccd5e0] focus:outline-none focus:border-brand-gold"
                      value={idType} onChange={(e) => setIdType(e.target.value)}
                    >
                      <option>Aadhaar Card</option>
                      <option>PAN Card</option>
                      <option>Passport</option>
                      <option>Driving License</option>
                      <option>Voter ID Card</option>
                      <option>Government ID</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-[#ccd5e0]">{language === 'EN' ? 'ID Number (Verified Layout)*' : 'पहचान पत्र संख्या*'}</label>
                    <input 
                      type="text" required
                      className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2 px-3 text-xs text-brand-cream focus:border-brand-gold focus:outline-none"
                      placeholder="validation varies per card type"
                      value={idNumber} onChange={(e) => setIdNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="p-3 bg-brand-navy/30 border border-brand-gold/10 rounded-lg text-[9px] text-[#A1BBA1] leading-relaxed">
                  📢 <strong>Indian Government Regulation notice:</strong> Under strict mandates of the Home Ministry of India, all dignitaries participating must register credentials and upload a scanned file of ID.
                </div>

                <div className="space-y-2 select-none">
                  <label className="flex items-start gap-2 text-[10px] cursor-pointer">
                    <input type="checkbox" className="accent-brand-gold mt-0.5" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
                    <span className="text-brand-cream/80 leading-snug">I acknowledge the <strong>Sovereign Anjuman Hotel Charter</strong> Terms & Conditions containing code of conduct.</span>
                  </label>
                  <label className="flex items-start gap-2 text-[10px] cursor-pointer">
                    <input type="checkbox" className="accent-brand-gold mt-0.5" checked={acceptPrivacy} onChange={(e) => setAcceptPrivacy(e.target.checked)} />
                    <span className="text-brand-cream/80 leading-snug">I consent to the high identity <strong>Protection & Privacy Policy</strong> of Indian sovereign data storage.</span>
                  </label>
                  <label className="flex items-start gap-2 text-[10px] cursor-pointer">
                    <input type="checkbox" className="accent-brand-gold mt-0.5" checked={newsletterOptIn} onChange={(e) => setNewsletterOptIn(e.target.checked)} />
                    <span className="text-brand-cream/75 leading-snug">Opt me in into Mewar privilege newsletters, promotional birthday discounts, and exclusive events logs (Optional).</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gold-gradient text-brand-black text-xs font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-1 hover:brightness-110 cursor-pointer"
              >
                {isLoading ? <Clock className="w-4 h-4 animate-spin" /> : <span>DISPATCH OTP SECURITY CREDENTIALS ➔</span>}
              </button>

              <div className="text-center pt-2 text-xs">
                <span className="text-brand-cream/60">{language === 'EN' ? 'Registered earlier?' : 'पहले से खाता धारक हैं?'} </span>
                <button 
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setSuccessMsg('');
                    setActiveTab('login');
                  }}
                  className="text-brand-gold font-bold underline"
                >
                  {language === 'EN' ? 'Log In Connoisseur' : 'लॉग इन करें'}
                </button>
              </div>

            </form>
          )}

          {/* =========================================
              VIEW FLOW: OTP VERIFICATION INTERSTICES
              ========================================= */}
          {activeTab === 'otp_verify' && (
            <form onSubmit={handleVerifyOtpInput} className="space-y-6 text-center py-4">
              
              <div className="space-y-2">
                <div className="p-4 bg-brand-gold/5 border border-brand-gold/15 rounded-full inline-flex">
                  <Shield className="w-8 h-8 text-brand-gold animate-bounce" />
                </div>
                <p className="text-xs text-brand-cream/85 max-w-sm mx-auto">
                  {language === 'EN' 
                    ? `A confidential verification OTP token was sent. Proffer the six digit number within the countdown limit to unlock profile.` 
                    : `एक गोपनीय ६ अंकीय सुरक्षा कोड भेजा गया है। खाता सक्रिय करने हेतु इसे नीचे प्रविष्ट करें।`}
                </p>
                <div className="font-mono text-xs text-brand-gold font-bold bg-brand-black/40 border border-brand-gold/10 inline-block px-3 py-1 rounded-md">
                  {language === 'EN' ? 'Sent to: ' : 'सुरक्षित विवरण: '} {otpSentTo}
                </div>
              </div>

              {/* 6 Digit Box Inputs */}
              <div className="flex justify-center gap-2 max-w-md mx-auto">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input 
                    key={index}
                    ref={(el) => (otpInputsRef.current[index] = el)}
                    type="text" 
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={otpValues[index]}
                    onChange={(e) => handleOtpDigitChange(e.target.value, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className="w-12 h-14 bg-brand-black border-2 border-brand-gold/35 rounded-xl text-center text-lg font-bold font-mono text-brand-white focus:border-brand-gold focus:outline-none transition-all"
                  />
                ))}
              </div>

              {/* Resend limit state timers */}
              <div className="text-xs font-mono">
                {resendTimer > 0 ? (
                  <span className="text-brand-cream/50">
                    {language === 'EN' ? `Resend Token in: ` : `ओटीपी पुनः भेजें: `} <strong className="text-brand-white">{resendTimer}s</strong>
                  </span>
                ) : (
                  <button 
                    type="button"
                    onClick={() => triggerOtpDispatch(otpSentTo, otpVerificationPurpose)}
                    className="text-brand-gold font-bold hover:underline"
                  >
                    🔄 {language === 'EN' ? 'RE-DESPATCH OTP CODE' : 'ओटीपी पुनः भेजें'}
                  </button>
                )}
                <div className="text-[10px] text-brand-cream/30 mt-2">
                  {language === 'EN' ? 'Token expires in 10:00 minutes • CSRF secure payload' : 'टोकन १० मिनट के लिए मान्य है'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                <button 
                  type="button"
                  onClick={() => setActiveTab(otpVerificationPurpose === 'register' ? 'register' : 'login')}
                  className="py-2.5 bg-brand-black text-brand-cream border border-brand-gold/15 rounded text-xs uppercase font-bold"
                >
                  ← {language === 'EN' ? 'Abort' : 'पीछे जाएं'}
                </button>
                <button 
                  type="submit"
                  className="py-2.5 bg-gold-gradient text-brand-black rounded text-xs uppercase font-black tracking-widest"
                >
                  {language === 'EN' ? 'VERIFY PRIVILEGES' : 'सत्यापित करें'}
                </button>
              </div>

            </form>
          )}

          {/* =========================================
              VIEW FLOW: FORGOT PASSWORD FLOW FORM
              ========================================= */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              
              {forgotInput !== 'verified_stage_code' ? (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-xs text-brand-cream/80">
                    {language === 'EN' 
                      ? 'Proffer your registered sovereign email or Indian (+91) communication mobile. We shall dispatch a verification token for instant validation reset.'
                      : 'गोपनीय पासवर्ड पुनर्स्थापित करने हेतु अपना पंजीकृत ईमेल या भारतीय मोबाइल नंबर प्रविष्ट करें।'}
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#ccd5e0] block">
                      {language === 'EN' ? 'Email or Mobile Number*' : 'पंजीकृत ईमेल या मोबाइल नंबर*'}
                    </label>
                    <div className="relative">
                      <input 
                        type="text" required
                        className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2.5 pl-9 pr-3.5 text-xs text-brand-cream focus:border-brand-gold focus:outline-none"
                        placeholder="e.g. jagdishwalke13@gmail.com"
                        value={forgotInput}
                        onChange={(e) => setForgotInput(e.target.value)}
                      />
                      <User className="w-4 h-4 text-brand-gold/60 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div className="flex justify-between gap-4 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setActiveTab('login')}
                      className="px-4 py-2 bg-brand-black text-brand-cream rounded text-xs uppercase"
                    >
                      ← Back to Login
                    </button>
                    <button 
                      type="submit"
                      className="px-6 py-2 bg-gold-gradient text-brand-black rounded text-xs uppercase font-bold tracking-wider cursor-pointer"
                    >
                      DESPATCH OTP TOKEN ➔
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-scale-in">
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 text-[#A1BBA1] text-xs rounded-lg">
                    ✔ Verification tokens match. Please configure a new strong master password.
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#ccd5e0] block">New Secret Passcode*</label>
                    <input 
                      type="password" required
                      className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2.5 px-3.5 text-xs text-brand-cream"
                      placeholder="At least 8 characters with capital & numbers"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#ccd5e0] block">Retype Passcode*</label>
                    <input 
                      type="password" required
                      className="w-full bg-brand-black border border-brand-gold/20 rounded-lg py-2.5 px-3.5 text-xs text-brand-cream"
                      placeholder="confirm password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-gold-gradient text-brand-black text-xs font-black uppercase tracking-widest rounded-lg cursor-pointer"
                  >
                    RESET PASSCODE IN REGISTRY
                  </button>
                </div>
              )}

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
