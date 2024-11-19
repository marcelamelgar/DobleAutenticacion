const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Simula una base de datos en memoria
const users = []; // Base de datos simulada para usuarios
const otps = {};  // Almacena OTPs hasheados temporalmente (clave: email)

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Cambia según tu proveedor de correo
    auth: {
        user: process.env.EMAIL_USER, // Correo del remitente
        pass: process.env.EMAIL_PASS, // Contraseña o app password
    },
});

// Función para generar un OTP de 6 dígitos
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Rutas

// Registro de usuario
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Verifica si el usuario ya existe
        const existingUser = users.find(u => u.username === username || u.email === email);
        if (existingUser) {
            return res.status(400).send('El usuario ya está registrado.');
        }

        // Genera el hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ username, password: hashedPassword, email }); // Almacena usuario con contraseña hasheada

        // Genera y hashea el OTP
        const otp = generateOTP();
        const hashedOTP = await bcrypt.hash(otp, 10);
        otps[email] = hashedOTP; // Almacena el OTP hasheado

        // Envía el OTP al correo ingresado
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Código de verificación',
            text: `Tu código de verificación es: ${otp}`,
        });

        res.status(201).send('Usuario registrado. Se envió un código de verificación al correo.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor al registrar el usuario.');
    }
});

// Verificación del OTP
app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const hashedOTP = otps[email];
        if (!hashedOTP) {
            return res.status(400).send('El OTP ha expirado o no existe.');
        }

        // Compara el OTP ingresado con el OTP hasheado
        const isValid = await bcrypt.compare(otp, hashedOTP);
        if (!isValid) {
            return res.status(400).send('El código de verificación es incorrecto.');
        }

        // Elimina el OTP después de la verificación
        delete otps[email];

        res.status(200).send('Código de verificación correcto.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor al verificar el OTP.');
    }
});

// Login de usuario
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Busca el usuario en la base de datos
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(401).send('Usuario no encontrado.');
        }

        // Compara la contraseña ingresada con el hash almacenado
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).send('Contraseña incorrecta.');
        }

        res.status(200).send('Inicio de sesión exitoso.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor al iniciar sesión.');
    }
});

// Configuración del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));