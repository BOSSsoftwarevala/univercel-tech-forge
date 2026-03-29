import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  Bot,
  Boxes,
  Bug,
  CreditCard,
  Database,
  FileArchive,
  FileCode2,
  FolderSync,
  Globe,
  Github,
  HardDriveDownload,
  KeyRound,
  LayoutDashboard,
  Package,
  Pause,
  Play,
  RefreshCw,
  Rocket,
  RotateCcw,
  Shield,
  ShoppingCart,
  Sparkles,
  Square,
  Terminal,
  TestTube2,
  Wand2,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  approveFactoryStage,
  buildFactoryMobile,
  controlFactoryPipeline,
  createFactoryBackup,
  createUnifiedFactoryProject,
  deployFactoryProject,
  generateFactoryReport,
  getFactoryDashboard,
  getFactoryProject,
  importFactoryWorkspace,
  listFactoryBuilds,
  listFactoryProjects,
  listFactoryTranslations,
  productizeFactoryProject,
  restoreFactoryBackup,
  runFactoryCommand,
  runFactoryTests,
  saveFactoryMemory,
  scanFactoryWorkspace,
  translateFactoryText,
  updateFactoryArtifact,
  type FactoryDashboard,
  type FactoryGlobalBuild,
  type FactoryProject,
  type FactoryProjectDetail,
  type FactoryTranslation,
} from '@/lib/api/vala-factory';
import { parseMultipleWorkspaceFiles, parseZipWorkspace } from '@/lib/vala-workspace-import';

const COLORS = {
  bg: '#0B0F1A',
  panel: '#0d1b2a',
  panelMuted: '#10223b',
  border: '#1e3a5f',
  accent: '#2563eb',
  accentSoft: 'rgba(37, 99, 235, 0.16)',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.7)',
};

const templateOptions = [
  { key: 'erp', label: 'ERP Template' },
  { key: 'crm', label: 'CRM Template' },
  { key: 'ecommerce', label: 'E-commerce Template' },
  { key: 'school', label: 'School ERP Template' },
  { key: 'hospital', label: 'Hospital Template' },
  { key: 'marketplace', label: 'Marketplace Template' },
  { key: 'transport', label: 'Transport Template' },
  { key: 'service', label: 'Service App Template' },
  { key: 'custom', label: 'Custom System Template' },
  { key: 'apk', label: 'APK Mobile Template' },
];

const defaultPrompt = 'Build an APK-ready multi-role business app with login, JWT, 2FA, CRUD, admin panel, payments, approvals, tests, deployment, license locks, reporting, and backup.';

