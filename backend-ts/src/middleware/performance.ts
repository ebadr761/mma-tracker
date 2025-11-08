import { Request, Response, NextFunction } from 'express';

interface PerformanceMetrics {
  endpoint: string;
  method: string;
  responseTime: number;
  timestamp: Date;
  statusCode: number;
}

// Store metrics in memory (in production, use a proper metrics service)
const metricsStore: PerformanceMetrics[] = [];
const MAX_METRICS = 1000; // Keep last 1000 requests

export const performanceMonitor = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Capture the original res.json and res.send
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);

  const logMetrics = (statusCode: number) => {
    const responseTime = Date.now() - startTime;

    const metrics: PerformanceMetrics = {
      endpoint: req.path,
      method: req.method,
      responseTime,
      timestamp: new Date(),
      statusCode
    };

    // Store metrics
    metricsStore.push(metrics);
    if (metricsStore.length > MAX_METRICS) {
      metricsStore.shift();
    }

    // Log performance
    const color = responseTime < 100 ? '\x1b[32m' : responseTime < 200 ? '\x1b[33m' : '\x1b[31m';
    console.log(
      `${color}⚡ ${req.method} ${req.path} - ${responseTime}ms - ${statusCode}\x1b[0m`
    );
  };

  // Override res.json
  res.json = function(data: any) {
    logMetrics(res.statusCode);
    return originalJson(data);
  };

  // Override res.send
  res.send = function(data: any) {
    logMetrics(res.statusCode);
    return originalSend(data);
  };

  next();
};

export const getMetrics = (): {
  total: number;
  average: number;
  p50: number;
  p95: number;
  p99: number;
  slowestEndpoints: Array<{ endpoint: string; avgTime: number }>;
} => {
  if (metricsStore.length === 0) {
    return {
      total: 0,
      average: 0,
      p50: 0,
      p95: 0,
      p99: 0,
      slowestEndpoints: []
    };
  }

  const responseTimes = metricsStore.map(m => m.responseTime).sort((a, b) => a - b);
  const total = metricsStore.length;
  const average = responseTimes.reduce((sum, time) => sum + time, 0) / total;

  const getPercentile = (p: number) => {
    const index = Math.ceil((p / 100) * total) - 1;
    return responseTimes[index] || 0;
  };

  // Calculate slowest endpoints
  const endpointMap = new Map<string, number[]>();
  metricsStore.forEach(m => {
    const key = `${m.method} ${m.endpoint}`;
    if (!endpointMap.has(key)) {
      endpointMap.set(key, []);
    }
    endpointMap.get(key)!.push(m.responseTime);
  });

  const slowestEndpoints = Array.from(endpointMap.entries())
    .map(([endpoint, times]) => ({
      endpoint,
      avgTime: Math.round(times.reduce((sum, t) => sum + t, 0) / times.length)
    }))
    .sort((a, b) => b.avgTime - a.avgTime)
    .slice(0, 5);

  return {
    total,
    average: Math.round(average),
    p50: getPercentile(50),
    p95: getPercentile(95),
    p99: getPercentile(99),
    slowestEndpoints
  };
};

export const getRecentMetrics = (): PerformanceMetrics[] => {
  return metricsStore.slice(-100);
};
