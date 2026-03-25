import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus, 
  Download, 
  Edit, 
  Copy,
  Building2,
  Users,
  Shield,
  UserCheck,
  Globe,
  Sparkles
} from "lucide-react";

const ContractTemplates = () => {
  const templates = [
    { id: 1, name: "Franchise Agreement", type: "franchise", version: "v3.2", lastUpdated: "Dec 15, 2024", uses: 47, regions: ["India", "ME", "Africa"] },
    { id: 2, name: "Reseller Contract", type: "reseller", version: "v2.8", lastUpdated: "Dec 10, 2024", uses: 89, regions: ["Global"] },
    { id: 3, name: "Developer NDA", type: "nda", version: "v4.1", lastUpdated: "Dec 18, 2024", uses: 156, regions: ["Global"] },
    { id: 4, name: "Client Service Agreement", type: "client", version: "v2.5", lastUpdated: "Dec 12, 2024", uses: 234, regions: ["India", "US", "EU"] },
    { id: 5, name: "Prime User Terms", type: "prime", version: "v1.9", lastUpdated: "Dec 8, 2024", uses: 67, regions: ["Global"] },
    { id: 6, name: "IP Transfer Agreement", type: "ip", version: "v2.0", lastUpdated: "Dec 5, 2024", uses: 23, regions: ["Global"] },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "franchise": return <Building2 className="w-6 h-6 text-purple-400" />;
      case "reseller": return <Users className="w-6 h-6 text-blue-400" />;
      case "nda": return <Shield className="w-6 h-6 text-red-400" />;
      case "client": return <UserCheck className="w-6 h-6 text-emerald-400" />;
      case "prime": return <Sparkles className="w-6 h-6 text-amber-400" />;
      case "ip": return <Shield className="w-6 h-6 text-cyan-400" />;
      default: return <FileText className="w-6 h-6 text-stone-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Contract & Agreement Templates</h2>
          <p className="text-stone-500">Manage and customize legal document templates</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* AI Suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-gradient-to-r from-amber-600/10 to-amber-700/5 border border-amber-600/20"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <div>
            <p className="text-amber-300 font-medium">AI Policy Update Suggestion</p>
            <p className="text-sm text-stone-400">New GDPR amendments detected. 3 templates need clause updates.</p>
          </div>
          <Button size="sm" variant="outline" className="ml-auto border-amber-600/30 text-amber-400 hover:bg-amber-600/10">
            Review Changes
          </Button>
        </div>
      </motion.div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-stone-900/80 border-stone-800/50 hover:border-amber-600/30 transition-all group">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-stone-800/50 flex items-center justify-center">
                    {getTypeIcon(template.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium group-hover:text-amber-400 transition-colors">
                      {template.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-stone-700/50 text-stone-300 border-stone-600/40 text-xs">
                        {template.version}
                      </Badge>
                      <span className="text-xs text-stone-500">{template.uses} uses</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-stone-500" />
                  <div className="flex flex-wrap gap-1">
                    {template.regions.map((region) => (
                      <Badge key={region} className="bg-stone-800/50 text-stone-400 border-stone-700/50 text-xs">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-stone-500 mt-3">Updated: {template.lastUpdated}</p>

                <div className="mt-4 flex items-center gap-2">
                  <Button size="sm" variant="outline" className="flex-1 border-stone-700 text-stone-300 hover:bg-stone-800">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="border-stone-700 text-stone-300 hover:bg-stone-800">
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-stone-700 text-stone-300 hover:bg-stone-800">
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ContractTemplates;
