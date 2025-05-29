
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CheckoutPage from './pages/CheckoutPage';
import ThankYouPage from './pages/ThankyouPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-6 py-3">
            <Link to="/" className="text-xl font-semibold text-gray-700">eCommerceSim</Link>
          </div>
        </nav>
        <main className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/thankyou/:orderNumber" element={<ThankYouPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;