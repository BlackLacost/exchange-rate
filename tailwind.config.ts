import { type Config } from "tailwindcss";
import { blue } from "tailwindcss/colors";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: blue,
      },
    },
  },
  plugins: [],
} satisfies Config;
