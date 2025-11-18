import { Component } from '@angular/core';

// --- Heavy Task Function (Used for Blocking Example Only) ---
// This function runs on the main thread when called directly.
const calculateFibonacci = (num: number): number => {
  if (num <= 1) return num;
  return calculateFibonacci(num - 1) + calculateFibonacci(num - 2);
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  fibNumber: number = 45;

  // Blocking State
  blockingResult: number | string = 'Ready';
  blockingTime: number | string = '0';

  // Worker State
  workerResult: number | string = 'Ready';
  workerTime: number | string = '0';

  // ------------------------------------------------------------------
  // 1. Implementation WITHOUT Web Worker (Blocking)
  // ------------------------------------------------------------------
  startBlockingTask() {
    this.blockingResult = 'Calculating...';
    this.blockingTime = '...';

    const startTime = performance.now();
    
    // Call the heavy function directly on the main UI thread.
    const result = calculateFibonacci(this.fibNumber); 
    
    const endTime = performance.now();

    this.blockingResult = result;
    this.blockingTime = (endTime - startTime).toFixed(2);
  }

  // ------------------------------------------------------------------
  // 2. Implementation WITH Web Worker (Non-Blocking)
  // ------------------------------------------------------------------
  startWorkerTask() {
    this.workerResult = 'Calculating...';
    this.workerTime = '...';

    if (typeof Worker === 'undefined') {
      this.workerResult = 'Workers not supported.';
      return;
    }

    const startTime = performance.now();
    
    // Instantiate the worker using the URL path to the separate worker file.
    const worker = new Worker('./app.worker', { type: 'module' });

    // Set up the listener for the worker's result
    worker.onmessage = ({ data }) => {
      const endTime = performance.now();
      
      this.workerResult = data;
      this.workerTime = (endTime - startTime).toFixed(2);
      
      // Cleanup: Terminate the worker
      worker.terminate();
    };

    // Send data to the worker to start the task
    worker.postMessage(this.fibNumber);
  }
}