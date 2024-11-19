import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [token, setToken] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/login', formData);
            setToken(response.data.token);
            alert('Login exitoso');
        } catch (err) {
            alert('Error en el login');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre de usuario</label>
                    <input
                        type="text"
                        className="form-control"
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Iniciar Sesión</button>
            </form>
            {token && <p className="mt-3">Token: {token}</p>}
        </div>
    );
};

export default Login;