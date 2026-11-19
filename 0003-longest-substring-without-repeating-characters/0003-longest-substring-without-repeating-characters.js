/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  const last = new Map(); // char -> last index jahan dikha
  let l = 0;              // window ka left end
  let best = 0;

  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    if (last.has(c)) {
      // Math.max: purana index window se bahar ho to l peeche nahi jaana chahiye ("abba")
      l = Math.max(l, last.get(c) + 1);
    }
    last.set(c, r);
    best = Math.max(best, r - l + 1);
  }

  return best;
};
