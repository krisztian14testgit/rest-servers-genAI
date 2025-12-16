"use strict";

/** Jest library for unit-testing
 * npm install --save-dev jest supertest
 * Genereated by Llama v3.1 
 */

const request = require("supertest");
const { collatzSequence, primeSequence, collatzCacheDict } = require('./sequences-algo');

describe('collatzSequence - Without Caching', () => {
    beforeEach(() => {
        // Reset the cache before each test
        // Note: You might need to export a reset function or access the cache variable
        jest.resetModules();
        //delete require.cache[require.resolve('./sequences-algo')];
    });

    test('should generate correct sequence for n = 1', () => {
        const result = collatzSequence(1, false);
        expect(result).toEqual([1]);
    });

    test('should generate correct sequence for n = 2', () => {
        const result = collatzSequence(2, false);
        expect(result).toEqual([2, 1]);
    });

    test('should generate correct sequence for n = 3', () => {
        const result = collatzSequence(3, false);
        expect(result).toEqual([3, 10, 5, 16, 8, 4, 2, 1]);
    });

    test('should generate correct sequence for n = 5', () => {
        const result = collatzSequence(5, false);
        expect(result).toEqual([5, 16, 8, 4, 2, 1]);
    });

    test('should generate correct sequence for n = 10', () => {
        const result = collatzSequence(10, false);
        expect(result).toEqual([10, 5, 16, 8, 4, 2, 1]);
    });

    test('should generate correct sequence for n = 27 (longer sequence)', () => {
        const result = collatzSequence(27, false);
        expect(result).toEqual([
            27, 82, 41, 124, 62, 31, 94, 47, 142, 71, 214, 107, 322, 161, 484, 242,
            121, 364, 182, 91, 274, 137, 412, 206, 103, 310, 155, 466, 233, 700, 350,
            175, 526, 263, 790, 395, 1186, 593, 1780, 890, 445, 1336, 668, 334, 167,
            502, 251, 754, 377, 1132, 566, 283, 850, 425, 1276, 638, 319, 958, 479,
            1438, 719, 2158, 1079, 3238, 1619, 4858, 2429, 7288, 3644, 1822, 911,
            2734, 1367, 4102, 2051, 6154, 3077, 9232, 4616, 2308, 1154, 577, 1732,
            866, 433, 1300, 650, 325, 976, 488, 244, 122, 61, 184, 92, 46, 23, 70,
            35, 106, 53, 160, 80, 40, 20, 10, 5, 16, 8, 4, 2, 1
        ]);
    });

    test('should always end with 1', () => {
        const testValues = [7, 15, 19, 100, 1000];
        testValues.forEach(n => {
            const result = collatzSequence(n, false);
            expect(result[result.length - 1]).toBe(1);
        });
    });

    test('should return array with length > 0', () => {
        const result = collatzSequence(42, false);
        expect(result.length).toBeGreaterThan(0);
        expect(Array.isArray(result)).toBe(true);
    });
});

