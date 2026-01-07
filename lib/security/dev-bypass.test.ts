import { describe, it, expect, vi, afterEach } from 'vitest';
import { isDevBypass } from './dev-bypass';

describe('isDevBypass', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should return false if NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';
    expect(isDevBypass('DEV_BYPASS')).toBe(false);
  });

  it('should return true if NODE_ENV is development and value is DEV_BYPASS', () => {
    process.env.NODE_ENV = 'development';
    expect(isDevBypass('DEV_BYPASS')).toBe(true);
  });

  it('should return true if NODE_ENV is test and value is DEV_BYPASS', () => {
    process.env.NODE_ENV = 'test';
    expect(isDevBypass('DEV_BYPASS')).toBe(true);
  });

  it('should return true for DEV_BYPASS@example.com in development', () => {
    process.env.NODE_ENV = 'development';
    expect(isDevBypass('DEV_BYPASS@example.com')).toBe(true);
  });

  it('should return false for random values even in development', () => {
    process.env.NODE_ENV = 'development';
    expect(isDevBypass('some-random-string')).toBe(false);
  });

  it('should return false if value is undefined', () => {
    process.env.NODE_ENV = 'development';
    expect(isDevBypass(undefined)).toBe(false);
  });
});
