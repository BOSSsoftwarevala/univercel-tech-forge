import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, Play, Clock, CheckCircle2, AlertTriangle,
  ShoppingCart, Heart, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface Demo {
  id: string;
  title: string;
  category: string;
  techStack: string[];
  status: 'available' | 'assigned' | 'in_use';
  maskedUrl: string;
  uptime: number;
  lastUsed: string;
  isFavorite?: boolean;
  inCart?: boolean;
}

interface DemoRequest {
  id: string;
  leadName: string;
  demoId: string;
  demoTitle: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  scheduledFor?: string;
}

const FranchiseDemoPanel = () => {
  const [demos, setDemos] = useState<Demo[]>([
    { id: '1', title: 'E-Commerce Platform', category: 'Retail', techStack: ['PHP', 'MySQL'], status: 'available', maskedUrl: 'demo.sv****/ecom', uptime: 99.8, lastUsed: '2 hours ago', isFavorite: false, inCart: false },
    { id: '2', title: 'Hospital Management', category: 'Healthcare', techStack: ['Node.js', 'MongoDB'], status: 'assigned', maskedUrl: 'demo.sv****/hms', uptime: 99.5, lastUsed: '5 hours ago', isFavorite: true, inCart: false },
    { id: '3', title: 'School ERP', category: 'Education', techStack: ['Java', 'PostgreSQL'], status: 'in_use', maskedUrl: 'demo.sv****/school', uptime: 99.9, lastUsed: 'Now', isFavorite: false, inCart: true },
    { id: '4', title: 'CRM Solution', category: 'Finance', techStack: ['React', 'Node.js'], status: 'available', maskedUrl: 'demo.sv****/crm', uptime: 99.7, lastUsed: '1 day ago', isFavorite: false, inCart: false },
  ]);

  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([
    { id: '1', leadName: 'Raj Kumar', demoId: '1', demoTitle: 'E-Commerce Platform', requestedAt: '2 hours ago', status: 'pending' },
    { id: '2', leadName: 'Priya Singh', demoId: '2', demoTitle: 'Hospital Management', requestedAt: '5 hours ago', status: 'approved', scheduledFor: 'Tomorrow 3:00 PM' },
    { id: '3', leadName: 'Amit Patel', demoId: '3', demoTitle: 'School ERP', requestedAt: '1 day ago', status: 'rejected' },
  ]);

  const handleAddToCart = (demoId: string, demoTitle: string) => {
    setDemos(prev => prev.map(d => d.id === demoId ? { ...d, inCart: !d.inCart } : d));
    const demo = demos.find(d => d.id === demoId);
    toast({
      title: demo?.inCart ? "Removed from Cart" : "Added to Cart",
      description: `"${demoTitle}" ${demo?.inCart ? 'removed from' : 'added to'} your cart.`,
    });
  };

  const handlePlayDemo = (demoId: string, demoTitle: string) => {
    toast({
      title: "Opening Demo",
      description: `Launching "${demoTitle}" demo...`,
    });
  };

  const handleToggleFavorite = (demoId: string, demoTitle: string) => {
    setDemos(prev => prev.map(d => d.id === demoId ? { ...d, isFavorite: !d.isFavorite } : d));
    const demo = demos.find(d => d.id === demoId);
    toast({
      title: demo?.isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: `"${demoTitle}" ${demo?.isFavorite ? 'removed from' : 'added to'} favorites.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-emerald-400 bg-emerald-500/20';
      case 'assigned': return 'text-amber-400 bg-amber-500/20';
      case 'in_use': return 'text-cyan-400 bg-cyan-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-400 bg-amber-500/20';
      case 'approved': return 'text-emerald-400 bg-emerald-500/20';
      case 'rejected': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Demo Access & Requests</h1>
          <p className="text-slate-400">Request and share demo links for your leads</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
            <Monitor className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">{demos.length} Demos Available</span>
          </div>
        </div>
      </div>

      {/* Demo Catalog */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Demo Catalog</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {demos.map((demo, index) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white">{demo.title}</h3>
                  <p className="text-sm text-slate-400">{demo.category}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(demo.status)}`}>
                  {demo.status.replace('_', ' ')}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {demo.techStack.map(tech => (
                  <span key={tech} className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>Uptime: {demo.uptime}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{demo.lastUsed}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleAddToCart(demo.id, demo.title)}
                  size="sm"
                  variant={demo.inCart ? "secondary" : "default"}
                  className={demo.inCart ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" : "bg-indigo-500 hover:bg-indigo-600"}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  {demo.inCart ? 'In Cart' : 'Add'}
                </Button>
                <Button
                  onClick={() => handlePlayDemo(demo.id, demo.title)}
                  size="sm"
                  variant="outline"
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Demo
                </Button>
                <Button
                  onClick={() => handleToggleFavorite(demo.id, demo.title)}
                  variant="ghost"
                  size="sm"
                  className={demo.isFavorite ? "text-rose-400 hover:text-rose-300" : "text-slate-400 hover:text-rose-400"}
                >
                  <Heart className={`w-4 h-4 ${demo.isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* My Demo Requests */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">My Demo Requests</h2>
        <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="space-y-4">
            {demoRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    request.status === 'approved' ? 'bg-emerald-500/20' :
                    request.status === 'pending' ? 'bg-amber-500/20' : 'bg-red-500/20'
                  }`}>
                    {request.status === 'approved' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : request.status === 'pending' ? (
                      <Clock className="w-5 h-5 text-amber-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{request.demoTitle}</p>
                    <p className="text-sm text-slate-400">
                      For: {request.leadName} • {request.requestedAt}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded text-xs ${getRequestStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                  {request.scheduledFor && (
                    <p className="text-xs text-emerald-400 mt-1">{request.scheduledFor}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-center">
          <p className="text-2xl font-bold text-white">12</p>
          <p className="text-sm text-slate-400">Demos This Month</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-center">
          <p className="text-2xl font-bold text-white">85%</p>
          <p className="text-sm text-slate-400">Demo to Sale Rate</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-center">
          <p className="text-2xl font-bold text-white">3</p>
          <p className="text-sm text-slate-400">Pending Requests</p>
        </div>
      </div>
    </div>
  );
};

export default FranchiseDemoPanel;