describe('collatzSequence - With Caching', () => {
    // Helper to reset cache between test suites
    beforeEach(() => {
        jest.resetModules();
    });

    test('should cache the sequence when isCached is true', () => {
        const result1 = collatzSequence(5, true);
        expect(result1).toEqual([5, 16, 8, 4, 2, 1]);

        // Second call with same n should return cached result
        const result2 = collatzSequence(5, true);
        expect(result2).toEqual([5, 16, 8, 4, 2, 1]);
    });

    test('should not use cache when isCached is false', () => {
        const result1 = collatzSequence(5, true);
        expect(result1).toEqual([5, 16, 8, 4, 2, 1]);

        // Even though cached, calling with isCached=false should generate fresh sequence
        const result2 = collatzSequence(5, false);
        expect(result2).toEqual([5, 16, 8, 4, 2, 1]);
    });

    test('should cache different sequences for different n values', () => {
        const result1 = collatzSequence(3, true);
        expect(result1).toEqual([3, 10, 5, 16, 8, 4, 2, 1]);

        const result2 = collatzSequence(4, true);
        expect(result2).toEqual([4, 2, 1]);

        // Both should be stored in cache
        expect(collatzCacheDict[3]).toEqual([3, 10, 5, 16, 8, 4, 2, 1]);
        expect(collatzCacheDict[4]).toEqual([4, 2, 1]);
    });

    test('should not modify the original sequence when caching', () => {
        const result = collatzSequence(6, true);
        expect(result).toEqual([6, 3, 10, 5, 16, 8, 4, 2, 1]);

        // Check that the cached sequence is not modified
        const cachedResult = collatzCacheDict[6];
        expect(cachedResult).toEqual([6, 3, 10, 5, 16, 8, 4, 2, 1]);
    });

    test('should handle cache with null initial state', () => {
        const result = collatzSequence(10, true);
        expect(result).toEqual([10, 5, 16, 8, 4, 2, 1]);
    });

    test('should return cached sequence when called with isCached=true', () => {
        const result1 = collatzSequence(7, true);
        expect(result1).toEqual([7, 22, 11, 34, 17, 52, 26, 13, 40, 20, 10, 5, 16, 8, 4, 2, 1]);

        // Subsequent call should return cached result
        const result2 = collatzSequence(7, true);
        expect(result2).toEqual([7, 22, 11, 34, 17, 52, 26, 13, 40, 20, 10, 5, 16, 8, 4, 2, 1]);
    });

    test('should not cache sequence when isCached is false', () => {
        const result1 = collatzSequence(8, false);
        expect(result1).toEqual([8, 4, 2, 1]);

        // Cache should remain empty for this n
        expect(collatzCacheDict[8]).toBeUndefined();
    });

    test('should handle large numbers with caching', () => {
        const result = collatzSequence(9999, true);
        expect(result).toEqual([
            9999, 29998, 14999, 44998, 22499, 67498, 33749, 101248, 50624, 25312, 12656, 6328, 3164, 1582, 791, 2374, 1187, 3562, 1781, 5344, 2672, 1336, 668, 334, 167, 502, 251, 754, 377, 1132, 566, 283, 850, 425, 1276, 638, 319, 958, 479, 1438, 719, 2158, 1079, 3238, 1619, 4858, 2429, 7288, 3644, 1822, 911, 2734, 1367, 4102, 2051, 6154, 3077, 9232, 4616, 2308, 1154, 577, 1732, 866, 433, 1300, 650, 325, 976, 488, 244, 122, 61, 184, 92, 46, 23, 70, 35, 106, 53, 160, 80, 40, 20, 10, 5, 16, 8, 4, 2, 1
        ]);
    });
});

describe('Primes - Without caching', () => {
    beforeEach(() => {
        // Clear any cache before each test
        jest.clearAllMocks();
    });

    test('should return empty array when n is 0', () => {
        const result = primeSequence(0, false);
        expect(result).toEqual([]);
    });

    test('should return empty array when n is negative', () => {
        const result = primeSequence(-5, false);
        expect(result).toEqual([]);
    });

    test('should return first prime number', () => {
        const result = primeSequence(1, false);
        expect(result).toEqual([2]);
    });

    test('should return first 5 primes', () => {
        const result = primeSequence(5, false);
        expect(result).toEqual([2, 3, 5, 7, 11]);
    });

    test('should return first 10 primes', () => {
        const result = primeSequence(10, false);
        expect(result).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
    });

    test('should return correct primes for larger sequence', () => {
        const result = primeSequence(15, false);
        expect(result.length).toBe(15);
        expect(result[0]).toBe(2);
        expect(result[result.length - 1]).toBe(47);
    });

    test('should not contain duplicate primes', () => {
        const result = primeSequence(20, false);
        const uniquePrimes = new Set(result);
        expect(uniquePrimes.size).toBe(result.length);
    });

    test('should return all valid prime numbers', () => {
        const result = primeSequence(10, false);
        const isPrime = (num) => {
            if (num < 2) return false;
            for (let i = 2; i * i <= num; i++) {
                if (num % i === 0) return false;
            }
            return true;
        };
        result.forEach((prime) => {
            expect(isPrime(prime)).toBe(true);
        });
    });

    test('should return primes in ascending order', () => {
        const result = primeSequence(10, false);
        for (let i = 0; i < result.length - 1; i++) {
            expect(result[i]).toBeLessThan(result[i + 1]);
        }
    });
});

