import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { AppProvider } from "./context/AppContext";
import { ApiProvider } from './context/ApiContext';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ApiProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </ApiProvider>
    </BrowserRouter>
  </StrictMode>
);
