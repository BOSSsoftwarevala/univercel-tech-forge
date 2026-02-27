import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface GenerateDescriptionOptions {
  repoName: string;
  topics?: string[];
  language?: string;
  existingDescription?: string;
}

export const openaiService = {
  // Chat with VALA AI assistant
  async chat(messages: ChatMessage[], userRole?: string, context?: string): Promise<ReadableStream | null> {
    const { data, error } = await supabase.functions.invoke("vala-ai-chat", {
      body: { messages, userRole, context },
    });
    if (error) throw error;
    return data;
  },

  // Auto-generate software description for a marketplace product
  async generateDescription(options: GenerateDescriptionOptions): Promise<string> {
    const { data, error } = await supabase.functions.invoke("ai-demo-assistant", {
      body: {
        type: "generate_description",
        query: `Generate a compelling marketplace description for: ${options.repoName}`,
        demoData: {
          name: options.repoName,
          topics: options.topics || [],
          language: options.language || "",
          existingDescription: options.existingDescription || "",
        },
      },
    });
    if (error) throw error;
    return data?.response || "";
  },

  // Generate CEO insights from metrics
  async generateCEOInsights(metricsData: Record<string, unknown>): Promise<string[]> {
    const { data, error } = await supabase.functions.invoke("ceo-dashboard", {
      body: { action: "insights", metrics: metricsData },
    });
    if (error) throw error;
    return data?.aiInsights || [];
  },

  // Lead scoring with AI
  async scoreLeads(leadData: Record<string, unknown>[]): Promise<{ score: number; probability: number }[]> {
    const { data, error } = await supabase.functions.invoke("ai-reseller-assistant", {
      body: { action: "lead_scoring", data: leadData },
    });
    if (error) throw error;
    return data?.scores || [];
  },
};
