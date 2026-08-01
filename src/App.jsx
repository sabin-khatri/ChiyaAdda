/* eslint-disable no-unused-vars */
import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import PublicLayout from './components/layout/PublicLayout'
import AdminLayout from './components/layout/AdminLayout'
import ScrollToTop from './components/utils/ScrollToTop'

// Lazy loaded Pages
const Home = lazy(() => import('./pages/Home'))
const Menu = lazy(() => import('./pages/Menu'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Booking = lazy(() => import('./pages/Booking'))
const BrewLab = lazy(() => import('./pages/BrewLab'))
const Rewards = lazy(() => import('./pages/Rewards'))
const ChiyaMatch = lazy(() => import('./pages/ChiyaMatch'))
const MomoGame = lazy(() => import('./pages/MomoGame'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Lazy loaded Admin Pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const OrdersManager = lazy(() => import('./pages/admin/OrdersManager'))
const MenuManager = lazy(() => import('./pages/admin/MenuManager'))
const Login = lazy(() => import('./pages/admin/Login'))

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-chiya-cream">
    <div className="w-12 h-12 border-4 border-chiya-pink/30 border-t-chiya-pink rounded-full animate-spin"></div>
  </div>
)

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-center" reverseOrder={false} />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="booking" element={<Booking />} />
            <Route path="brew" element={<BrewLab />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="match" element={<ChiyaMatch />} />
            <Route path="game" element={<MomoGame />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Login Route */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<OrdersManager />} />
            <Route path="menu" element={<MenuManager />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
