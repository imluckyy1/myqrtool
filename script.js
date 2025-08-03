let premiumUnlocked = false;

function generateQRCode() {
  const url = document.getElementById('urlInput').value.trim();
  const darkColor = document.getElementById('darkColor').value || '#000000';
  const lightColor = document.getElementById('lightColor').value || '#ffffff';
  const logoInput = document.getElementById('logoInput');
  const qrcodeContainer = document.getElementById('qrcode');
  const downloadBtn = document.getElementById('downloadBtn');

  qrcodeContainer.innerHTML = '';
  downloadBtn.style.display = 'none';

  if (!url) {
    alert('Please enter a valid URL');
    return;
  }

  const qr = new QRCode(qrcodeContainer, {
    text: url,
    width: 200,
    height: 200,
    colorDark: premiumUnlocked ? darkColor : '#000000',
    colorLight: premiumUnlocked ? lightColor : '#ffffff',
  });

  setTimeout(() => {
    if (premiumUnlocked && logoInput.files.length > 0) {
      const qrImg = qrcodeContainer.querySelector('img');
      const logoFile = logoInput.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const logo = new Image();
        logo.src = reader.result;
        logo.onload = () => {
          const canvas = document.createElement('canvas');
          const size = 200;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');

          ctx.fillStyle = lightColor;
          ctx.fillRect(0, 0, size, size);
          ctx.drawImage(qrImg, 0, 0, size, size);

          const logoSize = 50;
          const logoX = (size - logoSize) / 2;
          const logoY = (size - logoSize) / 2;
          ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

          const finalImage = new Image();
          finalImage.src = canvas.toDataURL();
          qrcodeContainer.innerHTML = '';
          qrcodeContainer.appendChild(finalImage);
        };
      };
      reader.readAsDataURL(logoFile);
    }

    downloadBtn.style.display = 'inline-block';
  }, 500);
}

function downloadQRCode() {
  const qrImg = document.querySelector('#qrcode img');
  if (!qrImg) return alert('Please generate a QR code first.');

  const link = document.createElement('a');
  link.href = qrImg.src;
  link.download = 'qr-code.png';
  link.click();
}

// Razorpay Premium Button
document.getElementById("premiumBtn").addEventListener("click", function () {
  const options = {
    key: "rzp_test_do32Fq6Jm97B9A", // Replace with your Razorpay test key
    amount: 1000,
    currency: "INR",
    name: "QR Unlock",
    description: "Premium QR Features",
    handler: function () {
      alert("Payment Successful!");
      unlockPremiumFeatures();
    },
    prefill: {
      name: "QR User",
      email: "user@example.com",
      contact: "9000090000",
    },
    theme: {
      color: "#00796b",
    },
  };
  const rzp = new Razorpay(options);
  rzp.open();
});

function unlockPremiumFeatures() {
  premiumUnlocked = true;

  // Enable inputs
  document.getElementById("darkColor").disabled = false;
  document.getElementById("lightColor").disabled = false;
  document.getElementById("logoInput").disabled = false;

  // Update feature list
  document.getElementById('feature-darkcolor').innerHTML = '✅ Change Dark Color';
  document.getElementById('feature-lightcolor').innerHTML = '✅ Change Light Color';
  document.getElementById('feature-logo').innerHTML = '✅ Upload Logo';
  document.querySelector('#premiumFeatures h4').innerHTML = '🔓 Premium Features Unlocked';
}
