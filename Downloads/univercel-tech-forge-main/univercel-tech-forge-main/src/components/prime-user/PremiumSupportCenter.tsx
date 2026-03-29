import { motion } from "framer-motion";
import { Headphones, Phone, Calendar, AlertOctagon, Star, Clock, CheckCircle, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PremiumSupportCenter = () => {
  const supportExperts = [
    { name: "Expert #A1", specialty: "Technical Issues", status: "available", rating: 4.9, resolved: 234 },
    { name: "Expert #B2", specialty: "Billing & Accounts", status: "busy", rating: 4.8, resolved: 189 },
    { name: "Expert #C3", specialty: "Integration Support", status: "available", rating: 4.95, resolved: 312 },
  ];

  const recentTickets = [
    { id: "SUP-001", issue: "API Rate Limiting Issue", status: "resolved", time: "2 hours ago", expert: "Expert #A1" },
    { id: "SUP-002", issue: "Payment Gateway Error", status: "in-progress", time: "1 hour ago", expert: "Expert #B2" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-amber-100">Premium Support Center</h2>
          <p className="text-stone-400">24/7 dedicated VIP support channel</p>
        </div>
        <Button className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500">
          <AlertOctagon className="w-4 h-4 mr-2" />
          Emergency Flag
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-stone-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-2">
              <Headphones className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-emerald-100">24/7</div>
            <div className="text-xs text-stone-400">Always Available</div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-2">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-amber-100">&lt;5 min</div>
            <div className="text-xs text-stone-400">Avg. Response</div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-blue-500/20">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
              <Star className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-lg font-bold text-blue-100">4.9/5</div>
            <div className="text-xs text-stone-400">Satisfaction</div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-lg font-bold text-purple-100">98%</div>
            <div className="text-xs text-stone-400">Resolution Rate</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-amber-100 flex items-center gap-2">
              <Phone className="w-5 h-5 text-amber-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-stone-800 border border-amber-500/30 hover:bg-stone-700 text-amber-100">
              <Phone className="w-4 h-4 mr-3 text-amber-400" />
              Request Immediate Callback
            </Button>
            <Button className="w-full justify-start bg-stone-800 border border-amber-500/30 hover:bg-stone-700 text-amber-100">
              <Calendar className="w-4 h-4 mr-3 text-amber-400" />
              Schedule Expert Session
            </Button>
            <Button className="w-full justify-start bg-stone-800 border border-amber-500/30 hover:bg-stone-700 text-amber-100">
              <MessageSquare className="w-4 h-4 mr-3 text-amber-400" />
              Start Live Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-amber-100">Available Experts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {supportExperts.map((expert, index) => (
              <motion.div
                key={expert.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-stone-800/50 rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-amber-100">{expert.name}</span>
                    <Badge className={expert.status === "available" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}>
                      {expert.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-stone-400">{expert.specialty}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-sm">{expert.rating}</span>
                  </div>
                  <p className="text-xs text-stone-500">{expert.resolved} resolved</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-stone-900/50 border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-amber-100">Recent Support History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-3 bg-stone-800/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-amber-400 text-sm">{ticket.id}</span>
                  <div>
                    <p className="text-amber-100">{ticket.issue}</p>
                    <p className="text-xs text-stone-400">Handled by {ticket.expert}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={ticket.status === "resolved" ? "bg-emerald-500/20 text-emerald-300" : "bg-blue-500/20 text-blue-300"}>
                    {ticket.status}
                  </Badge>
                  <p className="text-xs text-stone-500 mt-1">{ticket.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumSupportCenter;
