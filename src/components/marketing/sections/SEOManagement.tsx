import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Globe, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Link,
  FileText,
  Settings,
  RefreshCw,
  Plus,
  Download
} from "lucide-react";

interface SEOManagementProps {
  activeView: string;
}

const SEOManagement = ({ activeView }: SEOManagementProps) => {
  const keywords = [
    { keyword: "best crm software", volume: 12500, difficulty: 78, position: 4, change: 2 },
    { keyword: "crm for small business", volume: 8900, difficulty: 65, position: 7, change: -1 },
    { keyword: "sales automation tools", volume: 6700, difficulty: 72, position: 12, change: 5 },
    { keyword: "customer management software", volume: 5400, difficulty: 58, position: 3, change: 0 },
    { keyword: "lead tracking system", volume: 4200, difficulty: 45, position: 6, change: 3 },
  ];

  const countryKeywords = [
    { country: "United States", keywords: 245, avgPosition: 8.2, traffic: 45600 },
    { country: "United Kingdom", keywords: 189, avgPosition: 6.5, traffic: 23400 },
    { country: "Germany", keywords: 156, avgPosition: 9.1, traffic: 18900 },
    { country: "India", keywords: 312, avgPosition: 5.8, traffic: 67800 },
    { country: "Australia", keywords: 98, avgPosition: 7.3, traffic: 12300 },
  ];

  const renderKeywordResearch = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Keyword Research</h3>
        <div className="flex gap-2">
          <Input placeholder="Search keywords..." className="w-64 h-9 bg-slate-800 border-slate-700" />
          <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-1" />
            Add Keyword
          </Button>
        </div>
      </div>
      
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr className="text-left text-xs text-slate-400">
                  <th className="p-3">Keyword</th>
                  <th className="p-3">Volume</th>
                  <th className="p-3">Difficulty</th>
                  <th className="p-3">Position</th>
                  <th className="p-3">Change</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((kw, idx) => (
                  <tr key={idx} className="border-t border-slate-700/50">
                    <td className="p-3 text-sm text-white">{kw.keyword}</td>
                    <td className="p-3 text-sm text-slate-300">{kw.volume.toLocaleString()}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Progress value={kw.difficulty} className="w-16 h-1.5" />
                        <span className="text-xs text-slate-400">{kw.difficulty}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className="bg-teal-500/20 text-teal-400">#{kw.position}</Badge>
                    </td>
                    <td className="p-3">
                      <span className={`flex items-center gap-1 text-sm ${kw.change > 0 ? 'text-emerald-400' : kw.change < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                        {kw.change > 0 ? <TrendingUp className="w-3 h-3" /> : kw.change < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                        {kw.change > 0 ? `+${kw.change}` : kw.change}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Search className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Settings className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCountryKeywords = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Country-wise Keywords</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {countryKeywords.map((country, idx) => (
          <Card key={idx} className="bg-slate-800/50 border-slate-700/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-teal-400" />
                  {country.country}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/50 rounded p-2">
                  <span className="text-slate-400">Keywords</span>
                  <p className="text-white font-semibold">{country.keywords}</p>
                </div>
                <div className="bg-slate-900/50 rounded p-2">
                  <span className="text-slate-400">Avg Position</span>
                  <p className="text-teal-400 font-semibold">#{country.avgPosition}</p>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded p-2">
                <span className="text-slate-400 text-xs">Monthly Traffic</span>
                <p className="text-white font-semibold">{country.traffic.toLocaleString()}</p>
              </div>
              <Button size="sm" variant="outline" className="w-full h-7 text-xs border-slate-600">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderOnPageSEO = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">On-page SEO</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-sm text-white">Page Health Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { page: "/home", score: 92, issues: 2 },
              { page: "/products", score: 85, issues: 5 },
              { page: "/pricing", score: 78, issues: 8 },
              { page: "/about", score: 95, issues: 1 },
              { page: "/contact", score: 88, issues: 3 },
            ].map((page, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
                <span className="text-sm text-slate-300">{page.page}</span>
                <div className="flex items-center gap-3">
                  <Progress value={page.score} className="w-24 h-1.5" />
                  <span className="text-sm text-white">{page.score}%</span>
                  {page.issues > 0 && (
                    <Badge className="bg-orange-500/20 text-orange-400 text-[10px]">
                      {page.issues} issues
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-sm text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start border-slate-600">
              <FileText className="w-4 h-4 mr-2" />
              Optimize Meta Tags
            </Button>
            <Button variant="outline" className="w-full justify-start border-slate-600">
              <Link className="w-4 h-4 mr-2" />
              Check Internal Links
            </Button>
            <Button variant="outline" className="w-full justify-start border-slate-600">
              <Search className="w-4 h-4 mr-2" />
              Analyze Content
            </Button>
            <Button variant="outline" className="w-full justify-start border-slate-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderOffPageSEO = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Off-page SEO</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <Link className="w-8 h-8 text-teal-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">1,247</p>
            <p className="text-xs text-slate-400">Total Backlinks</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <Globe className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">324</p>
            <p className="text-xs text-slate-400">Referring Domains</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">68</p>
            <p className="text-xs text-slate-400">Domain Authority</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-sm text-white">Recent Backlinks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { domain: "techcrunch.com", da: 94, type: "dofollow", date: "2 hours ago" },
            { domain: "forbes.com", da: 95, type: "dofollow", date: "1 day ago" },
            { domain: "medium.com", da: 89, type: "nofollow", date: "2 days ago" },
            { domain: "linkedin.com", da: 98, type: "nofollow", date: "3 days ago" },
          ].map((link, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
              <div className="flex items-center gap-2">
                <Link className="w-4 h-4 text-teal-400" />
                <span className="text-sm text-white">{link.domain}</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500/20 text-blue-400 text-[10px]">DA: {link.da}</Badge>
                <Badge className={link.type === 'dofollow' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}>
                  {link.type}
                </Badge>
                <span className="text-xs text-slate-500">{link.date}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderTechnicalSEO = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Technical SEO</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-sm text-white">Core Web Vitals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { metric: "LCP (Largest Contentful Paint)", value: "2.1s", status: "good" },
              { metric: "FID (First Input Delay)", value: "45ms", status: "good" },
              { metric: "CLS (Cumulative Layout Shift)", value: "0.08", status: "good" },
              { metric: "TTFB (Time to First Byte)", value: "0.4s", status: "good" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
                <span className="text-sm text-slate-300">{item.metric}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{item.value}</span>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-sm text-white">Issues to Fix</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { issue: "Missing alt tags on 12 images", severity: "medium" },
              { issue: "3 pages with duplicate meta descriptions", severity: "high" },
              { issue: "Slow loading resources on /products", severity: "high" },
              { issue: "Mobile usability issues on 2 pages", severity: "medium" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 bg-slate-900/50 rounded">
                <AlertTriangle className={`w-4 h-4 ${item.severity === 'high' ? 'text-red-400' : 'text-orange-400'}`} />
                <span className="text-sm text-slate-300 flex-1">{item.issue}</span>
                <Button size="sm" variant="ghost" className="h-6 text-xs">Fix</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSEOAudit = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">SEO Audit</h3>
        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
          <RefreshCw className="w-4 h-4 mr-2" />
          Run Audit
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">156</p>
            <p className="text-xs text-slate-400">Passed</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/10 border-orange-500/30">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">23</p>
            <p className="text-xs text-slate-400">Warnings</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">8</p>
            <p className="text-xs text-slate-400">Errors</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">87%</p>
            <p className="text-xs text-slate-400">Health Score</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderRankingTracker = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Ranking Tracker</h3>
        <Button size="sm" variant="outline" className="border-teal-500/30 text-teal-400">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>
      
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr className="text-left text-xs text-slate-400">
                  <th className="p-3">Keyword</th>
                  <th className="p-3">Current</th>
                  <th className="p-3">Previous</th>
                  <th className="p-3">Change</th>
                  <th className="p-3">Best</th>
                  <th className="p-3">Volume</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((kw, idx) => (
                  <tr key={idx} className="border-t border-slate-700/50">
                    <td className="p-3 text-sm text-white">{kw.keyword}</td>
                    <td className="p-3">
                      <Badge className="bg-teal-500/20 text-teal-400">#{kw.position}</Badge>
                    </td>
                    <td className="p-3 text-sm text-slate-400">#{kw.position - kw.change}</td>
                    <td className="p-3">
                      <span className={`flex items-center gap-1 text-sm ${kw.change > 0 ? 'text-emerald-400' : kw.change < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                        {kw.change > 0 ? <TrendingUp className="w-3 h-3" /> : kw.change < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                        {kw.change > 0 ? `+${kw.change}` : kw.change}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-emerald-400">#{Math.max(1, kw.position - 3)}</td>
                    <td className="p-3 text-sm text-slate-300">{kw.volume.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  switch (activeView) {
    case "seo-keywords":
      return renderKeywordResearch();
    case "seo-country":
      return renderCountryKeywords();
    case "seo-onpage":
      return renderOnPageSEO();
    case "seo-offpage":
      return renderOffPageSEO();
    case "seo-technical":
      return renderTechnicalSEO();
    case "seo-audit":
      return renderSEOAudit();
    case "seo-ranking":
      return renderRankingTracker();
    default:
      return renderKeywordResearch();
  }
};

export default SEOManagement;
