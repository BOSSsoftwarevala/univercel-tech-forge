import { useState } from "react";
import { Scale, FileText, Users, Calendar, Clock, Briefcase, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const cases = [
  { id: "CASE001", client: "ABC Corp", type: "Corporate", status: "Active", hearing: "15 Jan", priority: "High" },
  { id: "CASE002", client: "Rajesh Kumar", type: "Civil", status: "Active", hearing: "22 Jan", priority: "Medium" },
  { id: "CASE003", client: "XYZ Ltd", type: "IP Rights", status: "Pending", hearing: "28 Jan", priority: "High" },
  { id: "CASE004", client: "Sharma Family", type: "Property", status: "Closed", hearing: "-", priority: "Low" },
];

const tasks = [
  { task: "File response in ABC Corp matter", due: "Today", status: "urgent" },
  { task: "Prepare contract draft for new client", due: "Tomorrow", status: "pending" },
  { task: "Review evidence documents", due: "18 Jan", status: "pending" },
  { task: "Client meeting preparation", due: "20 Jan", status: "completed" },
];

export default function LegalDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-zinc-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-amber-400" />
            <span className="text-xl font-bold text-white">LegalPractice</span>
            <Badge variant="outline" className="ml-2 text-amber-400 border-amber-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-4 text-white/80">
            <span className="hover:text-amber-400 cursor-pointer">Dashboard</span>
            <span className="hover:text-amber-400 cursor-pointer">Cases</span>
            <span className="hover:text-amber-400 cursor-pointer">Clients</span>
            <span className="hover:text-amber-400 cursor-pointer">Billing</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Active Cases</p>
                  <p className="text-2xl font-bold text-white">24</p>
                </div>
                <Briefcase className="h-8 w-8 text-amber-400" />
              </div>
              <p className="text-amber-400 text-sm mt-2">3 high priority</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Hearings This Week</p>
                  <p className="text-2xl font-bold text-white">8</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-blue-400 text-sm mt-2">Next: Tomorrow</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Pending Tasks</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
                <FileText className="h-8 w-8 text-orange-400" />
              </div>
              <p className="text-orange-400 text-sm mt-2">2 due today</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Total Clients</p>
                  <p className="text-2xl font-bold text-white">156</p>
                </div>
                <Users className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">+5 this month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Recent Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cases.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-medium">{c.client}</p>
                        <Badge variant="outline" className="text-xs">{c.id}</Badge>
                      </div>
                      <p className="text-white/60 text-sm">{c.type} • Hearing: {c.hearing}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        c.priority === "High" ? "bg-red-600" :
                        c.priority === "Medium" ? "bg-yellow-600" : "bg-gray-600"
                      }>{c.priority}</Badge>
                      <Badge className={
                        c.status === "Active" ? "bg-green-600" :
                        c.status === "Pending" ? "bg-blue-600" : "bg-gray-600"
                      }>{c.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.map((task, i) => (
                  <div key={i} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-start gap-2">
                      {task.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                      ) : task.status === "urgent" ? (
                        <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-400 mt-0.5" />
                      )}
                      <div>
                        <p className={`text-sm ${task.status === "completed" ? "text-white/50 line-through" : "text-white"}`}>
                          {task.task}
                        </p>
                        <p className="text-white/50 text-xs">Due: {task.due}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-amber-600 hover:bg-amber-700">
                Add New Task
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-white/10 text-center text-white/60">
        <p>© 2025 Software Vala - The Name of Trust. All rights reserved.</p>
      </footer>
    </div>
  );
}
