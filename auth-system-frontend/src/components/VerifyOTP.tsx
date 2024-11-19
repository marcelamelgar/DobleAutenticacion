import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyOTP = () => {
    const location = useLocation();
    const emailFromRegister = location.state?.email || '';
    const [formData, setFormData] = useState({ email: emailFromRegister, otp: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/verify-otp', formData);
            setErrorMessage('');
            navigate('/registration-success');
        } catch (err) {
            setErrorMessage('El código OTP ingresado es incorrecto. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: '#001f3f' }}>
            <div className="card p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '10px' }}>
                <h2 className="text-center mb-4">Verificar OTP</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="email" className="form-label">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Ingresa tu correo"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            disabled
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="otp" className="form-label">Código OTP</label>
                        <input
                            type="text"
                            id="otp"
                            className="form-control"
                            placeholder="Ingresa el código OTP"
                            value={formData.otp}
                            onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                            required
                        />
                        {errorMessage && <small className="text-danger">{errorMessage}</small>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Verificar</button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOTP;
