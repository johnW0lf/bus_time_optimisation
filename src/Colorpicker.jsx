import React from "react";

const themes = {
     offWhite: {
  main: "#e8e2cf",       // warm cream base (primary tone)
  dark: "#d3c494ff",       // soft muted beige (for headers or darker accents)
  mid: "#f2ecda",        // light creamy cell/element color
  hover: "#ded6bd",      // slightly deeper cream for hover
  "section-bg": "#e8dbb5ff" // subtle off-white section background
}
,
 red: {
  main: "#e07b7b",       // warm muted red
  dark: "#b55a5a",       // darker accent for headers/buttons
  mid: "#f1a1a1",        // lighter red for cards or cells
  hover: "#d96c6c",      // hover slightly deeper than main
  "section-bg": "#f4c1c1" // soft red background for sections
},
blue: {
  main: "#7baee8",       // soft sky blue
  dark: "#557fa9",       // deeper muted blue
  mid: "#a1c7f1",        // light blue for cells
  hover: "#6697d1",      // slightly deeper blue on hover
  "section-bg": "#c2d9f7" // subtle blue section background
},
green: {
  main: "#7cd28c",       // pastel green
  dark: "#4d9a59",       // deeper green accent
  mid: "#a3e2b0",        // lighter green for cells
  hover: "#66b875",      // hover shade
  "section-bg": "#c6f4d1" // soft green background
},
yellow: {
  main: "#f7e27c",       // soft warm yellow
  dark: "#bfa83f",       // muted mustard yellow
  mid: "#f9f1a1",        // light yellow for cells
  hover: "#eedc66",      // hover shade
  "section-bg": "#fef4c2" // subtle yellow section background
},
purple: {
  main: "#c39ce8",       // soft lavender
  dark: "#8c5ca9",       // muted purple accent
  mid: "#d6b4f1",        // light purple for cells
  hover: "#aa70d1",      // hover shade
  "section-bg": "#e8d1f7" // soft purple background
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
          title={color}
        ></div>
      ))}
    </div>
  );
};

export default ColorPicker;
