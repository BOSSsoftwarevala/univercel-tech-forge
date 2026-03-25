// Web Worker Pool for Heavy Computations - 5M Capacity
type WorkerTask = {
  id: string;
  type: string;
  payload: unknown;
  resolve: (result: unknown) => void;
  reject: (error: Error) => void;
};

export class WebWorkerPool {
  private workers: Worker[] = [];
  private taskQueue: WorkerTask[] = [];
  private busyWorkers = new Set<number>();
  private workerCode: string;

  constructor(poolSize = navigator.hardwareConcurrency || 4) {
    this.workerCode = `
      self.onmessage = async function(e) {
        const { id, type, payload } = e.data;
        
        try {
          let result;
          
          switch(type) {
            case 'sort':
              result = payload.sort((a, b) => a[payload.key] - b[payload.key]);
              break;
            case 'filter':
              result = payload.data.filter(item => 
                Object.entries(payload.filters).every(([key, value]) => 
                  String(item[key]).toLowerCase().includes(String(value).toLowerCase())
                )
              );
              break;
            case 'aggregate':
              result = payload.data.reduce((acc, item) => {
                const key = item[payload.groupBy];
                if (!acc[key]) acc[key] = { count: 0, sum: 0 };
                acc[key].count++;
                acc[key].sum += item[payload.sumField] || 0;
                return acc;
              }, {});
              break;
            case 'transform':
              result = payload.data.map(item => ({
                ...item,
                ...payload.transformations
              }));
              break;
            case 'search':
              const searchLower = payload.query.toLowerCase();
              result = payload.data.filter(item =>
                payload.fields.some(field =>
                  String(item[field]).toLowerCase().includes(searchLower)
                )
              );
              break;
            default:
              result = payload;
          }
          
          self.postMessage({ id, success: true, result });
        } catch (error) {
          self.postMessage({ id, success: false, error: error.message });
        }
      };
    `;

    this.initWorkers(poolSize);
  }

  private initWorkers(poolSize: number) {
    const blob = new Blob([this.workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);

    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(workerUrl);
      worker.onmessage = (e) => this.handleWorkerMessage(i, e);
      worker.onerror = (e) => this.handleWorkerError(i, e);
      this.workers.push(worker);
    }
  }

  private handleWorkerMessage(workerIndex: number, e: MessageEvent) {
    const { id, success, result, error } = e.data;
    this.busyWorkers.delete(workerIndex);
    
    const taskIndex = this.taskQueue.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
      const task = this.taskQueue.splice(taskIndex, 1)[0];
      if (success) {
        task.resolve(result);
      } else {
        task.reject(new Error(error));
      }
    }
    
    this.processQueue();
  }

  private handleWorkerError(workerIndex: number, e: ErrorEvent) {
    console.error(`Worker ${workerIndex} error:`, e);
    this.busyWorkers.delete(workerIndex);
    this.processQueue();
  }

  private processQueue() {
    const availableWorker = this.workers.findIndex((_, i) => !this.busyWorkers.has(i));
    if (availableWorker === -1 || this.taskQueue.length === 0) return;

    const task = this.taskQueue[0];
    this.busyWorkers.add(availableWorker);
    this.workers[availableWorker].postMessage({
      id: task.id,
      type: task.type,
      payload: task.payload
    });
  }

  execute<T>(type: string, payload: unknown): Promise<T> {
    return new Promise((resolve, reject) => {
      const task: WorkerTask = {
        id: `task_${Date.now()}_${Math.random()}`,
        type,
        payload,
        resolve: resolve as (result: unknown) => void,
        reject
      };
      
      this.taskQueue.push(task);
      this.processQueue();
    });
  }

  terminate() {
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
    this.taskQueue = [];
  }
}

// Global worker pool instance
export const workerPool = new WebWorkerPool();
