class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
            string first = strs[0];
            for(int i=0; i<first.size();i++){
                char c=first[i];
                for(int j=1; j<strs.size();j++){
                    string str=strs[j];
                    if(str[i]!=c)
                        return first.substr(0,i);
            }
        }
        return first;
        }
};