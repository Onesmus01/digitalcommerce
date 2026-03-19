import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../store/store.js";
import ProductProvider from "@/context/ProductContext.jsx";
import { SocketProvider } from "@/context/SocketContext.jsx"; // ✅ IMPORT THIS
import {HelmetProvider} from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <BrowserRouter>
      <Provider store={store}>
        <ProductProvider>
          <SocketProvider backendUrl="http://localhost:8080">
            <App />
          </SocketProvider>
        </ProductProvider>
      </Provider>
    </BrowserRouter>
  </HelmetProvider> 
);