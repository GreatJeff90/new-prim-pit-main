import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ApiProvider } from "./context/AppContext";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ApiProvider>
      <Toaster position="top-center" />
      <App />
    </ApiProvider>
  </BrowserRouter>
);
