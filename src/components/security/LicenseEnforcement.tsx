/**
 * License Enforcement Component
 * ==============================
 * Displays license information and enforces legal compliance.
 * 
 * © 2024 Software Vala. All Rights Reserved.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, AlertTriangle, CheckCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface LicenseInfo {
  type: string;
  holder: string;
  validUntil: string;
  restrictions: string[];
  permissions: string[];
}

const LICENSE_INFO: LicenseInfo = {
  type: "Proprietary Commercial License",
  holder: "Software Vala Pvt. Ltd.",
  validUntil: "Perpetual",
  restrictions: [
    "No redistribution without written consent",
    "No reverse engineering or decompilation",
    "No removal of copyright notices",
    "No use of source code in competing products",
    "No sharing of access credentials",
    "No unauthorized copying or screenshots",
  ],
  permissions: [
    "Use within licensed organization only",
    "Create derivative works for internal use",
    "Access demo modules as per subscription",
    "Request technical support via official channels",
  ],
};

const LicenseEnforcement = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Software License</h2>
          <p className="text-muted-foreground">Legal terms and usage restrictions</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
          <CheckCircle className="w-3 h-3 mr-1" />
          Valid License
        </Badge>
      </div>

      {/* License Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {LICENSE_INFO.type}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* License Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <p className="text-muted-foreground text-sm">License Holder</p>
                <p className="text-foreground font-medium mt-1">{LICENSE_INFO.holder}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <p className="text-muted-foreground text-sm">Valid Until</p>
                <p className="text-foreground font-medium mt-1">{LICENSE_INFO.validUntil}</p>
              </div>
            </div>

            {/* Restrictions */}
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h4 className="text-destructive font-semibold">Restrictions</h4>
              </div>
              <ul className="space-y-2">
                {LICENSE_INFO.restrictions.map((restriction, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground text-sm">
                    <Lock className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    {restriction}
                  </li>
                ))}
              </ul>
            </div>

            {/* Permissions */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h4 className="text-emerald-400 font-semibold">Permitted Uses</h4>
              </div>
              <ul className="space-y-2">
                {LICENSE_INFO.permissions.map((permission, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    {permission}
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Notice */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border text-center">
              <p className="text-xs text-muted-foreground">
                © 2024 Software Vala Pvt. Ltd. All rights reserved. This software is protected by
                copyright law and international treaties. Unauthorized reproduction or distribution
                may result in severe civil and criminal penalties.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LicenseEnforcement;
