# Sudoku solving in several styles

Several different ports of [Norvig's Sudoku solver](http://norvig.com/sudoku.html) to JavaScript, to elucidate differences between a few features:

* the originally planned ES6 comprehensions;
* a possible ES7 proposal to generalize and supersede those comprehensions;
* combinator methods with arrow-function shorthand

# Building

With [traceur](https://github.com/google/traceur-compiler) in your PATH, type
```
make && node build/demo.js
```

# Understanding the code

The Sudoku board layout is:

```
A1 A2 A3 | A4 A5 A6 | A7 A8 A9
B1 B2 B3 | B4 B5 B6 | B7 B8 B9
C1 C2 C3 | C4 C5 C6 | C7 C8 C9
---------+----------+---------
D1 D2 D3 | D4 D5 D6 | D7 D8 D9
E1 E2 E3 | E4 E5 E6 | E7 E8 E9
F1 F2 F3 | F4 F5 F6 | F7 F8 F9
---------+----------+---------
G1 G2 G3 | G4 G5 G6 | G7 G8 G9
H1 H2 H3 | H4 H5 H6 | H7 H8 H9
I1 I2 I3 | I4 I5 I6 | I7 I8 I9
```

I've documented the code with type annotations in the comments. The types used
for indexing into the Sudoku board are:

```typescript
type rx = 'A' | .. | 'I'
type cx = '1' | .. | '9'
type ix = "${rx}{cx}"
type digit = '1' | .. | '9'

type row = [ix x 9]
type col = [ix x 9]
type block = [ix x 9]

type unit = [row, col, block]

type values = [digit x k]
  where 0 <= k <= 9
```

# License

MIT

