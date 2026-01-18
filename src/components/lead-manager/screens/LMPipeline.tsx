import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target, Phone, TrendingUp, Calendar, MessageSquare, UserCheck, XCircle,
  Eye, Edit, MoreHorizontal, GripVertical
} from 'lucide-react';

const pipelineStages = [
  { id: 'new', label: 'New', icon: Target, count: 156, color: 'bg-blue-500' },
  { id: 'contacted', label: 'Contacted', icon: Phone, count: 89, color: 'bg-purple-500' },
  { id: 'interested', label: 'Interested', icon: TrendingUp, count: 67, color: 'bg-cyan-500' },
  { id: 'followup', label: 'Follow-Up', icon: Calendar, count: 45, color: 'bg-yellow-500' },
  { id: 'negotiation', label: 'Negotiation', icon: MessageSquare, count: 34, color: 'bg-orange-500' },
  { id: 'won', label: 'Won', icon: UserCheck, count: 28, color: 'bg-green-500' },
  { id: 'lost', label: 'Lost', icon: XCircle, count: 12, color: 'bg-red-500' },
];

const pipelineLeads = {
  new: [
    { id: 1, name: 'Rahul Sharma', value: '₹2.5L', time: '2 mins ago' },
    { id: 2, name: 'Priya Patel', value: '₹1.8L', time: '15 mins ago' },
    { id: 3, name: 'Amit Kumar', value: '₹3.2L', time: '32 mins ago' },
  ],
  contacted: [
    { id: 4, name: 'Sneha Gupta', value: '₹4.1L', time: '1 hour ago' },
    { id: 5, name: 'Vikram Singh', value: '₹2.9L', time: '2 hours ago' },
  ],
  interested: [
    { id: 6, name: 'Neha Verma', value: '₹5.5L', time: '3 hours ago' },
    { id: 7, name: 'Raj Malhotra', value: '₹1.2L', time: '4 hours ago' },
  ],
  followup: [
    { id: 8, name: 'Anita Desai', value: '₹3.8L', time: '5 hours ago' },
  ],
  negotiation: [
    { id: 9, name: 'Suresh Reddy', value: '₹7.2L', time: '1 day ago' },
    { id: 10, name: 'Kavita Nair', value: '₹4.5L', time: '1 day ago' },
  ],
  won: [
    { id: 11, name: 'Manish Joshi', value: '₹8.9L', time: '2 days ago' },
  ],
  lost: [
    { id: 12, name: 'Ravi Menon', value: '₹2.1L', time: '3 days ago' },
  ],
};

const LMPipeline = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Pipeline</h1>
          <p className="text-muted-foreground">Drag & Drop stages (locked style)</p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          7 Stages Active
        </Badge>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-7 gap-2">
        {pipelineStages.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-card border-border text-center">
                <CardContent className="p-3">
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 ${stage.color} bg-opacity-20 flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${stage.color.replace('bg-', 'text-')}`} />
                  </div>
                  <p className="text-lg font-bold text-foreground">{stage.count}</p>
                  <p className="text-xs text-muted-foreground">{stage.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-7 gap-3 overflow-x-auto">
        {pipelineStages.map((stage) => (
          <div key={stage.id} className="min-w-[180px]">
            <div className={`p-2 rounded-t-lg ${stage.color} bg-opacity-20 border-b-2 ${stage.color.replace('bg-', 'border-')}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{stage.label}</span>
                <Badge variant="secondary" className="text-xs">{stage.count}</Badge>
              </div>
            </div>
            <div className="bg-accent/30 rounded-b-lg p-2 space-y-2 min-h-[300px]">
              {pipelineLeads[stage.id as keyof typeof pipelineLeads]?.map((lead) => (
                <motion.div
                  key={lead.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-card border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing"
                >
                  <div className="flex items-center justify-between mb-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <Button size="icon" variant="ghost" className="h-6 w-6">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="font-medium text-sm text-foreground">{lead.name}</p>
                  <p className="text-xs text-primary font-semibold">{lead.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{lead.time}</p>
                  <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border">
                    <Button size="icon" variant="ghost" className="h-6 w-6">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6">
                      <Phone className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LMPipeline;
