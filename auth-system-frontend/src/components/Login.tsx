import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/login', formData);
            setErrorMessage('');
            navigate('/registration-success');

        } catch (err) {
            setErrorMessage('Usuario o contraseña incorrectos. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: '#001f3f' }}>
            <div className="card p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '10px' }}>
                <h2 className="text-center mb-4">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="username" className="form-label">Usuario</label>
                        <input
                            type="text"
                            id="username"
                            className="form-control"
                            placeholder="Ingresa tu usuario"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="Ingresa tu contraseña"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        {errorMessage && <small className="text-danger">{errorMessage}</small>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
                </form>
            </div>
        </div>
    );
};

export default Login;