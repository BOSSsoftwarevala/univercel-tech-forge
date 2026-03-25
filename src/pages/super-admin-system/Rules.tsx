import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Plus, Play, Pause, Eye, Globe, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import SuperAdminWireframeLayout from "@/components/super-admin-wireframe/SuperAdminWireframeLayout";

interface Rule {
  id: string;
  name: string;
  type: "security" | "business" | "compliance";
  scope: string;
  status: "active" | "inactive";
  impactLevel: "low" | "medium" | "high";
  affectedUsers: number;
}

const rules: Rule[] = [
  { id: "RUL-001", name: "Maximum Login Attempts", type: "security", scope: "Global", status: "active", impactLevel: "high", affectedUsers: 24891 },
  { id: "RUL-002", name: "Auto-suspend on Risk Score", type: "security", scope: "Global", status: "active", impactLevel: "high", affectedUsers: 24891 },
  { id: "RUL-003", name: "Rental Auto-Renewal", type: "business", scope: "Africa", status: "active", impactLevel: "medium", affectedUsers: 12500 },
  { id: "RUL-004", name: "GDPR Compliance Check", type: "compliance", scope: "Europe", status: "active", impactLevel: "high", affectedUsers: 8900 },
  { id: "RUL-005", name: "Inactive User Cleanup", type: "business", scope: "Global", status: "inactive", impactLevel: "low", affectedUsers: 0 },
];

const SuperAdminRules = () => {
  const [ruleStates, setRuleStates] = useState<Record<string, boolean>>(
    Object.fromEntries(rules.map(r => [r.id, r.status === "active"]))
  );

  const typeColors = {
    security: "bg-destructive/20 text-destructive border-destructive/50",
    business: "bg-primary/20 text-primary border-primary/50",
    compliance: "bg-neon-purple/20 text-neon-purple border-neon-purple/50",
  };

  const impactColors = {
    low: "text-neon-green",
    medium: "text-neon-orange",
    high: "text-destructive",
  };

  return (
    <SuperAdminWireframeLayout activeSection="rules">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Rule Management</h1>
            <p className="text-muted-foreground">Activate and manage system rules</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Rule
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {rules.map((rule, index) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="glass-panel">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        {rule.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground font-mono">{rule.id}</p>
                    </div>
                    <Switch
                      checked={ruleStates[rule.id]}
                      onCheckedChange={() => setRuleStates(prev => ({ ...prev, [rule.id]: !prev[rule.id] }))}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={typeColors[rule.type]} variant="outline">{rule.type}</Badge>
                    <Badge variant="outline"><Globe className="w-3 h-3 mr-1" />{rule.scope}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Zap className="w-4 h-4" />
                      Impact: <span className={impactColors[rule.impactLevel]}>{rule.impactLevel}</span>
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {rule.affectedUsers.toLocaleString()} users
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </SuperAdminWireframeLayout>
  );
};

export default SuperAdminRules;
