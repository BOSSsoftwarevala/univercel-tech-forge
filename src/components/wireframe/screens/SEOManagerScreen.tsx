import React from 'react';
import { 
  Search, Globe, TrendingUp, FileText, Calendar, BarChart3,
  Plus, RefreshCw, ExternalLink, Target, ArrowUp, ArrowDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

export function SEOManagerScreen() {
  const isDark = true;

  const keywords = [
    { keyword: 'school erp software', rank: 3, change: 2, volume: 12000, region: 'India' },
    { keyword: 'hospital management system', rank: 5, change: -1, volume: 8500, region: 'India' },
    { keyword: 'pos billing software', rank: 8, change: 3, volume: 6200, region: 'India' },
    { keyword: 'crm software for small business', rank: 12, change: 0, volume: 15000, region: 'Global' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Search className="h-6 w-6 text-emerald-500" />
            SEO Manager
          </h1>
          <p className="text-muted-foreground">Search optimization & keyword tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Rankings
          </Button>
          <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500">
            <Plus className="h-4 w-4 mr-2" />
            Add Keyword
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Keywords Tracked', value: '45', icon: Target, color: 'bg-emerald-500' },
          { title: 'Avg. Position', value: '8.2', icon: TrendingUp, color: 'bg-cyan-500' },
          { title: 'Top 10 Keywords', value: '28', icon: ArrowUp, color: 'bg-purple-500' },
          { title: 'Pages Optimized', value: '156', icon: FileText, color: 'bg-amber-500' },
        ].map((stat, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Meta/Keyword Generator */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-500" />
          Meta/Keyword Generator
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Page URL</label>
            <Input placeholder="/products/school-erp" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Target Region</label>
            <Select defaultValue="india">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="india">India</SelectItem>
                <SelectItem value="usa">USA</SelectItem>
                <SelectItem value="uk">UK</SelectItem>
                <SelectItem value="global">Global</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground mb-1 block">Meta Title</label>
            <Input placeholder="Best School ERP Software in India | Software Vala" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground mb-1 block">Meta Description</label>
            <Textarea placeholder="Comprehensive school management software with admission, fees, attendance..." rows={3} />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <Button>Generate with AI</Button>
          <Button variant="outline">Save Changes</Button>
        </div>
      </div>

      {/* Keyword Tracking Table */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-500" />
            Rank Tracking
          </h3>
          <div className="flex items-center gap-2">
            <Select defaultValue="india">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="india">India</SelectItem>
                <SelectItem value="global">Global</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className={`rounded-lg overflow-hidden border ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
          <table className="w-full">
            <thead className={isDark ? 'bg-slate-700/50' : 'bg-gray-50'}>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Keyword</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Position</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Change</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Volume</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Region</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {keywords.map((kw, idx) => (
                <tr key={idx} className={`hover:bg-slate-800/50 ${isDark ? '' : 'hover:bg-gray-50'}`}>
                  <td className="px-4 py-3 font-medium">{kw.keyword}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={kw.rank <= 10 ? 'bg-emerald-500' : 'bg-amber-500'}>
                      #{kw.rank}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`flex items-center justify-center gap-1 ${
                      kw.change > 0 ? 'text-emerald-500' : kw.change < 0 ? 'text-red-500' : 'text-muted-foreground'
                    }`}>
                      {kw.change > 0 ? <ArrowUp className="h-3 w-3" /> : kw.change < 0 ? <ArrowDown className="h-3 w-3" /> : null}
                      {Math.abs(kw.change)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{kw.volume.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="outline" className="text-xs">{kw.region}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Auto Publish Scheduler */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-purple-500" />
            <div>
              <h3 className="font-semibold">Auto Publish Scheduler</h3>
              <p className="text-sm text-muted-foreground">Schedule meta updates and content publishing</p>
            </div>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Update
          </Button>
        </div>
      </div>
    </div>
  );
}
