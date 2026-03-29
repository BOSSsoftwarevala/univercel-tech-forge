import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle } from "lucide-react";

const LegalReports = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Legal Reports</h2>
        <div className="flex items-center gap-2 text-yellow-400 text-sm">
          <AlertTriangle className="h-4 w-4" />
          No export / No copy
        </div>
      </div>

      <Tabs defaultValue="compliance" className="w-full">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="compliance" className="data-[state=active]:bg-amber-600">Compliance</TabsTrigger>
          <TabsTrigger value="incidents" className="data-[state=active]:bg-amber-600">Incidents</TabsTrigger>
          <TabsTrigger value="risk" className="data-[state=active]:bg-amber-600">Risk Exposure</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-amber-400">Compliance Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <p className="text-slate-400 text-sm">Overall Compliance</p>
                    <p className="text-3xl font-bold text-emerald-400 mt-2">94%</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <p className="text-slate-400 text-sm">Regions Compliant</p>
                    <p className="text-3xl font-bold text-white mt-2">8/9</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <p className="text-slate-400 text-sm">Pending Reviews</p>
                    <p className="text-3xl font-bold text-yellow-400 mt-2">3</p>
                  </div>
                </div>
                <div className="h-48 flex items-center justify-center text-slate-500 bg-slate-800/30 rounded-lg">
                  Compliance trend chart
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-amber-400">Incident Resolution Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <p className="text-slate-400 text-sm">Total Incidents</p>
                    <p className="text-2xl font-bold text-white mt-2">24</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <p className="text-slate-400 text-sm">Resolved</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-2">18</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <p className="text-slate-400 text-sm">In Progress</p>
                    <p className="text-2xl font-bold text-blue-400 mt-2">4</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <p className="text-slate-400 text-sm">Escalated</p>
                    <p className="text-2xl font-bold text-red-400 mt-2">2</p>
                  </div>
                </div>
                <div className="h-48 flex items-center justify-center text-slate-500 bg-slate-800/30 rounded-lg">
                  Incident resolution timeline
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-amber-400">Risk Exposure Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { category: "Contract Risk", level: "Low", score: 15 },
                  { category: "Compliance Risk", level: "Low", score: 8 },
                  { category: "IP Risk", level: "Medium", score: 35 },
                  { category: "Litigation Risk", level: "Low", score: 12 },
                ].map((risk) => (
                  <div key={risk.category} className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white">{risk.category}</span>
                      <span className={
                        risk.level === "Low" ? "text-emerald-400" :
                        risk.level === "Medium" ? "text-yellow-400" :
                        "text-red-400"
                      }>{risk.level}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          risk.level === "Low" ? "bg-emerald-500" :
                          risk.level === "Medium" ? "bg-yellow-500" :
                          "bg-red-500"
                        }`}
                        style={{ width: `${risk.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default LegalReports;
