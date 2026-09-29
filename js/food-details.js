/* ==========================================================
   Campus Bites — food-details.js
   Reads the last-ordered dish and cart total from
   localStorage (set by menu.js) and displays them.
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var dishNameEl = document.getElementById('dishName');
  var cartTotalEl = document.getElementById('cartTotal');

  var lastDish = localStorage.getItem('lastOrderedDish');
  var cartCount = parseInt(localStorage.getItem('cartCount'), 10);

  if (dishNameEl && lastDish) {
    dishNameEl.textContent = lastDish.replace(/\b\w/g, function (c) {
      return c.toUpperCase();
    });
  }

  if (cartTotalEl) {
    cartTotalEl.textContent = isNaN(cartCount) ? 0 : cartCount;
  }
});
