import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRegionDetection } from '@/hooks/useRegionDetection';

// Translations for the pricing banner and key UI elements
const translations: Record<string, Record<string, string>> = {
  en: {
    pricing_title: "All Software",
    pricing_amount: "$249",
    pricing_lifetime: "Lifetime Access",
    pricing_no_hidden: "No Hidden Costs",
    pricing_no_advance: "No Advance Payment",
    pricing_free_demo: "Free Demo",
    pricing_free_update: "Free Lifetime Updates",
    pricing_cta: "Get Started Now",
    try_demo: "Try Free Demo",
    browse_categories: "Browse by Industry",
    trusted_by: "Trusted by 10,000+ Businesses Across 50+ Countries",
    live_chat: "Live Chat",
    send_message: "Send Message",
    type_message: "Type your message...",
    support: "24/7 Support",
    change_language: "Change Language",
  },
  hi: {
    pricing_title: "सभी सॉफ्टवेयर",
    pricing_amount: "$249",
    pricing_lifetime: "आजीवन एक्सेस",
    pricing_no_hidden: "कोई छिपी हुई लागत नहीं",
    pricing_no_advance: "कोई अग्रिम भुगतान नहीं",
    pricing_free_demo: "मुफ्त डेमो",
    pricing_free_update: "मुफ्त आजीवन अपडेट",
    pricing_cta: "अभी शुरू करें",
    try_demo: "मुफ्त डेमो आज़माएं",
    browse_categories: "उद्योग के अनुसार ब्राउज़ करें",
    trusted_by: "50+ देशों में 10,000+ व्यवसायों द्वारा विश्वसनीय",
    live_chat: "लाइव चैट",
    send_message: "संदेश भेजें",
    type_message: "अपना संदेश लिखें...",
    support: "24/7 सहायता",
    change_language: "भाषा बदलें",
  },
  ar: {
    pricing_title: "جميع البرامج",
    pricing_amount: "$249",
    pricing_lifetime: "وصول مدى الحياة",
    pricing_no_hidden: "لا تكاليف خفية",
    pricing_no_advance: "لا دفع مقدم",
    pricing_free_demo: "عرض مجاني",
    pricing_free_update: "تحديثات مجانية مدى الحياة",
    pricing_cta: "ابدأ الآن",
    try_demo: "جرب العرض المجاني",
    browse_categories: "تصفح حسب الصناعة",
    trusted_by: "موثوق به من قبل 10,000+ شركة في 50+ دولة",
    live_chat: "دردشة مباشرة",
    send_message: "إرسال رسالة",
    type_message: "اكتب رسالتك...",
    support: "دعم 24/7",
    change_language: "تغيير اللغة",
  },
  es: {
    pricing_title: "Todo el Software",
    pricing_amount: "$249",
    pricing_lifetime: "Acceso de por Vida",
    pricing_no_hidden: "Sin Costos Ocultos",
    pricing_no_advance: "Sin Pago Anticipado",
    pricing_free_demo: "Demo Gratis",
    pricing_free_update: "Actualizaciones Gratis de por Vida",
    pricing_cta: "Comenzar Ahora",
    try_demo: "Probar Demo Gratis",
    browse_categories: "Explorar por Industria",
    trusted_by: "Confiado por 10,000+ Empresas en 50+ Países",
    live_chat: "Chat en Vivo",
    send_message: "Enviar Mensaje",
    type_message: "Escribe tu mensaje...",
    support: "Soporte 24/7",
    change_language: "Cambiar Idioma",
  },
  fr: {
    pricing_title: "Tous les Logiciels",
    pricing_amount: "$249",
    pricing_lifetime: "Accès à Vie",
    pricing_no_hidden: "Pas de Frais Cachés",
    pricing_no_advance: "Pas de Paiement Anticipé",
    pricing_free_demo: "Démo Gratuite",
    pricing_free_update: "Mises à Jour Gratuites à Vie",
    pricing_cta: "Commencer Maintenant",
    try_demo: "Essayer Démo Gratuite",
    browse_categories: "Parcourir par Industrie",
    trusted_by: "Approuvé par 10,000+ Entreprises dans 50+ Pays",
    live_chat: "Chat en Direct",
    send_message: "Envoyer Message",
    type_message: "Tapez votre message...",
    support: "Support 24/7",
    change_language: "Changer de Langue",
  },
  de: {
    pricing_title: "Alle Software",
    pricing_amount: "$249",
    pricing_lifetime: "Lebenslanger Zugang",
    pricing_no_hidden: "Keine versteckten Kosten",
    pricing_no_advance: "Keine Vorauszahlung",
    pricing_free_demo: "Kostenlose Demo",
    pricing_free_update: "Kostenlose lebenslange Updates",
    pricing_cta: "Jetzt Starten",
    try_demo: "Kostenlose Demo testen",
    browse_categories: "Nach Branche durchsuchen",
    trusted_by: "Vertraut von 10.000+ Unternehmen in 50+ Ländern",
    live_chat: "Live-Chat",
    send_message: "Nachricht senden",
    type_message: "Geben Sie Ihre Nachricht ein...",
    support: "24/7 Support",
    change_language: "Sprache ändern",
  },
  pt: {
    pricing_title: "Todo o Software",
    pricing_amount: "$249",
    pricing_lifetime: "Acesso Vitalício",
    pricing_no_hidden: "Sem Custos Ocultos",
    pricing_no_advance: "Sem Pagamento Antecipado",
    pricing_free_demo: "Demo Gratuito",
    pricing_free_update: "Atualizações Gratuitas Vitalícias",
    pricing_cta: "Começar Agora",
    try_demo: "Experimentar Demo Grátis",
    browse_categories: "Navegar por Indústria",
    trusted_by: "Confiado por 10.000+ Empresas em 50+ Países",
    live_chat: "Chat ao Vivo",
    send_message: "Enviar Mensagem",
    type_message: "Digite sua mensagem...",
    support: "Suporte 24/7",
    change_language: "Alterar Idioma",
  },
  zh: {
    pricing_title: "所有软件",
    pricing_amount: "$249",
    pricing_lifetime: "终身访问",
    pricing_no_hidden: "无隐藏费用",
    pricing_no_advance: "无需预付",
    pricing_free_demo: "免费演示",
    pricing_free_update: "免费终身更新",
    pricing_cta: "立即开始",
    try_demo: "免费试用演示",
    browse_categories: "按行业浏览",
    trusted_by: "受到50多个国家10,000多家企业的信赖",
    live_chat: "在线聊天",
    send_message: "发送消息",
    type_message: "输入您的消息...",
    support: "24/7 支持",
    change_language: "更改语言",
  },
  ja: {
    pricing_title: "すべてのソフトウェア",
    pricing_amount: "$249",
    pricing_lifetime: "生涯アクセス",
    pricing_no_hidden: "隠れた費用なし",
    pricing_no_advance: "前払い不要",
    pricing_free_demo: "無料デモ",
    pricing_free_update: "生涯無料アップデート",
    pricing_cta: "今すぐ始める",
    try_demo: "無料デモを試す",
    browse_categories: "業界別に閲覧",
    trusted_by: "50カ国以上の10,000社以上に信頼されています",
    live_chat: "ライブチャット",
    send_message: "メッセージを送信",
    type_message: "メッセージを入力...",
    support: "24/7 サポート",
    change_language: "言語を変更",
  },
  ru: {
    pricing_title: "Все Программы",
    pricing_amount: "$249",
    pricing_lifetime: "Пожизненный Доступ",
    pricing_no_hidden: "Нет Скрытых Расходов",
    pricing_no_advance: "Без Предоплаты",
    pricing_free_demo: "Бесплатная Демо",
    pricing_free_update: "Бесплатные Пожизненные Обновления",
    pricing_cta: "Начать Сейчас",
    try_demo: "Попробовать Бесплатную Демо",
    browse_categories: "Просмотр по Отраслям",
    trusted_by: "Доверяют более 10,000 компаний в 50+ странах",
    live_chat: "Онлайн Чат",
    send_message: "Отправить Сообщение",
    type_message: "Введите сообщение...",
    support: "Поддержка 24/7",
    change_language: "Изменить Язык",
  },
  bn: {
    pricing_title: "সমস্ত সফটওয়্যার",
    pricing_amount: "$249",
    pricing_lifetime: "আজীবন অ্যাক্সেস",
    pricing_no_hidden: "কোন লুকানো খরচ নেই",
    pricing_no_advance: "কোন অগ্রিম পেমেন্ট নেই",
    pricing_free_demo: "বিনামূল্যে ডেমো",
    pricing_free_update: "বিনামূল্যে আজীবন আপডেট",
    pricing_cta: "এখনই শুরু করুন",
    try_demo: "বিনামূল্যে ডেমো চেষ্টা করুন",
    browse_categories: "শিল্প অনুসারে ব্রাউজ করুন",
    trusted_by: "50+ দেশে 10,000+ ব্যবসায় বিশ্বস্ত",
    live_chat: "লাইভ চ্যাট",
    send_message: "বার্তা পাঠান",
    type_message: "আপনার বার্তা লিখুন...",
    support: "24/7 সাপোর্ট",
    change_language: "ভাষা পরিবর্তন করুন",
  },
  ur: {
    pricing_title: "تمام سافٹ ویئر",
    pricing_amount: "$249",
    pricing_lifetime: "تاحیات رسائی",
    pricing_no_hidden: "کوئی پوشیدہ لاگت نہیں",
    pricing_no_advance: "کوئی پیشگی ادائیگی نہیں",
    pricing_free_demo: "مفت ڈیمو",
    pricing_free_update: "مفت تاحیات اپڈیٹس",
    pricing_cta: "ابھی شروع کریں",
    try_demo: "مفت ڈیمو آزمائیں",
    browse_categories: "صنعت کے لحاظ سے براؤز کریں",
    trusted_by: "50+ ممالک میں 10,000+ کاروبار کا اعتماد",
    live_chat: "براہ راست چیٹ",
    send_message: "پیغام بھیجیں",
    type_message: "اپنا پیغام لکھیں...",
    support: "24/7 سپورٹ",
    change_language: "زبان تبدیل کریں",
  },
};

