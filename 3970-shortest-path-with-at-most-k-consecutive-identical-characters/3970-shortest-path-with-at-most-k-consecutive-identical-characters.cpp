class Solution {
public:
    int shortestPath(int n, vector<vector<int>>& edges, string labels, int k) {
        vector<vector<pair<int,int>>> adj(n);
        for (auto& e : edges)
            adj[e[0]].push_back({e[1], e[2]});
        const long long INF = LLONG_MAX;
        vector<vector<long long>> dist(n, vector<long long>(k + 1, INF));
        dist[0][1] = 0;
        priority_queue<tuple<long long,int,int>,
                       vector<tuple<long long,int,int>>,
                       greater<>> pq;
        pq.push({0, 0, 1});
        while (!pq.empty()) {
            auto [cost, u, run] = pq.top();
            pq.pop();
            if (cost > dist[u][run]) continue;
            if (u == n - 1) return (int)cost;
            for (auto& [v, w] : adj[u]) {
                int nr;
                if (labels[v] == labels[u]) {
                    nr = run + 1;
                    if (nr > k) continue;
                } else {nr = 1;}
                long long nc = cost + w;
                if (nc < dist[v][nr]) {
                    dist[v][nr] = nc;
                    pq.push({nc, v, nr});
                }
            }
        }
        return -1;
    }
};