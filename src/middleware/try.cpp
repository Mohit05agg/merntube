#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
#include <climits>

using namespace std;

const int INF = INT_MAX;

struct Cell {
    int x, y;
};

int main() {
    int N, M;
    cin >> N >> M;

    vector<vector<int>> grid(N, vector<int>(M));
    vector<vector<int>> distance(N, vector<int>(M, INF));
    vector<vector<long long>> dp(N, vector<long long>(M, -INF));

    for (int i = 0; i < N; ++i) {
        for (int j = 0; j < M; ++j) {
            cin >> grid[i][j];
        }
    }

    queue<Cell> q;

    // Initialize BFS for finding distances to nearest lanterns
    for (int i = 0; i < N; ++i) {
        for (int j = 0; j < M; ++j) {
            if (grid[i][j] == 0) {
                q.push({i, j});
                distance[i][j] = 0;
            }
        }
    }

    vector<int> dx = {-1, 1, 0, 0};
    vector<int> dy = {0, 0, -1, 1};

    while (!q.empty()) {
        Cell current = q.front();
        q.pop();

        for (int i = 0; i < 4; ++i) {
            int nx = current.x + dx[i];
            int ny = current.y + dy[i];

            if (nx >= 0 && ny >= 0 && nx < N && ny < M && distance[nx][ny] == INF) {
                distance[nx][ny] = distance[current.x][current.y] + 1;
                q.push({nx, ny});
            }
        }
    }

    dp[0][0] = grid[0][0];

    for (int i = 0; i < N; ++i) {
        for (int j = 0; j < M; ++j) {
            if (i > 0) {
                dp[i][j] = max(dp[i][j], dp[i - 1][j] + grid[i][j] - distance[i][j]);
            }
            if (j > 0) {
                dp[i][j] = max(dp[i][j], dp[i][j - 1] + grid[i][j] - distance[i][j]);
            }
        }
    }

    cout << dp[N - 1][M - 1] << endl;

    return 0;
}
