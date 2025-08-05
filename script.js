let isPremium = localStorage.getItem("isPremium") === "true";

// Initialize on page load
window.onload = () => {
  if (isPremium) {
    enablePremiumFeatures();
  }
};

function enablePremiumFeatures() {
  document.getElementById("premiumOptions").style.display = "block";
  const premiumBtn = document.getElementById("premiumBtn");
  premiumBtn.textContent = "✅ Premium Unlocked";
  premiumBtn.disabled = true;
}

function handlePremium() {
  const options = {
    key: "rzp_live_CkQYKz448ap3As", // 🔁 Replace with your actual Razorpay key
    amount: 1000, // in paise = ₹49
    currency: "INR",
    name: "QR Tool Premium",
    description: "Unlock all premium features",
    handler: function (response) {
      localStorage.setItem("isPremium", "true");
      isPremium = true;
      enablePremiumFeatures();
      alert("✅ Payment successful! Premium features unlocked.");
    },
    prefill: {
      name: "QR User",
      email: "test@example.com"
    },
    theme: {
      color: "#3399cc"
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

function generateQRCode() {
  const url = document.getElementById("urlInput").value;
  if (!url) {
    alert("❗Please enter a URL");
    return;
  }

  // Clear previous QR
  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = "";

  const darkColor = isPremium ? document.getElementById("darkColor").value || "#000000" : "#000000";
  const lightColor = isPremium ? document.getElementById("lightColor").value || "#ffffff" : "#ffffff";

  const qr = new QRCode(qrContainer, {
    text: url,
    width: 256,
    height: 256,
    colorDark: darkColor,
    colorLight: lightColor,
    correctLevel: QRCode.CorrectLevel.H
  });

  // Wait a bit, then add logo if premium
  if (isPremium) {
    setTimeout(() => {
      const fileInput = document.getElementById("logoInput");
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const logoImg = new Image();
          logoImg.src = e.target.result;
          logoImg.onload = function () {
            const canvas = qrContainer.querySelector("canvas");
            const ctx = canvas.getContext("2d");
            const centerX = canvas.width / 2 - 32;
            const centerY = canvas.height / 2 - 32;
            ctx.drawImage(logoImg, centerX, centerY, 64, 64);
          };
        };
        reader.readAsDataURL(file);
      }
    }, 500);
  }
}

function downloadQRCode() {
  const canvas = document.querySelector("#qrcode canvas");
  if (!canvas) {
    alert("❗Please generate a QR code first");
    return;
  }

  const link = document.createElement("a");
  link.download = "myqr.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}


