import { motion } from 'framer-motion';
import { Monitor, Smartphone, Tablet, RefreshCw, ExternalLink, Code, Eye, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

interface PMBuilderPreviewProps {
  productData: any;
  config: any;
}

const PMBuilderPreview = ({ productData, config }: PMBuilderPreviewProps) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'preview' | 'spec' | 'architecture'>('preview');

  const name = config?.name || productData?.projectName || 'Your Product';
  const description = config?.description || productData?.summary || '';
  const features = config?.features || productData?.features || [];
  const techStack = config?.techStack || [
    ...(productData?.techStack?.frontend || []),
    ...(productData?.techStack?.backend || []),
  ];
  const category = config?.category || productData?.category || '';
  const timeline = productData?.timeline;
  const cost = productData?.estimatedCost;
  const risks = productData?.risks || [];

  const isEmpty = !name || name === 'Your Product';

  return (
    <div className="h-full flex flex-col bg-muted/10">
      {/* Preview Top Bar */}
      <div className="h-11 border-b border-border/40 flex items-center justify-between px-4 bg-background/80">
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
            <TabsList className="h-7 bg-muted/50">
              <TabsTrigger value="preview" className="text-[11px] h-6 px-2.5 gap-1">
                <Eye className="w-3 h-3" /> Preview
              </TabsTrigger>
              <TabsTrigger value="spec" className="text-[11px] h-6 px-2.5 gap-1">
                <Code className="w-3 h-3" /> Spec
              </TabsTrigger>
              <TabsTrigger value="architecture" className="text-[11px] h-6 px-2.5 gap-1">
                <Layers className="w-3 h-3" /> Architecture
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-1">
          <Button 
            variant={device === 'desktop' ? 'secondary' : 'ghost'} 
            size="icon" className="h-7 w-7"
            onClick={() => setDevice('desktop')}
          >
            <Monitor className="w-3.5 h-3.5" />
          </Button>
          <Button 
            variant={device === 'tablet' ? 'secondary' : 'ghost'} 
            size="icon" className="h-7 w-7"
            onClick={() => setDevice('tablet')}
          >
            <Tablet className="w-3.5 h-3.5" />
          </Button>
          <Button 
            variant={device === 'mobile' ? 'secondary' : 'ghost'} 
            size="icon" className="h-7 w-7"
            onClick={() => setDevice('mobile')}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
        <motion.div 
          className={`bg-background border border-border/50 rounded-xl shadow-lg overflow-auto transition-all duration-300 ${
            device === 'desktop' ? 'w-full h-full' : 
            device === 'tablet' ? 'w-[768px] max-w-full h-full' : 
            'w-[375px] max-w-full h-full'
          }`}
          layout
        >
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <Monitor className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Product Preview</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Start a conversation in the <strong>Create</strong> tab or configure manually in <strong>Configure</strong> to see your product preview here.
              </p>
            </div>
          ) : viewMode === 'preview' ? (
            <div className="p-6 space-y-6">
              {/* Product Header */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-400 text-xl font-bold">{name.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{name}</h2>
                    {category && <Badge variant="outline" className="text-[10px] mt-0.5">{category}</Badge>}
                  </div>
                </div>
                {description && <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>}
              </div>

              {/* Features */}
              {features.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Features</h3>
                  <div className="grid gap-2">
                    {features.map((f: any, i: number) => (
                      <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/30">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">{f.name}</p>
                          <Badge variant={f.priority === 'core' ? 'default' : 'secondary'} className="text-[10px]">
                            {f.priority || f.complexity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{f.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack */}
              {techStack.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Tech Stack</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {techStack.map((tech: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">{tech}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline & Cost */}
              {(timeline || cost) && (
                <div className="grid grid-cols-2 gap-3">
                  {timeline && (
                    <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                      <p className="text-[10px] text-emerald-400 uppercase font-medium">Timeline</p>
                      <p className="text-lg font-bold text-foreground">{timeline.totalDays} days</p>
                    </div>
                  )}
                  {cost && (
                    <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                      <p className="text-[10px] text-amber-400 uppercase font-medium">Est. Cost</p>
                      <p className="text-lg font-bold text-foreground">₹{cost.total?.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Risks */}
              {risks.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Risks</h3>
                  {risks.map((r: any, i: number) => (
                    <div key={i} className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/20">
                      <p className="text-xs font-medium text-foreground">{r.risk}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Mitigation: {r.mitigation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : viewMode === 'spec' ? (
            <div className="p-6">
              <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap bg-muted/20 p-4 rounded-lg border border-border/30">
                {JSON.stringify({ name, description, category, features, techStack, timeline, cost }, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              <h3 className="text-sm font-semibold">Architecture View</h3>
              {timeline?.phases?.map((phase: any, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-muted/20 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{phase.name}</p>
                    <Badge variant="outline" className="text-[10px]">{phase.duration}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {phase.tasks?.map((task: string, j: number) => (
                      <Badge key={j} variant="secondary" className="text-[10px]">{task}</Badge>
                    ))}
                  </div>
                </div>
              )) || <p className="text-sm text-muted-foreground">Architecture will appear after AI analysis.</p>}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PMBuilderPreview;
