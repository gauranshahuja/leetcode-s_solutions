class Solution {
public:
    int strStr(string haystack, string needle) {
        string s;

        int n = needle.size();
        int h = haystack.size();

        if(h < n)
            return -1;

        if(h == n && needle == haystack)
            return 0;

        for(int i = 0; i <= h - n; i++) {

            if(haystack[i] == needle[0]) {

                s = haystack.substr(i, n);

                if(s == needle)
                    return i;
            }
        }

        return -1;
    }
};