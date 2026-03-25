import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit } from "lucide-react";
import { toast } from "sonner";

const LegalPoliciesTerms = () => {
  const [policies, setPolicies] = useState([
    { id: "POL001", name: "Terms of Service", version: "3.2", region: "Global", status: "active", lastUpdated: "2025-06-15" },
    { id: "POL002", name: "Privacy Policy", version: "4.1", region: "Global", status: "active", lastUpdated: "2025-06-10" },
    { id: "POL003", name: "GDPR Addendum", version: "2.0", region: "EU", status: "active", lastUpdated: "2025-05-20" },
    { id: "POL004", name: "Cookie Policy", version: "1.8", region: "Global", status: "review", lastUpdated: "2025-06-18" },
    { id: "POL005", name: "Refund Policy", version: "2.3", region: "Global", status: "active", lastUpdated: "2025-04-01" },
    { id: "POL006", name: "CCPA Disclosure", version: "1.5", region: "USA", status: "active", lastUpdated: "2025-03-15" },
    { id: "POL007", name: "Data Processing Agreement", version: "3.0", region: "Global", status: "draft", lastUpdated: "2025-06-20" },
  ]);
  const [viewingPolicy, setViewingPolicy] = useState<string | null>(null);

  const handleProposeUpdate = (id: string) => {
    const policy = policies.find(p => p.id === id);
    if (policy) {
      setPolicies(prev => prev.map(p => 
        p.id === id ? { ...p, status: 'review' } : p
      ));
      toast.success(`Update proposal for "${policy.name}" submitted for boss approval`);
    }
  };

  const handleView = (id: string) => {
    const policy = policies.find(p => p.id === id);
    if (policy) {
      setViewingPolicy(id);
      toast.success(`Viewing: ${policy.name} v${policy.version}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-white">Policies & Terms</h2>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-amber-400">All Legal Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-400">Document Name</TableHead>
                <TableHead className="text-slate-400">Version</TableHead>
                <TableHead className="text-slate-400">Region</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">Last Updated</TableHead>
                <TableHead className="text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((policy) => (
                <TableRow key={policy.id} className="border-slate-700/50">
                  <TableCell className="text-white font-medium">{policy.name}</TableCell>
                  <TableCell className="text-slate-300">v{policy.version}</TableCell>
                  <TableCell className="text-slate-300">{policy.region}</TableCell>
                  <TableCell>
                    <Badge className={
                      policy.status === "active" ? "bg-emerald-500/20 text-emerald-400" :
                      policy.status === "review" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-slate-500/20 text-slate-400"
                    }>
                      {policy.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">{policy.lastUpdated}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleView(policy.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleProposeUpdate(policy.id)}>
                        <Edit className="h-4 w-4 text-amber-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LegalPoliciesTerms;
