import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Smartphone, 
  Globe, 
  FileArchive, 
  FileText,
  Lock,
  CheckCircle2,
  Clock,
  ExternalLink
} from "lucide-react";

const DownloadArea = () => {
  const downloads = [
    {
      id: 1,
      name: "Enterprise CRM - Production Build",
      type: "apk",
      version: "v2.4.1",
      size: "45 MB",
      date: "Dec 18, 2024",
      status: "ready",
      licensed: true
    },
    {
      id: 2,
      name: "Web Application Package",
      type: "web",
      version: "v2.4.1",
      size: "128 MB",
      date: "Dec 18, 2024",
      status: "ready",
      licensed: true
    },
    {
      id: 3,
      name: "Documentation & User Guide",
      type: "docs",
      version: "Latest",
      size: "12 MB",
      date: "Dec 17, 2024",
      status: "ready",
      licensed: true
    },
    {
      id: 4,
      name: "Source Code Archive",
      type: "archive",
      version: "v2.4.1",
      size: "85 MB",
      date: "Dec 18, 2024",
      status: "pending",
      licensed: false
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "apk":
        return <Smartphone className="w-6 h-6 text-emerald-400" />;
      case "web":
        return <Globe className="w-6 h-6 text-blue-400" />;
      case "docs":
        return <FileText className="w-6 h-6 text-amber-400" />;
      case "archive":
        return <FileArchive className="w-6 h-6 text-purple-400" />;
      default:
        return <Download className="w-6 h-6 text-stone-400" />;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-stone-900/90 to-stone-950/90 border-amber-500/20 backdrop-blur-xl">
      <CardHeader className="border-b border-amber-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <Download className="w-5 h-5 text-amber-400" />
            Download Area
          </CardTitle>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
            <Lock className="w-3 h-3 mr-1" />
            License Protected
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Files", value: "12", icon: FileArchive },
            { label: "Ready", value: "10", icon: CheckCircle2 },
            { label: "Pending", value: "2", icon: Clock },
            { label: "Licensed", value: "8", icon: Lock },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-lg bg-stone-800/50 border border-stone-700/50 text-center"
            >
              <stat.icon className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-stone-200">{stat.value}</p>
              <p className="text-xs text-stone-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Download Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {downloads.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-5 rounded-xl border transition-all ${
                file.status === "ready" 
                  ? "bg-stone-800/50 border-stone-700/50 hover:border-amber-500/30" 
                  : "bg-stone-800/30 border-stone-700/30 opacity-70"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  file.type === "apk" ? "bg-emerald-500/20" :
                  file.type === "web" ? "bg-blue-500/20" :
                  file.type === "docs" ? "bg-amber-500/20" :
                  "bg-purple-500/20"
                }`}>
                  {getTypeIcon(file.type)}
                </div>
                
                <div className="flex-1">
                  <h4 className="text-stone-200 font-medium">{file.name}</h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-stone-500">
                    <span>{file.version}</span>
                    <span>•</span>
                    <span>{file.size}</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">{file.date}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  {file.licensed ? (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
                      <Lock className="w-3 h-3 mr-1" />
                      Licensed
                    </Badge>
                  ) : (
                    <Badge className="bg-stone-700/50 text-stone-400 border-stone-600/40">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending License
                    </Badge>
                  )}
                </div>
                
                {file.status === "ready" ? (
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-stone-900">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" disabled className="border-stone-600 text-stone-500">
                    <Clock className="w-4 h-4 mr-1" />
                    Pending
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Beta Access Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-5 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-600/5 border border-purple-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40">Beta Access</Badge>
              </div>
              <h4 className="text-purple-200 font-medium">AI Feature Pack - Early Access</h4>
              <p className="text-sm text-stone-500 mt-1">Get exclusive early access to our upcoming AI features</p>
            </div>
            <Button variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
              <ExternalLink className="w-4 h-4 mr-2" />
              Request Access
            </Button>
          </div>
        </motion.div>

        {/* Training Videos */}
        <div className="mt-6 p-4 rounded-xl bg-stone-800/30 border border-stone-700/30">
          <h4 className="text-sm font-medium text-amber-300 mb-3">Training Videos Available</h4>
          <div className="grid grid-cols-3 gap-3">
            {["Getting Started", "Advanced Features", "API Integration"].map((video, i) => (
              <motion.button
                key={video}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 rounded-lg bg-stone-800/50 border border-stone-700/50 text-left hover:border-amber-500/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mb-2">
                  <ExternalLink className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-sm text-stone-300">{video}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadArea;
