import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, Sparkles, Globe, TrendingUp, Filter, 
  Download, RefreshCw, Target, Zap, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface KeywordManagerProps {
  activeRegion: string;
}

const KeywordManager = ({ activeRegion }: KeywordManagerProps) => {
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);

  const industries = [
    { id: "all", label: "All Industries" },
    { id: "pos", label: "POS Systems" },
    { id: "school", label: "School Management" },
    { id: "hospital", label: "Hospital Software" },
    { id: "erp", label: "ERP Solutions" },
    { id: "realestate", label: "Real Estate" },
  ];

  const keywords = [
    { keyword: "best pos software africa", volume: 12400, difficulty: 34, intent: "buyer", status: "active", trend: "+15%" },
    { keyword: "school management system kenya", volume: 8900, difficulty: 28, intent: "buyer", status: "active", trend: "+22%" },
    { keyword: "hospital software dubai", volume: 6700, difficulty: 45, intent: "buyer", status: "pending", trend: "+8%" },
    { keyword: "erp solutions india", volume: 15600, difficulty: 52, intent: "research", status: "active", trend: "+12%" },
    { keyword: "real estate crm nigeria", volume: 4300, difficulty: 22, intent: "buyer", status: "optimizing", trend: "+35%" },
    { keyword: "inventory management software", volume: 28000, difficulty: 67, intent: "research", status: "active", trend: "+5%" },
  ];

  const countryMappings = [
    { country: "Nigeria", flag: "🇳🇬", keywords: 245, growth: "+18%" },
    { country: "Kenya", flag: "🇰🇪", keywords: 189, growth: "+24%" },
    { country: "UAE", flag: "🇦🇪", keywords: 312, growth: "+15%" },
    { country: "India", flag: "🇮🇳", keywords: 567, growth: "+22%" },
    { country: "South Africa", flag: "🇿🇦", keywords: 156, growth: "+12%" },
    { country: "Saudi Arabia", flag: "🇸🇦", keywords: 198, growth: "+28%" },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Automated Keyword Manager</h2>
          <p className="text-slate-400">AI-powered keyword strategy & automation</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-gradient-to-r from-cyan-500 to-blue-500"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {isGenerating ? "Generating..." : "AI Generate"}
          </Button>
        </div>
      </div>

      {/* Industry Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {industries.map((industry) => (
          <motion.button
            key={industry.id}
            onClick={() => setSelectedIndustry(industry.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedIndustry === industry.id
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                : "bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700"
            }`}
          >
            {industry.label}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Keywords Table */}
        <div className="col-span-2 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-400" />
              Keyword Database
            </h3>
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Search keywords..." 
                className="w-48 bg-slate-800/50 border-slate-600 text-sm"
              />
              <Button variant="outline" size="sm" className="border-slate-600">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left p-4 text-xs font-medium text-slate-400">KEYWORD</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400">VOLUME</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400">DIFFICULTY</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400">INTENT</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400">STATUS</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400">TREND</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((kw, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="p-4">
                      <span className="text-sm text-white">{kw.keyword}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-cyan-400 font-medium">{kw.volume.toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              kw.difficulty < 30 ? "bg-green-500" :
                              kw.difficulty < 50 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${kw.difficulty}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">{kw.difficulty}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          kw.intent === "buyer" ? "border-green-500 text-green-400" : "border-blue-500 text-blue-400"
                        }`}
                      >
                        {kw.intent}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge 
                        className={`text-xs ${
                          kw.status === "active" ? "bg-green-500/20 text-green-400" :
                          kw.status === "optimizing" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-slate-500/20 text-slate-400"
                        }`}
                      >
                        {kw.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-green-400">{kw.trend}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Country Mapping */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4"
          >
            <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-cyan-400" />
              Country-wise Mapping
            </h3>
            <div className="space-y-3">
              {countryMappings.map((country, index) => (
                <motion.div
                  key={country.country}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{country.flag}</span>
                    <span className="text-sm text-white">{country.country}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-cyan-400">{country.keywords}</p>
                    <p className="text-xs text-green-400">{country.growth}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-4"
          >
            <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-cyan-400" />
              AI Automation
            </h3>
            <div className="space-y-2">
              <Button className="w-full justify-start bg-slate-800/50 hover:bg-slate-800 text-left">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                <span className="text-sm">Validate Competition</span>
              </Button>
              <Button className="w-full justify-start bg-slate-800/50 hover:bg-slate-800 text-left">
                <Target className="w-4 h-4 mr-2 text-purple-400" />
                <span className="text-sm">Assign Content Plan</span>
              </Button>
              <Button className="w-full justify-start bg-slate-800/50 hover:bg-slate-800 text-left">
                <TrendingUp className="w-4 h-4 mr-2 text-cyan-400" />
                <span className="text-sm">Long-tail Suggestions</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default KeywordManager;
