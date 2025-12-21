import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Shield, 
  Crown, 
  Building2, 
  ShoppingBag, 
  Headphones, 
  TrendingUp,
  Star,
  User,
  Briefcase,
  Users,
  Lock,
  Globe,
  Bot,
  Mic,
  MicOff,
  Volume2,
  Languages
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

interface MaskedUser {
  maskedId: string;
  role: string;
  icon: React.ReactNode;
  color: string;
  country: string;
  countryFlag: string;
}

interface ChatMessage {
  id: string;
  sender: MaskedUser;
  content: string;
  translatedContent?: string;
  timestamp: Date;
  isOwn?: boolean;
  isVoiceNote?: boolean;
  originalLanguage?: string;
}

// Country data with flags
const countries: Record<string, { flag: string; name: string }> = {
  'IN': { flag: '🇮🇳', name: 'India' },
  'US': { flag: '🇺🇸', name: 'USA' },
  'UK': { flag: '🇬🇧', name: 'UK' },
  'AE': { flag: '🇦🇪', name: 'UAE' },
  'KE': { flag: '🇰🇪', name: 'Kenya' },
  'NG': { flag: '🇳🇬', name: 'Nigeria' },
  'SA': { flag: '🇸🇦', name: 'Saudi' },
  'SG': { flag: '🇸🇬', name: 'Singapore' },
  'DE': { flag: '🇩🇪', name: 'Germany' },
  'FR': { flag: '🇫🇷', name: 'France' },
  'JP': { flag: '🇯🇵', name: 'Japan' },
  'AU': { flag: '🇦🇺', name: 'Australia' },
};

const getRandomCountry = () => {
  const keys = Object.keys(countries);
  return keys[Math.floor(Math.random() * keys.length)];
};

// Generate masked ID based on role with specific digit counts
const generateMaskedId = (role: string, userId: string, countryCode?: string): MaskedUser => {
  const hash = userId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const country = countryCode || getRandomCountry();
  const countryData = countries[country] || countries['IN'];
  
  switch (role) {
    case 'super_admin':
      return {
        maskedId: `👑 BOSS-${String(hash % 100).padStart(2, '0')}`,
        role: 'Super Admin',
        icon: <Crown className="w-4 h-4" />,
        color: 'text-yellow-500 bg-yellow-500/10',
        country: countryData.name,
        countryFlag: countryData.flag
      };
    case 'admin':
    case 'management':
      return {
        maskedId: `MGT-${String(hash % 100).padStart(2, '0')}`,
        role: 'Management',
        icon: <Shield className="w-4 h-4" />,
        color: 'text-purple-500 bg-purple-500/10',
        country: countryData.name,
        countryFlag: countryData.flag
      };
    case 'ai_bot':
      return {
        maskedId: `EMP-${String(hash % 1000).padStart(3, '0')}`,
        role: 'Staff',
        icon: <Bot className="w-4 h-4" />,
        color: 'text-cyan-500 bg-cyan-500/10',
        country: countryData.name,
        countryFlag: countryData.flag
      };
    case 'developer':
    case 'employee':
    case 'hr':
    case 'legal':
    case 'task_manager':
      return {
        maskedId: `EMP-${String(hash % 1000).padStart(3, '0')}`,
        role: 'Employee',
        icon: <Briefcase className="w-4 h-4" />,
        color: 'text-blue-500 bg-blue-500/10',
        country: countryData.name,
        countryFlag: countryData.flag
      };
    case 'franchise':
      return {
        maskedId: `FRN-${String(hash % 10000).padStart(4, '0')}`,
        role: 'Franchise',
        icon: <Building2 className="w-4 h-4" />,
        color: 'text-emerald-500 bg-emerald-500/10',
        country: countryData.name,
        countryFlag: countryData.flag
      };
    case 'reseller':
      return {
        maskedId: `RSL-${String(hash % 100000).padStart(5, '0')}`,
        role: 'Reseller',
        icon: <ShoppingBag className="w-4 h-4" />,
        color: 'text-orange-500 bg-orange-500/10',
        country: countryData.name,
        countryFlag: countryData.flag
      };
    case 'sales_support':
    case 'sales':
      return {
        maskedId: `SLS-${String(hash % 100000).padStart(5, '0')}`,
        role: 'Sales',
        icon: <TrendingUp className="w-4 h-4" />,
        color: 'text-pink-500 bg-pink-500/10',
        country: countryData.name,
        countryFlag: countryData.flag
      };
    case 'support':
      return {
        maskedId: `SUP-${String(hash % 100000).padStart(5, '0')}`,
        role: 'Support',
        icon: <Headphones className="w-4 h-4" />,
        color: 'text-cyan-500 bg-cyan-500/10',
        country: countryData.name,
        countryFlag: countryData.flag
      };
    case 'prime_user':
      return {
        maskedId: `⭐ PRM-${String(hash % 10000000).padStart(7, '0')}`,
        role: 'Prime',
        icon: <Star className="w-4 h-4" />,
        color: 'text-amber-500 bg-amber-500/10',
        country: countryData.name,
        countryFlag: countryData.flag
      };
    case 'user':
    case 'common':
      return {
        maskedId: `USR-${String(hash % 100000000).padStart(8, '0')}`,
        role: 'User',
        icon: <User className="w-4 h-4" />,
        color: 'text-slate-400 bg-slate-500/10',
        country: countryData.name,
        countryFlag: countryData.flag
      };
    default:
      return {
        maskedId: `OTH-${String(hash % 1000000).padStart(6, '0')}`,
        role: 'Other',
        icon: <Users className="w-4 h-4" />,
        color: 'text-gray-500 bg-gray-500/10',
        country: countryData.name,
        countryFlag: countryData.flag
      };
  }
};

