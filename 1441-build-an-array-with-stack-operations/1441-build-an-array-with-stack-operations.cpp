class Solution {
public:
    vector<string> buildArray(vector<int>& target, int n) {
        vector<string> result;
        int current = 1;  // Current number from stream [1, n]
        int targetIdx = 0;  // Index in target array
        
        while(targetIdx < target.size()) {
            // If current number matches target number, push it
            if(current == target[targetIdx]) {
                result.push_back("Push");
                targetIdx++;
            } else {
                // Otherwise, push and pop (skip this number)
                result.push_back("Push");
                result.push_back("Pop");
            }
            current++;
        }
        
        return result;
    }
};