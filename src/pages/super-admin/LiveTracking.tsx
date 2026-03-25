import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Users, Globe, Clock } from 'lucide-react';

const activeUsers = [
  { id: 1, name: 'Ra***sh K', role: 'franchise', location: 'Mumbai', action: 'Viewing leads', time: 'Now' },
  { id: 2, name: 'Pr***ya S', role: 'developer', location: 'Bangalore', action: 'Task in progress', time: '2s ago' },
  { id: 3, name: 'Am***t P', role: 'reseller', location: 'Delhi', action: 'Demo request', time: '15s ago' },
  { id: 4, name: 'Vi***sh M', role: 'influencer', location: 'Chennai', action: 'Link generation', time: '30s ago' },
  { id: 5, name: 'Ne***a R', role: 'prime', location: 'Hyderabad', action: 'Support ticket', time: '1m ago' },
];

const LiveTracking = () => {
  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="w-8 h-8 text-green-500" />
            Live Tracking
          </h1>
          <p className="text-muted-foreground">Real-time user activity monitoring</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-500">247</div>
              <div className="text-sm text-muted-foreground">Online Now</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-500">42</div>
              <div className="text-sm text-muted-foreground">Active Tasks</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-500">18</div>
              <div className="text-sm text-muted-foreground">Demo Sessions</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-orange-500">5</div>
              <div className="text-sm text-muted-foreground">Support Chats</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Active Users
            </CardTitle>
            <CardDescription>Users currently active on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Globe className="w-3 h-3" /> {user.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="capitalize">{user.role}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{user.action}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" /> {user.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
};

export default LiveTracking;
