import React, { useState } from "react";

export default function CodeVisualizer() {
  const code = `def min_value_knapsack_with_items(values, weights, capacity):
    n = len(values)
    max_weight = sum(weights)
    dp = [float('inf')] * (max_weight + 1)
    choice = [-1] * (max_weight + 1)
    used = [[False] * n for _ in range(max_weight + 1)]  # track used items
    dp[0] = 0

    for i in range(n):  # iterate item-first to ensure single use
        for w in range(max_weight, weights[i] - 1, -1):
            if dp[w - weights[i]] + values[i] < dp[w]:
                dp[w] = dp[w - weights[i]] + values[i]
                choice[w] = i
                used[w] = used[w - weights[i]].copy()
                used[w][i] = True

    # Find minimum value for any weight >= capacity
    min_weight = capacity
    for w in range(capacity, max_weight + 1):
        if dp[w] < dp[min_weight]:
            min_weight = w

    # Get items used
    items_used = [i for i, u in enumerate(used[min_weight]) if u]

    return dp[min_weight], items_used


values = [0.0625, 0.0625, 0.2]
weights = [49, 49, 78]
capacity = 99

min_val, items = min_value_knapsack_with_items(values, weights, capacity)
print("Minimum value:", min_val)
print("Items used (indices):", items)
`;

  const [highlightedLine, setHighlightedLine] = useState(null);

  return (
    <div
      style={{
        backgroundColor: "#e8dbb5ff",
        fontSize:"36px",  
        minHeight: "100vh",
        padding: "2rem",
        borderRadius: "42px",
        fontFamily: "'Fira Code', monospace",
        overflowX: "auto",
        textAlign:"left"
      }}
    >
      <h2 style={{ textAlign: "Left", marginBottom: "1rem" }}>
        Bus allocation - Algorithm
      </h2>
      <pre
        style={{
          backgroundColor: "#e8dbb5ff",
          padding: "1rem",
          borderRadius: "10px",
          lineHeight: "1.5",
          fontSize: "14px",
        }}
      >
        {code.split("\n").map((line, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: idx === highlightedLine ? "#fff8e5ff" : "transparent",
              borderRadius: "5px",
              padding: "0 5px",
            }}
            onMouseEnter={() => setHighlightedLine(idx)}
            onMouseLeave={() => setHighlightedLine(null)}
          >
            <span style={{ color: "#555", marginRight: "10px" }}>{idx + 1}</span>
            <span>{line}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}
