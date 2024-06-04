/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

const hoveredParentPlugin = plugin(function ({ addVariant, e }) {
  addVariant("hovered-parent", ({ container }) => {
    container.walkRules((rule) => {
      rule.selector = `:hover > .hovered-parent\\:${rule.selector.slice(1)}`;
    });
  });
});

const focusedWithinParentPlugin = plugin(function ({ addVariant, e }) {
  addVariant("focused-within-parent", ({ container }) => {
    container.walkRules((rule) => {
      rule.selector = `:focus-within > .focused-within-parent\\:${rule.selector.slice(1)}`;
    });
  });
});

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      xs: "475px",
      // => @media (min-width: 475px) { ... }

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [
    hoveredParentPlugin,
    focusedWithinParentPlugin,
  ],
}
