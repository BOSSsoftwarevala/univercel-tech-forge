import { motion } from "framer-motion";
import { AlertOctagon, Phone, Shield, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EmergencyChannel = () => {
  const emergencyHistory = [
    { id: "EMG-001", issue: "Production Server Down", status: "resolved", time: "2 hours", date: "Dec 15, 2024", misuse: false },
    { id: "EMG-002", issue: "Data Sync Failure", status: "resolved", time: "45 min", date: "Dec 10, 2024", misuse: false },
    { id: "EMG-003", issue: "Critical Security Alert", status: "resolved", time: "1 hour", date: "Dec 5, 2024", misuse: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-amber-100">Emergency Red-Line Channel</h2>
          <p className="text-stone-400">Bypass queue for critical system issues</p>
        </div>
        <Badge className="bg-red-500/20 text-red-300 border border-red-500/30 px-4 py-2">
          <Shield className="w-4 h-4 mr-2" />
          Priority Override Active
        </Badge>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="bg-gradient-to-r from-red-900/30 to-amber-900/30 border-red-500/30">
          <CardContent className="p-8">
            <div className="text-center">
              <motion.div
                animate={{ 
                  boxShadow: ["0 0 0 0 rgba(239, 68, 68, 0)", "0 0 0 20px rgba(239, 68, 68, 0)"],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto mb-4"
              >
                <AlertOctagon className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-red-100 mb-2">Critical Issue?</h3>
              <p className="text-stone-300 mb-6 max-w-md mx-auto">
                Use this channel only for production-breaking issues. Misuse may result in privilege restrictions.
              </p>
              <div className="flex justify-center gap-4">
                <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg">
                  <AlertOctagon className="w-5 h-5 mr-2" />
                  Trigger Emergency Alert
                </Button>
                <Button variant="outline" className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10 px-8 py-6 text-lg">
                  <Phone className="w-5 h-5 mr-2" />
                  Direct Line
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">&lt;15 min</div>
            <div className="text-xs text-stone-400">Avg. Response Time</div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">100%</div>
            <div className="text-xs text-stone-400">Resolution Rate</div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-red-500/20">
          <CardContent className="p-4 text-center">
            <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-100">0</div>
            <div className="text-xs text-stone-400">Misuse Penalties</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-stone-900/50 border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-amber-100">Emergency History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emergencyHistory.map((emergency, index) => (
              <motion.div
                key={emergency.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-stone-800/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-amber-400 text-sm">{emergency.id}</span>
                      <h4 className="font-medium text-amber-100">{emergency.issue}</h4>
                    </div>
                    <p className="text-xs text-stone-400">{emergency.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-emerald-500/20 text-emerald-300 mb-1">
                    {emergency.status}
                  </Badge>
                  <p className="text-xs text-stone-400">Resolved in {emergency.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-stone-900/50 border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Usage Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <h4 className="font-medium text-emerald-300 mb-2">✓ Appropriate Use</h4>
              <ul className="space-y-1 text-sm text-stone-300">
                <li>• Production system outages</li>
                <li>• Critical security breaches</li>
                <li>• Data loss scenarios</li>
                <li>• Service-wide failures</li>
              </ul>
            </div>
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <h4 className="font-medium text-red-300 mb-2">✗ Inappropriate Use</h4>
              <ul className="space-y-1 text-sm text-stone-300">
                <li>• Feature requests</li>
                <li>• Non-critical bugs</li>
                <li>• General inquiries</li>
                <li>• Billing questions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyChannel;
