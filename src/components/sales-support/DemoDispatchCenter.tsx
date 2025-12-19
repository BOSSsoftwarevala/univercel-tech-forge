import { motion } from "framer-motion";
import { Send, Link, Eye, Clock, Copy, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DemoDispatchCenter = () => {
  const recentDemos = [
    { id: "DM-001", lead: "Tech Solutions Ltd", product: "POS System", status: "viewed", views: 3, sent: "2 hours ago" },
    { id: "DM-002", lead: "Healthcare Plus", product: "Hospital Suite", status: "pending", views: 0, sent: "30 min ago" },
    { id: "DM-003", lead: "EduLearn Academy", product: "School ERP", status: "expired", views: 1, sent: "3 days ago" },
    { id: "DM-004", lead: "Retail Mart", product: "Inventory Pro", status: "viewed", views: 5, sent: "1 day ago" },
  ];

  const suggestedDemos = [
    { product: "Restaurant POS", match: 95, category: "Hospitality" },
    { product: "Clinic Manager", match: 88, category: "Healthcare" },
    { product: "School ERP", match: 82, category: "Education" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "viewed": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "pending": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "expired": return "bg-red-500/20 text-red-300 border-red-500/30";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-100">Demo Dispatch Center</h2>
          <p className="text-slate-400">One-click demo sharing with tracking</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
          <Send className="w-4 h-4 mr-2" />
          Send New Demo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <Send className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-100">156</div>
            <div className="text-xs text-slate-400">Demos Sent</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <Eye className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">89%</div>
            <div className="text-xs text-slate-400">View Rate</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">4.2 min</div>
            <div className="text-xs text-slate-400">Avg. View Time</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-100">34%</div>
            <div className="text-xs text-slate-400">Conversion Rate</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-100 flex items-center gap-2">
                <Link className="w-5 h-5 text-cyan-400" />
                Quick Demo Link Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Select Product</label>
                  <Select>
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue placeholder="Choose product..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pos">POS System</SelectItem>
                      <SelectItem value="hospital">Hospital Management</SelectItem>
                      <SelectItem value="school">School ERP</SelectItem>
                      <SelectItem value="inventory">Inventory Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Lead Name</label>
                  <Input placeholder="Enter lead name..." className="bg-slate-800 border-slate-700" />
                </div>
              </div>
              
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Generated Link</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="text-cyan-400">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-cyan-400">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <code className="text-cyan-300 text-sm break-all">
                  https://demo.softwarevala.com/pos-system?ref=sarah-chen&lead=tech-solutions
                </code>
              </div>

              <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
                <Send className="w-4 h-4 mr-2" />
                Generate & Send Demo Link
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-cyan-500/20 mt-6">
            <CardHeader>
              <CardTitle className="text-cyan-100">Recent Demo Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentDemos.map((demo, index) => (
                  <motion.div
                    key={demo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-cyan-400 text-sm">{demo.id}</span>
                      <div>
                        <p className="text-cyan-100 font-medium">{demo.lead}</p>
                        <p className="text-xs text-slate-400">{demo.product}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={getStatusBadge(demo.status)}>{demo.status}</Badge>
                        <p className="text-xs text-slate-500 mt-1">{demo.views} views • {demo.sent}</p>
                      </div>
                      {demo.status === "pending" && (
                        <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-300">
                          Remind
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-100 text-lg">AI Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestedDemos.map((demo, index) => (
                <motion.div
                  key={demo.product}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-cyan-100">{demo.product}</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300">{demo.match}% match</Badge>
                  </div>
                  <span className="text-xs text-slate-400">{demo.category}</span>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-900/30 to-red-900/30 border-amber-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <span className="font-medium text-amber-100">Follow-Up Required</span>
              </div>
              <p className="text-sm text-slate-300 mb-3">3 demos haven't been viewed in 48+ hours</p>
              <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                Send Bulk Reminder
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DemoDispatchCenter;
