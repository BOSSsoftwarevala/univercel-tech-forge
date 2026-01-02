import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Calendar,
  DollarSign,
  ArrowRight,
  MoreVertical,
  Building,
  User,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const stages = [
  { id: "discovery", label: "Discovery", color: "bg-blue-500" },
  { id: "proposal", label: "Proposal", color: "bg-purple-500" },
  { id: "negotiation", label: "Negotiation", color: "bg-orange-500" },
  { id: "closed", label: "Closed Won", color: "bg-green-500" },
];

const deals = [
  {
    id: 1,
    name: "Enterprise Software License",
    company: "Tech Solutions Pvt Ltd",
    contact: "Rajesh Mehta",
    value: "₹5,00,000",
    stage: "negotiation",
    probability: 80,
    closeDate: "Jan 25, 2024",
    daysLeft: 10
  },
  {
    id: 2,
    name: "Annual Maintenance Contract",
    company: "Digital Dreams Agency",
    contact: "Anita Sharma",
    value: "₹2,50,000",
    stage: "proposal",
    probability: 60,
    closeDate: "Feb 5, 2024",
    daysLeft: 21
  },
  {
    id: 3,
    name: "Cloud Migration Project",
    company: "StartUp Hub India",
    contact: "Karan Patel",
    value: "₹8,00,000",
    stage: "discovery",
    probability: 40,
    closeDate: "Feb 15, 2024",
    daysLeft: 31
  },
  {
    id: 4,
    name: "Security Audit Package",
    company: "Green Energy Corp",
    contact: "Meera Reddy",
    value: "₹1,20,000",
    stage: "closed",
    probability: 100,
    closeDate: "Jan 10, 2024",
    daysLeft: 0
  },
  {
    id: 5,
    name: "ERP Implementation",
    company: "Metro Industries",
    contact: "Suresh Kumar",
    value: "₹12,00,000",
    stage: "proposal",
    probability: 50,
    closeDate: "Mar 1, 2024",
    daysLeft: 45
  },
];

const DealTracking = () => {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  const getStageDeals = (stageId: string) => deals.filter(d => d.stage === stageId);
  const getStageTotal = (stageId: string) => {
    return getStageDeals(stageId).reduce((sum, d) => sum + parseInt(d.value.replace(/[₹,]/g, '')), 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Deal Tracking</h1>
          <p className="text-slate-500 mt-1">Track and manage your sales deals</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-white shadow-sm' : ''}
            >
              List
            </Button>
            <Button 
              variant={viewMode === 'kanban' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
              className={viewMode === 'kanban' ? 'bg-white shadow-sm' : ''}
            >
              Kanban
            </Button>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-500 hover:bg-blue-600" size="lg">
                <Plus className="w-5 h-5" />
                New Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Deal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Deal Name</Label>
                  <Input placeholder="Enter deal name" className="mt-1" />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input placeholder="Company name" className="mt-1" />
                </div>
                <div>
                  <Label>Deal Value</Label>
                  <Input placeholder="₹ 0" className="mt-1" />
                </div>
                <div>
                  <Label>Expected Close Date</Label>
                  <Input type="date" className="mt-1" />
                </div>
                <div>
                  <Label>Stage</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full bg-blue-500 hover:bg-blue-600" size="lg">
                  Create Deal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <span className="text-sm font-medium text-slate-600">{stage.label}</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{getStageDeals(stage.id).length}</p>
                <p className="text-sm text-slate-500">₹{(getStageTotal(stage.id) / 100000).toFixed(1)}L</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {viewMode === 'list' ? (
        /* List View */
        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-800">All Deals</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Search deals..." className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deals.map((deal, index) => {
                const stageInfo = stages.find(s => s.id === deal.stage);
                return (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <div className={`w-1 h-16 rounded-full ${stageInfo?.color}`} />
                    
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{deal.name}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {deal.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {deal.contact}
                        </span>
                      </div>
                    </div>

                    <div className="w-32">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-500">Probability</span>
                        <span className="font-medium text-slate-700">{deal.probability}%</span>
                      </div>
                      <Progress value={deal.probability} className="h-2" />
                    </div>

                    <Badge className={`${stageInfo?.color} text-white`}>
                      {stageInfo?.label}
                    </Badge>

                    <div className="text-right">
                      <p className="font-bold text-slate-800">{deal.value}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {deal.daysLeft > 0 ? `${deal.daysLeft} days left` : 'Closed'}
                      </p>
                    </div>

                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stages.map((stage) => (
            <Card key={stage.id} className="border-slate-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <span className="font-medium text-slate-700">{stage.label}</span>
                  </div>
                  <Badge variant="outline">{getStageDeals(stage.id).length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {getStageDeals(stage.id).map((deal) => (
                  <motion.div
                    key={deal.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <p className="font-medium text-slate-800 text-sm">{deal.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{deal.company}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-blue-600">{deal.value}</span>
                      <span className="text-xs text-slate-500">{deal.probability}%</span>
                    </div>
                    <Progress value={deal.probability} className="h-1.5 mt-2" />
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DealTracking;
