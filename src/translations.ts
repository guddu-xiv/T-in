export type LanguageCode = "en" | "hi" | "hinglish" | "bn" | "mr";

export interface TranslationSet {
  adminPanelTitle: string;
  studioSubtitle: string;
  lockTitle: string;
  lockSubtitle: string;
  enterPassword: string;
  passwordPlaceholder: string;
  unlockButton: string;
  invalidPassword: string;
  checkingPassword: string;
  logout: string;
  languageSelect: string;
  systemStatus: string;
  online: string;
  changePasswordTitle: string;
  currentPasswordLabel: string;
  newPasswordLabel: string;
  confirmPasswordLabel: string;
  updatePasswordBtn: string;
  passwordUpdatedSuccess: string;
  passwordChangeError: string;
  lockPanel: string;
  enterNewPasswordPlaceholder: string;
  updatingPassword: string;
  
  // Navigation Tabs
  tabOverview: string;
  tabBranding: string;
  tabTestSeries: string;
  tabPdfMaterials: string;
  tabStudents: string;
  tabBanners: string;
  tabSettings: string;
  tabBackups: string;
  tabExportApp: string;

  // Overview Stats
  totalStudents: string;
  totalTests: string;
  totalPDFs: string;
  activeCoupons: string;
  quickActions: string;
  saveChanges: string;
  saving: string;
  savedSuccessfully: string;
  inspectSecurityNotice: string;
}

export const LANGUAGES: { code: LanguageCode; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "हिंदी (Hindi)", flag: "🇮🇳" },
  { code: "hinglish", label: "Hinglish", flag: "🇮🇳" },
  { code: "bn", label: "বাংলা (Bengali)", flag: "🇮🇳" },
  { code: "mr", label: "मराठी (Marathi)", flag: "🇮🇳" },
];

