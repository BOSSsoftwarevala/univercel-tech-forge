import { callEdgeRoute } from '@/lib/api/edge-client';

export interface FactoryProject {
  id: string;
  owner_user_id: string;
  project_name: string;
  project_slug: string;
  prompt: string;
  input_source: 'prompt' | 'template' | 'clone' | 'github_import' | 'workspace_import' | 'zip_import' | 'multi_file_import';
  template_key?: string | null;
  cloned_from_project_id?: string | null;
  raw_input_saved: Record<string, unknown>;
  project_blueprint: Record<string, unknown>;
  project_type: string;
  status: string;
  pipeline_status: string;
  current_stage: string;
  approval_status: string;
  stable: boolean;
  theme_lock: string;
  auth_config: Record<string, unknown>;
  payment_config: Record<string, unknown>;
  scaling_config: Record<string, unknown>;
  backup_config: Record<string, unknown>;
  monitoring_config: Record<string, unknown>;
  stack_frontend: string[];
  stack_backend: string[];
  stack_database: string[];
  architecture: Record<string, unknown>;
  schema_plan: Array<Record<string, unknown>>;
  api_plan: Array<Record<string, unknown>>;
  ui_plan: Array<Record<string, unknown>>;
  feature_matrix: Record<string, unknown>;
  integrations: Array<Record<string, unknown>>;
  preview_state: Record<string, unknown>;
  deployment_state: Record<string, unknown>;
  product_state: Record<string, unknown>;
  current_run_id?: string | null;
  active_errors: number;
  auto_fix_enabled: boolean;
  is_live_preview_ready: boolean;
  is_realtime_enabled: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface FactoryRun {
  id: string;
  project_id: string;
  requested_by: string;
  trigger_type: string;
  status: string;
  summary?: string | null;
  build_output: Record<string, unknown>;
  started_at: string;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FactoryProjectInput {
  id: string;
  project_id: string;
  source_type: 'prompt' | 'template' | 'clone' | 'github_import' | 'workspace_import' | 'zip_import' | 'multi_file_import';
  template_key?: string | null;
  clone_project_id?: string | null;
  raw_input_saved: Record<string, unknown>;
  created_by: string;
  created_at: string;
}

export interface FactoryBlueprintRecord {
  id: string;
  project_id: string;
  understanding: Record<string, unknown>;
  requirement_breakdown: Array<Record<string, unknown>>;
  feature_mapping: Array<Record<string, unknown>>;
  role_detection: Array<Record<string, unknown>>;
  business_logic: Array<Record<string, unknown>>;
  blueprint_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface FactoryModule {
  id: string;
  project_id: string;
  module_key: string;
  module_name: string;
  module_type: 'core' | 'optional' | 'role_based';
  status: string;
  source: string;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface FactoryApiSpec {
  id: string;
  project_id: string;
  spec_type: 'auth' | 'crud' | 'payment' | 'admin' | 'system';
  route_path: string;
  http_method: string;
  auth_required: boolean;
  rate_limited: boolean;
  validation_schema: Record<string, unknown>;
  spec_json: Record<string, unknown>;
}

export interface FactoryDbSpec {
  id: string;
  project_id: string;
  table_name: string;
  columns_json: Array<Record<string, unknown>>;
  relations_json: Array<Record<string, unknown>>;
  indexes_json: Array<Record<string, unknown>>;
  audit_logs_enabled: boolean;
}

export interface FactoryFlowSpec {
  id: string;
  project_id: string;
  flow_name: string;
  routes_json: Array<Record<string, unknown>>;
  state_logic: Record<string, unknown>;
  role_access: Record<string, unknown>;
}

export interface FactoryMobileBuild {
  id: string;
  project_id: string;
  run_id?: string | null;
  build_type: 'apk-debug' | 'apk-release' | 'aab' | 'pwa';
  status: string;
  version_code: number;
  version_name: string;
  signing_status: string;
  artifact_url?: string | null;
  output_metadata: Record<string, unknown>;
  stable: boolean;
  created_at: string;
  updated_at: string;
}

export interface FactoryTestRun {
  id: string;
  project_id: string;
  run_id?: string | null;
  suite_name: 'login' | 'api' | 'database' | 'flows' | 'crash' | 'full_regression';
  status: string;
  summary: Record<string, unknown>;
  failure_logs: Array<Record<string, unknown>>;
  stable: boolean;
  created_at: string;
  updated_at: string;
}

export interface FactoryApproval {
  id: string;
  project_id: string;
  stage_name: 'developer' | 'qa' | 'admin' | 'deploy';
  status: string;
  actor_user_id?: string | null;
  note?: string | null;
  override_used: boolean;
  created_at: string;
  updated_at: string;
}

export interface FactoryPipelineControl {
  id: string;
  project_id: string;
  status: string;
  last_action: string;
  auto_fix_enabled: boolean;
  stable: boolean;
  retry_count: number;
  last_error?: string | null;
  control_metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface FactoryRuntimeLog {
  id: string;
  project_id: string;
  run_id?: string | null;
  log_type: string;
  severity: string;
  message: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface FactoryReport {
  id: string;
  project_id: string;
  report_type: 'usage' | 'success_rate' | 'failure_logs' | 'export';
  report_json: Record<string, unknown>;
  export_url?: string | null;
  created_at: string;
}

export interface FactoryVersion {
  id: string;
  project_id: string;
  source_run_id?: string | null;
  version_label: string;
  change_summary?: string | null;
  rollback_available: boolean;
  version_metadata: Record<string, unknown>;
  created_at: string;
}

export interface FactoryBackup {
  id: string;
  project_id: string;
  backup_type: 'database' | 'artifacts' | 'full';
  status: string;
  storage_ref?: string | null;
  snapshot_json: Record<string, unknown>;
  restored_at?: string | null;
  created_at: string;
}

export interface FactoryLicense {
  id: string;
  project_id: string;
  deployment_id?: string | null;
  product_id?: string | null;
  license_key: string;
  domain_lock?: string | null;
  expires_at?: string | null;
  abuse_count: number;
  status: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface FactoryAgentTask {
  id: string;
  project_id: string;
  run_id?: string | null;
  agent_name: string;
  responsibility: string;
  status: string;
  progress: number;
  result_summary?: string | null;
  output: Record<string, unknown>;
  error_message?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FactoryArtifact {
  id: string;
  project_id: string;
  run_id?: string | null;
  artifact_type: string;
  file_path: string;
  language: string;
  status: string;
  content: string;
  checksum?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FactoryWorkspaceFile {
  id: string;
  project_id: string;
  run_id?: string | null;
  file_path: string;
  file_name: string;
  file_ext?: string | null;
  mime_type?: string | null;
  language: string;
  size_bytes: number;
  content_excerpt?: string | null;
  content_text?: string | null;
  is_binary: boolean;
  is_truncated: boolean;
  checksum?: string | null;
  import_source: 'zip' | 'multi_file' | 'github' | 'workspace';
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface FactoryWorkspaceIssue {
  id: string;
  project_id: string;
  run_id?: string | null;
  issue_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'fixed' | 'ignored' | 'retrying' | 'manual_review';
  title: string;
  description?: string | null;
  file_path?: string | null;
  line_hint?: number | null;
  fix_command?: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface FactoryMemoryEntry {
  id: string;
  key: string;
  user_id?: string | null;
  project_id?: string | null;
  memory_scope: 'user' | 'project' | 'action' | 'conversation' | 'system';
  memory_type: string;
  memory_key?: string | null;
  summary?: string | null;
  value: Record<string, unknown>;
  last_used_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FactoryMemoryContext {
  lastProjectId?: string | null;
  lastProjectName?: string | null;
  lastCommandText?: string | null;
  lastPromptText?: string | null;
  preferredLanguage?: string | null;
  updatedAt?: string | null;
}

export interface FactoryTranslation {
  id: string;
  user_id?: string | null;
  project_id?: string | null;
  source_language: string;
  target_language: string;
  original_text: string;
  translated_text: string;
  provider?: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface FactoryGlobalBuild {
  id: string;
  project_id: string;
  run_id?: string | null;
  type: 'web' | 'apk';
  status: string;
  download_url?: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface FactoryDeployment {
  id: string;
  project_id: string;
  run_id?: string | null;
  requested_by: string;
  provider: string;
  deployment_target: string;
  deployment_status: string;
  preview_url?: string | null;
  live_url?: string | null;
  domain?: string | null;
  ssl_status: string;
  deployment_logs: Array<{ timestamp: string; message: string }>;
  deployed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FactoryProduct {
  id: string;
  project_id: string;
  deployment_id?: string | null;
  owner_user_id: string;
  product_name: string;
  billing_model: string;
  sale_status: string;
  product_status: 'active' | 'in_development' | 'deployed' | 'locked' | 'archived';
  product_config: Record<string, unknown>;
  hero_summary?: string | null;
  home_category?: string | null;
  feature_binding: Array<Record<string, unknown>>;
  assigned_server_id?: string | null;
  env_type: 'dev' | 'staging' | 'production';
  assigned_client_id?: string | null;
  pricing: { amount: number; currency: string };
  license_key: string;
  sales_page_url?: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface FactoryProductAccess {
  id: string;
  product_id: string;
  module_id?: string | null;
  role: string;
  allowed: boolean;
  permissions: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface FactoryDeployLog {
  id: string;
  product_id: string;
  deployment_id?: string | null;
  status: string;
  error?: string | null;
  message: string;
  env_type: 'dev' | 'staging' | 'production';
  created_at: string;
}

export interface FactoryPipelineLog {
  id: string;
  project_id: string;
  run_id?: string | null;
  step: string;
  status: string;
  error?: string | null;
  detail: Record<string, unknown>;
  created_at: string;
}

export interface FactoryApprovalRequest {
  id: string;
  project_id: string;
  product_id?: string | null;
  request_type: 'deployment' | 'version' | 'module';
  target_id?: string | null;
  stage_name: 'developer' | 'qa' | 'admin' | 'deploy';
  status: 'pending' | 'approved' | 'rejected' | 'override';
  note?: string | null;
  requested_by?: string | null;
  actor_user_id?: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface FactorySystemStatus {
  systemVersion: string;
  health: 'healthy' | 'warning' | 'critical';
  uptime: string;
  errors: number;
  latestDeployment: Pick<FactoryDeployment, 'deployment_status' | 'updated_at'> | null;
  latestBuild: Pick<FactoryMobileBuild, 'status' | 'updated_at'> | null;
  latestTest: Pick<FactoryTestRun, 'status' | 'updated_at'> | null;
}

export interface FactoryServer {
  id: string;
  server_name: string;
  region: string;
  status: 'online' | 'maintenance' | 'offline';
  server_metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface FactoryGitHubAccount {
  id: string;
  owner_user_id: string;
  username: string;
  account_type: 'personal' | 'organization';
  token_hint?: string | null;
  status: 'connected' | 'invalid' | 'revoked';
  connected_at: string;
  last_synced_at?: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface FactoryGitHubRepo {
  id: string;
  account_id: string;
  owner_user_id: string;
  product_id?: string | null;
  project_id?: string | null;
  name: string;
  full_name: string;
  repo_url: string;
  tech_stack: string;
  branch: string;
  last_commit?: string | null;
  size: number;
  import_status: 'imported' | 'synced' | 'failed' | 'archived';
  repo_metadata: Record<string, unknown>;
  synced_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FactoryProductIssue {
  id: string;
  product_id: string;
  project_id: string;
  issue_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'fixed' | 'retrying' | 'manual_review';
  title: string;
  details: Record<string, unknown>;
  retry_count: number;
  last_attempted_provider?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FactoryAILog {
  id: string;
  product_id?: string | null;
  project_id?: string | null;
  ai_api_id?: string | null;
  action: string;
  file_changed?: string | null;
  status: 'queued' | 'completed' | 'failed' | 'skipped';
  error?: string | null;
  log_json: Record<string, unknown>;
  created_at: string;
}

export interface FactoryCodeLibraryItem {
  id: string;
  owner_user_id: string;
  name: string;
  category: string;
  tech_stack: string;
  features: unknown[];
  repo_url?: string | null;
  file_path?: string | null;
  usage_count: number;
  success_rate: number;
  is_template: boolean;
  read_only: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  similarity_score?: number;
}

export interface FactoryDevStudioState {
  product: FactoryProduct;
  project: FactoryProjectDetail;
  issues: FactoryProductIssue[];
  ai_logs: FactoryAILog[];
  code_matches: Array<{ id: string; similarity_score: number; recommendation_rank: number; code_library: FactoryCodeLibraryItem }>;
}

export interface FactoryProductManagerCeoSummary {
  totals: {
    products: number;
    deployed: number;
    critical_issues: number;
    pending_syncs: number;
    ai_cost: number;
    ai_tokens: number;
    online_servers: number;
  };
  recent_syncs: Array<{ id: string; status: string; created_at: string }>;
  active_issues: Array<{ id: string; severity: string; status: string }>;
}

export interface FactoryDashboard {
  totals: {
    projects: number;
    building: number;
    ready: number;
    activeErrors: number;
    runs: number;
    deployments: number;
    products: number;
    mobileBuilds: number;
    tests: number;
    approvalsPending: number;
  };
  recentProjects: Array<Pick<FactoryProject, 'id' | 'project_name' | 'status' | 'updated_at' | 'active_errors'>>;
  recentCommands: Array<{
    id: string;
    command_text: string;
    normalized_action: string;
    status: string;
    created_at: string;
  }>;
  recentMemory: FactoryMemoryEntry[];
  memoryContext: FactoryMemoryContext;
}

export interface FactoryProjectDetail {
  project: FactoryProject;
  inputs: FactoryProjectInput[];
  blueprint: FactoryBlueprintRecord | null;
  modules: FactoryModule[];
  apiSpecs: FactoryApiSpec[];
  dbSpecs: FactoryDbSpec[];
  flowSpecs: FactoryFlowSpec[];
  runs: FactoryRun[];
  tasks: FactoryAgentTask[];
  artifacts: FactoryArtifact[];
  mobileBuilds: FactoryMobileBuild[];
  testRuns: FactoryTestRun[];
  approvals: FactoryApproval[];
  pipelineControl: FactoryPipelineControl | null;
  runtimeLogs: FactoryRuntimeLog[];
  reports: FactoryReport[];
  versions: FactoryVersion[];
  backups: FactoryBackup[];
  licenses: FactoryLicense[];
  deployments: FactoryDeployment[];
  products: FactoryProduct[];
  workspaceFiles: FactoryWorkspaceFile[];
  workspaceIssues: FactoryWorkspaceIssue[];
  memoryEntries: FactoryMemoryEntry[];
  commands: Array<{
    id: string;
    command_text: string;
    normalized_action: string;
    status: string;
    output?: string | null;
    created_at: string;
  }>;
}

export interface FactoryWorkspaceImportFile {
  path: string;
  name?: string;
  size_bytes?: number;
  mime_type?: string;
  content?: string;
  content_excerpt?: string;
  truncated?: boolean;
  sha256?: string;
  metadata?: Record<string, unknown>;
}

export interface FactoryWorkspaceImportResponse {
  project: FactoryProject;
  run: FactoryRun;
  blueprint: Record<string, unknown>;
  analysis: {
    techStack: string;
    projectType: string;
    summary: string;
    routes: Array<Record<string, unknown>>;
    buttons: Array<Record<string, unknown>>;
    apis: Array<Record<string, unknown>>;
    dbTables: Array<Record<string, unknown>>;
    missingFeatures: string[];
    brokenFlows: string[];
    issues: FactoryWorkspaceIssue[];
    dependencyMap: Record<string, string[]>;
  };
  indexed_files: number;
}

export async function getFactoryDashboard() {
  return callEdgeRoute<FactoryDashboard>('api-vala-factory', 'dashboard');
}

export async function listFactoryProjects() {
  return callEdgeRoute<{ items: FactoryProject[] }>('api-vala-factory', 'projects');
}

export async function buildFactoryProject(payload: { prompt: string; project_name?: string; project_type?: string }) {
  return callEdgeRoute<{ project: FactoryProject; run: FactoryRun; blueprint: Record<string, unknown>; artifacts: FactoryArtifact[] }>('api-vala-factory', 'projects/build', {
    method: 'POST',
    body: payload,
  });
}

export async function createUnifiedFactoryProject(payload: {
  prompt?: string;
  project_name?: string;
  project_type?: string;
  source_type: 'prompt' | 'template' | 'clone';
  template_key?: string;
  clone_project_id?: string;
  target_platform?: 'apk' | 'aab' | 'pwa' | 'web';
  build_type?: 'apk-debug' | 'apk-release' | 'aab' | 'pwa';
}) {
  return callEdgeRoute<{ project: FactoryProject; run: FactoryRun; blueprint: Record<string, unknown>; artifacts: FactoryArtifact[] }>('api-vala-factory', 'projects/build', {
    method: 'POST',
    body: payload,
  });
}

export async function importFactoryWorkspace(payload: {
  project_name: string;
  import_mode: 'zip' | 'multi_file' | 'github';
  repo_url?: string;
  files?: FactoryWorkspaceImportFile[];
}) {
  return callEdgeRoute<FactoryWorkspaceImportResponse>('api-vala-factory', 'workspace/import', {
    method: 'POST',
    body: payload,
  });
}

export async function getFactoryProject(projectId: string) {
  return callEdgeRoute<FactoryProjectDetail>('api-vala-factory', `projects/${projectId}`);
}

export async function listFactoryMemory(params?: {
  projectId?: string;
  scope?: Array<FactoryMemoryEntry['memory_scope']>;
  type?: string[];
  limit?: number;
}) {
  return callEdgeRoute<{ items: FactoryMemoryEntry[]; context: FactoryMemoryContext }>('api-vala-factory', 'memory', {
    query: {
      ...(params?.projectId ? { project_id: params.projectId } : {}),
      ...(params?.scope?.length ? { scope: params.scope.join(',') } : {}),
      ...(params?.type?.length ? { type: params.type.join(',') } : {}),
      ...(params?.limit ? { limit: String(params.limit) } : {}),
    },
  });
}

export async function saveFactoryMemory(payload: {
  memory_scope: FactoryMemoryEntry['memory_scope'];
  memory_type: string;
  memory_key?: string;
  project_id?: string;
  summary?: string;
  value?: Record<string, unknown>;
  mode?: 'upsert' | 'insert';
}) {
  return callEdgeRoute<{ item: FactoryMemoryEntry }>('api-vala-factory', 'memory', {
    method: 'POST',
    body: payload,
  });
}

export async function translateFactoryText(payload: {
  text: string;
  target_language: string;
  source_language?: string;
  project_id?: string;
}) {
  return callEdgeRoute<{ item: FactoryTranslation; detected_language: string; translated_text: string; target_language: string; provider: string }>('api-vala-factory', 'translate', {
    method: 'POST',
    body: payload,
  });
}

export async function listFactoryTranslations(params?: { projectId?: string; language?: string; limit?: number }) {
  return callEdgeRoute<{ items: FactoryTranslation[] }>('api-vala-factory', 'translations', {
    query: {
      ...(params?.projectId ? { project_id: params.projectId } : {}),
      ...(params?.language ? { language: params.language } : {}),
      ...(params?.limit ? { limit: String(params.limit) } : {}),
    },
  });
}

export async function listFactoryBuilds(params?: { projectId?: string; type?: FactoryGlobalBuild['type']; limit?: number }) {
  return callEdgeRoute<{ items: FactoryGlobalBuild[] }>('api-vala-factory', 'builds', {
    query: {
      ...(params?.projectId ? { project_id: params.projectId } : {}),
      ...(params?.type ? { type: params.type } : {}),
      ...(params?.limit ? { limit: String(params.limit) } : {}),
    },
  });
}

export async function runFactoryCommand(projectId: string, commandText: string) {
  return callEdgeRoute<{ run: FactoryRun; action: string; output: string }>('api-vala-factory', `projects/${projectId}/commands`, {
    method: 'POST',
    body: { command_text: commandText },
  });
}

export async function scanFactoryWorkspace(projectId: string) {
  return callEdgeRoute<{ run: FactoryRun; analysis: FactoryWorkspaceImportResponse['analysis']; indexed_files: number }>('api-vala-factory', `projects/${projectId}/workspace/scan`, {
    method: 'POST',
  });
}

export async function controlFactoryPipeline(projectId: string, payload: { action: 'start' | 'pause' | 'stop' | 'retry' | 'force_build' }) {
  return callEdgeRoute<{ pipelineControl: FactoryPipelineControl; run: FactoryRun; output: string }>('api-vala-factory', `projects/${projectId}/pipeline/control`, {
    method: 'POST',
    body: payload,
  });
}

export async function buildFactoryMobile(projectId: string, payload: { build_type: 'apk-debug' | 'apk-release' | 'aab' | 'pwa' }) {
  return callEdgeRoute<{ mobileBuild: FactoryMobileBuild; run: FactoryRun }>('api-vala-factory', `projects/${projectId}/mobile/build`, {
    method: 'POST',
    body: payload,
  });
}

export async function runFactoryTests(projectId: string, payload: { suite_name: 'login' | 'api' | 'database' | 'flows' | 'crash' | 'full_regression' }) {
  return callEdgeRoute<{ testRun: FactoryTestRun; run: FactoryRun }>('api-vala-factory', `projects/${projectId}/tests/run`, {
    method: 'POST',
    body: payload,
  });
}

export async function approveFactoryStage(projectId: string, payload: { stage_name: 'developer' | 'qa' | 'admin' | 'deploy'; decision: 'approved' | 'rejected' | 'override'; note?: string }) {
  return callEdgeRoute<{ approval: FactoryApproval; run: FactoryRun }>('api-vala-factory', `projects/${projectId}/approvals`, {
    method: 'POST',
    body: payload,
  });
}

export async function generateFactoryReport(projectId: string, payload: { report_type: 'usage' | 'success_rate' | 'failure_logs' | 'export' }) {
  return callEdgeRoute<{ report: FactoryReport }>('api-vala-factory', `projects/${projectId}/reports`, {
    method: 'POST',
    body: payload,
  });
}

export async function createFactoryBackup(projectId: string, payload: { backup_type: 'database' | 'artifacts' | 'full' }) {
  return callEdgeRoute<{ backup: FactoryBackup }>('api-vala-factory', `projects/${projectId}/backups`, {
    method: 'POST',
    body: payload,
  });
}

export async function restoreFactoryBackup(projectId: string, backupId: string) {
  return callEdgeRoute<{ backup: FactoryBackup; run: FactoryRun }>('api-vala-factory', `projects/${projectId}/backups/${backupId}/restore`, {
    method: 'POST',
  });
}

export async function updateFactoryArtifact(projectId: string, artifactId: string, content: string) {
  return callEdgeRoute<{ item: FactoryArtifact; run: FactoryRun }>('api-vala-factory', `projects/${projectId}/artifacts/${artifactId}`, {
    method: 'POST',
    body: { content },
  });
}

export async function deployFactoryProject(projectId: string, payload: { provider?: string; target?: string; domain?: string }) {
  return callEdgeRoute<{ deployment: FactoryDeployment; run: FactoryRun }>('api-vala-factory', `projects/${projectId}/deploy`, {
    method: 'POST',
    body: payload,
  });
}

export async function productizeFactoryProject(projectId: string, payload: { product_name?: string; amount?: number; currency?: string; billing_model?: string; sale_status?: string; sales_page_url?: string }) {
  return callEdgeRoute<{ product: FactoryProduct; run: FactoryRun }>('api-vala-factory', `projects/${projectId}/productize`, {
    method: 'POST',
    body: payload,
  });
}

export async function listFactoryProducts(status?: FactoryProduct['product_status']) {
  return callEdgeRoute<{ items: FactoryProduct[] }>('api-vala-factory', 'products', {
    query: status ? { status } : undefined,
  });
}

export async function listFactoryGitHubAccounts() {
  return callEdgeRoute<{ items: FactoryGitHubAccount[] }>('api-vala-factory', 'github/accounts');
}

export async function connectFactoryGitHubAccount(payload: { token: string; username?: string }) {
  return callEdgeRoute<{ account: FactoryGitHubAccount }>('api-vala-factory', 'github/connect', {
    method: 'POST',
    body: payload,
  });
}

export async function listFactoryGitHubRepos(accountId?: string) {
  return callEdgeRoute<{ items: FactoryGitHubRepo[] }>('api-vala-factory', 'github/repos', {
    query: accountId ? { account_id: accountId } : undefined,
  });
}

export async function importAllFactoryGitHubRepos(payload?: { account_id?: string }) {
  return callEdgeRoute<{ sync_run: Record<string, unknown>; repos_processed: number; products_created: number; repos_updated: number }>('api-vala-factory', 'github/import', {
    method: 'POST',
    body: payload || {},
  });
}

export async function syncFactoryGitHubRepos(payload?: { account_id?: string }) {
  return callEdgeRoute<{ sync_run: Record<string, unknown>; repos_processed: number; products_created: number; repos_updated: number }>('api-vala-factory', 'github/sync', {
    method: 'POST',
    body: payload || {},
  });
}

export async function getFactoryProductDetail(productId: string) {
  return callEdgeRoute<{ product: FactoryProduct; project: FactoryProjectDetail }>('api-vala-factory', `products/${productId}`);
}

export async function getFactoryDevStudioState(productId: string) {
  return callEdgeRoute<FactoryDevStudioState>('api-vala-factory', `products/${productId}/devstudio`);
}

export async function saveFactoryDevStudioConfig(productId: string, payload: {
  logo?: string;
  color?: string;
  domain?: string;
  language?: string;
  api_keys?: Record<string, unknown>;
}) {
  return callEdgeRoute<{ product: FactoryProduct }>('api-vala-factory', `products/${productId}/devstudio/config`, {
    method: 'POST',
    body: payload,
  });
}

export async function validateFactoryDevStudio(productId: string) {
  return callEdgeRoute<{ product: FactoryProduct; validation: { ready: boolean; issues: Array<Record<string, unknown>> } }>('api-vala-factory', `products/${productId}/devstudio/validate`, {
    method: 'POST',
  });
}

export async function generateFactoryDevStudioBuild(productId: string) {
  return callEdgeRoute<{ pipelineControl: FactoryPipelineControl; run: FactoryRun; output: string }>('api-vala-factory', `products/${productId}/devstudio/build`, {
    method: 'POST',
  });
}

export async function sendFactoryProductToDeploy(productId: string, payload?: { env_type?: 'dev' | 'staging' | 'production' }) {
  return callEdgeRoute<{ deployment: FactoryDeployment; run: FactoryRun }>('api-vala-factory', `products/${productId}/devstudio/send-to-deploy`, {
    method: 'POST',
    body: payload || {},
  });
}

export async function scanFactoryProductIssues(productId: string) {
  return callEdgeRoute<{ items: FactoryProductIssue[] }>('api-vala-factory', `products/${productId}/issues/scan`, {
    method: 'POST',
  });
}

export async function autoFixFactoryProductIssues(productId: string, payload?: { auto_deploy?: boolean }) {
  return callEdgeRoute<{ fixed: number; remaining: number; deployed: boolean; test_run: FactoryTestRun; deployment?: unknown }>('api-vala-factory', `products/${productId}/issues/auto-fix`, {
    method: 'POST',
    body: payload || {},
  });
}

export async function findFactoryCodeLibraryMatches(productId: string, query?: string) {
  return callEdgeRoute<{ items: FactoryCodeLibraryItem[] }>('api-vala-factory', `products/${productId}/code-library/matches`, {
    query: query ? { q: query } : undefined,
  });
}

export async function getFactoryProductManagerCeoSummary() {
  return callEdgeRoute<FactoryProductManagerCeoSummary>('api-vala-factory', 'ceo/product-manager-summary');
}

export async function listFactoryDeploymentServers() {
  return callEdgeRoute<{ items: FactoryServer[] }>('api-vala-factory', 'deployment/servers');
}

export async function updateFactoryProduct(productId: string, payload: {
  product_status?: FactoryProduct['product_status'];
  product_config?: Record<string, unknown>;
  hero_summary?: string;
  home_category?: string;
  feature_binding?: Array<Record<string, unknown>>;
}) {
  return callEdgeRoute<{ product: FactoryProduct }>('api-vala-factory', `products/${productId}`, {
    method: 'PATCH',
    body: payload,
  });
}

export async function listFactoryProductModules(productId: string, status?: 'core' | 'optional' | 'role_based' | 'locked' | 'disabled') {
  return callEdgeRoute<{ items: FactoryModule[] }>('api-vala-factory', `products/${productId}/modules`, {
    query: status ? { status } : undefined,
  });
}

export async function enableFactoryProductModule(productId: string, moduleId: string) {
  return callEdgeRoute<{ module: FactoryModule }>('api-vala-factory', `products/${productId}/modules/${moduleId}/enable`, {
    method: 'POST',
  });
}

export async function disableFactoryProductModule(productId: string, moduleId: string) {
  return callEdgeRoute<{ module: FactoryModule }>('api-vala-factory', `products/${productId}/modules/${moduleId}/disable`, {
    method: 'POST',
  });
}

export async function lockFactoryProductModule(productId: string, moduleId: string) {
  return callEdgeRoute<{ module: FactoryModule }>('api-vala-factory', `products/${productId}/modules/${moduleId}/lock`, {
    method: 'POST',
  });
}

export async function listFactoryProductAccess(productId: string) {
  return callEdgeRoute<{ items: FactoryProductAccess[] }>('api-vala-factory', `products/${productId}/access`);
}

export async function updateFactoryProductAccess(productId: string, payload: {
  module_id: string;
  role: string;
  allowed: boolean;
  permissions?: Record<string, unknown>;
}) {
  return callEdgeRoute<{ access: FactoryProductAccess }>('api-vala-factory', `products/${productId}/access`, {
    method: 'POST',
    body: payload,
  });
}

export async function getFactorySystemStatus(productId: string) {
  return callEdgeRoute<FactorySystemStatus>('api-vala-factory', `products/${productId}/system-status`);
}

export async function assignFactoryDeploymentServer(productId: string, payload: { server_id: string }) {
  return callEdgeRoute<{ product: FactoryProduct; server: { id: string; server_name: string; region: string; status: string } }>('api-vala-factory', `products/${productId}/deploy/server-assign`, {
    method: 'POST',
    body: payload,
  });
}

export async function setFactoryDeploymentEnvironment(productId: string, payload: { env_type: 'dev' | 'staging' | 'production' }) {
  return callEdgeRoute<{ product: FactoryProduct }>('api-vala-factory', `products/${productId}/deploy/environment`, {
    method: 'POST',
    body: payload,
  });
}

export async function assignFactoryClientDeployment(productId: string, payload: { client_id: string }) {
  return callEdgeRoute<{ product: FactoryProduct }>('api-vala-factory', `products/${productId}/deploy/client`, {
    method: 'POST',
    body: payload,
  });
}

export async function startFactoryDeployment(productId: string) {
  return callEdgeRoute<{ deployment: FactoryDeployment; run: FactoryRun }>('api-vala-factory', `products/${productId}/deploy/start`, {
    method: 'POST',
  });
}

export async function rollbackFactoryDeployment(productId: string) {
  return callEdgeRoute<{ run: FactoryRun; targetVersion?: string | null }>('api-vala-factory', `products/${productId}/deploy/rollback`, {
    method: 'POST',
  });
}

export async function stopFactoryDeployment(productId: string) {
  return callEdgeRoute<{ run: FactoryRun; stopped: boolean }>('api-vala-factory', `products/${productId}/deploy/stop`, {
    method: 'POST',
  });
}

export async function listFactoryDeploymentLogs(productId: string) {
  return callEdgeRoute<{ items: FactoryDeployLog[] }>('api-vala-factory', `products/${productId}/deploy/logs`);
}

export async function listFactoryApprovalRequests(productId: string, type?: 'deployment' | 'version' | 'module') {
  return callEdgeRoute<{ items: FactoryApprovalRequest[] }>('api-vala-factory', `products/${productId}/approvals`, {
    query: type ? { type } : undefined,
  });
}

export async function updateFactoryApprovalRequest(productId: string, payload: {
  request_type: 'deployment' | 'version' | 'module';
  stage_name: 'developer' | 'qa' | 'admin' | 'deploy';
  decision: 'approved' | 'rejected' | 'override';
  target_id?: string;
  note?: string;
}) {
  return callEdgeRoute<{ approval: FactoryApprovalRequest }>('api-vala-factory', `products/${productId}/approvals`, {
    method: 'POST',
    body: payload,
  });
}

export async function listFactoryProductLicenses(productId: string) {
  return callEdgeRoute<{ items: FactoryLicense[] }>('api-vala-factory', `products/${productId}/licenses`);
}

export async function updateFactoryProductLicense(productId: string, payload: {
  action: 'generate' | 'lock' | 'update' | 'expire';
  license_id?: string;
  domain_lock?: string;
  device_id?: string;
  api_key_binding?: string;
  expires_at?: string;
}) {
  return callEdgeRoute<{ license: FactoryLicense }>('api-vala-factory', `products/${productId}/licenses`, {
    method: 'POST',
    body: payload,
  });
}
