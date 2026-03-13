/**
 * FULL DEPLOYMENT ORCHESTRATOR
 * Master orchestrator connecting Marketplace → Product Manager → Server Manager → Client.
 *
 * Flow:
 *   OrderToProductManagerBridge
 *     → ProductManagerOrderWorkflow
 *     → ProductManagerToServerManagerBridge
 *     → ServerManagerDeploymentExecutor
 *     → PostDeploymentService
 */

import { orderToProductManagerBridge } from '../services/OrderToProductManagerBridge';
import { productManagerOrderWorkflow } from '../services/ProductManagerOrderWorkflow';
import { productManagerToServerManagerBridge } from '../services/ProductManagerToServerManagerBridge';
import { serverManagerDeploymentExecutor } from '../services/ServerManagerDeploymentExecutor';
import { postDeploymentService } from '../services/PostDeploymentService';
import type { OrderPayload } from '../services/OrderToProductManagerBridge';

class FullDeploymentOrchestrator {
  private static instance: FullDeploymentOrchestrator;
  private initialized = false;

  static getInstance(): FullDeploymentOrchestrator {
    if (!FullDeploymentOrchestrator.instance) {
      FullDeploymentOrchestrator.instance = new FullDeploymentOrchestrator();
    }
    return FullDeploymentOrchestrator.instance;
  }

  /**
   * Wire up the complete pipeline. Call once at application startup.
   */
  initialize(): void {
    if (this.initialized) return;

    // Bridge 1: Order → Product Manager
    orderToProductManagerBridge.onOrderConfirmed(async (order: OrderPayload) => {
      await this.runPipeline(order);
    });

    // Bridge 2: Product Manager → Server Manager
    productManagerToServerManagerBridge.onDeploymentPackageReceived(async (input) => {
      const deploymentResult = await serverManagerDeploymentExecutor.execute(input);
      await postDeploymentService.run(deploymentResult);
    });

    this.initialized = true;
    console.log('[FullDeploymentOrchestrator] Pipeline initialized');
  }

  /**
   * Run the complete pipeline for an order.
   * Can be called directly for testing or manual triggering.
   */
  async runPipeline(order: OrderPayload): Promise<void> {
    try {
      console.log(`[FullDeploymentOrchestrator] Starting pipeline for order ${order.order_id}`);

      // Step 1: Product Manager processing
      const deploymentPackage = await productManagerOrderWorkflow.process(order);

      // Step 2: Forward to Server Manager
      await productManagerToServerManagerBridge.forwardDeploymentPackage(deploymentPackage);

      console.log(
        `[FullDeploymentOrchestrator] Pipeline completed for order ${order.order_id}`
      );
    } catch (error) {
      console.error(
        `[FullDeploymentOrchestrator] Pipeline failed for order ${order.order_id}:`,
        error
      );
      throw error;
    }
  }
}

export const fullDeploymentOrchestrator = FullDeploymentOrchestrator.getInstance();
export default FullDeploymentOrchestrator;
