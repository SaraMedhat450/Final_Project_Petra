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
import ProviderCategoryManagement from "./components/ProviderDashboard/ProviderCategoryManagement";
import ProviderBookingManagement from "./components/ProviderDashboard/ProviderBookingManagement";
import ProvidersManagement from "./components/ProviderDashboard/ProvidersManagement";
import Payout from "./components/ProviderDashboard/Payout";
import CustomerManagement from "./components/CustomerDashboard/CustomerManagement";
import SystemUsers from "./components/ProviderDashboard/CashbackManagement";
import CashbackManagement from "./components/ProviderDashboard/CashbackManagement";
import AddNewService from "./components/ProviderDashboard/AddNewService";
import MainLayout from "./components/layout/MainLayout";
import Booking from "./components/CustomerDashboard/Booking"
import Category from "./components/CustomerDashboard/Category";
import Points from "./components/CustomerDashboard/Points";
import Service from "./components/CustomerDashboard/Service";
import ProviderManagement from "./components/CustomerDashboard/ProviderManagement";
import PayoutC from "./components/CustomerDashboard/Payout";
import CustomerManagementC from "./components/CustomerDashboard/CustomerManagement";
import System from "./components/CustomerDashboard/System";
import Cashback from "./components/CustomerDashboard/Cashback";
import Main from "./components/CustomerDashboard/Main";
import Profile from './components/Profile'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { HashRouter } from "react-router-dom";

function App() {
  return (
    <HashRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/subcategories" element={<SubCategories />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/book/:id" element={<BookService />} />
          <Route path="/provider/:id" element={<ProviderDetail />} />
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
              <Route path="main" element={<Main />} />
              <Route path="booking" element={<Booking />} />
              <Route path="category" element={<Category />} />
              <Route path="points" element={<Points />} />
              <Route path="service" element={<Service />} />
              <Route path="provider" element={<ProviderManagement />} />
              <Route path="payout" element={<PayoutC />} />
              <Route path="customersm" element={<CustomerManagementC />} />
              <Route path="system" element={<System />} />
              <Route path="cashback" element={<Cashback />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route path="/provider" element={
            <ProtectedRoute allowedRoles={['provider']}>
              <Provider />
            </ProtectedRoute>
          }>
            <Route index element={<ProviderPoints />} />
            <Route path="points" element={<ProviderPoints />} />
            <Route path="main" element={<ProviderMain />} />
            <Route path="serviceList" element={<ProviderServiceList />} />
            <Route path="providersManagement" element={<ProvidersManagement />} />
            <Route path="categoryManagement" element={<ProviderCategoryManagement />} />
            <Route path="bookingManagement" element={<ProviderBookingManagement />} />
            <Route path="payout" element={<Payout />} />
            <Route path="customerManagement" element={<CustomerManagement />} />
            <Route path="systemUsers" element={<SystemUsers />} />
            <Route path="cashbackManagement" element={<CashbackManagement />} />
            <Route path="addService" element={<AddNewService />} />
            <Route path="editService/:id" element={<AddNewService />} />
          </Route>
        </Routes>
      </Layout>
    </HashRouter>
  )
}

export default App
