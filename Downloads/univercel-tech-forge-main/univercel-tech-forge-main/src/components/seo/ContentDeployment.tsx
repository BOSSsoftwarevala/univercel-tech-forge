import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Upload, Eye, History, GitBranch, CheckCircle, 
  XCircle, Clock, Rocket, RotateCcw, Beaker
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ContentDeployment = () => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const deploymentQueue = [
    { id: "1", page: "POS Product Page", type: "meta", status: "pending", author: "AI Engine", created: "10 min ago" },
    { id: "2", page: "School Management Landing", type: "content", status: "testing", author: "SEO Team", created: "1 hour ago" },
    { id: "3", page: "Hospital ERP Features", type: "schema", status: "approved", author: "AI Engine", created: "2 hours ago" },
  ];

  const versionHistory = [
    { version: "v2.4.1", page: "POS Product Page", deployedAt: "Yesterday", deployedBy: "AI Engine", status: "live" },
    { version: "v2.4.0", page: "POS Product Page", deployedAt: "3 days ago", deployedBy: "SEO Team", status: "archived" },
    { version: "v2.3.2", page: "POS Product Page", deployedAt: "1 week ago", deployedBy: "AI Engine", status: "archived" },
  ];

  const abTests = [
    { 
      name: "POS Meta Title Test", 
      variants: ["Best POS System | Software Vala", "Top-Rated POS Software 2024"],
      traffic: [55, 45],
      conversions: [3.2, 2.8],
      winner: "A",
      status: "running"
    },
    { 
      name: "School Landing H1", 
      variants: ["Transform Your School Management", "Complete School Management Solution"],
      traffic: [50, 50],
      conversions: [4.1, 4.5],
      winner: "B",
      status: "concluded"
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "testing": return "bg-blue-500/20 text-blue-400";
      case "approved": return "bg-green-500/20 text-green-400";
      case "live": return "bg-green-500/20 text-green-400";
      case "running": return "bg-cyan-500/20 text-cyan-400";
      case "concluded": return "bg-purple-500/20 text-purple-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Rocket className="w-6 h-6 text-cyan-400" />
            Content Deployment Control
          </h2>
          <p className="text-slate-400">Publish, test, and manage SEO content versions</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
          <Upload className="w-4 h-4 mr-2" />
          Deploy All Approved
        </Button>
      </div>

      {/* Deployment Queue */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-700/50">
          <h3 className="font-semibold text-white">Deployment Queue</h3>
        </div>
        <div className="divide-y divide-slate-700/50">
          {deploymentQueue.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  item.status === "approved" ? "bg-green-500/20" :
                  item.status === "testing" ? "bg-blue-500/20" : "bg-yellow-500/20"
                }`}>
                  {item.status === "approved" ? <CheckCircle className="w-5 h-5 text-green-400" /> :
                   item.status === "testing" ? <Beaker className="w-5 h-5 text-blue-400" /> :
                   <Clock className="w-5 h-5 text-yellow-400" />}
                </div>
                <div>
                  <p className="font-medium text-white">{item.page}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs text-slate-400">{item.type}</Badge>
                    <span className="text-xs text-slate-500">{item.author} • {item.created}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getStatusStyle(item.status)}>{item.status}</Badge>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Eye className="w-4 h-4" />
                  </Button>
                  {item.status === "approved" && (
                    <Button size="sm" className="bg-green-500 hover:bg-green-600">
                      <Rocket className="w-4 h-4 mr-1" />
                      Deploy
                    </Button>
                  )}
                  {item.status === "pending" && (
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                      <Beaker className="w-4 h-4 mr-1" />
                      Test
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Version History */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            Version History
          </h3>
          <div className="space-y-3">
            {versionHistory.map((version, index) => (
              <motion.div
                key={version.version}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedVersion(version.version)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedVersion === version.version
                    ? "bg-cyan-500/20 border border-cyan-500/50"
                    : "bg-slate-800/50 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-cyan-400" />
                    <span className="font-medium text-white">{version.version}</span>
                  </div>
                  <Badge className={getStatusStyle(version.status)}>{version.status}</Badge>
                </div>
                <p className="text-sm text-slate-400">{version.page}</p>
                <p className="text-xs text-slate-500 mt-1">{version.deployedBy} • {version.deployedAt}</p>
                {version.status === "archived" && (
                  <Button size="sm" variant="ghost" className="mt-2 text-cyan-400 h-7 px-2">
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Rollback
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* A/B Tests */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Beaker className="w-4 h-4 text-cyan-400" />
            A/B Tests
          </h3>
          <div className="space-y-4">
            {abTests.map((test, index) => (
              <motion.div
                key={test.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-white">{test.name}</p>
                  <Badge className={getStatusStyle(test.status)}>{test.status}</Badge>
                </div>
                <div className="space-y-2">
                  {test.variants.map((variant, vIndex) => (
                    <div key={vIndex} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center font-bold ${
                        test.winner === String.fromCharCode(65 + vIndex)
                          ? "bg-green-500/20 text-green-400"
                          : "bg-slate-700 text-slate-400"
                      }`}>
                        {String.fromCharCode(65 + vIndex)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white truncate">{variant}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-slate-500">Traffic: {test.traffic[vIndex]}%</span>
                          <span className="text-xs text-cyan-400">Conv: {test.conversions[vIndex]}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDeployment;
