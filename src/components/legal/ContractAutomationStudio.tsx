import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileSignature, 
  Sparkles, 
  Globe,
  Building2,
  Users,
  User,
  CheckCircle2,
  Clock,
  Lock,
  FileText,
  Wand2
} from "lucide-react";

const ContractAutomationStudio = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates = [
    { id: "franchise", name: "Franchise Agreement", icon: Building2, regions: ["Global"], clauses: 45, aiGenerated: true },
    { id: "reseller", name: "Reseller Contract", icon: Users, regions: ["Global"], clauses: 38, aiGenerated: true },
    { id: "client", name: "Client Agreement", icon: User, regions: ["India", "US", "EU"], clauses: 52, aiGenerated: true },
    { id: "nda", name: "Developer NDA", icon: Lock, regions: ["Global"], clauses: 28, aiGenerated: true },
    { id: "prime", name: "Prime User Terms", icon: FileText, regions: ["Global"], clauses: 34, aiGenerated: true },
  ];

  const recentContracts = [
    { id: "CON-001", name: "Franchise - Mumbai Metro", type: "franchise", status: "pending-signature", created: "2 hours ago" },
    { id: "CON-002", name: "Reseller - Delhi NCR", type: "reseller", status: "signed", created: "1 day ago" },
    { id: "CON-003", name: "Client - TechStart Inc", type: "client", status: "reviewing", created: "3 hours ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Contract Automation Studio</h2>
          <p className="text-stone-500">AI-written agreements with auto-updated clauses by country laws</p>
        </div>
        <Button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white">
          <Sparkles className="w-4 h-4 mr-2" />
          AI Generate Contract
        </Button>
      </div>

      {/* AI Suggestion Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-600/5 border border-purple-500/20"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-purple-300 font-medium">AI Clause Update Available</p>
            <p className="text-sm text-stone-400">New GDPR amendments detected. 5 templates need clause updates for EU compliance.</p>
          </div>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
            Review & Apply
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="bg-stone-800/50 border border-stone-700/50">
          <TabsTrigger value="templates" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300">
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="recent" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300">
            <Clock className="w-4 h-4 mr-2" />
            Recent Contracts
          </TabsTrigger>
          <TabsTrigger value="generator" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Generator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template, index) => {
              const Icon = template.icon;
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-stone-900/80 border-stone-800/50 hover:border-amber-600/30 transition-colors cursor-pointer group">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-amber-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-medium group-hover:text-amber-400 transition-colors">
                              {template.name}
                            </h3>
                            {template.aiGenerated && (
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40 text-xs">
                                <Sparkles className="w-3 h-3 mr-1" />
                                AI
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-stone-500 mt-1">{template.clauses} clauses</p>
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

                      <div className="mt-4 flex gap-2">
                        <Button size="sm" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
                          <FileSignature className="w-3 h-3 mr-1" />
                          Generate
                        </Button>
                        <Button size="sm" variant="outline" className="border-stone-700 text-stone-300 hover:bg-stone-800">
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <Card className="bg-stone-900/80 border-stone-800/50">
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-800/50">
                    <th className="text-left p-4 text-stone-500 font-medium text-sm">Contract</th>
                    <th className="text-left p-4 text-stone-500 font-medium text-sm">Type</th>
                    <th className="text-left p-4 text-stone-500 font-medium text-sm">Status</th>
                    <th className="text-left p-4 text-stone-500 font-medium text-sm">Created</th>
                    <th className="text-right p-4 text-stone-500 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentContracts.map((contract) => (
                    <tr key={contract.id} className="border-b border-stone-800/30 hover:bg-stone-800/30">
                      <td className="p-4">
                        <div>
                          <p className="text-white font-medium">{contract.name}</p>
                          <p className="text-xs text-stone-500">{contract.id}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className="bg-stone-800/50 text-stone-400 border-stone-700/50 capitalize">
                          {contract.type}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={
                          contract.status === "signed" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" :
                          contract.status === "pending-signature" ? "bg-amber-500/20 text-amber-400 border-amber-500/40" :
                          "bg-blue-500/20 text-blue-400 border-blue-500/40"
                        }>
                          {contract.status === "signed" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {contract.status === "pending-signature" && <Clock className="w-3 h-3 mr-1" />}
                          {contract.status.replace("-", " ")}
                        </Badge>
                      </td>
                      <td className="p-4 text-stone-400">{contract.created}</td>
                      <td className="p-4 text-right">
                        <Button size="sm" variant="ghost" className="text-stone-400 hover:text-amber-400">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generator" className="mt-6">
          <Card className="bg-stone-900/80 border-stone-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                AI Contract Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 text-center">
                <Wand2 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Describe Your Contract Requirements</h3>
                <p className="text-stone-400 text-sm mb-4">Our AI will generate a legally compliant contract with region-specific clauses</p>
                <textarea
                  placeholder="E.g., Generate a franchise agreement for a partner in Dubai with Arabic translation, including IP protection clauses and payment terms in AED..."
                  className="w-full h-32 p-4 rounded-lg bg-stone-800/50 border border-stone-700/50 text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-purple-500/50 resize-none"
                />
                <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Contract
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContractAutomationStudio;
