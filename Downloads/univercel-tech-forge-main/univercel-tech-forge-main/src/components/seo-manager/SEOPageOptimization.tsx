import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Edit3, 
  Save,
  Lock,
  CheckCircle,
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { SEOManagerSystem } from "@/hooks/useSEOManagerSystem";

interface PageMeta {
  id: string;
  url: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  schemaType: string;
  status: "optimized" | "needs_work" | "missing_meta";
}

interface SEOPageOptimizationProps {
  system: SEOManagerSystem;
}

const SEOPageOptimization = ({ system }: SEOPageOptimizationProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PageMeta>>({});
  const pages: PageMeta[] = [
    ...(system.dashboard?.landingPages || []).map((page) => ({
      id: page.id,
      url: page.published_url || `/landing/${page.page_slug}`,
      title: page.title,
      description: page.hero_subtitle || "",
      ogTitle: page.title,
      ogDescription: page.hero_subtitle || "",
      schemaType: "WebPage",
      status: page.seo_score >= 85 ? "optimized" : page.seo_score >= 65 ? "needs_work" : "missing_meta",
    })),
    ...(system.dashboard?.blogs || []).slice(0, 5).map((blog) => ({
      id: blog.id,
      url: blog.published_url || `/blog/${blog.slug}`,
      title: blog.meta_title || blog.title,
      description: blog.meta_description || "",
      ogTitle: blog.meta_title || blog.title,
      ogDescription: blog.meta_description || "",
      schemaType: "Article",
      status: blog.seo_score >= 85 ? "optimized" : blog.seo_score >= 65 ? "needs_work" : "missing_meta",
    })),
  ];

  const getStatusBadge = (status: PageMeta["status"]) => {
    switch (status) {
      case "optimized":
        return <Badge className="bg-emerald-500/20 text-emerald-400"><CheckCircle className="h-3 w-3 mr-1" />Optimized</Badge>;
      case "needs_work":
        return <Badge className="bg-amber-500/20 text-amber-400"><AlertTriangle className="h-3 w-3 mr-1" />Needs Work</Badge>;
      case "missing_meta":
        return <Badge className="bg-red-500/20 text-red-400"><AlertTriangle className="h-3 w-3 mr-1" />Missing Meta</Badge>;
      default:
        return null;
    }
  };

  const handleEdit = (page: PageMeta) => {
    setEditingId(page.id);
    setEditForm({
      title: page.title,
      description: page.description,
      ogTitle: page.ogTitle,
      ogDescription: page.ogDescription,
    });
  };

  const handleSave = (id: string) => {
    system.updateMetaMutation.mutate({
      page_path: pages.find((page) => page.id === id)?.url || "/",
      title: editForm.title,
      description: editForm.description,
      og_title: editForm.ogTitle,
      og_description: editForm.ogDescription,
      schema_type: pages.find((page) => page.id === id)?.schemaType,
    }, {
      onSuccess: () => {
        toast({
          title: "Meta Updated",
          description: `Page meta for ${id} saved. Change logged.`,
        });
        setEditingId(null);
        setEditForm({});
      },
      onError: (error) => {
        toast({ title: "Meta Update Failed", description: error.message, variant: "destructive" });
      },
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-100">
          <FileText className="h-5 w-5 text-cyan-400" />
          Page Optimization
          <Badge variant="outline" className="ml-auto bg-amber-500/20 text-amber-400 border-amber-500/30">
            Meta Only
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Editable Fields Notice */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-xs text-blue-400">
            <strong>Editable:</strong> Meta title, Meta description, OpenGraph, Schema (approved templates).
            <br />
            <strong className="text-red-400">Blocked:</strong> Full content edit, URL change without redirect approval.
          </p>
        </div>

        {pages.map((page, index) => (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-100">{page.url}</span>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </div>
                <Badge className="mt-1 bg-slate-700/50 text-slate-300 text-xs">
                  Schema: {page.schemaType}
                </Badge>
              </div>
              {getStatusBadge(page.status)}
            </div>

            {editingId === page.id ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400">Meta Title</label>
                  <Input
                    value={editForm.title || ""}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="bg-slate-900 border-slate-700 text-slate-100 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Meta Description</label>
                  <Textarea
                    value={editForm.description || ""}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="bg-slate-900 border-slate-700 text-slate-100 text-sm"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400">OG Title</label>
                    <Input
                      value={editForm.ogTitle || ""}
                      onChange={(e) => setEditForm({ ...editForm, ogTitle: e.target.value })}
                      className="bg-slate-900 border-slate-700 text-slate-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">OG Description</label>
                    <Input
                      value={editForm.ogDescription || ""}
                      onChange={(e) => setEditForm({ ...editForm, ogDescription: e.target.value })}
                      className="bg-slate-900 border-slate-700 text-slate-100 text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSave(page.id)} className="bg-emerald-600 hover:bg-emerald-500">
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-slate-400">Title</p>
                  <p className="text-sm text-slate-200">{page.title || <span className="text-red-400">Missing</span>}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Description</p>
                  <p className="text-sm text-slate-200 truncate">{page.description || <span className="text-red-400">Missing</span>}</p>
                </div>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => handleEdit(page)}>
                  <Edit3 className="h-3 w-3 mr-1" />
                  Edit Meta
                </Button>
              </div>
            )}
          </motion.div>
        ))}

        {/* URL Change Notice */}
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
          <Lock className="h-4 w-4 text-red-400 mt-0.5" />
          <p className="text-xs text-red-400">
            URL changes require redirect approval. Direct URL editing is BLOCKED.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SEOPageOptimization;
