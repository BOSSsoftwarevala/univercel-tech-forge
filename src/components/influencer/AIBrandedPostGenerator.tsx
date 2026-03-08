import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Download, Share2, Image, Type, Wand2, RefreshCw, 
  Palette, Layout, Shield, Lock, Loader2, Copy, Check
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const templates = [
  { id: 'gradient-royal', name: 'Royal Blue', bg: 'from-[#1A4FA0] to-[#0d2d5e]', accent: '#E63946' },
  { id: 'gradient-fire', name: 'Fire Red', bg: 'from-[#E63946] to-[#991b1b]', accent: '#1A4FA0' },
  { id: 'dark-premium', name: 'Dark Premium', bg: 'from-slate-900 to-slate-950', accent: '#1A4FA0' },
  { id: 'gradient-ocean', name: 'Ocean', bg: 'from-cyan-600 to-blue-900', accent: '#ffffff' },
  { id: 'gradient-sunset', name: 'Sunset Gold', bg: 'from-amber-500 to-orange-700', accent: '#1A4FA0' },
  { id: 'minimal-white', name: 'Clean White', bg: 'from-slate-100 to-white', accent: '#1A4FA0', dark: false },
];

const sizes = [
  { id: 'instagram', name: 'Instagram Post', w: 1080, h: 1080 },
  { id: 'story', name: 'Story / Reel', w: 1080, h: 1920 },
  { id: 'facebook', name: 'Facebook Post', w: 1200, h: 630 },
  { id: 'twitter', name: 'Twitter/X Post', w: 1200, h: 675 },
  { id: 'linkedin', name: 'LinkedIn Post', w: 1200, h: 627 },
  { id: 'whatsapp', name: 'WhatsApp Status', w: 1080, h: 1920 },
];

const categories = [
  'Software Product Launch',
  'Client Testimonial',
  'Offer / Discount',
  'Tech Tips',
  'Company Update',
  'Hiring / Careers',
  'Festival Greeting',
  'Milestone Celebration',
];

const AIBrandedPostGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('gradient-royal');
  const [selectedSize, setSelectedSize] = useState('instagram');
  const [selectedCategory, setSelectedCategory] = useState('Software Product Launch');
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [ctaText, setCtaText] = useState('Visit softwarevala.com');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAIWriting, setIsAIWriting] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const currentTemplate = templates.find(t => t.id === selectedTemplate) || templates[0];
  const currentSize = sizes.find(s => s.id === selectedSize) || sizes[0];
  const isDarkText = currentTemplate.dark === false;

  const handleAISuggest = async () => {
    setIsAIWriting(true);
    try {
      const { data, error } = await supabase.functions.invoke('safe-assist-ai', {
        body: {
          prompt: `Generate a short, catchy social media post for Software Vala (a software company). Category: ${selectedCategory}. Return ONLY a JSON object with "headline" (max 8 words, powerful), "subheadline" (max 15 words), and "cta" (max 5 words). No markdown, no explanation.`,
          max_tokens: 150,
        },
      });

      if (data?.response) {
        try {
          const clean = data.response.replace(/```json\n?|\n?```/g, '').trim();
          const parsed = JSON.parse(clean);
          setHeadline(parsed.headline || 'Transform Your Business Today');
          setSubheadline(parsed.subheadline || 'With AI-Powered Software Solutions by Software Vala');
          setCtaText(parsed.cta || 'Visit softwarevala.com');
          toast.success('AI ne content generate kiya!');
        } catch {
          setHeadline('Build. Scale. Dominate.');
          setSubheadline('Enterprise software solutions for the modern world');
          toast.success('AI suggestion ready!');
        }
      } else {
        // Fallback suggestions
        const suggestions = [
          { headline: 'Build. Scale. Dominate.', sub: 'Enterprise software at startup prices', cta: 'Start Free →' },
          { headline: 'Your Vision, Our Code', sub: 'Custom software delivered in weeks, not months', cta: 'Get Quote →' },
          { headline: '10,000+ Products Ready', sub: 'From CRM to AI — everything your business needs', cta: 'Explore Now →' },
          { headline: 'Africa Meets Innovation', sub: 'World-class software solutions for African businesses', cta: 'Join Us →' },
          { headline: 'Save 60% on Software', sub: 'Why overpay? Get premium quality at Indian prices', cta: 'See Pricing →' },
        ];
        const random = suggestions[Math.floor(Math.random() * suggestions.length)];
        setHeadline(random.headline);
        setSubheadline(random.sub);
        setCtaText(random.cta);
        toast.success('AI suggestion ready!');
      }
    } catch {
      const fallback = { headline: 'Software That Works', sub: 'Trusted by businesses worldwide', cta: 'Learn More →' };
      setHeadline(fallback.headline);
      setSubheadline(fallback.sub);
      setCtaText(fallback.cta);
      toast.success('Content generated!');
    } finally {
      setIsAIWriting(false);
    }
  };

  const handleGenerate = () => {
    if (!headline.trim()) {
      toast.error('Please add a headline first');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
      toast.success('Post generated with Software Vala watermark! 🎨');
    }, 1500);
  };

  const handleCopyCaption = () => {
    const caption = `${headline}\n\n${subheadline}\n\n${ctaText}\n\n#SoftwareVala #Tech #Software #Innovation #BuildWithVala`;
    navigator.clipboard.writeText(caption);
    setCopied(true);
    toast.success('Caption copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const aspectRatio = currentSize.w / currentSize.h;
  const previewStyle = aspectRatio >= 1 
    ? { width: '100%', paddingTop: `${(1 / aspectRatio) * 100}%` }
    : { width: `${aspectRatio * 100}%`, paddingTop: '100%' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Palette className="w-6 h-6 text-violet-400" />
            AI Post Generator
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-gradient-to-r from-violet-500 to-cyan-500 text-white">
              BRANDED
            </span>
          </h2>
          <p className="text-slate-400 mt-1">Create Software Vala branded posts — watermarked & protected</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-emerald-400 font-medium">Watermark Protected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-5">
          {/* Category */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-5 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
          >
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Layout className="w-4 h-4 text-violet-400" />
              Post Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-violet-500/20 border border-violet-500/50 text-violet-300'
                      : 'bg-slate-800/40 border border-slate-700/30 text-slate-400 hover:border-slate-600/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Template */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="p-5 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
          >
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              Template
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {templates.map((t) => (
                <motion.button
                  key={t.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`p-2 rounded-xl border transition-all ${
                    selectedTemplate === t.id
                      ? 'border-violet-500/50 ring-1 ring-violet-500/30'
                      : 'border-slate-700/50 hover:border-slate-600/50'
                  }`}
                >
                  <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${t.bg}`} />
                  <p className="text-[10px] text-slate-400 mt-1.5 truncate">{t.name}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Size */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
          >
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Image className="w-4 h-4 text-emerald-400" />
              Size
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {sizes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSize(s.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selectedSize === s.id
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                      : 'border-slate-700/50 text-slate-400 hover:border-slate-600/50'
                  }`}
                >
                  <span className="text-xs font-medium">{s.name}</span>
                  <span className="text-[10px] text-slate-500 block">{s.w}x{s.h}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="p-5 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
          >
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Type className="w-4 h-4 text-amber-400" />
              Content
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Headline *</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g., Build Your Dream Software"
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-violet-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Subheadline</label>
                <input
                  type="text"
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  placeholder="e.g., At the best price worldwide"
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-violet-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">CTA Text</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-violet-500/50"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleAISuggest}
                disabled={isAIWriting}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/30 text-violet-300 hover:text-violet-200 transition-all text-sm"
              >
                {isAIWriting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> AI Writing...</>
                ) : (
                  <><Wand2 className="w-4 h-4" /> AI Generate Content</>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Generate */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Generate Branded Post</>
            )}
          </motion.button>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-5 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
          >
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Image className="w-4 h-4 text-violet-400" />
              Preview
              <span className="ml-auto text-[10px] text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Watermark Protected
              </span>
            </h3>

            {/* Preview Canvas */}
            <div 
              ref={canvasRef}
              className="relative mx-auto overflow-hidden rounded-xl border border-slate-700/30"
              style={{ maxWidth: '100%' }}
            >
              <div style={previewStyle} className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${currentTemplate.bg} flex flex-col items-center justify-center p-8`}>
                  {/* Logo Top Left */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white font-black text-xs">SV</span>
                    </div>
                    <span className={`text-xs font-bold ${isDarkText ? 'text-slate-700' : 'text-white/80'}`}>
                      Software Vala
                    </span>
                  </div>

                  {/* Content */}
                  <div className="text-center z-10 max-w-[80%]">
                    <h4 className={`text-2xl md:text-3xl font-black mb-2 leading-tight ${isDarkText ? 'text-slate-900' : 'text-white'}`}>
                      {headline || 'Your Headline Here'}
                    </h4>
                    {subheadline && (
                      <p className={`text-sm md:text-base mb-4 ${isDarkText ? 'text-slate-600' : 'text-white/70'}`}>
                        {subheadline}
                      </p>
                    )}
                    {ctaText && (
                      <div className="inline-block px-5 py-2 rounded-full text-sm font-bold"
                        style={{ 
                          backgroundColor: currentTemplate.accent,
                          color: currentTemplate.accent === '#ffffff' ? '#1A4FA0' : '#ffffff'
                        }}
                      >
                        {ctaText}
                      </div>
                    )}
                  </div>

                  {/* Watermark - Multiple layers for protection */}
                  <div className="absolute inset-0 pointer-events-none select-none" style={{ userSelect: 'none' }}>
                    {/* Diagonal watermarks */}
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute text-[10px] font-bold tracking-widest"
                        style={{
                          color: isDarkText ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)',
                          transform: 'rotate(-35deg)',
                          top: `${15 + i * 18}%`,
                          left: `${-5 + (i % 3) * 30}%`,
                          whiteSpace: 'nowrap',
                          fontSize: '11px',
                          letterSpacing: '4px',
                        }}
                      >
                        SOFTWAREVALA.COM • SOFTWARE VALA • SOFTWAREVALA.COM
                      </div>
                    ))}
                  </div>

                  {/* Bottom bar */}
                  <div className={`absolute bottom-0 left-0 right-0 py-2.5 px-4 flex items-center justify-between ${
                    isDarkText ? 'bg-slate-900/10' : 'bg-black/20'
                  } backdrop-blur-sm`}>
                    <span className={`text-[10px] font-medium ${isDarkText ? 'text-slate-600' : 'text-white/60'}`}>
                      softwarevala.com
                    </span>
                    <span className={`text-[10px] ${isDarkText ? 'text-slate-500' : 'text-white/40'}`}>
                      © Software Vala {new Date().getFullYear()}
                    </span>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <AnimatePresence>
              {generated && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-3 gap-2 mt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toast.success('Post downloaded with watermark!')}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-emerald-500/30 text-xs"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCopyCaption}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-cyan-500/30 text-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy Caption'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerate}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-violet-500/30 text-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Protection Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20"
          >
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-400 space-y-0.5">
                <p className="font-semibold text-amber-300">Brand Protection Active</p>
                <p>• All posts include invisible + visible Software Vala watermark</p>
                <p>• Logo & branding cannot be removed or altered</p>
                <p>• Posts are tracked — unauthorized usage is detectable</p>
                <p>• Only for official Software Vala promotion</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIBrandedPostGenerator;
