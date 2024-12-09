import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Contexts/AuthContext";
import AppRoutes from "./routes/routes";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fontsource/inter";
import "./App.css";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";

const App = () => (
    <AuthProvider>
      <BrowserRouter>
        {/* <AppRoutes /> */}
  <Header />
  <Footer />

      </BrowserRouter>
    </AuthProvider>
);

export default App;
