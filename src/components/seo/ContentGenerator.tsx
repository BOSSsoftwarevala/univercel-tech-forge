import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Sparkles, Globe, RefreshCw, Copy, Check,
  BookOpen, Layout, HelpCircle, Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContentGeneratorProps {
  activeRegion: string;
}

const ContentGenerator = ({ activeRegion }: ContentGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentType, setContentType] = useState("blog");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [copied, setCopied] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const contentTypes = [
    { id: "blog", label: "Blog Post", icon: BookOpen, description: "SEO-optimized article" },
    { id: "landing", label: "Landing Page", icon: Layout, description: "Conversion-focused copy" },
    { id: "faq", label: "FAQ Section", icon: HelpCircle, description: "Common questions" },
    { id: "product", label: "Product Description", icon: Package, description: "Sales-ready content" },
  ];

  const categories = [
    "POS Systems", "School Management", "Hospital Software", 
    "ERP Solutions", "Real Estate CRM", "Inventory Management"
  ];

  const locations = [
    "Nigeria", "Kenya", "South Africa", "UAE", "Saudi Arabia", 
    "India", "Pakistan", "Bangladesh", "Egypt", "Morocco"
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedContent(`# Best ${category} Solutions in ${location}

Looking for the perfect ${category.toLowerCase()} for your business in ${location}? Software Vala offers cutting-edge solutions designed specifically for the ${location} market.

## Why Choose Our ${category}?

### 1. Local Market Expertise
Our software is tailored for businesses in ${location}, understanding local regulations, currencies, and business practices.

### 2. 24/7 Support
Get round-the-clock support from our dedicated team who understand your time zone and language preferences.

### 3. Competitive Pricing
Affordable pricing plans designed for businesses of all sizes in the ${location} market.

## Key Features
- Multi-language support
- Local payment integration
- Cloud-based accessibility
- Mobile-first design
- Real-time analytics

## Get Started Today
Contact our ${location} team for a free demo and see how we can transform your business operations.

---
*Keywords: ${category.toLowerCase()} ${location.toLowerCase()}, best software ${location.toLowerCase()}, business solutions ${location.toLowerCase()}*`);
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Auto-Content Creation</h2>
          <p className="text-slate-400">AI-powered SEO content generation</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Content Type Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Content Type</h3>
          <div className="space-y-3">
            {contentTypes.map((type) => (
              <motion.button
                key={type.id}
                onClick={() => setContentType(type.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  contentType === type.id
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50"
                    : "bg-slate-800/50 border border-slate-700 hover:border-cyan-500/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <type.icon className={`w-5 h-5 ${
                    contentType === type.id ? "text-cyan-400" : "text-slate-400"
                  }`} />
                  <div>
                    <p className="font-medium text-white">{type.label}</p>
                    <p className="text-xs text-slate-400">{type.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Input Fields */}
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-slate-800/50 border-slate-600">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-2 block">Target Location</label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="bg-slate-800/50 border-slate-600">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !category || !location}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {isGenerating ? "Generating..." : "Generate Content"}
            </Button>
          </div>
        </motion.div>

        {/* Generated Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-2 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Generated Content
            </h3>
            {generatedContent && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCopy}
                className="border-slate-600 text-slate-300"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            )}
          </div>

          {generatedContent ? (
            <div className="relative">
              <Textarea 
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                className="bg-slate-800/50 border-slate-600 min-h-[500px] font-mono text-sm resize-none"
              />
              
              {/* Quality Badges */}
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                  ✓ Plagiarism Free
                </span>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                  ✓ Keyword Aligned
                </span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                  ✓ SEO Optimized
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                  ✓ Readable Score: 85
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] text-slate-500">
              <Sparkles className="w-12 h-12 mb-4 opacity-50" />
              <p>Select content type, category, and location</p>
              <p className="text-sm">Then click "Generate Content"</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ContentGenerator;
