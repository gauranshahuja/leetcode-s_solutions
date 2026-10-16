# Day 107 - Restore IP Addresses

LeetCode 93 · Medium · Backtracking plus validation · Friday, 16 October 2026 · ~30 min, 2 attempts

## Problem

Insert three dots into a string of digits to make a valid IPv4 address. Return
every possible address. No reordering, no dropping digits.

A segment is valid when:

- it is 1 to 3 digits long
- it has no leading zero unless it is exactly `"0"`
- its value is `<= 255`

```
"25525511135"  ->  ["255.255.11.135", "255.255.111.35"]
"0000"         ->  ["0.0.0.0"]
"101023"       ->  ["1.0.10.23", "1.0.102.3", "10.1.0.23", "10.10.2.3", "101.0.2.3"]
```

## Shape of the search

This is the Day 105 partition skeleton with a cap on the number of pieces. At
each step the only choice is *how many digits the next segment takes*, and
there are three options. Four segments, so the tree has at most `3^4 = 81`
leaves - for any input length. Nice change from yesterday's genuine exponential.

```
back(start):
  if parts.length === 4:
      if start === s.length: record parts.join('.')
      return
  for len in 1..3, while start + len <= s.length:
      seg = s[start .. start+len-1]
      reject seg -> stop
      push seg, back(start + len), pop
```

## The two halves of the base case

My first version was:

```js
if (parts.length === 4) { out.push(parts.join('.')); return; }
```

which happily returned `"1.1.1.1"` for the input `"11112"` - four valid
segments, one digit abandoned at the end. The base case has to check **both**
that four segments exist and that the string is used up:

```js
if (parts.length === 4) {
  if (start === s.length) out.push(parts.join('.'));
  return;
}
```

The mirror case (string used up but fewer than 4 segments) handles itself: the
`for` loop's `start + len <= s.length` guard finds no legal length, so the
branch dies with nothing recorded.

## Validation, and why both checks `break`

```js
if (seg.length > 1 && seg[0] === '0') break;
if (Number(seg) > 255) break;
```

Both are `break`, not `continue`. A segment starting with `0` and longer than
one digit keeps that leading zero as it grows, and a value over 255 only gets
bigger when you append a digit. So once a length fails, every longer length
from this `start` fails and the loop is done.

Order matters between them: check the leading zero first. `Number("012")` is 12,
which passes the `<= 255` test and would be silently accepted.

## Dry run

`"010010"`. First segment must be `"0"` - `"01"` and `"010"` are killed by the
leading-zero rule.

| parts so far | start | len tried | seg     | verdict                        |
| ------------ | ----- | --------- | ------- | ------------------------------ |
| -            | 0     | 1         | `0`     | ok                             |
| `0`          | 1     | 1         | `1`     | ok                             |
| `0,1`        | 2     | 1         | `0`     | ok                             |
| `0,1,0`      | 3     | 1-3       | `0`,`01`,`010` | 4th seg must end the string; `0` leaves digits, `01`/`010` leading zero -> dead |
| `0,1`        | 2     | 2         | `00`    | leading zero -> **break**      |
| `0`          | 1     | 2         | `10`    | ok                             |
| `0,10`       | 3     | 1         | `0`     | ok                             |
| `0,10,0`     | 4     | 2         | `10`    | ok, start === 6 -> `0.10.0.10` |
| `0`          | 1     | 3         | `100`   | ok                             |
| `0,100`      | 4     | 1         | `1`     | ok                             |
| `0,100,1`    | 5     | 1         | `0`     | ok, start === 6 -> `0.100.1.0` |

Two answers, and the leading-zero rule did most of the pruning.

## Edge case that bit me

`"010010"` is the one worth keeping as a test. With a sloppy zero check you get
`"0.10.01.0"` or `"01.0.01.0"` in the output and the examples never catch it,
because the examples have no interior zeros.

I also added the length gate up front:

```js
if (s.length < 4 || s.length > 12) return out;
```

Four segments of 1-3 digits cover 4 to 12 characters, full stop. Not strictly
necessary - the search would return `[]` anyway - but it says the constraint out
loud, which is worth a line.

## Complexity

- Time: `O(1)`. Capped at `3^4` segmentations with `O(1)` validation each. It
  feels like backtracking but the bound is constant.
- Space: `O(1)` for the recursion (depth 4) plus whatever the output needs.

## Takeaway

When a backtracking problem fixes the number of pieces, check the piece count
and the consumed length in the base case. One without the other is the
classic wrong answer, and it passes the sample tests.

The "a failing validity check means break, not continue" reasoning showed up
yesterday too (sorted candidates overshooting the target on Day 106). Same
thought: is this check monotone in the loop variable? If yes, stop.
