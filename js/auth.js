/* ==========================================================
   Campus Bites — auth.js
   Vanilla JavaScript only — no frameworks, no libraries,
   no backend. Powers both login.html and signup.html.

   Responsibilities:
   1. Live field validation (input / blur / focus events)
   2. Password show/hide toggles
   3. Login: verify format, remember-me, resolve a
      studentName, redirect to dashboard.html
   4. Signup: validate every field, persist student details
      to localStorage, redirect to dashboard.html
   ========================================================== */

/* ---------- Shared regex patterns ---------- */
var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var PHONE_REGEX = /^[0-9]{10}$/;

/* ---------- Inline SVG icons for the password toggle ---------- */
var EYE_OPEN_SVG =
  '<svg class="icon-eye" viewBox="0 0 24 24" aria-hidden="true">' +
  '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
  '<circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
  '</svg>';

var EYE_CLOSED_SVG =
  '<svg class="icon-eye" viewBox="0 0 24 24" aria-hidden="true">' +
  '<path d="M3 3l18 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
  '<path d="M10.6 5.2A11.6 11.6 0 0 1 12 5c7 0 11 7 11 7a13.9 13.9 0 0 1-3.4 4.1M6.5 6.6C3.4 8.4 1 12 1 12s4 7 11 7c1.4 0 2.7-.27 3.9-.74M9.9 9.9a3 3 0 0 0 4.2 4.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
  '</svg>';


/* ==========================================================
   ENTRY POINT
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
  initPasswordToggles();

  if (document.getElementById('loginForm')) {
    initLoginPage();
  }

  if (document.getElementById('signupForm')) {
    initSignupPage();
  }
});


/* ==========================================================
   VALIDATION HELPERS
   ========================================================== */

function validateRequired(value, label) {
  if (!value || !value.trim()) {
    return label + ' is required.';
  }
  return '';
}

function validateEmail(value) {
  var trimmed = (value || '').trim();
  if (!trimmed) return 'College email is required.';
  if (!EMAIL_REGEX.test(trimmed)) return 'Enter a valid email address.';
  return '';
}

function validatePassword(value) {
  if (!value) return 'Password is required.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  return '';
}

function validatePhone(value) {
  var digits = (value || '').replace(/\D/g, '');
  if (!digits) return 'Phone number is required.';
  if (!PHONE_REGEX.test(digits)) return 'Phone number must contain exactly 10 digits.';
  return '';
}

function validateSelect(value, label) {
  if (!value) return 'Please select your ' + label + '.';
  return '';
}


/* ---------- DOM helpers for showing / clearing errors ---------- */
function setFieldError(fieldEl, errorEl, message) {
  var group = fieldEl.closest('.form-group');
  if (group) {
    group.classList.add('invalid');
    group.classList.remove('valid');
  }
  if (errorEl) {
    errorEl.textContent = message;
  }
}

function clearFieldError(fieldEl, errorEl) {
  var group = fieldEl.closest('.form-group');
  if (group) {
    group.classList.remove('invalid');
    group.classList.add('valid');
  }
  if (errorEl) {
    errorEl.textContent = '';
  }
}

/**
 * Wires focus / input (or change, for selects) / blur listeners onto a
 * field so errors appear as soon as the user leaves an invalid field,
 * and clear themselves the moment the value becomes valid again.
 */
function attachLiveValidation(fieldEl, errorEl, validateFn, isSelect) {
  var liveEvent = isSelect ? 'change' : 'input';

  // Focus: soften the red border while the student is actively typing.
  fieldEl.addEventListener('focus', function () {
    var group = fieldEl.closest('.form-group');
    if (group) group.classList.remove('invalid');
  });

  // Input/change: only re-validate live once an error has already been
  // shown, so we don't nag the student before they've finished typing.
  fieldEl.addEventListener(liveEvent, function () {
    if (errorEl && errorEl.textContent) {
      var message = validateFn(fieldEl.value);
      if (message) {
        errorEl.textContent = message;
      } else {
        clearFieldError(fieldEl, errorEl);
      }
    }
  });

  // Blur: always validate once the student leaves the field.
  fieldEl.addEventListener('blur', function () {
    var message = validateFn(fieldEl.value);
    if (message) {
      setFieldError(fieldEl, errorEl, message);
    } else {
      clearFieldError(fieldEl, errorEl);
    }
  });
}


/* ==========================================================
   BUTTON LOADING STATE
   ========================================================== */
function setButtonLoading(button, isLoading, loadingText) {
  var textEl = button.querySelector('.btn-text');

  if (isLoading) {
    button.dataset.originalText = textEl ? textEl.textContent : button.textContent;
    if (loadingText) {
      if (textEl) {
        textEl.textContent = loadingText;
      } else {
        button.textContent = loadingText;
      }
    }
    button.classList.add('is-loading');
    button.disabled = true;
  } else {
    if (button.dataset.originalText) {
      if (textEl) {
        textEl.textContent = button.dataset.originalText;
      } else {
        button.textContent = button.dataset.originalText;
      }
    }
    button.classList.remove('is-loading');
    button.disabled = false;
  }
}


