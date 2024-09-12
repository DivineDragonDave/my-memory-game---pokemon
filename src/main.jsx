import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { themeOptions } from "./utils/them.js";

import App from "./App.jsx";
import "./index.css";

const myTheme = createTheme(themeOptions);

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={myTheme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);
