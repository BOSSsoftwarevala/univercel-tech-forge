/**
 * STEP 7: AI Involvement Pipeline Hook
 * AI can: suggest, auto-fix, auto-deploy, auto-respond
 * AI CANNOT: bypass approval, change UI, access raw DB
 * Flow: BUTTON → AI_JOB → AI_JOB_STEPS → AI_OUTPUT → VALIDATION → DB_COMMIT
 */

import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useEnterpriseAudit } from './useEnterpriseAudit';
import { toast } from 'sonner';

export type AIJobType = 
  | 'suggestion' 
  | 'auto_fix' 
  | 'auto_deploy' 
  | 'auto_respond'
  | 'analysis'
  | 'optimization'
  | 'validation'
  | 'prediction';

export type AIJobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface AIJob {
  id: string;
  jobType: AIJobType;
  sourceModule: string;
  sourceButtonId?: string;
  inputData: Record<string, unknown>;
  outputData?: Record<string, unknown>;
  status: AIJobStatus;
  humanApproved: boolean;
  confidenceScore?: number;
  createdAt: string;
  completedAt?: string;
}

interface CreateAIJobParams {
  jobType: AIJobType;
  sourceModule: string;
  sourceButtonId?: string;
  inputData: Record<string, unknown>;
  requiresApproval?: boolean;
}

export function useAIPipeline() {
  const { user, isBossOwner } = useAuth();
  const { logAiAction } = useEnterpriseAudit();
  const [activeJobs, setActiveJobs] = useState<AIJob[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Create AI job (never auto-executes critical actions)
   */
  const createJob = useCallback(async (params: CreateAIJobParams): Promise<AIJob | null> => {
    setLoading(true);

    try {
      const { data, error } = await supabase.from('ai_jobs').insert([{
        job_type: params.jobType,
        source_module: params.sourceModule,
        source_button_id: params.sourceButtonId || null,
        input_data: params.inputData,
        status: 'pending',
        human_approved: false,
      }] as any).select().single();

      if (error) throw error;

      const job: AIJob = {
        id: data.id,
        jobType: data.job_type as AIJobType,
        sourceModule: data.source_module,
        sourceButtonId: data.source_button_id || undefined,
        inputData: data.input_data as Record<string, unknown>,
        status: data.status as AIJobStatus,
        humanApproved: data.human_approved || false,
        createdAt: data.created_at,
      };

      setActiveJobs(prev => [...prev, job]);
      
      // Log AI job creation
      await logAiAction(
        params.jobType,
        data.id,
        `AI job created for ${params.sourceModule}`,
        0,
        false
      );

      setLoading(false);
      return job;
    } catch (error) {
      console.error('[AIPipeline] Create job failed:', error);
      toast.error('Failed to create AI job');
      setLoading(false);
      return null;
    }
  }, [logAiAction]);

  /**
   * Process AI job steps
   */
  const processJob = useCallback(async (
    jobId: string,
    steps: Array<{ stepType: string; inputData: Record<string, unknown> }>
  ): Promise<boolean> => {
    setLoading(true);

    try {
      // Update job status to processing
      await supabase.from('ai_jobs').update({
        status: 'processing',
      }).eq('id', jobId);

      // Process each step
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const startTime = Date.now();

        // Create step record
        const { data: stepData, error: stepError } = await supabase.from('ai_job_steps').insert([{
          job_id: jobId,
          step_number: i + 1,
          step_type: step.stepType,
          input_data: step.inputData,
          status: 'processing',
        }] as any).select().single();

        if (stepError) throw stepError;

        // Simulate AI processing (in production, this calls actual AI service)
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mark step as completed
        const durationMs = Date.now() - startTime;
        await supabase.from('ai_job_steps').update({
          status: 'completed',
          output_data: { processed: true, step: i + 1 },
          duration_ms: durationMs,
          completed_at: new Date().toISOString(),
        }).eq('id', stepData.id);
      }

      // Mark job as completed (awaiting human approval)
      await supabase.from('ai_jobs').update({
        status: 'completed',
        output_data: { steps_completed: steps.length },
        completed_at: new Date().toISOString(),
      }).eq('id', jobId);

      // Update local state
      setActiveJobs(prev => prev.map(j => 
        j.id === jobId ? { ...j, status: 'completed' as AIJobStatus } : j
      ));

      toast.info('AI processing complete', {
        description: 'Awaiting human approval to apply changes'
      });

      setLoading(false);
      return true;
    } catch (error) {
      console.error('[AIPipeline] Process job failed:', error);
      
      // Mark job as failed
      await supabase.from('ai_jobs').update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Processing failed',
      }).eq('id', jobId);

      toast.error('AI processing failed');
      setLoading(false);
      return false;
    }
  }, []);

  /**
   * Approve AI job output (human required)
   */
  const approveOutput = useCallback(async (jobId: string): Promise<boolean> => {
    if (!isBossOwner) {
      toast.error('Only Boss/Admin can approve AI outputs');
      return false;
    }

    try {
      const { error } = await supabase.from('ai_jobs').update({
        human_approved: true,
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
      }).eq('id', jobId);

      if (error) throw error;

      // Log approval
      await logAiAction(
        'approval',
        jobId,
        'AI output approved by human',
        100,
        true
      );

      // Update local state
      setActiveJobs(prev => prev.map(j => 
        j.id === jobId ? { ...j, humanApproved: true } : j
      ));

      toast.success('AI output approved');
      return true;
    } catch (error) {
      console.error('[AIPipeline] Approve failed:', error);
      toast.error('Failed to approve AI output');
      return false;
    }
  }, [isBossOwner, user?.id, logAiAction]);

  /**
   * Cancel AI job
   */
  const cancelJob = useCallback(async (jobId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('ai_jobs').update({
        status: 'cancelled',
      }).eq('id', jobId);

      if (error) throw error;

      setActiveJobs(prev => prev.filter(j => j.id !== jobId));
      toast.info('AI job cancelled');
      return true;
    } catch (error) {
      console.error('[AIPipeline] Cancel failed:', error);
      return false;
    }
  }, []);

  /**
   * Get AI suggestions (read-only, never auto-execute)
   */
  const getSuggestions = useCallback(async (
    module: string,
    context: Record<string, unknown>
  ): Promise<Array<{ id: string; suggestion: string; confidence: number }>> => {
    // Create suggestion job
    const job = await createJob({
      jobType: 'suggestion',
      sourceModule: module,
      inputData: context,
      requiresApproval: true,
    });

    if (!job) return [];

    // In production, this would call AI service
    // AI suggestions are ALWAYS read-only
    return [
      { id: `sug_${Date.now()}_1`, suggestion: 'Consider optimizing this workflow', confidence: 0.85 },
      { id: `sug_${Date.now()}_2`, suggestion: 'Potential efficiency improvement detected', confidence: 0.72 },
    ];
  }, [createJob]);

  return {
    createJob,
    processJob,
    approveOutput,
    cancelJob,
    getSuggestions,
    activeJobs,
    loading,
    canApproveAI: isBossOwner,
  };
}
