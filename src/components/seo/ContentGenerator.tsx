import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  BookOpen,
  Layout,
  Mail,
  Megaphone,
  Share2,
  Wand2,
  Send,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import type { SEOManagerSystem } from "@/hooks/useSEOManagerSystem";

interface ContentGeneratorProps {
  activeRegion: string;
  system?: SEOManagerSystem;
}

const ContentGenerator = ({ activeRegion, system }: ContentGeneratorProps) => {
  const [contentType, setContentType] = useState("blog");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [language, setLanguage] = useState("en");
  const [country, setCountry] = useState(activeRegion === "middleeast" ? "AE" : activeRegion === "africa" ? "NG" : "IN");
  const [instructions, setInstructions] = useState("");
  const [recipient, setRecipient] = useState("growth@softwarewalanet.com");
  const [copied, setCopied] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [optimizationNotes, setOptimizationNotes] = useState<string[]>([]);
  const [lastPersistedId, setLastPersistedId] = useState<string | null>(null);
  const [lastPersistedType, setLastPersistedType] = useState<"blog" | "landing" | null>(null);

  const contentTypes = [
    { id: "blog", label: "Blog Post", icon: BookOpen, description: "SEO-optimized article" },
    { id: "landing", label: "Landing Page", icon: Layout, description: "Conversion-focused copy" },
    { id: "email", label: "Email", icon: Mail, description: "Subject lines and body copy" },
    { id: "social", label: "Social Post", icon: Share2, description: "Caption, hooks, hashtags" },
    { id: "ad", label: "Ad Copy", icon: Megaphone, description: "Headlines and paid copy" },
  ];

  const languages = [
    { value: "en", label: "English" },
    { value: "hi", label: "Hindi" },
    { value: "es", label: "Spanish" },
    { value: "de", label: "German" },
    { value: "fr", label: "French" },
    { value: "ar", label: "Arabic" },
    { value: "pt", label: "Portuguese" },
  ];

  const countries = [
    { value: "IN", label: "India" },
    { value: "AE", label: "UAE" },
    { value: "NG", label: "Nigeria" },
    { value: "DE", label: "Germany" },
    { value: "FR", label: "France" },
    { value: "ES", label: "Spain" },
    { value: "BR", label: "Brazil" },
  ];

  const keywords = keywordsInput.split(",").map((value) => value.trim()).filter(Boolean);
  const isGenerating = Boolean(system?.generateContentMutation.isPending);
  const isOptimizing = Boolean(system?.optimizeContentMutation.isPending);
  const isPublishing = Boolean(system?.publishContentMutation.isPending) || Boolean(system?.createBlogMutation.isPending) || Boolean(system?.createLandingPageMutation.isPending);

  const buildRequest = () => ({
    type: contentType as "blog" | "landing" | "email" | "social" | "ad",
    keywords,
    instructions,
    language,
    country,
  });

  const handleGenerate = () => {
    if (!system) return;
    if (keywords.length === 0) {
      toast({ title: "Keywords Required", description: "Add at least one keyword to generate content.", variant: "destructive" });
      return;
    }

    system.generateContentMutation.mutate(buildRequest(), {
      onSuccess: (payload) => {
        const nextTitle = String(payload.title || payload.headline || payload.subjectA || keywords[0]);
        const nextBody = String(payload.article || payload.body || payload.caption || (Array.isArray(payload.descriptions) ? payload.descriptions.join("\n") : JSON.stringify(payload, null, 2)));
        setGeneratedTitle(nextTitle);
        setGeneratedContent(nextBody);
        setOptimizationNotes([]);
        setLastPersistedId(null);
        setLastPersistedType(null);
        toast({ title: "Content Generated", description: `AI generated ${contentType} content with ranking intent.` });
      },
      onError: (error) => {
        toast({ title: "Generation Failed", description: error.message, variant: "destructive" });
      },
    });
  };

  const handleOptimize = () => {
    if (!system || keywords.length === 0) return;
    system.optimizeContentMutation.mutate(buildRequest(), {
      onSuccess: (payload) => {
        setOptimizationNotes(Array.isArray(payload.suggestions) ? payload.suggestions.map(String) : []);
        toast({ title: "SEO Optimization Complete", description: `SEO score ${String(payload.seoScore || 0)} generated with improvement suggestions.` });
      },
      onError: (error) => {
        toast({ title: "Optimization Failed", description: error.message, variant: "destructive" });
      },
    });
  };

  const handleTranslate = () => {
    if (!system || !generatedContent) return;
    system.translateContentMutation.mutate({
      ...buildRequest(),
      content: generatedContent,
      title: generatedTitle,
      content_type: lastPersistedType || undefined,
      content_id: lastPersistedId || undefined,
    }, {
      onSuccess: (payload) => {
        if (typeof payload.localizedBody === "string") {
          setGeneratedContent(payload.localizedBody);
        }
        toast({ title: "Localization Complete", description: `Localized content saved for ${language.toUpperCase()}-${country}.` });
      },
      onError: (error) => {
        toast({ title: "Localization Failed", description: error.message, variant: "destructive" });
      },
    });
  };

  const handlePublish = () => {
    if (!system || !generatedContent) return;

    if (contentType === "blog") {
      system.createBlogMutation.mutate({ keyword: keywords[0], country, language, instructions }, {
        onSuccess: (blog) => {
          setLastPersistedId(blog.id);
          setLastPersistedType("blog");
          system.publishContentMutation.mutate({ content_type: "blog", content_id: blog.id, url: blog.published_url || `/blog/${blog.slug}` }, {
            onSuccess: () => {
              toast({ title: "Blog Published", description: `${blog.title} published and indexing ping sent.` });
            },
          });
        },
        onError: (error) => {
          toast({ title: "Blog Publish Failed", description: error.message, variant: "destructive" });
        },
      });
      return;
    }

    if (contentType === "landing") {
      system.createLandingPageMutation.mutate({ keyword: keywords[0], country, language, instructions }, {
        onSuccess: (page) => {
          setLastPersistedId(page.id);
          setLastPersistedType("landing");
          system.publishContentMutation.mutate({ content_type: "landing", content_id: page.id, url: page.published_url || `/landing/${page.page_slug}` }, {
            onSuccess: () => {
              toast({ title: "Landing Published", description: `${page.title} published with sitemap and index sync.` });
            },
          });
        },
        onError: (error) => {
          toast({ title: "Landing Publish Failed", description: error.message, variant: "destructive" });
        },
      });
      return;
    }

    if (contentType === "email") {
      system.sendEmailMutation.mutate({ recipient, subject: generatedTitle || `SEO content for ${keywords[0]}`, message: generatedContent }, {
        onSuccess: () => toast({ title: "Email Sent", description: `Email delivered to ${recipient}.` }),
        onError: (error) => toast({ title: "Email Failed", description: error.message, variant: "destructive" }),
      });
      return;
    }

    if (contentType === "social") {
      system.distributeSocialMutation.mutate({ content: generatedContent, title: generatedTitle, platform: "linkedin", hashtags: keywords.map((keyword) => `#${keyword.replace(/\s+/g, "")}`), publish_now: true }, {
        onSuccess: () => toast({ title: "Social Distributed", description: "Social distribution queued through the SEO engine." }),
        onError: (error) => toast({ title: "Social Distribution Failed", description: error.message, variant: "destructive" }),
      });
      return;
    }

    system.createAdMutation.mutate({ name: generatedTitle || `${keywords[0]} campaign`, keyword: keywords[0], platform: "google_ads", budget: 10000, daily_budget: 1000 }, {
      onSuccess: () => toast({ title: "Ad Campaign Created", description: "Paid distribution campaign created from generated content." }),
      onError: (error) => toast({ title: "Ad Campaign Failed", description: error.message, variant: "destructive" }),
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">AI Content Generator</h2>
          <p className="text-slate-400">Input → AI Generate → SEO Optimize → Translate → Publish → Distribute</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
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
                  <type.icon className={`w-5 h-5 ${contentType === type.id ? "text-cyan-400" : "text-slate-400"}`} />
                  <div>
                    <p className="font-medium text-white">{type.label}</p>
                    <p className="text-xs text-slate-400">{type.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Topic / Keywords</label>
              <Input
                value={keywordsInput}
                onChange={(event) => setKeywordsInput(event.target.value)}
                placeholder="crm software, workflow automation, lead routing"
                className="bg-slate-800/50 border-slate-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Language</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((item) => (
                      <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Country</label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((item) => (
                      <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-2 block">Additional Instructions</label>
              <Textarea
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
                rows={4}
                placeholder="Focus on enterprise intent, use stronger CTA, include FAQ and local relevance"
                className="bg-slate-800/50 border-slate-600"
              />
            </div>

            {(contentType === "email" || contentType === "social" || contentType === "ad") && (
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Recipient / Distribution Target</label>
                <Input
                  value={recipient}
                  onChange={(event) => setRecipient(event.target.value)}
                  placeholder="growth@softwarewalanet.com"
                  className="bg-slate-800/50 border-slate-600"
                />
              </div>
            )}

            <Button onClick={handleGenerate} disabled={!system || isGenerating || keywords.length === 0} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500">
              {isGenerating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              {isGenerating ? "Generating..." : "Generate Content"}
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleOptimize} disabled={!system || isOptimizing || keywords.length === 0} variant="outline" className="border-slate-600">
                <Wand2 className="w-4 h-4 mr-2" />
                Optimize SEO
              </Button>
              <Button onClick={handleTranslate} disabled={!system || !generatedContent} variant="outline" className="border-slate-600">
                <Languages className="w-4 h-4 mr-2" />
                Translate
              </Button>
            </div>

            <Button onClick={handlePublish} disabled={!system || !generatedContent || isPublishing} className="w-full bg-emerald-600 hover:bg-emerald-500">
              <Send className="w-4 h-4 mr-2" />
              {contentType === "blog" || contentType === "landing" ? "Publish Content" : "Distribute Content"}
            </Button>
          </div>
        </motion.div>

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
              <Button variant="outline" size="sm" onClick={handleCopy} className="border-slate-600 text-slate-300">
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
              {generatedTitle && (
                <div className="mb-3 rounded-lg border border-slate-700 bg-slate-800/40 p-3">
                  <p className="text-xs text-slate-400 mb-1">Generated Title</p>
                  <p className="text-sm font-medium text-white">{generatedTitle}</p>
                </div>
              )}

              <Textarea
                value={generatedContent}
                onChange={(event) => setGeneratedContent(event.target.value)}
                className="bg-slate-800/50 border-slate-600 min-h-[500px] font-mono text-sm resize-none"
              />

              <div className="flex gap-2 mt-4 flex-wrap">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">✓ Intent Mapped</span>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">✓ Keyword Aligned</span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">✓ SEO Optimized</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">✓ Localization Ready</span>
              </div>

              {optimizationNotes.length > 0 && (
                <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800/40 p-4">
                  <p className="text-sm font-semibold text-white mb-2">Optimization Suggestions</p>
                  <div className="space-y-2 text-sm text-slate-300">
                    {optimizationNotes.map((note) => (
                      <p key={note}>• {note}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] text-slate-500">
              <Sparkles className="w-12 h-12 mb-4 opacity-50" />
              <p>Enter keywords, language, and country</p>
              <p className="text-sm">Then run the full AI content loop</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ContentGenerator;
