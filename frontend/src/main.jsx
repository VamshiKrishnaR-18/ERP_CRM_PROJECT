import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import 'antd/dist/reset.css';
import "./index.css";
import App from "./App.jsx";
import { getInitialTheme, applyTheme } from "./theme";

// Apply initial theme (light or dark) before React renders
const initialTheme = getInitialTheme();
applyTheme(initialTheme);

const container = document.getElementById("root");

const root = createRoot(container);

root.render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
