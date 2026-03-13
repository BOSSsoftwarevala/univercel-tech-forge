import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe, Languages, ArrowRightLeft, MessageSquare, FileText,
  Mic, Volume2, CheckCircle2, Clock, Zap,
  Users, Send, Copy, RefreshCw
} from "lucide-react";

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸", active: true },
  { code: "hi", name: "Hindi", flag: "🇮🇳", active: true },
  { code: "es", name: "Spanish", flag: "🇪🇸", active: true },
  { code: "fr", name: "French", flag: "🇫🇷", active: true },
  { code: "de", name: "German", flag: "🇩🇪", active: true },
  { code: "ja", name: "Japanese", flag: "🇯🇵", active: true },
  { code: "zh", name: "Chinese", flag: "🇨🇳", active: true },
  { code: "ar", name: "Arabic", flag: "🇸🇦", active: true },
  { code: "pt", name: "Portuguese", flag: "🇧🇷", active: true },
  { code: "ru", name: "Russian", flag: "🇷🇺", active: true },
  { code: "ko", name: "Korean", flag: "🇰🇷", active: false },
  { code: "it", name: "Italian", flag: "🇮🇹", active: false },
];

const TRANSLATION_HISTORY = [
  { id: "1", from: "Hindi", to: "English", input: "हमारा सॉफ्टवेयर सबसे अच्छा है", output: "Our software is the best", type: "text", time: "2 min ago" },
  { id: "2", from: "English", to: "Spanish", input: "Schedule a demo for the client", output: "Programar una demostración para el cliente", type: "text", time: "15 min ago" },
  { id: "3", from: "French", to: "English", input: "Nous avons besoin de plus de serveurs", output: "We need more servers", type: "speech", time: "32 min ago" },
  { id: "4", from: "English", to: "Japanese", input: "The deployment is complete", output: "デプロイが完了しました", type: "text", time: "1 hr ago" },
  { id: "5", from: "Arabic", to: "English", input: "ما هو سعر الترخيص؟", output: "What is the license price?", type: "speech", time: "2 hr ago" },
];

const CONVERSATION_SESSIONS = [
  { id: "1", client: "Tokyo Office", languages: ["en", "ja"], messages: 24, status: "active", lastMessage: "License terms discussion" },
  { id: "2", client: "São Paulo Partner", languages: ["en", "pt"], messages: 18, status: "active", lastMessage: "Pricing negotiation" },
  { id: "3", client: "Berlin Reseller", languages: ["en", "de"], messages: 12, status: "completed", lastMessage: "Contract finalized" },
  { id: "4", client: "Dubai Franchise", languages: ["en", "ar"], messages: 31, status: "active", lastMessage: "Product demo request" },
];

