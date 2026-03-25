import { motion } from 'framer-motion';
import { 
  CheckCircle, AlertTriangle, Clock, IndianRupee, Code2, 
  Layers, ArrowRight, Shield, Rocket, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import type { RequirementAnalysis } from '@/hooks/useAutoDevEngine';

interface AnalysisResultProps {
  analysis: RequirementAnalysis;
  onApprove: () => void;
  onEdit: () => void;
  onReset: () => void;
}

export function AnalysisResult({ analysis, onApprove, onEdit, onReset }: AnalysisResultProps) {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-emerald-500/20 text-emerald-400';
      case 'medium': return 'bg-amber-500/20 text-amber-400';
      case 'high': return 'bg-red-500/20 text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-emerald-400';
      case 'medium': return 'text-amber-400';
      case 'high': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const coreFeatures = analysis.features.filter(f => f.priority === 'core');
  const optionalFeatures = analysis.features.filter(f => f.priority === 'optional');
  const totalHours = analysis.features.reduce((sum, f) => sum + f.estimatedHours, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{analysis.projectName}</h2>
              <p className="text-muted-foreground mt-1">{analysis.summary}</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary">{analysis.category}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {analysis.timeline.totalDays} days
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">AI Confidence</div>
              <div className="text-3xl font-bold text-primary">{analysis.confidence}%</div>
              <Progress value={analysis.confidence} className="w-24 h-2 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Features */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Layers className="w-5 h-5 text-primary" />
              Identified Features ({analysis.features.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {coreFeatures.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Core Features</h4>
                <div className="space-y-2">
                  {coreFeatures.map((feature, index) => (
                    <motion.div
                      key={feature.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <div>
                          <span className="text-foreground">{feature.name}</span>
                          <p className="text-xs text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getComplexityColor(feature.complexity)}>
                          {feature.complexity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{feature.estimatedHours}h</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {optionalFeatures.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Optional Features</h4>
                <div className="space-y-2">
                  {optionalFeatures.map((feature, index) => (
                    <motion.div
                      key={feature.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (coreFeatures.length + index) * 0.05 }}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg opacity-80"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border border-muted-foreground rounded" />
                        <span className="text-foreground">{feature.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{feature.complexity}</Badge>
                        <span className="text-xs text-muted-foreground">{feature.estimatedHours}h</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 bg-primary/10 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Estimated Hours</span>
                <span className="font-bold text-primary">{totalHours} hours</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack & Timeline */}
        <div className="space-y-6">
          {/* Tech Stack */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Code2 className="w-5 h-5 text-primary" />
                Technology Stack
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Frontend</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.techStack.frontend.map(tech => (
                    <Badge key={tech} variant="secondary">{tech}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Backend</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.techStack.backend.map(tech => (
                    <Badge key={tech} variant="secondary">{tech}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Integrations</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.techStack.integrations.map(tech => (
                    <Badge key={tech} variant="outline">{tech}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Estimate */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <IndianRupee className="w-5 h-5 text-primary" />
                Cost Estimate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Development</span>
                <span>{formatCurrency(analysis.estimatedCost.development)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Infrastructure (1 year)</span>
                <span>{formatCurrency(analysis.estimatedCost.infrastructure)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Maintenance (1 year)</span>
                <span>{formatCurrency(analysis.estimatedCost.maintenance)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary text-lg">{formatCurrency(analysis.estimatedCost.total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Timeline */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Clock className="w-5 h-5 text-primary" />
            Project Timeline ({analysis.timeline.totalDays} days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {analysis.timeline.phases.map((phase, index) => (
              <motion.div
                key={phase.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-1 min-w-[200px] p-4 bg-muted/50 rounded-lg relative"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-foreground">{phase.name}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">{phase.duration}</div>
                <ul className="text-xs space-y-1">
                  {phase.tasks.slice(0, 3).map(task => (
                    <li key={task} className="flex items-center gap-1 text-muted-foreground">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      {task}
                    </li>
                  ))}
                  {phase.tasks.length > 3 && (
                    <li className="text-muted-foreground">+{phase.tasks.length - 3} more</li>
                  )}
                </ul>
                {index < analysis.timeline.phases.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-primary hidden lg:block" />
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risks */}
      {analysis.risks.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Shield className="w-5 h-5 text-primary" />
              Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.risks.map((risk, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 ${getSeverityColor(risk.severity)}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{risk.risk}</span>
                      <Badge variant="outline" className={getSeverityColor(risk.severity)}>
                        {risk.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Mitigation:</strong> {risk.mitigation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onReset}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Start Over
        </Button>
        <Button variant="outline" onClick={onEdit}>
          Edit Requirements
        </Button>
        <Button onClick={onApprove} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Rocket className="w-4 h-4 mr-2" />
          Approve & Start Build
        </Button>
      </div>
    </motion.div>
  );
}
