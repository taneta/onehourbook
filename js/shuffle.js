/*
  based on https://github.com/LouisT/SeededShuffle/
*/

function randomSeed() {
  return Math.random().toString(36).substring(16);
}

class Shuffle {
  shuffle(arr, seed, copy) {
    seed = seed | randomSeed();
    if (this.getType(arr) !== "Array" || !this.setSeed(seed)) {
      return null;
    }
    let shuff = (copy?arr.slice(0):arr),
      size = shuff.length,
      map = this.genMap(size);
    for (var i = size - 1; i > 0; i--) {
      shuff[i] = shuff.splice(map[size-1-i],1,shuff[i])[0];
    }
    return shuff;
  }

  unshuffle(arr, seed, copy) {
    if (this.getType(arr) !== "Array" || !this.setSeed(seed)) {
      return null;
    }
    var shuff = (copy?arr.slice(0):arr),
      size = shuff.length,
      map = this.genMap(size);
    for (var i = 1; i < size; i++) {
      shuff[i] = shuff.splice(map[size-1-i],1,shuff[i])[0];
    }
    return shuff;
  }

  genMap(size) {
    var map = new Array(size);
    for (var x = 0; x < size; x++) {
      //Don't change these numbers.
      map[x] = ((this.__seed = (this.__seed*9301+49297)%233280)/233280.0)*size|0;
    }
    return map;
  }

  setSeed(seed) {
    if (!/(number|string)/i.test(this.getType(seed))) {
      return false;
    }
    if (isNaN(seed)) {
      seed = String(seed).split('').map(function(x){return x.charCodeAt(0)}).join('');
    }
    return this.__seed = Number(seed);
  }

  getType(obj) {
    return Object.prototype.toString.call(obj).match(/^\[object (.*)\]$/)[1];
  }
}