export const TRANSLATIONS: Record<LanguageCode, TranslationSet> = {
  en: {
    adminPanelTitle: "Taiyariya : Admin Panel",
    studioSubtitle: "Taiyariya Studio & Ultimate Builder Engine",
    lockTitle: "Secure Admin Authentication",
    lockSubtitle: "Enter the master password to access Taiyariya Admin Panel",
    enterPassword: "Enter Master Password",
    passwordPlaceholder: "Type admin password...",
    unlockButton: "Unlock Admin Panel",
    invalidPassword: "Incorrect Password! Access denied by server.",
    checkingPassword: "Verifying with Backend Server...",
    logout: "Lock Panel",
    languageSelect: "Language",
    systemStatus: "Backend Status",
    online: "Online & Encrypted",
    changePasswordTitle: "Change Admin Master Password",
    currentPasswordLabel: "Current Password",
    newPasswordLabel: "New Admin Password",
    confirmPasswordLabel: "Confirm New Password",
    updatePasswordBtn: "Update Master Password",
    passwordUpdatedSuccess: "Admin password updated successfully on server!",
    passwordChangeError: "Failed to update password. Please check current password.",
    lockPanel: "Lock Panel",
    enterNewPasswordPlaceholder: "Enter new secure admin password...",
    updatingPassword: "Updating Password...",
    
    tabOverview: "Dashboard Overview",
    tabBranding: "Brand & Logo Setup",
    tabTestSeries: "Test Series & Exams",
    tabPdfMaterials: "PDF Notes & Study Material",
    tabStudents: "Student Access Management",
    tabBanners: "Sliders & Notifications",
    tabSettings: "System & Monetization",
    tabBackups: "Database Backups & Logs",
    tabExportApp: "Export Student App",

    totalStudents: "Total Registered Students",
    totalTests: "Total Mock Tests Created",
    totalPDFs: "PDF Resources Uploaded",
    activeCoupons: "Active Discount Vouchers",
    quickActions: "Quick Admin Tools",
    saveChanges: "Save All Changes",
    saving: "Saving to Cloud Server...",
    savedSuccessfully: "Configuration saved successfully!",
    inspectSecurityNotice: "Server-Side Secured: Password is validated on backend API. Cannot be viewed via Inspect Element / DevTools.",
  },

  hi: {
    adminPanelTitle: "तैयारिया : एडमिन पैनल",
    studioSubtitle: "तैयारिया स्टूडियो एवं अल्टीमेट बिल्डर इंजन",
    lockTitle: "सुरक्षित एडमिन प्रमाणीकरण",
    lockSubtitle: "तैयारिया एडमिन पैनल में प्रवेश करने के लिए मास्टर पासवर्ड दर्ज करें",
    enterPassword: "मास्टर पासवर्ड दर्ज करें",
    passwordPlaceholder: "एडमिन पासवर्ड टाइप करें...",
    unlockButton: "एडमिन पैनल खोलें",
    invalidPassword: "गलत पासवर्ड! सर्वर द्वारा पहुंच अस्वीकृत की गई।",
    checkingPassword: "बैकएंड सर्वर से जांच की जा रही है...",
    logout: "पैनल लॉक करें",
    languageSelect: "भाषा चुनें",
    systemStatus: "बैकएंड स्थिति",
    online: "ऑनलाइन एवं सुरक्षित",
    changePasswordTitle: "एडमिन मास्टर पासवर्ड बदलें",
    currentPasswordLabel: "वर्तमान पासवर्ड",
    newPasswordLabel: "नया एडमिन पासवर्ड",
    confirmPasswordLabel: "नए पासवर्ड की पुष्टि करें",
    updatePasswordBtn: "पासवर्ड अपडेट करें",
    passwordUpdatedSuccess: "सर्वर पर एडमिन पासवर्ड सफलतापूर्वक अपडेट हो गया!",
    passwordChangeError: "पासवर्ड अपडेट विफल। कृपया वर्तमान पासवर्ड की जांच करें।",
    lockPanel: "पैनल लॉक करें",
    enterNewPasswordPlaceholder: "नया सुरक्षित एडमिन पासवर्ड दर्ज करें...",
    updatingPassword: "पासवर्ड अपडेट हो रहा है...",
    
    tabOverview: "डैशबोर्ड विवरण",
    tabBranding: "ब्रांड और लोगो सेटअप",
    tabTestSeries: "टेस्ट सीरीज़ और परीक्षाएँ",
    tabPdfMaterials: "पीडीएफ और अध्ययन सामग्री",
    tabStudents: "छात्र खाता प्रबंधन",
    tabBanners: "स्लाइडर और सूचनाएँ",
    tabSettings: "सिस्टम एवं मुद्रीकरण",
    tabBackups: "बैकअप और सिस्टम लॉग",
    tabExportApp: "छात्र ऐप डाउनलोड करें",

    totalStudents: "कुल पंजीकृत छात्र",
    totalTests: "कुल मॉक टेस्ट निर्मित",
    totalPDFs: "अपलोड की गई पीडीएफ फाइलें",
    activeCoupons: "सक्रिय डिस्काउंट कूपन",
    quickActions: "त्वरित एडमिन टूल",
    saveChanges: "सभी बदलाव सहेजें",
    saving: "क्लाउड सर्वर में सहेजा जा रहा है...",
    savedSuccessfully: "कॉन्फ़िगरेशन सफलतापूर्वक सहेजा गया!",
    inspectSecurityNotice: "सर्वर-साइड सुरक्षित: पासवर्ड का सत्यापन बैकएंड एपीआई पर होता है। इंस्पेक्टर / देवटूल से पासवर्ड नहीं देखा जा सकता।",
  },

  hinglish: {
    adminPanelTitle: "Taiyariya : Admin Panel",
    studioSubtitle: "Taiyariya Studio and Ultimate Builder Engine",
    lockTitle: "Secure Admin Login",
    lockSubtitle: "Taiyariya Admin Panel open karne ke liye Master Password daalein",
    enterPassword: "Master Password Enter Karein",
    passwordPlaceholder: "Admin password type karein...",
    unlockButton: "Unlock Taiyariya Panel",
    invalidPassword: "Galat Password! Access denied by Backend Server.",
    checkingPassword: "Backend Server se verify ho raha hai...",
    logout: "Lock Panel",
    languageSelect: "Language",
    systemStatus: "Backend Status",
    online: "Online & Encrypted",
    changePasswordTitle: "Change Admin Master Password",
    currentPasswordLabel: "Purana Password",
    newPasswordLabel: "Naya Admin Password",
    confirmPasswordLabel: "Naya Password Confirm Karein",
    updatePasswordBtn: "Update Password Now",
    passwordUpdatedSuccess: "Server par Admin password successfully change ho gaya!",
    passwordChangeError: "Password change fail hua. Please current password check karein.",
    lockPanel: "Lock Panel",
    enterNewPasswordPlaceholder: "Naya secure admin password type karein...",
    updatingPassword: "Password Update ho raha hai...",
    
    tabOverview: "Dashboard Overview",
    tabBranding: "Brand & Logo Setup",
    tabTestSeries: "Test Series & Exams",
    tabPdfMaterials: "PDF Notes & Materials",
    tabStudents: "Student Accounts Control",
    tabBanners: "Sliders & Notifications",
    tabSettings: "Settings & Pricing",
    tabBackups: "Database Backups & Logs",
    tabExportApp: "Export Student App",

    totalStudents: "Total Registered Students",
    totalTests: "Total Mock Tests",
    totalPDFs: "Uploaded PDF Files",
    activeCoupons: "Active Discount Vouchers",
    quickActions: "Quick Admin Actions",
    saveChanges: "Save All Changes",
    saving: "Server par Save ho raha hai...",
    savedSuccessfully: "All changes successfully saved!",
    inspectSecurityNotice: "Server-Side Secured: Password Backend API par check hota hai. Koi bhi Inspect Element se dekh nahi sakta.",
  },

  bn: {
    adminPanelTitle: "তাইয়ারিয়া : অ্যাডমিন প্যানেল",
    studioSubtitle: "তাইয়ারিয়া স্টুডিও এবং আল্টিমেট বিল্ডার ইঞ্জিন",
    lockTitle: "নিরাপদ অ্যাডমিন অথেন্টিকেশন",
    lockSubtitle: "তাইয়ারিয়া অ্যাডমিন প্যানেল খুলতে মাস্টার পাসওয়ার্ড দিন",
    enterPassword: "মাস্টার পাসওয়ার্ড দিন",
    passwordPlaceholder: "অ্যাডমিন পাসওয়ার্ড লিখুন...",
    unlockButton: "অ্যাডমিন প্যানেল আনলক করুন",
    invalidPassword: "ভুল পাসওয়ার্ড! সার্ভার দ্বারা অ্যাক্সেস প্রত্যাখ্যান করা হয়েছে।",
    checkingPassword: "ব্যাকএন্ড সার্ভারের মাধ্যমে যাচাই করা হচ্ছে...",
    logout: "প্যানেল লক করুন",
    languageSelect: "ভাষা নির্বাচন করুন",
    systemStatus: "ব্যাকএন্ড স্ট্যাটাস",
    online: "অনলাইন এবং এনক্রিপ্ট করা",
    changePasswordTitle: "অ্যাডমিন মাস্টার পাসওয়ার্ড পরিবর্তন করুন",
    currentPasswordLabel: "বর্তমান পাসওয়ার্ড",
    newPasswordLabel: "নতুন অ্যাডমিন পাসওয়ার্ড",
    confirmPasswordLabel: "নতুন পাসওয়ার্ড নিশ্চিত করুন",
    updatePasswordBtn: "পাসওয়ার্ড আপডেট করুন",
    passwordUpdatedSuccess: "সার্ভারে অ্যাডমিন পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!",
    passwordChangeError: "পাসওয়ার্ড আপডেট ব্যর্থ হয়েছে। সঠিক পাসওয়ার্ড দিন।",
    lockPanel: "প্যানেল লক করুন",
    enterNewPasswordPlaceholder: "নতুন নিরাপদ অ্যাডমিন পাসওয়ার্ড লিখুন...",
    updatingPassword: "পাসওয়ার্ড আপডেট করা হচ্ছে...",
    
    tabOverview: "ড্যাশবোর্ড ওভারভিউ",
    tabBranding: "ব্র্যান্ড এবং লোগো সেটিংস",
    tabTestSeries: "টেস্ট সিরিজ এবং পরীক্ষা",
    tabPdfMaterials: "পিডিএফ এবং স্টাডি মেটেরিয়াল",
    tabStudents: "স্টুডেন্ট অ্যাকাউন্ট কন্ট্রোল",
    tabBanners: "স্লাইডার এবং নোটিফিকেশন",
    tabSettings: "সিস্টেম ও সেটিংসে",
    tabBackups: "ব্যাকআপ এবং সিস্টেম লগ",
    tabExportApp: "স্টুডেন্ট অ্যাপ ডাউনলোড",

    totalStudents: "মোট নিবন্ধিত শিক্ষার্থী",
    totalTests: "মোট মক টেস্ট",
    totalPDFs: "আপলোড করা পিডিএফ",
    activeCoupons: "সক্রিয় ডিসকাউন্ট ভাউচার",
    quickActions: "কুইক অ্যাডমিন টুলস",
    saveChanges: "সমস্ত পরিবর্তন সেভ করুন",
    saving: "ক্লাউড সার্ভারে সেভ হচ্ছে...",
    savedSuccessfully: "কনফিগারেশন সফলভাবে সেভ হয়েছে!",
    inspectSecurityNotice: "সার্ভার-সাইড সিকিউরড: পাসওয়ার্ড ব্যাকএন্ড এপিআইতে যাচাই করা হয়। ইন্সপেক্ট করে দেখা সম্ভব নয়।",
  },

  mr: {
    adminPanelTitle: "तैयारिया : ॲडमिन पॅनेल",
    studioSubtitle: "तैयारिया स्टुडिओ आणि अल्टीमेट बिल्डर इंजिन",
    lockTitle: "सुरक्षित ॲडमिन प्रमाणीकरण",
    lockSubtitle: "तैयारिया ॲडमिन पॅनेल उघडण्यासाठी मास्टर पासवर्ड प्रविष्ट करा",
    enterPassword: "मास्टर पासवर्ड प्रविष्ट करा",
    passwordPlaceholder: "ॲडमिन पासवर्ड टाइप करा...",
    unlockButton: "ॲडमिन पॅनेल उघडा",
    invalidPassword: "चुकीचा पासवर्ड! सर्व्हरद्वारे प्रवेश नाकारला गेला.",
    checkingPassword: "बॅकएंड सर्व्हरद्वारे तपासणी सुरू आहे...",
    logout: "पॅनेल लॉक करा",
    languageSelect: "भाषा निवडा",
    systemStatus: "बॅकएंड स्थिती",
    online: "ऑनलाईन आणि सुरक्षित",
    changePasswordTitle: "ॲडमिन मास्टर पासवर्ड बदला",
    currentPasswordLabel: "सध्याचा पासवर्ड",
    newPasswordLabel: "नवीन ॲडमिन पासवर्ड",
    confirmPasswordLabel: "नवीन पासवर्डची पुष्टी करा",
    updatePasswordBtn: "पासवर्ड अपडेट करा",
    passwordUpdatedSuccess: "सर्व्हरवर ॲडमिन पासवर्ड यशस्वीरित्या अपडेट झाला!",
    passwordChangeError: "पासवर्ड अपडेट अयशस्वी. कृपया सध्याचा पासवर्ड तपासा.",
    lockPanel: "पॅनेल लॉक करा",
    enterNewPasswordPlaceholder: "नवीन सुरक्षित ॲडमिन पासवर्ड प्रविष्ट करा...",
    updatingPassword: "पासवर्ड अपडेट होत आहे...",
    
    tabOverview: "डॅशबोर्ड विहंगावलोकन",
    tabBranding: "ब्रांड आणि लोगो सेटअप",
    tabTestSeries: "टेस्ट सिरीज आणि परीक्षा",
    tabPdfMaterials: "पीडीएफ आणि अभ्यास साहित्य",
    tabStudents: "विद्यार्थी खाते व्यवस्थापन",
    tabBanners: "स्लायडर आणि सूचना",
    tabSettings: "सिस्टम आणि सेटिंग्ज",
    tabBackups: "बॅकअप आणि लॉग",
    tabExportApp: "विद्यार्थी ॲप डाउनलोड करा",

    totalStudents: "एकूण नोंदणीकृत विद्यार्थी",
    totalTests: "एकूण मॉक टेस्ट",
    totalPDFs: "अपलोड केलेल्या पीडीएफ",
    activeCoupons: "सक्रिय कूपन",
    quickActions: "क्विक ॲडमिन टूल्स",
    saveChanges: "सर्व बदल जतन करा",
    saving: "सर्व्हरवर जतन होत आहे...",
    savedSuccessfully: "कॉन्फिगरेशन यशस्वीरित्या जतन झाले!",
    inspectSecurityNotice: "सर्व्हर-साइड सुरक्षित: पासवर्ड बॅकएंड एपीआयवर तपासला जातो. इन्स्पेक्ट एलिमेंटद्वारे पाहता येत नाही.",
  }
};
