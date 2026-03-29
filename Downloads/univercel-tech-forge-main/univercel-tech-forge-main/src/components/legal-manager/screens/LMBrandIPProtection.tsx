import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, FileText, Tag, Store, Building, AlertTriangle, Eye, Edit, Lock, CheckCircle, History } from "lucide-react";
import { toast } from "sonner";

interface LMBrandIPProtectionProps {
  activeSubSection: string;
}

const brandItems = [
  { id: "1", name: "Brand Agreement", type: "Agreement", status: "active", coverage: "Global", enforcement: "Strict" },
  { id: "2", name: "White-Label Restrictions", type: "Policy", status: "active", coverage: "Global", enforcement: "Mandatory" },
  { id: "3", name: "Reseller Brand Rules", type: "Guidelines", status: "active", coverage: "All Resellers", enforcement: "Required" },
  { id: "4", name: "Franchise Brand Usage", type: "Guidelines", status: "active", coverage: "All Franchises", enforcement: "Mandatory" },
  { id: "5", name: "IP Abuse Monitoring", type: "AI Monitoring", status: "active", coverage: "Global", enforcement: "Auto-Detection" },
];

const LMBrandIPProtection = ({ activeSubSection }: LMBrandIPProtectionProps) => {
  const handleAction = (action: string, item: string) => {
    const toastMap: Record<string, () => void> = {
      view: () => toast.info(`Viewing: ${item}`),
      edit: () => toast.info(`Editing: ${item}`),
      lock: () => toast.warning(`Locking: ${item}`),
      publish: () => toast.success(`Published: ${item}`),
      revoke: () => toast.error(`Revoked: ${item}`),
      history: () => toast.info(`Viewing history: ${item}`),
    };
    toastMap[action]?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center shadow-lg">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Brand & IP Protection</h1>
          <p className="text-muted-foreground">Protect brand identity and intellectual property</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: FileText, label: "Brand Agreement", onClick: () => handleAction("view", "Brand Agreement") },
          { icon: Tag, label: "White-Label", onClick: () => handleAction("view", "White-Label Restrictions") },
          { icon: Store, label: "Reseller Rules", onClick: () => handleAction("view", "Reseller Brand Rules") },
          { icon: Building, label: "Franchise Usage", onClick: () => handleAction("view", "Franchise Brand Usage") },
          { icon: AlertTriangle, label: "IP Abuse", onClick: () => handleAction("view", "IP Abuse Monitoring") },
        ].map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="cursor-pointer hover:scale-105 transition-transform bg-teal-500/10 border-teal-500/30"
              onClick={action.onClick}
            >
              <CardContent className="p-4 text-center">
                <action.icon className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">{action.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Brand Protection Items */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-400" />
            Brand Protection Registry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {brandItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-600/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{item.type}</Badge>
                      <span className="text-xs text-muted-foreground">{item.coverage}</span>
                      <Badge className="bg-teal-500/20 text-teal-400 text-xs">{item.enforcement}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/20 text-emerald-400">{item.status}</Badge>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("view", item.name)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("edit", item.name)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("lock", item.name)}>
                      <Lock className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("publish", item.name)}>
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("history", item.name)}>
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

export default LMBrandIPProtection;
