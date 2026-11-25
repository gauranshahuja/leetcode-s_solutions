var canConstruct = function(ransomNote, magazine) {
    if (ransomNote.length > magazine.length) return false;
    const count = new Array(26).fill(0);
    for (const ch of magazine) count[ch.charCodeAt(0) - 97]++;
    for (const ch of ransomNote) {
        if (--count[ch.charCodeAt(0) - 97] < 0) return false;
    }
    return true;
};