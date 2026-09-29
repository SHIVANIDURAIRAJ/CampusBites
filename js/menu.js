/* ==========================================================
   Campus Bites — menu.js
   Vanilla JavaScript only — no frameworks, no libraries.

   Responsibilities:
   1. Live search — filter food cards as the student types
   2. Category filter — show only the selected category
   3. Cart counter — persisted in localStorage, updated in
      the navbar every time "Order Now" is clicked
   4. Sold Out handling — disabled buttons never add to cart
   5. Dynamic chef recommendation — random pick on every load
   6. All DOM updates + addEventListener-driven event handling
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initCart();
  initSearchAndFilter();
  initOrderButtons();
  initChefRecommendation();
});


/* ==========================================================
   1. CART COUNTER (localStorage-backed)
   ========================================================== */
var CART_KEY = 'cartCount';

function getCartCount() {
  var stored = parseInt(localStorage.getItem(CART_KEY), 10);
  return isNaN(stored) ? 0 : stored;
}

function setCartCount(count) {
  localStorage.setItem(CART_KEY, String(count));
  renderCartCount(count);
}

function renderCartCount(count) {
  var cartCountEl = document.getElementById('cartCount');
  if (!cartCountEl) return;

  cartCountEl.textContent = count;

  // Small bump animation every time the count changes
  cartCountEl.classList.remove('bump');
  // Force reflow so the animation can re-trigger on repeated clicks
  void cartCountEl.offsetWidth;
  cartCountEl.classList.add('bump');
}

function initCart() {
  renderCartCount(getCartCount());
}


/* ==========================================================
   2. LIVE SEARCH + CATEGORY FILTER
   ========================================================== */
function initSearchAndFilter() {
  var searchInput = document.getElementById('searchInput');
  var filterGroup = document.getElementById('filterGroup');
  var foodGrid = document.getElementById('foodGrid');
  var noResults = document.getElementById('noResults');

  if (!foodGrid) return;

  var foodCards = foodGrid.querySelectorAll('.food-card');
  var activeCategory = 'all';

  function applyFilters() {
    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var visibleCount = 0;

    foodCards.forEach(function (card) {
      var name = card.dataset.name || '';
      var category = card.dataset.category || '';

      var matchesSearch = name.includes(query);
      var matchesCategory = activeCategory === 'all' || category === activeCategory;
      var isVisible = matchesSearch && matchesCategory;

      card.style.display = isVisible ? '' : 'none';
      if (isVisible) visibleCount++;
    });

    if (noResults) {
      noResults.hidden = visibleCount !== 0;
    }
  }

  // ---- Search: filter live while typing ----
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  // ---- Category buttons: filter without reloading the page ----
  if (filterGroup) {
    var filterButtons = filterGroup.querySelectorAll('.filter-btn');

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeCategory = btn.dataset.category;

        filterButtons.forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        applyFilters();
      });
    });
  }
}


/* ==========================================================
   3 & 4. ORDER NOW BUTTONS (cart + sold-out handling)
   ========================================================== */
function initOrderButtons() {
  var orderButtons = document.querySelectorAll('.order-btn');

  orderButtons.forEach(function (btn) {
    var card = btn.closest('.food-card');
    var isAvailable = !card || card.dataset.available !== 'false';

    // Sold-out items: disable the button and swap its label.
    if (!isAvailable) {
      btn.disabled = true;
      btn.textContent = 'Sold Out';
      return; // No click handler for sold-out items.
    }

    btn.addEventListener('click', function () {
      handleOrderClick(btn, card);
    });
  });

  // The large "Chef Recommendation" Order Now button
  var chefOrderBtn = document.getElementById('chefOrderBtn');
  if (chefOrderBtn) {
    chefOrderBtn.addEventListener('click', function () {
      handleOrderClick(chefOrderBtn, null);
    });
  }
}

/**
 * Adds one item to the cart, gives quick visual feedback on the
 * button itself, then sends the student to the food details page.
 */
function handleOrderClick(btn, card) {
  var newCount = getCartCount() + 1;
  setCartCount(newCount);

  var dishName = card ? card.dataset.name : (document.getElementById('chefName') || {}).textContent;
  if (dishName) {
    localStorage.setItem('lastOrderedDish', dishName);
  }

  var originalText = btn.textContent;
  btn.textContent = 'Added ✓';
  btn.classList.add('added');
  btn.disabled = true;

  window.setTimeout(function () {
    window.location.href = 'food-details.html';
  }, 450);

  // Safety net: if navigation is blocked (e.g. previewed outside a
  // server), restore the button instead of leaving it stuck.
  window.setTimeout(function () {
    btn.textContent = originalText;
    btn.classList.remove('added');
    btn.disabled = false;
  }, 2000);
}


/* ==========================================================
   5. DYNAMIC CHEF RECOMMENDATION (random on every load)
   ========================================================== */
function initChefRecommendation() {
  var chefDishes = [
    {
      name: 'Chicken Biryani',
      desc: 'Fragrant basmati rice slow-cooked with tender spiced chicken, caramelized onions, and warm whole spices — a Campus Bites favorite.',
      calories: '620 kcal',
      time: '20 min',
      price: '₹150',
      img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000&auto=format&fit=crop'
    },
    {
      name: 'Paneer Butter Masala Thali',
      desc: 'Creamy tomato-based paneer curry served with steamed rice, butter roti, and a fresh cucumber salad.',
      calories: '540 kcal',
      time: '15 min',
      price: '₹140',
      img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1000&auto=format&fit=crop'
    },
    {
      name: 'Masala Dosa',
      desc: 'A crisp golden rice crepe wrapped around spiced potato filling, served with coconut chutney and sambar.',
      calories: '380 kcal',
      time: '12 min',
      price: '₹70',
      img: 'https://images.unsplash.com/photo-1630383249896-483d92fa4b03?q=80&w=1000&auto=format&fit=crop'
    },
    {
      name: 'Grilled Chicken Sandwich',
      desc: 'Toasted multigrain bread layered with grilled chicken, melted cheese, and crisp fresh greens.',
      calories: '450 kcal',
      time: '10 min',
      price: '₹120',
      img: 'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?q=80&w=1000&auto=format&fit=crop'
    },
    {
      name: 'Chocolate Brownie',
      desc: 'A fudgy, warm chocolate brownie dusted with sugar — the perfect way to end a cafeteria meal.',
      calories: '310 kcal',
      time: '5 min',
      price: '₹60',
      img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  var chefImg = document.getElementById('chefImg');
  var chefName = document.getElementById('chefName');
  var chefDesc = document.getElementById('chefDesc');
  var chefCalories = document.getElementById('chefCalories');
  var chefTime = document.getElementById('chefTime');
  var chefPrice = document.getElementById('chefPrice');

  if (!chefName) return;

  var pick = chefDishes[Math.floor(Math.random() * chefDishes.length)];

  chefImg.src = pick.img;
  chefImg.alt = pick.name + ' — today\u2019s chef recommendation';
  chefName.textContent = pick.name;
  chefDesc.textContent = pick.desc;
  chefCalories.textContent = pick.calories;
  chefTime.textContent = pick.time;
  chefPrice.textContent = pick.price;
}
