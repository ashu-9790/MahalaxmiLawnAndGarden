import { Injectable, signal, computed } from '@angular/core';

export interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export interface TranslationSchema {
  title: string;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  subtitle: string;
  question: string;
  cta_contact: string;
  cta_sub: string;
  owner_name: string;
  phone: string;
  phone_raw: string;
  bottom_note_1: string;
  bottom_note_2: string;
  form_title: string;
  form_name: string;
  form_phone: string;
  form_email: string;
  btn_watch_video: string;
  video_badge: string;
  form_service: string;
  form_message: string;
  form_submit: string;
  form_success: string;
  form_error: string;
  admin_login: string;
  services_title: string;
  nav_home: string;
  nav_services: string;
  nav_gallery: string;
  nav_contact: string;
  nav_admin: string;
  nav_menu: string;
  gallery_title: string;
  gallery_subtitle: string;
  gallery_explore_btn: string;
  err_name_req: string;
  err_phone_req: string;
  err_phone_10: string;
  err_email_invalid: string;
  err_service_req: string;
  services: ServiceItem[];
}

const TRANSLATIONS: Record<'mr' | 'en', TranslationSchema> = {
  mr: {
    title: "महालक्ष्मी लॉन ॲण्ड गार्डन",
    hero_badge: "उत्कृष्ट लॉन व गार्डन सेवा | Lawns & Gardens",
    hero_title: "आपल्या अंगणाचं रूपांतर करा - महालक्ष्मी लॉन ॲण्ड गार्डन सोबत!",
    hero_subtitle: "व्यावसायिक लँडस्केपिंग, दर्जेदार लॉनची निगा आणि सुंदर बागांच्या परिपूर्ण सेवांद्वारे आपल्या जागेचे सौंदर्य वाढवा.",
    subtitle: "व्यावसायिक लॉन व गार्डन डिझाईन - महालक्ष्मी लॉन ॲण्ड गार्डन",
    question: "आपल्या घराजवळ एक सुंदर, हिरवंगार लॉन आणि बाग हवी आहे का?",
    cta_contact: "आजच संपर्क करा",
    cta_sub: "आपल्या घराजवळ निसर्गाचा स्पर्श महालक्ष्मी लॉन ॲण्ड गार्डन सोबत.",
    owner_name: "श्री मानसिंग पाटील - (निसर्ग प्रेमी)",
    phone: "९७६६९ २४९४९",
    phone_raw: "+919766924949",
    bottom_note_1: "महालक्ष्मी लॉन ॲण्ड गार्डन तुमचं स्वप्न साकार करण्यासाठी सज्ज आहे!",
    bottom_note_2: "फुलांनी बहरलेली बाग, नीटसपणे कापलेले हिरवेगार लॉन आणि नैसर्गिक सौंदर्य - हे सर्व मिळवा एकाच ठिकाणी.",
    form_title: "विनामूल्य सल्ला आणि चौकशी",
    form_name: "तुमचे नाव",
    form_phone: "फोन नंबर",
    form_email: "ईमेल (पर्यायी)",
    btn_watch_video: "महालक्ष्मी लॉन आणि गार्डन — खास व्हिडिओ पहा",
    video_badge: "विशेष व्हिडिओ",
    form_service: "हवी असलेली सेवा निवडा",
    form_message: "संदेश (पर्यायी)",
    form_submit: "चौकशी पाठवा",
    form_success: "तुमची चौकशी यशस्वीरीत्या पाठवली गेली आहे! आम्ही लवकरच तुमच्याशी संपर्क साधू.",
    form_error: "काहीतरी अडचण आली. कृपया पुन्हा प्रयत्न करा किंवा कॉल करा.",
    admin_login: "प्रशासक लॉगिन",
    services_title: "आमच्या लॉन आणि गार्डन सेवा",
    nav_home: "होम पेज",
    nav_services: "आमच्या सेवा",
    nav_gallery: "फोटो गॅलरी",
    nav_contact: "संपर्क साधा",
    nav_admin: "प्रशासक",
    nav_menu: "मेनू",
    gallery_title: "फोटो गॅलरी",
    gallery_subtitle: "सुंदर लँडस्केप्स आणि बागेच्या डिझाईन्सचा आमचा पोर्टफोलिओ पहा.",
    gallery_explore_btn: "आमची संपूर्ण फोटो गॅलरी पहा",
    err_name_req: "नाव आवश्यक आहे",
    err_phone_req: "फोन नंबर आवश्यक आहे",
    err_phone_10: "कृपया बरोबर १० अंक प्रविष्ट करा",
    err_email_invalid: "कृपया वैध ईमेल पत्ता प्रविष्ट करा",
    err_service_req: "कृपया एक सेवा निवडा",
    services: [
      { id: 'landscape', title: "लँडस्केप डिझाईन", desc: "तुमच्या आवाराला सुंदर आणि नयनरम्य लँडस्केपमध्ये रूपांतरित करा.", icon: "🌳" },
      { id: 'lawn_maintenance', title: "नवा लॉन तसेच मेंटेनन्स", desc: "नवीन हिरवळीची लागवड आणि नियमित निगा राखणे.", icon: "🌱" },
      { id: 'gardening', title: "बागकाम", desc: "विविध प्रकारच्या फुलांची आणि वनस्पतींची लागवड आणि निगा.", icon: "🏡" },
      { id: 'mowing', title: "कापणी", desc: "लॉन आणि बागेची सुव्यवस्थित कापणी आणि छाटणी.", icon: "✂️" },
      { id: 'weeding', title: "खुरपणी", desc: "नको असलेले तण काढून बागेला स्वच्छ आणि निरोगी राखणे.", icon: "🌿" },
      { id: 'soil_analysis', title: "माती आणि रोगांचे विश्लेषण", desc: "मातीची सुपीकता तपासणे आणि वनस्पतींच्या रोगांचे निदान.", icon: "🔬" },
      { id: 'pest_control', title: "कीटक नियंत्रण", desc: "बागेतील झाडांचे कीटक आणि आजारांपासून संरक्षण.", icon: "🐜" },
      { id: 'drip_irrigation', title: "ठिबक सिंचन", desc: "पाण्याची बचत करणारी आणि कार्यक्षम सिंचन यंत्रणा बसवणे.", icon: "💧" },
      { id: 'plants', title: "खात्रीशीर रोप", desc: "उत्कृष्ट दर्जाची आणि खात्रीशीर विविध रोपांची विक्री.", icon: "🌸" },
      { id: 'fertilizer', title: "खत व्यवस्थापन", desc: "झाडांच्या योग्य वाढीसाठी जैविक आणि रासायनिक खतांचे नियोजन.", icon: "🍂" }
    ]
  },
  en: {
    title: "Mahalaxmi Lawn & Garden",
    hero_badge: "PREMIUM LAWNS & GARDENS SERVICES",
    hero_title: "Transform Your Lawns & Gardens with Mahalaxmi Lawn & Garden!",
    hero_subtitle: "Enhance your property with professional landscaping, fresh lawn installation, garden design, and routine lawn maintenance.",
    subtitle: "Complete Lawns and Gardens Solutions - Mahalaxmi Lawn & Garden",
    question: "Do you want lush green lawns and beautiful gardens around your property?",
    cta_contact: "Contact Today",
    cta_sub: "A touch of nature near your home with Mahalaxmi Lawn & Garden.",
    owner_name: "Shri Mansing Patil - (Nature Lover)",
    phone: "97669 24949",
    phone_raw: "+919766924949",
    bottom_note_1: "Mahalaxmi Lawn & Garden is ready to build your dream lawns and gardens!",
    bottom_note_2: "Flourishing gardens, neatly mowed green lawns, and natural landscape beauty — get all of this in one place.",
    form_title: "Free Consultation & Inquiry",
    form_name: "Your Name",
    form_phone: "Phone Number",
    form_email: "Email (Optional)",
    btn_watch_video: "Discover What We Do & How We Can Help",
    video_badge: "FEATURED VIDEO",
    form_service: "Select Required Service",
    form_message: "Message (Optional)",
    form_submit: "Send Inquiry",
    form_success: "Your inquiry has been submitted successfully! We will contact you soon.",
    form_error: "Something went wrong. Please try again or call directly.",
    admin_login: "Admin Login",
    services_title: "Our Lawns & Gardens Services",
    nav_home: "Home",
    nav_services: "Services",
    nav_gallery: "Gallery",
    nav_contact: "Contact Us",
    nav_admin: "Admin Portal",
    nav_menu: "Menu",
    gallery_title: "Photo Gallery",
    gallery_subtitle: "Explore our portfolio of beautiful landscapes and garden designs.",
    gallery_explore_btn: "Explore Full Photo Gallery",
    err_name_req: "Name is required",
    err_phone_req: "Phone number is required",
    err_phone_10: "Please enter exactly 10 digits",
    err_email_invalid: "Please enter a valid email address",
    err_service_req: "Please select a service",
    services: [
      { id: 'landscape', title: "Landscape Design", desc: "Transform your yard into a beautiful and picturesque landscape.", icon: "🌳" },
      { id: 'lawn_maintenance', title: "New Lawn & Maintenance", desc: "Fresh lawn installation and routine maintenance/care.", icon: "🌱" },
      { id: 'gardening', title: "Gardening Services", desc: "Cultivating and managing various flowers, plants, and greenery.", icon: "🏡" },
      { id: 'mowing', title: "Mowing & Trimming", desc: "Professional grass mowing, border edging, and hedge trimming.", icon: "✂️" },
      { id: 'weeding', title: "Weeding", desc: "Removing unwanted weeds to keep your garden clean and healthy.", icon: "🌿" },
      { id: 'soil_analysis', title: "Soil & Disease Analysis", desc: "Testing soil fertility and diagnosing plant health issues.", icon: "🔬" },
      { id: 'pest_control', title: "Pest Control", desc: "Protecting plants and trees from harmful garden pests and insects.", icon: "🐜" },
      { id: 'drip_irrigation', title: "Drip Irrigation", desc: "Installing highly efficient, water-saving drip systems.", icon: "💧" },
      { id: 'plants', title: "Guaranteed Plants/Saplings", desc: "Supplying healthy, high-quality plants and flowering saplings.", icon: "🌸" },
      { id: 'fertilizer', title: "Fertilizers & Nutrients", desc: "Providing customized compost and organic fertilizers for plant growth.", icon: "🍂" }
    ]
  }
};

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  // Signal containing 'mr' or 'en'
  currentLang = signal<'mr' | 'en'>('mr');

  // Computed signal containing the full dictionary for the current language
  t = computed<TranslationSchema>(() => TRANSLATIONS[this.currentLang()]);

  toggleLanguage() {
    this.currentLang.update(lang => lang === 'mr' ? 'en' : 'mr');
  }

  setLanguage(lang: 'mr' | 'en') {
    this.currentLang.set(lang);
  }
}
