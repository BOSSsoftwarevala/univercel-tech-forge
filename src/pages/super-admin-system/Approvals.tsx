import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Clock, User, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SuperAdminWireframeLayout from "@/components/super-admin-wireframe/SuperAdminWireframeLayout";

const approvals = [
  { id: "APR-001", type: "Withdrawal", requester: "USR-123", amount: "$5,000", riskScore: 25, status: "pending", createdAt: "2 hours ago" },
  { id: "APR-002", type: "Role Change", requester: "USR-456", amount: null, riskScore: 45, status: "pending", createdAt: "4 hours ago" },
  { id: "APR-003", type: "Withdrawal", requester: "USR-789", amount: "$15,000", riskScore: 78, status: "pending", createdAt: "6 hours ago" },
  { id: "APR-004", type: "Account Unlock", requester: "USR-012", amount: null, riskScore: 15, status: "pending", createdAt: "1 day ago" },
];

const SuperAdminApprovals = () => {
  const getRiskColor = (score: number) => {
    if (score < 30) return "text-neon-green bg-neon-green/10 border-neon-green/50";
    if (score < 60) return "text-neon-orange bg-neon-orange/10 border-neon-orange/50";
    return "text-destructive bg-destructive/10 border-destructive/50";
  };

  return (
    <SuperAdminWireframeLayout activeSection="approvals">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Pending Approvals</h1>
          <p className="text-muted-foreground">Review and process approval requests</p>
        </div>

        <div className="space-y-4">
          {approvals.map((approval, index) => (
            <motion.div
              key={approval.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-panel">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="p-3 rounded-xl bg-primary/10">
                        {approval.amount ? <DollarSign className="w-6 h-6 text-primary" /> : <User className="w-6 h-6 text-primary" />}
                      </div>
                      <div>
                        <h3 className="font-semibold">{approval.type}</h3>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-mono">{approval.id}</span> • Requested by {approval.requester}
                        </p>
                        {approval.amount && <p className="text-lg font-bold text-primary mt-1">{approval.amount}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={getRiskColor(approval.riskScore)} variant="outline">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Risk: {approval.riskScore}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {approval.createdAt}
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" className="text-destructive hover:text-destructive">
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button className="bg-neon-green/20 text-neon-green hover:bg-neon-green/30 border border-neon-green/50">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    </div>
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

export default SuperAdminApprovals;
