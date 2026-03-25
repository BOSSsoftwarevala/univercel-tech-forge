/**
 * Examination Module
 * Manage exams, marks, and results
 */
import { useState } from "react";
import { 
  ClipboardList, Plus, Calendar, FileText, Award, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const ExaminationModule = () => {
  const examTypes = [
    { name: "Unit Test 1", type: "unit_test", status: "completed", date: "2025-05-15", classes: "All" },
    { name: "Quarterly Exam", type: "quarterly", status: "scheduled", date: "2025-07-20", classes: "All" },
    { name: "Half Yearly", type: "half_yearly", status: "upcoming", date: "2025-10-01", classes: "All" },
    { name: "Annual Exam", type: "annual", status: "upcoming", date: "2026-02-15", classes: "All" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-amber-500" />
            Examination Center
          </h2>
          <p className="text-slate-400">Create exams, enter marks, and publish results</p>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => toast.info('Create exam')}>
          <Plus className="w-4 h-4 mr-2" /> Create Exam
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Scheduled Exams", value: "4", icon: Calendar, color: "bg-blue-500" },
          { label: "Completed", value: "1", icon: FileText, color: "bg-green-500" },
          { label: "Results Published", value: "1", icon: Award, color: "bg-purple-500" },
          { label: "Average Pass %", value: "87%", icon: BarChart3, color: "bg-amber-500" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Exam Schedule */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Examination Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {examTypes.map((exam, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    exam.status === 'completed' ? 'bg-green-500' : 
                    exam.status === 'scheduled' ? 'bg-blue-500' : 'bg-slate-600'
                  }`}>
                    <ClipboardList className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{exam.name}</p>
                    <p className="text-sm text-slate-400">Date: {exam.date} • Classes: {exam.classes}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={
                    exam.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    exam.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-slate-500/20 text-slate-400'
                  }>
                    {exam.status}
                  </Badge>
                  <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                    {exam.status === 'completed' ? 'View Results' : 'Manage'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
