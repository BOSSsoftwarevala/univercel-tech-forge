import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bug, 
  Wand2, 
  AlertTriangle,
  FileX,
  Lock,
  ArrowUpRight,
  CheckCircle2
} from "lucide-react";

const demoIssues = [
  { 
    demo: "HotelHub Demo - UAE",
    issueType: "Broken Button",
    description: "Checkout button not responding",
    severity: "high",
    detected: "2 hours ago",
    status: "open"
  },
  { 
    demo: "SalonPro Demo - India",
    issueType: "Page Not Loading",
    description: "Booking page returns 500 error",
    severity: "critical",
    detected: "1 hour ago",
    status: "open"
  },
  { 
    demo: "RetailMaster Demo - Kenya",
    issueType: "Permission Error",
    description: "Admin panel access denied",
    severity: "medium",
    detected: "5 hours ago",
    status: "in-progress"
  },
  { 
    demo: "FoodServe Demo - Nigeria",
    issueType: "Broken Button",
    description: "Add to cart not working",
    severity: "high",
    detected: "1 day ago",
    status: "resolved"
  },
  { 
    demo: "StockFlow Demo - Egypt",
    issueType: "Page Not Loading",
    description: "Dashboard timeout issue",
    severity: "medium",
    detected: "2 days ago",
    status: "resolved"
  },
];

const issueIcons: Record<string, typeof Bug> = {
  "Broken Button": Bug,
  "Page Not Loading": FileX,
  "Permission Error": Lock,
};

export const DemoIssues = () => {
  const openIssues = demoIssues.filter(i => i.status !== "resolved");
  const resolvedIssues = demoIssues.filter(i => i.status === "resolved");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Demo Issues</h1>
          <p className="text-muted-foreground">Track and resolve demo problems</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 text-amber-400 border-amber-400/30">
            <Wand2 className="w-4 h-4" />
            Auto Fix All (AI)
          </Button>
          <Button variant="outline" className="gap-2">
            <ArrowUpRight className="w-4 h-4" />
            Escalate to Dev
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Issues", value: demoIssues.length, color: "from-violet-500 to-purple-500" },
          { label: "Open", value: demoIssues.filter(i => i.status === "open").length, color: "from-red-500 to-orange-500" },
          { label: "In Progress", value: demoIssues.filter(i => i.status === "in-progress").length, color: "from-amber-500 to-orange-500" },
          { label: "Resolved", value: resolvedIssues.length, color: "from-emerald-500 to-teal-500" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Open Issues */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Open Issues ({openIssues.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {openIssues.map((issue, index) => {
              const Icon = issueIcons[issue.issueType] || Bug;
              return (
                <motion.div
                  key={issue.demo}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center justify-between p-4 rounded-lg bg-background/50 border transition-all ${
                    issue.severity === "critical" ? "border-red-500/50" :
                    issue.severity === "high" ? "border-orange-500/30" : "border-border/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      issue.severity === "critical" ? "bg-red-500/20" :
                      issue.severity === "high" ? "bg-orange-500/20" : "bg-amber-500/20"
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        issue.severity === "critical" ? "text-red-400" :
                        issue.severity === "high" ? "text-orange-400" : "text-amber-400"
                      }`} />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{issue.demo}</div>
                      <div className="text-sm text-muted-foreground">{issue.description}</div>
                      <div className="text-xs text-muted-foreground">Detected {issue.detected}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{issue.issueType}</Badge>
                    <Badge 
                      variant="outline" 
                      className={
                        issue.severity === "critical" ? "text-red-400 border-red-400/30" :
                        issue.severity === "high" ? "text-orange-400 border-orange-400/30" :
                        "text-amber-400 border-amber-400/30"
                      }
                    >
                      {issue.severity}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={
                        issue.status === "open" ? "text-red-400 border-red-400/30" :
                        "text-amber-400 border-amber-400/30"
                      }
                    >
                      {issue.status}
                    </Badge>
                    <Button size="sm" className="gap-1 bg-amber-500 hover:bg-amber-600">
                      <Wand2 className="w-3 h-3" />
                      AI Fix
                    </Button>
                    <Button size="sm" variant="outline">
                      Escalate
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Resolved Issues */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Resolved ({resolvedIssues.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {resolvedIssues.map((issue, index) => (
              <motion.div
                key={issue.demo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-emerald-500/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{issue.demo}</div>
                    <div className="text-sm text-muted-foreground">{issue.description}</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">
                  Resolved
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
