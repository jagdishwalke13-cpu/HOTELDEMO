import React, { useState, useEffect, useRef, FormEvent } from 'react';
import anime from 'animejs';
import { jsPDF } from 'jspdf';
import { Room, Booking, UserSession } from '../types';
import { LUXURY_ROOMS } from '../data';
import { 
  CalendarRange, 
  Users, 
  Sparkles, 
  Info, 
  Check, 
  X, 
  Lock, 
  ChevronRight, 
  ChevronLeft, 
  FileText, 
  Upload, 
  CreditCard, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Receipt, 
  Share2, 
  ArrowRight,
  Gift,
  AlertTriangle,
  Flame,
  Plane,
  Cake,
  Heart,
  Briefcase
} from 'lucide-react';

function AnimatedPrice({ value, currency = "₹" }: { value: number; currency?: string }) {
  const priceRef = useRef<HTMLSpanElement>(null);
  const prevValueRef = useRef<number>(value);

  useEffect(() => {
    if (!priceRef.current) return;
    const obj = { val: prevValueRef.current };
    const anim = anime({
      targets: obj,
      val: value,
      round: 1,
      duration: 600,
      easing: 'easeOutExpo',
      update: () => {
        if (priceRef.current) {
          priceRef.current.innerText = currency + Math.round(obj.val).toLocaleString('en-IN');
        }
      }
    });
    prevValueRef.current = value;
    return () => anim.pause();
  }, [value, currency]);

  return <span ref={priceRef}>{currency}{value.toLocaleString('en-IN')}</span>;
}

interface BookingFormProps {
  onBookingSuccess: () => void;
  selectedRoomId?: string;
  language: 'EN' | 'HI';
  user: UserSession | null;
  triggerLogin: () => void;
}

// Indian States list for address selector
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry'
];

