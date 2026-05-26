(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');
  const navActions= document.querySelector('.nav-actions');

  // Tambah shadow saat scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Hamburger toggle untuk mobile
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('mobile-open');
      navActions.classList.toggle('mobile-open');
    });

    // Tutup menu saat klik link
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('mobile-open');
        navActions.classList.remove('mobile-open');
      });
    });
  }
})();


/* ─── 2. ACTIVE NAV LINK saat scroll ─── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) currentId = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  });
})();


/* ─── 3. CARA KERJA — step animation ─── */
(function initSteps() {
  const stepItems   = document.querySelectorAll('.step-item');
  const stepVisuals = document.querySelectorAll('.ck-step-visual');

  if (!stepItems.length) return;

  let current = 0;
  let timer   = null;

  function goToStep(idx) {
    stepItems.forEach((el, i) => {
      el.classList.toggle('active', i === idx);
    });
    stepVisuals.forEach((el, i) => {
      el.classList.toggle('active', i === idx);
    });
    current = idx;
  }

  // Klik manual
  stepItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      clearInterval(timer);
      goToStep(idx);
      // Mulai lagi auto-play dari langkah ini
      timer = setInterval(() => {
        goToStep((current + 1) % stepItems.length);
      }, 2800);
    });
  });

  // Auto-play
  timer = setInterval(() => {
    goToStep((current + 1) % stepItems.length);
  }, 2800);
})();


/* ─── 4. FAQ ACCORDION ─── */
(function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon   = btn.querySelector('i');

    // Set tinggi awal = 0
    answer.style.maxHeight = '0';
    answer.style.overflow  = 'hidden';
    answer.style.transition = 'max-height 0.4s ease, padding 0.3s ease';

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Tutup semua
      faqItems.forEach(fi => {
        fi.classList.remove('open');
        fi.querySelector('.faq-answer').style.maxHeight = '0';
        const ic = fi.querySelector('.faq-question i');
        if (ic) ic.style.transform = 'rotate(0deg)';
      });

      // Buka yang diklik (jika belum terbuka)
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
})();


/* ─── 5. BILLING TOGGLE (Bulanan / Tahunan) ─── */
(function initBillingToggle() {
  const toggle        = document.getElementById('billing-toggle');
  const labelMonthly  = document.getElementById('toggle-monthly');
  const labelYearly   = document.getElementById('toggle-yearly');
  const proPrice      = document.getElementById('pro-price');
  const bisnisPrice   = document.getElementById('bisnis-price');

  if (!toggle) return;

  const prices = {
    monthly : { pro: 'Rp 49.000', bisnis: 'Rp 99.000' },
    yearly  : { pro: 'Rp 39.200', bisnis: 'Rp 79.200' },
  };

  let isYearly = false;

  toggle.addEventListener('click', () => {
    isYearly = !isYearly;
    toggle.classList.toggle('active', isYearly);
    labelMonthly.classList.toggle('active', !isYearly);
    labelYearly.classList.toggle('active',  isYearly);

    const key = isYearly ? 'yearly' : 'monthly';
    if (proPrice)    animatePrice(proPrice,    prices[key].pro);
    if (bisnisPrice) animatePrice(bisnisPrice, prices[key].bisnis);
  });

  function animatePrice(el, newVal) {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(-8px)';
    setTimeout(() => {
      el.textContent     = newVal;
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }, 200);
  }
})();


/* ─── 6. SCROLL ANIMATIONS (IntersectionObserver) ─── */
(function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '[data-aos], .fitur-card, .testi-card, .harga-card, .faq-item, .step-item'
  );

  if (!('IntersectionObserver' in window)) {
    // Fallback: tampilkan semua langsung
    targets.forEach(el => el.classList.add('aos-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.aosDelay || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-visible');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  targets.forEach(el => {
    // Sembunyikan dulu
    el.classList.add('aos-hidden');
    observer.observe(el);
  });
})();


/* ─── 7. PHONE MOCKUP — tilt parallax ─── */
(function initPhoneTilt() {
  const phone = document.querySelector('.phone-mockup');
  if (!phone) return;

  phone.addEventListener('mousemove', e => {
    const rect   = phone.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    phone.style.transform = `rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg)`;
  });

  phone.addEventListener('mouseleave', () => {
    phone.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
})();


/* ─── 8. SMOOTH SCROLL for anchor links ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ─── 9. COUNTER ANIMATION (stat numbers) ─── */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-num');
  const parsed = stats.map(el => {
    const text = el.textContent.trim();
    const num  = parseFloat(text.replace(/[^0-9.]/g, ''));
    const suffix = text.replace(/[0-9.]/g, '');
    return { el, num, suffix, orig: text };
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const { el, num, suffix } = parsed.find(p => p.el === entry.target);
      let start     = 0;
      const dur     = 1800;
      const step    = 16;
      const steps   = dur / step;
      const inc     = num / steps;
      const isFloat = suffix.includes('.');

      const timer = setInterval(() => {
        start += inc;
        if (start >= num) { start = num; clearInterval(timer); }
        el.textContent = (isFloat ? start.toFixed(1) : Math.floor(start)) + suffix;
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
})();
