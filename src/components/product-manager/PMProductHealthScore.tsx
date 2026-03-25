import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Eye,
  ShoppingCart,
  MonitorPlay,
  DollarSign,
  RefreshCw,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface ProductHealth {
  product_id: string;
  product_name: string;
  health_score: number;
  metrics: {
    views: number;
    demo_requests: number;
    conversion_rate: number;
    revenue: number;
    inventory_status: 'healthy' | 'low' | 'critical';
  };
  issues: string[];
  recommendations: string[];
  trend: 'up' | 'down' | 'stable';
}

const PMProductHealthScore: React.FC = () => {
  const [products, setProducts] = useState<ProductHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    analyzeProductHealth();
  }, []);

  const analyzeProductHealth = async () => {
    setLoading(true);
    
    try {
      const { data: productsData } = await supabase
        .from('products')
        .select('product_id, product_name, status, lifetime_price')
        .eq('status', 'active')
        .limit(20);

      if (!productsData) return;

      // Simulate health analysis
      const healthData: ProductHealth[] = productsData.map(p => {
        const views = Math.floor(Math.random() * 1000) + 100;
        const demoRequests = Math.floor(Math.random() * 50) + 5;
        const conversions = Math.floor(Math.random() * 20) + 1;
        const conversionRate = (conversions / demoRequests) * 100;
        const revenue = conversions * (p.lifetime_price || 99);
        
        const issues: string[] = [];
        const recommendations: string[] = [];
        
        if (views < 200) {
          issues.push('Low visibility');
          recommendations.push('Improve SEO and product listing');
        }
        if (conversionRate < 10) {
          issues.push('Low conversion rate');
          recommendations.push('Review pricing and demo experience');
        }
        if (demoRequests < 10) {
          issues.push('Few demo requests');
          recommendations.push('Add more compelling demo CTA');
        }

        let score = 100;
        score -= issues.length * 15;
        score = Math.max(score, 0);

        return {
          product_id: p.product_id,
          product_name: p.product_name,
          health_score: score,
          metrics: {
            views,
            demo_requests: demoRequests,
            conversion_rate: Math.round(conversionRate * 10) / 10,
            revenue,
            inventory_status: score > 70 ? 'healthy' : score > 40 ? 'low' : 'critical',
          },
          issues,
          recommendations,
          trend: score > 70 ? 'up' : score > 40 ? 'stable' : 'down',
        };
      });

      setProducts(healthData.sort((a, b) => b.health_score - a.health_score));
    } catch (error) {
      console.error('Health analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAIAnalysis = async () => {
    setAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setProducts(prev => prev.map(p => ({
      ...p,
      recommendations: [
        ...p.recommendations,
        'AI: Consider bundling with related products',
        'AI: Test A/B pricing at $' + Math.round(p.metrics.revenue / 10),
      ].slice(0, 4),
    })));
    
    setAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-yellow-500" />;
    }
  };

  const overallHealth = products.length > 0
    ? Math.round(products.reduce((sum, p) => sum + p.health_score, 0) / products.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Product Health Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            AI-powered health analysis and recommendations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={analyzeProductHealth} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={runAIAnalysis} disabled={analyzing}>
            {analyzing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            AI Analysis
          </Button>
        </div>
      </div>

      {/* Overall Health */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-8">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-secondary"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${overallHealth * 2.83} 283`}
                  className={getScoreColor(overallHealth)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${getScoreColor(overallHealth)}`}>
                  {overallHealth}
                </span>
                <span className="text-xs text-muted-foreground">Overall</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">
                  {products.reduce((sum, p) => sum + p.metrics.views, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Total Views</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <MonitorPlay className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">
                  {products.reduce((sum, p) => sum + p.metrics.demo_requests, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Demo Requests</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">
                  {products.length > 0
                    ? Math.round(products.reduce((sum, p) => sum + p.metrics.conversion_rate, 0) / products.length)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">Avg Conversion</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">
                  ${products.reduce((sum, p) => sum + p.metrics.revenue, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Health List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Product Health Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {products.map(product => (
                  <div 
                    key={product.product_id}
                    className="p-4 rounded-lg border hover:bg-secondary/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getScoreBg(product.health_score)}/10`}>
                          <span className={`text-lg font-bold ${getScoreColor(product.health_score)}`}>
                            {product.health_score}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{product.product_name}</span>
                            {getTrendIcon(product.trend)}
                          </div>
                          <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                            <span>{product.metrics.views} views</span>
                            <span>{product.metrics.demo_requests} demos</span>
                            <span>{product.metrics.conversion_rate}% conv.</span>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={product.health_score >= 70 ? 'default' : 'destructive'}
                        className="gap-1"
                      >
                        {product.health_score >= 70 ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {product.health_score >= 70 ? 'Healthy' : 'Needs Attention'}
                      </Badge>
                    </div>

                    <Progress 
                      value={product.health_score} 
                      className="h-1.5 mb-3"
                    />

                    {product.issues.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-destructive mb-1">Issues:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.issues.map((issue, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {product.recommendations.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-primary mb-1">Recommendations:</p>
                        <ul className="text-xs text-muted-foreground space-y-0.5">
                          {product.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-primary">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PMProductHealthScore;
