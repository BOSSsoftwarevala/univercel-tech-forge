import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Shield, Database, UserCheck } from "lucide-react";
import { toast } from "sonner";

const LegalComplianceChecklist = () => {
  const [gdprItems] = useState([
    { id: "GDPR001", item: "Right to Access (Art. 15)", status: "compliant", lastReview: "2025-06-15" },
    { id: "GDPR002", item: "Right to Erasure (Art. 17)", status: "compliant", lastReview: "2025-06-15" },
    { id: "GDPR003", item: "Data Portability (Art. 20)", status: "review_needed", lastReview: "2025-04-10" },
    { id: "GDPR004", item: "Consent Management", status: "compliant", lastReview: "2025-06-18" },
    { id: "GDPR005", item: "DPO Appointment", status: "compliant", lastReview: "2025-01-01" },
  ]);

  const [kycItems] = useState([
    { id: "KYC001", item: "Identity Verification Flow", status: "compliant", lastReview: "2025-06-10" },
    { id: "KYC002", item: "Document Storage Encryption", status: "compliant", lastReview: "2025-06-10" },
    { id: "KYC003", item: "PEP/Sanctions Screening", status: "concern", lastReview: "2025-06-20" },
  ]);

  const [dataProtection] = useState([
    { id: "DP001", item: "Data Encryption at Rest", status: "compliant", lastReview: "2025-06-01" },
    { id: "DP002", item: "Data Encryption in Transit", status: "compliant", lastReview: "2025-06-01" },
    { id: "DP003", item: "Access Control Policies", status: "compliant", lastReview: "2025-06-15" },
    { id: "DP004", item: "Data Retention Policy", status: "review_needed", lastReview: "2025-03-20" },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant": return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case "review_needed": return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case "concern": return <AlertTriangle className="h-5 w-5 text-red-400" />;
      default: return <CheckCircle className="h-5 w-5 text-slate-400" />;
    }
  };

  const handleMarkReviewed = (id: string) => {
    toast.success(`Item ${id} marked as reviewed`);
  };

  const handleRaiseConcern = (id: string) => {
    toast.warning(`Concern raised for item ${id}`);
  };

  const renderChecklist = (items: typeof gdprItems, icon: React.ReactNode, title: string) => (
    <Card className="bg-slate-900/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-amber-400 flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-lg p-3">
            <div className="flex items-center gap-3">
              {getStatusIcon(item.status)}
              <div>
                <p className="text-white text-sm">{item.item}</p>
                <p className="text-slate-500 text-xs">Last review: {item.lastReview}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={
                item.status === "compliant" ? "bg-emerald-500/20 text-emerald-400" :
                item.status === "review_needed" ? "bg-yellow-500/20 text-yellow-400" :
                "bg-red-500/20 text-red-400"
              }>
                {item.status.replace("_", " ")}
              </Badge>
              <Button size="sm" variant="ghost" onClick={() => handleMarkReviewed(item.id)}>
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleRaiseConcern(item.id)}>
                <AlertTriangle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-white">Compliance Checklist</h2>

      {renderChecklist(gdprItems, <Shield className="h-5 w-5" />, "GDPR / Local Law Status")}
      {renderChecklist(kycItems, <UserCheck className="h-5 w-5" />, "KYC / AML Checks")}
      {renderChecklist(dataProtection, <Database className="h-5 w-5" />, "Data Protection Rules")}
    </motion.div>
  );
};

export default LegalComplianceChecklist;
