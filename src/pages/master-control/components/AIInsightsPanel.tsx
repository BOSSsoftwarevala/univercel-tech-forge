import { Brain, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  return (
    <div className="h-full flex flex-col bg-neutral-50">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 bg-white">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-neutral-600" />
          <h3 className="font-semibold text-neutral-800">AI Strategic Insights</h3>
        </div>
        <p className="text-xs text-neutral-500 mt-1">Read-only recommendations</p>
      </div>

      {/* Insights List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {insights.map((insight) => (
            <div 
              key={insight.id}
              className="p-3 bg-white border border-neutral-200 rounded-lg shadow-sm"
            >
              <p className="text-sm text-neutral-700 leading-relaxed">
                {insight.message}
              </p>
              <p className="text-xs text-neutral-500 mt-2">{insight.context}</p>
              
              <div className="flex gap-2 mt-3">
                <Button 
                  size="sm"
                  className="text-xs h-7 bg-teal-600 text-white hover:bg-teal-700 border-0"
                >
                  <ChevronRight className="w-3 h-3 mr-1" />
                  View Context
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs h-7 border-neutral-300 text-neutral-600 hover:bg-neutral-100 bg-white"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Acknowledge
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-200 bg-white">
        <p className="text-xs text-neutral-500 text-center">
          AI never executes actions — guidance only
        </p>
      </div>
    </div>
  );
};

export default AIInsightsPanel;
