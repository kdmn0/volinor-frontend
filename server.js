import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Nodemailer Transporter Ayarı
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
});

// Test endpoint'leri
app.get('/', (req, res) => {
  res.send('Backend sunucusu çalışıyor! E-posta API\'sine /api/send-email üzerinden erişebilirsiniz.');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// E-posta gönderme endpoint'i
app.post('/api/send-email', async (req, res) => {
  const { name, email, message, to, subject, text, html } = req.body;
  const targetEmail = to || process.env.ADMIN_EMAIL;

  // Formdan gelen verileri yakalayıp e-posta formatını otomatik oluşturalım
  const finalSubject = subject || (name ? `Web Sitesinden Yeni Mesaj: ${name}` : 'Yeni Bildirim');
  const finalHtml = html || (name && email && message ? `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h3 style="color: #333;">Yeni İletişim Formu Mesajı</h3>
      <p><strong>Gönderen:</strong> ${name}</p>
      <p><strong>E-posta:</strong> <a href="mailto:${email}">${email}</a></p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;" />
      <p><strong>Mesaj:</strong></p>
      <p style="white-space: pre-wrap; color: #555;">${message}</p>
    </div>
  ` : null);
  const finalText = text || (name && email && message ? `Kimden: ${name} (${email})\n\nMesaj:\n${message}` : null);

  if (!targetEmail || (!finalText && !finalHtml)) {
    return res.status(400).json({ error: 'Eksik bilgi: Mesaj içeriği bulunamadı.' });
  }

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: targetEmail,
    replyTo: email || process.env.GMAIL_USER, // Admin "Yanıtla" dediğinde direkt müşteriye döner
    subject: finalSubject,
    text: finalText,
    html: finalHtml
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('E-posta gönderildi:', info.response);
    res.status(200).json({ message: 'E-posta başarıyla gönderildi!', info: info.response });
  } catch (error) {
    console.error('E-posta gönderilirken hata oluştu:', error);
    res.status(500).json({ error: 'E-posta gönderilirken bir hata oluştu.', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
