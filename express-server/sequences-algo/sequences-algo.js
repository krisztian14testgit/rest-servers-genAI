"use strict";

// Cache object to store sequences by their starting number
const _collatzCacheDict = {};
// Prime cache storage
const _primeCache = [];

function collatzSeqFunc(n, isCached = false) {
    // If caching is enabled and we have this sequence cached, return it
    if (isCached && _collatzCacheDict[n]) {
        return _collatzCacheDict[n];
    }
    
    const sequence = [];
    let current = n;
    
    // Generate the Collatz sequence
    while (current !== 1) {
        sequence.push(current);
        
        if (current % 2 === 0) {
            current = current / 2;
        } else {
            current = 3 * current + 1;
        }
    }
    
    // Add the final 1
    sequence.push(1);
    
    // Store in cache if caching is enabled
    if (isCached) {
        _collatzCacheDict[n] = sequence;
    }
    
    return sequence;
}

 // Helper function to check if a number is prime
const _isPrime = (num) => {
    if (num < 2) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;

    for (let i = 3; i * i <= num; i += 2) {
        if (num % i === 0) return false;
    }
    return true;
};

/**
 * Generates prime numbers up to the nth prime
 * @param {number} n - The count of primes to generate
 * @param {boolean} isCached - Whether to use/store cache
 * @returns {number[]} Array of prime numbers
 */
function generatePrimes(n, isCached = false) {
  if (n <= 0) return [];

  // If caching is enabled and we already have enough primes cached
  if (isCached && _primeCache.length >= n) {
    return _primeCache.slice(0, n);
  }

  // Determine starting point
  const startIndex = isCached ? _primeCache.length : 0;
  const primeSequence = isCached ? [..._primeCache] : [];

  // Generate primes starting from the appropriate number
  let candidate = primeSequence.length > 0 ? primeSequence[primeSequence.length - 1] + 1 : 2;

  while (primeSequence.length < n) {
    if (_isPrime(candidate)) {
      primeSequence.push(candidate);
    }
    candidate++;
  }

  // Store in cache if caching is enabled
  if (isCached) {
    _primeCache.length = 0;
    _primeCache.push(...primeSequence);
  }

  return primeSequence;
}

module.exports = {
    collatzSequence: collatzSeqFunc,
    primeSequence: generatePrimes,
    collatzCacheDict: _collatzCacheDict,
}