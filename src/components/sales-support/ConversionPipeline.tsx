import { motion } from "framer-motion";
import { GitBranch, User, Clock, DollarSign, ArrowRight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ConversionPipeline = () => {
  const stages = [
    { 
      name: "New Leads", 
      color: "cyan", 
      count: 12, 
      value: "$45,000",
      leads: [
        { name: "Global Tech", value: "$15,000", time: "2 days" },
        { name: "MedCare Inc", value: "$12,000", time: "1 day" },
        { name: "EduPlus", value: "$8,000", time: "3 days" },
      ]
    },
    { 
      name: "Contacted", 
      color: "blue", 
      count: 8, 
      value: "$32,000",
      leads: [
        { name: "RetailMax", value: "$18,000", time: "5 days" },
        { name: "LogiFlow", value: "$14,000", time: "4 days" },
      ]
    },
    { 
      name: "Demo Sent", 
      color: "purple", 
      count: 6, 
      value: "$28,000",
      leads: [
        { name: "FinServe", value: "$20,000", time: "7 days" },
        { name: "BuildCorp", value: "$8,000", time: "6 days" },
      ]
    },
    { 
      name: "Negotiation", 
      color: "amber", 
      count: 4, 
      value: "$22,000",
      leads: [
        { name: "TechStart", value: "$15,000", time: "10 days" },
        { name: "HealthPro", value: "$7,000", time: "8 days" },
      ]
    },
    { 
      name: "Closed Won", 
      color: "emerald", 
      count: 8, 
      value: "$58,000",
      leads: [
        { name: "CloudNine", value: "$25,000", time: "Closed" },
        { name: "DataSync", value: "$18,000", time: "Closed" },
      ]
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
      cyan: { bg: "bg-cyan-500/20", border: "border-cyan-500/30", text: "text-cyan-400", badge: "bg-cyan-500" },
      blue: { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400", badge: "bg-blue-500" },
      purple: { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-400", badge: "bg-purple-500" },
      amber: { bg: "bg-amber-500/20", border: "border-amber-500/30", text: "text-amber-400", badge: "bg-amber-500" },
      emerald: { bg: "bg-emerald-500/20", border: "border-emerald-500/30", text: "text-emerald-400", badge: "bg-emerald-500" },
    };
    return colors[color] || colors.cyan;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-100">Conversion Pipeline</h2>
          <p className="text-slate-400">Visual sales funnel with drag-and-drop stages</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-cyan-100">$185,000</div>
            <div className="text-xs text-slate-400">Total Pipeline Value</div>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5">
            <TrendingUp className="w-4 h-4 mr-1" />
            +23% vs Last Month
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stages.map((stage, stageIndex) => {
          const colorClasses = getColorClasses(stage.color);
          return (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stageIndex * 0.1 }}
            >
              <Card className={`bg-slate-900/50 ${colorClasses.border} h-full`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className={`text-sm ${colorClasses.text}`}>{stage.name}</CardTitle>
                    <Badge className={`${colorClasses.badge} text-white`}>{stage.count}</Badge>
                  </div>
                  <div className="text-lg font-bold text-slate-100">{stage.value}</div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stage.leads.map((lead, leadIndex) => (
                    <motion.div
                      key={lead.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: stageIndex * 0.1 + leadIndex * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className={`p-3 rounded-lg ${colorClasses.bg} cursor-grab active:cursor-grabbing`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <User className={`w-3 h-3 ${colorClasses.text}`} />
                        <span className="text-sm font-medium text-slate-200">{lead.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={colorClasses.text}>
                          <DollarSign className="w-3 h-3 inline" />
                          {lead.value}
                        </span>
                        <span className="text-slate-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {lead.time}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  {stageIndex < stages.length - 1 && (
                    <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-slate-600" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <GitBranch className="w-8 h-8 text-cyan-400" />
              <div>
                <div className="text-2xl font-bold text-cyan-100">38</div>
                <div className="text-xs text-slate-400">Total in Pipeline</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold text-emerald-100">68%</div>
                <div className="text-xs text-slate-400">Conversion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-400" />
              <div>
                <div className="text-2xl font-bold text-amber-100">12 days</div>
                <div className="text-xs text-slate-400">Avg. Sales Cycle</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-purple-100">$4,868</div>
                <div className="text-xs text-slate-400">Avg. Deal Size</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConversionPipeline;
