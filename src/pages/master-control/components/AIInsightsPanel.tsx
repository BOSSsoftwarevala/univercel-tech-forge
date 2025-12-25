import { Brain, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const insights = [
  {
    id: 1,
    message: 'Africa growth below expected — 12% under Q4 target',
    severity: 'warning',
    context: 'Revenue performance analysis'
  },
  {
    id: 2,
    message: 'Approval backlog increasing in Asia — 23 pending requests',
    severity: 'attention',
    context: 'Workflow bottleneck detected'
  },
  {
    id: 3,
    message: 'Security anomaly detected in Europe — unusual login pattern',
    severity: 'critical',
    context: 'Security monitoring alert'
  },
  {
    id: 4,
    message: 'North America Super Admin idle for 4+ hours',
    severity: 'info',
    context: 'Activity monitoring'
  }
];

const AIInsightsPanel = () => {
  const handleViewContext = (insight: typeof insights[0]) => {
    toast.info(`Viewing context: ${insight.context}`, {
      description: insight.message,
      duration: 4000
    });
  };

  const handleAcknowledge = (insightId: number) => {
    toast.success('Insight acknowledged', {
      description: 'This recommendation has been marked as reviewed.',
      duration: 3000
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#12121a]">
      {/* Header */}
      <div className="p-4 border-b border-gray-800/50 bg-[#1a1a2e]">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-white">AI Strategic Insights</h3>
        </div>
        <p className="text-xs text-gray-500 mt-1">Read-only recommendations</p>
      </div>

      {/* Insights List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {insights.map((insight) => (
            <div 
              key={insight.id}
              className="p-3 bg-[#1a1a2e] border border-gray-800/50 rounded-lg"
            >
              <p className="text-sm text-gray-300 leading-relaxed">
                {insight.message}
              </p>
              <p className="text-xs text-gray-500 mt-2">{insight.context}</p>
              
              <div className="flex gap-2 mt-3">
                <Button 
                  size="sm"
                  onClick={() => handleViewContext(insight)}
                  className="text-xs h-7 bg-cyan-600 text-white hover:bg-cyan-700 border-0"
                >
                  <ChevronRight className="w-3 h-3 mr-1" />
                  View Context
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAcknowledge(insight.id)}
                  className="text-xs h-7 border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Acknowledged
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800/50 bg-[#1a1a2e]">
        <p className="text-xs text-gray-500 text-center">
          AI never executes actions — guidance only
        </p>
      </div>
    </div>
  );
};

export default AIInsightsPanel;
