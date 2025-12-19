import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Lock, 
  MessageSquare,
  Video,
  AlertTriangle,
  Download,
  Eye,
  Clock,
  Shield,
  FileText
} from "lucide-react";

const EvidenceVault = () => {
  const evidenceItems = [
    { 
      id: "EV-001", 
      type: "chat",
      title: "Chat Transcript - Dispute DIS-001", 
      parties: "Mumbai Franchise & Support",
      timestamp: "Dec 18, 2024 14:32:15",
      size: "2.4 MB",
      status: "sealed",
      aiFlag: true
    },
    { 
      id: "EV-002", 
      type: "recording",
      title: "Screen Recording - Code Access", 
      parties: "Dev-Q4T Session",
      timestamp: "Dec 18, 2024 10:15:30",
      size: "156 MB",
      status: "sealed",
      aiFlag: true
    },
    { 
      id: "EV-003", 
      type: "document",
      title: "Contract Breach Evidence", 
      parties: "Enterprise Corp",
      timestamp: "Dec 15, 2024 09:45:00",
      size: "8.5 MB",
      status: "sealed",
      aiFlag: false
    },
    { 
      id: "EV-004", 
      type: "chat",
      title: "Support Chat - Refund Request", 
      parties: "TechStart Inc & Support",
      timestamp: "Dec 14, 2024 16:22:45",
      size: "1.2 MB",
      status: "sealed",
      aiFlag: false
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "chat": return <MessageSquare className="w-5 h-5 text-blue-400" />;
      case "recording": return <Video className="w-5 h-5 text-purple-400" />;
      case "document": return <FileText className="w-5 h-5 text-amber-400" />;
      default: return <Database className="w-5 h-5 text-stone-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Evidence-Chain Recorder</h2>
          <p className="text-stone-500">Immutable vault for legal proof and AI-flagged breach patterns</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
          <Lock className="w-3 h-3 mr-1" />
          Blockchain Sealed
        </Badge>
      </div>

      {/* Vault Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Evidence", value: "1,247", icon: Database, color: "text-amber-400" },
          { label: "Chat Transcripts", value: "856", icon: MessageSquare, color: "text-blue-400" },
          { label: "Screen Recordings", value: "234", icon: Video, color: "text-purple-400" },
          { label: "AI Flagged", value: "45", icon: AlertTriangle, color: "text-red-400" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-stone-900/80 border border-stone-800/50"
          >
            <div className="flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-stone-500">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Immutability Notice */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20"
      >
        <div className="flex items-center gap-4">
          <Shield className="w-6 h-6 text-emerald-400" />
          <div>
            <p className="text-emerald-300 font-medium">Immutable Evidence Chain</p>
            <p className="text-sm text-stone-400">All evidence is cryptographically sealed and cannot be modified or deleted. Each item has a unique hash for legal verification.</p>
          </div>
        </div>
      </motion.div>

      {/* Evidence Table */}
      <Card className="bg-stone-900/80 border-stone-800/50">
        <CardHeader className="border-b border-stone-800/50">
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-500" />
            Evidence Records
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-800/50">
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Evidence ID</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Type</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Title</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Parties</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Timestamp</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Status</th>
                <th className="text-right p-4 text-stone-500 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {evidenceItems.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-stone-800/30 hover:bg-stone-800/30"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-400 font-mono text-sm">{item.id}</span>
                      {item.aiFlag && (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/40 text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          AI Flag
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <span className="text-stone-300 capitalize">{item.type}</span>
                    </div>
                  </td>
                  <td className="p-4 text-white font-medium">{item.title}</td>
                  <td className="p-4 text-stone-400">{item.parties}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-stone-400 text-sm">
                      <Clock className="w-3 h-3" />
                      {item.timestamp}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
                      <Lock className="w-3 h-3 mr-1" />
                      {item.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" className="text-stone-400 hover:text-amber-400">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-stone-400 hover:text-amber-400">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvidenceVault;
