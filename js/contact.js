/* ==========================================================
   Campus Bites — contact.js
   Vanilla JavaScript only — no backend.

   Responsibilities:
   1. Validate the contact form (name, email, message)
   2. Show/clear inline error messages via addEventListener
      on input / blur / focus
   3. Simulate a submit with a loading state, then show a
      success message (no real network request — there is
      no backend for this project)
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var nameInput = document.getElementById('contactName');
  var emailInput = document.getElementById('contactEmail');
  var messageInput = document.getElementById('contactMessage');

  var nameError = document.getElementById('contactNameError');
  var emailError = document.getElementById('contactEmailError');
  var messageError = document.getElementById('contactMessageError');

  var submitBtn = document.getElementById('contactSubmitBtn');
  var successMsg = document.getElementById('contactSuccess');

  var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateName(value) {
    if (!value.trim()) return 'Please enter your name.';
    if (value.trim().length < 2) return 'Name must be at least 2 characters.';
    return '';
  }

  function validateEmail(value) {
    if (!value.trim()) return 'Please enter your email.';
    if (!EMAIL_REGEX.test(value.trim())) return 'Enter a valid email address.';
    return '';
  }

  function validateMessage(value) {
    if (!value.trim()) return 'Please enter a message.';
    if (value.trim().length < 10) return 'Message must be at least 10 characters.';
    return '';
  }

  function setError(inputEl, errorEl, message) {
    var group = inputEl.closest('.form-group');
    if (group) {
      group.classList.add('invalid');
      group.classList.remove('valid');
    }
    errorEl.textContent = message;
  }

  function clearError(inputEl, errorEl) {
    var group = inputEl.closest('.form-group');
    if (group) {
      group.classList.remove('invalid');
      group.classList.add('valid');
    }
    errorEl.textContent = '';
  }

  function attachLiveValidation(inputEl, errorEl, validateFn) {
    inputEl.addEventListener('focus', function () {
      var group = inputEl.closest('.form-group');
      if (group) group.classList.remove('invalid');
    });

    inputEl.addEventListener('input', function () {
      if (errorEl.textContent) {
        var message = validateFn(inputEl.value);
        if (message) {
          errorEl.textContent = message;
        } else {
          clearError(inputEl, errorEl);
        }
      }
    });

    inputEl.addEventListener('blur', function () {
      var message = validateFn(inputEl.value);
      if (message) {
        setError(inputEl, errorEl, message);
      } else {
        clearError(inputEl, errorEl);
      }
    });
  }

  attachLiveValidation(nameInput, nameError, validateName);
  attachLiveValidation(emailInput, emailError, validateEmail);
  attachLiveValidation(messageInput, messageError, validateMessage);

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nameMsg = validateName(nameInput.value);
    var emailMsg = validateEmail(emailInput.value);
    var messageMsg = validateMessage(messageInput.value);

    if (nameMsg) setError(nameInput, nameError, nameMsg); else clearError(nameInput, nameError);
    if (emailMsg) setError(emailInput, emailError, emailMsg); else clearError(emailInput, emailError);
    if (messageMsg) setError(messageInput, messageError, messageMsg); else clearError(messageInput, messageError);

    if (nameMsg || emailMsg || messageMsg) {
      (nameMsg ? nameInput : emailMsg ? emailInput : messageInput).focus();
      return; // Block submission until every field is valid.
    }

    // Loading state
    var textEl = submitBtn.querySelector('.btn-text');
    var originalText = textEl.textContent;
    textEl.textContent = 'Sending...';
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    // No backend exists — simulate a short delay, then confirm.
    window.setTimeout(function () {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
      textEl.textContent = originalText;

      successMsg.hidden = false;
      form.reset();

      // Clear the valid/invalid styling left over from the reset form.
      [nameInput, emailInput, messageInput].forEach(function (input) {
        var group = input.closest('.form-group');
        if (group) group.classList.remove('valid', 'invalid');
      });

      window.setTimeout(function () {
        successMsg.hidden = true;
      }, 4000);
    }, 900);
  });
});
