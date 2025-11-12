
import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; // Correct import

import ColorPicker from "./Colorpicker";
import CodeVisualizer from "./CodeVisualizer";

export default function App() {
  const [values, setValues] = useState([0.0625, 0.0625, 0.2]);
  const [weights, setWeights] = useState([49, 49, 78]);
  const [editMode, setEditMode] = useState(false);
  const [rows, setRows] = useState([{ time: "", capacity: "", result: [], minValue: null }]);
  const [showStart, setShowStart] = useState(true);
  const [selectedBubble, setSelectedBubble] = useState("Model");
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);
const [busNames, setBusNames] = useState(["Non AC 001", "Non AC 002", "AC 001"]);

  const tableRef = useRef(null);

  // --- Detect mobile portrait ---
  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth <= 768;
      const isPortrait = window.innerHeight > window.innerWidth;
      setIsMobilePortrait(isMobile && isPortrait);
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  function minValueKnapsackWithItems(values, weights, capacity) {
    const n = values.length;
    const maxWeight = weights.reduce((a, b) => a + b, 0);
    const dp = Array.from({ length: n + 1 }, () => new Array(maxWeight + 1).fill(Infinity));
    const choice = Array.from({ length: n + 1 }, () => new Array(maxWeight + 1).fill(-1));

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
    if (field === "capacity") {
  // Keep whatever user types for display
  updated[index][field] = value;
} else {
  updated[index][field] = value;
}

    setRows(updated);
  };

const handleBusChange = (index, field, value) => {
  if (field === "name") {
    const updated = [...busNames];
    updated[index] = value;
    setBusNames(updated);
  } else if (field === "value") {
    const updated = [...values];
    updated[index] = value;
    setValues(updated);
  } else if (field === "weight") {
    const updated = [...weights];
    updated[index] = value;
    setWeights(updated);
  }
};

