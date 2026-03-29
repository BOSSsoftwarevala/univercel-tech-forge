import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Calendar,
  Download,
  Mail,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from "lucide-react";

// Mock reports data
const reports = [
  {
    id: 1,
    title: "Daily AI Summary",
    type: "daily",
    generatedAt: "Today, 6:00 AM",
    status: "delivered",
    recipients: ["Boss", "CEO"],
    highlights: ["847 actions monitored", "3 risks detected", "12 approvals pending"]
  },
  {
    id: 2,
    title: "Weekly Executive Brief",
    type: "weekly",
    generatedAt: "Sunday, 8:00 PM",
    status: "delivered",
    recipients: ["Boss", "CEO"],
    highlights: ["Revenue +8%", "New franchises: 12", "SLA compliance: 99.2%"]
  },
  {
    id: 3,
    title: "Monthly Risk Report",
    type: "monthly",
    generatedAt: "Dec 31, 2024",
    status: "delivered",
    recipients: ["Boss"],
    highlights: ["45 risks addressed", "0 critical breaches", "Fraud prevented: $24K"]
  },
  {
    id: 4,
    title: "Decision Accuracy Report",
    type: "monthly",
    generatedAt: "Dec 31, 2024",
    status: "delivered",
    recipients: ["Boss", "CEO"],
    highlights: ["AI accuracy: 94%", "False positives: 3%", "Improvement: +2%"]
  },
];

const upcomingReports = [
  { title: "Daily AI Summary", scheduled: "Tomorrow 6:00 AM" },
  { title: "Weekly Executive Brief", scheduled: "Sunday 8:00 PM" },
  { title: "Monthly Risk Report", scheduled: "Jan 31, 2025" },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'daily': return 'bg-blue-500/20 text-blue-400';
    case 'weekly': return 'bg-violet-500/20 text-violet-400';
    case 'monthly': return 'bg-emerald-500/20 text-emerald-400';
    default: return 'bg-slate-500/20 text-slate-400';
  }
};

const AICEOReports = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 via-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Reports</h1>
            <p className="text-cyan-400/80">Auto-generated intelligence reports</p>
          </div>
        </div>
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          <FileText className="w-3 h-3 mr-1" />
          {reports.length} Reports Available
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Daily Reports", count: 365, icon: Calendar, color: "text-blue-400" },
          { label: "Weekly Reports", count: 52, icon: TrendingUp, color: "text-violet-400" },
          { label: "Monthly Reports", count: 12, icon: FileText, color: "text-emerald-400" },
          { label: "Delivered", count: "100%", icon: CheckCircle, color: "text-cyan-400" },
        ].map((stat, i) => (
          <Card key={stat.label} className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-4 flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className="text-lg font-bold text-white">{stat.count}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent Reports */}
        <div className="col-span-2">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {reports.map((report, i) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/30 hover:border-blue-500/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-white">{report.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="text-sm text-slate-400">{report.generatedAt}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(report.type)}>{report.type}</Badge>
                          <Badge className="bg-emerald-500/20 text-emerald-400">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {report.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-400">
                          Delivered to: {report.recipients.join(", ")}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {report.highlights.map((highlight, j) => (
                          <Badge key={j} variant="outline" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-end">
                        <Button size="sm" variant="ghost" className="text-cyan-400 hover:text-cyan-300">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Reports */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-violet-400" />
              Upcoming Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingReports.map((report, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30"
                >
                  <p className="text-sm font-medium text-white">{report.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-400">{report.scheduled}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Notice */}
      <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-blue-400" />
          <p className="text-sm text-blue-400/80">
            <strong>Report Delivery:</strong> All reports are auto-generated and delivered to Boss and CEO. No manual intervention required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICEOReports;
