import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Package, ExternalLink, Calendar, Key, Loader2, Store } from 'lucide-react';
import { toast } from 'sonner';

interface LibraryItem {
  order_item_id: string;
  product_id: string;
  product_name: string;
  category: string | null;
  product_type: string | null;
  purchase_date: string;
  status: string;
}

export default function UserLibraryPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('marketplace_orders')
        .select(`
          order_id,
          created_at,
          status,
          marketplace_order_items (
            order_item_id,
            product_id,
            products (product_name, category, product_type)
          )
        `)
        .eq('user_id', user.id)
        .limit(100);

      if (error) {
        toast.error('Failed to load library');
        setLoading(false);
        return;
      }

      if (data) {
        const flat: LibraryItem[] = [];
        for (const order of data) {
          for (const item of (order.marketplace_order_items || [])) {
            flat.push({
              order_item_id: item.order_item_id,
              product_id: item.product_id,
              product_name: item.products?.product_name || 'Unknown Product',
              category: item.products?.category || null,
              product_type: item.products?.product_type || null,
              purchase_date: order.created_at,
              status: order.status || 'active',
            });
          }
        }
        setItems(flat);
      }
      setLoading(false);
    })();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-purple-500" />
            <div>
              <h1 className="text-xl font-bold text-white">My Library</h1>
              <p className="text-slate-400 text-sm">Your purchased products</p>
            </div>
          </div>
          <Link to="/marketplace"><Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800"><Store className="h-4 w-4 mr-2" />Browse Marketplace</Button></Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 text-purple-500 animate-spin" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-2">No products in your library</p>
            <p className="text-slate-500 text-sm mb-6">Purchase products from the marketplace to see them here</p>
            <Link to="/marketplace"><Button className="bg-purple-600 hover:bg-purple-700">Explore Marketplace</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <Card key={item.order_item_id} className="bg-slate-800/80 border-slate-700 hover:border-purple-700 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="h-10 w-10 rounded-lg bg-purple-900/50 border border-purple-700/50 flex items-center justify-center shrink-0">
                      <Package className="h-5 w-5 text-purple-400" />
                    </div>
                    <Badge className={item.status === 'completed' || item.status === 'active' ? 'bg-green-900/50 text-green-300 border-green-700' : 'bg-slate-700 text-slate-400'}>
                      {item.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-base mt-3">{item.product_name}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    {item.category && <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">{item.category}</Badge>}
                    {item.product_type && <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">{item.product_type}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>Purchased {new Date(item.purchase_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Key className="h-4 w-4" />
                    <Link to="/user/licenses" className="text-purple-400 hover:text-purple-300 transition-colors">View License</Link>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Link to={`/marketplace/product/${item.product_id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-slate-700 text-slate-300 hover:bg-slate-700">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />View Product
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
