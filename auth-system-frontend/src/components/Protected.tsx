import React, { useState } from 'react';
import axios from 'axios';

const Protected = ({ token }) => {
    const [message, setMessage] = useState('');

    const fetchProtectedData = async () => {
        try {
            const response = await axios.get('http://localhost:4000/protected', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage(response.data);
        } catch {
            setMessage('Acceso denegado');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Ruta Protegida</h2>
            <button onClick={fetchProtectedData} className="btn btn-secondary">
                Acceder
            </button>
            {message && <p className="mt-3">{message}</p>}
        </div>
    );
};

export default Protected;
