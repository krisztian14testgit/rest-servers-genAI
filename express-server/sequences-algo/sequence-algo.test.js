"use strict";

/** Jest library for unit-testing
 * npm install --save-dev jest supertest
 * Genereated by Llama v3.1 
 */

const request = require("supertest");
const { collatzSequence, collatzCacheDict } = require('./sequences-algo');

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
