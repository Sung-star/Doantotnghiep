/**
 * Performance monitoring utilites for Stage 3 optimization
 */

export const usePerformanceMetrics = () => {
  const recordMetric = (name, value, unit = 'ms') => {
    if (window.performance && window.performance.mark) {
      try {
        // Record custom metric
        performance.mark(`${name}-${value}${unit}`);
        
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[PERF] ${name}: ${value}${unit}`);
        }

        // Send to analytics service in production (if configured)
        if (process.env.NODE_ENV === 'production' && window.gtag) {
          window.gtag('event', 'performance_metric', {
            metric_name: name,
            metric_value: value,
            metric_unit: unit
          });
        }
      } catch (error) {
        console.error('Error recording performance metric:', error);
      }
    }
  };

  const measurePageLoad = () => {
    if (window.performance) {
      const navStart = performance.timing.navigationStart;
      const navEnd = performance.timing.loadEventEnd;
      const pageLoadTime = navEnd - navStart;
      recordMetric('page_load_time', pageLoadTime);
      return pageLoadTime;
    }
    return null;
  };

  const measureComponentRender = (componentName) => {
    const startMark = `${componentName}-start`;
    const endMark = `${componentName}-end`;
    
    return {
      start: () => performance.mark(startMark),
      end: () => {
        performance.mark(endMark);
        try {
          performance.measure(componentName, startMark, endMark);
          const measure = performance.getEntriesByName(componentName)[0];
          recordMetric(`component_${componentName}`, Math.round(measure.duration));
        } catch (error) {
          console.error(`Error measuring ${componentName}:`, error);
        }
      }
    };
  };

  const getWebVitals = () => {
    const vitals = {
      fcp: null, // First Contentful Paint
      lcp: null, // Largest Contentful Paint
      cls: null, // Cumulative Layout Shift
      fid: null  // First Input Delay
    };

    if (window.performance && window.PerformanceObserver) {
      try {
        // Measure LCP
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = Math.round(lastEntry.renderTime || lastEntry.loadTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Measure CLS
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              vitals.cls += entry.value;
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        return vitals;
      } catch (error) {
        console.error('Error getting web vitals:', error);
        return vitals;
      }
    }

    return vitals;
  };

  return {
    recordMetric,
    measurePageLoad,
    measureComponentRender,
    getWebVitals
  };
};

/**
 * Hook để measure API response time
 */
export const useApiMetrics = () => {
  const recordApiMetric = (endpoint, duration, statusCode = 200) => {
    const metrics = {
      endpoint,
      duration,
      statusCode,
      timestamp: new Date().toISOString()
    };

    if (process.env.NODE_ENV === 'development') {
      console.table([metrics]);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && window.gtag) {
      window.gtag('event', 'api_call', {
        endpoint,
        duration,
        status: statusCode
      });
    }

    return metrics;
  };

  return { recordApiMetric };
};

/**
 * Utility để log bundle size info
 */
export const logBundleInfo = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      '%c📦 Bundle Information',
      'color: #0066cc; font-size: 14px; font-weight: bold;'
    );
    console.table({
      'Build Time': new Date().toLocaleTimeString(),
      'Vendor Bundle': '85.82 kB (gzip: 31.57 kB)',
      'Components Bundle': '56.05 kB (gzip: 18.46 kB)',
      'Pages User Bundle': '22.38 kB (gzip: 6.60 kB)',
      'Pages Admin Bundle': '23.20 kB (gzip: 6.72 kB)',
      'Main Bundle': '340.06 kB (gzip: 100.50 kB)'
    });
  }
};

export default usePerformanceMetrics;
