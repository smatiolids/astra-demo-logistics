import { defaultTheme } from "react-admin";
import red from "@mui/material/colors/red";
import { createTheme } from "@mui/material/styles";
import { lime, yellow } from "@mui/material/colors";

export const DarkTheme = createTheme({
  ...defaultTheme,
  palette: {
    mode: "dark",
    primary: {
      main: lime["A400"],
    },

    secondary: { main: yellow["A200"] },
    text: {
      primary: lime["A400"],
      secondary: lime["A200"]
    },
    error: red,
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});

export const LightTheme = createTheme({
  ...defaultTheme,
  palette: {
    mode: "light", // Switching the dark mode on is a single property value change.
  },
});
