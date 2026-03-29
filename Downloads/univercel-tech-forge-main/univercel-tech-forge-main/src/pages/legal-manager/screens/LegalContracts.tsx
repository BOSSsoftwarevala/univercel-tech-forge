import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const LegalContracts = () => {
  const [contracts] = useState([
    { id: "CON001", party: "Vendor A - Cloud Services", region: "USA", validity: "2024-01-01 → 2026-12-31", status: "active" },
    { id: "CON002", party: "Partner B - Payment Gateway", region: "Global", validity: "2023-06-15 → 2025-06-14", status: "expiring_soon" },
    { id: "CON003", party: "Franchise C - India", region: "India", validity: "2025-01-01 → 2027-12-31", status: "active" },
    { id: "CON004", party: "Vendor D - SMS Provider", region: "Global", validity: "2024-03-01 → 2025-02-28", status: "expired" },
    { id: "CON005", party: "Partner E - Analytics", region: "EU", validity: "2025-04-01 → 2028-03-31", status: "active" },
    { id: "CON006", party: "Reseller F - Middle East", region: "UAE", validity: "2025-02-01 → 2027-01-31", status: "under_review" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400";
      case "expiring_soon": return "bg-yellow-500/20 text-yellow-400";
      case "expired": return "bg-red-500/20 text-red-400";
      case "under_review": return "bg-blue-500/20 text-blue-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const handleReview = (id: string) => {
    toast.info(`Reviewing contract ${id}`);
  };

  const handleFlagRisk = (id: string) => {
    toast.warning(`Risk flagged for contract ${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-white">Contracts</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="pt-6 text-center">
            <p className="text-slate-400 text-sm">Total Contracts</p>
            <p className="text-3xl font-bold text-white mt-2">{contracts.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="pt-6 text-center">
            <p className="text-slate-400 text-sm">Active</p>
            <p className="text-3xl font-bold text-emerald-400 mt-2">{contracts.filter(c => c.status === "active").length}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="pt-6 text-center">
            <p className="text-slate-400 text-sm">Expiring Soon</p>
            <p className="text-3xl font-bold text-yellow-400 mt-2">{contracts.filter(c => c.status === "expiring_soon").length}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="pt-6 text-center">
            <p className="text-slate-400 text-sm">Under Review</p>
            <p className="text-3xl font-bold text-blue-400 mt-2">{contracts.filter(c => c.status === "under_review").length}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-amber-400">All Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-400">Contract ID</TableHead>
                <TableHead className="text-slate-400">Party</TableHead>
                <TableHead className="text-slate-400">Region</TableHead>
                <TableHead className="text-slate-400">Validity</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id} className="border-slate-700/50">
                  <TableCell className="text-amber-400 font-mono">{contract.id}</TableCell>
                  <TableCell className="text-white">{contract.party}</TableCell>
                  <TableCell className="text-slate-300">{contract.region}</TableCell>
                  <TableCell className="text-slate-300 text-sm">{contract.validity}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(contract.status)}>
                      {contract.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleReview(contract.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleFlagRisk(contract.id)}>
                        <AlertTriangle className="h-4 w-4 text-red-400" />
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

export default LegalContracts;