/* ==========================================================
   PASSWORD VISIBILITY TOGGLES (login + signup)
   ========================================================== */
function initPasswordToggles() {
  var toggles = document.querySelectorAll('.toggle-password');

  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wrapper = btn.closest('.password-field');
      var input = wrapper ? wrapper.querySelector('input') : null;
      if (!input) return;

      var willShow = input.type === 'password';
      input.type = willShow ? 'text' : 'password';

      btn.classList.toggle('is-visible', willShow);
      btn.setAttribute('aria-label', willShow ? 'Hide password' : 'Show password');
      btn.innerHTML = willShow ? EYE_CLOSED_SVG : EYE_OPEN_SVG;
    });
  });
}


/* ==========================================================
   LOGIN PAGE
   ========================================================== */
function initLoginPage() {
  var form = document.getElementById('loginForm');
  var emailInput = document.getElementById('email');
  var passwordInput = document.getElementById('password');
  var emailError = document.getElementById('emailError');
  var passwordError = document.getElementById('passwordError');
  var rememberCheckbox = document.getElementById('remember');
  var loginBtn = document.getElementById('loginBtn');
  var loginSuccess = document.getElementById('loginSuccess');
  var guestBtn = document.getElementById('guestBtn');
  var forgotLink = document.getElementById('forgotLink');
  var forgotNote = document.getElementById('forgotNote');

  /* ---- Remember Me: auto-fill email on return visits ---- */
  var rememberedEmail = localStorage.getItem('rememberedEmail');
  if (rememberedEmail && emailInput) {
    emailInput.value = rememberedEmail;
    if (rememberCheckbox) rememberCheckbox.checked = true;
  }

  attachLiveValidation(emailInput, emailError, validateEmail);
  attachLiveValidation(passwordInput, passwordError, validatePassword);

  /* ---- Forgot password: demo-friendly inline note ---- */
  if (forgotLink && forgotNote) {
    forgotLink.addEventListener('click', function (e) {
      e.preventDefault();
      forgotNote.hidden = !forgotNote.hidden;
    });
  }

  /* ---- Submit: validate, "log in", store name, redirect ---- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var emailMsg = validateEmail(emailInput.value);
    var passwordMsg = validatePassword(passwordInput.value);

    if (emailMsg) {
      setFieldError(emailInput, emailError, emailMsg);
    } else {
      clearFieldError(emailInput, emailError);
    }

    if (passwordMsg) {
      setFieldError(passwordInput, passwordError, passwordMsg);
    } else {
      clearFieldError(passwordInput, passwordError);
    }

    if (emailMsg || passwordMsg) {
      (emailMsg ? emailInput : passwordInput).focus();
      return; // Do not allow submission until everything is valid.
    }

    // Remember Me
    if (rememberCheckbox && rememberCheckbox.checked) {
      localStorage.setItem('rememberedEmail', emailInput.value.trim());
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    setButtonLoading(loginBtn, true, 'Logging in...');

    // Simulate a network request (no backend available)
    window.setTimeout(function () {
      resolveStudentNameOnLogin(emailInput.value.trim());

      setButtonLoading(loginBtn, false);
      if (loginSuccess) loginSuccess.hidden = false;

      window.setTimeout(function () {
        window.location.href = 'dashboard.html';
      }, 1100);
    }, 900);
  });

  /* ---- Continue as Guest ---- */
  if (guestBtn) {
    guestBtn.addEventListener('click', function () {
      localStorage.setItem('studentName', 'Guest');
      localStorage.removeItem('studentEmail');

      setButtonLoading(guestBtn, true, 'Entering as guest...');

      window.setTimeout(function () {
        window.location.href = 'dashboard.html';
      }, 700);
    });
  }
}

/**
 * Figures out which name dashboard.js should greet the student with.
 * If this email matches an account created via signup.html, its real
 * name (already in localStorage) is kept. Otherwise — since there is
 * no backend to check credentials against — a friendly display name
 * is derived from the email address so the dashboard never falls
 * back to a generic "Student".
 */
function resolveStudentNameOnLogin(email) {
  var storedEmail = localStorage.getItem('studentEmail');
  var storedName = localStorage.getItem('studentName');

  if (storedEmail && storedName && storedEmail.toLowerCase() === email.toLowerCase()) {
    return; // Existing signup record — keep the real name as-is.
  }

  var namePart = email.split('@')[0] || 'Student';
  var derivedName = namePart
    .replace(/[._]+/g, ' ')
    .replace(/\b\w/g, function (letter) { return letter.toUpperCase(); })
    .trim();

  localStorage.setItem('studentName', derivedName || 'Student');
  localStorage.setItem('studentEmail', email);
}


/* ==========================================================
   SIGNUP PAGE
   ========================================================== */
