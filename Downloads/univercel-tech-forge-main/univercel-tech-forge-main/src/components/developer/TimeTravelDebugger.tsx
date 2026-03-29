import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Rewind,
  FastForward,
  Bug,
  GitBranch,
  Code,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Zap,
  Terminal,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DebugEvent {
  id: string;
  timestamp: string;
  type: 'state' | 'action' | 'error' | 'network' | 'render';
  label: string;
  details: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  snapshotId: string;
}

const mockEvents: DebugEvent[] = [
  { id: '1', timestamp: '14:23:45.123', type: 'action', label: 'USER_LOGIN', details: 'User authenticated successfully', severity: 'success', snapshotId: 'snap_001' },
  { id: '2', timestamp: '14:23:45.456', type: 'state', label: 'State Update', details: 'user.isAuthenticated = true', severity: 'info', snapshotId: 'snap_002' },
  { id: '3', timestamp: '14:23:46.789', type: 'network', label: 'API Call', details: 'GET /api/dashboard - 200 OK (45ms)', severity: 'info', snapshotId: 'snap_003' },
  { id: '4', timestamp: '14:23:47.012', type: 'render', label: 'Component Render', details: 'Dashboard component mounted', severity: 'info', snapshotId: 'snap_004' },
  { id: '5', timestamp: '14:23:48.345', type: 'error', label: 'Runtime Error', details: 'TypeError: Cannot read property of undefined', severity: 'error', snapshotId: 'snap_005' },
  { id: '6', timestamp: '14:23:49.678', type: 'action', label: 'ERROR_BOUNDARY', details: 'Error caught and handled', severity: 'warning', snapshotId: 'snap_006' },
  { id: '7', timestamp: '14:23:50.901', type: 'state', label: 'State Recovery', details: 'Fallback state restored', severity: 'success', snapshotId: 'snap_007' },
  { id: '8', timestamp: '14:23:52.234', type: 'network', label: 'WebSocket', details: 'Real-time connection established', severity: 'success', snapshotId: 'snap_008' }
];

const TimeTravelDebugger = () => {
  const [events] = useState<DebugEvent[]>(mockEvents);
  const [currentIndex, setCurrentIndex] = useState(events.length - 1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const getEventIcon = (type: DebugEvent['type']) => {
    switch (type) {
      case 'state': return <Code className="h-4 w-4" />;
      case 'action': return <Zap className="h-4 w-4" />;
      case 'error': return <Bug className="h-4 w-4" />;
      case 'network': return <GitBranch className="h-4 w-4" />;
      case 'render': return <Eye className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: DebugEvent['severity']) => {
    switch (severity) {
      case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'success': return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getSeverityIcon = (severity: DebugEvent['severity']) => {
    switch (severity) {
      case 'info': return <Clock className="h-3 w-3" />;
      case 'warning': return <AlertTriangle className="h-3 w-3" />;
      case 'error': return <XCircle className="h-3 w-3" />;
      case 'success': return <CheckCircle className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Time-Travel Debugger
          </h1>
          <p className="text-muted-foreground mt-1">
            Developer Deep Tech - Navigate through application state history (Features 461-480)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Terminal className="h-4 w-4 mr-2" />
            Console
          </Button>
          <Button variant="destructive">
            <Bug className="h-4 w-4 mr-2" />
            Report Bug
          </Button>
        </div>
      </div>

      {/* Timeline Controls */}
      <Card className="backdrop-blur-xl bg-card/50 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="icon" onClick={() => setCurrentIndex(0)}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}>
              <Rewind className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              className="h-12 w-12"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentIndex(Math.min(events.length - 1, currentIndex + 1))}>
              <FastForward className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentIndex(events.length - 1)}>
              <SkipForward className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 mx-4">
              <Slider
                value={[currentIndex]}
                max={events.length - 1}
                step={1}
                onValueChange={([value]) => setCurrentIndex(value)}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{events[0]?.timestamp}</span>
                <span>Event {currentIndex + 1} of {events.length}</span>
                <span>{events[events.length - 1]?.timestamp}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Speed:</span>
              <select 
                className="bg-muted rounded px-2 py-1 text-sm"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={4}>4x</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Event Timeline */}
        <Card className="backdrop-blur-xl bg-card/50 border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Event Timeline
            </CardTitle>
            <CardDescription>
              Click on any event to travel to that state
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      index === currentIndex 
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/30' 
                        : getSeverityColor(event.severity) + ' hover:bg-muted/50'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getSeverityColor(event.severity)}`}>
                          {getEventIcon(event.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-muted-foreground">
                              {event.timestamp}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {event.type}
                            </Badge>
                            <Badge className={getSeverityColor(event.severity)}>
                              {getSeverityIcon(event.severity)}
                              <span className="ml-1">{event.severity}</span>
                            </Badge>
                          </div>
                          <h4 className="font-semibold">{event.label}</h4>
                          <p className="text-sm text-muted-foreground">{event.details}</p>
                        </div>
                      </div>
                      {index === currentIndex && (
                        <div className="text-primary animate-pulse">
                          <RefreshCw className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Current State Inspector */}
        <Card className="backdrop-blur-xl bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              State Inspector
            </CardTitle>
            <CardDescription>
              Snapshot: {events[currentIndex]?.snapshotId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/30">
                <h4 className="text-sm font-semibold mb-2">Current Event</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-mono">{events[currentIndex]?.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Label</span>
                    <span className="font-mono">{events[currentIndex]?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Severity</span>
                    <Badge className={getSeverityColor(events[currentIndex]?.severity)}>
                      {events[currentIndex]?.severity}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/30">
                <h4 className="text-sm font-semibold mb-2">State Diff</h4>
                <pre className="text-xs font-mono text-green-400 overflow-auto">
{`+ user.isAuthenticated: true
+ dashboard.loaded: true
- errors.count: 1
+ recovery.active: true`}
                </pre>
              </div>

              <div className="p-3 rounded-lg bg-muted/30">
                <h4 className="text-sm font-semibold mb-2">Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Code className="h-4 w-4 mr-2" />
                    View Full State
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <GitBranch className="h-4 w-4 mr-2" />
                    Create Branch Here
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restore This State
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Developer Tools */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: <Bug className="h-5 w-5" />, label: 'Auto Bug Patching', value: '12 fixed', color: 'text-green-400' },
          { icon: <Code className="h-5 w-5" />, label: 'Code Toxicity Score', value: '8.2/10', color: 'text-yellow-400' },
          { icon: <GitBranch className="h-5 w-5" />, label: 'Merge Conflicts', value: '0 pending', color: 'text-blue-400' },
          { icon: <Zap className="h-5 w-5" />, label: 'AI Code Suggestions', value: '24 available', color: 'text-purple-400' }
        ].map((tool, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="backdrop-blur-xl bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{tool.label}</p>
                    <p className={`text-xl font-bold ${tool.color}`}>{tool.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-muted/30 ${tool.color}`}>
                    {tool.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TimeTravelDebugger;
