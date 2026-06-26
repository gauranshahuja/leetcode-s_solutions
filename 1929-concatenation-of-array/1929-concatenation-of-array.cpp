class Solution {
public:
    vector<int> getConcatenation(vector<int>& nums) {
        int n=nums.size();
        vector<int> ans(2*n);
        int i=0;
        for(i;i<n;i++){
           ans[i] =nums[i];
        }
        int j=i;
        int k =0;
        if (i==n){
            i=0;
           for(i;i<n;i++){
            ans[j]=nums[k];
            k=k+1;
            j++;
        } 
        }
        return ans;
    }
};