const AIRALanguageIntelligence = () => {
  const [sourceText, setSourceText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-sky-500/20">
            <Globe className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Language Intelligence</h1>
            <p className="text-sky-400/80">Multilingual AI • Real-time Translation • Cross-Language Communication</p>
          </div>
        </div>
        <Badge className="bg-sky-500/20 text-sky-400 border-sky-500/30 px-4 py-2">
          <Languages className="w-3 h-3 mr-2" />
          {SUPPORTED_LANGUAGES.filter(l => l.active).length} Languages Active
        </Badge>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Languages Supported", value: SUPPORTED_LANGUAGES.length, icon: Globe, color: "text-sky-400", bg: "bg-sky-500/10" },
          { label: "Translations Today", value: "1,240", icon: ArrowRightLeft, color: "text-violet-400", bg: "bg-violet-500/10" },
          { label: "Active Conversations", value: CONVERSATION_SESSIONS.filter(s => s.status === "active").length, icon: MessageSquare, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Speech Translations", value: "340", icon: Mic, color: "text-pink-400", bg: "bg-pink-500/10" },
        ].map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${m.bg} flex items-center justify-center`}>
                  <m.icon className={`w-5 h-5 ${m.color}`} />
                </div>
                <div>
                  <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
                  <p className="text-xs text-slate-400">{m.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="translate" className="w-full">
        <TabsList className="bg-slate-800/50 border border-slate-700/30">
          <TabsTrigger value="translate" className="text-xs">Real-time Translation</TabsTrigger>
          <TabsTrigger value="conversations" className="text-xs">Live Conversations</TabsTrigger>
          <TabsTrigger value="history" className="text-xs">Translation History</TabsTrigger>
        </TabsList>

        {/* Translation Panel */}
        <TabsContent value="translate">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Source */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <select
                        value={sourceLang}
                        onChange={(e) => setSourceLang(e.target.value)}
                        className="bg-slate-800/50 border border-slate-700/30 rounded-lg px-3 py-1.5 text-sm text-white"
                      >
                        {SUPPORTED_LANGUAGES.map(l => (
                          <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                        ))}
                      </select>
                    </div>
                    <Button variant="ghost" size="sm" className="text-sky-400 hover:bg-sky-500/10">
                      <Mic className="w-4 h-4 mr-1" /> Voice Input
                    </Button>
                  </div>
                  <textarea
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    placeholder="Enter text or speak to translate..."
                    className="w-full h-40 bg-slate-800/30 border border-slate-700/20 rounded-xl p-4 text-white placeholder:text-slate-500 resize-none focus:border-sky-500/50 focus:outline-none"
                  />
                </div>

                {/* Target */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <select
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                      className="bg-slate-800/50 border border-slate-700/30 rounded-lg px-3 py-1.5 text-sm text-white"
                    >
                      {SUPPORTED_LANGUAGES.map(l => (
                        <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Volume2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="w-full h-40 bg-sky-500/5 border border-sky-500/20 rounded-xl p-4 text-sky-300 text-sm">
                    {sourceText ? "Translation will appear here..." : "Waiting for input..."}
                  </div>
                </div>
              </div>

              {/* Swap + Translate buttons */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <Button
                  variant="ghost"
                  onClick={() => { const tmp = sourceLang; setSourceLang(targetLang); setTargetLang(tmp); }}
                  className="text-sky-400 hover:bg-sky-500/10"
                >
                  <ArrowRightLeft className="w-4 h-4 mr-2" /> Swap Languages
                </Button>
                <Button className="bg-sky-500/20 text-sky-400 border border-sky-500/40 hover:bg-sky-500/30 px-8">
                  <Zap className="w-4 h-4 mr-2" /> Translate
                </Button>
              </div>

              {/* Pipeline */}
              <div className="mt-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/20">
                <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Translation Pipeline</p>
                <div className="flex items-center justify-center gap-3">
                  {["Input (Text/Speech)", "Language Detection", "AIRA Processing", "AI Translation", "Output (Text/Voice)"].map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-xs text-sky-300">{s}</div>
                      {i < 4 && <span className="text-sky-500/40">→</span>}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Conversations */}
        <TabsContent value="conversations">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                Cross-Language Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {CONVERSATION_SESSIONS.map((session, i) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/20 hover:border-sky-500/20 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="text-sm font-medium text-white">{session.client}</h4>
                        <div className="flex gap-1">
                          {session.languages.map(l => {
                            const lang = SUPPORTED_LANGUAGES.find(sl => sl.code === l);
                            return <span key={l} className="text-sm">{lang?.flag}</span>;
                          })}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{session.lastMessage}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">{session.messages} messages</span>
                      <Badge className={session.status === "active" ? "bg-emerald-500/20 text-emerald-400 text-xs" : "bg-slate-500/20 text-slate-400 text-xs"}>
                        {session.status}
                      </Badge>
                      <Button size="sm" variant="ghost" className="text-sky-400 hover:bg-sky-500/10 h-7 px-3 text-xs">
                        <MessageSquare className="w-3 h-3 mr-1" /> Open
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History */}
        <TabsContent value="history">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                Recent Translations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {TRANSLATION_HISTORY.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-slate-700/50 text-slate-300 text-xs">{item.from}</Badge>
                          <ArrowRightLeft className="w-3 h-3 text-sky-400" />
                          <Badge className="bg-sky-500/20 text-sky-400 text-xs">{item.to}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={item.type === "speech" ? "bg-pink-500/20 text-pink-400 text-xs" : "bg-slate-600/30 text-slate-400 text-xs"}>
                            {item.type === "speech" ? "🎙 Speech" : "📝 Text"}
                          </Badge>
                          <span className="text-xs text-slate-500">{item.time}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <p className="text-sm text-slate-300 bg-slate-800/50 rounded-lg p-2">{item.input}</p>
                        <p className="text-sm text-sky-300 bg-sky-500/5 rounded-lg p-2 border border-sky-500/10">{item.output}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Supported Languages Grid */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Languages className="w-4 h-4 text-sky-400" />
            Supported Languages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-3">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <div
                key={lang.code}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  lang.active
                    ? "bg-sky-500/10 border-sky-500/30 hover:border-sky-400/50"
                    : "bg-slate-800/30 border-slate-700/20 opacity-50"
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <p className="text-xs text-white font-medium mt-1">{lang.name}</p>
                <p className="text-[10px] text-slate-500">{lang.active ? "Active" : "Coming Soon"}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIRALanguageIntelligence;
