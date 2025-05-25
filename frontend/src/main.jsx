import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import UnosForm from './pages/UnosForm.jsx';
import UnosiList from './pages/UnosiList.jsx';
import Home from './pages/Home.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="unos" element={<UnosForm />} />
          <Route path="unosi/:id/uredi" element={<UnosForm />} />
          <Route path="unosi" element={<UnosiList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);