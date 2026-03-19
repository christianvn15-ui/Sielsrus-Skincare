// =========================
// CONFIG
// =========================
const WHATSAPP_NUMBER = "27832621770"; // Your WhatsApp number in international format

// =========================
// ELEMENTS
// =========================
const orderSummary = document.getElementById("orderSummary");
const sendBtn = document.getElementById("sendOrder");
const confirmation = document.getElementById("confirmation");

const nameInput = document.getElementById("name");
const locationInput = document.getElementById("location");
const courierInput = document.getElementById("courier");

// =========================
// RENDER ORDER SUMMARY
// =========================
function renderOrderSummary() {
    if (!orderSummary) return;
    orderSummary.innerHTML = "";

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

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

    const totalLi = document.createElement("li");
    totalLi.style.marginTop = "10px";
    totalLi.innerHTML = `<strong>Total: R${cart.reduce((sum,i) => sum + i.price*i.qty,0)}</strong>`;
    orderSummary.appendChild(totalLi);

    sendBtn.disabled = false;
    sendBtn.style.opacity = "1";
}

renderOrderSummary();

// =========================
// SEND ORDER VIA WHATSAPP
// =========================
sendBtn.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const name = nameInput.value.trim();
    const location = locationInput.value.trim();
    const courier = courierInput.value;

    if (!name || !location) {
        alert("Please fill in all required fields.");
        return;
    }

    let message = `🧴 *Sielsrus Skincare Order* 🧴\n\n`;
    message += `👤 *Customer:* ${name}\n`;
    message += `📍 *Address:* ${location}\n`;
    message += `🚚 *Courier:* ${courier}\n\n`;
    message += `🛒 *Ordered Items:*\n`;

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        message += `• ${item.name} × ${item.qty} = R${itemTotal}\n`;
    });

    message += `\n💰 *Total:* R${total}\n`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');

    // Clear cart after sending
    localStorage.removeItem("cart");
    renderOrderSummary();

    // Show confirmation
    confirmation.style.display = "block";
    confirmation.textContent = "✅ Order sent! WhatsApp has been opened with your order.";
});