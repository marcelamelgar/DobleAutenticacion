import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '', email: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/register', formData);
            alert('Registro exitoso. Revisa tu correo para el código OTP.');
        } catch (err) {
            alert('Error al registrar usuario: ' + err.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Usuario" onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
            <input type="password" placeholder="Contraseña" onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
            <input type="email" placeholder="Correo" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <button type="submit">Registrar</button>
        </form>
    );
};

export default Register;