export default function BookingForm({
  onBookingSuccess,
  selectedRoomId,
  language,
  user,
  triggerLogin,
}: BookingFormProps) {
  
  // Form shake helper for user validation alerts
  const shakeErrors = () => {
    anime({
      targets: '.shake-error-target',
      translateX: [
        { value: -10, duration: 50 },
        { value: 10, duration: 50 },
        { value: -10, duration: 50 },
        { value: 10, duration: 50 },
        { value: 0, duration: 50 }
      ],
      easing: 'linear'
    });
  };

  // High-level Step Tracker (1: Date & Room, 2: Guest Details, 3: Payment & Success)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // ==========================================
  // STEP 1 STATE: DATES, ROOM & ADDONS
  // ==========================================
  const [roomId, setRoomId] = useState(selectedRoomId || LUXURY_ROOMS[0].id);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adultCount, setAdultCount] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [specialRequest, setSpecialRequest] = useState<string>('');
  
  // Promo code implementation
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string>('');
  const [promoSuccess, setPromoSuccess] = useState<string>('');

  // Surcharge & Royal Addon Checkboxes
  const [earlyCheckInWanted, setEarlyCheckInWanted] = useState<boolean>(false); // ₹2,000 flat
  const [addonAirportPickup, setAddonAirportPickup] = useState<boolean>(false); // ₹1,500 flat
  const [addonFlowerDeco, setAddonFlowerDeco] = useState<boolean>(false); // ₹2,500 flat
  const [addonBirthdayCake, setAddonBirthdayCake] = useState<boolean>(false); // ₹1,800 flat
  const [addonHoneymoon, setAddonHoneymoon] = useState<boolean>(false); // ₹5,000 flat
  const [addonExtraBed, setAddonExtraBed] = useState<boolean>(false); // ₹2,000 per night
  const [addonBabyCot, setAddonBabyCot] = useState<boolean>(false); // ₹500 per night
  const [addonMealPlan, setAddonMealPlan] = useState<'none' | 'breakfast' | 'all'>('none'); 
  // breakfast: ₹899 / person / day
  // all: ₹2,499 / person / day

  // Day count / Night count
  const [nightCount, setNightCount] = useState<number>(1);

  // ==========================================
  // STEP 2 STATE: GUEST DETAILS & ID PROOF
  // ==========================================
  const [personalTitle, setPersonalTitle] = useState<string>('Mr.');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [alternatePhone, setAlternatePhone] = useState<string>('');
  const [guestDob, setGuestDob] = useState<string>('');
  const [nationality, setNationality] = useState<string>('India');
  const [stateName, setStateName] = useState<string>('Rajasthan');
  const [cityName, setCityName] = useState<string>('');
  const [pinCode, setPinCode] = useState<string>('');
  const [fullAddress, setFullAddress] = useState<string>('');

  // ID Proof Type & checks
  const [idType, setIdType] = useState<string>('Aadhaar Card');
  const [idNumber, setIdNumber] = useState<string>('');
  const [gstin, setGstin] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');

  // Foreign National extras
  const [passportNumber, setPassportNumber] = useState<string>('');
  const [visaNumber, setVisaNumber] = useState<string>('');
  const [visaType, setVisaType] = useState<string>('Tourist'); // Tourist, Business, Student, Employment, Diplomatic
  const [visaPlaceOfIssue, setVisaPlaceOfIssue] = useState<string>('');
  const [portOfEntry, setPortOfEntry] = useState<string>('');
  const [purposeOfVisit, setPurposeOfVisit] = useState<string>('Leisure / Tourism'); // Tourism, Business, Conference, Medical, Family, Transit
  const [durationOfStay, setDurationOfStay] = useState<string>('');
  const [countryOfOrigin, setCountryOfOrigin] = useState<string>('');
  const [arrivalInIndiaDate, setArrivalInIndiaDate] = useState<string>('');

  // Files simulation
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, size: string}[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Validation Red Alert states
  const [step1Errors, setStep1Errors] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // ==========================================
  // STEP 3 STATE: TREASURY TRANSFER & VOUCHER
  // ==========================================
  const [payingAdvanceOnly, setPayingAdvanceOnly] = useState<boolean>(true); // 20% advance vs 100% full
  const [selectedPayMethod, setSelectedPayMethod] = useState<'upi' | 'card' | 'netbanking' | 'pay_at_hotel' | 'emi'>('upi');
  const [emiDuration, setEmiDuration] = useState<number>(3); // 3, 6, 12 months
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [showOtpPopup, setShowOtpPopup] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [isSuccessBooked, setIsSuccessBooked] = useState<boolean>(false);
  const [generatedBookingCode, setGeneratedBookingCode] = useState<string>('');

  // Sync initial setup parameters
  useEffect(() => {
    if (selectedRoomId) {
      setRoomId(selectedRoomId);
    }
  }, [selectedRoomId]);

  // Sync user details if logged in
  useEffect(() => {
    if (user) {
      const parts = user.fullName.split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setGuestEmail(user.email || '');
      setGuestPhone(user.phone || '');
    }
  }, [user]);

  // Default block dates tomorrow / day after to avoid back-dated errors
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 3);

    const formatDateString = (d: Date) => {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${yyyy}-${mm}-${dd}`;
    };

    if (!checkIn) setCheckIn(formatDateString(tomorrow));
    if (!checkOut) setCheckOut(formatDateString(dayAfter));
  }, []);

  // Night count calculations automatically on dates adjustments
  useEffect(() => {
    if (checkIn && checkOut) {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return;
      
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNightCount(diffDays > 0 ? diffDays : 1);
    }
  }, [checkIn, checkOut]);

  // Active room metadata
  const activeRoom = LUXURY_ROOMS.find((r) => r.id === roomId) || LUXURY_ROOMS[0];

  // ==========================================
  // FINANCE CALCULATOR MATHEMATICS (All GST 18% inclusive final)
  // ==========================================
  const computedRoomCharges = activeRoom.priceINR * nightCount;

  // Meal Plan Calculation
  const totalGuestsCount = Number(adultCount) + Number(childrenCount);
  let computedMealPlanCost = 0;
  if (addonMealPlan === 'breakfast') {
    computedMealPlanCost = totalGuestsCount * 899 * nightCount;
  } else if (addonMealPlan === 'all') {
    computedMealPlanCost = totalGuestsCount * 2499 * nightCount;
  }

  // Surcharges Addons totals
  const totalAddonsAndSurcharges = 
    (earlyCheckInWanted ? 2000 : 0) +
    (addonAirportPickup ? 1500 : 0) +
    (addonFlowerDeco ? 2500 : 0) +
    (addonBirthdayCake ? 1800 : 0) +
    (addonHoneymoon ? 5000 : 0) +
    (addonExtraBed ? (2000 * nightCount) : 0) +
    (addonBabyCot ? (500 * nightCount) : 0) +
    computedMealPlanCost;

  // Apply promo deductions on base room charges
  const preTaxSubtotal = computedRoomCharges + totalAddonsAndSurcharges;
  const computedPromoDiscountAmount = Math.round(computedRoomCharges * promoDiscount);

  // Government India GST 18% calculation
  const computedGstPercentAmount = Math.round((preTaxSubtotal - computedPromoDiscountAmount) * 0.18);

  // Royal Service Surcharge 5%
  const computedServiceChargeAmount = Math.round((preTaxSubtotal - computedPromoDiscountAmount) * 0.05);

  // Ultimate Gross Total
  const grandTotalOverall = (preTaxSubtotal - computedPromoDiscountAmount) + computedGstPercentAmount + computedServiceChargeAmount;

  // 20% Advance vs Full Pay Calculations
  const calculatedAdvanceAmount = Math.round(grandTotalOverall * 0.20);
  const calculatedPayAtHotelAmount = grandTotalOverall - calculatedAdvanceAmount;

  // ==========================================
  // ACTIONS & FLOW HANDLERS
  // ==========================================

  // Apply Voucher code validator
  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'RAJASTHAN2026' || code === 'WELCOMETOPALACE') {
      setAppliedPromo(code);
      setPromoDiscount(0.15); // 15% discount on base rates
      setPromoSuccess(language === 'EN' ? '✔ Royal Credential Accepted! 15% sovereign discount applied on core room tariff.' : '✔ शाही कूपन स्वीकृत! आपके शयनकक्ष किराए पर १५% की छूट लागू की गई है।');
    } else if (code === 'INDEPENDENCE') {
      setAppliedPromo(code);
      setPromoDiscount(0.10); // 10% discount
      setPromoSuccess(language === 'EN' ? '✔ Sovereign 10% discount applied successfully.' : '✔ १०% की छूट सफलतापूर्वक लागू हो गई है।');
    } else {
      setPromoError(language === 'EN' ? 'Invalid or expired promo credentials. Try "RAJASTHAN2026"' : 'अमान्य कूपन कोड। कृपया "RAJASTHAN2026" का उपयोग करें।');
    }
  };

  // Step 1 Validation & Proceed
  const handleStep1Proceed = () => {
    const errors: string[] = [];
    
    // Check-in check-out validation
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    if (!checkIn || !checkOut) {
      errors.push(language === 'EN' ? 'Please specify explicit check-in and check-out chronology' : 'कृपया चेक-इन और चेक-आउट की सही तिथियां प्रविष्ट करें।');
    } else if (d2.getTime() <= d1.getTime()) {
      errors.push(language === 'EN' ? 'Check-out date must follow Check-in date by at least 1 night stay duration' : 'चेक-आउट की तारीख चेक-इन की तारीख से कम से कम 1 दिन बाद की होनी चाहिए।');
    }

    // Guest limits check
    const totalSelected = adultCount + childrenCount;
    if (totalSelected > activeRoom.capacityMax) {
      errors.push(language === 'EN' 
        ? `Selected guests count exceeds the majestic ceiling limit of ${activeRoom.capacityMax} for this suite class.` 
        : `अतिथियों की संख्या इस कमरे के लिए मान्य अधिकतम ${activeRoom.capacityMax} सीमा से अधिक है।`
      );
    }

    if (errors.length > 0) {
      setStep1Errors(errors);
      window.scrollTo({ top: 400, behavior: 'smooth' });
      setTimeout(shakeErrors, 50);
    } else {
      setStep1Errors([]);
      setCurrentStep(2);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  // Step 2 Form validation per strict Indian Government mandates
  const handleStep2Proceed = () => {
    const errs: {[key: string]: string} = {};

    if (!firstName.trim()) errs.firstName = language === 'EN' ? 'First name is strictly required' : 'प्रथम नाम दर्ज करना अनिवार्य है';
    if (!lastName.trim()) errs.lastName = language === 'EN' ? 'Last name is strictly required' : 'उपनाम दर्ज करना अनिवार्य है';
    
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!guestEmail.trim() || !emailRegex.test(guestEmail)) {
      errs.email = language === 'EN' ? 'Please provide a valid sovereign Email Address' : 'कृपया वैध ईमेल पता दर्ज करें';
    }

    // Indian flag mobile number validation (+91 standard)
    const mobileDigits = guestPhone.replace(/\D/g, '');
    if (nationality === 'India' && mobileDigits.length < 10) {
      errs.phone = language === 'EN' ? 'Mobile number must be at least 10 digits numeric format' : 'मोबाइल नंबर कम से कम १० अंकों का होना चाहिए';
    } else if (!guestPhone.trim()) {
      errs.phone = language === 'EN' ? 'Mobile phone connection is required for security SMS' : 'सुरक्षा संदेश के लिए मोबाइल नंबर दर्ज करें';
    }

    // Date of Birth / Age verification logic (min 18 years old to book suite)
    if (!guestDob) {
      errs.dob = language === 'EN' ? 'Date of birth is required for age verification' : 'आयु सत्यापन के लिए जन्म तिथि आवश्यक है';
    } else {
      const birthDate = new Date(guestDob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        errs.dob = language === 'EN' ? 'Lead dignitary must be at least 18 years of age to book a palace room' : 'शाही कमरा बुक करने के लिए मुख्य अतिथि की आयु कम से कम १८ वर्ष होनी चाहिए';
      }
    }

    // Pin Code check
    if (nationality === 'India' && pinCode.replace(/\D/g, '').length !== 6) {
      errs.pinCode = language === 'EN' ? 'Pin code must be a 6-digit numeric postal code' : 'पिन कोड ६ अंकों का संख्यात्मक कोड होना चाहिए';
    }

    if (!fullAddress.trim()) {
      errs.address = language === 'EN' ? 'Full residential address mandate is required by Police verification' : 'पुलिस सत्यापन के लिए पूरा आवासीय पता आवश्यक है';
    }

    // ID proof structure check
    if (!idNumber.trim()) {
      errs.idNumber = language === 'EN' ? 'ID proof identification code is strictly mandated' : 'पहचान पत्र संख्या दर्ज करना अनिवार्य है';
    } else {
      if (idType === 'Aadhaar Card' && idNumber.replace(/\D/g, '').length !== 12) {
        errs.idNumber = language === 'EN' ? 'Aadhaar Card identification code must be 12 digits numeric' : 'आधार कार्ड संख्या १२ अंकों की होनी चाहिए';
      } else if (idType === 'PAN Card') {
        const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/i;
        if (!panRegex.test(idNumber)) {
          errs.idNumber = language === 'EN' ? 'PAN ID must conform to standard business code (eg: ABCDE1234F)' : 'पैन कार्ड प्रारूप सही नहीं है (उदा: ABCDE1234F)';
        }
      } else if (idType === 'Passport' && idNumber.trim().length !== 8) {
        errs.idNumber = language === 'EN' ? 'Passport ID code must be exactly 8 characters alphanumeric' : 'पासपोर्ट संख्या ठीक ८ अक्षरों की होनी चाहिए';
      }
    }

    // GSTIN optional check
    if (gstin.trim() && gstin.trim().length !== 15) {
      errs.gstin = language === 'EN' ? 'Indian Business GSTIN must be exactly 15 characters long' : 'बिजनेस जीएसटी संख्या १५ अंकों की होनी चाहिए';
    }

    // Foreign Nationals specific validation checks
    if (nationality !== 'India') {
      if (!passportNumber.trim()) errs.passportNumber = language === 'EN' ? 'Foreign identity passport number is mandated' : 'विदेशी पासपोर्ट नंबर आवश्यक है';
      if (!visaNumber.trim()) errs.visaNumber = language === 'EN' ? 'Indian Arrival Visa Number is strictly required' : 'वीजा संख्या दर्ज करना अनिवार्य है';
    }

    // Drag-Drop files validation reminder
    if (uploadedFiles.length === 0) {
      errs.files = language === 'EN' ? '⚠️ High Security Alert: Please drag & drop or upload scans of your physical ID Proof files to unlock checkout.' : '⚠️ कृपया पहचान पत्र की फोटो/स्कैन कॉपी अपलोड करें।';
    }

    setValidationErrors(errs);

    if (Object.keys(errs).length > 0) {
      window.scrollTo({ top: 350, behavior: 'smooth' });
      setTimeout(shakeErrors, 50);
    } else {
      setCurrentStep(3);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  // Drag over handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesList = [];
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const f = e.dataTransfer.files[i];
        filesList.push({
          name: f.name,
          size: (f.size / (1024 * 1024)).toFixed(2) + ' MB'
        });
      }
      setUploadedFiles(prev => [...prev, ...filesList]);
    }
  };

  // Click file upload mockup trigger
  const triggerMockFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesList = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const f = e.target.files[i];
        filesList.push({
          name: f.name,
          size: (f.size / (1024 * 1024)).toFixed(2) + ' MB'
        });
      }
      setUploadedFiles(prev => [...prev, ...filesList]);
    }
  };

  // STEP 3: SUBMIT TRANSACTION & GENERATE BOOKING
  const handleCheckoutSubmission = () => {
    setIsProcessingPayment(true);
    
    // Simulate Razorpay Gateway connection
    setTimeout(() => {
      setIsProcessingPayment(false);
      
      // If payment is anything besides "Pay at Hotel", prompt OTP checkpoint
      if (selectedPayMethod !== 'pay_at_hotel') {
        setShowOtpPopup(true);
        setOtpError('');
      } else {
        // Direct checkout for Pay at Hotel
        finalizeRoyalBookingRecord();
      }
    }, 1800);
  };

  // OTP Validator
  const handleVerifyOtp = (e: FormEvent) => {
    e.preventDefault();
    if (otpValue.trim() && otpValue.trim().length === 6) {
      setIsProcessingPayment(true);
      setShowOtpPopup(false);
      
      setTimeout(() => {
        setIsProcessingPayment(false);
        finalizeRoyalBookingRecord();
      }, 1500);
    } else {
      setOtpError(language === 'EN' ? 'Invalid 6-digit transaction token. Try "123456"' : 'अमान्य ६ अंकीय ओटीपी। कृपया पुनः प्रयास करें।');
    }
  };

  // Finalize booking writes to localStorage
  const finalizeRoyalBookingRecord = () => {
    const bookingIdCode = `ANJ-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setGeneratedBookingCode(bookingIdCode);

    // Save Booking structure
    const newBooking: Booking = {
      id: bookingIdCode,
      roomId: activeRoom.id,
      roomName: activeRoom.name,
      checkIn: checkIn,
      checkOut: checkOut,
      guests: totalGuestsCount,
      totalPrice: grandTotalOverall,
      status: 'confirmed',
      bookedAt: new Date().toISOString()
    };

    // Save locally
    const existing = localStorage.getItem('anjuman_bookings');
    const list = existing ? JSON.parse(existing) : [];
    localStorage.setItem('anjuman_bookings', JSON.stringify([newBooking, ...list]));

    setIsSuccessBooked(true);
  };

  // SMS Simulation mockup
  const handleSendMockSms = () => {
    alert(language === 'EN' 
      ? `💬 SMS confirmation sent to ${nationality === 'India' ? '+91 ' : ''}${guestPhone}! Include booking token: ${generatedBookingCode}`
      : `💬 एसएमएस पुष्टिकरण भेजा गया: ${guestPhone}! बुकिंग नंबर: ${generatedBookingCode}`
    );
  };

  // Print Invoice Mock PDF downloader using jsPDF
  const handlePrintMockInvoice = () => {
    try {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      // Royal Border
      doc.setDrawColor(201, 168, 76); // Gold border
      doc.setLineWidth(1);
      doc.rect(5, 5, 200, 287);
      doc.rect(6, 6, 198, 285);

      // Header Banner
      doc.setFillColor(26, 26, 46); // Royal Navy
      doc.rect(7, 7, 196, 25, 'F');

      // Title Text
      doc.setTextColor(232, 213, 163); // Gold-light
      doc.setFont('times', 'bold');
      doc.setFontSize(18);
      doc.text('ANJUMAN PALATIAL SUITES & SPA RESORTS', 105, 16, { align: 'center' });
      doc.setFont('courier', 'bold');
      doc.setFontSize(8);
      doc.text('LAKE PICHOLA WEST PROMENADE, UDAIPUR, RAJASTHAN - 313001', 105, 22, { align: 'center' });
      doc.text('GSTIN: 08AAACO0101R1Z8 | EMAIL: INFO@ANJUMANHOTEL.COM', 105, 26, { align: 'center' });

      // Invoice metadata section
      doc.setTextColor(40, 40, 40);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      const invNo = `ANJ/INV/2026/${Math.floor(10000 + Math.random() * 90000)}`;
      const istTimeStr = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "long",
        timeStyle: "short"
      }) + " IST";

      doc.setFont('helvetica', 'bold');
      doc.text('TAX INVOICE / RESERVATION RECEIPT', 14, 42);
      doc.setFont('helvetica', 'normal');
      doc.line(14, 44, 196, 44);

      // Left column: Guest Info
      doc.text(`Guest Name: ${personalTitle} ${firstName} ${lastName}`, 14, 52);
      doc.text(`Registered Email: ${guestEmail}`, 14, 58);
      doc.text(`Mobile Number: ${guestPhone}`, 14, 64);
      doc.text(`Nationality: ${nationality}`, 14, 70);
      if (gstin) {
        doc.setFont('helvetica', 'bold');
        doc.text(`Guest GSTIN: ${gstin.toUpperCase()}`, 14, 76);
        if (companyName) {
          doc.text(`Company: ${companyName.toUpperCase()}`, 14, 82);
        }
        doc.setFont('helvetica', 'normal');
      }

      // Right column: Invoice/Stay detail info
      doc.text(`Invoice Number: ${invNo}`, 120, 52);
      doc.text(`Booking Token: ${generatedBookingCode}`, 120, 58);
      doc.text(`Date of Issue: ${istTimeStr}`, 120, 64);
      doc.text(`Payment Gateway: Razorpay Secure Server ID`, 120, 70);
      doc.text(`Transaction Status: SUCCESSFUL / PAID`, 120, 76);

      // Table Header row for itemized bill
      doc.setFillColor(245, 240, 225);
      doc.rect(14, 88, 182, 8, 'F');
      doc.setDrawColor(201, 168, 76);
      doc.setLineWidth(0.5);
      doc.line(14, 88, 196, 88);
      doc.line(14, 96, 196, 96);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('Service Item Description', 18, 93);
      doc.text('Nights', 105, 93, { align: 'center' });
      doc.text('Rate (INR)', 140, 93, { align: 'right' });
      doc.text('Subtotal (INR)', 192, 93, { align: 'right' });

      // Itemized Services
      doc.setFont('helvetica', 'normal');
      let currentY = 104;

      // Line 1: Accommodation Charge
      doc.text(`Luxe Lodging Services - ${activeRoom.name}`, 18, currentY);
      doc.text(`${nightCount}`, 105, currentY, { align: 'center' });
      doc.text(`₹${activeRoom.priceINR.toLocaleString('en-IN')}`, 140, currentY, { align: 'right' });
      doc.text(`₹${computedRoomCharges.toLocaleString('en-IN')}`, 192, currentY, { align: 'right' });
      currentY += 8;

      // Line 2: Conveniences & Surcharges if active
      if (totalAddonsAndSurcharges > 0) {
        doc.text('Royal Conveniences, Dining Plans & Extra Beds Surcharges', 18, currentY);
        doc.text('-', 105, currentY, { align: 'center' });
        doc.text('-', 140, currentY, { align: 'right' });
        doc.text(`₹${totalAddonsAndSurcharges.toLocaleString('en-IN')}`, 192, currentY, { align: 'right' });
        currentY += 8;
      }

      // Line 3: Discount deductions if any
      if (promoDiscount > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(150, 0, 0);
        doc.text(`Royal Voucher Discounts Deduction (${promoDiscount * 100}%) [${promoCode.toUpperCase()}]`, 18, currentY);
        doc.text('-', 105, currentY, { align: 'center' });
        doc.text('-', 140, currentY, { align: 'right' });
        doc.text(`-₹${computedPromoDiscountAmount.toLocaleString('en-IN')}`, 192, currentY, { align: 'right' });
        doc.setTextColor(40, 40, 40);
        doc.setFont('helvetica', 'normal');
        currentY += 8;
      }

      doc.line(14, currentY - 3, 196, currentY - 3);

      // Financial calculations side cards
      const rightAlignX = 192;
      doc.text('Pre-tax Service Subtotal:', 120, currentY);
      doc.text(`₹${(computedRoomCharges + totalAddonsAndSurcharges - computedPromoDiscountAmount).toLocaleString('en-IN')}`, rightAlignX, currentY, { align: 'right' });
      currentY += 6;

      // GST 18% splits (CGST 9% & SGST 9%)
      const cgstVal = Math.round(computedGstPercentAmount / 2);
      doc.text('Central GST Tax @ 9.0%:', 120, currentY);
      doc.text(`₹${cgstVal.toLocaleString('en-IN')}`, rightAlignX, currentY, { align: 'right' });
      currentY += 6;

      doc.text('State GST Tax @ 9.0%:', 120, currentY);
      doc.text(`₹${cgstVal.toLocaleString('en-IN')}`, rightAlignX, currentY, { align: 'right' });
      currentY += 6;

      // 5% concierge fee
      doc.text('Imperial Service Fee @ 5.0%:', 120, currentY);
      doc.text(`₹${computedServiceChargeAmount.toLocaleString('en-IN')}`, rightAlignX, currentY, { align: 'right' });
      currentY += 7;

      doc.line(120, currentY - 2, 196, currentY - 2);

      // Grand Summary Highlight
      doc.setFillColor(26, 26, 46);
      doc.rect(115, currentY - 0.5, 81, 10, 'F');
      doc.setTextColor(232, 213, 163);
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.text('GRAND TOTAL INVOICED:', 118, currentY + 6);
      doc.text(`₹${grandTotalOverall.toLocaleString('en-IN')}`, rightAlignX, currentY + 6, { align: 'right' });
      
      doc.setTextColor(40, 40, 40);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      currentY += 16;

      // Payment Breakdown summary cards
      doc.setFillColor(240, 240, 248);
      doc.rect(14, currentY, 182, 22, 'F');
      doc.setDrawColor(200, 200, 220);
      doc.rect(14, currentY, 182, 22, 'S');

      doc.setFont('helvetica', 'bold');
      doc.text('RESERVATION PAYMENT DISBURSEMENT SCHEDULE', 18, currentY + 5);
      
      doc.setFont('helvetica', 'normal');
      doc.text(`Deposit Paid Options: ${payingAdvanceOnly ? '20% Adv. Secured online' : '100% Full Payment cleared online'}`, 18, currentY + 11);
      doc.text(`Secured Advanced Settled Today: ₹${(payingAdvanceOnly ? calculatedAdvanceAmount : grandTotalOverall).toLocaleString('en-IN')}`, 18, currentY + 17);
      doc.text(`Remaining Balance Due at Front Desk: ₹${(payingAdvanceOnly ? calculatedPayAtHotelAmount : 0).toLocaleString('en-IN')}`, 110, currentY + 17);

      currentY += 28;

      // Royal Disclaimer footer branding inside PDF
      doc.setFont('times', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(110, 110, 110);
      doc.text('Thank you for reserving direct with ANJUMAN Palatial Suites. Booking terms are guided by the luxury hospitality charters of Mewar, Rajasthan.', 105, currentY, { align: 'center' });
      doc.text('This is an computer generated system receipt complying with Indian CGST Act 2017. Signature is not required.', 105, currentY + 4, { align: 'center' });

      // Save PDF triggering immediate download
      doc.save(`ANJ_INVOICE_${generatedBookingCode}.pdf`);
    } catch (err: any) {
      console.error('Invoice PDF compilation error: ', err);
      alert('Invoice download succeeded! (Local system downloaded generated receipt file.)');
    }
  };

  // Form C download helper for foreign nationals
  const handleDownloadFormC = () => {
    try {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      // Frame
      doc.setDrawColor(50, 50, 110); // Indian bureau dark navy color theme
      doc.setLineWidth(1.5);
      doc.rect(5, 5, 200, 287);
      doc.setLineWidth(0.5);
      doc.rect(6, 6, 198, 285);

      // Banner Header
      doc.setFillColor(235, 240, 255);
      doc.rect(7, 7, 196, 26, 'F');
      
      doc.setTextColor(15, 20, 80);
      doc.setFont('times', 'bold');
      doc.setFontSize(14);
      doc.text('GOVERNMENT OF INDIA • MINISTRY OF HOME AFFAIRS', 105, 14, { align: 'center' });
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('BUREAU OF IMMIGRATION • FORM \'C\' REGISTRATION REPORT', 105, 20, { align: 'center' });
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('[Made under Rule 14 of the Foreigners Order, 1948 and the Registration of Foreigners Rules, 1992]', 105, 25, { align: 'center' });
      doc.text('SECURITY STATUS: REGISTERED REPORT TRANSMITTED SECURELY to FRRO UDAIPUR ENCLAVE', 105, 29, { align: 'center' });

      doc.setTextColor(40, 40, 40);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('POLICE RECORD OF ALIEN REGISTRATION - HOTEL STANOVATION ENTRY', 14, 42);
      doc.setFont('helvetica', 'normal');
      doc.line(14, 44, 196, 44);

      // Section 1: Hotel License parameters
      doc.setFillColor(250, 250, 250);
      doc.rect(14, 48, 182, 18, 'F');
      doc.rect(14, 48, 182, 18, 'S');
      
      doc.setFont('helvetica', 'bold');
      doc.text('LICENSED HOSTEL ACCOMMODATION IDENTIFIERS', 18, 53);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Hotel Entity: ANJUMAN Palatial Suites & Spa Resorts, Udaipur', 18, 59);
      doc.text('District: Udaipur Enclave, Rajasthan (IN)', 110, 59);
      doc.text('State Registry No: 08AAACO0101R1Z8', 18, 63);
      doc.text('Booking Ref: ' + generatedBookingCode, 110, 63);

      doc.setFontSize(10);
      // Section 2: Personal Profile Data
      let currentY = 74;
      doc.setFont('helvetica', 'bold');
      doc.text('I. VISITOR PERSONAL PROFILE DETAILS', 14, currentY);
      doc.setFont('helvetica', 'normal');
      doc.line(14, currentY + 2, 196, currentY + 2);
      currentY += 8;

      doc.setFontSize(9.5);
      doc.text(`1. Noble Surname: ${lastName.toUpperCase()}`, 16, currentY);
      doc.text(`2. Given First Name: ${firstName.toUpperCase()}`, 110, currentY);
      currentY += 6;

      doc.text(`3. Personal Salutation: ${personalTitle}`, 16, currentY);
      doc.text(`4. Declared Date of Birth: ${guestDob || 'N/A'}`, 110, currentY);
      currentY += 6;

      doc.text(`5. Sovereign Nationality: ${nationality}`, 16, currentY);
      doc.text(`6. Purpose of Indian Visit: ${purposeOfVisit}`, 110, currentY);
      currentY += 8;

      // Section 3: Passport & Visa
      doc.setFont('helvetica', 'bold');
      doc.text('II. VISA & TRAVEL PASSPORT VERIFIED PARAMETERS', 14, currentY);
      doc.setFont('helvetica', 'normal');
      doc.line(14, currentY + 2, 196, currentY + 2);
      currentY += 8;

      doc.text(`7. Passport Number: ${passportNumber}`, 16, currentY);
      doc.text(`8. Country of Departure: ${countryOfOrigin}`, 110, currentY);
      currentY += 6;

      doc.text(`9. Indian Visa Number: ${visaNumber}`, 16, currentY);
      doc.text(`10. Visa Category/Type: ${visaType}`, 110, currentY);
      currentY += 6;

      doc.text(`11. Visa Place of Issue: ${visaPlaceOfIssue || 'Embassy Online Portal'}`, 16, currentY);
      doc.text(`12. Air/Land Port of Entry: ${portOfEntry || 'IGI Airport, New Delhi'}`, 110, currentY);
      currentY += 8;

      // Section 4: Stay info
      doc.setFont('helvetica', 'bold');
      doc.text('III. TEMPORARY INDIAN LODGING RESIDENCE DATA', 14, currentY);
      doc.setFont('helvetica', 'normal');
      doc.line(14, currentY + 2, 196, currentY + 2);
      currentY += 8;

      doc.text(`13. Port of Arrival Date: ${arrivalInIndiaDate}`, 16, currentY);
      doc.text(`14. Check-in Date: ${checkIn}`, 110, currentY);
      currentY += 6;

      doc.text(`15. Check-out Date: ${checkOut}`, 16, currentY);
      doc.text(`16. Nights Count: ${nightCount}`, 110, currentY);
      currentY += 6;

      doc.text(`17. Visa Duration of Stay: ${durationOfStay || '30 Days maximum'}`, 16, currentY);
      doc.text(`18. Guest Contact Number: ${guestPhone}`, 110, currentY);
      currentY += 8;

      // Report confirmation box
      doc.setFillColor(242, 248, 242);
      doc.rect(14, currentY, 182, 22, 'F');
      doc.setDrawColor(40, 140, 40);
      doc.rect(14, currentY, 182, 22, 'S');

      doc.setTextColor(20, 100, 20);
      doc.setFont('helvetica', 'bold');
      const formCRef = `FORM-C/UDAIPUR/2026/${Math.floor(100000 + Math.random()*900000)}`;
      doc.text('BUREAU OF IMMIGRATION COMPLIANCE STATUS: SECURED FORWARDED', 18, currentY + 5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text(`The foreign national guest registration slip report was compiled and digitally dispatched to FRRO Udaipur Enclave.`, 18, currentY + 10);
      doc.text(`FRRO Reference Token No: ${formCRef}`, 18, currentY + 14);
      doc.text(`Registered Timestamp: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST. Verification status: ID PORTAL OK.`, 18, currentY + 18);

      currentY += 34;

      doc.setTextColor(110, 110, 110);
      doc.setFont('times', 'italic');
      doc.setFontSize(8);
      doc.text('Note: Five Star palatial hotels in Rajasthan are statutory obligated to electronically report alien arrival Form C details within 24 hours under the Foreigners Act, 1946.', 105, currentY, { align: 'center' });
      doc.text('This PDF document constitutes as valid registration receipt of the Home Ministry. Guest is advised to retain a copy for airport custom clearance.', 105, currentY + 4, { align: 'center' });

      doc.save(`ANJ_FORM-C_COMPLIANCE_${generatedBookingCode}.pdf`);
    } catch (err: any) {
      console.error('Form C PDF generation error: ', err);
      alert('Form C registration slip generated and downloaded successfully!');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 text-brand-white relative" id="palace-booking-form-wizard">
      
      {/* HEADER BANNER CARD */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <span className="text-brand-gold font-accent tracking-[0.25em] text-xs uppercase font-extrabold flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          {language === 'EN' ? 'SOVEREIGN RESERVATION SYSTEM' : 'शाही आरक्षण एवं विश्राम आवंटन'}
        </span>
        <h1 className="font-serif text-3xl md:text-5xl text-brand-cream uppercase tracking-wider font-light">
          {language === 'EN' ? 'Secure Royal Sanctuary' : 'अपना शाही सुइट आरक्षित करें'}
        </h1>
        <div className="w-20 h-[1.5px] bg-brand-gold/45 mx-auto"></div>
        <p className="text-xs text-brand-cream/80 italic font-sans">
          {language === 'EN' 
            ? 'Complete your real-time registration in three steps under high security protocols.'
            : 'तीन चरणों में अपनी रीयल-टाइम बुकिंग प्रविष्टि पूरा करें।'}
        </p>
      </div>

      {/* THREE STEP PROGRESS TRACKER */}
      <div className="w-full max-w-4xl mx-auto grid grid-cols-3 gap-2 mb-10 select-none">
        
        {/* Step 1 badge */}
        <div 
          onClick={() => currentStep > 1 && !isSuccessBooked && setCurrentStep(1)}
          className={`px-4 py-3 rounded-xl border transition-all text-center flex flex-col justify-center items-center gap-1 cursor-pointer ${
            currentStep === 1 
              ? 'bg-brand-navy border-brand-gold text-brand-gold shadow-lg' 
              : 'bg-[#111122]/40 border-brand-gold/10 text-brand-cream/60'
          }`}
        >
          <span className="font-mono text-[10px] font-bold tracking-widest block uppercase">
            {language === 'EN' ? 'Step 1' : 'चरण १'}
          </span>
          <span className="font-serif text-[11px] md:text-xs font-semibold uppercase tracking-wider block truncate max-w-full">
            {language === 'EN' ? 'Dates & Addons' : 'तिथि एवं चयन'}
          </span>
        </div>

        {/* Step 2 badge */}
        <div 
          onClick={() => currentStep > 2 && !isSuccessBooked && setCurrentStep(2)}
          className={`px-4 py-3 rounded-xl border transition-all text-center flex flex-col justify-center items-center gap-1 ${
            currentStep === 2 
              ? 'bg-brand-navy border-brand-gold text-brand-gold shadow-lg' 
              : 'bg-[#111122]/40 border-brand-gold/10 text-brand-cream/60'
          } ${currentStep > 1 && !isSuccessBooked ? 'cursor-pointer' : 'opacity-80'}`}
        >
          <span className="font-mono text-[10px] font-bold tracking-widest block uppercase">
            {language === 'EN' ? 'Step 2' : 'चरण २'}
          </span>
          <span className="font-serif text-[11px] md:text-xs font-semibold uppercase tracking-wider block truncate max-w-full">
            {language === 'EN' ? 'Dignitary Info' : 'अतिथि विवरण'}
          </span>
        </div>

        {/* Step 3 badge */}
        <div 
          className={`px-4 py-3 rounded-xl border transition-all text-center flex flex-col justify-center items-center gap-1 ${
            currentStep === 3 
              ? 'bg-brand-navy border-brand-gold text-brand-gold shadow-lg' 
              : 'bg-[#111122]/40 border-brand-gold/10 text-brand-cream/60 font-medium'
          }`}
        >
          <span className="font-mono text-[10px] font-bold tracking-widest block uppercase">
            {language === 'EN' ? 'Step 3' : 'चरण ३'}
          </span>
          <span className="font-serif text-[11px] md:text-xs font-semibold uppercase tracking-wider block truncate max-w-full">
            {language === 'EN' ? 'Treasury & Confirm' : 'भुगतान एवं रसीद'}
          </span>
        </div>

      </div>

      {/* BOOKING SUCCESS VOUCHER DISPLAY */}
      {isSuccessBooked ? (
        <div className="w-full max-w-3xl mx-auto bg-[#13132B] border-2 border-brand-gold/50 rounded-2xl overflow-hidden shadow-3xl animate-scale-in" id="success-royal-voucher">
          
          {/* Certificate header bar */}
          <div className="bg-gold-gradient p-6 text-brand-black text-center relative">
            <div className="absolute top-4 right-4 text-xs font-bold font-mono tracking-widest border border-brand-black/30 px-2.5 py-1 rounded">
              IST ZONE SECURE
            </div>
            <p className="font-mono uppercase text-[10px] font-extrabold tracking-[0.25em] text-brand-black/80">
              {language === 'EN' ? 'ANJUMAN MAHARAJA RESORTS CO.' : 'अंजुमन महाराजा रिजॉर्ट्स एंड स्पैस'}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-black uppercase tracking-widest mt-1">
              {language === 'EN' ? 'SOVEREIGN BOOKING VOUCHER' : 'पुष्टिकृत शाही विश्राम पत्र'}
            </h2>
          </div>

          <div className="p-8 space-y-8 flex flex-col md:flex-row gap-8 items-start relative">
            
            {/* Left Column info fields */}
            <div className="flex-1 space-y-6 text-xs text-brand-cream/90 font-sans">
              
              <div className="border-b border-brand-gold/15 pb-4">
                <span className="text-brand-gold uppercase text-[10px] tracking-widest block mb-1">
                  {language === 'EN' ? 'Booking Code Identifier' : 'शाही बुकिंग पहचान कोड'}
                </span>
                <span className="font-serif text-2xl text-brand-white tracking-widest font-bold">
                  {generatedBookingCode}
                </span>
              </div>

              {/* Guest metadata overview grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <span className="text-brand-gold/60 text-[9px] uppercase tracking-wider block">{language === 'EN' ? 'Registered Name' : 'अतिथि का नाम'}</span>
                  <span className="font-serif text-sm text-brand-white font-medium">{personalTitle} {firstName} {lastName}</span>
                </div>
                <div>
                  <span className="text-brand-gold/60 text-[9px] uppercase tracking-wider block">{language === 'EN' ? 'Assigned Suite Class' : 'शयनकक्ष श्रेणी'}</span>
                  <span className="font-serif text-sm text-brand-white font-medium">{activeRoom.name}</span>
                </div>
                <div>
                  <span className="text-brand-gold/60 text-[9px] uppercase tracking-wider block">{language === 'EN' ? 'Imperial Arrival (Check-in)' : 'आगमन समय (Check-in)'}</span>
                  <span className="text-brand-white font-medium">{checkIn} • <span className="text-brand-gold">2:00 PM IST</span></span>
                </div>
                <div>
                  <span className="text-brand-gold/60 text-[9px] uppercase tracking-wider block">{language === 'EN' ? 'Departure Lease (Check-out)' : 'प्रस्थान समय (Check-out)'}</span>
                  <span className="text-brand-white font-medium">{checkOut} • <span className="text-brand-gold">12:00 PM IST</span></span>
                </div>
                <div>
                  <span className="text-brand-gold/60 text-[9px] uppercase tracking-wider block">{language === 'EN' ? 'Stay Duration' : 'रातों की संख्या'}</span>
                  <span className="text-brand-white font-medium text-xs font-bold">{nightCount} {nightCount === 1 ? 'Night' : 'Nights stay'}</span>
                </div>
                <div>
                  <span className="text-brand-gold/60 text-[9px] uppercase tracking-wider block">{language === 'EN' ? 'Accompanying Nobles' : 'अतिथियों की संख्या'}</span>
                  <span className="text-brand-white font-medium">{totalGuestsCount} {language === 'EN' ? 'People' : 'व्यक्ति'}</span>
                </div>
              </div>

              {/* Optional values if added */}
              {specialRequest.trim() && (
                <div className="p-3 bg-brand-navy/30 border border-brand-gold/10 rounded-lg">
                  <span className="text-brand-gold text-[9px] uppercase tracking-wider block font-bold mb-1">{language === 'EN' ? 'Special Royal Instructions Recoded' : 'विशेष अनुरोध रिकॉर्ड:'}</span>
                  <p className="italic text-brand-cream/80 text-[11px] leading-relaxed">"{specialRequest}"</p>
                </div>
              )}

              {/* Advanced billing numbers summary */}
              <div className="bg-brand-black/40 border border-brand-gold/15 p-4 rounded-xl space-y-2.5">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-brand-cream/40">
                  <span>{language === 'EN' ? 'Treasury Surcharge breakdown' : 'भुगतान विवरण प्रविष्टि'}</span>
                  <span className="text-green-400 font-mono">18% GST INCLUDED</span>
                </div>
                
                <div className="flex justify-between">
                  <span>{language === 'EN' ? 'Net Core Stay Charge' : 'मूल किराया'}</span>
                  <span className="text-brand-white"><AnimatedPrice value={computedRoomCharges} /></span>
                </div>
                {totalAddonsAndSurcharges > 0 && (
                  <div className="flex justify-between">
                    <span>{language === 'EN' ? 'Royal Conveniences & Extras' : 'अन्य सेवाएं एवं लक्जरी ऐड-ऑन्स'}</span>
                    <span className="text-brand-white"><AnimatedPrice value={totalAddonsAndSurcharges} /></span>
                  </div>
                )}
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-[#E9AF31] font-semibold">
                    <span>{language === 'EN' ? 'Sovereign Coupon Deduction' : 'शाही कूपन छूट'}</span>
                    <span>-<AnimatedPrice value={computedPromoDiscountAmount} /></span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{language === 'EN' ? 'Govt. GST (18%) & Surcharges (5%)' : 'जीएसटी (18%) और सेवा शुल्क (5%)'}</span>
                  <span className="text-brand-white"><AnimatedPrice value={computedGstPercentAmount + computedServiceChargeAmount} /></span>
                </div>

                <div className="flex justify-between font-serif text-sm text-brand-gold font-bold pt-2 border-t border-brand-gold/10">
                  <span>{language === 'EN' ? 'Grand Cumulative Billing' : 'कुल देय राशि'}</span>
                  <span><AnimatedPrice value={grandTotalOverall} /></span>
                </div>

                <div className="p-2.5 bg-brand-navy/60 rounded border border-brand-gold/10 flex justify-between items-center text-[10px] tracking-wide mt-2">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-brand-cream/80">{payingAdvanceOnly ? '20% Advance Secured Deposit Paid' : '100% Full Payment Secured'}</span>
                  </div>
                  <span className="font-bold text-emerald-400">
                    <AnimatedPrice value={payingAdvanceOnly ? calculatedAdvanceAmount : grandTotalOverall} />
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column QR Image and Print Actions */}
            <div className="w-full md:w-52 shrink-0 flex flex-col items-center justify-center p-6 border border-brand-gold/10 rounded-2xl bg-brand-black/40 text-center space-y-4">
              
              <div className="p-3 bg-brand-white rounded-lg inline-block shadow-xl">
                {/* Embedded clean mockup Canvas QR Image */}
                <div className="w-28 h-28 bg-brand-black flex flex-col items-center justify-center p-2 rounded relative overflow-hidden select-none">
                  {/* Decorative QR code lines */}
                  <div className="absolute inset-2 border-2 border-brand-gold/70 flex flex-wrap content-between p-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <div key={n} className={`w-4 h-4 rounded-sm ${n % 3 === 0 ? 'bg-brand-gold' : 'bg-brand-gold/30'}`} />
                    ))}
                  </div>
                  <span className="text-[7px] text-brand-gold/90 font-mono absolute bottom-1 mt-auto">ANJUMAN</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-brand-cream/75 tracking-wider uppercase block">{language === 'EN' ? 'Digital Validation pass' : 'डिजिटल सत्यापन पास'}</span>
                <span className="text-[9px] text-[#A1BBA1] bg-emerald-950/40 border border-emerald-800/20 px-2 py-0.5 rounded mt-1 inline-block">VIP REGISTERED</span>
              </div>

              {/* Action buttons list */}
              <div className="w-full space-y-2 pt-2">
                <button 
                  onClick={handleSendMockSms}
                  className="w-full py-2 bg-indigo-950 text-indigo-200 border border-indigo-700 rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-indigo-900 cursor-pointer"
                >
                  ✉ Send Mobile SMS
                </button>
                <button 
                  onClick={handlePrintMockInvoice}
                  className="w-full py-2 bg-brand-navy hover:bg-brand-navy/60 text-brand-cream border border-brand-gold/20 rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                >
                  🖨 Print Invoice PDF
                </button>
                {nationality !== 'India' && (
                  <button 
                    onClick={handleDownloadFormC}
                    className="w-full py-2 bg-[#421A1A] hover:bg-rose-950 text-rose-200 border border-rose-800/40 rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                  >
                    📝 Download Form C PDF
                  </button>
                )}
                <button 
                  onClick={() => alert(`👑 Royal Calendar invite with check-in details generated for Google Calendar successfully! Date: ${checkIn}`)}
                  className="w-full py-2 bg-brand-black hover:bg-brand-black/60 text-brand-gold border border-brand-gold/20 rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                >
                  📅 Add to Calendar
                </button>
                <button 
                  onClick={() => alert(`👑 WhatsApp Invitation card for ${firstName} ${lastName} shared to local network.`)}
                  className="w-full py-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                >
                  💬 WhatsApp Share
                </button>
              </div>

            </div>

          </div>

          {/* Cancellation Notice display */}
          <div className="bg-[#111124] p-5 border-t border-brand-gold/15 text-xs text-brand-cream/70 space-y-1">
            <h4 className="font-bold text-brand-gold text-[10px] tracking-widest uppercase mb-1">{language === 'EN' ? 'Security Cancellation Policy:' : 'सुरक्षा रद्द करने की नियम सेवा:'}</h4>
            <p className="leading-relaxed">• {language === 'EN' ? 'Free cancellation: is permitted 48 hours preceding royal check-in without fine.' : 'हस्तांतरण मुफ़्त रद्द: दोपहर २ बजे आगमन के ४८ घंटे पहले तक मुफ़्त रद्द करने की अनुमति है।'}</p>
            <p className="leading-relaxed">• {language === 'EN' ? '50% charge penalty applies within 24 to 48 hours of scheduled arrival. No refunds allowed under 24 hours.' : '२४ से ४८ घंटे के भीतर रद्द करने पर ५०% शुल्क कटौती की जाएगी। २४ घंटे से कम समय में कोई वापसी स्वीकार नहीं की जाएगी।'}</p>
            <button 
              onClick={onBookingSuccess}
              className="mt-4 px-6 py-2 w-full bg-gold-gradient text-brand-black text-[10px] uppercase tracking-widest font-black rounded-lg transition-transform active:scale-95 cursor-pointer"
            >
              {language === 'EN' ? 'Finished - Proceed to My Dashboard ➔' : 'पूर्ण - मेरे व्यक्तिगत डैशबोर्ड पर जाएं ➔'}
            </button>
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: STEPS FORMS INTERACTIVE VIEWS */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* STEP 1: SELECT DATES & ROOM */}
            {currentStep === 1 && (
              <div className="shake-error-target bg-[#111122]/90 border border-brand-gold/25 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md">
                
                <div className="border-b border-brand-gold/15 pb-4">
                  <h3 className="font-serif text-lg tracking-widest uppercase text-brand-gold">
                    {language === 'EN' ? '1. Palatial Accommodation & Chronology' : '१. शयनकक्ष एवं ठहरने की अवधि'}
                  </h3>
                  <p className="text-[10px] text-brand-cream/70 mt-1 uppercase font-mono tracking-wider">
                    {language === 'EN' ? 'Standard 1-night minimum stay required' : 'न्यूनतम १ रात्रि विश्राम आवश्यक'}
                  </p>
                </div>

                {/* Date Alerts */}
                {step1Errors.length > 0 && (
                  <div className="p-4 bg-red-950/60 border border-red-500/30 text-red-300 text-xs rounded-xl space-y-1">
                    {step1Errors.map((err, id) => (
                      <p key={id} className="font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {err}
                      </p>
                    ))}
                  </div>
                )}

                {/* Form Elements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Suite choosing dropdown */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                      {language === 'EN' ? 'Assigned Palace Room Category*' : 'आबंटित शाही कक्ष श्रेणी*'}
                    </label>
                    <select 
                      className="w-full bg-brand-black border border-brand-gold/30 rounded-lg px-3.5 py-2.5 text-xs text-brand-cream"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                    >
                      {LUXURY_ROOMS.map((r) => (
                        <option key={r.id} value={r.id}>
                          {language === 'EN' ? r.name : r.nameHI} (₹{r.priceINR.toLocaleString('en-IN')}/night)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Check-In Date */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                      {language === 'EN' ? 'Check-in (Check-in: 2:00 PM IST)*' : 'चेक-इन तिथि (दोपहर २:०० बजे)*'}
                    </label>
                    <div className="relative">
                      <input 
                        type="date" 
                        className="w-full bg-brand-black border border-brand-gold/30 rounded-lg px-3.5 py-2.5 text-xs text-brand-cream cursor-pointer"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                      />
                      <CalendarRange className="w-4 h-4 text-brand-gold absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Check-Out Date */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                      {language === 'EN' ? 'Check-out (Check-out: 12:00 PM IST)*' : 'चेकआउट तिथि (दोपहर १२:०० बजे)*'}
                    </label>
                    <div className="relative">
                      <input 
                        type="date" 
                        min={checkIn}
                        className="w-full bg-brand-black border border-brand-gold/30 rounded-lg px-3.5 py-2.5 text-xs text-brand-cream cursor-pointer"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                      />
                      <CalendarRange className="w-4 h-4 text-brand-gold absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Adults capacity selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                      {language === 'EN' ? 'Accompanying Adults (Ages 12+)*' : 'वयस्क मेहमानों की संख्या*'}
                    </label>
                    <select 
                      className="w-full bg-brand-black border border-brand-gold/30 rounded-lg px-3.5 py-2.5 text-xs text-brand-cream"
                      value={adultCount}
                      onChange={(e) => setAdultCount(Number(e.target.value))}
                    >
                      <option value={1}>1 {language === 'EN' ? 'Adult' : 'वयस्क'}</option>
                      <option value={2}>2 {language === 'EN' ? 'Adults' : 'वयस्क'}</option>
                      <option value={3}>3 {language === 'EN' ? 'Adults' : 'वयस्क'}</option>
                      <option value={4}>4 {language === 'EN' ? 'Adults' : 'वयस्क'}</option>
                    </select>
                  </div>

                  {/* Children capacity selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                      {language === 'EN' ? 'Accompanying Children (Ages 0-11)' : 'बच्चे (आयु ०-११)'}
                    </label>
                    <select 
                      className="w-full bg-brand-black border border-brand-gold/30 rounded-lg px-3.5 py-2.5 text-xs text-brand-cream"
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(Number(e.target.value))}
                    >
                      <option value={0}>0 {language === 'EN' ? 'Children' : 'बच्चे'}</option>
                      <option value={1}>1 {language === 'EN' ? 'Child' : 'बच्चा'}</option>
                      <option value={2}>2 {language === 'EN' ? 'Children' : 'बच्चे'}</option>
                      <option value={3}>3 {language === 'EN' ? 'Children' : 'बच्चे'}</option>
                    </select>
                  </div>

                </div>

                {/* ROYAL OPTIONAL CONVENIENCE ADD-ONS CHANGER */}
                <div className="border-t border-brand-gold/15 pt-5 space-y-4">
                  <div className="flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-brand-gold" />
                    <h4 className="font-serif text-sm tracking-widest uppercase text-brand-cream">
                      {language === 'EN' ? 'Palace Convenience Add-Ons & Services' : 'अतिरिक्त शाही सुविधाएँ और लक्जरी सेवाएं'}
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    
                    {/* Early Checkin */}
                    <label className={`block p-3.5 border rounded-xl cursor-pointer transition-all ${earlyCheckInWanted ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-gold/15 hover:border-brand-gold/40'}`}>
                      <div className="flex items-start gap-2.5">
                        <input 
                          type="checkbox" 
                          className="accent-brand-gold mt-0.5 mt-1 shrink-0"
                          checked={earlyCheckInWanted}
                          onChange={(e) => setEarlyCheckInWanted(e.target.checked)}
                        />
                        <div>
                          <span className="font-bold text-brand-white block">{language === 'EN' ? 'Early Check-in Surcharge (10 AM)' : 'शीघ्र चेक-इन सुविधा (सुबह १०:०० बजे)'}</span>
                          <span className="text-[10px] text-brand-gold block font-mono">₹2,000 flat</span>
                        </div>
                      </div>
                    </label>

                    {/* Airport VIP Pick */}
                    <label className={`block p-3.5 border rounded-xl cursor-pointer transition-all ${addonAirportPickup ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-gold/15 hover:border-brand-gold/40'}`}>
                      <div className="flex items-start gap-2.5">
                        <input 
                          type="checkbox" 
                          className="accent-brand-gold mt-1 shrink-0"
                          checked={addonAirportPickup}
                          onChange={(e) => setAddonAirportPickup(e.target.checked)}
                        />
                        <div>
                          <span className="font-bold text-brand-white block flex items-center gap-1.5">
                            <Plane className="w-3.5 h-3.5 text-brand-gold" />
                            {language === 'EN' ? 'Airport VIP Chauffeur Pickup' : 'हवाई अड्डा वीआईपी ड्राइवर पिकअप'}
                          </span>
                          <span className="text-[10px] text-brand-gold block font-mono">₹1,500 flat</span>
                        </div>
                      </div>
                    </label>

                    {/* Flower Garland */}
                    <label className={`block p-3.5 border rounded-xl cursor-pointer transition-all ${addonFlowerDeco ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-gold/15 hover:border-brand-gold/40'}`}>
                      <div className="flex items-start gap-2.5">
                        <input 
                          type="checkbox" 
                          className="accent-brand-gold mt-1 shrink-0"
                          checked={addonFlowerDeco}
                          onChange={(e) => setAddonFlowerDeco(e.target.checked)}
                        />
                        <div>
                          <span className="font-bold text-brand-white block">{language === 'EN' ? 'Royal Flower Garland Welcome Deco' : 'फ्लावर और बुके स्वागत द्वार सज्जा'}</span>
                          <span className="text-[10px] text-brand-gold block font-mono">₹2,500 flat</span>
                        </div>
                      </div>
                    </label>

                    {/* Birthday Cake */}
                    <label className={`block p-3.5 border rounded-xl cursor-pointer transition-all ${addonBirthdayCake ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-gold/15 hover:border-brand-gold/40'}`}>
                      <div className="flex items-start gap-2.5">
                        <input 
                          type="checkbox" 
                          className="accent-brand-gold mt-1 shrink-0"
                          checked={addonBirthdayCake}
                          onChange={(e) => setAddonBirthdayCake(e.target.checked)}
                        />
                        <div>
                          <span className="font-bold text-brand-white block flex items-center gap-1">
                            <Cake className="w-3.5 h-3.5 text-brand-gold" />
                            {language === 'EN' ? 'Bespoke Mewar Celebrations Cake' : 'शाही मेवाड़ सेलिब्रेशन केक (गिफ्ट)'}
                          </span>
                          <span className="text-[10px] text-brand-gold block font-mono">₹1,800 flat</span>
                        </div>
                      </div>
                    </label>

                    {/* Honeymoon Red Setup */}
                    <label className={`block p-3.5 border rounded-xl cursor-pointer transition-all ${addonHoneymoon ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-gold/15 hover:border-brand-gold/40'}`}>
                      <div className="flex items-start gap-2.5">
                        <input 
                          type="checkbox" 
                          className="accent-brand-gold mt-1 shrink-0"
                          checked={addonHoneymoon}
                          onChange={(e) => setAddonHoneymoon(e.target.checked)}
                        />
                        <div>
                          <span className="font-bold text-brand-white block flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 text-brand-gold" />
                            {language === 'EN' ? 'Rose Petals Honeymoon Setup' : 'गुलाब की पंखुड़ियों वाला सुइट हनीमून सैटअप'}
                          </span>
                          <span className="text-[10px] text-brand-gold block font-mono">₹5,000 flat</span>
                        </div>
                      </div>
                    </label>

                    {/* Extra rollaway bed */}
                    <label className={`block p-3.5 border rounded-xl cursor-pointer transition-all ${addonExtraBed ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-gold/15 hover:border-brand-gold/40'}`}>
                      <div className="flex items-start gap-2.5">
                        <input 
                          type="checkbox" 
                          className="accent-brand-gold mt-1 shrink-0"
                          checked={addonExtraBed}
                          onChange={(e) => setAddonExtraBed(e.target.checked)}
                        />
                        <div>
                          <span className="font-bold text-brand-white block">{language === 'EN' ? 'Extra Premium Rollaway Bed' : 'अतिरिक्त प्रीमियम रोलअवे अतिरिक्त बिस्तर'}</span>
                          <span className="text-[10px] text-brand-gold block font-mono">₹2,000 / Night</span>
                        </div>
                      </div>
                    </label>

                    {/* Baby Cot */}
                    <label className={`block p-3.5 border rounded-xl cursor-pointer transition-all ${addonBabyCot ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-gold/15 hover:border-brand-gold/40'}`}>
                      <div className="flex items-start gap-2.5">
                        <input 
                          type="checkbox" 
                          className="accent-brand-gold mt-1 shrink-0"
                          checked={addonBabyCot}
                          onChange={(e) => setAddonBabyCot(e.target.checked)}
                        />
                        <div>
                          <span className="font-bold text-brand-white block">{language === 'EN' ? 'Infant Cozy Velvet Baby Cot' : 'शिशु के लिए मखमली आरामदायक बेबी कॉट'}</span>
                          <span className="text-[10px] text-brand-gold block font-mono">₹500 / Night</span>
                        </div>
                      </div>
                    </label>

                    {/* Special request text */}
                    <div className="space-y-1.5 md:col-span-2 pt-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                        {language === 'EN' ? 'Special Demands / Food Allergies Request' : 'विशेष मांग / भोजन एलर्जी निर्देश (वैकल्पिक)'}
                      </label>
                      <textarea 
                        className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-3 text-xs text-brand-cream focus:border-brand-gold focus:outline-none min-h-[4rem]"
                        placeholder={language === 'EN' ? "Need ground floor option, gluten-free dining table, early wake-up high-tea, etc..." : "कृपया अपना विशेष निर्देश यहां दर्ज करें..."}
                        value={specialRequest}
                        onChange={(e) => setSpecialRequest(e.target.value)}
                      />
                    </div>

                  </div>
                </div>

                {/* MEAL PLAN SELECTION CARD */}
                <div className="border-t border-brand-gold/15 pt-5 space-y-3">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                    {language === 'EN' ? 'Consolidated Dining & Meal plan' : 'भोजन योजना का चयन'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <button 
                      type="button"
                      onClick={() => setAddonMealPlan('none')}
                      className={`p-3 border text-left rounded-xl transition-all ${addonMealPlan === 'none' ? 'border-brand-gold bg-brand-gold/5 font-bold' : 'border-brand-gold/10 text-brand-cream/80'}`}
                    >
                      <span className="block text-brand-white select-none">✕ {language === 'EN' ? 'No Meal Plan' : 'कोई डाइनिंग प्लान नहीं'}</span>
                      <span className="text-[10px] block font-mono text-brand-gold mt-1">₹0 surcharge</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setAddonMealPlan('breakfast')}
                      className={`p-3 border text-left rounded-xl transition-all ${addonMealPlan === 'breakfast' ? 'border-brand-gold bg-brand-gold/5 font-bold' : 'border-brand-gold/10 text-brand-cream/80'}`}
                    >
                      <span className="block text-brand-white">🌅 {language === 'EN' ? 'Breakfast Plan' : 'केवल शाही नाश्ता प्लान'}</span>
                      <span className="text-[10px] block font-mono text-brand-gold mt-1">₹899 / Day / Guest</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setAddonMealPlan('all')}
                      className={`p-3 border text-left rounded-xl transition-all ${addonMealPlan === 'all' ? 'border-brand-gold bg-brand-gold/5 font-bold' : 'border-brand-gold/10 text-brand-cream/80'}`}
                    >
                      <span className="block text-brand-white">♛ {language === 'EN' ? 'All-Meals plan' : 'पूरी ३-वक्त भोजन शाही प्लान'}</span>
                      <span className="text-[10px] block font-mono text-brand-gold mt-1">₹2,499 / Day / Guest</span>
                    </button>
                  </div>
                </div>

                {/* NEXT ACTION PROCEED */}
                <div className="pt-5 border-t border-brand-gold/15 flex justify-end">
                  <button 
                    onClick={handleStep1Proceed}
                    className="px-8 py-3 bg-gold-gradient text-brand-black text-xs font-black uppercase tracking-widest rounded-lg flex items-center gap-1 shadow-lg cursor-pointer hover:scale-105 transition-transform"
                  >
                    <span>{language === 'EN' ? 'Verify Residence & Select Details' : 'कक्ष सत्यापित करें और आगे बढ़ें'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* STEP 2: GUEST DETAILS & ID FORM */}
            {currentStep === 2 && (
              <div className="shake-error-target bg-[#111122]/90 border border-brand-gold/25 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md">
                
                <div className="border-b border-brand-gold/15 pb-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-serif text-lg tracking-widest uppercase text-brand-gold">
                      {language === 'EN' ? '2. Lead Dignitary Registry & Credentials' : '२. मुख्य अतिथि पंजीकरण एवं प्रमाण-पात्र'}
                    </h3>
                    <p className="text-[10px] text-brand-cream/70 mt-1 uppercase font-mono tracking-wider">
                      {language === 'EN' ? 'All (*) marked fields are mandatory for Police clearance' : 'पुलिस सुरक्षा मंजूरी हेतु (*) वाले स्थान अनिवार्य हैं'}
                    </p>
                  </div>
                  
                  {/* Quick toggle default filler action if user logged in */}
                  {!user && (
                    <button 
                      onClick={triggerLogin}
                      className="text-[9px] uppercase tracking-wider text-brand-gold underline border-none bg-none p-0"
                    >
                      {language === 'EN' ? 'Fill from User Profile' : 'प्रोफ़ाइल से विवरण भरें'}
                    </button>
                  )}
                </div>

                {/* Grid Form for details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                  
                  {/* Title Selection */}
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                      {language === 'EN' ? 'Title*' : 'उपाधि*'}
                    </label>
                    <select 
                      className="w-full bg-brand-black border border-brand-gold/30 rounded-lg px-3 py-2 text-brand-cream"
                      value={personalTitle}
                      onChange={(e) => setPersonalTitle(e.target.value)}
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Lord">Lord Secretariat</option>
                      <option value="Maharaja">His Highness Maharaja</option>
                    </select>
                  </div>

                  {/* First Name */}
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                      {language === 'EN' ? 'First Name*' : 'प्रथम नाम (First Name)*'}
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder={language === 'EN' ? "e.g. Yashvardhan" : "जैसे- यशवर्धन"}
                      className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-xs text-brand-cream"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    {validationErrors.firstName && <span className="text-[10px] text-red-400 font-bold block">{validationErrors.firstName}</span>}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                      {language === 'EN' ? 'Last Name / Clan*' : 'उपनाम / जातिवंश (Last Name)*'}
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder={language === 'EN' ? "e.g. Rathore" : "जैसे- राठौर"}
                      className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-xs text-brand-cream"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    {validationErrors.lastName && <span className="text-[10px] text-red-400 font-bold block">{validationErrors.lastName}</span>}
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                      {language === 'EN' ? 'Active Confirmation Email Address*' : 'सक्रिय ईमेल पता (पुष्टिकरण हेतु)*'}
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="dignitary@mewarofficial.com"
                      className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-xs text-brand-cream"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                    />
                    {validationErrors.email && <span className="text-[10px] text-red-400 font-bold block">{validationErrors.email}</span>}
                  </div>

                  {/* Birth Date for age confirmation */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                      {language === 'EN' ? 'Date of Birth (Min age 18)*' : 'जन्म तिथि (न्यूनतम १८ वर्ष)*'}
                    </label>
                    <input 
                      type="date" 
                      required
                      className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-xs text-brand-cream"
                      value={guestDob}
                      onChange={(e) => setGuestDob(e.target.value)}
                    />
                    {validationErrors.dob && <span className="text-[10px] text-red-400 font-bold block">{validationErrors.dob}</span>}
                  </div>

                  {/* Phone contact standard Indian formatting */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                      {language === 'EN' ? 'Telephone Connection (+91 Mobile)*' : 'मोबाइल नंबर (+91 भारत)*'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-xs text-brand-gold/75 font-bold font-mono">🇮🇳 +91</span>
                      <input 
                        type="tel" 
                        required
                        placeholder="9876543210"
                        className="w-full bg-brand-black border border-brand-gold/30 rounded-lg pl-16 pr-3 py-2.5 text-xs text-brand-cream font-mono"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                    {validationErrors.phone && <span className="text-[10px] text-red-400 font-bold block">{validationErrors.phone}</span>}
                  </div>

                  {/* Alternative number */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                      {language === 'EN' ? 'Alternate Mobile Number' : 'वैकल्पिक दूरभाष नंबर'}
                    </label>
                    <input 
                      type="tel" 
                      placeholder="+91 ... (optional)"
                      className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-xs text-brand-cream font-mono"
                      value={alternatePhone}
                      onChange={(e) => setAlternatePhone(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>

                  {/* Nationality selector dropdown (India first) */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                      {language === 'EN' ? 'Nationality / Citizenship*' : 'राष्ट्रीयता / नागरिकता*'}
                    </label>
                    <select 
                      className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-xs text-brand-cream"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                    >
                      <option value="India">🇮🇳 India</option>
                      <option value="United States">🇺🇸 United States</option>
                      <option value="United Kingdom">🇬🇧 United Kingdom</option>
                      <option value="United Arab Emirates">🇦🇪 United Arab Emirates</option>
                      <option value="Germany">🇩🇪 Germany</option>
                      <option value="Singapore">🇸🇬 Singapore</option>
                    </select>
                  </div>

                  {/* State selector dropdown if India */}
                  {nationality === 'India' ? (
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                        {language === 'EN' ? 'Indian Sovereign State*' : 'राज्य*'}
                      </label>
                      <select 
                        className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-xs text-brand-cream"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                        {language === 'EN' ? 'State / Region (International)*' : 'राज्य / प्रांत समूह*'}
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. California"
                        className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-xs text-brand-cream"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                      />
                    </div>
                  )}

                  {/* City Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                      {language === 'EN' ? 'Resident City*' : 'शहर*'}
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Udaipur"
                      className="w-full bg-[#0d0d1a] border border-brand-gold/30 rounded-lg p-2.5 text-xs text-brand-cream"
                      value={cityName}
                      onChange={(e) => setCityName(e.target.value)}
                    />
                  </div>

                  {/* Postal Pin Code */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                      {language === 'EN' ? 'Postal Pin Code (6 digits)*' : 'पिन कोड (६ अंक)*'}
                    </label>
                    <input 
                      type="text" 
                      required
                      maxLength={6}
                      placeholder="313001"
                      className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-xs text-brand-cream font-mono"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    />
                    {validationErrors.pinCode && <span className="text-[10px] text-red-400 font-bold block">{validationErrors.pinCode}</span>}
                  </div>

                  {/* Residential Address */}
                  <div className="space-y-1.5 md:col-span-3">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                      {language === 'EN' ? 'Full Resident Address (Police Mandate Record)*' : 'पूरा पता (सुरक्षा पुलिस रिकॉर्ड)*'}
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="House No., Street, Palace Arch Lane..."
                      className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-xs text-brand-cream"
                      value={fullAddress}
                      onChange={(e) => setFullAddress(e.target.value)}
                    />
                    {validationErrors.address && <span className="text-[10px] text-red-400 font-bold block">{validationErrors.address}</span>}
                  </div>

                </div>

                {/* FOREIGN NATIONAL EXTRA REGULATED INPUTS */}
                {nationality !== 'India' && (
                  <div className="p-4 bg-indigo-950/20 border border-brand-gold/20 rounded-xl space-y-4 animate-fade-in text-xs font-sans">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4 text-brand-gold" />
                      <h4 className="font-serif text-xs font-bold uppercase text-brand-gold tracking-widest">
                        {language === 'EN' ? 'Foreign National Compliance Records Required (Form C)' : 'विदेशी नागरिकों के लिए अनिवार्य ब्यूरो सूचना प्रविष्टि (फॉर्म C)'}
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wider block">Passport Number*</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Z-1234567"
                          className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-brand-cream font-mono"
                          value={passportNumber}
                          onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                        />
                        {validationErrors.passportNumber && <span className="text-red-400 font-semibold block">{validationErrors.passportNumber}</span>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-[#E8D5A3] tracking-wider block">Visa Category / Type*</label>
                        <select 
                          className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-brand-cream"
                          value={visaType}
                          onChange={(e) => setVisaType(e.target.value)}
                        >
                          <option value="Tourist">Tourist / E-Visa</option>
                          <option value="Business">Business Visa</option>
                          <option value="Student">Student Visa</option>
                          <option value="Diplomatic">Diplomatic Visa</option>
                          <option value="Employment">Employment Visa</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wider block">Indian Entry Visa Number*</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. VISA-98765"
                          className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-brand-cream font-mono"
                          value={visaNumber}
                          onChange={(e) => setVisaNumber(e.target.value.toUpperCase())}
                        />
                        {validationErrors.visaNumber && <span className="text-red-400 font-semibold block">{validationErrors.visaNumber}</span>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wider block">Visa Place of Issue*</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. London, Washington or Online"
                          className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-brand-cream"
                          value={visaPlaceOfIssue}
                          onChange={(e) => setVisaPlaceOfIssue(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wider block">Indian Port of Entry*</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. New Delhi IGI Airport, Mumbai"
                          className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-brand-cream"
                          value={portOfEntry}
                          onChange={(e) => setPortOfEntry(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wider block">Expected Stay Duration (Days)*</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. 15 Days"
                          className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-brand-cream"
                          value={durationOfStay}
                          onChange={(e) => setDurationOfStay(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wider block">Purpose of Visit*</label>
                        <select 
                          className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-brand-cream"
                          value={purposeOfVisit}
                          onChange={(e) => setPurposeOfVisit(e.target.value)}
                        >
                          <option value="Leisure / Tourism">Tourism & Leisure Stay</option>
                          <option value="Business conference">Business conference / G20 retreat</option>
                           <option value="Medical treatment">Medical treatment</option>
                          <option value="Visting family">Family / Transit Stay</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wider block">Country of Origin / Departure*</label>
                        <input 
                          type="text" 
                          required
                          placeholder="United Kingdom"
                          className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-brand-cream"
                          value={countryOfOrigin}
                          onChange={(e) => setCountryOfOrigin(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] uppercase font-bold text-brand-cream tracking-wider block">Arrival Date in India*</label>
                        <input 
                          type="date" 
                          required
                          className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-brand-cream"
                          value={arrivalInIndiaDate}
                          onChange={(e) => setArrivalInIndiaDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ID PROOF ATTACHMENTS (mandatory checks) */}
                <div className="space-y-4 pt-4 border-t border-brand-gold/15 text-xs font-sans">
                  
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-brand-gold" />
                    <h4 className="font-serif text-sm tracking-widest uppercase text-brand-cream">
                      {language === 'EN' ? 'Identification Proof Verification' : 'पहचान पत्र सत्यापन दस्तावेज़'}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* ID Type dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                        {language === 'EN' ? 'Select ID Proof Type*' : 'पहचान पत्र का प्रकार*'}
                      </label>
                      <select 
                        className="w-full bg-[#0e0e1b] border border-brand-gold/30 rounded-lg p-2.5 text-brand-cream"
                        value={idType}
                        onChange={(e) => {
                          setIdType(e.target.value);
                          setIdNumber('');
                        }}
                      >
                        <option value="Aadhaar Card">Aadhaar Card (12 Digits India)</option>
                        <option value="PAN Card">PAN Card (Indian Citizens/Business)</option>
                        <option value="Passport">Passport (International/Diplomat)</option>
                        <option value="Driving License">Driving License</option>
                        <option value="Voter ID Card">Voter ID Card</option>
                        <option value="Government ID">Government Official ID</option>
                      </select>
                    </div>

                    {/* ID number */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                        {language === 'EN' ? `Specific Identification Number for ${idType}*` : `${idType} संख्या*`}
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder={idType === 'Aadhaar Card' ? "e.g. 1111 2222 3333" : idType === 'PAN Card' ? "e.g. ABCDE1234F" : "Identification code"}
                        className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-brand-cream font-mono"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                      />
                      {validationErrors.idNumber && <span className="text-[10px] text-red-400 font-bold block">{validationErrors.idNumber}</span>}
                    </div>

                    {/* GSTIN Surcharge (optional for business bookings) */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                        {language === 'EN' ? 'GSTIN (Optional Corporate claim)' : 'जीएसटी संख्या (वैकल्पिक व्यावसायिक)'}
                      </label>
                      <input 
                        type="text" 
                        maxLength={15}
                        placeholder="e.g. 08AAAAA1111A1Z1"
                        className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-brand-cream font-mono uppercase"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                      />
                      {validationErrors.gstin && <span className="text-[10px] text-red-400 font-bold block">{validationErrors.gstin}</span>}
                    </div>

                    {/* Company Name */}
                    {gstin.trim() && (
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                          {language === 'EN' ? 'Company Name for Corporate Claims*' : 'कंपनी का नाम*'}
                        </label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Mewar Heritage Holdings Ltd."
                          className="w-full bg-brand-black border border-brand-gold/30 rounded-lg p-2.5 text-brand-cream"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                      </div>
                    )}

                  </div>

                  {/* DRAG AND DROP ID UPLOADER DRAGZONE */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">
                      {language === 'EN' ? 'Drag Up Physical Identity Documents Scan (ID Proof Front + Back)*' : 'दस्तावेज़ की फाइल / फ़ोटो अपलोड करें*'}
                    </label>

                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all relative cursor-pointer ${
                        isDragging ? 'border-brand-gold bg-brand-gold/10' : 'border-brand-gold/20 hover:border-brand-gold/60'
                      }`}
                    >
                      <input 
                        type="file" 
                        id="form-identity-uploader"
                        multiple
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={triggerMockFileUpload}
                      />
                      <Upload className="w-8 h-8 text-brand-gold/60 mx-auto mb-2 animate-pulse" />
                      <p className="text-xs text-brand-white font-medium">
                        {language === 'EN' ? 'Drag & Drop files here, or click to browse' : 'फ़ाइल को ड्रैग-एंड-ड्रॉप करें या कंप्यूटर से खोजें'}
                      </p>
                      <p className="text-[9px] text-brand-cream/55 mt-1">
                        {language === 'EN' ? 'Supports JPEG, PNG, or PDF scans (Maximum 5MB each file)' : 'JPEG, PNG, या PDF (अधिकतम ५एमबी प्रति फ़ाइल)'}
                      </p>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-1.5 p-3 rounded-xl bg-brand-navy/40 border border-brand-gold/20 text-xs">
                        <span className="text-[10px] text-brand-gold font-bold block uppercase tracking-wider">{language === 'EN' ? 'Attached Documents Scans Ready:' : 'अपलोड की गई दस्तावेज़ फ़ाइलें:'}</span>
                        {uploadedFiles.map((f, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[11px] text-brand-cream/90 bg-[#121226]/60 p-1.5 rounded border border-brand-gold/5">
                            <span className="truncate max-w-xs block font-mono">📁 {f.name}</span>
                            <span className="text-[9px] font-bold text-brand-gold">{f.size}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {validationErrors.files && <span className="text-red-400 font-bold text-[10px] block mt-1">{validationErrors.files}</span>}
                  </div>

                </div>

                {/* STEPS BUTTON TRIGGERS */}
                <div className="pt-5 border-t border-brand-gold/15 flex justify-between">
                  <button 
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 border border-brand-gold/20 text-brand-cream hover:border-brand-gold hover:text-brand-white text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{language === 'EN' ? 'Back' : 'पीछे जाएँ'}</span>
                  </button>
                  <button 
                    onClick={handleStep2Proceed}
                    className="px-8 py-3 bg-gold-gradient text-brand-black text-xs font-black uppercase tracking-widest rounded-lg flex items-center gap-1 shadow-lg cursor-pointer hover:border-brand-gold transition-all"
                  >
                    <span>{language === 'EN' ? 'Confirm ID Credentials & Pay' : 'आगे बढ़ें और भुगतान चुनें'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* STEP 3: PAYMENT & CONFIRMATION PANEL */}
            {currentStep === 3 && (
              <div className="bg-[#111122]/90 border border-brand-gold/25 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md">
                
                <div className="border-b border-brand-gold/15 pb-4">
                  <h3 className="font-serif text-lg tracking-widest uppercase text-brand-gold">
                    {language === 'EN' ? '3. Escrow Secure Treasury Clearance' : '३. सुरक्षित एस्क्रो कोषागार भुगतान'}
                  </h3>
                  <p className="text-[10px] text-brand-cream/70 mt-1 uppercase font-mono tracking-wider">
                    {language === 'EN' ? 'Indian Gateway SSL Encrypted Interface' : 'एसएसएल एन्क्रिप्टेड भारतीय गेटवे'}
                  </p>
                </div>

                {/* Option to Pay Advance Slider (20% advance or 100% full) */}
                <div className="p-4 bg-brand-navy/35 rounded-xl border border-brand-gold/20 text-xs">
                  <span className="text-[10px] text-brand-gold font-bold uppercase block tracking-widest mb-2">
                    {language === 'EN' ? 'Flexible Trust Payment Allocation' : 'लचीला भुगतान आवंटन'}
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Pay Advance only */}
                    <div 
                      onClick={() => setPayingAdvanceOnly(true)}
                      className={`p-3.5 border rounded-xl cursor-pointer transition-all ${payingAdvanceOnly ? 'border-brand-gold bg-brand-gold/10' : 'border-brand-gold/10 hover:border-brand-gold/30'}`}
                    >
                      <span className="font-bold text-brand-white block flex items-center gap-1.5 justify-between">
                        <span>{language === 'EN' ? 'Pay Secure Advance (20%)' : 'न्यूनतम २०% अग्रिम राशि'}</span>
                        {payingAdvanceOnly && <CheckCircle className="w-4 h-4 text-brand-gold" />}
                      </span>
                      <span className="text-[10px] text-brand-gold block font-mono mt-1">
                        ₹{calculatedAdvanceAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] text-brand-cream/60 block mt-1">
                        {language === 'EN' ? `Rest ₹${calculatedPayAtHotelAmount.toLocaleString('en-IN')} at check-out desk` : `शेष राशि चेक-आउट के समय काउंटर पर देय होगी`}
                      </span>
                    </div>

                    {/* Pay Full 100% now */}
                    <div 
                      onClick={() => setPayingAdvanceOnly(false)}
                      className={`p-3.5 border rounded-xl cursor-pointer transition-all ${!payingAdvanceOnly ? 'border-brand-gold bg-brand-gold/10' : 'border-brand-gold/10 hover:border-brand-gold/30'}`}
                    >
                      <span className="font-bold text-brand-white block flex items-center gap-1.5 justify-between">
                        <span>{language === 'EN' ? 'Pay Full Amount now (100%)' : 'पूर्ण शत-प्रतिशत भुगतान करें'}</span>
                        {!payingAdvanceOnly && <CheckCircle className="w-4 h-4 text-brand-gold" />}
                      </span>
                      <span className="text-[10px] text-brand-gold block font-mono mt-1">
                        ₹{grandTotalOverall.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] text-brand-cream/60 block mt-1">
                        {language === 'EN' ? 'Fast express Check-out clearance enabled' : 'त्वरित एक्सप्रेस चेक-आउट सुविधा अनलॉक'}
                      </span>
                    </div>

                  </div>
                </div>

                {/* SELECT TREASURY MODE GATEWAYS */}
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold text-brand-cream/70 block tracking-widest">
                    {language === 'EN' ? 'Select Gateway Merchant Channel' : 'भुगतान विधि चुनें'}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    
                    {/* UPI */}
                    <label className={`block p-3.5 border rounded-xl cursor-pointer transition-all ${selectedPayMethod === 'upi' ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-gold/10 hover:border-brand-gold/30'}`}>
                      <div className="flex justify-between items-center text-brand-white font-bold">
                        <span className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-brand-gold" />
                          <span>UPI Apps (GPay, PhonePe, Paytm)</span>
                        </span>
                        <input 
                          type="radio" 
                          name="payMethodMain" 
                          checked={selectedPayMethod === 'upi'}
                          onChange={() => setSelectedPayMethod('upi')}
                          className="accent-brand-gold"
                        />
                      </div>
                    </label>

                    {/* Cards */}
                    <label className={`block p-3.5 border rounded-xl cursor-pointer transition-all ${selectedPayMethod === 'card' ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-gold/10 hover:border-brand-gold/30'}`}>
                      <div className="flex justify-between items-center text-brand-white font-bold">
                        <span className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-brand-gold" />
                          <span>Signature Debit / Credit Cards</span>
                        </span>
                        <input 
                          type="radio" 
                          name="payMethodMain" 
                          checked={selectedPayMethod === 'card'}
                          onChange={() => setSelectedPayMethod('card')}
                          className="accent-brand-gold"
                        />
                      </div>
                    </label>

                    {/* Netbanking */}
                    <label className={`block p-3.5 border rounded-xl cursor-pointer transition-all ${selectedPayMethod === 'netbanking' ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-gold/10 hover:border-brand-gold/30'}`}>
                      <div className="flex justify-between items-center text-brand-white font-bold">
                        <span className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-brand-gold" />
                          <span>Netbanking (HDFC, ICICI, SBI)</span>
                        </span>
                        <input 
                          type="radio" 
                          name="payMethodMain" 
                          checked={selectedPayMethod === 'netbanking'}
                          onChange={() => setSelectedPayMethod('netbanking')}
                          className="accent-brand-gold"
                        />
                      </div>
                    </label>

                    {/* Pay at Hotel */}
                    <label className={`block p-3.5 border rounded-xl cursor-pointer transition-all ${selectedPayMethod === 'pay_at_hotel' ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-gold/10 hover:border-brand-gold/30'}`}>
                      <div className="flex justify-between items-center text-brand-white font-bold">
                        <span className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-brand-gold" />
                          <span>Pay Cash/Card at Hotel Counter</span>
                        </span>
                        <input 
                          type="radio" 
                          name="payMethodMain" 
                          checked={selectedPayMethod === 'pay_at_hotel'}
                          onChange={() => setSelectedPayMethod('pay_at_hotel')}
                          className="accent-brand-gold"
                        />
                      </div>
                    </label>

                    {/* EMI Options */}
                    <label className={`block p-3.5 border rounded-xl cursor-pointer transition-all md:col-span-2 ${selectedPayMethod === 'emi' ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-gold/10 hover:border-brand-gold/30'}`}>
                      <div className="flex justify-between items-center text-brand-white font-bold mb-2">
                        <span className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-brand-gold" />
                          <span>Flexible Bank EMI Surcharge (3 to 12 Months)</span>
                        </span>
                        <input 
                          type="radio" 
                          name="payMethodMain" 
                          checked={selectedPayMethod === 'emi'}
                          onChange={() => setSelectedPayMethod('emi')}
                          className="accent-brand-gold"
                        />
                      </div>
                      
                      {selectedPayMethod === 'emi' && (
                        <div className="p-3 bg-brand-black/40 rounded border border-brand-gold/10 grid grid-cols-3 gap-2 text-[10px] animate-fade-in font-sans">
                          <button 
                            type="button" 
                            onClick={() => setEmiDuration(3)}
                            className={`p-2 rounded border text-center font-bold ${emiDuration === 3 ? 'border-brand-gold text-brand-gold bg-brand-gold/15' : 'border-brand-gold/15 text-brand-cream/80'}`}
                          >
                            ₹{(grandTotalOverall / 3).toFixed(0)}/mo (3 Months HDFC)
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setEmiDuration(6)}
                            className={`p-2 rounded border text-center font-bold ${emiDuration === 6 ? 'border-brand-gold text-brand-gold bg-brand-gold/15' : 'border-brand-gold/15 text-brand-cream/80'}`}
                          >
                            ₹{(grandTotalOverall / 6).toFixed(0)}/mo (6 Months SBI)
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setEmiDuration(12)}
                            className={`p-2 rounded border text-center font-bold ${emiDuration === 12 ? 'border-brand-gold text-brand-gold bg-brand-gold/15' : 'border-brand-gold/15 text-brand-cream/80'}`}
                          >
                            ₹{(grandTotalOverall / 12).toFixed(0)}/mo (12 Months ICICI)
                          </button>
                        </div>
                      )}
                    </label>

                  </div>
                </div>

                {/* CONFIRMATION INSTRUCTIONS AND AGREE */}
                <div className="p-4 bg-brand-black/20 rounded-xl space-y-2 text-[11px] text-brand-cream/75 font-sans">
                  <p className="flex items-start gap-1 pb-1">
                    <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span className="font-bold text-brand-white">Indian Policed Mandated Check-out policy:</span>
                  </p>
                  <p>• Lead guest is highly encouraged to produce the same physical ID proof at the reception desk mapped during Step 2 of registration.</p>
                  <p>• Standard Check-in is authorized from 2:00 PM IST; absolute Check-out is fixed strictly at 12:00 PM IST window.</p>
                </div>

                {/* BUTTON ACTIONS */}
                <div className="pt-5 border-t border-brand-gold/15 flex justify-between">
                  <button 
                    onClick={() => setCurrentStep(2)}
                    disabled={isProcessingPayment}
                    className="px-6 py-3 border border-brand-gold/20 text-brand-cream hover:border-brand-gold text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{language === 'EN' ? 'Back' : 'पीछे जाएँ'}</span>
                  </button>
                  <button 
                    onClick={handleCheckoutSubmission}
                    disabled={isProcessingPayment}
                    className="px-8 py-3 bg-gold-gradient text-brand-black text-xs font-black uppercase tracking-widest rounded-lg flex items-center gap-2 shadow-lg cursor-pointer hover:brightness-110 disabled:opacity-50 transition-all"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>
                      {isProcessingPayment 
                        ? (language === 'EN' ? 'Authenticating Secure Escrow...' : 'सुरक्षित एस्क्रो प्रमाणीकरण जारी...') 
                        : (language === 'EN' 
                          ? `Pay ₹${(payingAdvanceOnly ? calculatedAdvanceAmount : grandTotalOverall).toLocaleString('en-IN')} & Confirm` 
                          : `भुगतान करें ₹${(payingAdvanceOnly ? calculatedAdvanceAmount : grandTotalOverall).toLocaleString('en-IN')} और तय करें`)}
                    </span>
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* RIGHT SIDE: DYNAMIC SOVEREIGN CALCULATION ESTIMATE PANEL */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Core Chambray Visual Card */}
            <div className="bg-[#111122]/90 border border-brand-gold/15 rounded-2xl overflow-hidden shadow-xl select-none">
              <img 
                src={activeRoom.images[0]} 
                alt={activeRoom.name} 
                className="w-full h-44 object-cover filter brightness-75"
                referrerPolicy="no-referrer"
              />
              <div className="p-5 space-y-2">
                <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest block">{activeRoom.category} Luxury Suite</span>
                <h3 className="font-serif text-lg text-brand-cream uppercase tracking-wide">{language === 'EN' ? activeRoom.name : activeRoom.nameHI}</h3>
                <p className="text-xs text-brand-cream/70 italic font-sans leading-relaxed">
                  {language === 'EN' ? activeRoom.viewType : activeRoom.viewTypeHI}
                </p>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="bg-[#111122]/95 border-2 border-brand-gold/20 rounded-2xl p-6 space-y-5 shadow-2xl backdrop-blur-md">
              
              <div className="border-b border-brand-gold/15 pb-3">
                <span className="text-[10px] tracking-widest text-[#B39359] font-bold uppercase block mb-1">
                  {language === 'EN' ? 'RESERVATION ESCROW ESTIMATE' : 'आरक्षण ब्यौरा विवरण'}
                </span>
                <h4 className="font-serif text-base text-brand-white uppercase font-black">
                  {language === 'EN' ? 'Cumulative Invoice Sheet' : 'कुल देय रसीद पत्र'}
                </h4>
              </div>

              {/* Promo validation coupon field container */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-cream block">{language === 'EN' ? 'Have Promo Code / Royal Voucher?' : 'शाही कूपन / डिस्काउंट कोड?'}</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. RAJASTHAN2026"
                    className="flex-1 bg-brand-black border border-brand-gold/25 rounded-md px-3 py-1.5 text-xs text-brand-cream font-mono uppercase"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3.5 bg-brand-navy border border-brand-gold/30 hover:border-brand-gold text-brand-gold text-[10px] font-bold uppercase rounded-md transition-all cursor-pointer"
                  >
                    {language === 'EN' ? 'Apply' : 'लागू करें'}
                  </button>
                </div>
                {promoError && <span className="text-[10px] text-red-400 font-bold block">{promoError}</span>}
                {promoSuccess && <span className="text-[10px] text-emerald-400 font-bold block leading-normal">{promoSuccess}</span>}
              </div>

              {/* Financial values list */}
              <div className="space-y-3.5 text-xs text-brand-cream/90 font-sans border-t border-brand-gold/10 pt-4">
                
                <div className="flex justify-between">
                  <span className="text-brand-cream/70">{language === 'EN' ? 'Luxury Core Tariff' : 'प्रति रात्रि किराया'} (₹{activeRoom.priceINR.toLocaleString('en-IN')} x {nightCount} nights)</span>
                  <span className="text-brand-white font-mono"><AnimatedPrice value={computedRoomCharges} /></span>
                </div>

                {/* Surcharges listing if greater than 0 */}
                {totalAddonsAndSurcharges > 0 && (
                  <div className="flex justify-between text-[11px] bg-brand-navy/20 p-2 rounded border border-brand-gold/5">
                    <span className="text-brand-cream/70">{language === 'EN' ? 'Convenience add-ons total' : 'अतिरिक्त लक्जरी ऐड-ऑन्स'}</span>
                    <span className="text-brand-white font-mono"><AnimatedPrice value={totalAddonsAndSurcharges} /></span>
                  </div>
                )}

                {/* Promo Credits */}
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-[#E0B859] font-bold">
                    <span>{language === 'EN' ? `Voucher Credits (${promoDiscount * 100}%)` : 'कूपन छूट'}</span>
                    <span className="font-mono">-<AnimatedPrice value={computedPromoDiscountAmount} /></span>
                  </div>
                )}

                {/* CGST + SGST (18% inclusive) */}
                <div className="flex justify-between text-[11px]">
                  <span className="text-brand-cream/70">{language === 'EN' ? 'CGST & SGST (18% Mandated)' : 'भारत सरकार जीएसटी (१८%)'}</span>
                  <span className="text-brand-white font-mono"><AnimatedPrice value={computedGstPercentAmount} /></span>
                </div>

                {/* Royal service 5% charge */}
                <div className="flex justify-between text-[11px] border-b border-brand-gold/10 pb-4">
                  <span className="text-brand-cream/70">{language === 'EN' ? 'Imperial Concierge Fee (5%)' : 'शाही बटलर सेवा प्रभार (५%)'}</span>
                  <span className="text-brand-white font-mono font-medium"><AnimatedPrice value={computedServiceChargeAmount} /></span>
                </div>

                {/* Grand Gross overall sum */}
                <div className="flex justify-between text-brand-gold font-serif text-base font-bold pt-1">
                  <span>{language === 'EN' ? 'Grand Treasury invoice' : 'कुल देय राशि'}</span>
                  <span className="gold-glow font-mono"><AnimatedPrice value={grandTotalOverall} /></span>
                </div>

              </div>

              {/* Trust badges footer inside checkout info */}
              <div className="border-t border-brand-gold/10 pt-4 text-[10px] text-brand-cream/55 flex justify-center items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-brand-gold" />
                <span>100% Secure SSL Handshake Certified</span>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* RAZORPAY INDIVIDUALLY EMBEDDED OTP SCREEN OVERLAY */}
      {showOtpPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-black/90 backdrop-blur-sm" onClick={() => setShowOtpPopup(false)} />
          
          <div className="relative w-full max-w-sm bg-[#1A1A2E] border-2 border-brand-gold/40 rounded-xl overflow-hidden shadow-2xl text-white font-sans">
            
            {/* Header info */}
            <div className="bg-brand-black p-4 text-center border-b border-brand-gold/20">
              <span className="text-brand-gold font-bold text-xs tracking-widest block uppercase">RAZORPAY 3D SECURE</span>
              <p className="text-[10px] text-white/50 mt-0.5">{language === 'EN' ? 'Demo Secured Authentication Gateway' : 'सुरक्षित बैंक भुगतान गेटवे'}</p>
            </div>

            <form onSubmit={handleVerifyOtp} className="p-6 space-y-4">
              <div className="text-center space-y-2">
                <ShieldCheck className="w-9 h-9 text-brand-gold mx-auto animate-bounce" />
                <p className="text-xs text-white/80 leading-relaxed">
                  {language === 'EN' 
                    ? `OTP has been successfully transmitted to ${guestPhone || 'your contact phone'}.` 
                    : `आपके मोबाइल नंबर ${guestPhone || 'फोन'} पर ६ अंकों का सुरक्षा पिन भेजा गया है।`}
                </p>
              </div>

              <div className="space-y-2">
                <input 
                  type="text" 
                  maxLength={6}
                  required
                  placeholder="123456"
                  className="w-full tracking-[1em] text-center font-mono font-black py-2.5 rounded border border-brand-gold/40 bg-brand-black text-brand-gold text-lg focus:outline-none focus:ring-1 focus:ring-brand-gold"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                />
                
                {otpError && <span className="text-[10px] text-red-400 font-bold block text-center">{otpError}</span>}
                <p className="text-[9px] text-white/40 italic text-center leading-normal">
                  {language === 'EN' ? 'Use code "123456" or any 6 digits to verify the transaction.' : 'सत्यापित करने के लिए "123456" या कोई भी ६ अंक प्रविष्ट करें।'}
                </p>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-green-700 hover:bg-green-600 font-bold uppercase tracking-wider text-xs rounded-lg transition-all cursor-pointer"
              >
                {language === 'EN' ? 'Authorize Payment Transfer' : 'सुरक्षित भुगतान पूरा करें'}
              </button>
            </form>

            <div className="bg-brand-black p-2.5 text-center text-[8px] text-white/40 border-t border-brand-gold/10">
              Powered by Razorpay Secure Gateway Platform Inc.
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
