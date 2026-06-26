class Solution {
public:
    vector<int> tree;
    int N;
    void update(int i){
        while(i < N){
            tree[i] += 1;
            i += i & (-i);
        }
    }
    int query(int i){
        int sum = 0;
        while(i > 0){
            sum += tree[i];
            i -= i & (-i);
        }
        return sum;
    }
    long long countMajoritySubarrays(vector<int>& nums, int target) {
        int n = nums.size();
        N = 2 * n + 2;
        tree.assign(N, 0);

        long long answer = 0;
        int prefix = 0;
        int shift = n + 1;
        update(prefix + shift);
        for(int i = 0; i < n; i++){
            if(nums[i] == target){
                prefix = prefix + 1;
            } else {
                prefix = prefix - 1;
            }
            answer += query(prefix + shift - 1);
            update(prefix + shift);
        }
        return answer;
    }
};