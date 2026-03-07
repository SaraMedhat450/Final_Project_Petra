import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import './App.css'
import Layout from './components/layout/Layout'

import Register from './pages/auth/customer/Register'
import ProviderRegister from './pages/auth/provider/ProviderRegister'
import Login from './pages/auth/Login'
import Home from './pages/home/Home'
import Categories from './pages/category/Categories'
import SubCategories from './pages/category/SubCategories'
import Services from './pages/services/Services'
import ProviderDetail from './pages/providerWebsite/ProviderDetail'
import Providers from './pages/providerWebsite/Providers'
import ServiceDetail from './pages/services/ServiceDetail'
import BookService from './pages/booking/BookService'
import Customer from "./pages/Customer";
import Provider from "./pages/Provider";
import ProviderMain from "./components/ProviderDashboard/ProviderMain";
import ProviderServiceList from "./components/ProviderDashboard/ProviderServiceList";
import ProviderPoints from "./components/ProviderDashboard/ProviderPoints";
import Dashboard from "./components/ProviderDashboard/Dashboard";
import BookingList from "./components/ProviderDashboard/BookingList";
import Payout from "./components/ProviderDashboard/Payout";
import ProfileAndSettings from "./components/ProviderDashboard/ProfileAndSettings";
import AddNewService from "./components/ProviderDashboard/AddNewService";
import MainLayout from "./components/layout/MainLayout";
import Booking from "./components/CustomerDashboard/Booking"
import Points from "./components/CustomerDashboard/Points";
import ProviderManagement from "./components/CustomerDashboard/ProviderManagement";
import PayoutC from "./components/CustomerDashboard/Payout";
import CustomerManagementC from "./components/CustomerDashboard/CustomerManagement";
import Cashback from "./components/CustomerDashboard/Cashback";
import Profile from './components/Profile'
import Contact from './pages/contact/Contact'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { HashRouter } from "react-router-dom";
import ProviderCalender from './components/ProviderDashboard/ProviderCalender'

function App() {
  return (
    <HashRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/subcategories" element={<SubCategories />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/book/:id" element={<BookService />} />
          <Route path="/book/:id" element={<BookService />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/provider/signup" element={<ProviderRegister />} />

          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/customer" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Customer />
              </ProtectedRoute>
            }>
              /////////
              <Route path="booking" element={<Booking />} />
              <Route path="points" element={<Points />} />
              <Route path="provider" element={<ProviderManagement />} />
              <Route path="payout" element={<PayoutC />} />
              <Route path="customersm" element={<CustomerManagementC />} />
              <Route path="cashback" element={<Cashback />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route path="/provider" element={
            <ProtectedRoute allowedRoles={['provider']}>
              <Provider />
            </ProtectedRoute>
          }>
            <Route index element={<ProviderServiceList />} />
            <Route path="points" element={<ProviderPoints />} />
            <Route path="main" element={<ProviderMain />} />
            <Route path="serviceList" element={<ProviderServiceList />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="providerCalender" element={<ProviderCalender />} />
            <Route path="bookingList" element={<BookingList />} />
            <Route path="payout" element={<Payout />} />
            <Route path="profileAndSettings" element={<ProfileAndSettings />} />
            <Route path="addService" element={<AddNewService />} />
            <Route path="editService/:id" element={<AddNewService />} />
          </Route>
          
          <Route path="/provider/:id" element={<ProviderDetail />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}

export default App
