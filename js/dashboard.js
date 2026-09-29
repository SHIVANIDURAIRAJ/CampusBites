/* ==========================================================
   Campus Bites — dashboard.js
   Vanilla JavaScript only — no frameworks, no libraries.

   Responsibilities:
   1. Greet the student by name (from localStorage) and by
      time of day (Good Morning / Afternoon / Evening).
   2. Filter the "Today's Specials" cards live as the user
      types in the search bar.
   3. Show a random "Today's Pick" dish on every page load.
   4. Simulate a live queue status (Moderate / Busy) using a
      random number, and update the wait-time estimate.
   5. Animate the voting progress bar in on load.
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initStudentName();
  initGreeting();
  initSearch();
  initDynamicSpecial();
  initQueueStatus();
  initVoteProgress();
});


/* ----------------------------------------------------------
   1. STUDENT NAME (localStorage)
   ----------------------------------------------------------
   In production, login.html should run:
     localStorage.setItem('studentName', enteredName);
   right before redirecting to dashboard.html. This dashboard
   simply reads that value back out.

   For demo/testing purposes (so the page looks right even
   when opened directly, without going through login.html),
   we seed a sample name the first time the page is visited.
   Delete the "seed a demo name" block below once login.html
   is wired up to set the real value.
---------------------------------------------------------- */
function initStudentName() {
  const STORAGE_KEY = 'studentName';
  let name = localStorage.getItem(STORAGE_KEY);

  // --- Demo fallback: remove once login.html sets this for real ---
  if (!name) {
    name = 'Rahul';
    localStorage.setItem(STORAGE_KEY, name);
  }
  // ------------------------------------------------------------

  const nameEl = document.getElementById('studentName');
  if (nameEl) {
    nameEl.textContent = name;
  }
}


/* ----------------------------------------------------------
   2. TIME-BASED GREETING
   ---------------------------------------------------------- */
function initGreeting() {
  const greetingEl = document.getElementById('greeting');
  if (!greetingEl) return;

  const hour = new Date().getHours();
  let greeting;

  if (hour < 12) {
    greeting = 'Good Morning,';
  } else if (hour < 17) {
    greeting = 'Good Afternoon,';
  } else {
    greeting = 'Good Evening,';
  }

  greetingEl.textContent = greeting;
}


/* ----------------------------------------------------------
   3. LIVE SEARCH — filters the Today's Specials grid
   ---------------------------------------------------------- */
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const grid = document.getElementById('specialsGrid');
  const noResults = document.getElementById('noResults');

  if (!searchInput || !grid) return;

  const foodCards = grid.querySelectorAll('.food-card');

  searchInput.addEventListener('input', function () {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    foodCards.forEach(function (card) {
      const name = card.dataset.name || '';
      const category = card.dataset.category || '';
      const matches = name.includes(query) || category.includes(query);

      card.style.display = matches ? '' : 'none';
      if (matches) visibleCount++;
    });

    if (noResults) {
      noResults.hidden = visibleCount !== 0;
    }
  });
}


/* ----------------------------------------------------------
   4. DYNAMIC "TODAY'S PICK" — random dish on every reload
   ---------------------------------------------------------- */
function initDynamicSpecial() {
  const dishes = [
    'Margherita Pizza',
    'Chicken Biryani',
    'Paneer Wrap',
    'Cold Coffee',
    'Grilled Chicken Sandwich',
    'Chocolate Brownie'
  ];

  const dishEl = document.getElementById('dynamicDish');
  if (!dishEl) return;

  const randomDish = dishes[Math.floor(Math.random() * dishes.length)];
  dishEl.textContent = randomDish;
}


/* ----------------------------------------------------------
   5. DYNAMIC QUEUE STATUS — simulated with a random number
   ---------------------------------------------------------- */
function initQueueStatus() {
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const queueCountEl = document.getElementById('queueCount');
  const waitTimeEl = document.getElementById('waitTime');

  if (!statusText) return;

  // Random current queue size between 8 and 34 students
  const queueCount = Math.floor(Math.random() * 27) + 8;
  const isBusy = queueCount > 20;

  // Wait time scales roughly with how many students are waiting
  const estimatedWait = isBusy
    ? Math.floor(Math.random() * 8) + 15   // 15–22 minutes when busy
    : Math.floor(Math.random() * 6) + 6;   // 6–11 minutes when moderate

  if (queueCountEl) queueCountEl.textContent = queueCount + ' Students';
  if (waitTimeEl) waitTimeEl.textContent = estimatedWait + ' Minutes';

  statusText.textContent = isBusy ? 'Queue is Busy' : 'Queue is Moderate';

  if (statusDot) {
    statusDot.classList.toggle('busy', isBusy);
  }
}


/* ----------------------------------------------------------
   6. VOTE PROGRESS BAR — animates in on load
   ---------------------------------------------------------- */
function initVoteProgress() {
  const progressFill = document.getElementById('voteProgress');
  const votePercent = document.getElementById('votePercent');
  const targetPercent = 78;

  if (!progressFill) return;

  // Slight delay so the CSS transition is visible on load
  window.setTimeout(function () {
    progressFill.style.width = targetPercent + '%';
  }, 200);

  if (votePercent) {
    votePercent.textContent = targetPercent;
  }
}
