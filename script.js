document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Menu Toggle ---
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        navMenu.classList.add('open');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close mobile menu when a navigation link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Smooth Scrolling for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // --- WhatsApp Booking Form Handling ---
  const bookingForm = document.getElementById('whatsapp-booking-form');
  const submitBtn = document.getElementById('booking-submit-btn');
  const spinner = document.getElementById('btn-spinner');

  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous error messages
      const errors = document.querySelectorAll('.error-msg');
      errors.forEach(err => {
        err.style.display = 'none';
        err.textContent = '';
      });

      const controls = document.querySelectorAll('.form-control');
      controls.forEach(ctrl => {
        ctrl.classList.remove('input-error');
      });

      // Get values from form
      const name = document.getElementById('input-name').value.trim();
      const phone = document.getElementById('input-phone').value.trim();
      const service = document.getElementById('select-service').value;
      const needs = document.getElementById('textarea-needs').value.trim();

      let hasErrors = false;

      // Validate inputs
      if (!name) {
        showError('input-name', 'error-name', 'Please enter your name…');
        hasErrors = true;
      }

      if (!phone) {
        showError('input-phone', 'error-phone', 'Please enter a contact number…');
        hasErrors = true;
      } else if (!/^\+?[0-9\s\-()]{7,18}$/.test(phone)) {
        showError('input-phone', 'error-phone', 'Please enter a valid phone number (e.g. 929-721-6363)…');
        hasErrors = true;
      }

      if (!service) {
        showError('select-service', 'error-service', 'Please select a service type…');
        hasErrors = true;
      }

      if (!needs) {
        showError('textarea-needs', 'error-needs', 'Please tell us what symptoms your system is showing…');
        hasErrors = true;
      }

      // If valid, submit to WhatsApp
      if (!hasErrors) {
        submitBtn.disabled = true;
        spinner.style.display = 'inline-block';
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        submitBtn.querySelector('.btn-text').textContent = 'Connecting to operator…';

        // Build WhatsApp Message
        const baseMessage = `Hello PORTAL HVACR, I need service assistance.\n\n` +
                            `• Name: ${name}\n` +
                            `• Phone: ${phone}\n` +
                            `• Appliance/Service: ${service}\n` +
                            `• Details: ${needs}`;

        const encodedMessage = encodeURIComponent(baseMessage);
        const waUrl = `https://wa.me/19297216363?text=${encodedMessage}`;

        // Simulate operator delay then redirect
        setTimeout(() => {
          window.open(waUrl, '_blank', 'noopener');
          
          // Reset button state
          submitBtn.disabled = false;
          spinner.style.display = 'none';
          submitBtn.querySelector('.btn-text').textContent = originalText;
          bookingForm.reset();
        }, 1200);
      } else {
        // Focus first error input
        const firstErrorInput = document.querySelector('.input-error');
        if (firstErrorInput) {
          firstErrorInput.focus();
        }
      }
    });
  }

  // Helper function to show errors inline
  function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(errorId);
    if (input && errorSpan) {
      input.classList.add('input-error');
      errorSpan.textContent = message;
      errorSpan.style.display = 'block';
    }
  }

  // --- Scroll-triggered Card Animations ---
  if ('IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
          cardObserver.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe service cards
    const animatedCards = document.querySelectorAll('.service-card, .stat-card, .booking-card, .portfolio-item');
    
    // Add CSS initial state class and observe
    animatedCards.forEach(card => {
      card.classList.add('fade-in-init');
      cardObserver.observe(card);
    });

    // Add CSS styles for animations inline in header if they don't load
    const animStyles = document.createElement('style');
    animStyles.innerHTML = `
      .fade-in-init {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
      }
      .fade-in-visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(animStyles);
  }
});
