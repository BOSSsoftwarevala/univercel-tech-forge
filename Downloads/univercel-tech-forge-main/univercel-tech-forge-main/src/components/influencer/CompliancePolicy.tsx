import { motion } from "framer-motion";
import { FileText, AlertTriangle, CheckCircle, Shield, Eye, Ban, Info, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const CompliancePolicy = () => {
  const complianceStatus = {
    overall: "compliant",
    contentRules: true,
    disclosures: true,
    practices: true,
    violations: 0,
  };

  const rules = [
    { 
      title: "Content Guidelines", 
      status: "compliant",
      items: [
        "All promotional content must be honest and accurate",
        "No misleading claims about product capabilities",
        "Respect intellectual property rights",
        "No adult, violent, or discriminatory content"
      ]
    },
    { 
      title: "Disclosure Requirements", 
      status: "compliant",
      items: [
        "Must use #Ad or #Sponsored for paid promotions",
        "Affiliate links must be clearly disclosed",
        "Partnership relationships must be transparent",
        "Financial relationships must be declared"
      ]
    },
    { 
      title: "Banned Practices", 
      status: "compliant",
      items: [
        "Click manipulation or bot usage",
        "Fake testimonials or reviews",
        "Spam posting or excessive tagging",
        "Impersonating official accounts"
      ]
    },
  ];

  const violations = [
    { id: 1, type: "warning", description: "Missing disclosure tag on post #1245", date: "Dec 10, 2024", resolved: true },
    { id: 2, type: "notice", description: "Content review pending for video upload", date: "Dec 15, 2024", resolved: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-violet-100">Compliance & Policy</h2>
          <p className="text-slate-400">Content rules, disclosure requirements, and banned practices</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-2">
          <CheckCircle className="w-4 h-4 mr-2" />
          Fully Compliant
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-emerald-100">Compliant</div>
            <div className="text-xs text-slate-400">Overall Status</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-violet-500/20">
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 text-violet-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-violet-100">100%</div>
            <div className="text-xs text-slate-400">Content Rules</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <Eye className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-cyan-100">100%</div>
            <div className="text-xs text-slate-400">Disclosures</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-amber-100">0</div>
            <div className="text-xs text-slate-400">Active Violations</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-violet-500/20">
          <CardHeader>
            <CardTitle className="text-violet-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-violet-400" />
              Policy Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              {rules.map((rule, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-slate-700/50 rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-violet-100">{rule.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 pl-7">
                      {rule.items.map((item, i) => (
                        <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                          <span className="text-violet-400 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-violet-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-violet-400" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {violations.map((violation, index) => (
                <motion.div
                  key={violation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg ${
                    violation.resolved 
                      ? "bg-emerald-500/10 border border-emerald-500/20" 
                      : "bg-amber-500/10 border border-amber-500/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Badge className={
                      violation.type === "warning" 
                        ? "bg-amber-500/20 text-amber-300" 
                        : "bg-blue-500/20 text-blue-300"
                    }>
                      {violation.type}
                    </Badge>
                    <Badge className={violation.resolved ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}>
                      {violation.resolved ? "Resolved" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-slate-300 text-sm">{violation.description}</p>
                  <p className="text-xs text-slate-500 mt-1">{violation.date}</p>
                </motion.div>
              ))}
              {violations.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-emerald-400" />
                  <p>No violations or warnings</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-violet-900/30 to-cyan-900/30 border-violet-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Info className="w-6 h-6 text-violet-400" />
                <div>
                  <h3 className="font-medium text-violet-100">Stay Compliant</h3>
                  <p className="text-sm text-slate-400">Always use proper disclosure tags and follow content guidelines to maintain your good standing.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompliancePolicy;
