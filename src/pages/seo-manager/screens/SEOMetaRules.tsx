import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, FileText, Link, Code, Edit, Trash2, CheckCircle, Clock, Eye } from "lucide-react";
import { toast } from "sonner";

interface Rule {
  id: string;
  pattern: string;
  template: string;
  status: "active" | "pending" | "draft";
  lastApplied: string;
  pagesAffected: number;
}

const SEOMetaRules = () => {
  const [titleRules, setTitleRules] = useState<Rule[]>([
    { id: "TR001", pattern: "Product Pages", template: "{Product Name} — {Category} | Software Vala", status: "active", lastApplied: "2 hrs ago", pagesAffected: 48 },
    { id: "TR002", pattern: "Blog Posts", template: "{Title} — {Category} Blog | Software Vala", status: "active", lastApplied: "1 hr ago", pagesAffected: 156 },
    { id: "TR003", pattern: "Service Pages", template: "Professional {Service} Services | Software Vala", status: "active", lastApplied: "3 hrs ago", pagesAffected: 24 },
    { id: "TR004", pattern: "Landing Pages", template: "{Campaign} — Get Started Free | Software Vala", status: "pending", lastApplied: "Never", pagesAffected: 0 },
  ]);

  const [descRules] = useState<Rule[]>([
    { id: "DR001", pattern: "Product Pages", template: "Discover {Product Name}. {Short Description}. Start free trial today.", status: "active", lastApplied: "2 hrs ago", pagesAffected: 48 },
    { id: "DR002", pattern: "Blog Posts", template: "{Excerpt}. Read the full guide on {Topic}.", status: "active", lastApplied: "1 hr ago", pagesAffected: 156 },
    { id: "DR003", pattern: "Service Pages", template: "Get professional {Service} from Software Vala. Trusted by 10K+ businesses.", status: "active", lastApplied: "3 hrs ago", pagesAffected: 24 },
  ]);

  const [canonicalRules] = useState([
    { id: "CR001", rule: "Remove trailing slashes", enabled: true },
    { id: "CR002", rule: "Force HTTPS", enabled: true },
    { id: "CR003", rule: "Remove query parameters from canonical", enabled: true },
    { id: "CR004", rule: "Lowercase all URLs", enabled: true },
    { id: "CR005", rule: "Remove www prefix", enabled: false },
  ]);

  const [schemaRules] = useState([
    { id: "SR001", type: "Organization", pages: "All Pages", status: "active", properties: 12 },
    { id: "SR002", type: "Product", pages: "Product Pages", status: "active", properties: 18 },
    { id: "SR003", type: "Article", pages: "Blog Posts", status: "active", properties: 14 },
    { id: "SR004", type: "LocalBusiness", pages: "Contact Page", status: "pending", properties: 8 },
    { id: "SR005", type: "FAQ", pages: "FAQ & Help Pages", status: "active", properties: 6 },
    { id: "SR006", type: "BreadcrumbList", pages: "All Pages", status: "active", properties: 4 },
  ]);

  const getStatusBadge = (s: string) => {
    const m: Record<string, string> = { active: "bg-emerald-500/20 text-emerald-400", pending: "bg-amber-500/20 text-amber-400", draft: "bg-slate-500/20 text-slate-400" };
    return m[s] || m.draft;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Meta Rules & Schema</h2>
        <Button onClick={() => toast.info("Rule proposal submitted for approval")} className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="h-4 w-4 mr-2" /> Propose Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Title Rules */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-400 text-base flex items-center gap-2"><FileText className="h-5 w-5" /> Title Tag Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {titleRules.map(rule => (
              <div key={rule.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">{rule.pattern}</span>
                    <Badge className={getStatusBadge(rule.status)}>{rule.status}</Badge>
                  </div>
                  <span className="text-xs text-slate-500">{rule.pagesAffected} pages</span>
                </div>
                <code className="text-xs text-cyan-400/80 bg-slate-900/50 px-2 py-1 rounded block font-mono">{rule.template}</code>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" /> {rule.lastApplied}</span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => toast.info("Viewing preview...")}><Eye className="h-3 w-3 text-slate-400" /></Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => toast.info("Edit submitted for approval")}><Edit className="h-3 w-3 text-slate-400" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Description Rules */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-400 text-base flex items-center gap-2"><FileText className="h-5 w-5" /> Description Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {descRules.map(rule => (
              <div key={rule.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">{rule.pattern}</span>
                    <Badge className={getStatusBadge(rule.status)}>{rule.status}</Badge>
                  </div>
                  <span className="text-xs text-slate-500">{rule.pagesAffected} pages</span>
                </div>
                <code className="text-xs text-cyan-400/80 bg-slate-900/50 px-2 py-1 rounded block font-mono">{rule.template}</code>
                <span className="text-xs text-slate-500 flex items-center gap-1 mt-2"><Clock className="h-3 w-3" /> {rule.lastApplied}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Canonical Rules */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-400 text-base flex items-center gap-2"><Link className="h-5 w-5" /> Canonical URL Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {canonicalRules.map(rule => (
              <div key={rule.id} className="flex justify-between items-center bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                <span className="text-slate-300 text-sm">{rule.rule}</span>
                <Switch checked={rule.enabled} onCheckedChange={() => toast.info("Toggle requires approval")} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Schema Rules */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-400 text-base flex items-center gap-2"><Code className="h-5 w-5" /> Schema Markup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {schemaRules.map(rule => (
              <div key={rule.id} className="flex justify-between items-center bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">{rule.type}</span>
                    <Badge className={getStatusBadge(rule.status)}>{rule.status}</Badge>
                  </div>
                  <span className="text-xs text-slate-500">{rule.pages} · {rule.properties} properties</span>
                </div>
                <Button size="sm" variant="ghost" className="h-7 text-xs text-cyan-400" onClick={() => toast.info(`Viewing ${rule.type} schema`)}>
                  <Eye className="h-3 w-3 mr-1" /> View
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default SEOMetaRules;
