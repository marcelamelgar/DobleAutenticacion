import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Register'; // Componente de registro
import VerifyOTP from './VerifyOTP'; // Componente de verificación de OTP

const App = () => {
    return (
        <Router>
            <div className="container">
                <h1 className="mt-5">Sistema de Autenticación</h1>
                <Routes>
                    <Route path="/" element={<Register />} />
                    <Route path="/verify-otp" element={<VerifyOTP />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
