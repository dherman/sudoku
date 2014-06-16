// This code currently compiles with Traceur. It doesn't compile with esnext,
// which doesn't support generator comprehensions.

// (A,B):Plus => (Iterable<A>, Iterable<A>) -> Array<B>
function cross(A, B) {
    return [for (a of A)
              for (b of B)
                a + b];
}

var rows     /* : [rx x 9]       */ = "ABCDEFGHI";
var cols     /* : [cx x 9]       */ = "123456789";
var digits   /* : [digit x 9]    */ = "123456789";

var cells    /* : Array<ix x 91> */ = cross(rows, cols);

var unitlist /* : Array<Array<ix x 9> x 27> */
  = [for (c of cols)
       cross(rows, c)]
    .concat([for (r of rows)
               cross(r, cols)])
    .concat([for (rs of ["ABC","DEF","GHI"])
               for (cs of ["123","456","789"])
                 cross(rs, cs)]);

var units    /* : Dict<ix, unit> */
  = Dict.build((for (s of cells)
                  [s, [for (u of unitlist)
                       if (u.indexOf(s) > -1)
                         u]]));

var peers    /* : Dict<ix, Array<ix x 20>> */
  = Dict.build((for (s of cells)
                  [s, _.unique([for (u of units.get(s))
                                  for (s2 of u)
                                  if (s2 !== s)
                                    s2])]));

class Solver {

  // (Dict<ix, values>?) -> Solver
  constructor(dict) {
    // Dict<ix, values>
    this._constraints = dict || Dict.build((for (s of cells) [s, digits]));
  }

  // (string) -> Solver | false
  static parse(grid) {
    var solver = new Solver();

    for (var [s, d] of cells.zip(grid.trim())) {
      if (digits.contains(d) && !solver.assign(s, d))
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
    if ((for (d2 of this._constraints.get(s))
         if (d2 !== d)
           this.eliminate(s, d2)).every(x => x)) {
        return this;
    }
    return false;
  }

  // (ix, digit) -> Solver | false
  eliminate(s, d) {
    var self = this; // FIXME: workaround for Traceur bug 1086
    var constraints = this._constraints;

    if (!constraints.get(s).contains(d))
      return this; // Already eliminated

    constraints.set(s, this._constraints.get(s).replace(d, ""));

    if (constraints.get(s).length === 0)
      return false;  // Contradiction: removed last value

    if (constraints.get(s).length === 1) {
      // If there is only one value (d2) left in cell, remove it from peers
      var d2 = constraints.get(s)[0];
      if (!(for (s2 of peers.get(s))
             self.eliminate(s2, d2)).every(x => x)) {
        return false;
      }
    }

    // Now check the places where d appears in the units of s
    for (var u of units.get(s)) {
      var dplaces = [for (s of u)
                     if (constraints.get(s).contains(d))
                       s];

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
    var self = this; // FIXME: workaround for Traceur bug 1086
    var constraints = this._constraints;

    if ((for (s of cells) constraints.get(s).length).every(n => n === 1)) {
      return this; // Solved!
    }

    // Choose the unfilled cell s with the fewest possibilities
    var a = [for (s of cells)
             if (constraints.get(s).length > 1)
               constraints.get(s).length + s].sort();
    var s = a[0].slice(-2);

    return (for (d of constraints.get(s))
              self.clone().assign(s, d))
           .some(solver => solver && solver.solve());
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
    var self = this; // FIXME: workaround for Traceur bug 1086
    var width = 1 + Math.max(...[for (s of cells) self._constraints.get(s).length]);

    var line = "\n" + ["-".repeat(width * 3)].repeat(3).join("+");
    for (var r of rows) {
      lines.push([for (c of cols)
                   center(self._constraints.get(r + c), width) + ("36".contains(c) && "|" || "")]
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
