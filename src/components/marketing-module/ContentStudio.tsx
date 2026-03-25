import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PenTool, ImageIcon, FileText, Sparkles, 
  Globe2, Calendar, Zap, Copy, Download,
  RefreshCw, Eye, Check
} from "lucide-react";
import { toast } from "sonner";

const contentTemplates = [
  { id: "product-launch", label: "Product Launch", icon: Sparkles },
  { id: "festival", label: "Festival Campaign", icon: Calendar },
  { id: "testimonial", label: "Testimonial", icon: FileText },
  { id: "offer", label: "Special Offer", icon: Zap },
];

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "ar", label: "Arabic" },
  { code: "sw", label: "Swahili" },
  { code: "fr", label: "French" },
];

const recentContent = [
  { id: 1, type: "text", title: "ERP Launch Post - India", language: "Hindi", created: "2 hours ago" },
  { id: 2, type: "image", title: "Franchise Banner - Africa", language: "English", created: "5 hours ago" },
  { id: 3, type: "text", title: "Diwali Offer Post", language: "Hindi", created: "1 day ago" },
  { id: 4, type: "text", title: "School ERP Benefits", language: "Arabic", created: "2 days ago" },
];

export const ContentStudio = () => {
  const [activeTab, setActiveTab] = useState("text");
  const [prompt, setPrompt] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const handleGenerate = () => {
    if (!prompt) {
      toast.error("Enter a prompt to generate content");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedContent(`Generated ${activeTab} content for: "${prompt}" in ${languages.find(l => l.code === selectedLanguage)?.label}.\n\nThis is AI-generated sample content that would be customized based on your business, region, and target audience.`);
      setIsGenerating(false);
      toast.success("Content generated successfully!");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Studio</h1>
          <p className="text-muted-foreground">AI text, images, banners & CTA generator</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <Zap className="w-3 h-3 mr-1" />
          Multi-Language AI
        </Badge>
      </div>

      {/* Content Type Tabs */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="text" className="gap-2">
                <FileText className="w-4 h-4" />
                Text
              </TabsTrigger>
              <TabsTrigger value="image" className="gap-2">
                <ImageIcon className="w-4 h-4" />
                Image
              </TabsTrigger>
              <TabsTrigger value="banner" className="gap-2">
                <PenTool className="w-4 h-4" />
                Banner
              </TabsTrigger>
              <TabsTrigger value="cta" className="gap-2">
                <Sparkles className="w-4 h-4" />
                CTA
              </TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              {/* Language & Template Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Language</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <Globe2 className="w-4 h-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Template (Optional)</label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose template" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Prompt Input */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">What do you want to create?</label>
                <Textarea
                  placeholder="E.g., Create a social media post about our new school ERP software launch in Kenya..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] bg-background/50"
                />
              </div>

              {/* Generate Button */}
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Generate {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </Button>

              {/* Generated Content */}
              {generatedContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-accent/30 border border-border/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      <Check className="w-3 h-3 mr-1" />
                      Generated
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => {
                        navigator.clipboard.writeText(generatedContent);
                        toast.success("Copied to clipboard!");
                      }}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-foreground whitespace-pre-wrap">{generatedContent}</p>
                </motion.div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Content */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Recent Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentContent.map((content) => (
              <div 
                key={content.id}
                className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    content.type === "text" 
                      ? "bg-blue-500/20 text-blue-400" 
                      : "bg-purple-500/20 text-purple-400"
                  }`}>
                    {content.type === "text" ? (
                      <FileText className="w-5 h-5" />
                    ) : (
                      <ImageIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{content.title}</p>
                    <p className="text-xs text-muted-foreground">{content.language} • {content.created}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
