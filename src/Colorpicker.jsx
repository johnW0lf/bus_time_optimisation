import React from "react";

const themes = {
  red: {
    main: "#f63c48",
    dark: "#85262c",
    mid: "#dc333e",
    hover: "#971b2c",
    "section-bg": "#F64651"
  },
  blue: {
    main: "#3c6ff6",
    dark: "#253e85",
    mid: "#335edc",
    hover: "#2949a5",
    "section-bg": "#4672F6"
  },
  green: {
    main: "#30c04a",
    dark: "#1d6e2c",
    mid: "#27a83f",
    hover: "#228d36",
    "section-bg": "#34d255"
  },
  yellow: {
    main: "#f6d33c",
    dark: "#b19726",
    mid: "#e5c030",
    hover: "#c6a726",
    "section-bg": "#f9da55"
  },
  purple: {
    main: "#a43cf6",
    dark: "#6b28a8",
    mid: "#8f33dc",
    hover: "#7a2cbf",
    "section-bg": "#b14df9"
  }
};

const ColorPicker = () => {
  const handleColorChange = (color) => {
    const theme = themes[color];
    for (const [key, value] of Object.entries(theme)) {
      document.documentElement.style.setProperty(`--${key}`, value);
    }
  };

  return (
    <div className="color-picker">
      {Object.entries(themes).map(([color, shades]) => (
        <div
          key={color}
          className="color-circle"
          style={{ backgroundColor: shades.main }}
          onClick={() => handleColorChange(color)}
        ></div>
      ))}
    </div>
  );
};

export default ColorPicker;
