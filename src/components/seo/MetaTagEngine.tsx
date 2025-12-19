import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Sparkles, Eye, Copy, Check, Globe, 
  Facebook, Twitter, Code, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MetaTagEngine = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [metaData, setMetaData] = useState({
    title: "Best POS Software for Retail Business | Software Vala",
    description: "Discover the leading POS software solution trusted by 10,000+ businesses across Africa, Asia & Middle East. Streamline operations, boost sales, and grow faster.",
    ogTitle: "Best POS Software for Retail Business",
    ogDescription: "Trusted by 10,000+ businesses. Streamline operations & boost sales.",
    ogImage: "https://softwarevala.com/og-pos.jpg",
    twitterCard: "summary_large_image",
    schema: `{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Software Vala POS",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "99",
    "priceCurrency": "USD"
  }
}`
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1500);
  };

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Meta Tag & Structured Data Engine</h2>
          <p className="text-slate-400">One-click SEO optimization for all pages</p>
        </div>
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
          {isGenerating ? "Generating..." : "Generate Meta"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Editor Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Meta Tags Editor
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Title Tag</label>
              <div className="relative">
                <Input 
                  value={metaData.title}
                  onChange={(e) => setMetaData({ ...metaData, title: e.target.value })}
                  className="bg-slate-800/50 border-slate-600 pr-10"
                />
                <button 
                  onClick={() => handleCopy("title", metaData.title)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {copied === "title" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">{metaData.title.length}/60 characters</p>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-1 block">Meta Description</label>
              <div className="relative">
                <Textarea 
                  value={metaData.description}
                  onChange={(e) => setMetaData({ ...metaData, description: e.target.value })}
                  className="bg-slate-800/50 border-slate-600 resize-none"
                  rows={3}
                />
                <button 
                  onClick={() => handleCopy("description", metaData.description)}
                  className="absolute right-2 top-2 text-slate-400 hover:text-white"
                >
                  {copied === "description" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">{metaData.description.length}/160 characters</p>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-1 block">OG Image URL</label>
              <Input 
                value={metaData.ogImage}
                onChange={(e) => setMetaData({ ...metaData, ogImage: e.target.value })}
                className="bg-slate-800/50 border-slate-600"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-1 block">Schema.org Markup</label>
              <div className="relative">
                <Textarea 
                  value={metaData.schema}
                  onChange={(e) => setMetaData({ ...metaData, schema: e.target.value })}
                  className="bg-slate-800/50 border-slate-600 font-mono text-xs resize-none"
                  rows={8}
                />
                <button 
                  onClick={() => handleCopy("schema", metaData.schema)}
                  className="absolute right-2 top-2 text-slate-400 hover:text-white"
                >
                  {copied === "schema" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preview Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              Live Previews
            </h3>
            
            <Tabs defaultValue="google" className="w-full">
              <TabsList className="w-full bg-slate-800/50 mb-4">
                <TabsTrigger value="google" className="flex-1 data-[state=active]:bg-cyan-500/20">
                  <Globe className="w-4 h-4 mr-2" />
                  Google
                </TabsTrigger>
                <TabsTrigger value="facebook" className="flex-1 data-[state=active]:bg-cyan-500/20">
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </TabsTrigger>
                <TabsTrigger value="twitter" className="flex-1 data-[state=active]:bg-cyan-500/20">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </TabsTrigger>
              </TabsList>

              <TabsContent value="google">
                <div className="p-4 bg-white rounded-lg">
                  <p className="text-xs text-green-700 mb-1">https://softwarevala.com › pos-software</p>
                  <h4 className="text-lg text-blue-800 hover:underline cursor-pointer mb-1">{metaData.title}</h4>
                  <p className="text-sm text-gray-600">{metaData.description}</p>
                </div>
              </TabsContent>

              <TabsContent value="facebook">
                <div className="bg-slate-800 rounded-lg overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                    <span className="text-slate-400">OG Image Preview</span>
                  </div>
                  <div className="p-3 border-t border-slate-700">
                    <p className="text-xs text-slate-400 uppercase">softwarevala.com</p>
                    <h4 className="text-white font-semibold">{metaData.ogTitle}</h4>
                    <p className="text-sm text-slate-400">{metaData.ogDescription}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="twitter">
                <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                  <div className="h-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                    <span className="text-slate-400">Card Image</span>
                  </div>
                  <div className="p-3">
                    <h4 className="text-white font-semibold">{metaData.ogTitle}</h4>
                    <p className="text-sm text-slate-400">{metaData.ogDescription}</p>
                    <p className="text-xs text-slate-500 mt-1">softwarevala.com</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-4"
          >
            <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-cyan-400" />
              Quick Generate
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 text-sm">
                Local Business Schema
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 text-sm">
                Product Schema
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 text-sm">
                FAQ Schema
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 text-sm">
                Article Schema
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default MetaTagEngine;
