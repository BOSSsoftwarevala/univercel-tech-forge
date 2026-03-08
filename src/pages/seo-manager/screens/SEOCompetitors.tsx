import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, TrendingUp, TrendingDown, Globe, Target, Loader2 } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { useSEOCompetitors } from "@/hooks/useSEOData";

const SEOCompetitors = () => {
  const { competitors, loading, addCompetitor } = useSEOCompetitors();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDomain, setNewDomain] = useState("");

  const handleAdd = async () => {
    if (!newDomain.trim()) return;
    await addCompetitor({ competitor_domain: newDomain.trim(), competitor_name: newDomain.trim() });
    setNewDomain("");
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        <span className="ml-3 text-slate-400">Loading competitors...</span>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Competitor Intelligence</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="h-4 w-4 mr-2" /> Add Competitor
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-slate-900/50 border-cyan-500/30">
          <CardContent className="pt-4 pb-3">
            <div className="flex gap-3">
              <Input placeholder="Enter competitor domain (e.g. example.com)" value={newDomain} onChange={e => setNewDomain(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
                className="bg-slate-800/50 border-slate-700 text-white" />
              <Button onClick={handleAdd} className="bg-cyan-600 hover:bg-cyan-700">Add</Button>
              <Button variant="ghost" onClick={() => setShowAddForm(false)} className="text-slate-400">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {competitors.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="pt-8 pb-8 text-center">
            <Users className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">No Competitors Tracked</h3>
            <p className="text-slate-400 text-sm">Add competitor domains to start monitoring their SEO performance.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {competitors.map((comp: any, i: number) => (
            <motion.div key={comp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm text-white font-medium truncate">{comp.competitor_domain}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-800/50 rounded p-2"><p className="text-slate-500">DA</p><p className="text-white font-bold">{comp.domain_authority || "—"}</p></div>
                    <div className="bg-slate-800/50 rounded p-2"><p className="text-slate-500">Traffic</p><p className="text-white font-bold">{comp.organic_traffic ? `${(comp.organic_traffic/1000).toFixed(0)}K` : "—"}</p></div>
                    <div className="bg-slate-800/50 rounded p-2"><p className="text-slate-500">Keywords</p><p className="text-white font-bold">{comp.total_keywords?.toLocaleString() || "—"}</p></div>
                    <div className="bg-slate-800/50 rounded p-2"><p className="text-slate-500">Common</p><p className="text-amber-400 font-bold">{comp.common_keywords || "—"}</p></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SEOCompetitors;
