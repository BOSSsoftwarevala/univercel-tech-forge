import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Share2, Youtube, Facebook, Instagram, Linkedin,
  Sparkles, Send, RefreshCw, Check, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const SocialSEOSync = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["facebook", "linkedin"]);
  const [generatedContent, setGeneratedContent] = useState("");

  const platforms = [
    { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-500", connected: true },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-500", connected: true },
    { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-500", connected: true },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-400", connected: true },
  ];

  const recentBlogs = [
    { title: "Best POS Software for Retail in Africa 2024", status: "published", synced: 3 },
    { title: "Hospital Management System Features Guide", status: "published", synced: 2 },
    { title: "School ERP: Complete Implementation Guide", status: "draft", synced: 0 },
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedContent(`🚀 New Blog Alert!

Discover the Best POS Software for Retail in Africa 2024!

✅ Local payment integration
✅ Multi-language support
✅ Cloud-based accessibility
✅ Real-time analytics

Perfect for businesses in Nigeria, Kenya, South Africa & more!

👉 Read the full guide: softwarevala.com/pos-africa-2024

#POSSoftware #RetailTech #AfricaBusiness #SoftwareVala`);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Social × SEO Sync</h2>
          <p className="text-slate-400">One-click auto-publish SEO content as social posts</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Platform Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            Connected Platforms
          </h3>
          <div className="space-y-3">
            {platforms.map((platform) => (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <platform.icon className={`w-5 h-5 ${platform.color}`} />
                  <span className="text-white">{platform.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={platform.connected ? "bg-green-500/20 text-green-400" : "bg-slate-500/20 text-slate-400"}>
                    {platform.connected ? "Connected" : "Disconnected"}
                  </Badge>
                  <Switch 
                    checked={selectedPlatforms.includes(platform.id)}
                    onCheckedChange={() => togglePlatform(platform.id)}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* SMM Vala Integration */}
          <div className="mt-6 p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
            <p className="text-sm text-purple-300 font-medium mb-1">SMM Vala Integration</p>
            <p className="text-xs text-slate-400">Coming soon — unified social media management</p>
          </div>
        </motion.div>

        {/* Content Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Recent Blog Posts</h3>
          <div className="space-y-3 mb-6">
            {recentBlogs.map((blog, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white truncate pr-2">{blog.title}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 flex-shrink-0" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${
                    blog.status === "published" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {blog.status}
                  </Badge>
                  {blog.synced > 0 && (
                    <span className="text-xs text-slate-400">
                      Synced to {blog.synced} platforms
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {isGenerating ? "Generating..." : "Generate Social Posts"}
          </Button>
        </motion.div>

        {/* Generated Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Generated Post</h3>
          
          {generatedContent ? (
            <>
              <Textarea 
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                className="bg-slate-800/50 border-slate-600 min-h-[250px] resize-none mb-4"
              />
              <div className="flex gap-2 mb-4">
                {selectedPlatforms.map((platform) => {
                  const p = platforms.find(pl => pl.id === platform);
                  return p ? (
                    <Badge key={platform} variant="outline" className="border-slate-600">
                      <p.icon className={`w-3 h-3 mr-1 ${p.color}`} />
                      {p.name}
                    </Badge>
                  ) : null;
                })}
              </div>
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500">
                <Send className="w-4 h-4 mr-2" />
                Publish to {selectedPlatforms.length} Platforms
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-slate-500">
              <Share2 className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-center">Select a blog post and click<br />"Generate Social Posts"</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SocialSEOSync;
