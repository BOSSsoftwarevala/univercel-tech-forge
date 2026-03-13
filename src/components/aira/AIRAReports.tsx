/**
 * AIRA Reports — Daily / Weekly / Monthly Executive Intelligence
 * Streams AI-generated reports from live system data
 */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FileText, Calendar, TrendingUp, BarChart3, Loader2,
  Download, Send, RefreshCw, Clock, CheckCircle2, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

type ReportType = "daily" | "weekly" | "monthly";

const REPORT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/aira-report`;

const REPORT_CONFIG: Record<ReportType, { label: string; icon: typeof FileText; description: string; color: string }> = {
  daily: { label: "Daily Intelligence", icon: Clock, description: "System health, alerts, deployments, marketplace", color: "blue" },
  weekly: { label: "Weekly Growth", icon: TrendingUp, description: "Revenue trends, product performance, user growth", color: "emerald" },
  monthly: { label: "Monthly Strategic", icon: BarChart3, description: "Market expansion, risk alerts, growth opportunities", color: "violet" },
};

export default function AIRAReports() {
  const [activeType, setActiveType] = useState<ReportType>("daily");
  const [report, setReport] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Record<string, Date | null>>({
    daily: null, weekly: null, monthly: null,
  });
  const [savedReports, setSavedReports] = useState<Record<string, string>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [report]);

  // Load saved report when switching tabs
  useEffect(() => {
    setReport(savedReports[activeType] || "");
  }, [activeType, savedReports]);

  const generateReport = useCallback(async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setReport("");

    let reportSoFar = "";

    try {
      const resp = await fetch(REPORT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ reportType: activeType }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({ error: "Connection failed" }));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              reportSoFar += content;
              setReport(reportSoFar);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw || raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              reportSoFar += content;
              setReport(reportSoFar);
            }
          } catch {}
        }
      }

      setSavedReports(prev => ({ ...prev, [activeType]: reportSoFar }));
      setLastGenerated(prev => ({ ...prev, [activeType]: new Date() }));
      toast.success(`${REPORT_CONFIG[activeType].label} report generated`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Report generation failed");
    } finally {
      setIsGenerating(false);
    }
  }, [activeType, isGenerating]);

  const submitToBossPanel = async () => {
    if (!report) { toast.error("Generate a report first"); return; }
    try {
      await (supabase as any).from("system_events").insert({
        event_type: `aira_${activeType}_report`,
        source_role: "ceo",
        payload: { reportType: activeType, content: report.substring(0, 5000), generated_at: new Date().toISOString() },
        status: "PENDING",
      });
      toast.success("Report submitted to Boss Panel");
    } catch { toast.error("Submission failed"); }
  };

  return (
    <div className="space-y-4">
      {/* Report Type Selector */}
      <div className="grid grid-cols-3 gap-3">
        {(Object.entries(REPORT_CONFIG) as [ReportType, typeof REPORT_CONFIG["daily"]][]).map(([type, cfg]) => (
          <Card
            key={type}
            onClick={() => !isGenerating && setActiveType(type)}
            className={`cursor-pointer transition-all ${
              activeType === type
                ? "bg-slate-800/80 border-violet-500/50 shadow-lg shadow-violet-500/10"
                : "bg-slate-900/60 border-slate-700/40 hover:border-slate-600/60"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <cfg.icon className={`w-4 h-4 ${activeType === type ? "text-violet-400" : "text-slate-500"}`} />
                <span className={`text-sm font-semibold ${activeType === type ? "text-white" : "text-slate-400"}`}>
                  {cfg.label}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">{cfg.description}</p>
              {lastGenerated[type] && (
                <Badge variant="outline" className="mt-2 text-[9px] border-slate-700 text-slate-500">
                  <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                  {lastGenerated[type]!.toLocaleTimeString()}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="flex items-center gap-2">
        <Button
          onClick={generateReport}
          disabled={isGenerating}
          size="sm"
          className="gap-1.5 bg-violet-600 hover:bg-violet-500 text-white"
        >
          {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          {isGenerating ? "Generating..." : `Generate ${REPORT_CONFIG[activeType].label}`}
        </Button>
        <Button
          onClick={submitToBossPanel}
          disabled={!report || isGenerating}
          variant="outline"
          size="sm"
          className="gap-1.5 text-slate-300 border-slate-700/50 hover:bg-violet-500/20 hover:text-violet-300"
        >
          <Send className="w-3.5 h-3.5" />
          Submit to Boss Panel
        </Button>
      </div>

      {/* Report Content */}
      <Card className="bg-slate-900/60 border-slate-700/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet-400" />
            {REPORT_CONFIG[activeType].label} Report
            {isGenerating && (
              <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/50 text-[9px] animate-pulse">
                GENERATING
              </Badge>
            )}
            {report && !isGenerating && (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 text-[9px]">
                COMPLETE
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {report ? (
              <div className="prose prose-sm prose-invert max-w-none
                [&>h1]:text-lg [&>h1]:text-white [&>h1]:font-bold [&>h1]:border-b [&>h1]:border-slate-700/50 [&>h1]:pb-2 [&>h1]:mb-4
                [&>h2]:text-sm [&>h2]:text-violet-300 [&>h2]:font-semibold [&>h2]:mt-4 [&>h2]:mb-2
                [&>h3]:text-xs [&>h3]:text-slate-300 [&>h3]:font-medium
                [&>p]:text-slate-400 [&>p]:text-xs [&>p]:leading-relaxed
                [&>ul]:text-slate-400 [&>ul]:text-xs
                [&>ol]:text-slate-400 [&>ol]:text-xs
                [&_strong]:text-white
                [&_li]:mb-1">
                <ReactMarkdown>{report}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <FileText className="w-12 h-12 text-slate-700 mb-3" />
                <p className="text-sm text-slate-500">No report generated yet</p>
                <p className="text-[10px] text-slate-600 mt-1">
                  Click "Generate" to create a {REPORT_CONFIG[activeType].label.toLowerCase()} report
                </p>
              </div>
            )}
            <div ref={bottomRef} />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
