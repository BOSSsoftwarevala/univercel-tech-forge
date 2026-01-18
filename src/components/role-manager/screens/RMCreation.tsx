/**
 * ROLE MANAGER - ROLE CREATION SCREEN
 */

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Copy,
  Brain,
  FileText,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const TEMPLATES = [
  { id: 1, name: 'Sales Manager', permissions: 45, category: 'Sales' },
  { id: 2, name: 'Support Agent', permissions: 28, category: 'Support' },
  { id: 3, name: 'Finance Analyst', permissions: 32, category: 'Finance' },
  { id: 4, name: 'Content Editor', permissions: 18, category: 'Marketing' },
  { id: 5, name: 'Warehouse Manager', permissions: 38, category: 'Operations' },
];

const AI_SUGGESTIONS = [
  { id: 1, name: 'Regional Coordinator', reason: 'Based on current team structure', confidence: 92 },
  { id: 2, name: 'Quality Auditor', reason: 'Compliance requirements detected', confidence: 87 },
  { id: 3, name: 'Partner Liaison', reason: 'New partner integrations pending', confidence: 78 },
];

interface RMCreationProps {
  activeItem: string;
}

export const RMCreation = memo<RMCreationProps>(({ activeItem }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Role Creation</h1>
        <p className="text-sm text-slate-400">
          {activeItem === 'create-role' && 'Create a new role from scratch'}
          {activeItem === 'clone-role' && 'Clone an existing role with modifications'}
          {activeItem === 'ai-suggested' && 'AI-powered role suggestions (Read-Only)'}
          {activeItem === 'role-templates' && 'Pre-built role templates'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Create New Role */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-400" />
              Create New Role
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Role Name</Label>
              <Input 
                placeholder="Enter role name..." 
                className="bg-slate-900/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Description</Label>
              <Input 
                placeholder="Role description..." 
                className="bg-slate-900/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Category</Label>
              <Input 
                placeholder="e.g., Sales, Support, Admin..." 
                className="bg-slate-900/50 border-slate-600 text-white"
              />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </CardContent>
        </Card>

        {/* Clone Existing Role */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Copy className="w-5 h-5 text-green-400" />
              Clone Existing Role
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Select Role to Clone</Label>
              <Input 
                placeholder="Search roles..." 
                className="bg-slate-900/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">New Role Name</Label>
              <Input 
                placeholder="New role name..." 
                className="bg-slate-900/50 border-slate-600 text-white"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <input type="checkbox" className="rounded" />
              <span>Include all permissions</span>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Copy className="w-4 h-4 mr-2" />
              Clone Role
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Suggestions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            AI Suggested Roles
            <Badge variant="outline" className="text-purple-400 border-purple-500/30 ml-2">
              Read-Only
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {AI_SUGGESTIONS.map((suggestion) => (
              <div
                key={suggestion.id}
                className="p-4 rounded-lg bg-slate-900/50 border border-purple-500/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{suggestion.name}</span>
                  <Badge variant="outline" className="text-purple-400 border-purple-500/30">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {suggestion.confidence}%
                  </Badge>
                </div>
                <p className="text-sm text-slate-400 mb-3">{suggestion.reason}</p>
                <Button size="sm" variant="outline" className="w-full border-purple-500/30 text-purple-400">
                  Review Suggestion
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Templates */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Role Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="p-4 rounded-lg bg-slate-900/50 border border-slate-600 hover:border-cyan-500/50 transition-colors cursor-pointer"
              >
                <Badge variant="outline" className="text-cyan-400 border-cyan-500/30 mb-2">
                  {template.category}
                </Badge>
                <h4 className="text-white font-medium">{template.name}</h4>
                <p className="text-sm text-slate-400">{template.permissions} permissions</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

RMCreation.displayName = 'RMCreation';