// Mock translation function (simulates auto-translation)
const translateMessage = (text: string, fromLang: string): string => {
  // In production, this would call a real translation API
  const translations: Record<string, string> = {
    'System update scheduled for tonight at 2 AM.': 'आज रात 2 बजे सिस्टम अपडेट निर्धारित है।',
    'Acknowledged. All teams notified.': 'स्वीकार किया। सभी टीमों को सूचित किया गया।',
    'Backend migration scripts are ready.': 'बैकएंड माइग्रेशन स्क्रिप्ट तैयार हैं।',
    'Will this affect our local operations?': 'क्या यह हमारे स्थानीय संचालन को प्रभावित करेगा?',
    'Client asked about the new pricing. Any updates?': 'ग्राहक ने नई कीमतों के बारे में पूछा। कोई अपडेट?',
    'No impact expected. Maintenance window is 30 mins.': 'कोई प्रभाव अपेक्षित नहीं। रखरखाव विंडो 30 मिनट है।',
    'Thanks for the heads up!': 'सूचना के लिए धन्यवाद!',
    'When will the new features be available?': 'नई सुविधाएं कब उपलब्ध होंगी?',
    'I can help you with that. Let me check the system.': 'मैं इसमें आपकी मदद कर सकता हूं। मुझे सिस्टम चेक करने दें।',
  };
  return translations[text] || `[Translated] ${text}`;
};

