import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { I18nProvider } from "./i18n/I18nProvider";
import { ApiProvider } from "./context/ApiContext";
import { AppProvider } from "./context/AppContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <ApiProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </ApiProvider>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>
);
