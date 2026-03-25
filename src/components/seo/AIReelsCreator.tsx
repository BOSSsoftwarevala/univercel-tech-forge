import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, Sparkles, Play, Copy, Check, Download, Clock,
  Film, Music, Type, Hash, Image, RefreshCw, Wand2,
  Instagram, Youtube, Facebook, Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSEOAutomation } from "@/hooks/useSEOAutomation";
import { toast } from "sonner";

const AIReelsCreator = () => {
  const { isLoading, generateReelsScript } = useSEOAutomation();
  const [copied, setCopied] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    topic: "",
    style: "educational",
    duration: "30",
    brand: "Software Vala",
    goal: "Drive engagement",
    platform: "instagram"
  });

  const [generatedScript, setGeneratedScript] = useState<{
    hook: string;
    script: string;
    scenes: string[];
    duration: number;
    music: string;
    captions: string[];
    hashtags: string[];
    thumbnail: string;
  } | null>(null);

  const styleOptions = [
    { value: "educational", label: "Educational" },
    { value: "entertaining", label: "Entertaining" },
    { value: "inspirational", label: "Inspirational" },
    { value: "behind-the-scenes", label: "Behind the Scenes" },
    { value: "tutorial", label: "Tutorial" },
    { value: "trending", label: "Trending/Viral" },
  ];

  const platformOptions = [
    { value: "instagram", label: "Instagram Reels", icon: Instagram },
    { value: "youtube", label: "YouTube Shorts", icon: Youtube },
    { value: "facebook", label: "Facebook Reels", icon: Facebook },
    { value: "tiktok", label: "TikTok", icon: Smartphone },
  ];

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      toast.error("Please enter a topic for your Reel");
      return;
    }

    const result = await generateReelsScript({
      topic: formData.topic,
      style: styleOptions.find(s => s.value === formData.style)?.label,
      duration: `${formData.duration} seconds`,
      brand: formData.brand,
      goal: formData.goal,
      platform: platformOptions.find(p => p.value === formData.platform)?.label,
    });

    if (result) {
      setGeneratedScript(result);
      toast.success("Reel script generated successfully!");
    }
  };

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(null), 2000);
  };

  const recentReels = [
    { id: 1, title: "5 Business Tips for 2024", views: "12.4K", engagement: "8.2%", platform: "instagram", status: "published" },
    { id: 2, title: "Behind the Scenes: Our Team", views: "8.7K", engagement: "12.1%", platform: "youtube", status: "published" },
    { id: 3, title: "Customer Success Story", views: "5.2K", engagement: "15.3%", platform: "facebook", status: "scheduled" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
              <Video className="h-6 w-6 text-purple-400" />
            </div>
            AI Reels & Shorts Creator
          </h1>
          <p className="text-muted-foreground mt-1">Generate viral video scripts with AI</p>
        </div>
        <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-400" />
                Create New Reel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Topic / Idea</label>
                <Textarea
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g., 5 ways to boost your business productivity..."
                  className="bg-slate-800/50 border-slate-600 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1.5 block">Content Style</label>
                  <Select value={formData.style} onValueChange={(v) => setFormData({ ...formData, style: v })}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {styleOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-1.5 block">Duration</label>
                  <Select value={formData.duration} onValueChange={(v) => setFormData({ ...formData, duration: v })}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">60 seconds</SelectItem>
                      <SelectItem value="90">90 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Platform</label>
                <div className="grid grid-cols-4 gap-2">
                  {platformOptions.map((platform) => (
                    <button
                      key={platform.value}
                      onClick={() => setFormData({ ...formData, platform: platform.value })}
                      className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-1 ${
                        formData.platform === platform.value
                          ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                          : "bg-slate-800/50 border-slate-600 text-slate-400 hover:border-purple-500/30"
                      }`}
                    >
                      <platform.icon className="w-5 h-5" />
                      <span className="text-xs">{platform.label.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Brand Name</label>
                <Input
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="bg-slate-800/50 border-slate-600"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Goal</label>
                <Input
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  placeholder="e.g., Drive website traffic, Get followers..."
                  className="bg-slate-800/50 border-slate-600"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating Script...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Reel Script
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Generated Script */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-xl h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Film className="w-5 h-5 text-purple-400" />
                Generated Script
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {generatedScript ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Hook */}
                    <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-yellow-400 font-semibold uppercase">🎣 Hook (First 3 Seconds)</span>
                        <button onClick={() => handleCopy("hook", generatedScript.hook)}>
                          {copied === "hook" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                        </button>
                      </div>
                      <p className="text-white font-medium">{generatedScript.hook}</p>
                    </div>

                    {/* Full Script */}
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-purple-400 font-semibold uppercase">📜 Full Script</span>
                        <button onClick={() => handleCopy("script", generatedScript.script)}>
                          {copied === "script" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                        </button>
                      </div>
                      <p className="text-slate-300 text-sm whitespace-pre-wrap">{generatedScript.script}</p>
                    </div>

                    {/* Scenes */}
                    {generatedScript.scenes && generatedScript.scenes.length > 0 && (
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <span className="text-xs text-cyan-400 font-semibold uppercase mb-2 block">🎬 Scene Breakdown</span>
                        <div className="space-y-2">
                          {generatedScript.scenes.map((scene, idx) => (
                            <div key={idx} className="flex gap-2 text-sm">
                              <span className="text-cyan-400 font-mono">#{idx + 1}</span>
                              <span className="text-slate-300">{scene}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-slate-300">{generatedScript.duration || formData.duration}s</span>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600 flex items-center gap-2">
                        <Music className="w-4 h-4 text-pink-400" />
                        <span className="text-sm text-slate-300 truncate">{generatedScript.music || "Upbeat"}</span>
                      </div>
                    </div>

                    {/* Hashtags */}
                    {generatedScript.hashtags && generatedScript.hashtags.length > 0 && (
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-green-400 font-semibold uppercase flex items-center gap-1">
                            <Hash className="w-3 h-3" /> Hashtags
                          </span>
                          <button onClick={() => handleCopy("hashtags", generatedScript.hashtags.map(h => h.startsWith("#") ? h : `#${h}`).join(" "))}>
                            {copied === "hashtags" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {generatedScript.hashtags.slice(0, 15).map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/30">
                              {tag.startsWith("#") ? tag : `#${tag}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Thumbnail Suggestion */}
                    {generatedScript.thumbnail && (
                      <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600 flex items-center gap-2">
                        <Image className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-slate-300">Thumbnail: {generatedScript.thumbnail}</span>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-slate-500">
                    <Video className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-center">Enter a topic and click generate<br />to create your AI-powered Reel script</p>
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Reels */}
      <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Play className="w-5 h-5 text-purple-400" />
            Recent Reels Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentReels.map((reel) => (
              <motion.div
                key={reel.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className={`text-xs ${
                    reel.status === "published" ? "bg-green-500/10 text-green-400 border-green-500/30" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                  }`}>
                    {reel.status}
                  </Badge>
                  {reel.platform === "instagram" && <Instagram className="w-4 h-4 text-pink-400" />}
                  {reel.platform === "youtube" && <Youtube className="w-4 h-4 text-red-400" />}
                  {reel.platform === "facebook" && <Facebook className="w-4 h-4 text-blue-400" />}
                </div>
                <h3 className="font-medium text-white mb-2">{reel.title}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>{reel.views} views</span>
                  <span className="text-green-400">{reel.engagement} engagement</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIReelsCreator;
