import React, { useState, useEffect } from "react";

export default function App() {
  const [values, setValues] = useState([0.0625, 0.0625, 0.2]);
  const weights = [49, 49, 78];
  const [capacity, setCapacity] = useState(78);
  const [result, setResult] = useState([]);
  const [minValue, setMinValue] = useState(null);

  function minValueKnapsackWithItems(values, weights, capacity) {
    const n = values.length;
    const maxWeight = weights.reduce((a, b) => a + b, 0);
    const dp = Array.from({ length: n + 1 }, () =>
      new Array(maxWeight + 1).fill(Infinity)
    );
    const choice = Array.from({ length: n + 1 }, () =>
      new Array(maxWeight + 1).fill(-1)
    );

    dp[0][0] = 0;

    // 0/1 Knapsack (no item reuse)
    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= maxWeight; w++) {
        dp[i][w] = dp[i - 1][w];
        choice[i][w] = choice[i - 1][w];

        if (weights[i - 1] <= w) {
          const newVal = dp[i - 1][w - weights[i - 1]] + values[i - 1];
          if (newVal < dp[i][w]) {
            dp[i][w] = newVal;
            choice[i][w] = i - 1;
          }
        }
      }
    }

    // Find min value for weight >= capacity
    let minWeight = capacity;
    for (let w = capacity; w <= maxWeight; w++) {
      if (dp[n][w] < dp[n][minWeight]) {
        minWeight = w;
      }
    }

    // Backtrack to find chosen items
    let w = minWeight;
    const itemsUsed = [];
    for (let i = n; i > 0 && w > 0; i--) {
      if (choice[i][w] !== -1) {
        const item = choice[i][w];
        if (dp[i][w] !== dp[i - 1][w]) {
          itemsUsed.push(item);
          w -= weights[item];
        }
      }
    }

    return [dp[n][minWeight], itemsUsed.reverse()];
  }

  useEffect(() => {
    const [minVal, items] = minValueKnapsackWithItems(values, weights, capacity);
    setMinValue(minVal);
    setResult(items);
  }, [capacity]);

  return (
    <div className="min-h-screen flex items-center justify-start bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center space-y-6 ml-10">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Bus Allocation Optimizer
        </h1>

        <div className="space-y-2">
          <label className="font-medium text-gray-700">
            Capacity: {capacity}
          </label>
          <input
            type="range"
            min="0"
            max={weights.reduce((a, b) => a + b, 0)}
            value={capacity}
            onChange={(e) => setCapacity(parseInt(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold text-lg mb-3 text-gray-800">Bus Data</h2>
          <table className="w-full text-sm border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Bus</th>
                <th className="border p-2">Value</th>
                <th className="border p-2">Weight</th>
              </tr>
            </thead>
            <tbody>
              {values.map((v, i) => (
                <tr
                  key={i}
                  className={
                    result.includes(i)
                      ? "bg-green-100 font-semibold"
                      : "bg-white"
                  }
                >
                  <td className="border p-2">Bus {i + 1}</td>
                  <td className="border p-2">{v}</td>
                  <td className="border p-2">{weights[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold text-lg text-gray-800">
            Selected Buses:
          </h2>
          <p className="text-gray-700 mt-2">
            {result.length > 0
              ? result.map((r) => `Bus ${r + 1}`).join(", ")
              : "None"}
          </p>
          <p className="text-gray-700 mt-2">
            Minimum Value: {minValue !== null ? minValue.toFixed(4) : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
