import { Router, Request, Response } from 'express';
import nodemailer from 'nodemailer';

const router = Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,  
    pass: process.env.EMAIL_PASS    
    },
});

router.post('/confirmacion-compra', async (req: Request, res: Response) => {
  try {
    const {
      emailUsuario, resumenCompra, datosVendedor,
      tiempoEstimado, direccionEnvio, fechaCompra,
      montoTotal, ordenCompra, contactoSoporte
    } = req.body;

    const mailOptions = {
      from: `"FleaMarket" <${process.env.EMAIL_FROM}>`,
      to: emailUsuario,
      subject: `Confirmación de compra - Orden ${ordenCompra}`,
      html: `
        <h2>¡Gracias por tu compra en FleaMarket!</h2>
        <p><b>Orden:</b> ${ordenCompra}</p>
        <p><b>Fecha:</b> ${fechaCompra}</p>
        <h3>Resumen de tu compra:</h3>
        ${resumenCompra}
        <p><b>Monto total pagado:</b> $${montoTotal} CLP</p>
        <h3>Datos del vendedor:</h3>
        <p>${datosVendedor}</p>
        <h3>Dirección de envío:</h3>
        <p>${direccionEnvio}</p>
        <p><b>Tiempo estimado de llegada:</b> ${tiempoEstimado}</p>
        <hr>
        <p>¿Tienes dudas o necesitas ayuda? Contacta: ${contactoSoporte}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ ok: true, mensaje: 'Correo enviado' });
  } catch (error: any) {
    console.error('Error enviando email:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;