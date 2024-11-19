import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationSuccess = () => {
    const navigate = useNavigate(); // Hook para redirigir

    return (
        <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: '#001f3f' }}>
            <div className="card p-4 text-center" style={{ width: '100%', maxWidth: '400px', borderRadius: '10px' }}>
                <h2 className="mb-4">Registro Exitoso</h2>
                <p className="mb-4">¡Tu cuenta se ha registrado correctamente!</p>
                <button
                    className="btn btn-primary w-100 mb-3"
                    onClick={() => navigate('/login')}
                >
                    Iniciar Sesión
                </button>
                <button
                    className="btn btn-secondary w-100"
                    onClick={() => navigate('/')}
                >
                    Registrar Nueva Cuenta
                </button>
            </div>
        </div>
    );
};

export default RegistrationSuccess;
