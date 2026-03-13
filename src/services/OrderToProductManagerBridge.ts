/**
 * ORDER TO PRODUCT MANAGER BRIDGE
 * Listens for order confirmation events and triggers the Product Manager scan workflow.
 */

import { integrationActivityLogger } from './IntegrationActivityLogger';

export interface OrderPayload {
  order_id: string;
  product_id: string;
  repository_path: string;
  license_type: string;
  client_domain: string;
  hosting_credentials: Record<string, unknown>;
  customer_email: string;
  customer_id?: string;
}

export interface OrderConfirmationEvent {
  type: 'ORDER_CONFIRMED';
  payload: OrderPayload;
}

type OrderEventHandler = (payload: OrderPayload) => Promise<void>;

class OrderToProductManagerBridge {
  private static instance: OrderToProductManagerBridge;
  private handlers: Set<OrderEventHandler> = new Set();

  static getInstance(): OrderToProductManagerBridge {
    if (!OrderToProductManagerBridge.instance) {
      OrderToProductManagerBridge.instance = new OrderToProductManagerBridge();
    }
    return OrderToProductManagerBridge.instance;
  }

  /**
   * Register a handler that will be called when an order confirmation is received.
   * Returns an unsubscribe function.
   */
  onOrderConfirmed(handler: OrderEventHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  /**
   * Called by MarketplaceService when an order is confirmed and payment is verified.
   */
  async handleOrderConfirmation(event: OrderConfirmationEvent): Promise<void> {
    if (event.type !== 'ORDER_CONFIRMED') return;

    const payload = event.payload;
    console.log(`[OrderToProductManagerBridge] Order received: ${payload.order_id}`);

    await integrationActivityLogger.log({
      event: 'order_received',
      order_id: payload.order_id,
      metadata: {
        product_id: payload.product_id,
        customer_email: payload.customer_email,
        license_type: payload.license_type,
        client_domain: payload.client_domain,
      },
    });

    // Notify all registered handlers (e.g. ProductManagerOrderWorkflow)
    for (const handler of this.handlers) {
      try {
        await handler(payload);
      } catch (error) {
        console.error(
          `[OrderToProductManagerBridge] Handler failed for order ${payload.order_id}:`,
          error
        );
      }
    }
  }
}

export const orderToProductManagerBridge = OrderToProductManagerBridge.getInstance();
export default OrderToProductManagerBridge;