const ValaAICommandCenter: React.FC = () => {
  const [searchParams] = useSearchParams();
  const zipInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastPersistedProjectRef = useRef<string | null>(null);
  const [dashboard, setDashboard] = useState<FactoryDashboard | null>(null);
  const [projects, setProjects] = useState<FactoryProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [detail, setDetail] = useState<FactoryProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const [sourceType, setSourceType] = useState<'prompt' | 'template' | 'clone'>('prompt');
  const [buildPrompt, setBuildPrompt] = useState(defaultPrompt);
  const [buildName, setBuildName] = useState('');
  const [buildType, setBuildType] = useState('mobile_app');
  const [templateKey, setTemplateKey] = useState('apk');
  const [cloneProjectId, setCloneProjectId] = useState('');
  const [targetPlatform, setTargetPlatform] = useState<'apk' | 'aab' | 'pwa' | 'web'>('apk');
  const [mobileBuildType, setMobileBuildType] = useState<'apk-debug' | 'apk-release' | 'aab' | 'pwa'>('apk-release');
  const [suiteName, setSuiteName] = useState<'login' | 'api' | 'database' | 'flows' | 'crash' | 'full_regression'>('full_regression');
  const [approvalStage, setApprovalStage] = useState<'developer' | 'qa' | 'admin' | 'deploy'>('developer');
  const [approvalNote, setApprovalNote] = useState('');
  const [reportType, setReportType] = useState<'usage' | 'success_rate' | 'failure_logs' | 'export'>('usage');
  const [backupType, setBackupType] = useState<'database' | 'artifacts' | 'full'>('full');
  const [commandText, setCommandText] = useState('Run tests and build APK');
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
  const [artifactContent, setArtifactContent] = useState('');
  const [deployDomain, setDeployDomain] = useState('');
  const [productName, setProductName] = useState('');
  const [productAmount, setProductAmount] = useState('4999');
  const [workspaceImportMode, setWorkspaceImportMode] = useState<'zip' | 'multi_file' | 'github'>('zip');
  const [workspaceProjectName, setWorkspaceProjectName] = useState('');
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [stagedWorkspaceFiles, setStagedWorkspaceFiles] = useState<Array<{ path: string; size_bytes?: number; truncated?: boolean }>>([]);
  const [stagedWorkspacePayload, setStagedWorkspacePayload] = useState<any[]>([]);
  const [importSummary, setImportSummary] = useState<string>('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [translationInput, setTranslationInput] = useState('Build APK and deploy this app');
  const [translatedText, setTranslatedText] = useState('');
  const [recentTranslations, setRecentTranslations] = useState<FactoryTranslation[]>([]);
  const [recentBuilds, setRecentBuilds] = useState<FactoryGlobalBuild[]>([]);

  useEffect(() => {
    if (!fileInputRef.current) return;
    fileInputRef.current.setAttribute('webkitdirectory', '');
    fileInputRef.current.setAttribute('directory', '');
  }, []);

  const selectedArtifact = useMemo(() => detail?.artifacts.find((artifact) => artifact.id === selectedArtifactId) || null, [detail?.artifacts, selectedArtifactId]);
  const workspaceHealth = useMemo(() => {
    if (!detail) return null;
    const openIssues = detail.workspaceIssues.filter((issue) => issue.status !== 'fixed');
    const totalIndexedSize = detail.workspaceFiles.reduce((sum, file) => sum + Number(file.size_bytes || 0), 0);
    const workspaceAnalysis = detail.project.architecture?.workspace_analysis as Record<string, any> | undefined;
    return {
      openIssues,
      totalIndexedSize,
      workspaceAnalysis,
    };
  }, [detail]);
  const recentProjectMemory = useMemo(() => (detail?.memoryEntries || []).slice(0, 6), [detail?.memoryEntries]);
  const latestBuild = detail?.mobileBuilds[0] || null;
  const latestTest = detail?.testRuns[0] || null;
  const latestReport = detail?.reports[0] || null;
  const latestBackup = detail?.backups[0] || null;
  const latestLicense = detail?.licenses[0] || null;
  const requestedProjectId = searchParams.get('project');

  const refreshFactory = async (preserveProject = true) => {
    try {
      const [dashboardResponse, projectsResponse] = await Promise.all([getFactoryDashboard(), listFactoryProjects()]);
      const nextProjects = projectsResponse.data.items || [];
      setDashboard(dashboardResponse.data);
      setProjects(nextProjects);
      setPreferredLanguage((current) => dashboardResponse.data.memoryContext?.preferredLanguage || current);

      setCommandText((current) => current === 'Run tests and build APK' && dashboardResponse.data.memoryContext?.lastCommandText
        ? dashboardResponse.data.memoryContext.lastCommandText
        : current);
      setBuildPrompt((current) => current === defaultPrompt && dashboardResponse.data.memoryContext?.lastPromptText
        ? dashboardResponse.data.memoryContext.lastPromptText
        : current);

      const rememberedProjectId = dashboardResponse.data.memoryContext?.lastProjectId || null;
      const projectId = preserveProject
        ? requestedProjectId || selectedProjectId || rememberedProjectId || nextProjects[0]?.id || null
        : requestedProjectId || rememberedProjectId || nextProjects[0]?.id || null;
      if (!projectId) {
        setSelectedProjectId(null);
        setDetail(null);
        setSelectedArtifactId(null);
        setArtifactContent('');
        return;
      }

      const detailResponse = await getFactoryProject(projectId);
      const nextDetail = detailResponse.data;
      const [translationResponse, buildResponse] = await Promise.all([
        listFactoryTranslations({ projectId, limit: 6 }).catch(() => ({ data: { items: [] } } as Awaited<ReturnType<typeof listFactoryTranslations>>),),
        listFactoryBuilds({ projectId, limit: 6 }).catch(() => ({ data: { items: [] } } as Awaited<ReturnType<typeof listFactoryBuilds>>),),
      ]);
      setSelectedProjectId(projectId);
      setDetail(nextDetail);
      setRecentTranslations(translationResponse.data.items || []);
      setRecentBuilds(buildResponse.data.items || []);
      setDeployDomain(String(nextDetail.project.deployment_state?.domain || `${nextDetail.project.project_slug}.softwarewala.app`));
      setProductName(nextDetail.project.project_name);
      const firstArtifact = nextDetail.artifacts[0] || null;
      setSelectedArtifactId((current) => current && nextDetail.artifacts.some((artifact) => artifact.id === current) ? current : firstArtifact?.id || null);
      setArtifactContent((current) => {
        if (current && selectedArtifactId && nextDetail.artifacts.some((artifact) => artifact.id === selectedArtifactId)) return current;
        return firstArtifact?.content || '';
      });
    } catch (error) {
      console.error('Failed to load VALA factory data', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load VALA factory data');
    } finally {
      setLoading(false);
      setBusyAction(null);
    }
  };

  useEffect(() => {
    void refreshFactory(false);
    const interval = window.setInterval(() => void refreshFactory(true), 15000);
    return () => window.clearInterval(interval);
  }, [requestedProjectId]);

  useEffect(() => {
    if (selectedArtifact) setArtifactContent(selectedArtifact.content);
  }, [selectedArtifact?.id]);

  useEffect(() => {
    if (!selectedProjectId || lastPersistedProjectRef.current === selectedProjectId) return;
    lastPersistedProjectRef.current = selectedProjectId;
    const selectedProject = projects.find((project) => project.id === selectedProjectId);
    void saveFactoryMemory({
      memory_scope: 'user',
      memory_type: 'selection',
      memory_key: 'last_open_project',
      project_id: selectedProjectId,
      summary: `Last open project: ${selectedProject?.project_name || detail?.project.project_name || selectedProjectId}`,
      value: {
        project_id: selectedProjectId,
        project_name: selectedProject?.project_name || detail?.project.project_name || null,
      },
      mode: 'upsert',
    }).catch((error) => {
      console.error('Failed to persist selected VALA project', error);
    });
  }, [detail?.project.project_name, projects, selectedProjectId]);

  const runAndRefresh = async (actionKey: string, action: () => Promise<void>) => {
    setBusyAction(actionKey);
    try {
      await action();
      await refreshFactory(true);
    } catch (error) {
      console.error(`Failed action ${actionKey}`, error);
      toast.error(error instanceof Error ? error.message : `Failed action ${actionKey}`);
      setBusyAction(null);
    }
  };

  const handleBuild = async () => {
    if (sourceType === 'prompt' && !buildPrompt.trim()) {
      toast.error('Prompt is required');
      return;
    }
    if (sourceType === 'clone' && !cloneProjectId) {
      toast.error('Choose a project to clone');
      return;
    }

    await runAndRefresh('build', async () => {
      const response = await createUnifiedFactoryProject({
        prompt: sourceType === 'prompt' ? buildPrompt : undefined,
        project_name: buildName || undefined,
        project_type: buildType,
        source_type: sourceType,
        template_key: sourceType === 'template' ? templateKey : undefined,
        clone_project_id: sourceType === 'clone' ? cloneProjectId : undefined,
        target_platform: targetPlatform,
        build_type: mobileBuildType,
      });
      toast.success('Unified AI APK factory project created');
      setSelectedProjectId(response.data.project.id);
      setCommandText('Start pipeline and run tests');
    });
  };

  const handleRunCommand = async (nextCommand?: string) => {
    if (!selectedProjectId) {
      toast.error('Select a project first');
      return;
    }
    const command = (nextCommand || commandText).trim();
    if (!command) {
      toast.error('Command is required');
      return;
    }
    await runAndRefresh('command', async () => {
      const response = await runFactoryCommand(selectedProjectId, command);
      toast.success(response.data.output);
      setCommandText(command);
    });
  };

  const handleSaveArtifact = async () => {
    if (!selectedProjectId || !selectedArtifactId) {
      toast.error('Select an artifact first');
      return;
    }
    await runAndRefresh('artifact', async () => {
      await updateFactoryArtifact(selectedProjectId, selectedArtifactId, artifactContent);
      toast.success('Live artifact updated');
    });
  };

  const handlePipeline = async (action: 'start' | 'pause' | 'stop' | 'retry' | 'force_build') => {
    if (!selectedProjectId) {
      toast.error('Select a project first');
      return;
    }
    await runAndRefresh(`pipeline-${action}`, async () => {
      const response = await controlFactoryPipeline(selectedProjectId, { action });
      toast.success(response.data.output);
    });
  };

  const handleMobileBuild = async () => {
    if (!selectedProjectId) {
      toast.error('Select a project first');
      return;
    }
    await runAndRefresh('mobile-build', async () => {
      const response = await buildFactoryMobile(selectedProjectId, { build_type: mobileBuildType });
      toast.success(`Mobile build recorded: ${response.data.mobileBuild.status}`);
    });
  };

  const handleTests = async () => {
    if (!selectedProjectId) {
      toast.error('Select a project first');
      return;
    }
    await runAndRefresh('tests', async () => {
      const response = await runFactoryTests(selectedProjectId, { suite_name: suiteName });
      toast.success(`Test result: ${response.data.testRun.status}`);
    });
  };

  const handleApproval = async (decision: 'approved' | 'rejected' | 'override') => {
    if (!selectedProjectId) {
      toast.error('Select a project first');
      return;
    }
    await runAndRefresh(`approval-${decision}`, async () => {
      const response = await approveFactoryStage(selectedProjectId, { stage_name: approvalStage, decision, note: approvalNote || undefined });
      toast.success(`${response.data.approval.stage_name} marked ${response.data.approval.status}`);
    });
  };

  const handleDeploy = async () => {
    if (!selectedProjectId) {
      toast.error('Select a project first');
      return;
    }
    await runAndRefresh('deploy', async () => {
      const response = await deployFactoryProject(selectedProjectId, { provider: 'vercel', target: 'live', domain: deployDomain });
      toast.success(response.data.deployment.live_url ? 'Project deployed live' : 'Deployment orchestration saved');
    });
  };

  const handleProductize = async () => {
    if (!selectedProjectId) {
      toast.error('Select a project first');
      return;
    }
    await runAndRefresh('productize', async () => {
      await productizeFactoryProject(selectedProjectId, {
        product_name: productName || detail?.project.project_name,
        amount: Number(productAmount || 0),
        currency: 'INR',
        billing_model: 'license',
        sale_status: 'ready',
        sales_page_url: `/marketplace/${detail?.project.project_slug}`,
      });
      toast.success('Marketplace product created');
    });
  };

  const handleReport = async () => {
    if (!selectedProjectId) {
      toast.error('Select a project first');
      return;
    }
    await runAndRefresh('report', async () => {
      const response = await generateFactoryReport(selectedProjectId, { report_type: reportType });
      toast.success(`Report created: ${response.data.report.report_type}`);
    });
  };

  const handleBackup = async () => {
    if (!selectedProjectId) {
      toast.error('Select a project first');
      return;
    }
    await runAndRefresh('backup', async () => {
      const response = await createFactoryBackup(selectedProjectId, { backup_type: backupType });
      toast.success(`Backup created: ${response.data.backup.backup_type}`);
    });
  };

  const handleRestoreBackup = async (backupId: string) => {
    if (!selectedProjectId) {
      toast.error('Select a project first');
      return;
    }
    await runAndRefresh('restore-backup', async () => {
      const response = await restoreFactoryBackup(selectedProjectId, backupId);
      toast.success(`Backup restored: ${response.data.backup.id}`);
    });
  };

  const formatBytes = (value: number) => {
    if (!Number.isFinite(value) || value <= 0) return '0 B';
    if (value < 1024) return `${value} B`;
    if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
    if (value < 1024 * 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`;
    return `${(value / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const stageZipWorkspace = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const zipFile = event.target.files?.[0];
    if (!zipFile) return;
    try {
      setBusyAction('stage-zip');
      const parsedFiles = await parseZipWorkspace(zipFile);
      setStagedWorkspacePayload(parsedFiles);
      setStagedWorkspaceFiles(parsedFiles.map((file) => ({ path: file.path, size_bytes: file.size_bytes, truncated: file.truncated })));
      setWorkspaceProjectName((current) => current || zipFile.name.replace(/\.zip$/i, ''));
      setImportSummary(`ZIP parsed: ${parsedFiles.length} indexed files ready for import.`);
      toast.success('Workspace ZIP indexed');
    } catch (error) {
      console.error('Failed to parse ZIP workspace', error);
      toast.error(error instanceof Error ? error.message : 'Failed to parse ZIP workspace');
    } finally {
      setBusyAction(null);
      if (event.target) event.target.value = '';
    }
  };

  const stageMultiFileWorkspace = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;
    try {
      setBusyAction('stage-files');
      const parsedFiles = await parseMultipleWorkspaceFiles(files);
      setStagedWorkspacePayload(parsedFiles);
      setStagedWorkspaceFiles(parsedFiles.map((file) => ({ path: file.path, size_bytes: file.size_bytes, truncated: file.truncated })));
      setImportSummary(`Multi-file workspace parsed: ${parsedFiles.length} indexed files ready for import.`);
      toast.success('Workspace files indexed');
    } catch (error) {
      console.error('Failed to parse workspace files', error);
      toast.error(error instanceof Error ? error.message : 'Failed to parse workspace files');
    } finally {
      setBusyAction(null);
      if (event.target) event.target.value = '';
    }
  };

  const handleWorkspaceImport = async () => {
    if (workspaceImportMode === 'github' && !githubRepoUrl.trim()) {
      toast.error('GitHub repository URL is required');
      return;
    }
    if (workspaceImportMode !== 'github' && !stagedWorkspacePayload.length) {
      toast.error('Select files before importing');
      return;
    }

    await runAndRefresh('workspace-import', async () => {
      const response = await importFactoryWorkspace({
        project_name: workspaceProjectName || 'Imported Workspace',
        import_mode: workspaceImportMode,
        repo_url: workspaceImportMode === 'github' ? githubRepoUrl.trim() : undefined,
        files: workspaceImportMode === 'github' ? undefined : stagedWorkspacePayload,
      });
      setSelectedProjectId(response.data.project.id);
      setWorkspaceProjectName('');
      setGithubRepoUrl('');
      setStagedWorkspaceFiles([]);
      setStagedWorkspacePayload([]);
      setImportSummary(response.data.analysis.summary);
      toast.success('Workspace imported into VALA');
    });
  };

  const handleWorkspaceRescan = async () => {
    if (!selectedProjectId) {
      toast.error('Select a project first');
      return;
    }
    await runAndRefresh('workspace-scan', async () => {
      const response = await scanFactoryWorkspace(selectedProjectId);
      setImportSummary(response.data.analysis.summary);
      toast.success(`Workspace rescanned: ${response.data.analysis.issues.length} tracked issues`);
    });
  };

  const handleQuickExecution = async (preset: string) => {
    setCommandText(preset);
    await handleRunCommand(preset);
  };

  const handleTranslate = async () => {
    if (!translationInput.trim()) {
      toast.error('Translation text is required');
      return;
    }
    setBusyAction('translate');
    try {
      const response = await translateFactoryText({
        text: translationInput,
        target_language: preferredLanguage,
        project_id: selectedProjectId || undefined,
      });
      setTranslatedText(response.data.translated_text);
      const translationsResponse = await listFactoryTranslations({ projectId: selectedProjectId || undefined, limit: 6 });
      setRecentTranslations(translationsResponse.data.items || []);
      toast.success(`Translated to ${response.data.target_language}`);
    } catch (error) {
      console.error('Failed to translate text', error);
      toast.error(error instanceof Error ? error.message : 'Failed to translate text');
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: COLORS.bg, color: COLORS.text }}>
      <div className="border-b px-6 py-5" style={{ borderColor: COLORS.border, background: COLORS.panel }}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl p-3" style={{ background: COLORS.accentSoft }}>
              <Sparkles className="h-6 w-6" style={{ color: '#7dd3fc' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">VALA AI APK FACTORY</h1>
              <p style={{ color: COLORS.textMuted }}>Idea → AI → Build → Test → Deploy → Sell → Manage with one persisted pipeline.</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setBusyAction('refresh');
              void refreshFactory(true);
            }}
            disabled={busyAction === 'refresh'}
            className="gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            <RefreshCw className={`h-4 w-4 ${busyAction === 'refresh' ? 'animate-spin' : ''}`} />
            Refresh Factory
          </Button>
        </div>
      </div>

      <div className="grid min-h-[calc(100vh-89px)] lg:grid-cols-[380px_1fr]">
        <aside className="border-r p-4" style={{ borderColor: COLORS.border, background: COLORS.panel }}>
          <Panel title="Unified Input Engine" icon={Wand2}>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {(['prompt', 'template', 'clone'] as const).map((item) => (
                  <Button
                    key={item}
                    variant="outline"
                    onClick={() => setSourceType(item)}
                    className="border-white/10 text-white hover:bg-white/10"
                    style={{ background: sourceType === item ? COLORS.accentSoft : 'rgba(255,255,255,0.03)' }}
                  >
                    {item}
                  </Button>
                ))}
              </div>
              <Input value={buildName} onChange={(event) => setBuildName(event.target.value)} placeholder="Project name" className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
              <Input value={buildType} onChange={(event) => setBuildType(event.target.value)} placeholder="Project type" className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
              <Input value={targetPlatform} onChange={(event) => setTargetPlatform(event.target.value as 'apk' | 'aab' | 'pwa' | 'web')} placeholder="Target platform" className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
              {sourceType === 'prompt' ? <Textarea value={buildPrompt} onChange={(event) => setBuildPrompt(event.target.value)} rows={7} className="border-white/10 bg-white/5 text-white placeholder:text-white/40" /> : null}
              {sourceType === 'template' ? (
                <div className="grid grid-cols-1 gap-2">
                  {templateOptions.map((template) => (
                    <button
                      key={template.key}
                      type="button"
                      onClick={() => setTemplateKey(template.key)}
                      className="rounded-xl border p-3 text-left"
                      style={{ borderColor: templateKey === template.key ? COLORS.accent : COLORS.border, background: templateKey === template.key ? COLORS.accentSoft : 'rgba(255,255,255,0.03)' }}
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              ) : null}
              {sourceType === 'clone' ? (
                <div className="space-y-2">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => setCloneProjectId(project.id)}
                      className="w-full rounded-xl border p-3 text-left"
                      style={{ borderColor: cloneProjectId === project.id ? COLORS.accent : COLORS.border, background: cloneProjectId === project.id ? COLORS.accentSoft : 'rgba(255,255,255,0.03)' }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>{project.project_name}</span>
                        <Badge variant="outline" className="border-white/10 text-white/80">v{project.version}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}
              <Input value={mobileBuildType} onChange={(event) => setMobileBuildType(event.target.value as 'apk-debug' | 'apk-release' | 'aab' | 'pwa')} placeholder="Build type" className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
              <Button onClick={handleBuild} disabled={busyAction === 'build'} className="w-full gap-2 bg-blue-600 text-white hover:bg-blue-500">
                <Play className="h-4 w-4" />
                {busyAction === 'build' ? 'Creating...' : 'Create Unified Factory Project'}
              </Button>
            </div>
          </Panel>

          <Panel title="Workspace Intake" icon={HardDriveDownload}>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {(['zip', 'multi_file', 'github'] as const).map((item) => (
                  <Button
                    key={item}
                    variant="outline"
                    onClick={() => setWorkspaceImportMode(item)}
                    className="border-white/10 text-white hover:bg-white/10"
                    style={{ background: workspaceImportMode === item ? COLORS.accentSoft : 'rgba(255,255,255,0.03)' }}
                  >
                    {item === 'multi_file' ? 'files' : item}
                  </Button>
                ))}
              </div>
              <Input value={workspaceProjectName} onChange={(event) => setWorkspaceProjectName(event.target.value)} placeholder="Imported workspace name" className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
              {workspaceImportMode === 'github' ? (
                <Input value={githubRepoUrl} onChange={(event) => setGithubRepoUrl(event.target.value)} placeholder="https://github.com/owner/repo" className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
              ) : null}
              {workspaceImportMode === 'zip' ? (
                <Button variant="outline" onClick={() => zipInputRef.current?.click()} className="w-full justify-start gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10">
                  <FileArchive className="h-4 w-4" />
                  Parse ZIP Workspace
                </Button>
              ) : null}
              {workspaceImportMode === 'multi_file' ? (
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full justify-start gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10">
                  <HardDriveDownload className="h-4 w-4" />
                  Index Files or Folder
                </Button>
              ) : null}
              {workspaceImportMode === 'github' ? (
                <div className="rounded-xl border p-3 text-sm" style={{ borderColor: COLORS.border, background: COLORS.panelMuted, color: COLORS.textMuted }}>
                  Public GitHub repos are fetched server-side and indexed into the VALA workspace automatically.
                </div>
              ) : null}
              <input ref={zipInputRef} type="file" accept=".zip" onChange={stageZipWorkspace} className="hidden" />
              <input ref={fileInputRef} type="file" multiple onChange={stageMultiFileWorkspace} className="hidden" />
              {importSummary ? <InfoCard title="Import Summary" body={importSummary} /> : null}
              {!!stagedWorkspaceFiles.length && (
                <div className="rounded-xl border p-3" style={{ borderColor: COLORS.border, background: COLORS.panelMuted }}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">Staged Files</p>
                    <Badge variant="outline" className="border-white/10 text-white/80">{stagedWorkspaceFiles.length}</Badge>
                  </div>
                  <div className="mt-2 max-h-48 space-y-2 overflow-auto pr-1">
                    {stagedWorkspaceFiles.slice(0, 20).map((file) => (
                      <div key={file.path} className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: COLORS.border, background: 'rgba(255,255,255,0.03)' }}>
                        <div className="truncate font-medium text-white">{file.path}</div>
                        <div style={{ color: COLORS.textMuted }}>{formatBytes(Number(file.size_bytes || 0))}{file.truncated ? ' • truncated preview' : ''}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <Button onClick={handleWorkspaceImport} disabled={busyAction === 'workspace-import'} className="w-full gap-2 bg-emerald-600 text-white hover:bg-emerald-500">
                {workspaceImportMode === 'github' ? <Github className="h-4 w-4" /> : <HardDriveDownload className="h-4 w-4" />}
                {busyAction === 'workspace-import' ? 'Importing...' : 'Import Into VALA'}
              </Button>
            </div>
          </Panel>

          <Panel title="Projects" icon={Boxes}>
            <div className="space-y-2">
              {projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setBusyAction('select');
                    void refreshFactory(true);
                  }}
                  className="w-full rounded-xl border p-3 text-left"
                  style={{ borderColor: selectedProjectId === project.id ? COLORS.accent : COLORS.border, background: selectedProjectId === project.id ? COLORS.accentSoft : 'rgba(255,255,255,0.03)' }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{project.project_name}</span>
                    <Badge variant="outline" className="border-white/10 text-white/80">{project.pipeline_status}</Badge>
                  </div>
                  <p className="mt-1 text-xs" style={{ color: COLORS.textMuted }}>{project.input_source} • {project.project_type} • v{project.version}</p>
                  <p className="mt-1 text-xs" style={{ color: project.stable ? '#34d399' : '#f59e0b' }}>{project.stable ? 'stable' : 'not stable'} • stage {project.current_stage}</p>
                </button>
              ))}
              {!projects.length && !loading ? <EmptyState text="No projects yet. Create the first unified factory project." /> : null}
            </div>
          </Panel>
        </aside>

        <main className="space-y-5 p-5" style={{ background: COLORS.bg }}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <StatCard icon={LayoutDashboard} label="Projects" value={dashboard?.totals.projects ?? 0} />
            <StatCard icon={Bot} label="Runs" value={dashboard?.totals.runs ?? 0} />
            <StatCard icon={Package} label="Mobile Builds" value={dashboard?.totals.mobileBuilds ?? 0} />
            <StatCard icon={TestTube2} label="Tests" value={dashboard?.totals.tests ?? 0} />
            <StatCard icon={BadgeCheck} label="Approvals Pending" value={dashboard?.totals.approvalsPending ?? 0} />
            <StatCard icon={ShoppingCart} label="Products" value={dashboard?.totals.products ?? 0} />
          </div>

          {loading ? <EmptyState text="Loading unified APK factory..." /> : null}

          {detail ? (
            <>
              <Panel title={detail.project.project_name} icon={Sparkles}>
                <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-white/10 text-white">{detail.project.input_source}</Badge>
                      <Badge variant="outline" className="border-white/10 text-white">{detail.project.current_stage}</Badge>
                      <Badge variant="outline" className="border-white/10 text-white">{detail.project.approval_status}</Badge>
                      <Badge variant="outline" className="border-white/10 text-white">{detail.project.stable ? 'stable' : 'unstable'}</Badge>
                    </div>
                    <p style={{ color: COLORS.textMuted }}>{String(detail.project.architecture?.summary || detail.project.prompt)}</p>
                    <div className="grid gap-3 md:grid-cols-3">
                      <MiniTile title="Source" value={detail.project.input_source} />
                      <MiniTile title="Theme" value={detail.project.theme_lock} />
                      <MiniTile title="Platform" value={String(detail.project.raw_input_saved?.target_platform || 'web')} />
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <MiniTile title="Frontend" value={detail.project.stack_frontend.join(', ')} />
                      <MiniTile title="Backend" value={detail.project.stack_backend.join(', ')} />
                      <MiniTile title="Database" value={detail.project.stack_database.join(', ')} />
                    </div>
                  </div>

                  <div className="space-y-3 rounded-2xl border p-4" style={{ borderColor: COLORS.border, background: COLORS.panelMuted }}>
                    <div className="text-sm font-semibold">Pipeline Control</div>
                    <div className="grid grid-cols-2 gap-2">
                      <QuickButton label="Start" icon={Play} onClick={() => void handlePipeline('start')} />
                      <QuickButton label="Pause" icon={Pause} onClick={() => void handlePipeline('pause')} />
                      <QuickButton label="Stop" icon={Square} onClick={() => void handlePipeline('stop')} />
                      <QuickButton label="Retry" icon={RotateCcw} onClick={() => void handlePipeline('retry')} />
                    </div>
                    <Button onClick={() => void handlePipeline('force_build')} className="w-full bg-cyan-600 text-white hover:bg-cyan-500">Force Build</Button>
                    <Textarea value={commandText} onChange={(event) => setCommandText(event.target.value)} rows={3} className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
                    <Button onClick={() => void handleRunCommand()} disabled={busyAction === 'command'} className="w-full gap-2 bg-blue-600 text-white hover:bg-blue-500">
                      <Terminal className="h-4 w-4" />
                      Execute Factory Command
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <QuickButton label="Fix All Issues" icon={Bug} onClick={() => void handleQuickExecution('Fix all issues')} />
                      <QuickButton label="Add Payment" icon={CreditCard} onClick={() => void handleQuickExecution('Add payment gateway')} />
                      <QuickButton label="Make Scalable" icon={Zap} onClick={() => void handleQuickExecution('Make scalable')} />
                      <QuickButton label="Rescan Workspace" icon={RefreshCw} onClick={() => void handleWorkspaceRescan()} />
                    </div>
                  </div>
                </div>
              </Panel>

              <div className="grid gap-5 xl:grid-cols-2">
                <Panel title="Workspace Index" icon={HardDriveDownload}>
                  <div className="grid gap-3 md:grid-cols-3">
                    <MiniTile title="Indexed Files" value={String(detail.workspaceFiles.length)} />
                    <MiniTile title="Tracked Issues" value={String(workspaceHealth?.openIssues.length || 0)} />
                    <MiniTile title="Indexed Size" value={formatBytes(workspaceHealth?.totalIndexedSize || 0)} />
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <MiniTile title="Routes" value={String(workspaceHealth?.workspaceAnalysis?.routes?.length || 0)} />
                    <MiniTile title="API Surfaces" value={String(workspaceHealth?.workspaceAnalysis?.apis?.length || 0)} />
                    <MiniTile title="DB Markers" value={String(workspaceHealth?.workspaceAnalysis?.db_tables?.length || 0)} />
                  </div>
                  <div className="mt-4 space-y-2">
                    {detail.workspaceFiles.slice(0, 8).map((file) => (
                      <div key={file.id} className="rounded-xl border p-3" style={{ borderColor: COLORS.border, background: COLORS.panelMuted }}>
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate font-medium">{file.file_path}</p>
                          <Badge variant="outline" className="border-white/10 text-white/80">{file.language}</Badge>
                        </div>
                        <p className="mt-1 text-xs" style={{ color: COLORS.textMuted }}>{formatBytes(Number(file.size_bytes || 0))}{file.is_truncated ? ' • excerpt only' : ''}</p>
                      </div>
                    ))}
                    {!detail.workspaceFiles.length ? <EmptyState text="No imported workspace files for this project." /> : null}
                  </div>
                </Panel>

                <Panel title="Issue Scanner" icon={AlertTriangle}>
                  <div className="space-y-3">
                    {detail.workspaceIssues.slice(0, 10).map((issue) => (
                      <div key={issue.id} className="rounded-xl border p-3" style={{ borderColor: COLORS.border, background: COLORS.panelMuted }}>
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium">{issue.title}</p>
                          <Badge variant="outline" className="border-white/10 text-white/80">{issue.severity} • {issue.status}</Badge>
                        </div>
                        <p className="mt-1 text-sm" style={{ color: COLORS.textMuted }}>{issue.description || 'No description available.'}</p>
                        <p className="mt-2 text-xs" style={{ color: issue.status === 'fixed' ? '#34d399' : '#fca5a5' }}>{issue.file_path || 'workspace'}{issue.fix_command ? ` • fix: ${issue.fix_command}` : ''}</p>
                      </div>
                    ))}
                    {!detail.workspaceIssues.length ? <EmptyState text="No workspace issues detected." /> : null}
                  </div>
                </Panel>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                <Panel title="Global Language + Build Engine" icon={Globe}>
                  <div className="grid gap-3 md:grid-cols-3">
                    <MiniTile title="Preferred Language" value={preferredLanguage} />
                    <MiniTile title="Translations" value={String(recentTranslations.length)} />
                    <MiniTile title="Build Records" value={String(recentBuilds.length)} />
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-[160px_1fr_auto]">
                    <Input value={preferredLanguage} onChange={(event) => setPreferredLanguage(event.target.value.toLowerCase())} className="border-white/10 bg-white/5 text-white placeholder:text-white/40" placeholder="en" />
                    <Input value={translationInput} onChange={(event) => setTranslationInput(event.target.value)} className="border-white/10 bg-white/5 text-white placeholder:text-white/40" placeholder="Translate this command or prompt" />
                    <Button onClick={handleTranslate} disabled={busyAction === 'translate'} className="bg-teal-600 text-white hover:bg-teal-500">Translate</Button>
                  </div>
                  {translatedText ? <InfoCard title="Translated Output" body={translatedText} /> : null}
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      {recentTranslations.map((item) => (
                        <div key={item.id} className="rounded-xl border p-3" style={{ borderColor: COLORS.border, background: COLORS.panelMuted }}>
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium">{item.target_language}</p>
                            <Badge variant="outline" className="border-white/10 text-white/80">{item.provider || 'identity'}</Badge>
                          </div>
                          <p className="mt-1 text-xs" style={{ color: COLORS.textMuted }}>{item.original_text}</p>
                          <p className="mt-2 text-sm">{item.translated_text}</p>
                        </div>
                      ))}
                      {!recentTranslations.length ? <EmptyState text="No translations recorded yet." /> : null}
                    </div>
                    <div className="space-y-2">
                      {recentBuilds.map((item) => (
                        <div key={item.id} className="rounded-xl border p-3" style={{ borderColor: COLORS.border, background: COLORS.panelMuted }}>
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium">{item.type.toUpperCase()} • {item.status}</p>
                            <Badge variant="outline" className="border-white/10 text-white/80">{new Date(item.created_at).toLocaleDateString()}</Badge>
                          </div>
                          <p className="mt-1 text-xs" style={{ color: COLORS.textMuted }}>{item.download_url || 'No download link yet'}</p>
                        </div>
                      ))}
                      {!recentBuilds.length ? <EmptyState text="No global build records yet." /> : null}
                    </div>
                  </div>
                </Panel>

                <Panel title="AI Core + Module Engine" icon={Bot}>
                  <div className="grid gap-3 md:grid-cols-2">
                    <MiniTile title="Requirement Steps" value={String(detail.blueprint?.requirement_breakdown?.length || 0)} />
                    <MiniTile title="Role Detection" value={String(detail.blueprint?.role_detection?.length || 0)} />
                    <MiniTile title="Modules" value={String(detail.modules.length)} />
                    <MiniTile title="API Specs" value={String(detail.apiSpecs.length)} />
                  </div>
                  <div className="mt-4 space-y-3">
                    {detail.modules.slice(0, 8).map((module) => (
                      <div key={module.id} className="rounded-xl border p-3" style={{ borderColor: COLORS.border, background: COLORS.panelMuted }}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold">{module.module_name}</p>
                            <p className="text-xs" style={{ color: COLORS.textMuted }}>{module.module_key} • {module.module_type}</p>
                          </div>
                          <Badge variant="outline" className="border-white/10 text-white/80">{module.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>

                <Panel title="API + DB + Flow Engine" icon={Database}>
                  <div className="grid gap-3 md:grid-cols-3">
                    <MiniTile title="Routes" value={String(detail.apiSpecs.length)} />
                    <MiniTile title="Tables" value={String(detail.dbSpecs.length)} />
                    <MiniTile title="Flows" value={String(detail.flowSpecs.length)} />
                  </div>
                  <div className="mt-4 rounded-xl border p-4" style={{ borderColor: COLORS.border, background: COLORS.panelMuted }}>
                    <p className="mb-2 text-sm font-semibold">Connected Guarantees</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(detail.project.feature_matrix).map(([key, value]) => (
                        <Badge key={key} variant="outline" className="border-white/10 text-white/80">{key}: {String(value)}</Badge>
                      ))}
                    </div>
                  </div>
                </Panel>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                <Panel title="APK Build + Test Engine" icon={Package}>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input value={mobileBuildType} onChange={(event) => setMobileBuildType(event.target.value as 'apk-debug' | 'apk-release' | 'aab' | 'pwa')} className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
                    <Button onClick={handleMobileBuild} disabled={busyAction === 'mobile-build'} className="bg-emerald-600 text-white hover:bg-emerald-500">Build Mobile Output</Button>
                    <Input value={suiteName} onChange={(event) => setSuiteName(event.target.value as 'login' | 'api' | 'database' | 'flows' | 'crash' | 'full_regression')} className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
                    <Button onClick={handleTests} disabled={busyAction === 'tests'} className="bg-violet-600 text-white hover:bg-violet-500">Run Tests</Button>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <MiniTile title="Latest Build" value={latestBuild ? `${latestBuild.build_type} • ${latestBuild.status}` : 'none'} />
                    <MiniTile title="Latest Test" value={latestTest ? `${latestTest.suite_name} • ${latestTest.status}` : 'none'} />
                  </div>
                  {latestBuild ? <InfoCard title="Build Detail" body={`${latestBuild.version_name} • signing ${latestBuild.signing_status}${latestBuild.artifact_url ? ` • ${latestBuild.artifact_url}` : ''}`} /> : null}
                  {latestTest ? <InfoCard title="Test Detail" body={`stable ${String(latestTest.stable)} • failures ${Array.isArray(latestTest.failure_logs) ? latestTest.failure_logs.length : 0}`} /> : null}
                </Panel>

                <Panel title="Approval + Deploy + Sell" icon={Shield}>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input value={approvalStage} onChange={(event) => setApprovalStage(event.target.value as 'developer' | 'qa' | 'admin' | 'deploy')} className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
                    <Input value={approvalNote} onChange={(event) => setApprovalNote(event.target.value)} placeholder="Approval note" className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <Button onClick={() => void handleApproval('approved')} className="bg-emerald-600 text-white hover:bg-emerald-500">Approve</Button>
                    <Button onClick={() => void handleApproval('rejected')} className="bg-amber-600 text-white hover:bg-amber-500">Reject</Button>
                    <Button onClick={() => void handleApproval('override')} className="bg-fuchsia-600 text-white hover:bg-fuchsia-500">Override</Button>
                  </div>
                  <Input value={deployDomain} onChange={(event) => setDeployDomain(event.target.value)} className="mt-3 border-white/10 bg-white/5 text-white placeholder:text-white/40" placeholder="Live domain" />
                  <Button onClick={handleDeploy} disabled={busyAction === 'deploy'} className="mt-3 w-full bg-cyan-600 text-white hover:bg-cyan-500">Deploy Now</Button>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <Input value={productName} onChange={(event) => setProductName(event.target.value)} className="border-white/10 bg-white/5 text-white placeholder:text-white/40" placeholder="Product name" />
                    <Input value={productAmount} onChange={(event) => setProductAmount(event.target.value)} className="border-white/10 bg-white/5 text-white placeholder:text-white/40" placeholder="Price" />
                  </div>
                  <Button onClick={handleProductize} disabled={busyAction === 'productize'} className="mt-3 w-full bg-amber-600 text-white hover:bg-amber-500">Create Product</Button>
                  {latestLicense ? <InfoCard title="License" body={`${latestLicense.license_key}${latestLicense.domain_lock ? ` • ${latestLicense.domain_lock}` : ''}`} /> : null}
                </Panel>
              </div>

              <Panel title="Dev Studio Live" icon={FileCode2}>
                <div className="grid gap-4 xl:grid-cols-[260px_1fr]">
                  <div className="space-y-2">
                    {detail.artifacts.map((artifact) => (
                      <button
                        key={artifact.id}
                        type="button"
                        onClick={() => {
                          setSelectedArtifactId(artifact.id);
                          setArtifactContent(artifact.content);
                        }}
                        className="w-full rounded-xl border p-3 text-left"
                        style={{ borderColor: selectedArtifactId === artifact.id ? COLORS.accent : COLORS.border, background: selectedArtifactId === artifact.id ? COLORS.accentSoft : COLORS.panelMuted }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-medium">{artifact.file_path}</span>
                          <Badge variant="outline" className="border-white/10 text-white/80">{artifact.language}</Badge>
                        </div>
                        <p className="mt-1 text-xs" style={{ color: COLORS.textMuted }}>{artifact.artifact_type}</p>
                      </button>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3" style={{ borderColor: COLORS.border, background: COLORS.panelMuted }}>
                      <div>
                        <p className="font-medium">{selectedArtifact?.file_path || 'Select artifact'}</p>
                        <p className="text-sm" style={{ color: COLORS.textMuted }}>Edit code, API stubs, DB scripts, or flow config with a real revision record.</p>
                      </div>
                      <Button onClick={handleSaveArtifact} disabled={busyAction === 'artifact' || !selectedArtifactId} className="bg-blue-600 text-white hover:bg-blue-500">Save Artifact</Button>
                    </div>
                    <Textarea value={artifactContent} onChange={(event) => setArtifactContent(event.target.value)} rows={22} className="font-mono border-white/10 bg-white/5 text-white placeholder:text-white/30" />
                  </div>
                </div>
              </Panel>

              <div className="grid gap-5 xl:grid-cols-2">
                <Panel title="Reporting + Backup + Versions" icon={FolderSync}>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input value={reportType} onChange={(event) => setReportType(event.target.value as 'usage' | 'success_rate' | 'failure_logs' | 'export')} className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
                    <Button onClick={handleReport} disabled={busyAction === 'report'} className="bg-indigo-600 text-white hover:bg-indigo-500">Generate Report</Button>
                    <Input value={backupType} onChange={(event) => setBackupType(event.target.value as 'database' | 'artifacts' | 'full')} className="border-white/10 bg-white/5 text-white placeholder:text-white/40" />
                    <Button onClick={handleBackup} disabled={busyAction === 'backup'} className="bg-slate-200 text-slate-900 hover:bg-white">Create Backup</Button>
                  </div>
                  {latestReport ? <InfoCard title="Latest Report" body={`${latestReport.report_type} • ${new Date(latestReport.created_at).toLocaleString()}`} /> : null}
                  {latestBackup ? (
                    <div className="mt-3 rounded-xl border p-4" style={{ borderColor: COLORS.border, background: COLORS.panelMuted }}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">Latest Backup</p>
                          <p className="text-sm" style={{ color: COLORS.textMuted }}>{latestBackup.backup_type} • {latestBackup.status}</p>
                        </div>
                        <Button onClick={() => void handleRestoreBackup(latestBackup.id)} className="bg-amber-600 text-white hover:bg-amber-500">Restore</Button>
                      </div>
                    </div>
                  ) : null}
                  <div className="mt-4 space-y-2">
                    {detail.versions.slice(0, 6).map((version) => (
                      <div key={version.id} className="rounded-xl border p-3" style={{ borderColor: COLORS.border, background: COLORS.panelMuted }}>
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium">{version.version_label}</p>
                          <Badge variant="outline" className="border-white/10 text-white/80">rollback {String(version.rollback_available)}</Badge>
                        </div>
                        <p className="mt-1 text-sm" style={{ color: COLORS.textMuted }}>{version.change_summary || 'Version recorded'}</p>
                      </div>
                    ))}
                  </div>
                </Panel>

                <Panel title="Monitoring + History" icon={Activity}>
                  <div className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <MiniTile title="Memory Entries" value={String(detail.memoryEntries.length)} />
                      <MiniTile title="Last Command" value={dashboard?.memoryContext?.lastCommandText || 'none'} />
                    </div>
                    {recentProjectMemory.map((entry) => (
                      <div key={entry.id} className="rounded-xl border p-3" style={{ borderColor: COLORS.border, background: COLORS.panelMuted }}>
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium">{entry.summary || entry.memory_type}</p>
                          <Badge variant="outline" className="border-white/10 text-white/80">{entry.memory_scope} • {entry.memory_type}</Badge>
                        </div>
                        <p className="mt-1 text-xs" style={{ color: COLORS.textMuted }}>{new Date(entry.updated_at).toLocaleString()}</p>
                      </div>
                    ))}
                    {detail.runtimeLogs.slice(0, 12).map((log) => (
                      <div key={log.id} className="rounded-xl border p-3" style={{ borderColor: COLORS.border, background: COLORS.panelMuted }}>
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium">{log.message}</p>
                          <Badge variant="outline" className="border-white/10 text-white/80">{log.log_type}</Badge>
                        </div>
                        <p className="mt-1 text-xs" style={{ color: log.severity === 'error' ? '#fca5a5' : COLORS.textMuted }}>{log.severity} • {new Date(log.created_at).toLocaleString()}</p>
                      </div>
                    ))}
                    {!detail.runtimeLogs.length && !recentProjectMemory.length ? <EmptyState text="No runtime logs or memory history yet." /> : null}
                  </div>
                </Panel>
              </div>
            </>
          ) : null}

          {!loading && !detail ? <EmptyState text="Create a project to activate the unified AI APK factory workflow." /> : null}
        </main>
      </div>
    </div>
  );
};

function Panel({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border p-4" style={{ borderColor: COLORS.border, background: COLORS.panel }}>
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5" style={{ color: '#7dd3fc' }} />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: COLORS.border, background: COLORS.panel }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm" style={{ color: COLORS.textMuted }}>{label}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
        <Icon className="h-8 w-8" style={{ color: '#7dd3fc' }} />
      </div>
    </div>
  );
}

function MiniTile({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border p-3" style={{ borderColor: COLORS.border, background: COLORS.panelMuted }}>
      <p className="text-xs uppercase tracking-wide" style={{ color: COLORS.textMuted }}>{title}</p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}

function QuickButton({ label, icon: Icon, onClick }: { label: string; icon: React.ElementType; onClick: () => void }) {
  return (
    <Button variant="outline" onClick={onClick} className="justify-start gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10">
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed p-8 text-center text-sm" style={{ borderColor: COLORS.border, color: COLORS.textMuted }}>
      {text}
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-3 rounded-xl border p-4" style={{ borderColor: COLORS.border, background: COLORS.panelMuted }}>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm break-all" style={{ color: COLORS.textMuted }}>{body}</p>
    </div>
  );
}

export default ValaAICommandCenter;