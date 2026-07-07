class Solution {
public:
    vector<int> exclusiveTime(int n, vector<string>& logs) {
        vector<int> result(n, 0);
        stack<int> st;  // stack of function IDs
        int prevTime = 0;
        
        for(string& log : logs) {
            // Parse the log: "id:start/end:timestamp"
            int pos1 = log.find(':');
            int pos2 = log.find(':', pos1 + 1);
            
            int id = stoi(log.substr(0, pos1));
            string type = log.substr(pos1 + 1, pos2 - pos1 - 1);
            int time = stoi(log.substr(pos2 + 1));
            
            if(type == "start") {
                if(!st.empty()) {
                    // Add time elapsed to the currently running function
                    result[st.top()] += time - prevTime;
                }
                st.push(id);
                prevTime = time;
            } else {  // "end"
                // Add time elapsed to the function that's ending
                result[st.top()] += time - prevTime + 1;
                st.pop();
                prevTime = time + 1;
            }
        }
        
        return result;
    }
};