useEffect(() => {
  const updated = rows.map((row, index) => {
    if (!row.capacity || isNaN(row.capacity)) 
      return { ...row, result: [], minValue: null };

    const requestedCapacity = parseInt(row.capacity); // use raw input for display

    // Convert time to minutes from midnight
    const timeToMinutes = (timeStr) => {
      if (!timeStr) return null;
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    // Collect buses used in previous rows within 35 mins
    const currentTime = timeToMinutes(row.time);
    let excludedBuses = [];
    for (let i = 0; i < index; i++) {
      const prevTime = timeToMinutes(rows[i].time);
      if (
        prevTime !== null &&
        currentTime !== null &&
        Math.abs(currentTime - prevTime) <= 35
      ) {
        excludedBuses = [...excludedBuses, ...rows[i].result];
      }
    }

    // Filter weights/values to exclude previously used buses
    const filteredValues = values.filter((_, i) => !excludedBuses.includes(i));
    const filteredWeights = weights.filter((_, i) => !excludedBuses.includes(i));

    const totalAvailableCapacity = filteredWeights.reduce((a, b) => a + b, 0);

    if (requestedCapacity >= totalAvailableCapacity) {
      // Return all non-excluded buses
      const allAvailable = filteredWeights.map((_, i) => {
        let count = -1;
        for (let k = 0; k < weights.length; k++) {
          if (!excludedBuses.includes(k)) count++;
          if (count === i) return k;
        }
      });
      return { ...row, result: allAvailable, minValue: null };
    }

    // Otherwise, run knapsack normally
    const [minVal, items] = minValueKnapsackWithItems(
      filteredValues,
      filteredWeights,
      requestedCapacity
    );

    // Map filtered indices back to original indices
    const mappedItems = items.map((i) => {
      let originalIndex = -1, count = -1;
      for (let k = 0; k < values.length; k++) {
        if (!excludedBuses.includes(k)) count++;
        if (count === i) {
          originalIndex = k;
          break;
        }
      }
      return originalIndex;
    });

    return { ...row, result: mappedItems, minValue: minVal };
  });

  setRows(updated);
}, [rows.length, values, weights, rows.map((r) => r.capacity).join(","), rows.map((r) => r.time).join(",")]);

  const addRow = () =>
    setRows([...rows, { time: "", capacity: "", result: [], minValue: null }]);
  const removeRow = (index) => setRows(rows.filter((_, i) => i !== index));
  const toggleEdit = () => setEditMode(!editMode);

  const BubbleSelector = ({ options, selected, setSelected }) => (
    <div style={{ display: "flex", gap: "12px" }}>
      {options.map((item) => (
        <div
          key={item}
          onClick={() => setSelected(item)}
          style={{
            padding: "8px 16px",
            borderRadius: "20px",
            cursor: "pointer",
            border: selected === item ? "2px solid #ffffffff" : "2px solid #000000ff",
            backgroundColor: selected === item ? "#ffffffff" : "#000000ff",
            color: selected === item ? "#000000ff" : "#ffffffff",
            fontWeight: "600",
            transition: "all 0.2s ease",
            userSelect: "none",
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );

const exportPDF = () => {
  const doc = new jsPDF();

  // Table column headers
  const headers = ["Time", "Crowd", "Buses"];

  // Table rows
  const data = rows.map((row) => [
    row.time || "—",
    row.capacity || "—",
    row.result.length > 0 ? row.result.map((r) => `Bus ${r + 1}`).join(", ") : "—",
  ]);

  doc.setFontSize(24);
  doc.text("Bus Allocation Schedule", 10, 15);

  // Correct usage
  autoTable(doc, {
    startY: 25,
    head: [headers],
    body: data,
    styles: { fontSize: 12 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    theme: "grid",
  });

  doc.save("bus_allocation_schedule.pdf");
};


  // --- Render ---
  if (isMobilePortrait) {
    return (
      <div
        style={{
          color: "white",
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "20px",
          fontSize: "18px",
        }}
      >
        Please rotate to landscape mode.
      </div>
    );
  }

  return (
    <div className="main-container show">
      {showStart ? (
        <button className="start-button" onClick={() => setShowStart(false)}>
          Start ->
        </button>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1>Dynamic Bus Allocator</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <BubbleSelector
                options={["Model", "Code"]}
                selected={selectedBubble}
                setSelected={setSelectedBubble}
              />
              <ColorPicker />
            </div>
          </div>

          {selectedBubble === "Code" ? (
            <CodeVisualizer />
          ) : (
            <>
              <section>
                <h2>
                  <span>Specifications of Buses</span>
                  <button style={{
                    margin:"20px",
                  }}onClick={toggleEdit}>{editMode ? "Save" : "Edit"}</button>
                </h2>
                <table>
                  <thead>
                    <tr>
                      <th>Bus</th>
                      <th>Avg Diesel/km</th>
                      <th>Capacity</th>
                    </tr>
                  </thead>
                  <tbody>
  {values.map((v, i) => (
    <tr key={i}>
      <td>
        {editMode ? (
          <input
            type="text"
            value={busNames[i]}
            onChange={(e) => handleBusChange(i, "name", e.target.value)}
          />
        ) : (
          busNames[i]
        )}
      </td>
      <td>
        {editMode ? (
          <input
            type="number"
            step="0.0001"
            value={v}
            onChange={(e) => handleBusChange(i, "value", e.target.value)}
          />
        ) : (
          v
        )}
      </td>
      <td>
        {editMode ? (
          <input
            type="number"
            value={weights[i]}
            onChange={(e) => handleBusChange(i, "weight", e.target.value)}
          />
        ) : (
          weights[i]
        )}
      </td>
    </tr>
  ))}
</tbody>

                </table>
              </section>

              <section ref={tableRef}>
                <h2>Bus Allocation Schedule</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Crowd Number</th>
                      <th>Allotted Buses</th>
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
                            onChange={(e) => handleChange(index, "time", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.capacity}
                            onChange={(e) => handleChange(index, "capacity", e.target.value)}
                            placeholder="Capacity"
                          />
                        </td>
                        <td>
                          {row.result.length > 0
                            ? row.result.map((r) => `Bus ${r + 1}`).join(", ")
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

              <div style={{ marginTop: "20px" }}>
                <button onClick={exportPDF} style={{ padding: "10px 16px", fontSize: "16px" }}>
                  Export as PDF
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
