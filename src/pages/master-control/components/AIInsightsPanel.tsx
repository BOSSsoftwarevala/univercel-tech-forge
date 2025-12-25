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
    <div className="h-full flex flex-col bg-stone-50">
      {/* Header */}
      <div className="p-4 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-stone-600" />
          <h3 className="font-semibold text-stone-800">AI Strategic Insights</h3>
        </div>
        <p className="text-xs text-stone-500 mt-1">Read-only recommendations</p>
      </div>

      {/* Insights List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {insights.map((insight) => (
            <div 
              key={insight.id}
              className="p-3 bg-white border border-stone-200 rounded shadow-sm"
            >
              <p className="text-sm text-stone-700 leading-relaxed">
                {insight.message}
              </p>
              <p className="text-xs text-stone-500 mt-2">{insight.context}</p>
              
              <div className="flex gap-2 mt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs h-7 border-stone-300 bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <ChevronRight className="w-3 h-3 mr-1" />
                  View Context
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs h-7 border-stone-300 text-stone-600 hover:bg-stone-100"
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
      <div className="p-4 border-t border-stone-200 bg-white">
        <p className="text-xs text-stone-500 text-center">
          AI never executes actions — guidance only
        </p>
      </div>
    </div>
  );
};

export default AIInsightsPanel;
