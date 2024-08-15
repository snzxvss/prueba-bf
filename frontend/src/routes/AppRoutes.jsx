import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Home from '../pages/Home';
import { getToken } from '../services/api';

const AppRoutes = () => {
  const isAuthenticated = !!getToken(); // Verificar token en el almacenamiento local

  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="*" element={<Navigate to="/" />} /> 
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default AppRoutes;
