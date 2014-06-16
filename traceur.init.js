// MEGAHACK: underscore is the only library we use so in node it gets to be the exports object;
//           we're just acting like a global script so shove it in the global object
_ = module.exports;

// Initialization for the Traceur runtime.

// HACK: Traceur doesn't have iterable strings yet. This is incorrect for general Unicode.
String.prototype[Symbol.iterator] = function*() {
  for (var i = 0, n = this.length; i < n; i++) {
    yield this[i];
  }
};

// HACK: Traceur doesn't have Array.prototype.repeat yet.
if (!Array.prototype.repeat) {
  Array.prototype.repeat = function repeat(n) {
    var result = this.constructor();
    for (var i = 0; i < n; i++)
        result = result.concat(this);
    return result;
  };
}

(function() {

// HACK: these methods demonstrate plausible ES7 combinators for iterators, but
//       should really be on Iterator.prototype
function* aGeneratorFunction() { }

aGeneratorFunction.prototype.__proto__.every = function(p) {
  for (var x of this) {
    if (!p(x))
      return false;
  }
  return true;
};

aGeneratorFunction.prototype.__proto__.some = function(p) {
  for (var x of this) {
    var result = p(x);
    if (result)
      return result;
  }
  return false;
};

aGeneratorFunction.prototype.__proto__.zip = function* zip(that) {
  var left, right;
  while (left = this.next(), right = that.next(), !left.done && !right.done) {
    yield [left.value, right.value];
  }
  // HACK: should auto-close one if it's not closed
};

Array.prototype.zip = function zip(that) {
  var result = [];
  for (var i = 0, n = Math.min(this.length, that.length); i < n; i++) {
    result[i] = [this[i], that[i]];
  }
  return result;
};

})();
