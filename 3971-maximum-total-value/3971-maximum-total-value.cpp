class Solution {
public:
    int maxTotalValue(vector<int>& value, vector<int>& decay, int m) {
        const long long MOD = 1e9 + 7;
        int n = value.size();
        auto countGE = [&](long long T) -> long long {
            long long cnt = 0;
            for (int i = 0; i < n; i++)
                if (value[i] >= T)
                    cnt += (value[i] - T) / decay[i] + 1;
            return cnt;
        };
        auto sumGE = [&](long long S) -> long long {
            long long total = 0;
            for (int i = 0; i < n; i++) {
                if (value[i] < S) continue;
                long long k = (value[i] - S) / decay[i] + 1;
                long long gauss = (k * (k - 1) / 2) % MOD;
                long long t1 = (k % MOD) * value[i] % MOD;
                long long t2 = (long long)decay[i] * gauss % MOD;
                total = (total + (t1 - t2) % MOD + MOD) % MOD;
            }
            return total;
        };
        long long totalPositive = countGE(1);
        if (totalPositive <= m) return (int)sumGE(1);
        long long lo = 1, hi = *max_element(value.begin(), value.end()), T = 1;
        while (lo <= hi) {
            long long mid = lo + (hi - lo) / 2;
            if (countGE(mid) >= m) { T = mid; lo = mid + 1; }
            else hi = mid - 1;
        }
        long long above = countGE(T + 1);
        long long fill = (m - above) % MOD * (T % MOD) % MOD;
        return (int)((sumGE(T + 1) + fill) % MOD);
    }
};