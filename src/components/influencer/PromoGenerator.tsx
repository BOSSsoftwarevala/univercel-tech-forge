import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, Sparkles, Download, Share2, Image, 
  Type, Wand2, RefreshCw, Check, Layout
} from 'lucide-react';
import { toast } from 'sonner';

const templates = [
  { id: 1, name: 'Modern Gradient', style: 'gradient' },
  { id: 2, name: 'Minimal Clean', style: 'minimal' },
  { id: 3, name: 'Bold Neon', style: 'neon' },
  { id: 4, name: 'Professional', style: 'professional' },
];

const sizes = [
  { id: 'instagram', name: 'Instagram Post', dimensions: '1080x1080' },
  { id: 'story', name: 'Story/Reel', dimensions: '1080x1920' },
  { id: 'facebook', name: 'Facebook Post', dimensions: '1200x630' },
  { id: 'twitter', name: 'Twitter Post', dimensions: '1200x675' },
];

const PromoGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [selectedSize, setSelectedSize] = useState('instagram');
  const [headline, setHeadline] = useState('Transform Your Business');
  const [subheadline, setSubheadline] = useState('With AI-Powered Software');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Poster & Promo Generator
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-gradient-to-r from-violet-500 to-cyan-500 text-white">
              AI
            </span>
          </h2>
          <p className="text-slate-400 mt-1">Create stunning promotional materials with AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          {/* Template Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Layout className="w-5 h-5 text-violet-400" />
              Choose Template
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template) => (
                <motion.button
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 rounded-xl border transition-all ${
                    selectedTemplate === template.id
                      ? 'bg-violet-500/20 border-violet-500/50'
                      : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50'
                  }`}
                >
                  <div className={`w-full h-16 rounded-lg mb-2 ${
                    template.style === 'gradient' ? 'bg-gradient-to-r from-violet-500 to-cyan-500' :
                    template.style === 'minimal' ? 'bg-slate-700' :
                    template.style === 'neon' ? 'bg-slate-900 border border-cyan-400' :
                    'bg-gradient-to-r from-slate-700 to-slate-600'
                  }`} />
                  <p className="text-sm text-slate-300">{template.name}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Size Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-cyan-400" />
              Select Size
            </h3>
            <div className="space-y-2">
              {sizes.map((size) => (
                <motion.button
                  key={size.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedSize(size.id)}
                  className={`w-full p-3 rounded-lg border flex items-center justify-between transition-all ${
                    selectedSize === size.id
                      ? 'bg-cyan-500/20 border-cyan-500/50'
                      : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50'
                  }`}
                >
                  <span className="text-slate-300">{size.name}</span>
                  <span className="text-xs text-slate-500">{size.dimensions}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Type className="w-5 h-5 text-emerald-400" />
              Content
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Subheadline</label>
                <input
                  type="text"
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const suggestions = [
                    { headline: "Grow Your Business 10X", sub: "With Smart AI Solutions" },
                    { headline: "Digital Transformation Made Easy", sub: "Start Your Journey Today" },
                    { headline: "Automate Everything", sub: "Save Time, Increase Profits" },
                  ];
                  const random = suggestions[Math.floor(Math.random() * suggestions.length)];
                  setHeadline(random.headline);
                  setSubheadline(random.sub);
                  toast.success("AI generated new copy!");
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-violet-400 hover:border-violet-500/30 transition-all"
              >
                <Wand2 className="w-4 h-4" />
                AI Suggest Copy
              </motion.button>
            </div>
          </motion.div>

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-medium shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-5 h-5" />
                </motion.div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Promo
              </>
            )}
          </motion.button>
        </div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-violet-400" />
            Preview
          </h3>
          
          {/* Preview Canvas */}
          <div className="aspect-square rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-500/30 border border-slate-700/50 flex items-center justify-center relative overflow-hidden">
            {generated ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-4 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-600 flex flex-col items-center justify-center p-8"
              >
                <div className="text-center">
                  <h4 className="text-3xl font-bold text-white mb-2">{headline}</h4>
                  <p className="text-lg text-white/80">{subheadline}</p>
                  <div className="mt-6 px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm">
                    softwarevala.com
                  </div>
                </div>
                <div className="absolute top-4 left-4 w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center font-bold text-white">
                  SV
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-slate-500">
                <Palette className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Your design will appear here</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {generated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-3 mt-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toast.success("Design downloaded successfully!")}
                className="flex items-center justify-center gap-2 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-violet-500/30 transition-all"
              >
                <Download className="w-4 h-4" />
                Download
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  navigator.clipboard.writeText(`https://sv.link/promo/${Date.now().toString(36)}`);
                  toast.success("Share link copied!");
                }}
                className="flex items-center justify-center gap-2 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-cyan-500/30 transition-all"
              >
                <Share2 className="w-4 h-4" />
                Share
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                className="flex items-center justify-center gap-2 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-emerald-500/30 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Recent Designs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Recent Designs</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="aspect-square rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-slate-700/30 cursor-pointer"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PromoGenerator;
