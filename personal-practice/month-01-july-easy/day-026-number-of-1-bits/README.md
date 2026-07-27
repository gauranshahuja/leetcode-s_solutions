# Day 026 - Number of 1 Bits

LeetCode 191 · Easy · Bit manipulation · Monday, 27 July 2026 · ~22 min, 3 attempts

## Problem

Count the 1s in the binary form of a 32-bit integer.

```
11          -> 3      (0000...1011)
128         -> 1      (0000...10000000)
2147483645  -> 30     (0111...1101, so 31 bits minus the one 0)
```

The input is specified as **unsigned**, which matters more in JS than it
sounds like it should.

## Where I started

Shift the number right one bit at a time, add the bottom bit to a counter,
stop after 32 steps.

```js
let bits = n;
for (let i = 0; i < 32; i += 1) {
  count += bits & 1;
  bits >>= 1;        // <- this is the bug
}
```

## The bug, which is pure JavaScript

`>>` is the **arithmetic** right shift: it copies the sign bit as it shifts.
So for a negative input the number never empties out:

```
-1 >> 1   ->  -1
-1 >> 1   ->  -1        forever
```

My loop was bounded at 32 so it did not hang, but it counted 32 ones for every
negative input. The fix is `>>>`, the unsigned shift, which feeds a 0 into the
top:

```
-1 >>> 1  ->  2147483647
```

While I was at it I also learned that `n >>> 0` on its own is the standard way
to say "read these 32 bits as unsigned". `-3 >>> 0` is `4294967293`, which is
the 0xFFFFFFFD I wanted all along. Both of my functions start with that line
now.

The underlying thing I did not know this morning: **every bitwise operator in
JS converts its operands to signed 32-bit ints first**, even though regular
numbers are doubles. `>>>` is the one exception that produces an unsigned
result.

## The better loop - Brian Kernighan

Looked this up after I had the shift version working, because 32 iterations to
count a single bit in `128` felt wasteful.

`n & (n - 1)` clears the lowest set bit. Why:

```
n       = 1011_1000
n - 1   = 1011_0111     the lowest 1 flipped to 0, the zeros under it to 1
n & (n-1) = 1011_0000   that one bit is gone, everything above untouched
```

Subtracting 1 can only ever disturb the lowest set bit and the zeros below it,
so the AND keeps the higher bits exactly as they were and deletes precisely
one 1. Loop until the number is 0 and count the iterations.

That makes the loop run **once per set bit** instead of once per bit position.

## Dry run

`n = 11` (`1011`)

| step | bits before | bits - 1 | bits after | count |
| ---- | ----------- | -------- | ---------- | ----- |
| 1    | `1011`      | `1010`   | `1010`     | 1     |
| 2    | `1010`      | `1001`   | `1000`     | 2     |
| 3    | `1000`      | `0111`   | `0000`     | 3  |

Three steps, three set bits. For `128` it is one step.

## Third attempt, small annoyance

With `bits &= bits - 1` the value flips negative as soon as the top bit is
involved, because the AND hands back a signed int. The loop still terminates
(`-2147483648 & 2147483647` is 0) but I had to trace it on paper to believe
that, so I wrapped the assignment in `>>> 0` to keep `bits` inside
`0 .. 2^32-1` the whole way through. Same answer, no head scratching next time
I read it.

## Complexity

| Version           | Time                | Space  |
| ----------------- | ------------------- | ------ |
| Shift 32 times    | `O(32)` = `O(1)`    | `O(1)` |
| Kernighan         | `O(set bits)`, <= 32 | `O(1)` |

Both are constant time for a fixed 32-bit input. The difference only shows up
for sparse numbers, or if the idea gets reused on a 64-bit value.

## Note to self

`n & (n - 1)` clears the lowest set bit. `n & -n` isolates it. Those two are
worth memorising, they show up in "is this a power of two" as well
(`n > 0 && (n & (n - 1)) === 0`).

Second bit problem in two days, and both were one line once I knew the
identity. The hard part is not the loop, it is knowing the identity exists.
Also: in JS, assume nothing about bitwise ops until I have checked what
happens to a negative input.
