import React, { useState } from 'react';
import axios from 'axios';

const VerifyOTP = () => {
    const [formData, setFormData] = useState({ email: '', otp: '' });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/verify-otp', formData);
            setMessage('Código verificado con éxito. Ya puedes iniciar sesión.');
        } catch (err) {
            setMessage(err.response?.data || 'Error al verificar el código.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Verificación de Código OTP</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Ingresa tu correo"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group mt-3">
                    <label>Código OTP</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ingresa el código OTP"
                        value={formData.otp}
                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Verificar</button>
            </form>
            {message && <p className="mt-3">{message}</p>}
        </div>
    );
};

export default VerifyOTP;
