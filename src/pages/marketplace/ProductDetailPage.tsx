import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Star, Package, Code2, IndianRupee, Play, ShoppingCart, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  product_id: string;
  product_name: string;
  description: string | null;
  category: string | null;
  monthly_price: number | null;
  lifetime_price: number | null;
  pricing_model: string | null;
  product_type: string | null;
  tech_stack: string | null;
  features_json: any;
  is_active: boolean | null;
  status: string | null;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [screenshotIdx, setScreenshotIdx] = useState(0);

  const screenshots = [
    'from-purple-900 to-slate-900',
    'from-blue-900 to-slate-900',
    'from-indigo-900 to-slate-900',
  ];

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_id', id)
        .single();
      if (error || !data) {
        setProduct(null);
      } else {
        setProduct(data as Product);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <Package className="h-16 w-16 text-slate-700" />
        <p className="text-slate-400 text-lg">Product not found</p>
        <Link to="/marketplace"><Button variant="outline" className="border-slate-700 text-slate-300">Back to Marketplace</Button></Link>
      </div>
    );
  }

  const features: string[] = Array.isArray(product.features_json)
    ? product.features_json
    : typeof product.features_json === 'object' && product.features_json
    ? Object.values(product.features_json)
    : [];

  const techStack: string[] = product.tech_stack
    ? product.tech_stack.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-slate-400">
          <Link to="/marketplace" className="hover:text-purple-400 transition-colors">Marketplace</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-500">{product.category || 'Software'}</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white">{product.product_name}</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link to="/marketplace" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" />Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {product.category && <Badge className="bg-purple-900/50 text-purple-300 border-purple-700">{product.category}</Badge>}
                {product.product_type && <Badge variant="outline" className="border-slate-700 text-slate-400">{product.product_type}</Badge>}
                {product.status && <Badge className={product.status === 'active' ? 'bg-green-900/50 text-green-300 border-green-700' : 'bg-slate-800 text-slate-400'}>{product.status}</Badge>}
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">{product.product_name}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />4.5 (128 reviews)</span>
                <span>By SoftwareWala</span>
                <span>Version 2.0</span>
              </div>
            </div>

            {/* Screenshots */}
            <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-800">
              <div className={`w-full h-full bg-gradient-to-br ${screenshots[screenshotIdx]} flex items-center justify-center`}>
                <Package className="h-16 w-16 text-white/20" />
                <span className="absolute bottom-4 right-4 text-white/40 text-sm">Screenshot {screenshotIdx + 1}</span>
              </div>
              <button onClick={() => setScreenshotIdx(i => (i - 1 + screenshots.length) % screenshots.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={() => setScreenshotIdx(i => (i + 1) % screenshots.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {screenshots.map((_, i) => (
                  <button key={i} onClick={() => setScreenshotIdx(i)} className={`w-2 h-2 rounded-full transition-colors ${i === screenshotIdx ? 'bg-purple-500' : 'bg-white/30'}`} />
                ))}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">Description</h2>
                <p className="text-slate-400 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">Key Features</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {features.map((f: any, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
                      {String(f)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack */}
            {techStack.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2"><Code2 className="h-5 w-5 text-purple-400" />Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((t, i) => (
                    <Badge key={i} variant="outline" className="border-slate-700 text-slate-300">{t}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews placeholder */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Reviews</h2>
              <div className="space-y-4">
                {[{ user: 'Rahul S.', rating: 5, comment: 'Excellent product, very feature rich and easy to use.' },
                  { user: 'Priya M.', rating: 4, comment: 'Great value for money. Support team is responsive.' }].map((r, i) => (
                  <Card key={i} className="bg-slate-800/80 border-slate-700">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{r.user}</span>
                        <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className={`h-4 w-4 ${j < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />)}</div>
                      </div>
                      <p className="text-slate-400 text-sm">{r.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Pricing */}
          <div className="space-y-4">
            <Card className="bg-slate-800/80 border-slate-700 sticky top-24">
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">Pricing Plans</h3>

                {product.monthly_price && (
                  <div className="p-3 rounded-lg border border-slate-700 bg-slate-900">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Monthly</span>
                      <span className="flex items-center text-white font-bold text-xl"><IndianRupee className="h-4 w-4" />{product.monthly_price.toLocaleString()}</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">per month, billed monthly</p>
                  </div>
                )}

                {product.lifetime_price && (
                  <div className="p-3 rounded-lg border border-purple-700 bg-purple-900/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-purple-300 font-medium">Lifetime</span>
                        <Badge className="ml-2 bg-purple-600 text-white text-xs">Best Value</Badge>
                      </div>
                      <span className="flex items-center text-white font-bold text-xl"><IndianRupee className="h-4 w-4" />{product.lifetime_price.toLocaleString()}</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">one-time payment, lifetime access</p>
                  </div>
                )}

                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" onClick={() => toast.info('Checkout coming soon')}>
                  <ShoppingCart className="h-4 w-4 mr-2" />Buy Now
                </Button>
                <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-700" onClick={() => toast.info('Demo access coming soon')}>
                  <Play className="h-4 w-4 mr-2" />Try Demo
                </Button>

                <div className="pt-2 border-t border-slate-700 space-y-2 text-sm text-slate-400">
                  <div className="flex justify-between"><span>Pricing Model</span><span className="text-slate-300 capitalize">{product.pricing_model || 'N/A'}</span></div>
                  <div className="flex justify-between"><span>Type</span><span className="text-slate-300 capitalize">{product.product_type || 'N/A'}</span></div>
                  <div className="flex justify-between"><span>Status</span><span className="text-green-400 capitalize">{product.status || 'Active'}</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
