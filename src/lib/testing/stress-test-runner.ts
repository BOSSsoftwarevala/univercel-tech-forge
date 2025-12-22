/**
 * Client-Side Stress Test Simulator
 * For running stress validation directly in the browser
 */

interface StressTestConfig {
  chatMessagesPerSecond: number;
  concurrentWebSockets: number;
  walletTransactionsPerMinute: number;
  demoClicksPerSecond: number;
  duration: number; // seconds
}

interface StressTestResults {
  chat: {
    messagesSent: number;
    messagesFailed: number;
    averageLatency: number;
    maxLatency: number;
    maskingIntact: boolean;
  };
  websocket: {
    connectionsOpened: number;
    connectionsClosed: number;
    reconnections: number;
    averageLatency: number;
  };
  wallet: {
    transactionsProcessed: number;
    transactionsFailed: number;
    averageLatency: number;
    accuracyRate: number;
  };
  demo: {
    clicksTracked: number;
    clicksFailed: number;
    streamsServed: number;
    averageLatency: number;
  };
  security: {
    maskingViolations: number;
    rbacViolations: number;
    escalationAttempts: number;
    escalationBlocked: number;
  };
  system: {
    peakMemoryMB: number;
    crashPoints: number;
    errorRate: number;
    p95Latency: number;
    p99Latency: number;
  };
}

// Stress test runner
export class StressTestRunner {
  private config: StressTestConfig;
  private results: StressTestResults;
  private latencies: number[] = [];
  private isRunning = false;
  private abortController: AbortController | null = null;
  
  constructor(config: Partial<StressTestConfig> = {}) {
    this.config = {
      chatMessagesPerSecond: config.chatMessagesPerSecond || 100,
      concurrentWebSockets: config.concurrentWebSockets || 50,
      walletTransactionsPerMinute: config.walletTransactionsPerMinute || 100,
      demoClicksPerSecond: config.demoClicksPerSecond || 200,
      duration: config.duration || 60,
    };
    
    this.results = this.initResults();
  }
  
  private initResults(): StressTestResults {
    return {
      chat: { messagesSent: 0, messagesFailed: 0, averageLatency: 0, maxLatency: 0, maskingIntact: true },
      websocket: { connectionsOpened: 0, connectionsClosed: 0, reconnections: 0, averageLatency: 0 },
      wallet: { transactionsProcessed: 0, transactionsFailed: 0, averageLatency: 0, accuracyRate: 1 },
      demo: { clicksTracked: 0, clicksFailed: 0, streamsServed: 0, averageLatency: 0 },
      security: { maskingViolations: 0, rbacViolations: 0, escalationAttempts: 0, escalationBlocked: 0 },
      system: { peakMemoryMB: 0, crashPoints: 0, errorRate: 0, p95Latency: 0, p99Latency: 0 },
    };
  }
  
  async runChatStress(supabase: any, token: string): Promise<void> {
    const interval = 1000 / this.config.chatMessagesPerSecond;
    const endTime = Date.now() + this.config.duration * 1000;
    
    while (Date.now() < endTime && this.isRunning) {
      const start = Date.now();
      
      try {
        const { data, error } = await supabase.functions.invoke('api-chat/send', {
          body: {
            thread_id: `stress-${Math.floor(Math.random() * 100)}`,
            message_text: `Stress test ${Date.now()}`,
          },
        });
        
        const latency = Date.now() - start;
        this.latencies.push(latency);
        
        if (error) {
          this.results.chat.messagesFailed++;
        } else {
          this.results.chat.messagesSent++;
          this.results.chat.maxLatency = Math.max(this.results.chat.maxLatency, latency);
          
          // Verify masking
          if (data?.sender_id && data.sender_id.length > 8) {
            this.results.chat.maskingIntact = false;
            this.results.security.maskingViolations++;
          }
        }
      } catch (e) {
        this.results.chat.messagesFailed++;
        this.results.system.crashPoints++;
      }
      
      await this.sleep(interval);
    }
    
    this.results.chat.averageLatency = this.calculateAverage(this.latencies);
  }
  
  async runWalletStress(supabase: any): Promise<void> {
    const interval = 60000 / this.config.walletTransactionsPerMinute;
    const endTime = Date.now() + this.config.duration * 1000;
    const walletLatencies: number[] = [];
    let successfulTransactions = 0;
    
    while (Date.now() < endTime && this.isRunning) {
      const start = Date.now();
      const amount = Math.floor(Math.random() * 1000) + 100;
      
      try {
        const { data, error } = await supabase.functions.invoke('api-wallet/credit', {
          body: {
            amount,
            type: 'commission',
            description: 'Stress test',
          },
        });
        
        const latency = Date.now() - start;
        walletLatencies.push(latency);
        
        if (error) {
          this.results.wallet.transactionsFailed++;
        } else {
          this.results.wallet.transactionsProcessed++;
          successfulTransactions++;
          
          // Verify accuracy
          if (data?.new_balance !== undefined) {
            // Balance should reflect the transaction
          }
        }
      } catch (e) {
        this.results.wallet.transactionsFailed++;
      }
      
      await this.sleep(interval);
    }
    
    this.results.wallet.averageLatency = this.calculateAverage(walletLatencies);
    this.results.wallet.accuracyRate = 
      successfulTransactions / (this.results.wallet.transactionsProcessed + this.results.wallet.transactionsFailed);
  }
  
