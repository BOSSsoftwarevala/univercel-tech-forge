import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Plus, Settings2, Eye, Send, Paperclip, Search,
  ChevronDown, Image, Upload, Link2, ToggleLeft, ToggleRight,
  Layers, Tag, Globe, ShoppingCart, CheckCircle, AlertCircle,
  Sparkles, Code2, Zap, ArrowRight, MoreHorizontal, X,
  Edit3, Trash2, Copy, ExternalLink, BarChart3, Star,
  Filter, SortAsc, Grid3X3, List, Clock, TrendingUp
} from 'lucide-react';

// ─── DESIGN TOKENS (7D Premium — No Blur) ────────────────────
const C = {
  // Backgrounds
  pageBg: 'hsl(222, 47%, 6%)',
  panelBg: 'hsl(222, 44%, 9%)',
  cardBg: 'hsl(222, 42%, 12%)',
  cardBgHover: 'hsl(222, 42%, 14%)',
  surfaceRaised: 'hsl(222, 40%, 15%)',
  // Borders
  border: 'hsl(222, 30%, 20%)',
  borderLight: 'hsl(222, 25%, 25%)',
  borderActive: 'hsl(152, 68%, 45%)',
  // Text
  text: 'hsl(210, 40%, 98%)',
  textSecondary: 'hsl(215, 22%, 68%)',
  textMuted: 'hsl(215, 15%, 48%)',
  textDim: 'hsl(215, 12%, 38%)',
  // Brand — Software Vala unique palette (Emerald + Gold)
  primary: 'hsl(152, 68%, 45%)',       // Emerald
  primaryDark: 'hsl(152, 68%, 35%)',
  primaryLight: 'hsl(152, 68%, 55%)',
  secondary: 'hsl(42, 88%, 55%)',      // Gold
  secondaryDark: 'hsl(42, 78%, 45%)',
  accent: 'hsl(262, 83%, 63%)',        // Violet
  accentDark: 'hsl(262, 70%, 50%)',
  // Status
  success: 'hsl(152, 68%, 45%)',
  warning: 'hsl(42, 88%, 55%)',
  error: 'hsl(0, 72%, 55%)',
  info: 'hsl(217, 85%, 60%)',
  // Specific
  tabActive: 'hsl(152, 68%, 45%)',
  chatBubbleBg: 'hsl(222, 40%, 14%)',
  chatBubbleAI: 'hsl(152, 40%, 12%)',
  inputBg: 'hsl(222, 42%, 11%)',
};

// ─── ANIMATION VARIANTS ──────────────────────────────────────
const pageIn = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemIn = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 320, damping: 26 } } };
const slideLeft = { hidden: { x: -20, opacity: 0 }, show: { x: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } } };
const slideRight = { hidden: { x: 20, opacity: 0 }, show: { x: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } } };
const scaleIn = { hidden: { scale: 0.96, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { type: 'spring' as const, stiffness: 350, damping: 28 } } };

// ─── MOCK DATA ───────────────────────────────────────────────
const CATEGORIES = [
  'SaaS', 'E-Commerce', 'FinTech', 'HealthTech', 'EdTech', 'AI/ML',
  'CRM', 'ERP', 'HRM', 'Marketing', 'Analytics', 'Security',
  'IoT', 'Blockchain', 'Gaming', 'Social Media', 'Real Estate',
  'Travel', 'Food & Bev', 'Logistics',
];

const EXISTING_PRODUCTS = [
  { id: 1, name: 'CloudVault Pro', category: 'SaaS', status: 'active', price: '$299/mo', rating: 4.8, downloads: '12.4K', demo: 'linked' },
  { id: 2, name: 'PayFlow Engine', category: 'FinTech', status: 'active', price: '$499/mo', rating: 4.6, downloads: '8.2K', demo: 'linked' },
  { id: 3, name: 'MediTrack AI', category: 'HealthTech', status: 'draft', price: '$199/mo', rating: 0, downloads: '0', demo: 'none' },
  { id: 4, name: 'LearnSphere', category: 'EdTech', status: 'active', price: '$149/mo', rating: 4.9, downloads: '22.1K', demo: 'broken' },
  { id: 5, name: 'RetailPulse', category: 'E-Commerce', status: 'review', price: '$349/mo', rating: 4.3, downloads: '5.7K', demo: 'linked' },
  { id: 6, name: 'DataForge Analytics', category: 'Analytics', status: 'active', price: '$599/mo', rating: 4.7, downloads: '15.3K', demo: 'linked' },
];