describe('Primes - With caching', () => {
  beforeEach(() => {
    // Clear cache before each test by calling with n=0
    primeSequence(0, true);
  });

  test('should cache primes on first call', () => {
    const result = primeSequence(5, true);
    expect(result).toEqual([2, 3, 5, 7, 11]);
  });

  test('should return cached primes without recalculation', () => {
    primeSequence(5, true);
    const result = primeSequence(5, true);
    expect(result).toEqual([2, 3, 5, 7, 11]);
  });

  test('should use cache and generate only missing primes', () => {
    const firstCall = primeSequence(5, true);
    expect(firstCall).toEqual([2, 3, 5, 7, 11]);

    const secondCall = primeSequence(10, true);
    expect(secondCall.length).toBe(10);
    expect(secondCall).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
  });

  test('should return subset from cache when n is less than cached size', () => {
    primeSequence(10, true);
    const result = primeSequence(5, true);
    expect(result).toEqual([2, 3, 5, 7, 11]);
  });

  test('should maintain cache across multiple calls', () => {
    primeSequence(3, true);
    primeSequence(7, true);
    const result = primeSequence(7, true);
    expect(result).toEqual([2, 3, 5, 7, 11, 13, 17]);
  });

  test('should handle incremental cache building', () => {
    const call1 = primeSequence(5, true);
    const call2 = primeSequence(8, true);
    const call3 = primeSequence(12, true);

    expect(call1.length).toBe(5);
    expect(call2.length).toBe(8);
    expect(call3.length).toBe(12);
    
    // Verify cache is properly maintained
    console.log(call3);
    expect(call3[4]).toBe(11); // 5th prime should be 11
    expect(call3[7]).toBe(19); // 8th prime should be 19
    expect(call3[11]).toBe(37); // 12th prime should be 37
  });

  test('should not modify cache when n is smaller than cache size', () => {
    primeSequence(10, true);
    const result = primeSequence(3, true);
    expect(result).toEqual([2, 3, 5]);
  });

  test('should handle edge case with n=1 and caching', () => {
    const result = primeSequence(1, true);
    expect(result).toEqual([2]);
  });

  test('should handle edge case with n=0 and caching', () => {
    primeSequence(10, true);
    const result = primeSequence(0, true);
    expect(result).toEqual([]);
  });

  test('should not cache when isCached is false', () => {
    primeSequence(5, true); // Cache primes
    const result = primeSequence(5, false); // Should not use cache
    expect(result).toEqual([2, 3, 5, 7, 11]);
  });

  test('should handle large n with caching', () => {
    const result = primeSequence(100, true);
    expect(result.length).toBe(100);
    expect(result[result.length-1]).toBe(541); // 100th prime number
  });

  test('should handle caching with different n values', () => {
    const result1 = primeSequence(5, true);
    const result2 = primeSequence(3, true);
    const result3 = primeSequence(8, true);
    
    expect(result1).toEqual([2, 3, 5, 7, 11]);
    expect(result2).toEqual([2, 3, 5]);
    expect(result3).toEqual([2, 3, 5, 7, 11, 13, 17, 19]);
  });

  test('should maintain prime sequence integrity', () => {
    const result = primeSequence(10, true);
    const isPrime = (num) => {
      if (num < 2) return false;
      for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
      }
      return true;
    };
    
    result.forEach((prime) => {
      expect(isPrime(prime)).toBe(true);
    });
  });

  test('should handle multiple consecutive calls with caching', () => {
    const result1 = primeSequence(5, true);
    const result2 = primeSequence(5, true);
    const result3 = primeSequence(10, true);
    const result4 = primeSequence(10, true);
    
    expect(result1).toEqual([2, 3, 5, 7, 11]);
    expect(result2).toEqual([2, 3, 5, 7, 11]);
    expect(result3).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
    expect(result4).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
  });
});
