class Solution {
    static const int MOD = 1e9 + 7;
    int n;
    vector<long long> val, sum;
    vector<int> cnt;
    vector<long long> pw;
    string s;
    void build(int nd, int l, int r) {
        if (l == r) { int d = s[l] - '0'; if (d) { val[nd] = d; cnt[nd] = 1; sum[nd] = d; } return; }
        int m = (l + r) / 2; build(2*nd, l, m); build(2*nd+1, m+1, r); pull(nd);
    }
    void pull(int nd) {
        int a = 2*nd, b = 2*nd+1;
        cnt[nd] = cnt[a] + cnt[b];
        sum[nd] = (sum[a] + sum[b]) % MOD;
        val[nd] = (val[a] * pw[cnt[b]] + val[b]) % MOD;
    }
    array<long long,3> qry(int nd, int l, int r, int ql, int qr) {
        if (qr < l || r < ql) return {0, 0, 0};
        if (ql <= l && r <= qr) return {val[nd], (long long)cnt[nd], sum[nd]};
        int m = (l + r) / 2;
        auto L = qry(2*nd, l, m, ql, qr), R = qry(2*nd+1, m+1, r, ql, qr);
        return {(L[0]*pw[R[1]] + R[0]) % MOD, L[1] + R[1], (L[2] + R[2]) % MOD};
    }
public:
    vector<int> sumAndMultiply(string s_, vector<vector<int>>& queries) {
        s = s_; n = s.size();
        val.assign(4*n, 0); sum.assign(4*n, 0); cnt.assign(4*n, 0);
        pw.assign(n+1, 1); for (int i = 1; i <= n; i++) pw[i] = pw[i-1] * 10 % MOD;
        build(1, 0, n-1);
        vector<int> ans;
        for (auto& q : queries) { auto r = qry(1, 0, n-1, q[0], q[1]); ans.push_back((int)(r[0]*r[2] % MOD)); }
        return ans;
    }
};