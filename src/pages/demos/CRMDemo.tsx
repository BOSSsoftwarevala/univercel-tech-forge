import { useState } from "react";
import { Users, TrendingUp, Phone, Mail, Calendar, Target, BarChart3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const leads = [
  { id: 1, name: "Tech Solutions Ltd", contact: "Rajesh Kumar", value: "₹5L", stage: "Negotiation", probability: 80 },
  { id: 2, name: "Global Traders", contact: "Priya Sharma", value: "₹3.2L", stage: "Proposal", probability: 60 },
  { id: 3, name: "Metro Industries", contact: "Amit Patel", value: "₹8L", stage: "Discovery", probability: 30 },
  { id: 4, name: "Star Enterprises", contact: "Neha Gupta", value: "₹2.5L", stage: "Closed Won", probability: 100 },
];

const activities = [
  { type: "call", title: "Follow-up call with Tech Solutions", time: "10:00 AM", status: "scheduled" },
  { type: "email", title: "Send proposal to Global Traders", time: "11:30 AM", status: "pending" },
  { type: "meeting", title: "Demo presentation", time: "02:00 PM", status: "scheduled" },
  { type: "call", title: "Contract discussion", time: "04:00 PM", status: "completed" },
];

export default function CRMDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white">SalesPro CRM</span>
            <Badge variant="outline" className="ml-2 text-blue-400 border-blue-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-4 text-white/80">
            <span className="hover:text-blue-400 cursor-pointer">Dashboard</span>
            <span className="hover:text-blue-400 cursor-pointer">Leads</span>
            <span className="hover:text-blue-400 cursor-pointer">Deals</span>
            <span className="hover:text-blue-400 cursor-pointer">Reports</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Total Leads</p>
                  <p className="text-2xl font-bold text-white">248</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">+18 this week</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Pipeline Value</p>
                  <p className="text-2xl font-bold text-white">₹1.2Cr</p>
                </div>
                <Target className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="text-emerald-400 text-sm mt-2">32 active deals</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Won This Month</p>
                  <p className="text-2xl font-bold text-white">₹45L</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">12 deals closed</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Conversion Rate</p>
                  <p className="text-2xl font-bold text-white">24%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-violet-400" />
              </div>
              <p className="text-violet-400 text-sm mt-2">+3% vs last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Active Deals</CardTitle>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-1" /> Add Lead
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads.map(lead => (
                  <div key={lead.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-medium">{lead.name}</p>
                        <p className="text-white/60 text-sm">Contact: {lead.contact}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-400 font-bold">{lead.value}</p>
                        <Badge className={
                          lead.stage === "Closed Won" ? "bg-green-600" :
                          lead.stage === "Negotiation" ? "bg-blue-600" :
                          lead.stage === "Proposal" ? "bg-yellow-600" : "bg-gray-600"
                        }>{lead.stage}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/50 text-sm">Probability:</span>
                      <Progress value={lead.probability} className="flex-1" />
                      <span className="text-white/60 text-sm w-10">{lead.probability}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Today's Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.map((activity, i) => (
                  <div key={i} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-start gap-3">
                      {activity.type === "call" ? <Phone className="h-5 w-5 text-green-400 mt-0.5" /> :
                       activity.type === "email" ? <Mail className="h-5 w-5 text-blue-400 mt-0.5" /> :
                       <Calendar className="h-5 w-5 text-purple-400 mt-0.5" />}
                      <div className="flex-1">
                        <p className={`text-sm ${activity.status === "completed" ? "text-white/50 line-through" : "text-white"}`}>
                          {activity.title}
                        </p>
                        <p className="text-white/40 text-xs">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                View All Activities
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
