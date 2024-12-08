import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Contexts/AuthContext";
import AppRoutes from "./routes/routes";
import "@fontsource/inter";
import "./App.css";
import Header from "./Components/Header/Header";

const App = () => (
    <AuthProvider>
      <BrowserRouter>
        {/* <AppRoutes /> */}
  <Header />

      </BrowserRouter>
    </AuthProvider>
);

export default App;
