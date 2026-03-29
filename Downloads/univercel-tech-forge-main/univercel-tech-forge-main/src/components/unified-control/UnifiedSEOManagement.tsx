import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, Globe, TrendingUp, Link2, Target, AlertTriangle,
  Wrench, Sparkles, Plus, Trash2, Play, Square, CreditCard, Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SEOItem {
  id: string;
  domain: string;
  type: string;
  score: number;
  issues: number;
  autoFix: 'enabled' | 'disabled';
  status: 'running' | 'stopped';
  payment: 'paid' | 'unpaid';
  traffic: string;
  leads: number;
}

const SEO_ITEMS: SEOItem[] = [
  { id: 'web-main', domain: 'example.com', type: 'Website SEO', score: 85, issues: 3, autoFix: 'enabled', status: 'running', payment: 'paid', traffic: '45K/mo', leads: 234 },
  { id: 'web-blog', domain: 'blog.example.com', type: 'Website SEO', score: 72, issues: 8, autoFix: 'enabled', status: 'running', payment: 'paid', traffic: '12K/mo', leads: 89 },
  { id: 'app-main', domain: 'App Store', type: 'App SEO', score: 68, issues: 5, autoFix: 'disabled', status: 'running', payment: 'paid', traffic: '8K/mo', leads: 156 },
  { id: 'page-landing', domain: '/landing', type: 'Page SEO', score: 92, issues: 1, autoFix: 'enabled', status: 'running', payment: 'paid', traffic: '20K/mo', leads: 445 },
  { id: 'page-pricing', domain: '/pricing', type: 'Page SEO', score: 78, issues: 4, autoFix: 'enabled', status: 'running', payment: 'paid', traffic: '15K/mo', leads: 312 },
  { id: 'keywords', domain: 'Global', type: 'Keyword Tracking', score: 65, issues: 12, autoFix: 'enabled', status: 'running', payment: 'paid', traffic: '-', leads: 0 },
  { id: 'backlinks', domain: 'Global', type: 'Backlinks', score: 55, issues: 25, autoFix: 'disabled', status: 'running', payment: 'paid', traffic: '-', leads: 0 },
  { id: 'competitor', domain: 'competitor.com', type: 'Competitor SEO', score: 0, issues: 0, autoFix: 'disabled', status: 'stopped', payment: 'unpaid', traffic: '80K/mo', leads: 0 },
  { id: 'technical', domain: 'Global', type: 'Technical SEO', score: 88, issues: 2, autoFix: 'enabled', status: 'running', payment: 'paid', traffic: '-', leads: 0 },
];

const SEO_TYPES = ['All', 'Website SEO', 'App SEO', 'Page SEO', 'Keyword Tracking', 'Backlinks', 'Competitor SEO', 'Technical SEO'];

export const UnifiedSEOManagement = () => {
  const [selectedType, setSelectedType] = useState('All');
  const [items, setItems] = useState(SEO_ITEMS);

  const filteredItems = selectedType === 'All' 
    ? items 
    : items.filter(i => i.type === selectedType);

  const toggleStatus = (id: string) => {
    setItems(items.map(i => 
      i.id === id ? { ...i, status: i.status === 'running' ? 'stopped' : 'running' } : i
    ));
  };

  const totalScore = Math.round(items.filter(i => i.score > 0).reduce((a, b) => a + b.score, 0) / items.filter(i => i.score > 0).length);
  const totalIssues = items.reduce((a, b) => a + b.issues, 0);
  const totalLeads = items.reduce((a, b) => a + b.leads, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-emerald-400" />
            SEO Management
          </h1>
          <p className="text-muted-foreground">Complete SEO control with AI-powered fixes</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <Play className="w-4 h-4 mr-1" /> Run SEO
          </Button>
          <Button size="sm" variant="outline" className="border-violet-500/50 text-violet-400">
            <Sparkles className="w-4 h-4 mr-1" /> AI Fix All
          </Button>
        </div>
      </div>

      {/* Type Tabs */}
      <div className="flex gap-2 flex-wrap">
        {SEO_TYPES.map(type => (
          <Button
            key={type}
            size="sm"
            variant={selectedType === type ? "default" : "outline"}
            onClick={() => setSelectedType(type)}
            className={selectedType === type ? "bg-emerald-600" : ""}
          >
            {type}
          </Button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="bg-slate-900/50 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{totalScore}</p>
            <p className="text-xs text-muted-foreground">Avg SEO Score</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{totalIssues}</p>
            <p className="text-xs text-muted-foreground">Total Issues</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-cyan-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-cyan-400">{totalLeads}</p>
            <p className="text-xs text-muted-foreground">SEO Leads</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{items.filter(i => i.status === 'running').length}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-violet-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-violet-400">{items.filter(i => i.autoFix === 'enabled').length}</p>
            <p className="text-xs text-muted-foreground">Auto-Fix On</p>
          </CardContent>
        </Card>
      </div>

      {/* SEO Table */}
      <Card className="bg-slate-900/50 border-border/50">
        <CardContent className="p-0">
          <div className="rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Domain/Page</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Type</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">SEO Score</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Issues</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Auto-Fix</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Traffic</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Leads</th>
                  <th className="text-right text-xs font-medium text-muted-foreground p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredItems.map((item) => (
                  <motion.tr 
                    key={item.id} 
                    className="hover:bg-slate-800/30 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-medium text-white">{item.domain}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs">{item.type}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Progress value={item.score} className="h-2 w-16" />
                        <span className={`text-sm font-bold ${item.score >= 80 ? 'text-emerald-400' : item.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                          {item.score}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={item.issues === 0 ? 'bg-emerald-500/20 text-emerald-400' : item.issues < 5 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}>
                        {item.issues} issues
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={item.autoFix === 'enabled' ? 'bg-violet-500/20 text-violet-400' : 'bg-slate-500/20 text-slate-400'}>
                        {item.autoFix}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={item.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}>
                        {item.status === 'running' ? '● RUN' : '○ STOP'}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{item.traffic}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-cyan-400" />
                        <span className="text-sm font-medium text-white">{item.leads}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 px-2 text-xs"
                          onClick={() => toggleStatus(item.id)}
                        >
                          {item.status === 'running' ? <Square className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                          {item.status === 'running' ? 'Stop' : 'Run'}
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
