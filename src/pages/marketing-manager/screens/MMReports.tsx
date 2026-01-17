import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Filter, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useSystemActions } from "@/hooks/useSystemActions";

const MMReports = () => {
  const { executeAction, actions } = useSystemActions();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("daily");

  const handleRefreshReport = useCallback(async (period: string) => {
    setLoading(true);
    await actions.refresh("marketing", "report");
    toast.success(`${period} report refreshed`);
    setLoading(false);
  }, [actions]);

  const handleFilterChange = useCallback(async (filter: string) => {
    await executeAction({
      module: "marketing",
      action: "read",
      entityType: "report",
      entityId: filter,
    });
    toast.info(`Filter applied: ${filter}`);
  }, [executeAction]);

  const handleDateRangeSelect = useCallback(async () => {
    await actions.read("marketing", "report", "custom_range", "Custom Date Range");
    toast.info("Date range selector opened");
  }, [actions]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Marketing Reports</h2>
        <div className="flex items-center gap-2 text-yellow-400 text-sm">
          <AlertTriangle className="h-4 w-4" />
          No export / No copy
        </div>
      </div>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="daily" className="data-[state=active]:bg-emerald-600">Daily</TabsTrigger>
          <TabsTrigger value="weekly" className="data-[state=active]:bg-emerald-600">Weekly</TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:bg-emerald-600">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-emerald-400">Today's Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-slate-800/50 rounded">
                    <span className="text-slate-400">Impressions</span>
                    <span className="text-white font-medium">245,320</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-800/50 rounded">
                    <span className="text-slate-400">Clicks</span>
                    <span className="text-white font-medium">8,421</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-800/50 rounded">
                    <span className="text-slate-400">Conversions</span>
                    <span className="text-white font-medium">312</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-800/50 rounded">
                    <span className="text-slate-400">Spend</span>
                    <span className="text-white font-medium">₹18,450</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-emerald-400">Channel-wise Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { channel: "Social Media", spend: "₹8,200", conversions: 142 },
                    { channel: "Email", spend: "₹2,100", conversions: 85 },
                    { channel: "Display", spend: "₹5,400", conversions: 58 },
                    { channel: "PPC", spend: "₹2,750", conversions: 27 },
                  ].map((row) => (
                    <div key={row.channel} className="flex justify-between p-3 bg-slate-800/50 rounded">
                      <span className="text-white">{row.channel}</span>
                      <div className="flex gap-6 text-sm">
                        <span className="text-slate-400">{row.spend}</span>
                        <span className="text-emerald-400">{row.conversions} conv</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-emerald-400">Weekly Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-slate-500">
                Weekly performance chart
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-emerald-400">Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-slate-500">
                Monthly performance chart
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default MMReports;
