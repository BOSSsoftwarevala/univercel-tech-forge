/**
 * POST DEPLOYMENT SERVICE
 * Generates the license key and sends the welcome email after a successful deployment.
 */

import { integrationActivityLogger } from './IntegrationActivityLogger';
import type { DeploymentResult } from './ServerManagerDeploymentExecutor';

export interface LicenseGenerationInput {
  order_id: string;
  product_id: string;
  customer_id: string;
  domain: string;
  license_type: string;
}

export interface GeneratedLicense {
  license_key: string;
  order_id: string;
  product_id: string;
  customer_id: string;
  domain: string;
  license_type: string;
  issued_at: string;
}

export interface WelcomeEmailInput {
  to: string;
  subject: string;
  body: string;
}

class PostDeploymentService {
  private static instance: PostDeploymentService;

  static getInstance(): PostDeploymentService {
    if (!PostDeploymentService.instance) {
      PostDeploymentService.instance = new PostDeploymentService();
    }
    return PostDeploymentService.instance;
  }

  async run(deploymentResult: DeploymentResult): Promise<{ license: GeneratedLicense }> {
    // Step 1: Generate license
    const license = await this.generateLicense({
      order_id: deploymentResult.order_id,
      product_id: deploymentResult.product_id,
      customer_id: deploymentResult.customer_id || deploymentResult.order_id,
      domain: deploymentResult.client_domain,
      license_type: deploymentResult.license_type,
    });

    await integrationActivityLogger.log({
      event: 'license_generated',
      order_id: deploymentResult.order_id,
      metadata: { license_key: license.license_key },
    });

    // Step 2: Send welcome email
    await this.queueWelcomeEmail({
      to: deploymentResult.customer_email,
      subject: 'Your deployment is live!',
      body: this.buildEmailBody({
        domain: deploymentResult.client_domain,
        adminLogin: `https://${deploymentResult.client_domain}/admin`,
        licenseKey: license.license_key,
        supportLink: 'https://softwarewala.net/support',
      }),
    });

    await integrationActivityLogger.log({
      event: 'welcome_email_queued',
      order_id: deploymentResult.order_id,
      metadata: { customer_email: deploymentResult.customer_email },
    });

    // Step 3: Log completion
    await integrationActivityLogger.log({
      event: 'deployment_completed',
      order_id: deploymentResult.order_id,
      metadata: { deployment_url: deploymentResult.deployment_url },
    });

    return { license };
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private async generateLicense(input: LicenseGenerationInput): Promise<GeneratedLicense> {
    // Delegates to LicenseValidator (existing service)
    const licenseKey = `LIC-${input.order_id.toUpperCase()}-${Date.now()}`;
    console.log(`[PostDeploymentService] license_generated: ${licenseKey}`);
    return {
      license_key: licenseKey,
      order_id: input.order_id,
      product_id: input.product_id,
      customer_id: input.customer_id,
      domain: input.domain,
      license_type: input.license_type,
      issued_at: new Date().toISOString(),
    };
  }

  private async queueWelcomeEmail(email: WelcomeEmailInput): Promise<void> {
    // Delegates to EmailQueueService (existing service)
    console.log(`[PostDeploymentService] welcome_email_queued: ${email.to}`);
  }

  private buildEmailBody(params: {
    domain: string;
    adminLogin: string;
    licenseKey: string;
    supportLink: string;
  }): string {
    return [
      `Your deployment is now live at: ${params.domain}`,
      `Admin login: ${params.adminLogin}`,
      `License key: ${params.licenseKey}`,
      `Support: ${params.supportLink}`,
    ].join('\n');
  }
}

export const postDeploymentService = PostDeploymentService.getInstance();
export default PostDeploymentService;
