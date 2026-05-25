import React, { useState, useEffect } from 'react';
import { LanguageType } from '../types';
import { 
  Printer, 
  BookOpen, 
  Scale, 
  ShieldCheck, 
  FileText, 
  Languages, 
  Eye, 
  Lock, 
  Building, 
  FileSignature, 
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Info,
  Calendar,
  Layers,
  MapPin,
  FileCheck
} from 'lucide-react';

interface PrivacyPolicyProps {
  language: LanguageType;
}

type TabType = 'policy' | 'terms';

export default function PrivacyPolicy({ language: globalLanguage }: PrivacyPolicyProps) {
  const [activeTab, setActiveTab] = useState<TabType>('policy');
  const [localLanguage, setLocalLanguage] = useState<LanguageType>(globalLanguage);

  // Keep in sync with global language if changed by header, but support local override
  useEffect(() => {
    setLocalLanguage(globalLanguage);
  }, [globalLanguage]);

  const [activeSection, setActiveSection] = useState<string>('');

  const handlePrint = () => {
    window.print();
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  const isEN = localLanguage === 'EN';

  // Privacy Policy Content Map with Bilingual keys
  const policySections = [
    {
      id: 'sec-1',
      titleEN: '1. Information We Collect',
      titleHI: '1. हम कौन सी जानकारी एकत्र करते हैं',
      content: (
        <div className="space-y-3">
          <p>
            {isEN 
              ? 'To deliver a bespoke 5-star experience, ANJUMAN Palace Hotel gathers specific details during your booking run, check-in registration, or general helpdesk communications:' 
              : 'एक विशिष्ट पांच सितारा विशेषाधिकार अनुभव प्रदान करने के लिए, अंजुमन पैलेस होटल आपकी बुकिंग, चेक-इन पंजीकरण, या सामान्य पूछताछ के दौरान निम्नलिखित आवश्यक जानकारी एकत्र करता है:'}
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm">
            <li><strong>{isEN ? 'Personal Identification:' : 'व्यक्तिगत पहचान:'}</strong> {isEN ? 'Full name, date of birth, gender, and nationality.' : 'पूरा नाम, जन्म तिथि, लिंग और राष्ट्रीयता।'}</li>
            <li><strong>{isEN ? 'Contact Credentials:' : 'संपर्क विवरण:'}</strong> {isEN ? 'Email address, verified telephone/mobile number, and permanent physical address.' : 'ईमेल पता, सत्यापित टेलीफोन/मोबाइल नंबर और स्थायी भौतिक डाक पता।'}</li>
            <li><strong>{isEN ? 'Sovereign ID Details (Mandatory under Indian Government laws):' : 'शासकीय पहचान पत्र (भारतीय कानून के तहत अनिवार्य):'}</strong> {isEN ? 'Aadhaar Card, PAN Card, or Indian/Overseas Passport copies with visa details.' : 'आधार कार्ड, पैन कार्ड, या भारतीय/विदेशी पासपोर्ट प्रतियां वीजा विवरण के साथ।'}</li>
            <li><strong>{isEN ? 'Cryptographic & Payment Information:' : 'भुगतान जानकारी:'}</strong> {isEN ? 'Credit/debit card numbers processed encrypted (in strict compliance with Razorpay & PCI-DSS tokenization; we do not store full CVV/card values locally).' : 'सुरक्षित रूप से एन्क्रिप्टेड क्रेडिट/डेबिट कार्ड टोलगेट (रेज़रपे और पीसीआई-डीएसएस टोकनाइज़ेशन के तहत; हम पूर्ण सीवीवी या कार्ड नंबर स्टोर नहीं करते हैं)।'}</li>
            <li><strong>{isEN ? 'Booking Preferences:' : 'बुकिंग प्राथमिकताएं:'}</strong> {isEN ? 'Room configuration, dietary allergies, royal event requisites, and luxury spa records.' : 'सूट के प्रकार की पसंद, भोजन एलर्जी, राजकीय उत्सव की मांगें और स्पा प्राथमिकताएं।'}</li>
            <li><strong>{isEN ? 'Premises Surveillance:' : 'परिसर निगरानी सुरक्षा:'}</strong> {isEN ? 'High-definition closed-circuit television (CCTV) records in public zones, access doors, and lakeside lounges for extreme safety.' : 'सभी सार्वजनिक स्थानों, मुख्य द्वारों और सरोवर के किनारे सुरक्षा कारणों से हाई-डेफिनिशन क्लोज-सर्किट टेलीविजन (CCTV) फुटेज।'}</li>
            <li><strong>{isEN ? 'Digital Device Footprints:' : 'डिजिटल फुटप्रिंट:'}</strong> {isEN ? 'IP address, location coordinates (with portal permission), and browser telemetry stored temporarily in cookies.' : 'आईपी ​​पता, स्थान निर्देशांक (सहमति पर), और ब्राउज़र टेलीमेट्री।'}</li>
          </ul>
        </div>
      )
    },
    {
      id: 'sec-2',
      titleEN: '2. How We Use Your Information',
      titleHI: '2. हम आपकी जानकारी का उपयोग कैसे करते हैं',
      content: (
        <div className="space-y-3">
          <p>
            {isEN 
              ? 'Your personal data is handled under strict security logs supporting the following administrative workflows:' 
              : 'आपके व्यक्तिगत डेटा को निम्नलिखित प्रशासनिक संचलनों के तहत अत्यधिक सुरक्षित वातावरण में उपयोग किया जाता है:'}
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm">
            <li><strong>{isEN ? 'Reservation Fulfilment:' : 'बुकिंग और सेवाएं:'}</strong> {isEN ? 'Allocating luxury suites, registering culinary requirements, and organizing event setups.' : 'शाही सुइट आवंटित करना, आपकी रुचि के अनुसार भोजन तैयार करना और व्यक्तिगत कार्यक्रम आयोजित करना।'}</li>
            <li><strong>{isEN ? 'Mandated Guest Verification:' : 'सत्यापन और कानूनी प्रक्रिया:'}</strong> {isEN ? 'Verifying guest identities to comply with local Rajasthan and Central Govt reporting requirements.' : 'स्थानीय राजस्थान सरकार और भारत सरकार के सुरक्षा दिशानिर्देशों के अनुसार आपकी पहचान सत्यापित करना।'}</li>
            <li><strong>{isEN ? 'Payment Settlement:' : 'भुगतान प्रसंस्करण:'}</strong> {isEN ? 'Charging suite balances, dining cards, and spa schedules securely through certified gateways.' : 'सत्यापित वित्तीय भुगतान प्रोसेसर के माध्यम से सुरक्षित शुल्क बिलिंग निपटाना।'}</li>
            <li><strong>{isEN ? 'Palatial Communications:' : 'राजकीय संचार:'}</strong> {isEN ? 'Sending booking confirmation codes, concierge schedule changes, or optional membership programs.' : 'बुकिंग पुष्टि कोड, कंसियर शेड्यूल में बदलाव, या वैकल्पिक सदस्यता विशेषाधिकार साझा करना।'}</li>
            <li><strong>{isEN ? 'Safety and Asset Protection:' : 'सुरक्षा और संपत्ति संरक्षण:'}</strong> {isEN ? 'Monitoring CCTV streams to prevent hazardous events and executing security protocols.' : 'किसी भी अवांछित गतिविधि को टालने और सुरक्षा प्रोटोकॉल लागू करने के लिए सीसीटीवी की निगरानी करना।'}</li>
          </ul>
        </div>
      )
    },
    {
      id: 'sec-3',
      titleEN: '3. Data Sharing (Indian Context)',
      titleHI: '3. डेटा साझाकरण (भारतीय कानूनी ढांचा)',
      content: (
        <div className="space-y-2">
          <p>
            {isEN 
              ? 'We treat your privacy with extreme trust. ANJUMAN Palace Hotel DOES NOT sell, lease, or monetize your guest files. Your records are only shared under the following legislative coordinates:' 
              : 'हम अत्यंत सम्मानपूर्वक आपकी गोपनीयता की रक्षा करते हैं। अंजुमन पैलेस होटल किसी भी परिस्थिति में आपके डेटा को बेचता, लीज पर या व्यावसायिक उपयोग हेतु साझा नहीं करता है। आपका डेटा केवल निम्नलिखित वैधानिक कारणों से साझा किया जाता है:'}
          </p>
          <ul className="list-decimal pl-5 space-y-1.5 font-sans">
            <li>
              <strong>{isEN ? 'Police & Security Enforcement' : 'स्थानीय पुलिस एवं सुरक्षा विभाग'}</strong><br />
              {isEN 
                ? 'Mandatory guest registration files are logged with local Udaipur police authorities in compliance with Indian Hospitality security laws.' 
                : 'स्थानीय उदयपुर पुलिस के सुरक्षा नियमों और भारतीय होटल अधिनियम के अनुसार सभी अतिथियों का विवरण दर्ज कराना अनिवार्य है।'}
            </li>
            <li>
              <strong>{isEN ? 'Form C Immigration Filings' : 'विदेशी मेहमानों हेतु "फार्म सी" प्रविष्टि'}</strong><br />
              {isEN 
                ? "Immigration authorities require mandatory Form C filings within 24 hours of arrival for all non-Indian passport holders." 
                : "सभी गैर-भारतीय पासपोर्ट धारकों के आगमन के २४ घंटों के भीतर गृह मंत्रालय (भारत सरकार) को उनके प्रवास की ऑनलाइन 'फॉर्म सी' सूचना देना कानूनी रूप से अनिवार्य है।"}
            </li>
            <li>
              <strong>{isEN ? 'Financial Transaction Partners' : 'वित्तीय लेन-देन प्रोसेसर'}</strong><br />
              {isEN 
                ? 'Credit processing requests are dispatched to Razorpay / UPI platforms using encrypted SSL channels.' 
                : 'भुगतान निपटाने हेतु आपके टोकन डेटा को सुरक्षित रेज़रपे और भारतीय राष्ट्रीय भुगतान निगम (NPCI) द्वारा समर्थित बैंकों को भेजा जाता है।'}
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'sec-4',
      titleEN: '4. Guest Registration (Indian Hotel Law)',
      titleHI: '4. अतिथि पंजीकरण नियम (भारतीय होटल अधिनियम)',
      content: (
        <div className="space-y-2">
          <p>
            {isEN 
              ? 'Your stay at our 5-star resort is governed by the Indian Hotels and Restaurants Act, the Foreigners Act, 1946, and allied local state hospitality directives:' 
              : 'हमारे पांच सितारा संस्थान में आपका प्रवास भारतीय होटल अधिनियम, विदेशी नागरिक अधिनियम १९४६, और राजस्थान पर्यटन होटल सुरक्षा कानूनों के अधीन संचालित होता है:'}
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              {isEN 
                ? 'Every domestic guest is required to produce an approved Government Photo ID (Aadhaar or Passport) before physical keys are handed over.' 
                : 'घरलू अतिथियों को कमरों की चाबियां सौंपने से पूर्व अधिकृत सरकारी फोटो पहचान पत्र (आधार, ड्राइविंग लाइसेंस या पासपोर्ट) दिखाना अनिवार्य है।'}
            </li>
            <li>
              {isEN 
                ? 'Foreign passport holders must present a valid passport and physical/e-Visa to initiate registration protocols. In compliance with Central Govt directives, our travel desk will lodge Form C details coordinates.' 
                : 'विदेशी पासपोर्ट धारकों के लिए आगमन पर अपना वैध पासपोर्ट और वीजा मूल रूप में दिखाना अनिवार्य है ताकि हमारी डेस्क तत्काल फॉर्म सी भरने की औपचारिकता पूरी कर सके।'}
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'sec-5',
      titleEN: '5. Data Security Standards',
      titleHI: '5. डेटा सुरक्षा मानक एवं एन्क्रिप्शन',
      content: (
        <div className="space-y-2">
          <p>
            {isEN 
              ? 'ANJUMAN operates defense-grade information vaults to shield your sensitive guest files:' 
              : 'अंजुमन पैलेस आपके संवेदनशील डेटा की सुरक्षा करने के लिए सर्वोच्च तकनीकी सुरक्षा कवचों का प्रयोग करता है:'}
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>{isEN ? 'SSL/TLS 256-bit encryption on all booking networks.' : 'सभी ऑनलाइन आरक्षण और भुगतान प्रणालियों पर शक्तिशाली SSL/TLS २५६-बिट एन्क्रिप्शन का उपयोग।'}</li>
            <li>{isEN ? 'Strict PCI-DSS alignment for payment card processing.' : 'क्रेडिट और डेबिट पैकेजों के लिए पीसीआई-डीएसएस नियमों का अनुपालन।'}</li>
            <li>{isEN ? 'Data files are stored on secure local server clusters in India.' : 'सभी डेटा फाइलें भारत में स्थित अत्यधिक सुरक्षित डेटा सेंटर्स में ही स्टोर की जाती हैं।'}</li>
            <li>{isEN ? 'Access privileges are isolated exclusively to verified resort managers and booking personnel.' : 'महत्वपूर्ण दस्तावेजों तक केवल अधिकृत और प्रशिक्षित रिसॉर्ट प्रबंधकों की ही पहुँच सुनिश्चित की जाती है।'}</li>
          </ul>
        </div>
      )
    },
    {
      id: 'sec-6',
      titleEN: '6. Your Sovereign Rights (DPDP Act 2023)',
      titleHI: '6. आपके वैधानिक अधिकार (DPDP अधिनियम २०२३)',
      content: (
        <div className="space-y-2">
          <p>
            {isEN 
              ? 'Under the Digital Personal Data Protection (DPDP) Act 2023 of India, you hold fundamental rights regarding your recorded profiles:' 
              : 'भारत के डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम २०२३ के तहत, आपको अपने संचित डेटा के संदर्भ में निम्नलिखित मौलिक अधिकार प्राप्त हैं:'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
              <span className="font-bold text-gray-900 text-xs block mb-1">🔍 {isEN ? 'Right to Access & Consent' : 'सहमति और जानकारी का अधिकार'}</span>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                {isEN ? 'You can ask for a complete list of your personal records kept in our booking index at any time.' : 'आप किसी भी समय हमारे पास मौजूद अपने डेटा के विवरण और संचयन के कारणों की प्रतिलिपि मांग सकते हैं।'}
              </p>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
              <span className="font-bold text-gray-900 text-xs block mb-1">✍️ {isEN ? 'Right to Correction' : 'सुधार और सुशोधन का अधिकार'}</span>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                {isEN ? 'Request correction of inaccurate or incomplete contact numbers, emails, addresses, or profile priorities.' : 'आप अपने गलत पते, फोन नंबर, नाम आदि को तुरंत संशोधित अथवा अद्यतन करने का अनुरोध कर सकते हैं।'}
              </p>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
              <span className="font-bold text-gray-900 text-xs block mb-1">🗑️ {isEN ? 'Right to Erasure (With Limits)' : 'डेटा मिटाने का अधिकार (कुछ सीमाओं सहित)'}</span>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                {isEN ? 'Request removal of stored records, subject to Indian financial and police registration laws which require retaining booking invoice logs for 7 tax years.' : 'आप अपने व्यक्तिगत डेटा को पूरी तरह मिटाने का अनुरोध कर सकते हैं, हालांकि कानूनी, टैक्स और होटल रिकॉर्ड अनुपालन नियमों के अधीन फाइलों का सुरक्षित रखना अनिवार्य है।'}
              </p>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
              <span className="font-bold text-gray-900 text-xs block mb-1">📯 {isEN ? 'Right to Opt-Out' : 'मार्केटिंग से सुरक्षा का अधिकार'}</span>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                {isEN ? 'Withdraw consent to receive curated suite promotion newsletters or privilege loyalty programs easily.' : 'आप किसी भी समय हमारे प्रचार विज्ञापनों और इलेक्ट्रॉनिक न्यूज़लेटर्स को बंद करने का विकल्प चुन सकते हैं।'}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 pt-2 font-mono">
            {isEN ? 'To execute any right, please write to: privacy@anjumanhotel.com' : 'अपने अधिकारों के उपयोग हेतु कृपया हमारे ईमेल पर ईमेल भेजें: privacy@anjumanhotel.com'}
          </p>
        </div>
      )
    },
    {
      id: 'sec-7',
      titleEN: '7. Cookies and Preference Storage',
      titleHI: '7. कुकीज़ नीति और प्राथमिक स्वास्थ्य प्रणाली',
      content: (
        <div className="space-y-2">
          <p>
            {isEN 
              ? 'Our palace portal uses mini cookie logs on your browser to maximize layout convenience and maintain session parameters across reloads.' 
              : 'हमारा पोर्टल आपके ब्राउज़र सत्र को निरंतरता तथा बुकिंग इतिहास संचित रखने के लिए कुकीज़ संचयन का उपयोग करता है:'}
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm">
            <li><strong>{isEN ? 'Essential Cookies:' : 'अनिवार्य कुकीज़:'}</strong> {isEN ? 'Vital for checking active bookings and keeping you securely logged in.' : 'सक्रिय लॉगिन और कमरों के चयन इतिहास को याद रखने के लिए आवश्यक सुरक्षा प्रणालियाँ।'}</li>
            <li><strong>{isEN ? 'Performance Logs:' : 'प्रदर्शन लॉग विवरण:'}</strong> {isEN ? 'Identifies page speeds and diagnoses broken layout coordinates.' : 'पोर्टल के लोड समय और विज़ुअल्स को बेहतर बनाने के लिए गति की गणना।'}</li>
            <li><strong>{isEN ? 'Google Analytics Hook:' : 'गूगल एनालिटिक्स:'}</strong> {isEN ? 'We trace macro visitor waves without collecting individual identity folders.' : 'यह हमें आगंतुकों की सामूहिक जनसांख्यिकी को समझने में मदद करता है।'}</li>
          </ul>
        </div>
      )
    },
    {
      id: 'sec-8',
      titleEN: '8. Protection of Children\'s Information',
      titleHI: '8. बच्चों की डेटा सुरक्षा एवं नीति',
      content: (
        <p>
          {isEN 
            ? 'We enforce rigorous precautions under the DPDP Act. We do not register or process metadata coordinates belonging to minors (under the age of 18) unless they are accompanied by a parent, legal guardian, or royal delegate who confirms suite reservations. We do not solicit personal details of minors under any condition.' 
            : 'हम भारत सरकार के बच्चों की डेटा सुरक्षा कानून के तहत किसी भी नाबालिग (१८ वर्ष से कम) के डेटा का सीधे संकलन नहीं करते हैं। कमरा बुकिंग का विवरण केवल उनके अभिभावक की लिखित सहमति पर ही परिवार प्रवास के तहत रिकॉर्ड किया जाता है।'}
        </p>
      )
    },
    {
      id: 'sec-9',
      titleEN: '9. Data Retention Period',
      titleHI: '9. डेटा संचयन और मिटाने की समयावधि',
      content: (
        <div className="space-y-2 text-xs md:text-sm">
          <p>
            {isEN 
              ? 'Data remains indexed strictly for historical, legal, and luxury loyalty compliance requirements:' 
              : 'हम आपके महत्वपूर्ण डेटा को भारतीय कानूनों के अनुसार निम्नलिखित अवधियों तक ही सुरक्षित संचित रखते हैं:'}
          </p>
          <table className="w-full text-left border-collapse border border-gray-200 rounded-lg overflow-hidden mt-2 font-mono text-[11px]">
            <thead>
              <tr className="bg-gray-100 text-gray-800">
                <th className="p-2 border border-gray-200">Category</th>
                <th className="p-2 border border-gray-200">Retention Horizon</th>
                <th className="p-2 border border-gray-200">Primary Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border border-gray-200 font-bold">Booking Logs & Invoices</td>
                <td className="p-2 border border-gray-200">7 Years</td>
                <td className="p-2 border border-gray-200">Indian Income Tax & GST audit compliance</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-2 border border-gray-200 font-bold">Government ID Copies</td>
                <td className="p-2 border border-gray-200">3 Years (or as mandated)</td>
                <td className="p-2 border border-gray-200">Police registration and tourist security</td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-200 font-bold">CCTV Premises Footage</td>
                <td className="p-2 border border-gray-200">30 Days rolling cycle</td>
                <td className="p-2 border border-gray-200">Security event forensics & threat assessment</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-2 border border-gray-200 font-bold">Guest Preference Records</td>
                <td className="p-2 border border-gray-200">Indefinite (or until requested)</td>
                <td className="p-2 border border-gray-200">Curating luxury repeat visits and loyalty points</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    },
    {
      id: 'sec-10',
      titleEN: '10. Contacting Our Data Protection Officer (DPO)',
      titleHI: '10. डेटा संरक्षण शिकायत निवारण अधिकारी (DPO)',
      content: (
        <div className="space-y-2">
          <p>
            {isEN 
              ? 'In compliance with Grievance Redressal mandates, ANJUMAN Palace Hotel has designated a certified Data Protection and Grievance Officer:' 
              : 'किसी भी शिकायत अथवा गोपनीयता विषयक स्पष्टीकरण के लिए आप हमारे नियुक्त शिकायत निवारण और डेटा संरक्षण अधिकारी से संपर्क कर सकते हैं:'}
          </p>
          <div className="p-4 bg-amber-50/60 border border-amber-200/50 rounded-xl space-y-1 text-xs md:text-sm font-sans text-gray-850">
            <p><strong>{isEN ? 'Officer Name:' : 'डेटा अधिकारी का नाम:'}</strong> {isEN ? 'Mr. Devendra Singh Mewar' : 'श्री देवेन्द्र सिंह मेवाड़'}</p>
            <p><strong>{isEN ? 'Designation:' : 'पद:'}</strong> {isEN ? 'Senior Legal Counsel & Chief DPO' : 'मुख्य कानूनी सलाहकार और डेटा सुरक्षा प्रमुख'}</p>
            <p><strong>{isEN ? 'Registered Address:' : 'कार्यालय का पता:'}</strong> {isEN ? 'The Secretariat, ANJUMAN Palace West Promenade, Udaipur - 313001, Rajasthan, India' : 'सचिवालय, अंजुमन पैलेस वेस्ट प्रोमेनेड, उदयपुर - ३१३००१, राजस्थान।'}</p>
            <p><strong>{isEN ? 'Direct Complaint Portal:' : 'सीधा ईमेल:'}</strong> <span className="font-mono text-amber-800 underline">grievance@anjumanhotel.com</span></p>
          </div>
          <p className="text-[11px] text-gray-500 italic mt-1.5">
            {isEN 
              ? '✔ Our legal cell will acknowledge your request within 48 hours and deliver a binding grievance resolution report within 30 statutory days.' 
              : '✔ शिकायत प्राप्त होने पर ४८ घंटों के भीतर पावती दी जाएगी और अधिकृत रिपोर्ट अधिकतम ३० दिनों के भीतर आपके ईमेल पते पर प्रेषित कर दी जाएगी।'}
          </p>
        </div>
      )
    }
  ];

  // Terms and Conditions Sections List with bilingual keys
  const termsSections = [
    {
      id: 'term-1',
      titleEN: '1. Booking & Reservation Charter',
      titleHI: '1. बुकिंग अधिकार पत्र एवं आरक्षण नियम',
      content: (
        <div className="space-y-2">
          <p>
            {isEN 
              ? 'Booking reservations at ANJUMAN are curated exclusively on guaranteed terms:' 
              : 'अंजुमन पैलेस होटल में ठहरने के कमरों का आरक्षण केवल गारंटीकृत शर्तों पर ही स्वीकार्य है:'}
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>{isEN ? 'Guaranteed Deposits:' : 'अग्रिम सुरक्षा जमा:'}</strong>{' '}
              {isEN 
                ? 'Standard reservations require a valid credit card token or an advance pay deposit matching at least one night room tarif tax inclusive.' 
                : 'सभी सामान्य आरक्षणों के लिए कम से कम एक रात्रि के किराए के मूल्य के बराबर अग्रिम धनराशि ऑनलाइन भुगतान अथवा क्रेडिट कार्ड गारन्टी के रूप में जमा करना आवश्यक है।'}
            </li>
            <li>
              <strong>{isEN ? 'Room Occupancy Regulations:' : 'अतिथि सीमा आवश्यकता:'}</strong>{' '}
              {isEN 
                ? 'Standard rooms permit a maximum of 2 adults and 1 minor. Palace Presidential Suites accommodate up to 4 adults. Additional bedding options can be requested at ₹2,500 + tax per night.' 
                : 'प्रत्येक साधारण कक्ष में अधिकतम २ वयस्क प्रवेश कर सकते हैं। बड़े विला एवं सुइट्स में अधिकतम ४ वयस्क मेहमानों को रहने की अनुमति है। अतिरिक्त बिस्तर शुल्क २५०० रुपए प्रति रात्रि है।'}
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'term-2',
      titleEN: '2. Cancellation and Refund Policy',
      titleHI: '2. आरक्षण निरस्तीकरण एवं धन-वापसी नियम',
      content: (
        <div className="space-y-3">
          <p>
            {isEN 
              ? 'Cancellations vary depending on the package. Refund flows are fully transparent:' 
              : 'बुकिंग निरस्त करने पर धन-वापसी (रिफंड) की प्रक्रिया निम्नलिखित नियमों के अनुसार पारदर्शी ढंग से संचालित होती है:'}
          </p>
          <div className="border border-gray-250 rounded-xl overflow-hidden text-xs">
            <div className="grid grid-cols-2 bg-gray-50 p-2.5 font-bold border-b border-gray-200">
              <div>{isEN ? 'Cancellation Timeline' : 'अपराध सूचना समय-सीमा'}</div>
              <div>{isEN ? 'Applicable Refund Rate' : 'धन वापसी की पात्रता'}</div>
            </div>
            <div className="grid grid-cols-2 p-2.5 border-b border-gray-150">
              <div>{isEN ? 'More than 48 Hours prior to check-in' : 'आगमन के समय से ४८ घंटे से अधिक पूर्व'}</div>
              <div className="text-emerald-700 font-bold">{isEN ? '100% Refund (Fully Complimentary)' : '१००% रिफंड (पूर्ण वापसी)'}</div>
            </div>
            <div className="grid grid-cols-2 p-2.5 border-b border-gray-150 bg-gray-50/50">
              <div>{isEN ? 'Between 24 to 48 Hours prior to check-in' : 'आगमन से २४ से ४८ घंटों के बीच'}</div>
              <div className="text-amber-700 font-bold">{isEN ? '50% Refund of the first night tarif' : 'प्रथम रात्रि के किराए का ५०% शुल्क काटा जाएगा'}</div>
            </div>
            <div className="grid grid-cols-2 p-2.5 text-red-700 font-medium font-sans">
              <div>{isEN ? 'Less than 24 Hours or No-Show' : '२४ घंटे से कम का समय अथवा न पहुंचना'}</div>
              <div className="font-bold">{isEN ? 'No Refund (100% Retained)' : 'कोई रिफंड नहीं (शून्य वापसी)'}</div>
            </div>
          </div>
          <p className="text-xs text-gray-500 italic">
            * {isEN 
              ? 'Note: Promotional rates, festive dates (including Diwali & New Year weeks) are strictly non-refundable and non-transferable.' 
              : 'विशेष त्योहारी सप्ताहों (जैसे दिवाली, राष्ट्रीय अवकाश एवं नववर्ष उत्सव) के विशेष आरक्षणों पर आरक्षण निरस्तीकरण बिल्कुल भी स्वीकार्य नहीं है तथा कोई धन वापस नहीं होगा।'}
          </p>
        </div>
      )
    },
    {
      id: 'term-3',
      titleEN: '3. Check-In & Check-Out Safeguards',
      titleHI: '3. प्रवेश (चेक-इन) एवं प्रस्थान (चेक-आउट) समयावधि नियम',
      content: (
        <div className="space-y-2">
          <p>
            {isEN 
              ? 'Our palace hours guarantee suite cleanliness and supreme logistical coordination for all incoming royal delegations:' 
              : 'शाही सुइट्स को स्वच्छ और अत्यंत व्यवस्थित बनाने के लिए आगमन-प्रस्थान के नियमों का कड़ाई से पालन आवश्यक है:'}
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>{isEN ? 'Standard Check-In Hour:' : 'आगमन का समय:'}</strong> 2:00 PM IST</li>
            <li><strong>{isEN ? 'Standard Check-Out Hour:' : 'प्रस्थान का समय:'}</strong> 12:00 PM (Noon) IST</li>
            <li>
              <strong>{isEN ? 'Early Entry / Late Departure:' : 'अतिरिक्त समय विस्तार:'}</strong>{' '}
              {isEN 
                ? 'Complimentary early check-in or late checkout up to 3:00 PM is offered strictly subject to room availability, with overriding priority given to high-tier Loyalty Club members.' 
                : 'कमरों की उपलब्धता के आधार पर दोपहर ३:०० बजे तक निःशुल्क देर से प्रस्थान की स्वीकृति दी जा सकती है, इसका प्रमुख अधिकार लॉयल्टी क्लब के सदस्यों के पास सुरक्षित है।'}
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'term-4',
      titleEN: '4. Guest Conduct & Liability Limitations',
      titleHI: '4. आचार संहिता एवं देयता सीमाएं',
      content: (
        <div className="space-y-2">
          <p>
            {isEN 
              ? 'To preserve our heritage structural integrity and guarantee supreme peace at Lake Pichola, guests must adhere to these conducts:' 
              : 'ऐतिहासिक महल की स्थापत्य कला और अन्य अतिथियों की सुख-शांति बनाए रखने के लिए आचार संहिता का उल्लंघन वर्जित है:'}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm">
            <li><strong>{isEN ? 'Noise Control:' : 'ध्वनि नियंत्रण:'}</strong> {isEN ? 'No loud audio speakers or high decibel functions are permitted in suite corridors or lakeside lookouts past 10:00 PM.' : 'रात्रि १०:०० बजे के बाद सुइट गलियारों या सरोवरों के करीब तेज आवाज वाले लाउडस्पीकरों का उपयोग वर्जित है।'}</li>
            <li><strong>{isEN ? 'Heritage Conservation Liability:' : 'धरोहर संपत्ति संरक्षण:'}</strong> {isEN ? 'Any damage caused to the ancient frescos, marble pillars, lakeside carvings, or luxury handlooms will be evaluated and charged directly during checkout.' : 'महल की ऐतिहासिक भित्तिचित्रों, नक्काशीदार संगमरमर के खंभों, प्राचीन विलासिता शिल्पों या हथकरघों को क्षति पहुंचाने पर उनकी मरम्मत का पूरा खर्च अतिथि को वहन करना होगा।'}</li>
            <li><strong>{isEN ? 'No-Smoking Rule:' : 'धूम्रपान निषेध:'}</strong> {isEN ? 'All rooms and closed halls are completely non-smoking zones. A deep-cleaning penalty of ₹10,000 INR will be enforced for infractions.' : 'सभी सुइट्स वातानुकूलित और धूम्रपान निषेध क्षेत्र हैं। उल्लंघन करने पर गहन सफाई हेतु १०,००० रुपए का दण्ड आरोपित किया जाएगा।'}</li>
          </ul>
        </div>
      )
    },
    {
      id: 'term-5',
      titleEN: '5. Force Majeure & Acts of God',
      titleHI: '5. अप्रत्याशित घटनाएँ (फ़ोर्स मैजूर)',
      content: (
        <p>
          {isEN 
            ? 'ANJUMAN Palace Hotel is not liable for delayed services, missing amenities, or cancellation of booking blocks resulting directly from events of Force Majeure — which includes sudden natural weather emergencies, floods of Lake Pichola, sudden airspace bans, governmental VVIP security lockdowns, civil riots, epidemics, or electrical grid cascades.' 
            : 'पिछोला झील में अप्रत्याशित बाढ़, राजकीय संकटकाल, केंद्र या राजस्थान सरकार द्वारा अचानक वीवीआईपी सुरक्षा लॉकडाउन, अचानक विमान क्षेत्र प्रतिबंध, या ऐसी ही किसी अन्य प्राकृतिक आपदा के कारण उत्पन्न व्यवधानों में होटल अपनी सेवाओं के विलंब के लिए उत्तरदायी नहीं ठहराया जाएगा।'}
        </p>
      )
    },
    {
      id: 'term-6',
      titleEN: '6. Governing Law & Sovereign Jurisdictions',
      titleHI: '6. लागू कानून एवं न्यायिक क्षेत्राधिकार',
      content: (
        <p>
          {isEN 
            ? 'These terms, policies, and booking agreements are strictly governed by the state laws of Rajasthan and federal Tourism Laws of India. Any legal dispute, grievance suit, or damage claim must be registered and resolved exclusively before the courts in Udaipur, Rajasthan.' 
            : 'ये नियम, शर्तें और सहमति संबंध पूरी तरह से राजस्थान पर्यटन कानूनों और भारत सरकार के नागरिक अधिनियम के तहत विनियमित हैं। किसी भी विसंगति या न्यायिक प्रक्रिया के मामले में संबंधित कानूनी कार्यवाही केवल उदयपुर (राजस्थान) कोर्ट के अधिकार क्षेत्र में ही प्रस्तुत की जा सकेगी।'}
        </p>
      )
    }
  ];

  const currentSections = activeTab === 'policy' ? policySections : termsSections;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-10 text-brand-white" id="privacy-policy-top">
      
      {/* 1. Header Banner Styling */}
      <div className="text-center space-y-3 mb-4 text-brand-white">
        <span className="text-brand-gold font-mono tracking-[0.25em] text-[10px] uppercase font-extrabold px-3 py-1 bg-brand-gold/10 border border-brand-gold/25 rounded-full inline-block">
          {isEN ? 'LEGAL & REGULATORY PORTAL' : 'शाही संनियम एवं कानूनी नीति पोर्टल'}
        </span>
        <h1 className="font-serif text-3xl md:text-5xl text-brand-cream tracking-wide uppercase">
          {activeTab === 'policy' 
            ? (isEN ? 'Confidentiality Trust Policy' : 'गोपनीयता और डेटा सुरक्षा नियम')
            : (isEN ? 'Sovereign Terms of Stay' : 'निवास के शाही नियम एवं शर्तें')
          }
        </h1>
        <p className="text-xs text-brand-cream/60 max-w-xl mx-auto font-sans leading-relaxed">
          {isEN 
            ? 'Fully aligned with the Digital Personal Data Protection (DPDP) Act of India 2023, local Foreigner C-Form mandates, and RBI transaction regulations.'
            : 'भारत सरकार के डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) कानून २०२३, विदेशी नागरिकों हेतु फॉर्म सी रिपोर्टिंग तथा भारतीय रिज़र्व बैंक सुरक्षा नीतियों के अनुकूल।'}
        </p>

        {/* Tab Selector & Language Toggles Strip */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 max-w-4xl mx-auto border-b border-brand-gold/10 pb-6">
          
          {/* Main Tabs */}
          <div className="flex gap-2 bg-[#090b14] p-1.5 rounded-xl border border-brand-gold/15">
            <button
              onClick={() => { setActiveTab('policy'); scrollIntoView('privacy-policy-top'); }}
              className={`px-4 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'policy' 
                  ? 'bg-brand-gold text-brand-black font-black' 
                  : 'text-brand-cream/70 hover:text-white'
              }`}
            >
              🔒 {isEN ? 'Privacy Policy' : 'गोपनीयता नीति'}
            </button>
            <button
              onClick={() => { setActiveTab('terms'); scrollIntoView('privacy-policy-top'); }}
              className={`px-4 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'terms' 
                  ? 'bg-brand-gold text-brand-black font-black' 
                  : 'text-brand-cream/70 hover:text-white'
              }`}
            >
              ⚖️ {isEN ? 'Terms & Conditions' : 'नियम और शर्तें'}
            </button>
          </div>

          {/* Quick Helper Tools */}
          <div className="flex items-center gap-3">
            
            {/* Inline Bilingual Translation Trigger */}
            <button 
              onClick={() => setLocalLanguage(prev => prev === 'EN' ? 'HI' : 'EN')}
              className="px-3.5 py-2 bg-[#0d0f19] hover:bg-brand-gold/15 border border-brand-gold/20 hover:border-brand-gold/50 rounded-xl text-[10px] font-extrabold uppercase tracking-wider text-brand-gold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Switch Legal Language"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{isEN ? 'हिन्दी में पढ़ें' : 'Read in English'}</span>
            </button>

            {/* Print Friendly Button */}
            <button 
              onClick={handlePrint}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors shadow-lg"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isEN ? 'Print / Download' : 'प्रिंट एवं डाउनलोड'}</span>
            </button>

          </div>

        </div>
      </div>

      {/* =================================================================
          2. TWO-COLUMN LAYOUT: Sidebar Index Finder + Beautiful Content Paper
          ================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        
        {/* Left Hand Column: Table of Contents Anchor List */}
        <div className="lg:col-span-3 lg:sticky lg:top-24 space-y-4">
          <div className="bg-[#0b0c15] border border-brand-gold/15 rounded-xl p-4 space-y-3">
            <h4 className="font-serif text-[11px] text-brand-gold uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-brand-gold/10">
              <Layers className="w-3.5 h-3.5" />
              {isEN ? 'Document Index' : 'दस्तावेज़ सूचकांक'}
            </h4>
            <div className="flex flex-col gap-1.5 max-h-[350px] overflow-y-auto scrollbar-thin">
              {currentSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`text-left text-xs px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-medium leading-relaxed truncate ${
                    activeSection === sec.id
                      ? 'bg-brand-gold/10 text-brand-gold border-l-2 border-brand-gold font-bold pl-3'
                      : 'text-brand-cream/60 hover:text-brand-cream hover:bg-brand-cream/5'
                  }`}
                >
                  {isEN ? sec.titleEN : sec.titleHI}
                </button>
              ))}
            </div>
            
            {/* Quick Print Disclaimer */}
            <div className="text-[9px] text-brand-cream/40 font-mono leading-relaxed pt-2 border-t border-brand-gold/10 space-y-1">
              <p>✔ {isEN ? 'Certified Official Copy' : 'अधिकृत शासकीय प्रतिलिपि'}</p>
              <p>✔ {isEN ? 'Server location: India' : 'डेटा सर्वर: भारत भूमि'}</p>
              <p>✔ {isEN ? 'SSL Cryptography Active' : 'एसएसएल एन्क्रिप्शन सक्रिय'}</p>
            </div>
          </div>
        </div>

        {/* Right Hand Column: Physical Pristine Premium Light Background Legal Paper */}
        <div 
          className="lg:col-span-9 bg-white text-gray-900 shadow-2xl rounded-2xl p-6 md:p-10 border border-gray-200" 
          id="printable-legal-document"
        >
          
          {/* Paper Logo Branding and Timestamps metadata */}
          <div className="border-b border-gray-300 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <svg className="h-5 w-5 text-gray-950 fill-current" viewBox="0 0 24 24">
                  <path d="M2 4l3 6 7-7 7 7 3-6-2 16H4L2 4z" />
                </svg>
                <span className="font-serif text-sm tracking-[0.2em] text-gray-950 font-extrabold">ANJUMAN</span>
              </div>
              <p className="text-[9px] font-mono uppercase text-gray-500 tracking-wider">
                {isEN ? 'Lakeside Palace Heritage Hotel & Resorts' : 'अंजुमन पैलेस हेरिटेज रिसॉर्ट, उदयपुर'}
              </p>
            </div>

            <div className="text-right space-y-0.5 font-mono text-[10px] text-gray-600 sm:border-l sm:border-gray-200 sm:pl-4">
              <p className="flex justify-between gap-6">
                <span>{isEN ? 'Last Updated:' : 'अंतिम संशोधन:'}</span> 
                <span className="font-bold text-gray-950">25 May 2026</span>
              </p>
              <p className="flex justify-between gap-6">
                <span>{isEN ? 'Effective Date:' : 'लागू तिथि:'}</span> 
                <span className="font-bold text-gray-950">25 May 2026</span>
              </p>
              <p className="flex justify-between gap-6">
                <span>{isEN ? 'Status:' : 'स्थिति:'}</span> 
                <span className="text-emerald-700 font-bold">APPROVED / ACTIVE</span>
              </p>
            </div>
          </div>

          {/* Core Content Body Rendering Loop */}
          <div className="space-y-8 text-gray-800 leading-relaxed font-sans text-sm">
            {currentSections.map((sec) => (
              <section 
                key={sec.id} 
                id={sec.id} 
                className="space-y-3 pt-4 border-b border-gray-100 pb-5 last:border-none scroll-mt-24 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-5 bg-gray-900 rounded-full shrink-0" />
                  <h3 className="font-serif text-base font-extrabold text-gray-950 tracking-wide">
                    {isEN ? sec.titleEN : sec.titleHI}
                  </h3>
                </div>
                <div className="pl-4 text-xs sm:text-sm text-gray-700">
                  {sec.content}
                </div>
              </section>
            ))}
          </div>

          {/* Sovereign Official Seal Footer */}
          <div className="mt-12 pt-8 border-t-2 border-double border-gray-350 flex flex-col md:flex-row justify-between items-center gap-6">
            
            <div className="space-y-1.5 text-center md:text-left">
              <p className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">{isEN ? 'AUTHORIZED LEGAL DECREE' : 'अधिकृत विधिक उद्घोषणा'}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-[10px] font-bold text-gray-700">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isEN ? 'DPDP Act (2023) Compliant' : 'डीपीडीपी अधिनियम (२०२३) अनुपालन सत्य'}</span>
              </div>
            </div>

            {/* Sealed Mock Stamp Visual */}
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="w-9 h-9 rounded-full bg-amber-50 border-2 border-amber-600 flex items-center justify-center shrink-0">
                <span className="font-serif text-[10px] text-amber-800 font-extrabold">AP</span>
              </div>
              <div className="font-mono text-[9px] text-gray-650">
                <p className="font-bold text-gray-950 uppercase">{isEN ? 'ANJUMAN COUNCIL SEAL' : 'अंजुमन महापरिषद सील'}</p>
                <p>Udaipur Judicial Circle 2026</p>
              </div>
            </div>

          </div>

          {/* Print specific instructions overlay */}
          <div className="hidden print:block text-center text-[9px] text-gray-400 font-mono mt-10">
            Document generated securely on May 25, 2026. IP verified under SSL certification guidelines.
          </div>

        </div>

      </div>

      {/* Embedded print styling block to configure printer outputs */}
      <style>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          /* Hide app elements */
          #global-floating-whatsapp-btn,
          #global-live-chat-panel,
          #contact-outer-wrapper > *:not(.grid),
          #contact-outer-wrapper .lg\\:col-span-3,
          footer,
          header,
          NAV,
          navbar,
          #global-nav-strip,
          .fixed {
            display: none !important;
            visibility: hidden !important;
          }
          /* Clean up content to print the document card only */
          #printable-legal-document {
            font-size: 11pt !important;
            line-height: 1.5 !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
          }
        }
      `}</style>

    </div>
  );
}

// Utility function to scroll safely
function scrollIntoView(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
