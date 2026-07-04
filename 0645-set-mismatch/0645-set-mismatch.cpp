class Solution {
public:
    vector<int> findErrorNums(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        int n = nums.size();
        vector<int> ans(2, -1);

        if (nums[0] != 1) ans[1] = 1;
        if (nums[n-1] != n) ans[1] = n;

        for (int i = 1; i < n; i++) {
            if (nums[i] == nums[i-1]) {
                ans[0] = nums[i];
            } else if (nums[i] - nums[i-1] == 2) {
                ans[1] = nums[i-1] + 1;
            }
        }
        return ans;
    }
};