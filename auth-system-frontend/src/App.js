import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register.tsx';
import VerifyOTP from './components/VerifyOTP.tsx';
import Login from './components/Login.tsx';
import RegistrationSuccess from './components/RegistrationSuccess.tsx';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registration-success" element={<RegistrationSuccess />} />
            </Routes>
        </Router>
    );
};

export default App;
