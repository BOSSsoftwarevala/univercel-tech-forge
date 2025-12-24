import { motion } from 'framer-motion';
import { Bell, Search, Settings, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from "@/hooks/useAuth";

const HRTopBar = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'HR Manager';
  const maskedId = user?.id ? `HR-${user.id.substring(0, 4).toUpperCase()}` : 'HR-0000';

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-violet-500/20 flex items-center justify-between px-6">
      {/* Role Badge */}
      <div className="flex items-center gap-4">
        <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[10px] px-2 py-0.5">
          HR MANAGER
        </Badge>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md mx-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search candidates, positions..."
            className="pl-10 bg-slate-800/50 border-violet-500/20 text-white placeholder:text-slate-500 focus:border-violet-500/50"
          />
        </div>
        <Button variant="outline" size="sm" className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-violet-500/30">
          <Plus className="w-4 h-4 mr-2" />
          New Position
        </Button>

        <div className="h-8 w-px bg-violet-500/20" />

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-violet-400 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            5
          </span>
        </motion.button>

        {/* Settings */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-violet-400 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </motion.button>
      </div>
    </header>
  );
};

export default HRTopBar;
