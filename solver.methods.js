// (A,B):Plus, T:Iterable => (T<A>, T<A>) -> T<B>
function cross(A, B) {
  return A.flatMap(a => B.map(b => a + b));
}

var rows     /* : [rx x 9]       */ = "ABCDEFGHI".split("");
var cols     /* : [cx x 9]       */ = "123456789".split("");
var digits   /* : [digit x 9]    */ = "123456789".split("");

var cells    /* : Array<ix x 91> */ = cross(rows, cols);

var unitlist /* : Array<Array<ix x 9> x 27> */
  = cols.map(c => cross(rows, [c]))
    .concat(rows.map(r => cross([r], cols)))
    .concat(["ABC","DEF","GHI"].flatMap(rs =>
               ["123","456","789"].map(cs =>
                  cross(rs.split(""), cs.split("")))));

var units    /* : Dict<ix, unit> */
  = Dict.build(cells.lazy().map(s =>
                [s, unitlist.filter(u => u.indexOf(s) > -1)]));

var peers    /* : Dict<ix, Array<ix x 20>> */
  = Dict.build(cells.lazy().map(s =>
                [s, _.unique(units.get(s).flatMap(u => u.filter(s2 => s2 !== s)))]));

class Solver {

  // (Dict<ix, values>?) -> Solver
  constructor(dict) {
    // Dict<ix, values>
    this._constraints = dict || Dict.build(cells.lazy().map(s => [s, digits]));
  }

  // (string) -> Solver | false
  static parse(grid) {
    var solver = new Solver();

    for (var [s, d] of cells.zip(grid.trim())) {
      if (_.contains(digits, d) && !solver.assign(s, d))
        return false;
    }

    return solver;
  }

  // () -> Solver
  clone() {
    return new Solver(this._constraints.clone());
  }

  // (ix, digit) -> Solver | false
  assign(s, d) {
    if (this._constraints.get(s).lazy()
                         .filter(d2 => d2 !== d)
                         .every(d2 => this.eliminate(s, d2))) {
        return this;
    }
    return false;
  }

  // (ix, digit) -> Solver | false
  eliminate(s, d) {
    var constraints = this._constraints;

    if (!_.contains(constraints.get(s), d))
      return this; // Already eliminated

    var values = _.without(constraints.get(s), d);
    constraints.set(s, values);

    if (values.length === 0)
      return false;  // Contradiction: removed last value

    if (values.length === 1) {
      // If there is only one value (d2) left in cell, remove it from peers
      var d2 = values[0];
      if (!peers.get(s).lazy()
                       .every(s2 => this.eliminate(s2, d2))) {
        return false;
      }
    }

    // Now check the places where d appears in the units of s
    for (var u of units.get(s)) {
      var dplaces = u.filter(s => _.contains(constraints.get(s), d));

      if (dplaces.length === 0)
        return false;

      if (dplaces.length === 1) {
        // d can only be in one place in unit; assign it there
        if (!this.assign(dplaces[0], d))
          return false;
      }
    }
    return this;
  }

  // () -> Solver | false
  solve() {
    var constraints = this._constraints;

    if (cells.lazy().map(s => constraints.get(s).length)
                    .every(n => n === 1)) {
      return this; // Solved!
    }

    // Choose the unfilled cell s with the fewest possibilities
    var a = cells.filter(s => constraints.get(s).length > 1)
                 .sort((s1, s2) => constraints.get(s1).length - constraints.get(s2).length);
    var s = a[0];

    return constraints.get(s).lazy()
                             .filterMap(d => this.clone().assign(s, d))
                             .some(solver => solver.solve());
  }

  // () -> string
  toString() {
    function center(s, w) {
      var n = s.length;
      if (w <= n)
        return s;
      var m = Math.floor((w - n) / 2);
      return " ".repeat(m) + s + " ".repeat(w - n - m);
    }

    var lines = [];
    var width = 1 + Math.max(...cells.map(s => this._constraints.get(s).length));

    var line = "\n" + ["-".repeat(width * 3)].repeat(3).join("+");

    for (var r of rows) {
      lines.push(cols.map(c => center(this._constraints.get(r + c).join(""), width) + ("36".contains(c) && "|" || ""))
                     .join("") + ("CF".contains(r) && line || ""));
    }
    return lines.join("\n");
  }

}

var easy = Solver.parse("..3.2.6..9..3.5..1..18.64....81.29..7.......8..67.82....26.95..8..2.3..9..5.1.3.."),
    hard = Solver.parse("4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......");

console.log("easy:");
console.log(easy.solve().toString());

console.log("hard:");
console.log(hard.solve().toString());
