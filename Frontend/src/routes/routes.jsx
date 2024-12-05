import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateAuthRoute from "../Auth/PrivateAuthRoute";
import Home from "../pages/Home/Home";
import Orders from "../pages/Orders/Orders";
import Customers from "../pages/Customers/Customers";
import AddEmployee from "../pages/AddEmployee/AddEmployee";
import Unauthorized from "../pages/Unauthorized/Unauthorized";
import Login from "../Pages/Login/Login";
import AboutUs from "../Pages/AboutUs/AboutUs";

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/about-us" element={<AboutUs />} />
    <Route path="/unauthorized" element={<Unauthorized />} />

    {/* Protected Routes */}
    <Route
      path="/admin/orders"
      element={
        <PrivateAuthRoute roles={[1, 2, 3]}>
          <Orders />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/admin/customers"
      element={
        <PrivateAuthRoute roles={[2, 3]}>
          <Customers />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/admin/add-employee"
      element={
        <PrivateAuthRoute roles={[3]}>
          <AddEmployee />
        </PrivateAuthRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
