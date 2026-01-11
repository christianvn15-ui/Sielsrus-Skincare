document.addEventListener("DOMContentLoaded", () => {

    const WHATSAPP_NUMBER = "27832621770"; // Correct international format
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const orderSummary = document.getElementById("orderSummary");
    const sendLink = document.getElementById("sendOrderLink");

    const nameInput = document.getElementById("name");
    const locationInput = document.getElementById("location");
    const courierInput = document.getElementById("courier");
    const cardInput = document.getElementById("card");
    const form = document.getElementById("orderForm");

    // Prefill Name & Location
    const savedName = localStorage.getItem("customerName");
    const savedLocation = localStorage.getItem("customerLocation");
    if (savedName) nameInput.value = savedName;
    if (savedLocation) locationInput.value = savedLocation;

    function renderOrderSummary() {
        if (!orderSummary) return;
        orderSummary.innerHTML = "";

        if (cart.length === 0) {
            const li = document.createElement("li");
            li.textContent = "Your cart is empty.";
            orderSummary.appendChild(li);
            sendLink.classList.add("disabled");
            sendLink.removeAttribute("href");
            return;
        }

        cart.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.name} × ${item.qty} = R${item.price * item.qty}`;
            orderSummary.appendChild(li);
        });

        const totalLi = document.createElement("li");
        totalLi.style.marginTop = "10px";
        totalLi.innerHTML = `<strong>Total: R${cart.reduce((sum,i) => sum + i.price*i.qty, 0)}</strong>`;
        orderSummary.appendChild(totalLi);

        sendLink.classList.remove("disabled");
    }

    renderOrderSummary();

    // Update WhatsApp link dynamically when clicked
    sendLink.addEventListener("click", (e) => {
        if (cart.length === 0) {
            e.preventDefault();
            alert("Your cart is empty.");
            return;
        }

        const name = nameInput.value.trim();
        const location = locationInput.value.trim();
        const courier = courierInput.value;
        const card = cardInput.value.trim();

        if (!name || !location || !card) {
            e.preventDefault();
            alert("Please fill in all required fields.");
            return;
        }

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

        // Set the href of the <a> so the browser opens WhatsApp
        sendLink.setAttribute("href", whatsappURL);

        // Clear cart after sending
        localStorage.removeItem("cart");
        cart = [];
        renderOrderSummary();

        if (form) {
            form.innerHTML = `<h3>✅ Order Prepared!</h3><p>Click the WhatsApp button to send your order.</p>`;
        }
    });
});
