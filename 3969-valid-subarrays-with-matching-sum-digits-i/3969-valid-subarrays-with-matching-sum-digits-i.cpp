class Solution {
public:
    int countValidSubarrays(vector<int>& nums, int x) {
        int n = nums.size();
        int count = 0;
        for (int l = 0; l < n; ++l) {
            long long s = 0;
            for (int r = l; r < n; ++r) {
                s += nums[r];
                if (s % 10 == x) {
                    long long t = s;
                    while (t >= 10) t /= 10;
                    if (t == x) ++count;
                }
            }
        }
        return count;
    }
};