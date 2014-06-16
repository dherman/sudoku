class Dict {
  constructor(init = {}) {
    this._dunder = undefined;
    this._table = Object.create(null);
    for (var k in init) {
      if ({}.hasOwnProperty.call(init, k))
        this.set(k, init[k]);
    }
  }

  static build(pairs) {
    var result = new Dict();
    // TODO: destructuring
    for (var pair of pairs) {
      result.set(pair[0], pair[1]);
    }
    return result;
  }  

  clone() {
    var result = new Dict();
    result._dunder = this._dunder;
    result._hasDunder = this._hasDunder;
    for (var key in this._table) {
        result._table[key] = this._table[key];
    }
    return result;
  }

  has(key) {
    if (key === '__proto__')
        return this._hasDunder;
    return key in this._table;
  }

  get(key) {
    if (key === '__proto__')
        return this._dunder;
    return this._table[key];
  }

  set(key, value) {
    if (key === '__proto__') {
        this._dunder = value;
        this._hasDunder = true;
    }
    this._table[key] = value;
  }

  delete(key) {
    if (key === '__proto__') {
        this._dunder = undefined;
        this._hasDunder = false;
    }
    delete this._table[key];
  }

  *keys() {
    if (this._hasDunder)
        yield '__proto__';
    for (var key in this._table)
        yield key;
  }

  *values() {
    if (this._hasDunder)
        yield this._dunder;
    for (var key in this._table)
        yield this._table[key];
  }

  *entries() {
    if (this._hasDunder)
        yield ['__proto__', this._dunder];
    for (var key in this._table)
        yield [key, this._table[key]];
  }
}
