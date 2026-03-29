import { motion } from "framer-motion";
import { Globe, Check, Languages, DollarSign, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RegionalModesProps {
  activeRegion: string;
  onRegionChange: (region: "global" | "africa" | "asia" | "middleeast") => void;
}

const RegionalModes = ({ activeRegion, onRegionChange }: RegionalModesProps) => {
  const regions = [
    {
      id: "global",
      name: "Global",
      emoji: "🌍",
      description: "Worldwide coverage",
      keywords: "2,847",
      languages: ["English", "French", "Spanish"],
      currencies: ["USD", "EUR", "GBP"],
      contentStyle: "International professional"
    },
    {
      id: "africa",
      name: "Africa Mode",
      emoji: "🌍",
      description: "Focus on African markets",
      keywords: "845",
      languages: ["English", "French", "Swahili", "Arabic"],
      currencies: ["NGN", "KES", "ZAR", "EGP"],
      contentStyle: "Local business focus"
    },
    {
      id: "asia",
      name: "Asia Mode",
      emoji: "🌏",
      description: "Focus on Asian markets",
      keywords: "1,234",
      languages: ["English", "Hindi", "Mandarin", "Bahasa"],
      currencies: ["INR", "PKR", "BDT", "IDR"],
      contentStyle: "Tech-forward approach"
    },
    {
      id: "middleeast",
      name: "Middle East Mode",
      emoji: "🌍",
      description: "Focus on MENA region",
      keywords: "768",
      languages: ["English", "Arabic", "Persian"],
      currencies: ["AED", "SAR", "QAR", "KWD"],
      contentStyle: "Premium luxury tone"
    },
  ];

  const regionDetails = regions.find(r => r.id === activeRegion);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Regional Focus Modes</h2>
        <p className="text-slate-400">Switch SEO strategies for different market regions</p>
      </div>

      {/* Region Selector */}
      <div className="grid grid-cols-4 gap-4">
        {regions.map((region, index) => (
          <motion.button
            key={region.id}
            onClick={() => onRegionChange(region.id as any)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-6 rounded-xl text-left transition-all ${
              activeRegion === region.id
                ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500"
                : "bg-slate-900/50 border border-slate-700/50 hover:border-cyan-500/30"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{region.emoji}</span>
              {activeRegion === region.id && (
                <div className="p-1 bg-cyan-500 rounded-full">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <h3 className="font-semibold text-white mb-1">{region.name}</h3>
            <p className="text-sm text-slate-400">{region.description}</p>
            <p className="text-sm text-cyan-400 mt-2">{region.keywords} keywords</p>
          </motion.button>
        ))}
      </div>

      {/* Active Region Details */}
      {regionDetails && (
        <motion.div
          key={activeRegion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-6"
        >
          {/* Languages */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Languages className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-white">Languages</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {regionDetails.languages.map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1 bg-slate-800/50 text-slate-300 text-sm rounded-full"
                >
                  {lang}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Content will be optimized for these language markets
            </p>
          </div>

          {/* Currencies */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white">Currencies</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {regionDetails.currencies.map((currency) => (
                <span
                  key={currency}
                  className="px-3 py-1 bg-slate-800/50 text-slate-300 text-sm rounded-full"
                >
                  {currency}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Pricing and financial content will use these currencies
            </p>
          </div>

          {/* Content Style */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white">Content Style</h3>
            </div>
            <p className="text-lg text-white font-medium mb-2">{regionDetails.contentStyle}</p>
            <p className="text-xs text-slate-500">
              AI will adapt tone and messaging for this market
            </p>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4"
      >
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
          <Globe className="w-4 h-4 mr-2" />
          Start {regionDetails?.name} SEO Mode
        </Button>
        <Button variant="outline" className="border-slate-600 text-slate-300">
          Preview Regional Keywords
        </Button>
        <Button variant="outline" className="border-slate-600 text-slate-300">
          Generate Regional Content
        </Button>
      </motion.div>
    </div>
  );
};

export default RegionalModes;
