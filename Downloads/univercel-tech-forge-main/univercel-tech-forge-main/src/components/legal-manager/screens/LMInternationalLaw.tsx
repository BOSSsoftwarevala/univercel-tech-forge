import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Shield, FileText, Eye, Edit, Lock, CheckCircle, History } from "lucide-react";
import { toast } from "sonner";

interface LMInternationalLawProps {
  activeSubSection: string;
}

const lawCompliance = [
  { id: "1", name: "GDPR", region: "EU", status: "compliant", coverage: "100%", lastAudit: "Jan 2025" },
  { id: "2", name: "CCPA", region: "California, USA", status: "compliant", coverage: "100%", lastAudit: "Dec 2024" },
  { id: "3", name: "IT Act (India)", region: "India", status: "compliant", coverage: "98%", lastAudit: "Nov 2024" },
  { id: "4", name: "DMCA", region: "USA", status: "compliant", coverage: "100%", lastAudit: "Dec 2024" },
  { id: "5", name: "Consumer Protection", region: "Global", status: "review", coverage: "95%", lastAudit: "Oct 2024" },
  { id: "6", name: "Data Privacy Regulations", region: "Global", status: "compliant", coverage: "97%", lastAudit: "Jan 2025" },
  { id: "7", name: "Country-Specific Overrides", region: "Multi-Region", status: "active", coverage: "92%", lastAudit: "Jan 2025" },
];

const LMInternationalLaw = ({ activeSubSection }: LMInternationalLawProps) => {
  const handleAction = (action: string, item: string) => {
    const toastMap: Record<string, () => void> = {
      view: () => toast.info(`Viewing: ${item}`),
      edit: () => toast.info(`Editing: ${item}`),
      lock: () => toast.warning(`Locking: ${item}`),
      publish: () => toast.success(`Published: ${item}`),
      history: () => toast.info(`Viewing history: ${item}`),
    };
    toastMap[action]?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-800 flex items-center justify-center shadow-lg">
          <Globe className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">International Law Compliance</h1>
          <p className="text-muted-foreground">Global regulatory compliance management</p>
        </div>
      </div>

      {/* Compliance Cards */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lawCompliance.map((law) => (
              <motion.div
                key={law.id}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-600/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{law.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{law.region}</Badge>
                      <span className="text-xs text-muted-foreground">Coverage: {law.coverage}</span>
                      <span className="text-xs text-muted-foreground">Last Audit: {law.lastAudit}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={law.status === "compliant" ? "bg-emerald-500/20 text-emerald-400" : law.status === "review" ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-500/20 text-blue-400"}>
                    {law.status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("view", law.name)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("edit", law.name)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("lock", law.name)}>
                      <Lock className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("publish", law.name)}>
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("history", law.name)}>
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

export default LMInternationalLaw;
