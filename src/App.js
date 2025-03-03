import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin/Admin';
import AddMenu from './pages/Admin/AddMenu';
import './App.css';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/add-menu" element={<AddMenu />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 