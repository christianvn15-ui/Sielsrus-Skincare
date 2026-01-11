/* =========================
   CONFIG
========================= */

// Your WhatsApp number (replace with actual, no + or spaces)
const WHATSAPP_NUMBER = "0832621770";

/* =========================
   DOM READY WRAPPER
========================= */
document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       CART & ELEMENTS
    ========================== */
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const orderSummary = document.getElementById("orderSummary");
    const sendBtn = document.getElementById("sendOrder");

    const nameInput = document.getElementById("name");
    const locationInput = document.getElementById("location");
    const courierInput = document.getElementById("courier");
    const cardInput = document.getElementById("card");

    /* =========================
       PREFILL NAME & LOCATION (IF STORED)
    ========================== */
    const savedName = localStorage.getItem("customerName");
    const savedLocation = localStorage.getItem("customerLocation");

    if (savedName) nameInput.value = savedName;
    if (savedLocation) locationInput.value = savedLocation;

    /* =========================
       RENDER CART SUMMARY
    ========================== */
    function renderOrderSummary() {
        if (!orderSummary) return;
        orderSummary.innerHTML = "";

        if (cart.length === 0) {
            const li = document.createElement("li");
            li.textContent = "Your cart is empty.";
            orderSummary.appendChild(li);
            sendBtn.disabled = true;
            sendBtn.style.opacity = "0.5";
            return;
        }

        cart.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.name} × ${item.qty} = R${item.price * item.qty}`;
            orderSummary.appendChild(li);
        });

        // Show total
        const totalLi = document.createElement("li");
        totalLi.style.marginTop = "10px";
        totalLi.innerHTML = `<strong>Total: R${cart.reduce((sum,i) => sum + i.price*i.qty, 0)}</strong>`;
        orderSummary.appendChild(totalLi);

        sendBtn.disabled = false;
        sendBtn.style.opacity = "1";
    }

    renderOrderSummary();

    /* =========================
       SEND ORDER VIA WHATSAPP
    ========================== */
    sendBtn.addEventListener("click", () => {

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const name = nameInput.value.trim();
        const location = locationInput.value.trim();
        const courier = courierInput.value;
        const card = cardInput.value.trim();

        if (!name || !location || !card) {
            alert("Please fill in all required fields.");
            return;
        }

        // Save Name & Location for next visit
        localStorage.setItem("customerName", name);
        localStorage.setItem("customerLocation", location);

        let message = `🧴 *Sielsrus Skincare Order* 🧴\n\n`;
        message += `👤 *Customer:* ${name}\n`;
        message += `📍 *Location:* ${location}\n`;
        message += `🚚 *Courier:* ${courier}\n`;
        message += `💳 *Card Number:* ${card}\n\n`;

        message += `🛒 *Order Items:*\n`;

        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.qty;
            total += itemTotal;
            message += `• ${item.name} × ${item.qty} = R${itemTotal}\n`;
        });

        message += `\n💰 *Total:* R${total}\n`;
        message += `\nThank you for your order 💖`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

        // Open WhatsApp
        window.open(whatsappURL, "_blank");

        // Clear cart after sending
        localStorage.removeItem("cart");
        cart = [];
        renderOrderSummary();

        // Show confirmation message on page
        const form = document.getElementById("orderForm");
        form.innerHTML = `<h3>✅ Order Sent!</h3><p>Thank you for shopping with Sielsrus Skincare. Your WhatsApp has been opened with your order.</p>`;
    });

});
