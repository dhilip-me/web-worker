/// <reference lib="webworker" />

// The heavy task: recursive Fibonacci calculation
function calculateFibonacci(num: number): number {
  if (num <= 1) return num;
  return calculateFibonacci(num - 1) + calculateFibonacci(num - 2);
}

// Listen for the message from the main thread
addEventListener('message', ({ data }) => {
  console.log('Worker: Starting heavy calculation...');
  
  // Perform the task
  const result = calculateFibonacci(data);
  
  // Send the result back to the main thread
  postMessage(result); 
});