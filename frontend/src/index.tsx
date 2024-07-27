import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline } from "@mui/material";
import { AppContextProvider } from "./context/appContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AppContextProvider>
      <CssBaseline />
      <App />
    </AppContextProvider>
  </React.StrictMode>
);
