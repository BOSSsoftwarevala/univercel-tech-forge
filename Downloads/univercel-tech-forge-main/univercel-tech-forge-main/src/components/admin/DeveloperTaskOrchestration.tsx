import { useState } from "react";
import { motion } from "framer-motion";
import {
  Code,
  Timer,
  Users,
  Brain,
  Pause,
  Play,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  BarChart3,
  MessageSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DeveloperTaskOrchestration = () => {
  const [activeTab, setActiveTab] = useState("queue");

  const taskQueue = [
    { 
      id: "TSK001", 
      title: "E-commerce Module Setup", 
      client: "ABC Corp", 
      developer: "Rahul S.",
      skills: ["PHP", "MySQL"],
      priority: "high",
      sla: "4h remaining",
      status: "in_progress",
      timer: "02:34:12"
    },
    { 
      id: "TSK002", 
      title: "CRM Integration", 
      client: "XYZ Ltd", 
      developer: "Priya M.",
      skills: ["Node.js", "API"],
      priority: "medium",
      sla: "8h remaining",
      status: "in_progress",
      timer: "01:45:33"
    },
    { 
      id: "TSK003", 
      title: "Payment Gateway Fix", 
      client: "PQR Industries", 
      developer: "Amit K.",
      skills: ["Java", "Payment"],
      priority: "critical",
      sla: "2h remaining",
      status: "paused",
      timer: "00:23:45",
      pauseReason: "Waiting for client credentials"
    },
    { 
      id: "TSK004", 
      title: "Mobile API Development", 
      client: "LMN Services", 
      developer: null,
      skills: ["React Native", "API"],
      priority: "low",
      sla: "24h remaining",
      status: "unassigned",
      timer: null
    },
  ];

  const developers = [
    { 
      name: "Rahul S.", 
      skills: ["PHP", "MySQL", "Laravel"],
      currentTasks: 3,
      maxTasks: 5,
      avgCompletionTime: "3.2h",
      rating: 4.8,
      status: "active",
      todayHours: "6h 45m"
    },
    { 
      name: "Priya M.", 
      skills: ["Node.js", "React", "MongoDB"],
      currentTasks: 4,
      maxTasks: 5,
      avgCompletionTime: "2.8h",
      rating: 4.9,
      status: "active",
      todayHours: "7h 12m"
    },
    { 
      name: "Amit K.", 
      skills: ["Java", "Spring", "Payment"],
      currentTasks: 2,
      maxTasks: 5,
      avgCompletionTime: "4.1h",
      rating: 4.7,
      status: "paused",
      todayHours: "5h 30m"
    },
    { 
      name: "Sneha R.", 
      skills: ["React", "TypeScript", "UI/UX"],
      currentTasks: 5,
      maxTasks: 5,
      avgCompletionTime: "2.5h",
      rating: 4.6,
      status: "full",
      todayHours: "8h 00m"
    },
  ];

  const slaBreaches = [
    { task: "Payment Gateway Fix", dev: "Amit K.", breachTime: "30 min ago", severity: "critical" },
    { task: "Inventory Module", dev: "Rahul S.", breachTime: "1h ago", severity: "warning" },
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Medium</Badge>;
      case "low":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return <Badge className="bg-green-500/20 text-green-400"><Play className="w-3 h-3 mr-1" />Active</Badge>;
      case "paused":
        return <Badge className="bg-yellow-500/20 text-yellow-400"><Pause className="w-3 h-3 mr-1" />Paused</Badge>;
      case "unassigned":
        return <Badge className="bg-gray-500/20 text-gray-400">Unassigned</Badge>;
      case "active":
        return <Badge className="bg-green-500/20 text-green-400">Online</Badge>;
      case "full":
        return <Badge className="bg-red-500/20 text-red-400">At Capacity</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-teal to-primary bg-clip-text text-transparent">
            Developer & Task Orchestration
          </h1>
          <p className="text-muted-foreground mt-1">AI-powered task assignment & timer enforcement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Brain className="w-4 h-4 mr-2" />
            AI Auto-Match
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Active Tasks", value: "47", icon: Code, color: "text-primary" },
          { label: "Developers Online", value: "12", icon: Users, color: "text-green-400" },
          { label: "Avg Completion", value: "3.2h", icon: Timer, color: "text-neon-teal" },
          { label: "SLA Breaches", value: "2", icon: AlertTriangle, color: "text-red-400" },
          { label: "Today's Deliveries", value: "18", icon: CheckCircle, color: "text-green-400" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-white/10">
              <CardContent className="p-4 flex items-center gap-3">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                <div>
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* SLA Breach Alert */}
      {slaBreaches.length > 0 && (
        <Card className="glass-card border-red-500/30 bg-red-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
              <span className="font-semibold text-red-400">SLA Breach Alerts</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {slaBreaches.map((breach, index) => (
                <div key={index} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{breach.task}</div>
                      <div className="text-sm text-muted-foreground">{breach.dev} • {breach.breachTime}</div>
                    </div>
                    <Button size="sm" className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
                      Escalate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-background/50 border border-white/10">
          <TabsTrigger value="queue">Task Queue</TabsTrigger>
          <TabsTrigger value="developers">Developers</TabsTrigger>
          <TabsTrigger value="timers">Timer Enforcement</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="mt-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Task Assignment Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead>Task</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Developer</TableHead>
                    <TableHead>Skills Required</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>SLA</TableHead>
                    <TableHead>Timer</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taskQueue.map((task) => (
                    <TableRow key={task.id} className="border-white/5">
                      <TableCell>
                        <div className="font-medium">{task.title}</div>
                        <div className="text-xs text-muted-foreground">{task.id}</div>
                      </TableCell>
                      <TableCell>{task.client}</TableCell>
                      <TableCell>
                        {task.developer || (
                          <Button size="sm" variant="outline" className="border-primary/30 text-primary">
                            <Brain className="w-3 h-3 mr-1" />
                            Auto-Match
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {task.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                      <TableCell className="text-sm">{task.sla}</TableCell>
                      <TableCell>
                        {task.timer ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-primary">{task.timer}</span>
                            {getStatusBadge(task.status)}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {task.status === "in_progress" && (
                            <Button size="sm" variant="outline" className="border-yellow-500/30 text-yellow-400">
                              <Pause className="w-3 h-3" />
                            </Button>
                          )}
                          {task.status === "paused" && (
                            <Button size="sm" variant="outline" className="border-green-500/30 text-green-400">
                              <Play className="w-3 h-3" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="border-white/10">
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="developers" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {developers.map((dev, index) => (
              <motion.div
                key={dev.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-neon-teal/20 flex items-center justify-center">
                          <span className="font-bold text-primary">{dev.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-semibold">{dev.name}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-400 text-sm">★ {dev.rating}</span>
                            {getStatusBadge(dev.status)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Today</div>
                        <div className="font-mono text-primary">{dev.todayHours}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {dev.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Task Load</span>
                        <span>{dev.currentTasks}/{dev.maxTasks}</span>
                      </div>
                      <Progress value={(dev.currentTasks / dev.maxTasks) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Avg completion: {dev.avgCompletionTime}</span>
                        <Button size="sm" variant="outline" className="border-white/10 h-6 text-xs">
                          Assign Task
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timers" className="mt-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-neon-teal" />
                Timer Enforcement Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { rule: "Max Pause Duration", value: "30 minutes", status: "active" },
                  { rule: "Pause Justification Required", value: "After 15 min", status: "active" },
                  { rule: "Auto-Escalation on SLA Breach", value: "Immediate", status: "active" },
                  { rule: "Daily Max Working Hours", value: "10 hours", status: "active" },
                  { rule: "Break Reminder", value: "Every 2 hours", status: "active" },
                  { rule: "Idle Detection", value: "After 5 min", status: "active" },
                ].map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-background/50 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{item.rule}</div>
                        <div className="text-sm text-primary">{item.value}</div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">{item.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeveloperTaskOrchestration;
