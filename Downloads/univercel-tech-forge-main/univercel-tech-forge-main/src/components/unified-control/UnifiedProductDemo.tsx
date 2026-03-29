import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Package, Plus, Edit2, Trash2, Copy, Rocket, 
  RotateCcw, Wrench, CheckCircle2, AlertTriangle, Clock, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const PRODUCTS_DATA = [
  { 
    id: 1, 
    name: "CRM Suite", 
    demos: 3, 
    liveDemo: "CRM Demo v2.1",
    status: "active",
    lastDeploy: "2 hours ago",
    version: "2.1.0"
  },
  { 
    id: 2, 
    name: "HR Management", 
    demos: 2, 
    liveDemo: "HR Demo v1.5",
    status: "active",
    lastDeploy: "1 day ago",
    version: "1.5.0"
  },
  { 
    id: 3, 
    name: "Sales Tracker", 
    demos: 1, 
    liveDemo: "Sales Demo",
    status: "error",
    lastDeploy: "3 days ago",
    version: "1.0.0",
    error: "Build failed"
  },
  { 
    id: 4, 
    name: "Inventory System", 
    demos: 2, 
    liveDemo: null,
    status: "draft",
    lastDeploy: null,
    version: "0.9.0"
  },
];

const DEMO_ACTIONS = [
  { id: "create", label: "Create Demo", icon: Plus, color: "green" },
  { id: "repair", label: "Auto Repair", icon: Wrench, color: "amber" },
  { id: "clone", label: "Clone Demo", icon: Copy, color: "blue" },
  { id: "deploy", label: "Live Deploy", icon: Rocket, color: "violet" },
  { id: "rollback", label: "Rollback", icon: RotateCcw, color: "orange" },
];

export const UnifiedProductDemo = () => {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Product & Demo Manager</h2>
          <p className="text-muted-foreground">Manage products, create demos, deploy & rollback</p>
        </div>
        <Button className="bg-green-500 hover:bg-green-600">
          <Plus className="w-4 h-4 mr-2" />
          New Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: "Products", value: 4, color: "blue" },
          { label: "Active Demos", value: 6, color: "green" },
          { label: "Live", value: 3, color: "violet" },
          { label: "Errors", value: 1, color: "red" },
          { label: "Pending Deploy", value: 2, color: "amber" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/30`}
          >
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-5 gap-3">
        {DEMO_ACTIONS.map((action) => (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-xl bg-${action.color}-500/10 border border-${action.color}-500/30 hover:border-${action.color}-500/50 transition-all`}
          >
            <action.icon className={`w-6 h-6 text-${action.color}-400 mx-auto`} />
            <p className="text-xs text-white mt-2 text-center">{action.label}</p>
          </motion.button>
        ))}
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">PRODUCT</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">DEMOS</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">LIVE DEMO</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">VERSION</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">STATUS</th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground">LAST DEPLOY</th>
              <th className="text-right p-3 text-xs font-medium text-muted-foreground">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS_DATA.map((product) => (
              <tr key={product.id} className="border-t border-border/30 hover:bg-muted/10">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-sm text-white font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="p-3">
                  <Badge variant="outline" className="text-xs">
                    {product.demos} demos
                  </Badge>
                </td>
                <td className="p-3">
                  {product.liveDemo ? (
                    <span className="text-sm text-green-400">{product.liveDemo}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">None</span>
                  )}
                </td>
                <td className="p-3">
                  <Badge variant="outline" className="text-xs">
                    v{product.version}
                  </Badge>
                </td>
                <td className="p-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs capitalize",
                      product.status === "active" && "border-green-500/50 text-green-400",
                      product.status === "error" && "border-red-500/50 text-red-400",
                      product.status === "draft" && "border-slate-500/50 text-slate-400"
                    )}
                  >
                    {product.status === "active" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {product.status === "error" && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {product.status === "draft" && <Clock className="w-3 h-3 mr-1" />}
                    {product.status}
                  </Badge>
                </td>
                <td className="p-3 text-sm text-muted-foreground">
                  {product.lastDeploy || "-"}
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="w-4 h-4 text-blue-400" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit2 className="w-4 h-4 text-amber-400" />
                    </Button>
                    {product.status === "error" && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Wrench className="w-4 h-4 text-orange-400" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Rocket className="w-4 h-4 text-violet-400" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Auto Features */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-3">
            <Wrench className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-sm font-medium text-white">Auto Demo Repair</p>
              <p className="text-xs text-muted-foreground">AI automatically fixes broken demos</p>
            </div>
          </div>
          <Badge className="mt-3 bg-amber-500">Active</Badge>
        </div>
        <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30">
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-violet-400" />
            <div>
              <p className="text-sm font-medium text-white">Auto Versioning & Rollback</p>
              <p className="text-xs text-muted-foreground">One-click rollback to any version</p>
            </div>
          </div>
          <Badge className="mt-3 bg-violet-500">Enabled</Badge>
        </div>
      </div>
    </div>
  );
};