type Tab = 'create' | 'configure';
type ViewMode = 'grid' | 'list';

// ─── MAIN MODULE ─────────────────────────────────────────────
export function ProductManagerModule() {
  const [activeTab, setActiveTab] = useState<Tab>('create');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    { role: 'ai', text: "Welcome to Product Builder! I'll help you create and configure products for the Software Vala marketplace.\n\nYou can say things like:\n• \"Create a CRM product for small businesses\"\n• \"Add a FinTech payment gateway\"\n• \"Build an AI analytics dashboard\"\n\nWhat would you like to build?" },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Configure tab state
  const [configForm, setConfigForm] = useState({
    name: '', description: '', category: '', subcategory: '',
    price: '', visibility: 'public', demoLinked: false,
    features: [] as string[], tags: [] as string[],
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const lowerMsg = userMsg.toLowerCase();
      let aiResponse = '';
      let newPreview: any = null;

      if (lowerMsg.includes('crm') || lowerMsg.includes('customer')) {
        aiResponse = "I'll create a **CRM Product** for you. Here's what I've set up:\n\n✅ **Name:** SmartCRM Pro\n✅ **Category:** CRM\n✅ **Price:** $249/mo\n✅ **Features:** Contact Management, Pipeline Tracking, Email Automation, Analytics Dashboard\n\nYou can see the preview on the right. Want me to adjust anything?";
        newPreview = { name: 'SmartCRM Pro', category: 'CRM', price: '$249/mo', status: 'draft', features: ['Contact Management', 'Pipeline Tracking', 'Email Automation', 'Analytics Dashboard'] };
      } else if (lowerMsg.includes('fintech') || lowerMsg.includes('payment')) {
        aiResponse = "Building a **FinTech Product** for you:\n\n✅ **Name:** PayStream Gateway\n✅ **Category:** FinTech\n✅ **Price:** $399/mo\n✅ **Features:** Multi-Currency, Real-time Processing, Fraud Detection, API Integration\n\nPreview is ready! Shall I modify any details?";
        newPreview = { name: 'PayStream Gateway', category: 'FinTech', price: '$399/mo', status: 'draft', features: ['Multi-Currency', 'Real-time Processing', 'Fraud Detection', 'API Integration'] };
      } else if (lowerMsg.includes('ai') || lowerMsg.includes('analytics')) {
        aiResponse = "Creating an **AI Analytics Product**:\n\n✅ **Name:** InsightAI Engine\n✅ **Category:** AI/ML\n✅ **Price:** $699/mo\n✅ **Features:** Predictive Analytics, Natural Language Queries, Custom Dashboards, Data Pipeline\n\nCheck the preview panel. Want to configure more?";
        newPreview = { name: 'InsightAI Engine', category: 'AI/ML', price: '$699/mo', status: 'draft', features: ['Predictive Analytics', 'Natural Language Queries', 'Custom Dashboards', 'Data Pipeline'] };
      } else {
        aiResponse = `I understand you want to create something related to "${userMsg}". Let me help you define it better.\n\nPlease specify:\n1. **Product name** — What should we call it?\n2. **Category** — Which business domain?\n3. **Key features** — What should it do?\n\nOr just describe your idea and I'll suggest a configuration!`;
      }

      if (newPreview) setPreviewProduct(newPreview);
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  const filteredProducts = EXISTING_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return { bg: `${C.success}18`, color: C.success, label: 'Active' };
      case 'draft': return { bg: `${C.textMuted}18`, color: C.textMuted, label: 'Draft' };
      case 'review': return { bg: `${C.warning}18`, color: C.warning, label: 'In Review' };
      default: return { bg: `${C.textMuted}18`, color: C.textMuted, label: status };
    }
  };

  const getDemoStyle = (demo: string) => {
    switch (demo) {
      case 'linked': return { color: C.success, label: 'Demo Linked' };
      case 'broken': return { color: C.error, label: 'Demo Broken' };
      default: return { color: C.textMuted, label: 'No Demo' };
    }
  };

  return (
    <motion.div variants={pageIn} initial="hidden" animate="show" className="h-full" style={{ color: C.text }}>
      {/* ─── TOP BAR ─── */}
      <motion.div variants={itemIn} className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.accent})` }}>
            <Package className="w-5 h-5" style={{ color: C.text }} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{ color: C.text }}>Product Manager</h1>
            <p className="text-[11px] font-medium" style={{ color: C.textSecondary }}>
              Build, configure & manage products • {EXISTING_PRODUCTS.length} Products
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, color: C.pageBg }}>
            <Plus className="w-3.5 h-3.5" />
            New Product
          </motion.button>
        </div>
      </motion.div>

      {/* ─── MAIN SPLIT PANEL (OpenAI Builder Pattern) ─── */}
      <motion.div variants={itemIn} className="flex gap-4" style={{ height: 'calc(100vh - 180px)' }}>

        {/* ════════════ LEFT PANEL — Create / Configure ════════════ */}
        <motion.div variants={slideLeft} className="flex flex-col rounded-2xl overflow-hidden"
          style={{ width: '50%', background: C.panelBg, border: `1px solid ${C.border}` }}>

          {/* Tab Switcher */}
          <div className="flex border-b" style={{ borderColor: C.border }}>
            {(['create', 'configure'] as Tab[]).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="relative flex-1 py-3.5 text-sm font-semibold capitalize transition-colors"
                style={{ color: activeTab === tab ? C.primary : C.textMuted }}>
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-[2px]"
                    style={{ background: C.primary }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'create' ? (
                <CreateTab key="create" messages={messages} isTyping={isTyping}
                  inputValue={inputValue} setInputValue={setInputValue}
                  handleSend={handleSend} chatEndRef={chatEndRef} />
              ) : (
                <ConfigureTab key="configure" form={configForm} setForm={setConfigForm} />
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ════════════ RIGHT PANEL — Preview ════════════ */}
        <motion.div variants={slideRight} className="flex flex-col rounded-2xl overflow-hidden"
          style={{ width: '50%', background: C.panelBg, border: `1px solid ${C.border}` }}>

          {/* Preview Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b"
            style={{ borderColor: C.border }}>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" style={{ color: C.primary }} />
              <span className="text-sm font-semibold" style={{ color: C.text }}>Preview</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                <button onClick={() => setViewMode('grid')}
                  className="p-1.5 transition-colors"
                  style={{ background: viewMode === 'grid' ? C.cardBg : 'transparent', color: viewMode === 'grid' ? C.primary : C.textMuted }}>
                  <Grid3X3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setViewMode('list')}
                  className="p-1.5 transition-colors"
                  style={{ background: viewMode === 'list' ? C.cardBg : 'transparent', color: viewMode === 'list' ? C.primary : C.textMuted }}>
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: C.textMuted }} />
                <input type="text" placeholder="Search products..."
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none w-40 transition-all focus:w-52"
                  style={{ background: C.inputBg, border: `1px solid ${C.border}`, color: C.text }} />
              </div>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'thin' }}>
            {/* New Product Preview Card */}
            <AnimatePresence>
              {previewProduct && (
                <motion.div initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="mb-4 rounded-xl p-4 relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${C.primary}12, ${C.accent}08)`, border: `1px solid ${C.primary}30` }}>
                  <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-lg text-[9px] font-bold uppercase tracking-wider"
                    style={{ background: C.primary, color: C.pageBg }}>
                    <Sparkles className="w-3 h-3 inline mr-1" />New
                  </div>
                  <div className="flex items-start gap-3 mt-2">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${C.primary}25, ${C.accent}20)`, border: `1px solid ${C.primary}30` }}>
                      <Package className="w-6 h-6" style={{ color: C.primary }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold" style={{ color: C.text }}>{previewProduct.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: `${C.accent}18`, color: C.accent }}>{previewProduct.category}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: `${C.textMuted}18`, color: C.textMuted }}>Draft</span>
                      </div>
                      <p className="text-lg font-black mt-2" style={{ color: C.secondary }}>{previewProduct.price}</p>
                      {previewProduct.features && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {previewProduct.features.map((f: string, i: number) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                              style={{ background: C.cardBg, color: C.textSecondary, border: `1px solid ${C.border}` }}>
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                      style={{ background: C.primary, color: C.pageBg }}>
                      Publish Product
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
                      style={{ background: C.cardBg, color: C.textSecondary, border: `1px solid ${C.border}` }}>
                      Edit
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Existing Products */}
            {viewMode === 'grid' ? (
              <motion.div className="grid grid-cols-2 gap-3" variants={pageIn} initial="hidden" animate="show">
                {filteredProducts.map((product) => {
                  const st = getStatusStyle(product.status);
                  const dm = getDemoStyle(product.demo);
                  return (
                    <motion.div key={product.id} variants={itemIn}
                      whileHover={{ y: -3, boxShadow: `0 12px 40px -12px ${C.primary}20` }}
                      className="rounded-xl p-4 cursor-pointer transition-all group"
                      style={{ background: C.cardBg, border: `1px solid ${C.border}` }}
                      onClick={() => setSelectedProduct(product)}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${C.primary}15, ${C.accent}10)` }}>
                          <Package className="w-4 h-4" style={{ color: C.primary }} />
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md"
                          style={{ color: C.textMuted }}>
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      <h4 className="text-sm font-bold mb-1" style={{ color: C.text }}>{product.name}</h4>
                      <p className="text-[10px] font-medium mb-2.5" style={{ color: C.textMuted }}>{product.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold" style={{ color: C.secondary }}>{product.price}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1"
                          style={{ background: st.bg, color: st.color }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.color }} />
                          {st.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2.5 pt-2.5" style={{ borderTop: `1px solid ${C.border}` }}>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" style={{ color: C.secondary }} />
                          <span className="text-[10px] font-bold" style={{ color: C.textSecondary }}>{product.rating || '—'}</span>
                        </div>
                        <span className="text-[10px]" style={{ color: C.textMuted }}>{product.downloads} downloads</span>
                        <span className="text-[10px] font-medium" style={{ color: dm.color }}>{dm.label}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div className="space-y-2" variants={pageIn} initial="hidden" animate="show">
                {filteredProducts.map((product) => {
                  const st = getStatusStyle(product.status);
                  const dm = getDemoStyle(product.demo);
                  return (
                    <motion.div key={product.id} variants={itemIn}
                      whileHover={{ x: 3, backgroundColor: C.cardBgHover }}
                      className="flex items-center gap-4 rounded-xl px-4 py-3 cursor-pointer transition-all"
                      style={{ background: C.cardBg, border: `1px solid ${C.border}` }}
                      onClick={() => setSelectedProduct(product)}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${C.primary}12` }}>
                        <Package className="w-4 h-4" style={{ color: C.primary }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold" style={{ color: C.text }}>{product.name}</h4>
                        <p className="text-[10px]" style={{ color: C.textMuted }}>{product.category}</p>
                      </div>
                      <span className="text-xs font-bold" style={{ color: C.secondary }}>{product.price}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1"
                        style={{ background: st.bg, color: st.color }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.color }} />
                        {st.label}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" style={{ color: C.secondary }} />
                        <span className="text-[10px] font-bold" style={{ color: C.textSecondary }}>{product.rating || '—'}</span>
                      </div>
                      <span className="text-[10px]" style={{ color: dm.color }}>{dm.label}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Preview Footer Stats */}
          <div className="flex items-center justify-between px-5 py-3 border-t"
            style={{ borderColor: C.border }}>
            <div className="flex items-center gap-4">
              {[
                { icon: Package, label: 'Total', value: EXISTING_PRODUCTS.length, color: C.primary },
                { icon: CheckCircle, label: 'Active', value: EXISTING_PRODUCTS.filter(p => p.status === 'active').length, color: C.success },
                { icon: Clock, label: 'Draft', value: EXISTING_PRODUCTS.filter(p => p.status === 'draft').length, color: C.textMuted },
                { icon: AlertCircle, label: 'Review', value: EXISTING_PRODUCTS.filter(p => p.status === 'review').length, color: C.warning },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <s.icon className="w-3 h-3" style={{ color: s.color }} />
                  <span className="text-[10px] font-bold tabular-nums" style={{ color: s.color }}>{s.value}</span>
                  <span className="text-[10px]" style={{ color: C.textDim }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── CREATE TAB (Chat Interface) ─────────────────────────────
function CreateTab({ messages, isTyping, inputValue, setInputValue, handleSend, chatEndRef }: {
  messages: Array<{ role: string; text: string }>;
  isTyping: boolean;
  inputValue: string;
  setInputValue: (v: string) => void;
  handleSend: () => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <motion.div key="create" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
      className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ scrollbarWidth: 'thin' }}>
        {messages.map((msg, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 25 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}
              style={{
                background: msg.role === 'user' ? C.primary : C.chatBubbleAI,
                color: msg.role === 'user' ? C.pageBg : C.text,
                border: msg.role === 'ai' ? `1px solid ${C.border}` : 'none',
              }}>
              {msg.role === 'ai' && (
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: C.primary }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.primary }}>Product Builder AI</span>
                </div>
              )}
              {msg.text.split('\n').map((line, li) => (
                <p key={li} className={li > 0 ? 'mt-1' : ''}>
                  {line.split('**').map((part, pi) =>
                    pi % 2 === 1 ? <strong key={pi} style={{ color: msg.role === 'user' ? C.pageBg : C.primary }}>{part}</strong> : part
                  )}
                </p>
              ))}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-bl-md w-fit"
            style={{ background: C.chatBubbleAI, border: `1px solid ${C.border}` }}>
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="w-2 h-2 rounded-full"
                  style={{ background: C.primary }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </div>
            <span className="text-[10px] font-medium" style={{ color: C.textMuted }}>Generating product...</span>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div className="px-4 py-3 border-t" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2 rounded-xl px-4 py-2.5"
          style={{ background: C.inputBg, border: `1px solid ${C.border}` }}>
          <button className="p-1 rounded-lg transition-colors" style={{ color: C.textMuted }}
            onMouseEnter={e => (e.currentTarget.style.color = C.primary)}
            onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}>
            <Paperclip className="w-4 h-4" />
          </button>
          <input type="text" value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Describe the product you want to build..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40"
            style={{ color: C.text }} />
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            onClick={handleSend}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: inputValue.trim() ? C.primary : `${C.textMuted}20`,
              color: inputValue.trim() ? C.pageBg : C.textMuted,
            }}>
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── CONFIGURE TAB ───────────────────────────────────────────
function ConfigureTab({ form, setForm }: {
  form: any;
  setForm: (f: any) => void;
}) {
  const updateField = (field: string, value: any) => setForm((prev: any) => ({ ...prev, [field]: value }));
  const [newTag, setNewTag] = useState('');

  const FormField = ({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) => (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: C.textSecondary }}>
        {label}
        {required && <span style={{ color: C.error }}>*</span>}
      </label>
      {children}
    </div>
  );

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '13px',
    background: C.inputBg, border: `1px solid ${C.border}`, color: C.text, outline: 'none',
  };

  return (
    <motion.div key="configure" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}
      className="flex-1 overflow-y-auto px-5 py-5 space-y-5" style={{ scrollbarWidth: 'thin' }}>

      {/* Product Info Section */}
      <div className="rounded-xl p-4" style={{ background: C.cardBg, border: `1px solid ${C.border}` }}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: C.textSecondary }}>
          <Edit3 className="w-3.5 h-3.5" style={{ color: C.primary }} />
          Product Information
        </h3>
        <div className="space-y-4">
          <FormField label="Product Name" required>
            <input style={inputStyle} value={form.name} onChange={e => updateField('name', e.target.value)}
              placeholder="e.g., SmartCRM Pro" />
          </FormField>
          <FormField label="Description">
            <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' as const }}
              value={form.description} onChange={e => updateField('description', e.target.value)}
              placeholder="Describe your product..." />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Category" required>
              <select style={inputStyle} value={form.category}
                onChange={e => updateField('category', e.target.value)}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Price">
              <input style={inputStyle} value={form.price} onChange={e => updateField('price', e.target.value)}
                placeholder="$0.00/mo" />
            </FormField>
          </div>
        </div>
      </div>

      {/* Visibility & Demo */}
      <div className="rounded-xl p-4" style={{ background: C.cardBg, border: `1px solid ${C.border}` }}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: C.textSecondary }}>
          <Globe className="w-3.5 h-3.5" style={{ color: C.primary }} />
          Visibility & Demo
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: C.text }}>Public Visibility</p>
              <p className="text-[10px]" style={{ color: C.textMuted }}>Make product visible in marketplace</p>
            </div>
            <button onClick={() => updateField('visibility', form.visibility === 'public' ? 'private' : 'public')}
              className="transition-all">
              {form.visibility === 'public'
                ? <ToggleRight className="w-8 h-8" style={{ color: C.primary }} />
                : <ToggleLeft className="w-8 h-8" style={{ color: C.textMuted }} />}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: C.text }}>Link Demo</p>
              <p className="text-[10px]" style={{ color: C.textMuted }}>Attach a live demo to this product</p>
            </div>
            <button onClick={() => updateField('demoLinked', !form.demoLinked)}
              className="transition-all">
              {form.demoLinked
                ? <ToggleRight className="w-8 h-8" style={{ color: C.primary }} />
                : <ToggleLeft className="w-8 h-8" style={{ color: C.textMuted }} />}
            </button>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="rounded-xl p-4" style={{ background: C.cardBg, border: `1px solid ${C.border}` }}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: C.textSecondary }}>
          <Tag className="w-3.5 h-3.5" style={{ color: C.primary }} />
          Tags & Keywords
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {form.tags.map((tag: string, i: number) => (
            <span key={i} className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg"
              style={{ background: `${C.primary}15`, color: C.primary, border: `1px solid ${C.primary}25` }}>
              {tag}
              <button onClick={() => updateField('tags', form.tags.filter((_: string, idx: number) => idx !== i))}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input style={{ ...inputStyle, flex: 1 }} value={newTag} onChange={e => setNewTag(e.target.value)}
            placeholder="Add tag..."
            onKeyDown={e => {
              if (e.key === 'Enter' && newTag.trim()) {
                updateField('tags', [...form.tags, newTag.trim()]);
                setNewTag('');
              }
            }} />
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { if (newTag.trim()) { updateField('tags', [...form.tags, newTag.trim()]); setNewTag(''); } }}
            className="px-4 rounded-lg text-xs font-bold"
            style={{ background: C.primary, color: C.pageBg }}>
            Add
          </motion.button>
        </div>
      </div>

      {/* Save Button */}
      <motion.button whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-xl text-sm font-bold transition-all"
        style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, color: C.pageBg,
          boxShadow: `0 4px 20px -4px ${C.primary}40` }}>
        Save Configuration
      </motion.button>
    </motion.div>
  );
}

export default ProductManagerModule;
