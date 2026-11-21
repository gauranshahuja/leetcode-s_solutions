/**
 * @param {number[]} nums
 * @return {number}
 */
var missingNumber = function (nums) {
    const n = nums.length;
    let missing = (n * (n + 1)) / 2;
    for (const x of nums) missing -= x;
    return missing;
};