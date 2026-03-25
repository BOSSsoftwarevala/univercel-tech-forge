import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Link2, Copy, QrCode, Share2, Check, ExternalLink,
  Smartphone, Monitor, Globe, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const products = [
  { id: 1, name: 'POS System Pro', commission: '15%', price: '₹15,000' },
  { id: 2, name: 'School ERP Suite', commission: '12%', price: '₹25,000' },
  { id: 3, name: 'Hospital CRM', commission: '18%', price: '₹35,000' },
  { id: 4, name: 'Real Estate Manager', commission: '10%', price: '₹20,000' },
  { id: 5, name: 'HR & Payroll System', commission: '14%', price: '₹18,000' },
];

const LinkCreator = () => {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const generateLink = () => {
    if (selectedProduct) {
      const link = `https://softwarevala.com/ref/vala-inf-${selectedProduct}-${Date.now().toString(36)}`;
      setGeneratedLink(link);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Create Affiliate Link</h2>
          <p className="text-slate-400 mt-1">Generate trackable referral links for any product</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Select Product</h3>
          <div className="space-y-3">
            {products.map((product, index) => (
              <motion.button
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedProduct(product.id)}
                className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                  selectedProduct === product.id
                    ? 'bg-gradient-to-r from-violet-500/20 to-cyan-500/10 border-violet-500/50'
                    : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{product.name}</p>
                    <p className="text-sm text-slate-400 mt-1">Price: {product.price}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                      {product.commission} Commission
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateLink}
            disabled={!selectedProduct}
            className={`w-full mt-6 py-3 rounded-xl font-medium transition-all ${
              selectedProduct
                ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Generate Link
            </span>
          </motion.button>
        </motion.div>

        {/* Generated Link & Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Your Affiliate Link</h3>
          
          {generatedLink ? (
            <div className="space-y-6">
              {/* Link Display */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/30">
                <p className="text-sm text-slate-400 mb-2">Generated Link:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-cyan-400 break-all">{generatedLink}</code>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={copyLink}
                    className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowQR(!showQR)}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/30 transition-all text-slate-300"
                >
                  <QrCode className="w-5 h-5 text-violet-400" />
                  Show QR Code
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const shareUrl = `https://wa.me/?text=${encodeURIComponent('Check out this amazing software! ' + generatedLink)}`;
                    window.open(shareUrl, '_blank');
                  }}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all text-slate-300"
                >
                  <Share2 className="w-5 h-5 text-cyan-400" />
                  Share
                </motion.button>
              </div>

              {/* QR Code Display */}
              {showQR && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-center p-6 rounded-xl bg-white"
                >
                  <div className="w-40 h-40 bg-slate-900 rounded-lg flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-white" />
                  </div>
                </motion.div>
              )}

              {/* Preview Options */}
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <p className="text-sm text-slate-400 mb-3">Preview on:</p>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => toast.info("Desktop preview mode")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
                  >
                    <Monitor className="w-4 h-4" />
                    Desktop
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => toast.info("Mobile preview mode")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
                  >
                    <Smartphone className="w-4 h-4" />
                    Mobile
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => window.open(generatedLink, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open
                  </motion.button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500">
              <Link2 className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a product and generate your link</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Link Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Recent Links Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Links', value: '24', icon: Link2, color: 'violet' },
            { label: 'Total Clicks', value: '45.8K', icon: Globe, color: 'cyan' },
            { label: 'Avg CTR', value: '3.2%', icon: Smartphone, color: 'emerald' },
            { label: 'This Month', value: '₹45,280', icon: Sparkles, color: 'amber' },
          ].map((stat, i) => (
            <div key={stat.label} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <stat.icon className={`w-5 h-5 text-${stat.color}-400 mb-2`} />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LinkCreator;
