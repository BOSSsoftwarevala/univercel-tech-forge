import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, Command, ArrowRight, Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { workerPool } from '@/lib/performance/WebWorkerPool';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: string;
  icon?: React.ReactNode;
  action?: () => void;
}

interface UltraFastSearchProps {
  data: unknown[];
  searchFields: string[];
  onSelect?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
  maxResults?: number;
  showRecent?: boolean;
  showShortcut?: boolean;
}

export const UltraFastSearch = memo(({
  data,
  searchFields,
  onSelect,
  placeholder = 'Search anything...',
  className,
  maxResults = 10,
  showRecent = true,
  showShortcut = true
}: UltraFastSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Perform search with Web Worker
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const searchResults = await workerPool.execute<unknown[]>('search', {
        data,
        query: searchQuery,
        fields: searchFields
      });

      const formatted: SearchResult[] = (searchResults as Record<string, unknown>[])
        .slice(0, maxResults)
        .map((item, i) => ({
          id: String(item.id || i),
          title: String(item[searchFields[0]] || ''),
          subtitle: searchFields[1] ? String(item[searchFields[1]] || '') : undefined,
          type: String(item.type || 'result'),
        }));

      setResults(formatted);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [data, searchFields, maxResults]);

  // Debounced search
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 100); // Ultra-fast 100ms debounce
  }, [performSearch]);

  // Handle selection
  const handleSelect = useCallback((result: SearchResult) => {
    // Save to recent searches
    const newRecent = [query, ...recentSearches.filter(r => r !== query)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));

    onSelect?.(result);
    setIsOpen(false);
    setQuery('');
    setResults([]);
  }, [query, recentSearches, onSelect]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
    }
  }, [results, selectedIndex, handleSelect]);

  return (
    <>
      {/* Search trigger */}
      <div 
        className={cn(
          "relative cursor-pointer group",
          className
        )}
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
      >
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
          <Search className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-slate-500">{placeholder}</span>
          {showShortcut && (
            <div className="ml-auto flex items-center gap-1 text-xs text-slate-600">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          )}
        </div>
      </div>

      {/* Search modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Search panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50"
            >
              <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden">
                {/* Search input */}
                <div className="flex items-center gap-3 p-4 border-b border-slate-700/50">
                  {isSearching ? (
                    <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5 text-cyan-400" />
                  )}
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent text-lg text-slate-100 placeholder:text-slate-500 focus:outline-none"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                  {query && (
                    <button
                      onClick={() => {
                        setQuery('');
                        setResults([]);
                        inputRef.current?.focus();
                      }}
                      className="p-1 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <X className="w-4 h-4 text-slate-500" />
                    </button>
                  )}
                </div>

                {/* Results */}
                <div className="max-h-[400px] overflow-y-auto">
                  {results.length > 0 ? (
                    <div className="p-2">
                      {results.map((result, index) => (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors",
                            index === selectedIndex 
                              ? "bg-cyan-500/10 border border-cyan-500/30"
                              : "hover:bg-slate-800/50"
                          )}
                          onClick={() => handleSelect(result)}
                        >
                          <div className="p-2 rounded-lg bg-slate-800">
                            {result.icon || <Search className="w-4 h-4 text-cyan-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-200 truncate">
                              {result.title}
                            </div>
                            {result.subtitle && (
                              <div className="text-xs text-slate-500 truncate">
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-slate-600 uppercase">
                            {result.type}
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-600" />
                        </motion.div>
                      ))}
                    </div>
                  ) : query ? (
                    <div className="p-8 text-center text-slate-500">
                      No results found for "{query}"
                    </div>
                  ) : showRecent && recentSearches.length > 0 ? (
                    <div className="p-4">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-3 px-2">
                        Recent Searches
                      </div>
                      {recentSearches.map((recent, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800/50 cursor-pointer"
                          onClick={() => {
                            setQuery(recent);
                            performSearch(recent);
                          }}
                        >
                          <Clock className="w-4 h-4 text-slate-600" />
                          <span className="text-sm text-slate-400">{recent}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500">
                      Start typing to search...
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/50 text-xs text-slate-600">
                  <div className="flex items-center gap-4">
                    <span>↑↓ Navigate</span>
                    <span>↵ Select</span>
                    <span>Esc Close</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>Ultra-Fast Search</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

UltraFastSearch.displayName = 'UltraFastSearch';

// Missing import
const Zap = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
