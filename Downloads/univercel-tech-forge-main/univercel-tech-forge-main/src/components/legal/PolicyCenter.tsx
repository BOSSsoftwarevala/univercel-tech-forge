import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Eye,
  FileText,
  DollarSign,
  RefreshCw,
  MessageSquare,
  Shield,
  Clock
} from "lucide-react";

const PolicyCenter = () => {
  const policies = [
    { id: 1, name: "Pricing Policy", category: "Finance", version: "v2.3", lastUpdated: "Dec 15, 2024", status: "active", icon: DollarSign },
    { id: 2, name: "Refund & Cancellation", category: "Finance", version: "v1.8", lastUpdated: "Dec 10, 2024", status: "active", icon: RefreshCw },
    { id: 3, name: "Data Masking Guidelines", category: "Security", version: "v3.1", lastUpdated: "Dec 18, 2024", status: "active", icon: Shield },
    { id: 4, name: "Communication Guidelines", category: "HR", version: "v1.5", lastUpdated: "Nov 28, 2024", status: "review", icon: MessageSquare },
    { id: 5, name: "Dispute Handling SOP", category: "Legal", version: "v2.0", lastUpdated: "Dec 5, 2024", status: "active", icon: FileText },
    { id: 6, name: "Developer Code of Conduct", category: "HR", version: "v1.2", lastUpdated: "Dec 1, 2024", status: "active", icon: BookOpen },
  ];

  const categories = [
    { name: "Finance", count: 8, color: "bg-emerald-500/20 text-emerald-400" },
    { name: "Security", count: 12, color: "bg-blue-500/20 text-blue-400" },
    { name: "HR", count: 6, color: "bg-purple-500/20 text-purple-400" },
    { name: "Legal", count: 15, color: "bg-amber-500/20 text-amber-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Policy Center</h2>
          <p className="text-stone-500">Centralized policy management and documentation</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Policy
        </Button>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-stone-900/80 border border-stone-800/50 flex items-center justify-between"
          >
            <div>
              <p className="text-white font-medium">{category.name}</p>
              <p className="text-2xl font-bold text-stone-300">{category.count}</p>
            </div>
            <Badge className={category.color}>Policies</Badge>
          </motion.div>
        ))}
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {policies.map((policy, index) => {
          const Icon = policy.icon;
          return (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-stone-900/80 border-stone-800/50 hover:border-amber-600/30 transition-colors h-full">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-stone-800/50 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium">{policy.name}</h3>
                        <Badge className={
                          policy.status === "active" 
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" 
                            : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                        }>
                          {policy.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-stone-800/50 text-stone-400 border-stone-700/50 text-xs">
                          {policy.category}
                        </Badge>
                        <span className="text-xs text-stone-500">{policy.version}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-stone-500">
                    <Clock className="w-3 h-3" />
                    <span>Updated: {policy.lastUpdated}</span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Button size="sm" variant="outline" className="flex-1 border-stone-700 text-stone-300 hover:bg-stone-800">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="border-stone-700 text-stone-300 hover:bg-stone-800">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PolicyCenter;
