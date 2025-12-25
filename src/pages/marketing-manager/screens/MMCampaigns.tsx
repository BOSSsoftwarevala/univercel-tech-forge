import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pause, Eye, Play } from "lucide-react";
import { toast } from "sonner";

const MMCampaigns = () => {
  const [campaigns] = useState([
    { id: "CMP001", name: "Summer Sale 2025", channel: "Social Media", status: "active", start: "2025-06-01", end: "2025-06-30", kpi: "10K leads" },
    { id: "CMP002", name: "Festival Promo", channel: "Email", status: "scheduled", start: "2025-07-10", end: "2025-07-20", kpi: "5K signups" },
    { id: "CMP003", name: "Brand Awareness", channel: "Display", status: "active", start: "2025-05-15", end: "2025-08-15", kpi: "2M reach" },
    { id: "CMP004", name: "Retargeting Q2", channel: "PPC", status: "paused", start: "2025-04-01", end: "2025-06-30", kpi: "500 conversions" },
    { id: "CMP005", name: "Influencer Wave", channel: "Influencer", status: "completed", start: "2025-03-01", end: "2025-03-31", kpi: "100K views" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "scheduled": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "paused": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "completed": return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const handleCreateCampaign = () => {
    toast.info("Campaign creation request submitted for approval");
  };

  const handlePause = (id: string) => {
    toast.success(`Campaign ${id} paused`);
  };

  const handleResume = (id: string) => {
    toast.success(`Campaign ${id} resumed`);
  };

  const handleView = (id: string) => {
    toast.info(`Viewing campaign ${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Campaign Management</h2>
        <Button onClick={handleCreateCampaign} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-emerald-400">All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-400">Campaign Name</TableHead>
                <TableHead className="text-slate-400">Channel</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">Start–End</TableHead>
                <TableHead className="text-slate-400">KPI</TableHead>
                <TableHead className="text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id} className="border-slate-700/50">
                  <TableCell className="text-white font-medium">{campaign.name}</TableCell>
                  <TableCell className="text-slate-300">{campaign.channel}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">{campaign.start} → {campaign.end}</TableCell>
                  <TableCell className="text-slate-300">{campaign.kpi}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleView(campaign.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {campaign.status === "active" ? (
                        <Button size="sm" variant="ghost" onClick={() => handlePause(campaign.id)}>
                          <Pause className="h-4 w-4 text-yellow-400" />
                        </Button>
                      ) : campaign.status === "paused" ? (
                        <Button size="sm" variant="ghost" onClick={() => handleResume(campaign.id)}>
                          <Play className="h-4 w-4 text-emerald-400" />
                        </Button>
                      ) : null}
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

export default MMCampaigns;
