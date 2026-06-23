class Solution {
public:
    int zigZagArrays(int n, int l, int r) {
        const int MOD = 1e9 + 7;
        int m = r - l + 1;

        vector<long long> up(m, 1), down(m, 1);

        for (int len = 2; len <= n; len++) {
            vector<long long> nUp(m, 0), nDown(m, 0);

            long long pref = 0;
            for (int v = 0; v < m; v++) {
                nUp[v] = pref;
                pref = (pref + down[v]) % MOD;
            }

            long long suf = 0;
            for (int v = m - 1; v >= 0; v--) {
                nDown[v] = suf;
                suf = (suf + up[v]) % MOD;
            }

            up = nUp;
            down = nDown;
        }

        long long total = 0;
        for (int v = 0; v < m; v++)
            total = (total + up[v] + down[v]) % MOD;
        return (int)total;
    }
};