// Language code to full locale mapping for auto-detection
const LANGUAGE_TO_REGION: Record<string, string[]> = {
  hi: ['IN'],
  bn: ['BD', 'IN'],
  ur: ['PK', 'IN'],
  ar: ['AE', 'SA', 'EG', 'KW', 'QA', 'BH', 'OM'],
  zh: ['CN', 'TW', 'HK', 'SG'],
  ja: ['JP'],
  pt: ['BR', 'PT'],
  es: ['ES', 'MX', 'AR', 'CO', 'PE', 'CL'],
  de: ['DE', 'AT', 'CH'],
  fr: ['FR', 'BE', 'CH', 'CA'],
  ru: ['RU', 'BY', 'KZ'],
  en: ['US', 'GB', 'AU', 'CA', 'IN', 'SG', 'NZ', 'IE'],
};

interface TranslationContextType {
  t: (key: string) => string;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  isRTL: boolean;
  availableLanguages: { code: string; name: string; flag: string }[];
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
];

export function TranslationProvider({ children }: { children: ReactNode }) {
  const { region } = useRegionDetection();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);

  // Auto-detect language based on region
  useEffect(() => {
    const stored = localStorage.getItem('sv_user_language');
    if (stored) {
      setCurrentLanguage(stored);
      setIsRTL(['ar', 'ur', 'he', 'fa'].includes(stored));
      document.documentElement.dir = ['ar', 'ur', 'he', 'fa'].includes(stored) ? 'rtl' : 'ltr';
      return;
    }

    // Auto-detect based on browser language
    const browserLang = navigator.language?.split('-')[0] || 'en';
    if (translations[browserLang]) {
      setCurrentLanguage(browserLang);
      setIsRTL(['ar', 'ur', 'he', 'fa'].includes(browserLang));
      document.documentElement.dir = ['ar', 'ur', 'he', 'fa'].includes(browserLang) ? 'rtl' : 'ltr';
    }
  }, [region]);

  const setLanguage = useCallback((lang: string) => {
    setCurrentLanguage(lang);
    setIsRTL(['ar', 'ur', 'he', 'fa'].includes(lang));
    document.documentElement.dir = ['ar', 'ur', 'he', 'fa'].includes(lang) ? 'rtl' : 'ltr';
    localStorage.setItem('sv_user_language', lang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[currentLanguage]?.[key] || translations['en']?.[key] || key;
  }, [currentLanguage]);

  return (
    <TranslationContext.Provider value={{ t, currentLanguage, setLanguage, isRTL, availableLanguages }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}