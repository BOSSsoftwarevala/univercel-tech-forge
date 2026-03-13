import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useSEOProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("seo_projects").select("*").order("created_at", { ascending: false });
    if (error) { console.error("SEO projects fetch error:", error); }
    else { setProjects(data || []); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);
  return { projects, loading, refetch: fetchProjects };
};

export const useSEOKeywords = (projectId?: string) => {
  const [keywords, setKeywords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKeywords = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("seo_keywords").select("*").order("created_at", { ascending: false });
    if (projectId) query = query.eq("project_id", projectId);
    const { data, error } = await query;
    if (error) { console.error("SEO keywords fetch error:", error); }
    else { setKeywords(data || []); }
    setLoading(false);
  }, [projectId]);

  const addKeyword = async (keyword: Record<string, any>) => {
    const { data, error } = await supabase.from("seo_keywords").insert([keyword as any]).select().single();
    if (error) { toast.error("Failed to add keyword"); return null; }
    toast.success(`Keyword "${keyword.keyword}" added`);
    fetchKeywords();
    return data;
  };

  const updateKeyword = async (id: string, updates: Record<string, any>) => {
    const { error } = await supabase.from("seo_keywords").update(updates).eq("id", id);
    if (error) { toast.error("Failed to update keyword"); return; }
    fetchKeywords();
  };

  useEffect(() => { fetchKeywords(); }, [fetchKeywords]);
  return { keywords, loading, refetch: fetchKeywords, addKeyword, updateKeyword };
};

export const useSEOBacklinks = (projectId?: string) => {
  const [backlinks, setBacklinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBacklinks = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("seo_backlinks").select("*").order("created_at", { ascending: false });
    if (projectId) query = query.eq("project_id", projectId);
    const { data, error } = await query;
    if (error) { console.error("SEO backlinks fetch error:", error); }
    else { setBacklinks(data || []); }
    setLoading(false);
  }, [projectId]);

  useEffect(() => { fetchBacklinks(); }, [fetchBacklinks]);
  return { backlinks, loading, refetch: fetchBacklinks };
};

export const useSEOAuditReports = (projectId?: string) => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("seo_audit_reports").select("*").order("created_at", { ascending: false });
    if (projectId) query = query.eq("project_id", projectId);
    const { data, error } = await query;
    if (error) { console.error("SEO audit reports fetch error:", error); }
    else { setReports(data || []); }
    setLoading(false);
  }, [projectId]);

  useEffect(() => { fetchReports(); }, [fetchReports]);
  return { reports, loading, refetch: fetchReports };
};

export const useSEOTraffic = (projectId?: string) => {
  const [trafficStats, setTrafficStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTraffic = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("seo_traffic_stats").select("*").order("date", { ascending: true });
    if (projectId) query = query.eq("project_id", projectId);
    const { data, error } = await query;
    if (error) { console.error("SEO traffic fetch error:", error); }
    else { setTrafficStats(data || []); }
    setLoading(false);
  }, [projectId]);

  useEffect(() => { fetchTraffic(); }, [fetchTraffic]);
  return { trafficStats, loading, refetch: fetchTraffic };
};

export const useSEOCompetitors = (projectId?: string) => {
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompetitors = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("seo_competitors").select("*").order("created_at", { ascending: false });
    if (projectId) query = query.eq("project_id", projectId);
    const { data, error } = await query;
    if (error) { console.error("SEO competitors fetch error:", error); }
    else { setCompetitors(data || []); }
    setLoading(false);
  }, [projectId]);

  const addCompetitor = async (competitor: Record<string, any>) => {
    const { data, error } = await supabase.from("seo_competitors").insert([competitor as any]).select().single();
    if (error) { toast.error("Failed to add competitor"); return null; }
    toast.success(`Competitor "${competitor.competitor_domain}" added`);
    fetchCompetitors();
    return data;
  };

  useEffect(() => { fetchCompetitors(); }, [fetchCompetitors]);
  return { competitors, loading, refetch: fetchCompetitors, addCompetitor };
};

export const useSEOActivityLogs = (projectId?: string) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("seo_activity_logs").select("*").order("created_at", { ascending: false }).limit(100);
    if (projectId) query = query.eq("project_id", projectId);
    const { data, error } = await query;
    if (error) { console.error("SEO activity logs fetch error:", error); }
    else { setLogs(data || []); }
    setLoading(false);
  }, [projectId]);

  const addLog = async (log: Record<string, any>) => {
    await supabase.from("seo_activity_logs").insert([log as any]);
    fetchLogs();
  };

  useEffect(() => { fetchLogs(); }, [fetchLogs]);
  return { logs, loading, refetch: fetchLogs, addLog };
};
