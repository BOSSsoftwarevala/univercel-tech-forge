import { motion } from 'framer-motion';
import { 
  Search, TrendingUp, Globe, FileText, BarChart3,
  Target, Link2, Languages, Zap, AlertCircle
} from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const SEOManagerDashboard = () => {
  const seoStats = {
    totalKeywords: 2456,
    ranking1to10: 342,
    ranking11to50: 892,
    organicTraffic: 45678,
    backlinks: 1234,
    domainAuthority: 42
  };

  const keywordRankings = [
    { keyword: 'software development india', position: 3, change: 2, volume: 12000 },
    { keyword: 'web app development', position: 7, change: -1, volume: 8500 },
    { keyword: 'mobile app company', position: 12, change: 5, volume: 15000 },
    { keyword: 'custom software solutions', position: 5, change: 0, volume: 6200 },
    { keyword: 'enterprise software', position: 18, change: 3, volume: 4800 },
  ];

  const pagePerformance = [
    { page: '/services/web-development', score: 92, issues: 2 },
    { page: '/services/mobile-apps', score: 88, issues: 3 },
    { page: '/portfolio', score: 95, issues: 0 },
    { page: '/about', score: 76, issues: 5 },
    { page: '/contact', score: 84, issues: 4 },
  ];

  const languages = [
    { lang: 'English', pages: 156, completion: 100 },
    { lang: 'Hindi', pages: 142, completion: 91 },
    { lang: 'Arabic', pages: 89, completion: 57 },
    { lang: 'Spanish', pages: 124, completion: 79 },
    { lang: 'French', pages: 98, completion: 63 },
  ];

  return (
    <DashboardLayout roleOverride="seo_manager">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-mono font-bold text-foreground">SEO Command Center</h1>
            <p className="text-muted-foreground">Keyword tracking & optimization</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              SEO Report
            </Button>
            <Button className="gap-2 bg-neon-green/20 text-neon-green border border-neon-green/50">
              <Zap className="w-4 h-4" />
              Run Audit
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Keywords', value: seoStats.totalKeywords.toLocaleString(), icon: Search, color: 'text-primary' },
            { label: 'Top 10 Rankings', value: seoStats.ranking1to10, icon: TrendingUp, color: 'text-neon-green' },
            { label: 'Top 50 Rankings', value: seoStats.ranking11to50, icon: Target, color: 'text-neon-cyan' },
            { label: 'Organic Traffic', value: seoStats.organicTraffic.toLocaleString(), icon: Globe, color: 'text-neon-purple' },
            { label: 'Backlinks', value: seoStats.backlinks.toLocaleString(), icon: Link2, color: 'text-neon-blue' },
            { label: 'Domain Authority', value: seoStats.domainAuthority, icon: BarChart3, color: 'text-neon-orange' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="glass-panel">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-mono font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Keyword Rankings */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg font-mono flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Top Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {keywordRankings.map((kw, i) => (
                  <div 
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{kw.keyword}</p>
                      <p className="text-xs text-muted-foreground">Volume: {kw.volume.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`font-mono ${
                        kw.position <= 10 ? 'bg-neon-green/20 text-neon-green' :
                        kw.position <= 20 ? 'bg-neon-cyan/20 text-neon-cyan' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        #{kw.position}
                      </Badge>
                      <span className={`text-xs font-mono ${
                        kw.change > 0 ? 'text-neon-green' :
                        kw.change < 0 ? 'text-neon-red' :
                        'text-muted-foreground'
                      }`}>
                        {kw.change > 0 ? `↑${kw.change}` : kw.change < 0 ? `↓${Math.abs(kw.change)}` : '—'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Page Performance */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg font-mono flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Page SEO Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pagePerformance.map((page, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground truncate flex-1 mr-2">{page.page}</span>
                      <div className="flex items-center gap-2">
                        {page.issues > 0 && (
                          <Badge variant="outline" className="text-xs border-neon-orange/50 text-neon-orange">
                            {page.issues} issues
                          </Badge>
                        )}
                        <span className={`font-mono font-bold ${
                          page.score >= 90 ? 'text-neon-green' :
                          page.score >= 70 ? 'text-neon-orange' :
                          'text-neon-red'
                        }`}>{page.score}</span>
                      </div>
                    </div>
                    <Progress value={page.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Multi-language SEO */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg font-mono flex items-center gap-2">
              <Languages className="w-5 h-5 text-primary" />
              Multi-language SEO Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {languages.map((lang) => (
                <div key={lang.lang} className="p-4 rounded-lg bg-secondary/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{lang.lang}</span>
                    <span className={`text-xs font-mono ${
                      lang.completion === 100 ? 'text-neon-green' :
                      lang.completion >= 80 ? 'text-neon-cyan' :
                      'text-neon-orange'
                    }`}>{lang.completion}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{lang.pages} pages</p>
                  <Progress value={lang.completion} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SEO Alerts */}
        <Card className="glass-panel border-neon-orange/30">
          <CardHeader>
            <CardTitle className="text-lg font-mono flex items-center gap-2 text-neon-orange">
              <AlertCircle className="w-5 h-5" />
              SEO Issues (12)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { issue: 'Missing Meta Descriptions', count: 5, severity: 'high' },
                { issue: 'Slow Page Speed', count: 3, severity: 'medium' },
                { issue: 'Broken Links', count: 2, severity: 'high' },
                { issue: 'Missing Alt Text', count: 8, severity: 'low' },
                { issue: 'Duplicate Content', count: 1, severity: 'medium' },
                { issue: 'Mobile Usability', count: 2, severity: 'high' },
              ].map((alert, i) => (
                <div 
                  key={i}
                  className={`p-3 rounded-lg border ${
                    alert.severity === 'high' ? 'bg-neon-red/10 border-neon-red/30' :
                    alert.severity === 'medium' ? 'bg-neon-orange/10 border-neon-orange/30' :
                    'bg-muted/10 border-muted/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{alert.issue}</span>
                    <Badge variant="outline" className="text-xs">{alert.count}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SEOManagerDashboard;
