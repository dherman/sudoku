// MEGAHACK: underscore is the only library we use so in node it gets to be the exports object;
//           we're just acting like a global script so shove it in the global object
_ = module.exports;

// Initialization for the Traceur runtime.

// HACK: This is incorrect for general Unicode.
if (!String.prototype.keys) {
  String.prototype.keys = function* keys() {
    for (var i = 0, n = this.length; i < n; i++) {
      yield i;
    }
  }
}

// HACK: This is incorrect for general Unicode.
if (!String.prototype.values) {
  String.prototype.values = function* values() {
    for (var i = 0, n = this.length; i < n; i++) {
      yield this[i];
    }
  };
}

// Traceur doesn't have iterable strings yet.
String.prototype[Symbol.iterator] = String.prototype.values;

if (!Array.prototype.lazy) {
  Array.prototype.lazy = function* lazy() {
    // TODO: should the length be tested on each iteration for concurrent modification?
    for (var i = 0, n = this.length; i < n; i++) {
      yield this[i];
    }
  };
}

// HACK: Traceur doesn't have Array.prototype.repeat yet.
if (!Array.prototype.repeat) {
  Array.prototype.repeat = function repeat(n) {
    var result = this.constructor();
    for (var i = 0; i < n; i++)
        result = result.concat(this);
    return result;
  };
}

if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = function flatMap(f, thisArg=this) {
    var result = [];
    for (var i = 0, n = this.length; i < n; i++) {
      var inner = f.call(thisArg, this[i], i, this);
      for (var j = 0, m = inner.length; j < m; j++) {
        result.push(inner[j]);
      }
    }
    return result;
  };
}

(function() {

// HACK: these methods demonstrate plausible ES7 combinators for iterators, but
//       should really be on Iterator.prototype
function* aGeneratorFunction() { }

aGeneratorFunction.prototype.__proto__.map = function* map(f, thisArg=this) {
  var i = 0;
  for (var x of this) {
    yield f.call(thisArg, x, i++, this);
  }
};

// aGeneratorFunction.prototype.__proto__.flatMap = function* flatMap(f, thisArg=this) {
//   TODO
// };

aGeneratorFunction.prototype.__proto__.filter = function* filter(p, thisArg=this) {
  var i = 0;
  for (var x of this) {
    if (p.call(thisArg, x, i++, this))
      yield x;
  }
};

aGeneratorFunction.prototype.__proto__.filterMap = function* filterMap(p, thisArg=this) {
  var i = 0;
  for (var x of this) {
    var result = p.call(thisArg, x, i++, this);
    if (result)
      yield result;
  }
};

aGeneratorFunction.prototype.__proto__.every = function every(p, thisArg=this) {
  var i = 0;
  for (var x of this) {
    if (!p.call(thisArg, x, i++, this))
      return false;
  }
  return true;
};

aGeneratorFunction.prototype.__proto__.some = function some(p, thisArg=this) {
  var i = 0;
  for (var x of this) {
    var result = p.call(thisArg, x, i++, this);
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

aGeneratorFunction.prototype.__proto__.concat = function*(that) {
  for (var x of this)
    yield x;
  for (var x of that)
    yield x;
};

aGeneratorFunction.prototype.__proto__.toArray = function() {
  var result = [];
  for (var x of this)
    result.push(x);
  return result;
};

Array.prototype.zip = function zip(that) {
  var result = [];
  for (var i = 0, n = Math.min(this.length, that.length); i < n; i++) {
    result[i] = [this[i], that[i]];
  }
  return result;
};

})();
