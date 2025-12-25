/**
 * Global data cache để tránh gọi API nhiều lần
 * Singleton pattern - chỉ 1 instance duy nhất cho toàn app
 */

import type { ITest, ITestAttempt } from '../types';

class DataCache {
  private static instance: DataCache;
  
  private testsCache: ITest[] | null = null;
  private testAttemptsCache: ITestAttempt[] | null = null;
  private pendingTests: Promise<ITest[]> | null = null;
  private pendingAttempts: Promise<ITestAttempt[]> | null = null;
  
  private constructor() {}
  
  static getInstance(): DataCache {
    if (!DataCache.instance) {
      DataCache.instance = new DataCache();
    }
    return DataCache.instance;
  }
  
  getTests(): ITest[] | null {
    return this.testsCache;
  }
  
  setTests(tests: ITest[]): void {
    this.testsCache = tests;
  }
  
  getTestAttempts(): ITestAttempt[] | null {
    return this.testAttemptsCache;
  }
  
  setTestAttempts(attempts: ITestAttempt[]): void {
    this.testAttemptsCache = attempts;
  }
  
  getPendingTests(): Promise<ITest[]> | null {
    return this.pendingTests;
  }
  
  setPendingTests(promise: Promise<ITest[]> | null): void {
    this.pendingTests = promise;
  }
  
  getPendingAttempts(): Promise<ITestAttempt[]> | null {
    return this.pendingAttempts;
  }
  
  setPendingAttempts(promise: Promise<ITestAttempt[]> | null): void {
    this.pendingAttempts = promise;
  }
  
  clear(): void {
    this.testsCache = null;
    this.testAttemptsCache = null;
    this.pendingTests = null;
    this.pendingAttempts = null;
  }
  
  clearTests(): void {
    this.testsCache = null;
    this.pendingTests = null;
  }
  
  clearTestAttempts(): void {
    this.testAttemptsCache = null;
    this.pendingAttempts = null;
  }
}

export const dataCache = DataCache.getInstance();
