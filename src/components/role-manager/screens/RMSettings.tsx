/**
 * ROLE MANAGER - SETTINGS SCREEN
 */

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  Type,
  GitBranch,
  Lock,
  Save,
} from "lucide-react";

interface RMSettingsProps {
  activeItem: string;
}

export const RMSettings = memo<RMSettingsProps>(({ activeItem }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Role Settings</h1>
          <p className="text-sm text-slate-400">
            {activeItem === 'default-settings' && 'Default role configuration'}
            {activeItem === 'naming-rules' && 'Role naming conventions'}
            {activeItem === 'approval-flow' && 'Approval workflow configuration'}
            {activeItem === 'lock-critical' && 'Lock critical roles'}
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Default Settings */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-400" />
              Default Role Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
              <div>
                <p className="text-white font-medium">Auto-assign default permissions</p>
                <p className="text-sm text-slate-400">New roles get read-only access by default</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
              <div>
                <p className="text-white font-medium">Require approval for new roles</p>
                <p className="text-sm text-slate-400">All new roles need admin approval</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
              <div>
                <p className="text-white font-medium">Enable role expiration</p>
                <p className="text-sm text-slate-400">Roles can have expiry dates</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
              <div>
                <p className="text-white font-medium">Audit logging</p>
                <p className="text-sm text-slate-400">Log all role changes</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Naming Rules */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Type className="w-5 h-5 text-green-400" />
              Role Naming Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Minimum Name Length</Label>
              <Input 
                type="number" 
                defaultValue="3"
                className="bg-slate-900/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Maximum Name Length</Label>
              <Input 
                type="number" 
                defaultValue="50"
                className="bg-slate-900/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Name Prefix (Optional)</Label>
              <Input 
                placeholder="e.g., ROLE_"
                className="bg-slate-900/50 border-slate-600 text-white"
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
              <div>
                <p className="text-white font-medium">Allow special characters</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Approval Flow */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-purple-400" />
              Approval Flow Config
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
              <div>
                <p className="text-white font-medium">Multi-level approval</p>
                <p className="text-sm text-slate-400">Require multiple approvers</p>
              </div>
              <Switch />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Approval Timeout (hours)</Label>
              <Input 
                type="number" 
                defaultValue="48"
                className="bg-slate-900/50 border-slate-600 text-white"
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
              <div>
                <p className="text-white font-medium">Auto-reject on timeout</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
              <div>
                <p className="text-white font-medium">Email notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Lock Critical Roles */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-400" />
              Lock Critical Roles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-red-500/20">
              <div>
                <p className="text-white font-medium">Boss / Owner</p>
                <p className="text-sm text-slate-400">Cannot be modified or deleted</p>
              </div>
              <Switch defaultChecked disabled />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-red-500/20">
              <div>
                <p className="text-white font-medium">Super Admin</p>
                <p className="text-sm text-slate-400">System critical role</p>
              </div>
              <Switch defaultChecked disabled />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
              <div>
                <p className="text-white font-medium">CEO</p>
                <p className="text-sm text-slate-400">Executive role protection</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
              <div>
                <p className="text-white font-medium">Finance Admin</p>
                <p className="text-sm text-slate-400">Financial access protection</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

RMSettings.displayName = 'RMSettings';
