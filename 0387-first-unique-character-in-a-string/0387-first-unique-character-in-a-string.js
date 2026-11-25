var firstUniqChar = function(s) {
    const count = new Array(26).fill(0);
    // pass 1: har letter gino ('a' ka code 97 hai, toh 'a' -> 0, 'b' -> 1 ...)
    for (const ch of s) count[ch.charCodeAt(0) - 97]++;
    // pass 2: left se pehla letter jiski ginti 1 hai
    for (let i = 0; i < s.length; i++) {
        if (count[s.charCodeAt(i) - 97] === 1) return i;
    }
    return -1;
};