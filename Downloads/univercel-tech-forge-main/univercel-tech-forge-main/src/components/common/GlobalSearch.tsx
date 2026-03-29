import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, Users, Package, Building2, Server, TrendingUp, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  type: 'product' | 'lead' | 'franchise' | 'reseller' | 'server' | 'campaign';
  title: string;
  subtitle: string;
  status?: string;
  module: string;
}

interface GlobalSearchProps {
  onResultClick?: (result: SearchResult) => void;
  placeholder?: string;
}

const typeIcons: Record<string, React.ElementType> = {
  product: Package,
  lead: Users,
  franchise: Building2,
  reseller: TrendingUp,
  server: Server,
  campaign: FileText,
};

const typeColors: Record<string, string> = {
  product: 'bg-blue-500/20 text-blue-400',
  lead: 'bg-green-500/20 text-green-400',
  franchise: 'bg-purple-500/20 text-purple-400',
  reseller: 'bg-orange-500/20 text-orange-400',
  server: 'bg-cyan-500/20 text-cyan-400',
  campaign: 'bg-pink-500/20 text-pink-400',
};

export function GlobalSearch({ onResultClick, placeholder = "Search across all modules..." }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchAll = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const searchResults: SearchResult[] = [];

    try {
      // Search products
      const { data: products } = await supabase
        .from('products')
        .select('product_id, product_name, status, category')
        .ilike('product_name', `%${searchQuery}%`)
        .limit(5);

      if (products) {
        products.forEach(p => {
          searchResults.push({
            id: p.product_id,
            type: 'product',
            title: p.product_name,
            subtitle: p.category || 'Product',
            status: p.status || undefined,
            module: 'Product Manager',
          });
        });
      }

      // Search leads
      const { data: leads } = await supabase
        .from('leads')
        .select('id, name, email, status, source')
        .or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
        .limit(5);

      if (leads) {
        leads.forEach(l => {
          searchResults.push({
            id: l.id,
            type: 'lead',
            title: l.name,
            subtitle: l.email || l.source || 'Lead',
            status: l.status || undefined,
            module: 'Lead Manager',
          });
        });
      }

      setResults(searchResults);

      // Save to recent searches
      if (searchQuery.trim()) {
        setRecentSearches(prev => {
          const updated = [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 5);
          localStorage.setItem('globalSearchRecent', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      searchAll(query);
    }, 300);
    return () => clearTimeout(debounce);
  }, [query, searchAll]);

  useEffect(() => {
    const saved = localStorage.getItem('globalSearchRecent');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result);
    setOpen(false);
    setQuery('');
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-64 justify-start text-muted-foreground gap-2"
      >
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 bg-slate-900 border-slate-700">
          <div className="flex items-center border-b border-slate-700 px-4">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="border-0 bg-transparent h-14 text-lg focus-visible:ring-0 placeholder:text-slate-500"
              autoFocus
            />
            {query && (
              <Button variant="ghost" size="icon" onClick={() => setQuery('')}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto p-2">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}

            {!loading && results.length === 0 && query.length >= 2 && (
              <div className="text-center py-8 text-slate-500">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No results found for "{query}"</p>
              </div>
            )}

            {!loading && results.length === 0 && query.length < 2 && recentSearches.length > 0 && (
              <div className="p-2">
                <p className="text-xs text-slate-500 mb-2">Recent Searches</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="cursor-pointer hover:bg-slate-700"
                      onClick={() => setQuery(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence mode="popLayout">
              {results.map((result, index) => {
                const Icon = typeIcons[result.type] || FileText;
                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleResultClick(result)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 cursor-pointer group"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[result.type]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{result.title}</p>
                      <p className="text-sm text-slate-400 truncate">{result.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.status && (
                        <Badge variant="outline" className="text-xs">
                          {result.status}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {result.module}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="border-t border-slate-700 p-2 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>esc Close</span>
            </div>
            <span>Cross-module search</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default GlobalSearch;
