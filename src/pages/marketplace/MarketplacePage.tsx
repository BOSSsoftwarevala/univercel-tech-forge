import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Store, BookOpen, Key, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MMMarketplaceScreen } from '@/components/marketplace-manager/screens/MMMarketplaceScreen';

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Store className="h-6 w-6 text-purple-500" />
            <span className="text-white font-bold text-lg">SoftwareWala <span className="text-purple-400">Marketplace</span></span>
          </Link>
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500" placeholder="Search software, tools, apps..." />
            </div>
          </div>
          <nav className="flex items-center gap-1">
            <Link to="/" className="flex items-center gap-1.5 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-sm transition-colors"><Home className="h-4 w-4" />Home</Link>
            <Link to="/user/library" className="flex items-center gap-1.5 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-sm transition-colors"><BookOpen className="h-4 w-4" />My Library</Link>
            <Link to="/user/licenses" className="flex items-center gap-1.5 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-sm transition-colors"><Key className="h-4 w-4" />My Licenses</Link>
          </nav>
        </div>
      </header>
      <main>
        <MMMarketplaceScreen />
      </main>
    </div>
  );
}
