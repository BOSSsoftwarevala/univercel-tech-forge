import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sparkles, Settings2, Zap } from 'lucide-react';
import PMBuilderTopBar from './PMBuilderTopBar';
import PMBuilderCreateTab from './PMBuilderCreateTab';
import PMBuilderConfigureTab from './PMBuilderConfigureTab';
import PMBuilderPreview from './PMBuilderPreview';
import PMBuilderPipeline from './PMBuilderPipeline';
import { toast } from 'sonner';

export type PipelineStepStatus = 'idle' | 'running' | 'done' | 'error';

export interface PipelineStep {
  id: number;
  label: string;
  status: PipelineStepStatus;
}

const INITIAL_PIPELINE: PipelineStep[] = [
  { id: 1, label: 'Prompt Understanding', status: 'idle' },
  { id: 2, label: 'Requirement Analysis', status: 'idle' },
  { id: 3, label: 'Feature Mapping', status: 'idle' },
  { id: 4, label: 'Screen Generation', status: 'idle' },
  { id: 5, label: 'API Planning', status: 'idle' },
  { id: 6, label: 'Database Schema', status: 'idle' },
  { id: 7, label: 'Flow Generation', status: 'idle' },
  { id: 8, label: 'Build System', status: 'idle' },
];

const PMBuilderLayout = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [productData, setProductData] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pipeline, setPipeline] = useState<PipelineStep[]>(INITIAL_PIPELINE);

  const handleProductUpdate = (data: any) => {
    setProductData(data);
  };

  const handleConfigChange = (newConfig: any) => {
    setConfig(newConfig);
  };

  const handlePipelineStep = useCallback((step: number, status: 'running' | 'done' | 'error') => {
    setPipeline(prev => prev.map(s => {
      if (s.id === step) return { ...s, status };
      return s;
    }));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    toast.success('Draft saved successfully');
  };

  const handlePublish = () => {
    toast.success('Product published to marketplace');
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <PMBuilderTopBar
        productName={config?.name || productData?.projectName || ''}
        onSave={handleSave}
        onPublish={handlePublish}
        isSaving={isSaving}
      />

      {/* Main Split: Left Chat | Center Preview | Right Pipeline */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Create / Configure */}
        <div className="w-[440px] border-r border-border/50 flex flex-col bg-background">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <div className="px-4 pt-3 pb-0">
              <TabsList className="w-full h-9 bg-muted/40">
                <TabsTrigger value="create" className="flex-1 text-xs gap-1.5 data-[state=active]:bg-background">
                  <Sparkles className="w-3.5 h-3.5" />
                  Create
                </TabsTrigger>
                <TabsTrigger value="configure" className="flex-1 text-xs gap-1.5 data-[state=active]:bg-background">
                  <Settings2 className="w-3.5 h-3.5" />
                  Configure
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="create" className="flex-1 m-0 overflow-hidden">
              <PMBuilderCreateTab onProductUpdate={handleProductUpdate} onPipelineStep={handlePipelineStep} />
            </TabsContent>

            <TabsContent value="configure" className="flex-1 m-0 overflow-hidden">
              <PMBuilderConfigureTab productData={productData} onConfigChange={handleConfigChange} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Center Panel - Preview */}
        <div className="flex-1 overflow-hidden">
          <PMBuilderPreview productData={productData} config={config} />
        </div>

        {/* Right Panel - AI Pipeline */}
        <PMBuilderPipeline steps={pipeline} />
      </div>
    </div>
  );
};

export default PMBuilderLayout;