// Mock messages for demo
const mockMessages: ChatMessage[] = [
  {
    id: '1',
    sender: generateMaskedId('super_admin', 'user-boss-001', 'IN'),
    content: 'System update scheduled for tonight at 2 AM.',
    translatedContent: 'आज रात 2 बजे सिस्टम अपडेट निर्धारित है।',
    timestamp: new Date(Date.now() - 3600000),
    originalLanguage: 'en'
  },
  {
    id: '2',
    sender: generateMaskedId('admin', 'user-mgt-002', 'US'),
    content: 'Acknowledged. All teams notified.',
    translatedContent: 'स्वीकार किया। सभी टीमों को सूचित किया गया।',
    timestamp: new Date(Date.now() - 3000000),
    originalLanguage: 'en'
  },
  {
    id: '3',
    sender: generateMaskedId('developer', 'user-dev-003', 'DE'),
    content: 'Backend migration scripts are ready.',
    translatedContent: 'बैकएंड माइग्रेशन स्क्रिप्ट तैयार हैं।',
    timestamp: new Date(Date.now() - 2400000),
    originalLanguage: 'en'
  },
  {
    id: '4',
    sender: generateMaskedId('franchise', 'user-frn-004', 'KE'),
    content: 'Will this affect our local operations?',
    translatedContent: 'क्या यह हमारे स्थानीय संचालन को प्रभावित करेगा?',
    timestamp: new Date(Date.now() - 1800000),
    originalLanguage: 'en'
  },
  {
    id: '5',
    sender: generateMaskedId('ai_bot', 'ai-assistant-001', 'IN'),
    content: 'I can help you with that. Let me check the system.',
    translatedContent: 'मैं इसमें आपकी मदद कर सकता हूं। मुझे सिस्टम चेक करने दें।',
    timestamp: new Date(Date.now() - 1600000),
    originalLanguage: 'en'
  },
  {
    id: '6',
    sender: generateMaskedId('reseller', 'user-rsl-005', 'AE'),
    content: 'Client asked about the new pricing. Any updates?',
    translatedContent: 'ग्राहक ने नई कीमतों के बारे में पूछा। कोई अपडेट?',
    timestamp: new Date(Date.now() - 1500000),
    originalLanguage: 'en'
  },
  {
    id: '7',
    sender: generateMaskedId('support', 'user-sup-006', 'UK'),
    content: 'No impact expected. Maintenance window is 30 mins.',
    translatedContent: 'कोई प्रभाव अपेक्षित नहीं। रखरखाव विंडो 30 मिनट है।',
    timestamp: new Date(Date.now() - 1200000),
    originalLanguage: 'en',
    isVoiceNote: true
  },
  {
    id: '8',
    sender: generateMaskedId('prime_user', 'user-prm-007', 'SG'),
    content: 'Thanks for the heads up!',
    translatedContent: 'सूचना के लिए धन्यवाद!',
    timestamp: new Date(Date.now() - 600000),
    originalLanguage: 'en'
  },
  {
    id: '9',
    sender: generateMaskedId('user', 'user-common-008', 'AU'),
    content: 'When will the new features be available?',
    translatedContent: 'नई सुविधाएं कब उपलब्ध होंगी?',
    timestamp: new Date(Date.now() - 300000),
    originalLanguage: 'en'
  },
];

const MaskedInternalChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser] = useState<MaskedUser>(generateMaskedId('developer', 'current-user-session', 'IN'));
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: currentUser,
      content: newMessage,
      translatedContent: autoTranslate ? translateMessage(newMessage, 'en') : undefined,
      timestamp: new Date(),
      isOwn: true,
      originalLanguage: 'en'
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: generateMaskedId('ai_bot', 'ai-assistant-001', 'IN'),
        content: 'I understand your query. Let me process that for you.',
        translatedContent: 'मैं आपकी क्वेरी समझता हूं। मुझे इसे आपके लिए प्रोसेस करने दें।',
        timestamp: new Date(),
        originalLanguage: 'en'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const handleVoiceNote = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      // Simulate sending voice note
      const voiceMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: currentUser,
        content: '[Voice Note] Auto-transcribed: "Please check the latest reports"',
        translatedContent: '[वॉइस नोट] ऑटो-ट्रांसक्राइब्ड: "कृपया नवीनतम रिपोर्ट देखें"',
        timestamp: new Date(),
        isOwn: true,
        isVoiceNote: true,
        originalLanguage: 'en'
      };
      setMessages([...messages, voiceMessage]);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Card className="bg-slate-900/80 border-slate-800 p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Internal Masked Chat</h1>
                  <p className="text-xs text-muted-foreground">No real names • Auto-translate • Voice notes</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <Languages className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-muted-foreground">Auto-Translate</span>
                  <Switch 
                    checked={autoTranslate} 
                    onCheckedChange={setAutoTranslate}
                    className="scale-75"
                  />
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                  <Globe className="w-3 h-3 mr-1" />
                  Secure
                </Badge>
                <Badge variant="outline" className={currentUser.color}>
                  <span className="mr-1">{currentUser.countryFlag}</span>
                  <span className="font-mono">{currentUser.maskedId}</span>
                </Badge>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2 text-xs text-amber-400 flex items-center gap-2">
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span>Screenshots disabled • Voice notes live translated • All activity logged</span>
          </div>
        </motion.div>

        {/* Chat Area */}
        <Card className="bg-slate-900/80 border-slate-800 overflow-hidden">
          <ScrollArea className="h-[500px] p-4" ref={scrollRef}>
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`mb-4 flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.isOwn ? 'order-2' : ''}`}>
                    {/* Sender Info */}
                    <div className={`flex items-center gap-2 mb-1 ${message.isOwn ? 'justify-end' : ''}`}>
                      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${message.sender.color}`}>
                        <span className="text-base">{message.sender.countryFlag}</span>
                        {message.sender.icon}
                        <span className="font-mono font-medium">{message.sender.maskedId}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.isVoiceNote && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0 bg-purple-500/10 text-purple-400 border-purple-500/30">
                          <Volume2 className="w-2.5 h-2.5 mr-0.5" />
                          Voice
                        </Badge>
                      )}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`rounded-2xl px-4 py-2.5 ${
                      message.isOwn 
                        ? 'bg-primary text-primary-foreground rounded-br-sm' 
                        : 'bg-slate-800 text-foreground rounded-bl-sm'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      {showTranslation && message.translatedContent && (
                        <p className="text-xs mt-1.5 pt-1.5 border-t border-white/10 text-muted-foreground italic">
                          {message.translatedContent}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-slate-800 p-4 bg-slate-900/50">
            <div className="flex items-center gap-3">
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                onClick={handleVoiceNote}
                className="shrink-0"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a secure message..."
                className="flex-1 bg-slate-800 border-slate-700 focus:border-primary"
              />
              <Button 
                onClick={handleSend}
                disabled={!newMessage.trim()}
                size="icon"
                className="shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[10px] text-muted-foreground">
                You appear as <span className="font-mono text-primary">{currentUser.countryFlag} {currentUser.maskedId}</span>
              </p>
              <button 
                onClick={() => setShowTranslation(!showTranslation)}
                className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Languages className="w-3 h-3" />
                {showTranslation ? 'Hide' : 'Show'} translations
              </button>
            </div>
          </div>
        </Card>

        {/* Role Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <Card className="bg-slate-900/60 border-slate-800 p-4">
            <p className="text-xs text-muted-foreground mb-3 font-medium">Identity Masking Legend</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { ...generateMaskedId('super_admin', 'legend-1', 'IN'), label: '2-digit' },
                { ...generateMaskedId('admin', 'legend-2', 'US'), label: '2-digit' },
                { ...generateMaskedId('ai_bot', 'legend-ai', 'IN'), label: '3-digit (AI)' },
                { ...generateMaskedId('developer', 'legend-3', 'DE'), label: '3-digit' },
                { ...generateMaskedId('franchise', 'legend-4', 'KE'), label: '4-digit' },
                { ...generateMaskedId('reseller', 'legend-5', 'AE'), label: '5-digit' },
                { ...generateMaskedId('prime_user', 'legend-7', 'SG'), label: '7-digit' },
                { ...generateMaskedId('user', 'legend-8', 'AU'), label: '8-digit' },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded ${item.color}`}>
                  <span>{item.countryFlag}</span>
                  {item.icon}
                  <span className="font-medium">{item.role}</span>
                  <span className="text-muted-foreground">({item.label})</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MaskedInternalChat;
