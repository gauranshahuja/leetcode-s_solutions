class Solution {
public:
    vector<int> smallerNumbersThanCurrent(vector<int>& nums) {
        int n=nums.size();
        vector<int> ans(n,0);
        for(int i=0;i<n;i++){
            int a=nums[i];
            for(int j=0;j<n;j++){
                if(a>nums[j])
                ans[i]+=1;
            }
        }
        return ans;
    }
};