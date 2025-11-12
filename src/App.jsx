import React, { useState, useEffect } from "react";

export default function App() {
  const [values, setValues] = useState([0.0625, 0.0625, 0.2]);
  const [weights, setWeights] = useState([49, 49, 78]);
  const [capacity, setCapacity] = useState(98);
  const [result, setResult] = useState([]);

  function knapsackItems01(values, weights, capacity) {
    const n = values.length;
    const maxWeight = weights.reduce((a, b) => a + b, 0);
    if (maxWeight < capacity) return [...Array(n).keys()];

    const dp = new Array(maxWeight + 1).fill(Infinity);
    const choice = new Array(maxWeight + 1).fill(-1);
    dp[0] = 0;

    for (let i = 0; i < n; i++) {
      for (let w = maxWeight; w >= weights[i]; w--) {
        if (dp[w - weights[i]] + values[i] < dp[w]) {
          dp[w] = dp[w - weights[i]] + values[i];
          choice[w] = i;
        }
      }
    }

    let minWeight = -1;
    for (let w = capacity; w <= maxWeight; w++) {
      if (dp[w] !== Infinity) {
        minWeight = w;
        break;
      }
    }
    if (minWeight === -1) return [...Array(n).keys()];

    const itemsUsed = [];
    let w = minWeight;
    while (w > 0 && choice[w] !== -1) {
      const i = choice[w];
      itemsUsed.push(i);
      w -= weights[i];
    }

    return itemsUsed;
  }

  useEffect(() => {
    const items = knapsackItems01(values, weights, capacity);
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
          <h2 className="font-semibold text-lg mb-3 text-gray-800">
            Bus Data
          </h2>
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
        </div>
      </div>
    </div>
  );
}
