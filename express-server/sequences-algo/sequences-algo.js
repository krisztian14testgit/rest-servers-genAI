"use strict";

// Cache object to store sequences by their starting number
const _collatzCacheDict = {};

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

module.exports = {
    collatzSequence: collatzSeqFunc,
    collatzCacheDict: _collatzCacheDict,
}