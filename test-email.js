// Sadece arka ucun çalışıp çalışmadığını test etmek için kısa bir script.
async function sendTestEmail() {
  try {
    const response = await fetch('http://localhost:3000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: 'Volinor Test Mesajı',
        text: 'Bu bir test mesajıdır. Eğer bu mesajı okuyorsan Node.js sunucusu başarıyla çalışıyor demektir!'
      })
    });

    const data = await response.json();
    console.log('Sunucu Cevabı:', data);
  } catch (error) {
    console.error('Test sırasında hata oluştu:', error);
  }
}

sendTestEmail();
