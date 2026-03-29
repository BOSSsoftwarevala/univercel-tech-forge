import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Search,
  Globe,
  FileCode,
  Link2,
  MapPin,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Download,
  Loader2,
  Code,
  FileText,
  Target,
} from 'lucide-react';

interface SEOPage {
  id: string;
  url: string;
  title: string;
  meta_description: string;
  score: number;
  issues: string[];
  indexed: boolean;
  last_crawled: string | null;
}

interface Keyword {
  keyword: string;
  volume: number;
  difficulty: number;
  position: number | null;
  trend: 'up' | 'down' | 'stable';
}

const MMSEOManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('technical');
  const [pages, setPages] = useState<SEOPage[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [robotsTxt, setRobotsTxt] = useState('User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\n\nSitemap: https://example.com/sitemap.xml');
  const [schemaMarkup, setSchemaMarkup] = useState('');

  useEffect(() => {
    fetchSEOData();
  }, []);

  const fetchSEOData = async () => {
    setLoading(true);
    // Mock SEO data - in production would come from actual crawl
    const mockPages: SEOPage[] = [
      { id: '1', url: '/', title: 'Home - Enterprise Software', meta_description: 'Leading enterprise software solutions', score: 85, issues: [], indexed: true, last_crawled: new Date().toISOString() },
      { id: '2', url: '/products', title: 'Products', meta_description: 'Browse our product catalog', score: 72, issues: ['Title too short', 'Missing H1'], indexed: true, last_crawled: new Date().toISOString() },
      { id: '3', url: '/about', title: 'About Us', meta_description: '', score: 45, issues: ['Missing meta description', 'No schema markup'], indexed: false, last_crawled: null },
    ];

    const mockKeywords: Keyword[] = [
      { keyword: 'enterprise software', volume: 12000, difficulty: 75, position: 8, trend: 'up' },
      { keyword: 'business management tool', volume: 8500, difficulty: 65, position: 15, trend: 'stable' },
      { keyword: 'SaaS platform', volume: 15000, difficulty: 80, position: null, trend: 'down' },
      { keyword: 'franchise software', volume: 3200, difficulty: 45, position: 3, trend: 'up' },
    ];

    setPages(mockPages);
    setKeywords(mockKeywords);
    setLoading(false);
  };

  const runAISEOAnalysis = async () => {
    setAnalyzing(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add AI-generated recommendations
      setPages(prev => prev.map(page => ({
        ...page,
        issues: page.score < 70 
          ? [...page.issues, 'AI: Add more internal links', 'AI: Optimize images with alt tags']
          : page.issues
      })));

      toast.success('AI SEO analysis complete');
    } catch (error) {
      toast.error('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const generateSitemap = () => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>https://example.com${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.url === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Sitemap generated');
  };

  const generateSchema = (type: string) => {
    const schemas: Record<string, string> = {
      organization: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-xxx-xxx-xxxx",
    "contactType": "customer service"
  }
}`,
      product: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "offers": {
    "@type": "Offer",
    "price": "99.99",
    "priceCurrency": "USD"
  }
}`,
      faq: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Question 1?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Answer 1"
    }
  }]
}`,
    };
    setSchemaMarkup(schemas[type] || '');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const overallScore = pages.length > 0 
    ? Math.round(pages.reduce((sum, p) => sum + p.score, 0) / pages.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <Search className="w-6 h-6 text-emerald-400" />
            SEO Management
          </h2>
          <p className="text-slate-400 text-sm">Technical, On-Page, Off-Page & AI SEO</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchSEOData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={runAISEOAnalysis} disabled={analyzing} className="bg-emerald-600 hover:bg-emerald-700">
            {analyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            AI Analysis
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex items-center gap-8">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-700" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray={`${overallScore * 2.51} 251`} className={getScoreColor(overallScore)} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}</span>
                <span className="text-xs text-slate-400">Score</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{pages.length}</div>
                <p className="text-xs text-slate-400">Total Pages</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{pages.filter(p => p.indexed).length}</div>
                <p className="text-xs text-slate-400">Indexed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{pages.reduce((sum, p) => sum + p.issues.length, 0)}</div>
                <p className="text-xs text-slate-400">Issues</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">{keywords.filter(k => k.position && k.position <= 10).length}</div>
                <p className="text-xs text-slate-400">Top 10 Keywords</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="technical" className="data-[state=active]:bg-emerald-600">
            <FileCode className="w-4 h-4 mr-2" />
            Technical
          </TabsTrigger>
          <TabsTrigger value="onpage" className="data-[state=active]:bg-emerald-600">
            <FileText className="w-4 h-4 mr-2" />
            On-Page
          </TabsTrigger>
          <TabsTrigger value="offpage" className="data-[state=active]:bg-emerald-600">
            <Link2 className="w-4 h-4 mr-2" />
            Off-Page
          </TabsTrigger>
          <TabsTrigger value="local" className="data-[state=active]:bg-emerald-600">
            <MapPin className="w-4 h-4 mr-2" />
            Local SEO
          </TabsTrigger>
          <TabsTrigger value="keywords" className="data-[state=active]:bg-emerald-600">
            <Target className="w-4 h-4 mr-2" />
            Keywords
          </TabsTrigger>
        </TabsList>

        {/* Technical SEO */}
        <TabsContent value="technical" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Robots.txt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={robotsTxt}
                  onChange={(e) => setRobotsTxt(e.target.value)}
                  className="font-mono text-xs h-40 bg-slate-900 border-slate-600 text-slate-300"
                />
                <Button size="sm" className="mt-3" variant="outline">
                  <Download className="w-3 h-3 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Sitemap Generator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400 mb-4">
                  Generate XML sitemap from {pages.length} indexed pages.
                </p>
                <div className="space-y-2">
                  <Button onClick={generateSitemap} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Sitemap
                  </Button>
                  <Button variant="outline" className="w-full">
                    Submit to Google
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Crawl Status */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm text-white">Page Crawl Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {pages.map(page => (
                    <div key={page.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900">
                      <div className="flex items-center gap-3">
                        {page.indexed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        )}
                        <div>
                          <p className="text-sm text-white">{page.url}</p>
                          <p className="text-xs text-slate-400">{page.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={page.indexed ? 'default' : 'secondary'}>
                          {page.indexed ? 'Indexed' : 'Not Indexed'}
                        </Badge>
                        <span className={`text-sm font-bold ${getScoreColor(page.score)}`}>
                          {page.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* On-Page SEO */}
        <TabsContent value="onpage" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm text-white">Schema Markup Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => generateSchema('organization')}>
                  Organization
                </Button>
                <Button variant="outline" size="sm" onClick={() => generateSchema('product')}>
                  Product
                </Button>
                <Button variant="outline" size="sm" onClick={() => generateSchema('faq')}>
                  FAQ
                </Button>
              </div>
              {schemaMarkup && (
                <Textarea
                  value={schemaMarkup}
                  onChange={(e) => setSchemaMarkup(e.target.value)}
                  className="font-mono text-xs h-48 bg-slate-900 border-slate-600 text-slate-300"
                />
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm text-white">Page SEO Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {pages.filter(p => p.issues.length > 0).map(page => (
                    <div key={page.id} className="p-3 rounded-lg bg-slate-900/50">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-white font-medium">{page.url}</p>
                        <Badge variant="destructive">{page.issues.length} issues</Badge>
                      </div>
                      <div className="space-y-1">
                        {page.issues.map((issue, i) => (
                          <p key={i} className="text-xs text-slate-400 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3 text-yellow-400" />
                            {issue}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Off-Page SEO */}
        <TabsContent value="offpage" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm text-white">Backlink Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-400">
                <Link2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Connect your backlink monitoring service</p>
                <Button className="mt-4" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Connect Ahrefs / Moz
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Local SEO */}
        <TabsContent value="local" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm text-white">Google My Business Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-400">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Connect your Google My Business account</p>
                <Button className="mt-4" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Connect GMB
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keywords */}
        <TabsContent value="keywords" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm text-white">Keyword Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="space-y-2">
                  {keywords.map((kw, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                      <div>
                        <p className="text-sm text-white font-medium">{kw.keyword}</p>
                        <div className="flex gap-4 mt-1 text-xs text-slate-400">
                          <span>Vol: {kw.volume.toLocaleString()}</span>
                          <span>Diff: {kw.difficulty}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {kw.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                          {kw.trend === 'down' && <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />}
                        </div>
                        <Badge variant={kw.position && kw.position <= 10 ? 'default' : 'secondary'}>
                          {kw.position ? `#${kw.position}` : 'Not Ranked'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MMSEOManagement;
