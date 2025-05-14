import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateAuthRoute from "../Auth/PrivateAuthRoute";
import Home from "../Pages/Home/Home";
import Orders from "../Pages/Orders/Orders";
import Customers from "../Pages/Customers/Customers";
import AddEmployee from "../Pages/AddEmployee/AddEmployee";
import Auth from "../Pages/Auth/Auth";
import AboutUs from "../Pages/AboutUs/AboutUs";
import ContactUs from "../Pages/ContactUs/ContactUs";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Employees from "../Pages/Employees/Employees";
import AbeServices from "../Pages/AbeSevices/AbeServices";
import Account from "../Pages/Account/Account";
import EmployeeUpdate from "../Pages/EmployeeUpdate/EmployeeUpdate";
import CustomerUpdate from "../Pages/CustomerUpdate/CustomerUpdate";
import VehicleUpdate from "../Pages/VehicleUpdate/VehicleUpdate";
import NewOrder from "../Pages/NewOrder/NewOrder";
import AddCustomer from "../Pages/AddCustomer/AddCustomer";
import CustomerProfile from "../Pages/CustomerProfile/CustomerProfile";
import ProvideServices from "../Pages/ProvideServices/ProvideServices";
import ServiceUpdate from "../Pages/ServiceUpdate/ServiceUpdate";
import OrderDetails from "../Pages/OrderDetails/OrderDetails";
import OrderUpdate from "../Pages/OrderUpdate/OrderUpdate";

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/about-us" element={<AboutUs />} />
    <Route path="/contact-us" element={<ContactUs />} />
    <Route path="/abe-Services" element={<AbeServices />} />
    <Route path="/Account" element={<Account />} />

    {/* Protected Routes */}
    <Route
      path="/dashboard"
      element={
        <PrivateAuthRoute roles={[1, 2, 3]}>
          <Dashboard />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/orders"
      element={
        <PrivateAuthRoute roles={[1, 2, 3]}>
          <Orders />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/order-details/:id"
      element={
        <PrivateAuthRoute roles={[1, 2, 3]}>
          <OrderDetails />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/edit-order/:id"
      element={
        <PrivateAuthRoute roles={[2, 3]}>
          <OrderUpdate />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/new-order"
      element={
        <PrivateAuthRoute roles={[2, 3]}>
          <NewOrder />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/add-employee"
      element={
        <PrivateAuthRoute roles={[3]}>
          <AddEmployee />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/employees"
      element={
        <PrivateAuthRoute roles={[2, 3]}>
          <Employees />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/edit-employee/:id"
      element={
        <PrivateAuthRoute roles={[3]}>
          <EmployeeUpdate />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/add-customer"
      element={
        <PrivateAuthRoute roles={[2, 3]}>
          <AddCustomer />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/customers"
      element={
        <PrivateAuthRoute roles={[2, 3]}>
          <Customers />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/edit-customer/:id"
      element={
        <PrivateAuthRoute roles={[2, 3]}>
          <CustomerUpdate />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/edit-vehicle/:customer_id/:vehicle_id"
      element={
        <PrivateAuthRoute roles={[2, 3]}>
          <VehicleUpdate />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/customer-profile/:id"
      element={
        <PrivateAuthRoute roles={[2, 3]}>
          <CustomerProfile />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/services"
      element={
        <PrivateAuthRoute roles={[1, 2, 3]}>
          <ProvideServices />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/edit-service/:id"
      element={
        <PrivateAuthRoute roles={[3]}>
          <ServiceUpdate />
        </PrivateAuthRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
