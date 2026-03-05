export interface User {
  id: number;
  fullName: string;
  mobile: string;
  village: string;
  cropType: string;
  role: 'farmer' | 'admin';
}

export interface MarketItem {
  id: number;
  farmerId: number;
  cropName: string;
  quantity: string;
  pricePerKg: number;
  location: string;
  contact: string;
  createdAt: string;
}

export interface Equipment {
  id: number;
  name: string;
  type: string;
  pricePerDay: number;
  availability: boolean;
  image: string;
}

export interface MarketPrice {
  id: number;
  cropName: string;
  price: number;
  location: string;
  updatedAt: string;
}

export interface Emergency {
  id: number;
  farmerId: number;
  type: string;
  description: string;
  status: string;
  createdAt: string;
  farmerName?: string;
  mobile?: string;
}

export type Language = 'en' | 'te' | 'kn' | 'hi';

export const translations = {
  en: {
    welcome: "Welcome to Smart Farmer",
    dashboard: "Farmer Dashboard",
    weather: "Weather Alerts",
    disease: "AI Disease Detection",
    market: "Market Prices",
    marketplace: "Farmer Marketplace",
    schemes: "Govt Schemes",
    voice: "Voice Assistant",
    rental: "Equipment Rental",
    expert: "Expert Consult",
    analytics: "Farm Analytics",
    emergency: "Emergency Support",
    iot: "IoT Smart Farm",
    logout: "Logout",
    login: "Login",
    register: "Register",
  },
  te: {
    welcome: "స్మార్ట్ ఫార్మర్‌కు స్వాగతం",
    dashboard: "రైతు డాష్‌బోర్డ్",
    weather: "వాతావరణ హెచ్చరికలు",
    disease: "AI వ్యాధి గుర్తింపు",
    market: "మార్కెట్ ధరలు",
    marketplace: "రైతు మార్కెట్",
    schemes: "ప్రభుత్వ పథకాలు",
    voice: "వాయిస్ అసిస్టెంట్",
    rental: "పరికరాల అద్దె",
    expert: "నిపుణుల సలహా",
    analytics: "ఫామ్ అనలిటిక్స్",
    emergency: "అత్యవసర సహాయం",
    iot: "IoT స్మార్ట్ ఫామ్",
    logout: "లాగ్ అవుట్",
    login: "లాగిన్",
    register: "నమోదు",
  },
  kn: {
    welcome: "ಸ್ಮಾರ್ಟ್ ಫಾರ್ಮರ್‌ಗೆ ಸ್ವಾಗತ",
    dashboard: "ರೈತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    weather: "ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು",
    disease: "AI ರೋಗ ಪತ್ತೆ",
    market: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
    marketplace: "ರೈತ ಮಾರುಕಟ್ಟೆ",
    schemes: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    voice: "ಧ್ವನಿ ಸಹಾಯಕ",
    rental: "ಉಪಕರಣ ಬಾಡಿಗೆ",
    expert: "ತಜ್ಞರ ಸಲಹೆ",
    analytics: "ಫಾರ್ಮ್ ಅನಾಲಿಟಿಕ್ಸ್",
    emergency: "ತುರ್ತು ಬೆಂಬಲ",
    iot: "IoT ಸ್ಮಾರ್ಟ್ ಫಾರ್ಮ್",
    logout: "ಲಾಗ್ ಔಟ್",
    login: "ಲಾಗಿನ್",
    register: "ನೋಂದಣಿ",
  },
  hi: {
    welcome: "स्मार्ट किसान में आपका स्वागत है",
    dashboard: "किसान डैशबोर्ड",
    weather: "मौसम अलर्ट",
    disease: "AI रोग पहचान",
    market: "बाजार भाव",
    marketplace: "किसान बाजार",
    schemes: "सरकारी योजनाएं",
    voice: "वॉयस असिस्टेंट",
    rental: "उपकरण किराया",
    expert: "विशेषज्ञ सलाह",
    analytics: "फार्म एनालिटिक्स",
    emergency: "आपातकालीन सहायता",
    iot: "IoT स्मार्ट फार्म",
    logout: "लॉग आउट",
    login: "लॉगिन",
    register: "पंजीकरण",
  }
};