function initSignupPage() {
  var form = document.getElementById('signupForm');

  var fullnameInput = document.getElementById('fullname');
  var studentIdInput = document.getElementById('studentid');
  var emailInput = document.getElementById('signup-email');
  var phoneInput = document.getElementById('phone');
  var departmentSelect = document.getElementById('department');
  var yearSelect = document.getElementById('year');
  var passwordInput = document.getElementById('signup-password');
  var confirmInput = document.getElementById('confirm-password');
  var termsCheckbox = document.getElementById('terms');
  var signupBtn = document.getElementById('signupBtn');
  var signupSuccess = document.getElementById('signupSuccess');

  var fullnameError = document.getElementById('fullnameError');
  var studentIdError = document.getElementById('studentidError');
  var emailError = document.getElementById('signupEmailError');
  var phoneError = document.getElementById('phoneError');
  var departmentError = document.getElementById('departmentError');
  var yearError = document.getElementById('yearError');
  var passwordError = document.getElementById('signupPasswordError');
  var confirmError = document.getElementById('confirmPasswordError');
  var termsError = document.getElementById('termsError');
  var termsLabel = termsCheckbox ? termsCheckbox.closest('.checkbox-wrap-terms') : null;

  function validateConfirm(value) {
    if (!value) return 'Please confirm your password.';
    if (value !== passwordInput.value) return 'Passwords do not match.';
    return '';
  }

  /* ---- Live validation for every field ---- */
  attachLiveValidation(fullnameInput, fullnameError, function (v) {
    return validateRequired(v, 'Full name');
  });
  attachLiveValidation(studentIdInput, studentIdError, function (v) {
    return validateRequired(v, 'Student ID');
  });
  attachLiveValidation(emailInput, emailError, validateEmail);
  attachLiveValidation(phoneInput, phoneError, validatePhone);
  attachLiveValidation(departmentSelect, departmentError, function (v) {
    return validateSelect(v, 'department');
  }, true);
  attachLiveValidation(yearSelect, yearError, function (v) {
    return validateSelect(v, 'year');
  }, true);
  attachLiveValidation(passwordInput, passwordError, validatePassword);
  attachLiveValidation(confirmInput, confirmError, validateConfirm);

  // Re-check the confirm-password field whenever the primary password
  // changes, so a fixed password immediately clears a stale mismatch.
  passwordInput.addEventListener('input', function () {
    if (confirmError.textContent && confirmInput.value) {
      var message = validateConfirm(confirmInput.value);
      if (message) {
        setFieldError(confirmInput, confirmError, message);
      } else {
        clearFieldError(confirmInput, confirmError);
      }
    }
  });

  if (termsCheckbox) {
    termsCheckbox.addEventListener('change', function () {
      if (termsCheckbox.checked) {
        termsError.textContent = '';
        if (termsLabel) termsLabel.classList.remove('invalid');
      }
    });
  }

  /* ---- Submit: validate everything, persist, redirect ---- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var fields = [
      [fullnameInput, fullnameError, validateRequired(fullnameInput.value, 'Full name')],
      [studentIdInput, studentIdError, validateRequired(studentIdInput.value, 'Student ID')],
      [emailInput, emailError, validateEmail(emailInput.value)],
      [phoneInput, phoneError, validatePhone(phoneInput.value)],
      [departmentSelect, departmentError, validateSelect(departmentSelect.value, 'department')],
      [yearSelect, yearError, validateSelect(yearSelect.value, 'year')],
      [passwordInput, passwordError, validatePassword(passwordInput.value)],
      [confirmInput, confirmError, validateConfirm(confirmInput.value)]
    ];

    var firstInvalid = null;

    fields.forEach(function (entry) {
      var input = entry[0];
      var errorEl = entry[1];
      var message = entry[2];

      if (message) {
        setFieldError(input, errorEl, message);
        if (!firstInvalid) firstInvalid = input;
      } else {
        clearFieldError(input, errorEl);
      }
    });

    if (!termsCheckbox.checked) {
      termsError.textContent = 'You must accept the Terms and Privacy Policy.';
      if (termsLabel) termsLabel.classList.add('invalid');
      if (!firstInvalid) firstInvalid = termsCheckbox;
    } else {
      termsError.textContent = '';
      if (termsLabel) termsLabel.classList.remove('invalid');
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return; // Do not allow submission until everything is valid.
    }

    setButtonLoading(signupBtn, true, 'Creating account...');

    // Simulate a network request (no backend available)
    window.setTimeout(function () {
      var departmentLabel = departmentSelect.options[departmentSelect.selectedIndex].text;
      var yearLabel = yearSelect.options[yearSelect.selectedIndex].text;

      localStorage.setItem('studentName', fullnameInput.value.trim());
      localStorage.setItem('studentEmail', emailInput.value.trim());
      localStorage.setItem('studentDepartment', departmentLabel);
      localStorage.setItem('studentYear', yearLabel);
      localStorage.setItem('studentId', studentIdInput.value.trim());
      localStorage.setItem('studentPhone', phoneInput.value.trim());

      setButtonLoading(signupBtn, false);
      if (signupSuccess) signupSuccess.hidden = false;

      window.setTimeout(function () {
        window.location.href = 'dashboard.html';
      }, 1100);
    }, 900);
  });
}
