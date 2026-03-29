import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, User, ShieldCheck, Store, Building, Code, Briefcase, Handshake, Eye, Edit, Lock, CheckCircle, XCircle, History } from "lucide-react";
import { toast } from "sonner";

interface LMUserRoleAgreementsProps {
  activeSubSection: string;
}

const roleAgreements = [
  { id: "1", name: "End User Agreement", role: "User", status: "active", version: "v4.2", acceptances: 12450, icon: User },
  { id: "2", name: "Admin Agreement", role: "Admin", status: "active", version: "v2.1", acceptances: 156, icon: ShieldCheck },
  { id: "3", name: "Reseller Agreement", role: "Reseller", status: "active", version: "v3.0", acceptances: 89, icon: Store },
  { id: "4", name: "Franchise Agreement", role: "Franchise", status: "pending", version: "v2.5", acceptances: 45, icon: Building },
  { id: "5", name: "Developer Agreement", role: "Developer", status: "active", version: "v1.8", acceptances: 234, icon: Code },
  { id: "6", name: "Employee Agreement", role: "Employee", status: "active", version: "v3.2", acceptances: 78, icon: Briefcase },
  { id: "7", name: "Partner Agreement", role: "Partner", status: "review", version: "v1.5", acceptances: 23, icon: Handshake },
];

const LMUserRoleAgreements = ({ activeSubSection }: LMUserRoleAgreementsProps) => {
  const handleAction = (action: string, item: string) => {
    const toastTypes: Record<string, () => void> = {
      view: () => toast.info(`Viewing: ${item}`),
      edit: () => toast.info(`Editing: ${item}`),
      lock: () => toast.warning(`Locking: ${item}`),
      publish: () => toast.success(`Published: ${item}`),
      revoke: () => toast.error(`Revoked: ${item}`),
      history: () => toast.info(`Viewing history: ${item}`),
    };
    toastTypes[action]?.();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "review": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg">
          <Users className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">User & Role Agreements</h1>
          <p className="text-muted-foreground">Manage agreements for all user roles</p>
        </div>
      </div>

      {/* Role Agreement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roleAgreements.map((agreement, index) => {
          const Icon = agreement.icon;
          return (
            <motion.div
              key={agreement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card/50 border-border/50 hover:border-blue-500/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{agreement.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{agreement.version}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(agreement.status)}>{agreement.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Acceptances</span>
                    <span className="text-lg font-bold text-blue-400">{agreement.acceptances.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="flex-1" onClick={() => handleAction("view", agreement.name)}>
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                    <Button size="sm" variant="ghost" className="flex-1" onClick={() => handleAction("edit", agreement.name)}>
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleAction("lock", agreement.name)}>
                      <Lock className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleAction("publish", agreement.name)}>
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleAction("history", agreement.name)}>
                      <History className="w-4 h-4" />
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

export default LMUserRoleAgreements;
