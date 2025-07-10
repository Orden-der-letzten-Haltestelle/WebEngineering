import { updateAmount } from "../api/checkoutApiHandler.js"

window.handleCheckout = function handleCheckout(productId, token) {
    if (token == undefined) {
        window.location.replace("http://localhost:3000/login")
    }
    Checkout(productId, token).then(() => {
        window.location.replace("http://localhost:3000/checkout/confirm");
    }).catch((err) => {
        alert("❌ Failed to checkout: " + (err.message || "Unknown error"));
        console.error(err)
    })
}

  window.handleUpdateCheckoutItemAmount = async function(cartItemId, newAmount, token) {
    if (!token) {
        window.location.href = "/login";
        return;
    }
try {
    await updateAmount(cartItemId, newAmount, token); // sendet PUT-Request

    // 🔁 Anzahl im Button live aktualisieren
    const displaySpan = document.querySelector(`.quantity-display[data-id="${cartItemId}"]`);
    if (displaySpan) {
      displaySpan.textContent = `Anzahl: ${newAmount}`;
    }

    // ❌ Dropdown schließen (optional)
    const allDropdowns = document.querySelectorAll('.dropdown-content');
    allDropdowns.forEach(d => d.classList.add('hide'));

    // 🔁 Optional: Gesamtpreis und Artikelanzahl aktualisieren
    recalculateSummary();

  } catch (err) {
    alert("❌ Failed to update amount of CartItem: " + (err.message || "Unknown error"));
    console.error(err);
  }
  }