import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, Brain, Zap, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RequirementInput } from '@/components/auto-dev/RequirementInput';
import { AnalysisResult } from '@/components/auto-dev/AnalysisResult';
import { useAutoDevEngine } from '@/hooks/useAutoDevEngine';
import { toast } from 'sonner';

export default function AutoDevEngine() {
  const navigate = useNavigate();
  const { isLoading, analysis, parseRequirement, reset } = useAutoDevEngine();
  const [showInput, setShowInput] = useState(true);

  const handleSubmit = async (requirement: string, projectType?: string) => {
    const result = await parseRequirement(requirement, projectType);
    if (result) {
      setShowInput(false);
    }
  };

  const handleApprove = () => {
    toast.success('Project approved! Build process starting...', {
      description: 'Your project is now in the VALA AI build queue.'
    });
    // Navigate to VALA AI live builds to track progress
    navigate('/super-admin-system/role-switch?role=developer_manager&nav=vala-ai');
  };

  const handleEdit = () => {
    setShowInput(true);
  };

  const handleReset = () => {
    reset();
    setShowInput(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Auto Development Engine</h1>
                <p className="text-xs text-muted-foreground">AI-Powered Software Factory</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AI Online
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        {showInput && !analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Describe Your Software, <span className="text-primary">AI Builds It</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Just describe what you want in plain language. Our AI analyzes your requirements, 
              generates technical specifications, estimates timeline & cost, and kicks off the build process.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-sm">AI Requirement Analysis</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-sm">Instant Specs Generation</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border">
                <Rocket className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">Auto Build & Deploy</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        {showInput ? (
          <RequirementInput onSubmit={handleSubmit} isLoading={isLoading} />
        ) : analysis ? (
          <AnalysisResult
            analysis={analysis}
            onApprove={handleApprove}
            onEdit={handleEdit}
            onReset={handleReset}
          />
        ) : null}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground">AI Analyzing Requirements...</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Generating features, tech stack, timeline, and cost estimates
              </p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
