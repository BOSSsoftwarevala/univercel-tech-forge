import React from 'react';
import { Brain, Play, Pause, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AIModels: React.FC = () => {
  const models = [
    { name: 'GPT-4', purpose: 'General AI Tasks', version: '4.0-turbo', status: 'active', cost: '$0.03/1K tokens' },
    { name: 'GPT-3.5', purpose: 'Fast Responses', version: '3.5-turbo', status: 'active', cost: '$0.002/1K tokens' },
    { name: 'Claude 3', purpose: 'Analysis & Research', version: 'Opus', status: 'active', cost: '$0.015/1K tokens' },
    { name: 'Gemini Pro', purpose: 'Multimodal Tasks', version: '1.5', status: 'inactive', cost: '$0.01/1K tokens' },
    { name: 'Whisper', purpose: 'Speech Recognition', version: 'v3', status: 'active', cost: '$0.006/min' },
    { name: 'DALL-E 3', purpose: 'Image Generation', version: '3.0', status: 'active', cost: '$0.04/image' },
  ];

  const usageStats = [
    { model: 'GPT-4', requests: '12,450', cost: '$156.00', trend: '+15%' },
    { model: 'GPT-3.5', requests: '89,230', cost: '$89.00', trend: '+8%' },
    { model: 'Claude 3', requests: '5,680', cost: '$85.00', trend: '+22%' },
    { model: 'Whisper', requests: '2,340', cost: '$42.00', trend: '-5%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">AI Models</h2>
        <p className="text-muted-foreground">Manage AI model configurations and usage</p>
      </div>

      {/* Usage Summary */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-400" />
            Today's Usage Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {usageStats.map((stat, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <p className="font-medium text-foreground">{stat.model}</p>
                <p className="text-sm text-muted-foreground">{stat.requests} requests</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-mono text-green-400">{stat.cost}</span>
                  <span className={`text-xs ${
                    stat.trend.startsWith('+') ? 'text-blue-400' : 'text-red-400'
                  }`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Models Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            Available Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-3 text-muted-foreground font-medium">Model Name</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Purpose</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Version</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Cost</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model, index) => (
                  <tr key={index} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="p-3 font-medium text-foreground">{model.name}</td>
                    <td className="p-3 text-muted-foreground">{model.purpose}</td>
                    <td className="p-3">
                      <Badge variant="outline">{model.version}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                        {model.status}
                      </Badge>
                    </td>
                    <td className="p-3 font-mono text-green-400">{model.cost}</td>
                    <td className="p-3">
                      {model.status === 'active' ? (
                        <Button size="sm" variant="outline" className="text-yellow-400 border-yellow-400/50">
                          <Pause className="h-3 w-3 mr-1" />
                          Deactivate
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="text-green-400 border-green-400/50">
                          <Play className="h-3 w-3 mr-1" />
                          Activate
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Approval Notice */}
      <Card className="bg-yellow-500/10 border-yellow-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Brain className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="font-medium text-yellow-400">Approval Required</p>
              <p className="text-sm text-muted-foreground">
                Activating or deactivating AI models requires Super Admin approval due to cost implications.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIModels;
