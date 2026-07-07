class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n = temperatures.size();
        vector<int> result(n, 0);
        stack<int> st;  // indices, jinka warmer din abhi tak nahi mila
        
        for(int i = 0; i < n; i++) {
            // Jab tak stack top ka temp current se chhota hai, match ho gaya
            while(!st.empty() && temperatures[st.top()] < temperatures[i]) {
                int idx = st.top();
                st.pop();
                result[idx] = i - idx;  // kitne din baad warmer mila
            }
            st.push(i);
        }
        
        return result;
    }
};