import React, { useState, useEffect } from "react";
import "./index.css";
import ColorPicker from "./Colorpicker";

export default function App() {
  const [values, setValues] = useState([0.0625, 0.0625, 0.2]);
  const [weights, setWeights] = useState([49, 49, 78]);
  const [rows, setRows] = useState([{ time: "", capacity: "", result: [], minValue: null }]);
  const [showStart, setShowStart] = useState(true);

  // === 0/1 Knapsack ===
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
    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= maxWeight; w++) {
        dp[i][w] = dp[i - 1][w];
        if (weights[i - 1] <= w) {
          const newVal = dp[i - 1][w - weights[i - 1]] + values[i - 1];
          if (newVal < dp[i][w]) {
            dp[i][w] = newVal;
            choice[i][w] = i - 1;
          }
        }
      }
    }

    let minWeight = capacity;
    for (let w = capacity; w <= maxWeight; w++) {
      if (dp[n][w] < dp[n][minWeight]) minWeight = w;
    }

    let w = minWeight;
    const itemsUsed = [];
    for (let i = n; i > 0 && w > 0; i--) {
      const item = choice[i][w];
      if (item !== -1 && dp[i][w] !== dp[i - 1][w]) {
        itemsUsed.push(item);
        w -= weights[item];
      }
    }

    return [dp[n][minWeight], itemsUsed.reverse()];
  }

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  useEffect(() => {
    const updated = rows.map((row) => {
      if (!row.capacity || isNaN(row.capacity))
        return { ...row, result: [], minValue: null };
      const [minVal, items] = minValueKnapsackWithItems(
        values,
        weights,
        parseInt(row.capacity)
      );
      return { ...row, result: items, minValue: minVal };
    });
    setRows(updated);
  }, [rows.length, values, weights, rows.map(r => r.capacity).join(",")]);

  const addRow = () =>
    setRows([...rows, { time: "", capacity: "", result: [], minValue: null }]);
  const removeRow = (index) => setRows(rows.filter((_, i) => i !== index));

  return (
    <div className="main-container show">
      {showStart ? (
        <button className="start-button" onClick={() => setShowStart(false)}>
          Start ->
        </button>
      ) : (
        <div>
          <h1>Bus Allocation Schedule</h1>

          <section>
            <h2>Available Buses</h2>
            <p className="sub">Capacities are given in the table</p>
            <table>
              <thead>
                <tr>
                  <th>Bus</th>
                  <th>Value</th>
                  <th>Weight</th>
                </tr>
              </thead>
              <tbody>
                {values.map((v, i) => (
                  <tr key={i}>
                    <td>Bus {i + 1}</td>
                    <td>{v}</td>
                    <td>{weights[i]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Capacity</th>
                  <th>Allotted Buses</th>
                  <th>Avg Diesel</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="time"
                        value={row.time}
                        onChange={(e) =>
                          handleChange(index, "time", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.capacity}
                        onChange={(e) =>
                          handleChange(index, "capacity", e.target.value)
                        }
                        placeholder="Capacity"
                      />
                    </td>
                    <td>
                      {row.result.length > 0
                        ? row.result.map((r) => `Bus ${r + 1}`).join(", ")
                        : "—"}
                    </td>
                    <td>
                      {row.minValue !== null
                        ? row.minValue.toFixed(4)
                        : "—"}
                    </td>
                    <td>
                      <button onClick={() => removeRow(index)}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={addRow} style={{ marginTop: "12px" }}>
              + Add Row
            </button>
          </section>

          <ColorPicker />
        </div>
      )}
    </div>
  );
}
