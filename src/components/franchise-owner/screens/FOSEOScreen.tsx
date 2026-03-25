import React from 'react';
import { Search, MapPin, Globe, FileText, TrendingUp, Play, Pause, Eye, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const seoCategories = [
  { id: 1, name: 'Local SEO', status: 'Active', progress: 78, rank: 3 },
  { id: 2, name: 'Google SEO', status: 'Active', progress: 65, rank: 8 },
  { id: 3, name: 'Content Suggestions', status: 'Pending', progress: 45, suggestions: 12 },
  { id: 4, name: 'Keyword Tracking', status: 'Active', progress: 82, keywords: 24 },
];

const keywordRankings = [
  { keyword: 'franchise business mumbai', rank: 3, change: '+2' },
  { keyword: 'best franchise opportunities', rank: 8, change: '+5' },
  { keyword: 'low investment franchise', rank: 12, change: '+3' },
  { keyword: 'franchise partner india', rank: 5, change: '-1' },
];

export function FOSEOScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" />
            SEO & Marketing
          </h1>
          <p className="text-muted-foreground">AI-Powered • No Tech Input Required</p>
        </div>
        <Badge className="bg-emerald-500">
          <Sparkles className="h-3 w-3 mr-1" />
          AI Active
        </Badge>
      </div>

      {/* SEO Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {seoCategories.map((cat) => (
          <Card key={cat.id} className="bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{cat.name}</span>
                <Badge variant={cat.status === 'Active' ? 'default' : 'secondary'}>
                  {cat.status}
                </Badge>
              </div>
              <Progress value={cat.progress} className="h-2 mb-2" />
              <p className="text-sm text-muted-foreground">{cat.progress}% optimized</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Country & Language Selection */}
      <Card className="bg-card/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Country-wise SEO:</span>
              <Badge variant="outline">India</Badge>
              <Badge variant="outline">UAE</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Language:</span>
              <Badge variant="outline">English</Badge>
              <Badge variant="outline">Hindi</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyword Rankings */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Keyword Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {keywordRankings.map((kw, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">
                    #{kw.rank}
                  </div>
                  <span className="font-medium">{kw.keyword}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={kw.change.startsWith('+') ? 'default' : 'destructive'}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {kw.change}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button>
          <Play className="h-4 w-4 mr-2" />
          Start SEO
        </Button>
        <Button variant="outline">
          <Pause className="h-4 w-4 mr-2" />
          Pause
        </Button>
        <Button variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          View Result
        </Button>
      </div>
    </div>
  );
}
