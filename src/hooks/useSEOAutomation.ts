import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type SEOAutomationType = "meta_tags" | "social_post" | "reels_script" | "auto_reply" | "content_plan";

interface UseSEOAutomationReturn {
  isLoading: boolean;
  error: string | null;
  generateMetaTags: (data: MetaTagsInput) => Promise<MetaTagsResult | null>;
  generateSocialPost: (data: SocialPostInput) => Promise<SocialPostResult | null>;
  generateReelsScript: (data: ReelsScriptInput) => Promise<ReelsScriptResult | null>;
  generateAutoReply: (data: AutoReplyInput) => Promise<AutoReplyResult | null>;
  generateContentPlan: (data: ContentPlanInput) => Promise<ContentPlanResult | null>;
}

interface MetaTagsInput {
  url?: string;
  business?: string;
  keywords?: string;
  region?: string;
  pageType?: string;
}

interface MetaTagsResult {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  keywords: string[];
  schema: string;
}

interface SocialPostInput {
  topic?: string;
  brand?: string;
  tone?: string;
  audience?: string;
  cta?: string;
  region?: string;
}

interface SocialPostResult {
  instagram: { caption: string; hashtags: string[] };
  facebook: { post: string; callToAction: string };
  linkedin: { post: string };
  twitter: { tweet: string };
  youtube: { title: string; description: string; tags: string[] };
}

interface ReelsScriptInput {
  topic?: string;
  style?: string;
  duration?: string;
  brand?: string;
  goal?: string;
  platform?: string;
}

interface ReelsScriptResult {
  hook: string;
  script: string;
  scenes: string[];
  duration: number;
  music: string;
  captions: string[];
  hashtags: string[];
  thumbnail: string;
}

interface AutoReplyInput {
  platform?: string;
  comment: string;
  brand?: string;
  context?: string;
}

interface AutoReplyResult {
  reply: string;
  sentiment: string;
  suggestedAction: string;
  tone: string;
}

interface ContentPlanInput {
  business?: string;
  goals?: string;
  platforms?: string[];
  industry?: string;
  region?: string;
  duration?: string;
}

interface ContentPlanResult {
  weeklyPlan: Array<{ day: string; posts: any[] }>;
  contentPillars: string[];
  postingSchedule: Record<string, string>;
  campaigns: string[];
  keywordFocus: string[];
}

export const useSEOAutomation = (): UseSEOAutomationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callAPI = async <T>(type: SEOAutomationType, data: Record<string, any>): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: response, error: fnError } = await supabase.functions.invoke("ai-seo-automation", {
        body: { type, data },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (response?.error) {
        throw new Error(response.error);
      }

      return response?.result as T;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate content";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    generateMetaTags: (data) => callAPI<MetaTagsResult>("meta_tags", data),
    generateSocialPost: (data) => callAPI<SocialPostResult>("social_post", data),
    generateReelsScript: (data) => callAPI<ReelsScriptResult>("reels_script", data),
    generateAutoReply: (data) => callAPI<AutoReplyResult>("auto_reply", data),
    generateContentPlan: (data) => callAPI<ContentPlanResult>("content_plan", data),
  };
};
