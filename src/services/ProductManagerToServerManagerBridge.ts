/**
 * PRODUCT MANAGER TO SERVER MANAGER BRIDGE
 * Receives a deployment package from the Product Manager workflow and
 * forwards it to the ServerManagerDeploymentExecutor.
 */

import { integrationActivityLogger } from './IntegrationActivityLogger';
import type { DeploymentPackage } from './ProductManagerOrderWorkflow';

export interface ServerManagerDeploymentInput {
  deployment_package_id: string;
  container_build_config: Record<string, unknown>;
  client_domain: string;
  ssl_required: true;
  docker_image_config: Record<string, unknown>;
  environment_variables: Record<string, string>;
  resource_limits: {
    cpu: string;
    memory: string;
  };
  health_check_config: {
    path: string;
    interval_seconds: number;
    timeout_seconds: number;
  };
  order_id: string;
  product_id: string;
  customer_email: string;
  customer_id?: string;
  license_type: string;
}

type DeploymentHandler = (input: ServerManagerDeploymentInput) => Promise<void>;

class ProductManagerToServerManagerBridge {
  private static instance: ProductManagerToServerManagerBridge;
  private handlers: Set<DeploymentHandler> = new Set();

  static getInstance(): ProductManagerToServerManagerBridge {
    if (!ProductManagerToServerManagerBridge.instance) {
      ProductManagerToServerManagerBridge.instance =
        new ProductManagerToServerManagerBridge();
    }
    return ProductManagerToServerManagerBridge.instance;
  }

  /**
   * Register a handler that will be called when a deployment package is ready.
   * Returns an unsubscribe function.
   */
  onDeploymentPackageReceived(handler: DeploymentHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  /**
   * Receive a deployment package from the Product Manager and forward to Server Manager.
   */
  async forwardDeploymentPackage(deploymentPackage: DeploymentPackage): Promise<void> {
    const input = this.buildServerManagerInput(deploymentPackage);

    console.log(
      `[ProductManagerToServerManagerBridge] deployment_package_sent: ${input.deployment_package_id}`
    );

    await integrationActivityLogger.log({
      event: 'deployment_sent_to_server_manager',
      order_id: deploymentPackage.order_id,
      metadata: { package_id: input.deployment_package_id },
    });

    for (const handler of this.handlers) {
      try {
        await handler(input);
      } catch (error) {
        console.error(
          `[ProductManagerToServerManagerBridge] Handler failed for package ${input.deployment_package_id}:`,
          error
        );
      }
    }
  }

  private buildServerManagerInput(pkg: DeploymentPackage): ServerManagerDeploymentInput {
    return {
      deployment_package_id: pkg.deployment_package_id,
      container_build_config: {
        framework_type: pkg.framework_type,
        build_script: pkg.build_script,
        container_ports: pkg.container_ports,
      },
      client_domain: pkg.client_domain,
      ssl_required: true,
      docker_image_config: pkg.docker_config,
      environment_variables: pkg.env_variables,
      resource_limits: {
        cpu: '500m',
        memory: '512Mi',
      },
      health_check_config: {
        path: '/health',
        interval_seconds: 30,
        timeout_seconds: 5,
      },
      order_id: pkg.order_id,
      product_id: pkg.product_id,
      customer_email: pkg.customer_email,
      customer_id: pkg.customer_id,
      license_type: pkg.license_type,
    };
  }
}

export const productManagerToServerManagerBridge =
  ProductManagerToServerManagerBridge.getInstance();
export default ProductManagerToServerManagerBridge;
