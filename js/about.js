/* ==========================================================
   Campus Bites — about.js
   Vanilla JavaScript only.

   Responsibility:
   Animate the "count up" numbers in the Stats section the
   moment they scroll into view, using IntersectionObserver.
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initStatCounters();
});

function initStatCounters() {
  var statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  // Fallback for older browsers: just show final numbers immediately.
  if (!('IntersectionObserver' in window)) {
    statNumbers.forEach(function (el) {
      el.textContent = el.dataset.target;
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  statNumbers.forEach(function (el) {
    observer.observe(el);
  });
}

/**
 * Counts a single .stat-number element up from 0 to its
 * data-target value over ~1.2 seconds.
 */
function animateCount(el) {
  var target = parseInt(el.dataset.target, 10) || 0;
  var duration = 1200; // ms
  var startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    var current = Math.floor(progress * target);

    el.textContent = current;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      el.textContent = target; // snap to exact final value
    }
  }

  window.requestAnimationFrame(step);
}
