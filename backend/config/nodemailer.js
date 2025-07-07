import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'your_email@example.com',
        pass: process.env.SMTP_PASS || 'your_email_password',
    },
    tls: {
        rejectUnauthorized: false
    }
});

export default transporter;
