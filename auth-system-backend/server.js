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

    console.log(`[REGISTER] Inicio del proceso de registro para el usuario: ${username}`);

    try {
        // Verifica si el usuario ya existe
        const existingUser = users.find(u => u.username === username || u.email === email);
        if (existingUser) {
            console.log(`[REGISTER] Usuario ya registrado: ${username}`);
            return res.status(400).send('El usuario ya está registrado.');
        }

        // Genera el hash de la contraseña
        console.log(`[REGISTER] Hasheando contraseña para el usuario: ${username}`);
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(`[REGISTER] Contraseña hasheada: ${hashedPassword}`);
        users.push({ username, password: hashedPassword, email }); // Guarda el usuario

        // Genera y hashea el OTP
        const otp = generateOTP();
        console.log(`[REGISTER] OTP generado: ${otp}`);
        const hashedOTP = await bcrypt.hash(otp, 10);
        console.log(`[REGISTER] OTP hasheado: ${hashedOTP}`);
        otps[email] = hashedOTP; // Almacena el OTP hasheado

        // Envía el OTP al correo
        // Envía el OTP al correo en formato HTML
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Código de Verificación - Registro Exitoso',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
                    <div style="max-width: 600px; margin: auto; background: #001f3f; padding: 20px; border-radius: 10px; color: white;">
                        <h2 style="color: #f2f2f2;">¡Registro Exitoso!</h2>
                        <p style="font-size: 16px;">Gracias por registrarte en nuestra plataforma. Aquí está tu código de verificación:</p>
                        <div style="background: #ffffff; color: #001f3f; font-size: 24px; font-weight: bold; padding: 10px; border-radius: 5px; margin: 20px auto; width: fit-content;">
                            ${otp}
                        </div>
                        <p style="font-size: 14px; margin-top: 20px;">Ingresa este código en la pantalla de verificación para activar tu cuenta.</p>
                        <div style="margin-top: 20px;">
                            <a href="http://localhost:3000/verify-otp" style="text-decoration: none; background: #007bff; color: white; padding: 10px 20px; border-radius: 5px; font-size: 16px;">Verificar mi Cuenta</a>
                        </div>
                    </div>
                </div>
            `,
        });


        console.log(`[REGISTER] OTP enviado al correo: ${email}`);
        res.status(201).send('Usuario registrado. Se envió un código de verificación al correo.');
    } catch (error) {
        console.error(`[REGISTER] Error durante el registro: ${error.message}`);
        res.status(500).send('Error en el servidor al registrar el usuario.');
    }
});

// Verificación del OTP
app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    console.log(`[VERIFY-OTP] Verificando OTP para el correo: ${email}`);

    try {
        const hashedOTP = otps[email];
        if (!hashedOTP) {
            console.log(`[VERIFY-OTP] OTP no encontrado para el correo: ${email}`);
            return res.status(400).send('El OTP ha expirado o no existe.');
        }

        console.log(`[VERIFY-OTP] Comparando OTP: ${otp} con el hash almacenado.`);
        const isValid = await bcrypt.compare(otp, hashedOTP);
        if (!isValid) {
            console.log(`[VERIFY-OTP] OTP incorrecto para el correo: ${email}`);
            return res.status(400).send('El código de verificación es incorrecto.');
        }

        console.log(`[VERIFY-OTP] OTP verificado correctamente para el correo: ${email}`);
        delete otps[email]; // Elimina el OTP después de la verificación

        res.status(200).send('Código de verificación correcto.');
    } catch (error) {
        console.error(`[VERIFY-OTP] Error durante la verificación del OTP: ${error.message}`);
        res.status(500).send('Error en el servidor al verificar el OTP.');
    }
});


// Login de usuario
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log(`[LOGIN] Inicio de sesión para el usuario: ${username}`);

    try {
        // Busca el usuario en la base de datos
        const user = users.find(u => u.username === username);
        if (!user) {
            console.log(`[LOGIN] Usuario no encontrado: ${username}`);
            return res.status(401).send('Usuario no encontrado.');
        }

        console.log(`[LOGIN] Comparando contraseña ingresada con el hash almacenado.`);
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            console.log(`[LOGIN] Contraseña incorrecta para el usuario: ${username}`);
            return res.status(401).send('Contraseña incorrecta.');
        }

        console.log(`[LOGIN] Inicio de sesión exitoso para el usuario: ${username}`);
        res.status(200).send('Inicio de sesión exitoso.');
    } catch (error) {
        console.error(`[LOGIN] Error durante el inicio de sesión: ${error.message}`);
        res.status(500).send('Error en el servidor al iniciar sesión.');
    }
});

// Configuración del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