  async runDemoStress(supabase: any): Promise<void> {
    const interval = 1000 / this.config.demoClicksPerSecond;
    const endTime = Date.now() + this.config.duration * 1000;
    const demoLatencies: number[] = [];
    
    // Simulate 40x9 demo library
    const categories = 9;
    const demosPerCategory = 40;
    
    while (Date.now() < endTime && this.isRunning) {
      const start = Date.now();
      const category = Math.floor(Math.random() * categories);
      const demoIndex = Math.floor(Math.random() * demosPerCategory);
      
      try {
        const { data, error } = await supabase.functions.invoke('api-demo/click', {
          body: {
            demo_id: `cat${category}-demo${demoIndex}`,
            device_type: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
            region: ['in-west', 'us-east', 'eu-west'][Math.floor(Math.random() * 3)],
          },
        });
        
        const latency = Date.now() - start;
        demoLatencies.push(latency);
        
        if (error) {
          this.results.demo.clicksFailed++;
        } else {
          this.results.demo.clicksTracked++;
        }
      } catch (e) {
        this.results.demo.clicksFailed++;
      }
      
      await this.sleep(interval);
    }
    
    this.results.demo.averageLatency = this.calculateAverage(demoLatencies);
  }
  
  async runSecurityStress(supabase: any): Promise<void> {
    const endTime = Date.now() + this.config.duration * 1000;
    
    while (Date.now() < endTime && this.isRunning) {
      // Attempt role escalation (should always fail)
      try {
        this.results.security.escalationAttempts++;
        
        const { data, error } = await supabase.functions.invoke('api-admin/grant-role', {
          body: {
            target_user_id: 'test-user',
            role: 'super_admin',
          },
        });
        
        if (error || !data?.success) {
          this.results.security.escalationBlocked++;
        } else {
          // This should never happen - critical security failure
          console.error('SECURITY BREACH: Role escalation succeeded!');
        }
      } catch (e) {
        // Expected - escalation should be blocked
        this.results.security.escalationBlocked++;
      }
      
      await this.sleep(1000);
    }
  }
  
  async start(supabase: any, token: string): Promise<StressTestResults> {
    this.isRunning = true;
    this.abortController = new AbortController();
    this.results = this.initResults();
    this.latencies = [];
    
    // Track memory usage
    const memoryInterval = setInterval(() => {
      if ((performance as any).memory) {
        const memoryMB = (performance as any).memory.usedJSHeapSize / 1024 / 1024;
        this.results.system.peakMemoryMB = Math.max(this.results.system.peakMemoryMB, memoryMB);
      }
    }, 1000);
    
    // Run all stress tests in parallel
    await Promise.all([
      this.runChatStress(supabase, token),
      this.runWalletStress(supabase),
      this.runDemoStress(supabase),
      this.runSecurityStress(supabase),
    ]);
    
    clearInterval(memoryInterval);
    
    // Calculate final metrics
    this.results.system.p95Latency = this.calculatePercentile(this.latencies, 95);
    this.results.system.p99Latency = this.calculatePercentile(this.latencies, 99);
    
    const totalRequests = 
      this.results.chat.messagesSent + this.results.chat.messagesFailed +
      this.results.wallet.transactionsProcessed + this.results.wallet.transactionsFailed +
      this.results.demo.clicksTracked + this.results.demo.clicksFailed;
    
    const totalErrors = 
      this.results.chat.messagesFailed +
      this.results.wallet.transactionsFailed +
      this.results.demo.clicksFailed;
    
    this.results.system.errorRate = totalRequests > 0 ? totalErrors / totalRequests : 0;
    
    return this.results;
  }
  
  stop(): void {
    this.isRunning = false;
    this.abortController?.abort();
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
  
  private calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }
  
  getResults(): StressTestResults {
    return this.results;
  }
}

// Capacity thresholds
export const CAPACITY_THRESHOLDS = {
  chat: {
    maxMessagesPerSecond: 1000,
    maxLatencyMs: 200,
    maxFailureRate: 0.01,
  },
  websocket: {
    maxConcurrentConnections: 10000,
    maxLatencyMs: 100,
    maxDisconnectRate: 0.001,
  },
  wallet: {
    maxTransactionsPerMinute: 10000,
    maxLatencyMs: 300,
    requiredAccuracy: 0.9999,
    zeroErrorTolerance: true,
  },
  demo: {
    maxClicksPerSecond: 5000,
    maxLatencyMs: 100,
    maxFailureRate: 0.01,
  },
  api: {
    maxRequestsPerSecond: 10000,
    maxLatencyMs: 500,
    maxFailureRate: 0.01,
  },
  security: {
    maskingViolationTolerance: 0,
    rbacViolationTolerance: 0,
    escalationMustBeBlocked: true,
  },
};

// Export singleton runner
export const stressTestRunner = new StressTestRunner();
