import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Link2, Shield, Globe, TrendingUp, AlertTriangle,
  FileText, MessageSquare, HelpCircle, Sparkles, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const BacklinkManager = () => {
  const [activeTab, setActiveTab] = useState("suggestions");

  const backlinkSuggestions = [
    { domain: "techcrunch.com", da: 94, relevance: 85, type: "Guest Post", status: "available" },
    { domain: "forbes.com/africa", da: 92, relevance: 90, type: "Press Release", status: "available" },
    { domain: "businessdaily.africa", da: 68, relevance: 95, type: "Sponsored", status: "pending" },
    { domain: "gulfnews.com", da: 82, relevance: 88, type: "Guest Post", status: "available" },
    { domain: "economictimes.com", da: 91, relevance: 82, type: "Press Release", status: "contacted" },
  ];

  const existingBacklinks = [
    { domain: "medium.com", da: 95, anchor: "best pos software", status: "healthy", risk: "low" },
    { domain: "linkedin.com", da: 98, anchor: "software vala", status: "healthy", risk: "low" },
    { domain: "quora.com", da: 93, anchor: "school management", status: "healthy", risk: "low" },
    { domain: "reddit.com", da: 97, anchor: "hospital software", status: "warning", risk: "medium" },
    { domain: "spamsite.xyz", da: 12, anchor: "click here", status: "toxic", risk: "high" },
  ];

  const outreachTemplates = [
    { name: "Guest Post Pitch", type: "email", success: 34 },
    { name: "Press Release", type: "formal", success: 28 },
    { name: "Forum Introduction", type: "casual", success: 45 },
    { name: "Q&A Response", type: "helpful", success: 52 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Backlink & Outreach Automation</h2>
          <p className="text-slate-400">AI-powered link building & authority growth</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
          <Sparkles className="w-4 h-4 mr-2" />
          Scan New Opportunities
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Backlinks", value: "2,847", icon: Link2, color: "cyan" },
          { label: "Domain Authority", value: "72", icon: TrendingUp, color: "emerald" },
          { label: "Healthy Links", value: "96%", icon: Shield, color: "green" },
          { label: "Toxic Links", value: "12", icon: AlertTriangle, color: "red" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-${stat.color}-500/20`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {["suggestions", "existing", "outreach"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                : "bg-slate-800/50 text-slate-400 hover:text-white"
            }`}
          >
            {tab === "suggestions" && "Safe Suggestions"}
            {tab === "existing" && "Existing Links"}
            {tab === "outreach" && "Outreach Tools"}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "suggestions" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden"
        >
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="text-left p-4 text-xs font-medium text-slate-400">DOMAIN</th>
                <th className="text-left p-4 text-xs font-medium text-slate-400">DA</th>
                <th className="text-left p-4 text-xs font-medium text-slate-400">RELEVANCE</th>
                <th className="text-left p-4 text-xs font-medium text-slate-400">TYPE</th>
                <th className="text-left p-4 text-xs font-medium text-slate-400">STATUS</th>
                <th className="text-left p-4 text-xs font-medium text-slate-400">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {backlinkSuggestions.map((link, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-700/30 hover:bg-slate-800/30"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span className="text-white">{link.domain}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-emerald-400 font-medium">{link.da}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Progress value={link.relevance} className="w-20 h-2" />
                      <span className="text-xs text-slate-400">{link.relevance}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                      {link.type}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge className={`${
                      link.status === "available" ? "bg-green-500/20 text-green-400" :
                      link.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-blue-500/20 text-blue-400"
                    }`}>
                      {link.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Button size="sm" variant="outline" className="border-slate-600 text-xs">
                      Start Outreach
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {activeTab === "existing" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden"
        >
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="text-left p-4 text-xs font-medium text-slate-400">SOURCE</th>
                <th className="text-left p-4 text-xs font-medium text-slate-400">DA</th>
                <th className="text-left p-4 text-xs font-medium text-slate-400">ANCHOR TEXT</th>
                <th className="text-left p-4 text-xs font-medium text-slate-400">STATUS</th>
                <th className="text-left p-4 text-xs font-medium text-slate-400">RISK</th>
                <th className="text-left p-4 text-xs font-medium text-slate-400">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {existingBacklinks.map((link, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-700/30 hover:bg-slate-800/30"
                >
                  <td className="p-4">
                    <span className="text-white">{link.domain}</span>
                  </td>
                  <td className="p-4">
                    <span className={`font-medium ${link.da > 50 ? "text-emerald-400" : "text-red-400"}`}>
                      {link.da}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-300">{link.anchor}</span>
                  </td>
                  <td className="p-4">
                    <Badge className={`${
                      link.status === "healthy" ? "bg-green-500/20 text-green-400" :
                      link.status === "warning" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {link.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className={`${
                      link.risk === "low" ? "border-green-500 text-green-400" :
                      link.risk === "medium" ? "border-yellow-500 text-yellow-400" :
                      "border-red-500 text-red-400"
                    }`}>
                      {link.risk}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {link.status === "toxic" && (
                      <Button size="sm" variant="destructive" className="text-xs">
                        Disavow
                      </Button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {activeTab === "outreach" && (
        <div className="grid grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Auto-Draft Templates
            </h3>
            <div className="space-y-3">
              {outreachTemplates.map((template, index) => (
                <motion.div
                  key={template.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-slate-800/50 rounded-lg flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-white">{template.name}</p>
                    <p className="text-xs text-slate-400">{template.type} tone</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-cyan-400">{template.success}%</p>
                    <p className="text-xs text-slate-500">success rate</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-slate-800/50 hover:bg-slate-800">
                <FileText className="w-4 h-4 mr-2 text-cyan-400" />
                Generate Guest Post Draft
              </Button>
              <Button className="w-full justify-start bg-slate-800/50 hover:bg-slate-800">
                <Globe className="w-4 h-4 mr-2 text-purple-400" />
                Create Press Release
              </Button>
              <Button className="w-full justify-start bg-slate-800/50 hover:bg-slate-800">
                <HelpCircle className="w-4 h-4 mr-2 text-emerald-400" />
                Forum & Q/A Suggestions
              </Button>
              <Button className="w-full justify-start bg-slate-800/50 hover:bg-slate-800">
                <Shield className="w-4 h-4 mr-2 text-orange-400" />
                Check Spam Risk
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BacklinkManager;
