/* =========================
   CART STATE
========================= */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* =========================
   ELEMENTS
========================= */
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartPanel = document.getElementById("cart");
const cartButton = document.querySelector(".cart-button");
const checkoutLink = document.querySelector(".send-link");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");

/* =========================
   INIT
========================= */
updateCartUI();
toggleCheckout();

/* =========================
   ADD TO CART
========================= */
function addToCart(name, price) {
    const existing = cart.find(i => i.name === name);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }

    saveCart();
    updateCartUI();
}

/* =========================
   REMOVE ITEM
========================= */
function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

/* =========================
   DECREASE QTY
========================= */
function decreaseQty(index) {
    cart[index].qty--;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    updateCartUI();
}

/* =========================
   SAVE CART
========================= */
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

/* =========================
   TOTAL
========================= */
function cartTotal() {
    return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

/* =========================
   UPDATE CART UI
========================= */
function updateCartUI() {
    if (!cartItems || !cartCount) return;

    cartItems.innerHTML = "";
    cartCount.textContent = cart.reduce((s, i) => s + i.qty, 0);

    cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${item.name}</strong><br>
            R${item.price} × ${item.qty} = <strong>R${item.price * item.qty}</strong>
            <div class="cart-controls">
                <button class="qty-btn" onclick="addToCart('${item.name}', ${item.price})">+</button>
                <button class="qty-btn" onclick="decreaseQty(${index})">−</button>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        `;
        cartItems.appendChild(li);
    });

    if (cart.length > 0) {
        const totalLi = document.createElement("li");
        totalLi.innerHTML = `<strong>Total: R${cartTotal()}</strong>`;
        totalLi.style.marginTop = "10px";
        cartItems.appendChild(totalLi);
    }

    toggleCheckout();
}

/* =========================
   DISABLE CHECKOUT IF EMPTY
========================= */
function toggleCheckout() {
    if (!checkoutLink) return;

    if (cart.length === 0) {
        checkoutLink.classList.add("disabled");
        checkoutLink.onclick = e => e.preventDefault();
    } else {
        checkoutLink.classList.remove("disabled");
        checkoutLink.onclick = null;
    }
}

/* =========================
   CART TOGGLE
========================= */
if (cartButton && cartPanel) {
    cartButton.addEventListener("click", () => {
        cartPanel.classList.toggle("open");
    });
}

/* =========================
   PRODUCT CARD EVENTS
========================= */
document.querySelectorAll(".product-card").forEach(card => {
    const name = card.dataset.name;
    const img = card.dataset.img;

    const priceText = [...card.querySelectorAll("p")]
        .find(p => p.textContent.trim().startsWith("R"));

    const price = priceText
        ? parseFloat(priceText.textContent.replace("R", "").trim())
        : 0;

    card.addEventListener("click", () => openModal(name, img, price));

    card.querySelector(".add").addEventListener("click", e => {
        e.stopPropagation();
        addToCart(name, price);
    });
});

/* =========================
   MODAL
========================= */
function openModal(name, img, price) {
    modalName.textContent = name;
    modalImg.src = img;
    modal.style.display = "flex";

    modal.querySelector(".add").onclick = () => addToCart(name, price);
}

if (modal) {
    modal.addEventListener("click", e => {
        if (e.target === modal || e.target.classList.contains("close")) {
            modal.style.display = "none";
        }
    });
}

/* =========================
   CONFIRMATION BEFORE CLEAR
========================= */
window.confirmClearCart = function () {
    if (cart.length === 0) return;

    const confirmed = confirm("Are you sure you want to clear your cart?");
    if (confirmed) {
        cart = [];
        saveCart();
        updateCartUI();
    }
};

/* =========================
   ADMIN WHATSAPP FORMAT (USED ON SEND PAGE)
========================= */
window.generateWhatsAppMessage = function (customer) {
    return `
🛍️ *NEW SIELSRUS ORDER*

${cart.map(i => `• ${i.name} × ${i.qty} = R${i.price * i.qty}`).join("\n")}

------------------
Total: R${cartTotal()}
------------------

Customer:
Name: ${customer.name}
Location: ${customer.location}
Courier: ${customer.courier}
Card: ${customer.card}
    `.trim();
};
