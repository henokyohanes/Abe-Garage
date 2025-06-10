import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Contexts/AuthContext";
import InactivityProvider from "./Contexts/InactivityProvider/InactivityProvider";
import AppRoutes from "./routes/routes";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fontsource/inter";
import "./App.css";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <InactivityProvider>
        <AppRoutes />
      </InactivityProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;