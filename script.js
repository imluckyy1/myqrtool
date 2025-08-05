let qrcode;

function generateQRCode() {
  const url = document.getElementById("urlInput").value;
  const darkColor = document.getElementById("darkColor").value || "#000000";
  const lightColor = document.getElementById("lightColor").value || "#ffffff";
  const logoInput = document.getElementById("logoInput");

  if (!url) {
    alert("Please enter a URL");
    return;
  }

  document.getElementById("qrcode").innerHTML = "";

  qrcode = new QRCode(document.getElementById("qrcode"), {
    text: url,
    width: 256,
    height: 256,
    colorDark: darkColor,
    colorLight: lightColor,
    correctLevel: QRCode.CorrectLevel.H
  });

  // Add logo if uploaded
  if (logoInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const logo = new Image();
      logo.src = e.target.result;
      logo.onload = function () {
        const canvas = document.querySelector("#qrcode canvas");
        const ctx = canvas.getContext("2d");
        const size = 64;
        const x = (canvas.width - size) / 2;
        const y = (canvas.height - size) / 2;
        ctx.drawImage(logo, x, y, size, size);
      };
    };
    reader.readAsDataURL(logoInput.files[0]);
  }
}

function downloadQRCode() {
  const canvas = document.querySelector("#qrcode canvas");
  if (!canvas) {
    alert("Please generate the QR code first.");
    return;
  }

  const link = document.createElement("a");
  link.download = "qr-code.png";
  link.href = canvas.toDataURL();
  link.click();
}

function handlePremium() {
  const options = {
    key: "rzp_live_CkQYKz448ap3As", // Replace with your Razorpay key
    amount: 1000, // 50 INR = 5000 paise
    currency: "INR",
    name: "QR Premium Unlock",
    description: "Unlock premium QR features",
    image: "https://imluckyy1.github.io/myqrtool/logo.png",
    handler: function (response) {
      alert("Payment Successful! Premium features unlocked.");
      unlockPremiumFeatures();
    },
    prefill: {
      name: "",
      email: ""
    },
    theme: {
      color: "#3399cc"
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

function unlockPremiumFeatures() {
  // Show the premium options section
  document.getElementById("premiumOptions").style.display = "block";

  // Optionally hide premium purchase section
  document.getElementById("premiumBtn").style.display = "none";
  document.getElementById("premiumFeatures").style.display = "none";
}
