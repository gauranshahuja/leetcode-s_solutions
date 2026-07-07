class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {
        int n = heights.size();
        stack<int> st;  // indices, jinki height ka rectangle abhi complete nahi hua
        int maxArea = 0;
        
        for(int i = 0; i <= n; i++) {
            // Jab i == n, ek bahut chhota height (0) treat karo taaki sab pop ho jaye
            int currHeight = (i == n) ? 0 : heights[i];
            
            // Jab tak stack top ki height current se badi hai, uska rectangle complete karo
            while(!st.empty() && heights[st.top()] > currHeight) {
                int height = heights[st.top()];
                st.pop();
                
                // Width nikalna: agar stack empty hai toh start se yahan tak, warna beech mein
                int width = st.empty() ? i : i - st.top() - 1;
                
                maxArea = max(maxArea, height * width);
            }
            st.push(i);
        }
        
        return maxArea;
    }
};