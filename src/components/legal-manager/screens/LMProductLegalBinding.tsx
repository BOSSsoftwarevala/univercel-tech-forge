import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Link, Lock, RefreshCw, Clock, Eye, Edit, CheckCircle, History, XCircle } from "lucide-react";
import { toast } from "sonner";

interface LMProductLegalBindingProps {
  activeSubSection: string;
}

const productBindings = [
  { id: "1", product: "CRM Pro", agreement: "Enterprise License", status: "bound", mandatory: true, expiry: "Dec 2025" },
  { id: "2", product: "HR Suite", agreement: "Standard License", status: "bound", mandatory: true, expiry: "Jan 2026" },
  { id: "3", product: "Finance Module", agreement: "Premium License", status: "pending", mandatory: true, expiry: "Mar 2025" },
  { id: "4", product: "Analytics Dashboard", agreement: "Basic License", status: "bound", mandatory: false, expiry: "Jun 2025" },
  { id: "5", product: "Mobile App", agreement: "Mobile Terms", status: "review", mandatory: true, expiry: "Feb 2025" },
];

const LMProductLegalBinding = ({ activeSubSection }: LMProductLegalBindingProps) => {
  const handleAction = (action: string, item: string) => {
    const toastMap: Record<string, () => void> = {
      view: () => toast.info(`Viewing: ${item}`),
      edit: () => toast.info(`Editing: ${item}`),
      lock: () => toast.warning(`Locking: ${item}`),
      unlock: () => toast.success(`Unlocking: ${item}`),
      publish: () => toast.success(`Published: ${item}`),
      revoke: () => toast.error(`Revoked: ${item}`),
      history: () => toast.info(`Viewing history: ${item}`),
    };
    toastMap[action]?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg">
          <Package className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Product Legal Binding</h1>
          <p className="text-muted-foreground">Bind legal agreements to software products</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: Link, label: "Software Mapping", color: "amber" },
          { icon: CheckCircle, label: "Mandatory Agreements", color: "emerald" },
          { icon: Lock, label: "Agreement Lock", color: "red" },
          { icon: RefreshCw, label: "Update Trigger", color: "blue" },
          { icon: Clock, label: "Expiry Control", color: "purple" },
        ].map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer hover:scale-105 transition-transform bg-${action.color}-500/10 border-${action.color}-500/30`}
              onClick={() => handleAction("view", action.label)}
            >
              <CardContent className="p-4 text-center">
                <action.icon className={`w-8 h-8 text-${action.color}-400 mx-auto mb-2`} />
                <p className="text-sm font-medium text-foreground">{action.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Product Bindings */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            Product Agreement Bindings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {productBindings.map((binding) => (
              <motion.div
                key={binding.id}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-600/20 flex items-center justify-center">
                    <Package className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{binding.product}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{binding.agreement}</Badge>
                      {binding.mandatory && <Badge className="bg-red-500/20 text-red-400 text-xs">Mandatory</Badge>}
                      <span className="text-xs text-muted-foreground">Expires: {binding.expiry}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={binding.status === "bound" ? "bg-emerald-500/20 text-emerald-400" : binding.status === "pending" ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-500/20 text-blue-400"}>
                    {binding.status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("view", binding.product)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("edit", binding.product)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("lock", binding.product)}>
                      <Lock className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("publish", binding.product)}>
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("history", binding.product)}>
                      <History className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LMProductLegalBinding;
