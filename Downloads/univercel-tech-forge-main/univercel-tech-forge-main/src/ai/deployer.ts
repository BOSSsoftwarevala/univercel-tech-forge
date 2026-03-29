export interface DeploymentTargetPlan {
  provider: 'vercel' | 'local' | 'apk';
  output: 'live_url' | 'local_server' | 'apk_file';
  steps: string[];
}

export function generateDeploymentPlan(targetPlatform: 'web' | 'apk' | 'pwa' | 'local') {
  if (targetPlatform === 'apk') {
    return {
      provider: 'apk',
      output: 'apk_file',
      steps: ['bundle_mobile_ui', 'compile_android_build', 'sign_artifact', 'publish_download'],
    } satisfies DeploymentTargetPlan;
  }

  if (targetPlatform === 'local') {
    return {
      provider: 'local',
      output: 'local_server',
      steps: ['build_project', 'assign_local_runtime', 'boot_server', 'verify_health'],
    } satisfies DeploymentTargetPlan;
  }

  return {
    provider: 'vercel',
    output: 'live_url',
    steps: ['build_project', 'push_artifacts', 'assign_domain', 'verify_live_url'],
  } satisfies DeploymentTargetPlan;
}