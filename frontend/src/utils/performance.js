// Performance optimization utilities for React applications [1][6]

// Debounce function for search inputs to reduce API calls
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function for scroll events and map interactions [1]
export function throttle(func, limit) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Lazy loading utility for code splitting optimization [6]
export function lazyLoad(importFunc) {
  return React.lazy(importFunc)
}

// Performance monitoring for development and optimization [6]
export class PerformanceMonitor {
  static measurements = new Map()

  static start(name) {
    this.measurements.set(name, performance.now())
  }

  static end(name) {
    const start = this.measurements.get(name)
    if (start) {
      const duration = performance.now() - start
      console.log(`${name}: ${duration.toFixed(2)}ms`)
      this.measurements.delete(name)
      return duration
    }
  }

  static measure(name, func) {
    this.start(name)
    const result = func()
    this.end(name)
    return result
  }

  static async measureAsync(name, asyncFunc) {
    this.start(name)
    const result = await asyncFunc()
    this.end(name)
    return result
  }
}

// Memory usage monitoring for application optimization [6]
export function getMemoryUsage() {
  if (performance.memory) {
    return {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576),
      total: Math.round(performance.memory.totalJSHeapSize / 1048576),
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
    }
  }
  return null
}
