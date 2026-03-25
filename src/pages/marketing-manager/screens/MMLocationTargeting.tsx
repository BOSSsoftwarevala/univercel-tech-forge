import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, Globe, Users, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useSystemActions } from "@/hooks/useSystemActions";

const MMLocationTargeting = () => {
  const { executeAction, actions } = useSystemActions();
  const [loading, setLoading] = useState(false);
  const [targets, setTargets] = useState([
    { id: "LOC001", continent: "Asia", country: "India", city: "Mumbai", audience: "2.5M", language: "Hindi, English", currency: "INR", status: "active" },
    { id: "LOC002", continent: "Asia", country: "India", city: "Delhi", audience: "3.1M", language: "Hindi, English", currency: "INR", status: "active" },
    { id: "LOC003", continent: "Europe", country: "UK", city: "London", audience: "1.8M", language: "English", currency: "GBP", status: "active" },
    { id: "LOC004", continent: "North America", country: "USA", city: "New York", audience: "4.2M", language: "English", currency: "USD", status: "pending" },
    { id: "LOC005", continent: "Middle East", country: "UAE", city: "Dubai", audience: "0.9M", language: "Arabic, English", currency: "AED", status: "active" },
  ]);

  const handleSetTarget = useCallback(async () => {
    setLoading(true);
    await executeAction({
      module: "marketing",
      action: "create",
      entityType: "location_target",
      entityId: "new",
    });
    toast.success("Location targeting request submitted for approval");
    setLoading(false);
  }, [executeAction]);

  const handleEditTarget = useCallback(async (id: string, city: string) => {
    await executeAction({
      module: "marketing",
      action: "update",
      entityType: "location_target",
      entityId: id,
      entityName: city,
    });
    toast.info(`Editing target: ${city}`);
  }, [executeAction]);

  const handleViewTarget = useCallback(async (id: string, city: string) => {
    await actions.read("marketing", "location_target", id, city);
    toast.info(`Viewing: ${city}`);
  }, [actions]);

  const handleDeleteTarget = useCallback(async (id: string, city: string) => {
    await actions.softDelete("marketing", "location_target", id, city);
    setTargets(prev => prev.filter(t => t.id !== id));
    toast.success("Location target deleted");
  }, [actions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Location Targeting</h2>
        <Button onClick={handleSetTarget} className="bg-emerald-600 hover:bg-emerald-700">
          <MapPin className="h-4 w-4 mr-2" />
          Set Target
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Globe className="h-8 w-8 text-emerald-400" />
              <div>
                <p className="text-slate-400 text-sm">Continents</p>
                <p className="text-2xl font-bold text-white">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-slate-400 text-sm">Countries</p>
                <p className="text-2xl font-bold text-white">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-slate-400 text-sm">Total Audience</p>
                <p className="text-2xl font-bold text-white">12.5M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-emerald-400">Active Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-400">Continent</TableHead>
                <TableHead className="text-slate-400">Country</TableHead>
                <TableHead className="text-slate-400">City</TableHead>
                <TableHead className="text-slate-400">Audience Size</TableHead>
                <TableHead className="text-slate-400">Language</TableHead>
                <TableHead className="text-slate-400">Currency</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {targets.map((target) => (
                <TableRow key={target.id} className="border-slate-700/50">
                  <TableCell className="text-white">{target.continent}</TableCell>
                  <TableCell className="text-slate-300">{target.country}</TableCell>
                  <TableCell className="text-slate-300">{target.city}</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">{target.audience}</TableCell>
                  <TableCell className="text-slate-300">{target.language}</TableCell>
                  <TableCell className="text-slate-300">{target.currency}</TableCell>
                  <TableCell>
                    <Badge className={
                      target.status === "active" ? "bg-emerald-500/20 text-emerald-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }>
                      {target.status}
                    </Badge>
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

export default MMLocationTargeting;
