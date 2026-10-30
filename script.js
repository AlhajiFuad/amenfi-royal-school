(function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav-links');
  var header = document.querySelector('.site-header');
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }
  window.addEventListener('scroll', function () {
    if (header) header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  var links = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.nav-cta)')) : [];
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          links.forEach(function (l) { l.classList.remove('active'); });
          map[en.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }

  var reveal = document.querySelectorAll('.academic-card, .promise-list article, .fact, .gallery-grid > *, .contact-card, .news-card');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveal.forEach(function (el) { el.classList.add('reveal'); });
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } });
    }, { threshold: 0.12 });
    reveal.forEach(function (el) { ro.observe(el); });
  }

  var form = document.getElementById('admissions-form');
  var error = document.getElementById('form-error');
  if (form) form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    var data = new FormData(form);
    var fields = [
      ['Applicant name', data.get('applicantName')],
      ['Date of birth', data.get('dateOfBirth') || 'Not provided'],
      ['Academic level', data.get('academicLevel')],
      ['Admission period / term', data.get('admissionPeriod') || 'Not specified'],
      ['Parent/guardian name', data.get('guardianName')],
      ['Parent/guardian phone', data.get('guardianPhone')],
      ['Email', data.get('email') || 'Not provided'],
      ['Additional information', data.get('additionalInfo') || 'None']
    ];
    var message = 'ADMISSIONS ENQUIRY — AMENFI ROYAL SCHOOL COMPLEX\n\n' + fields.map(function (item) { return item[0] + ': ' + item[1]; }).join('\n') + '\n\nSubmitted via the school website.';
    var whatsappUrl = 'https://wa.me/233553504084?text=' + encodeURIComponent(message);
    if (error) error.hidden = true;
    var popup = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    if (!popup) window.location.href = whatsappUrl;
  });

  // Animate school statistics when they become visible
  var counters = document.querySelectorAll('.count-up');

  function animateCounter(counter) {
    var target = Number(counter.dataset.target);
    var duration = 1600;
    var startTime = null;

    function updateCounter(timestamp) {
      if (startTime === null) startTime = timestamp;

      var progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out for a smooth finish
      var easedProgress = 1 - Math.pow(1 - progress, 3);

      counter.textContent = Math.floor(easedProgress * target)
        .toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(updateCounter);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  } else {
    counters.forEach(function (counter) {
      counter.textContent = Number(counter.dataset.target).toLocaleString();
    });
  }
  
  
  // Flip all academic cards on click or keyboard activation
  var academicFlipCards = document.querySelectorAll('.academic-flip-card');

  academicFlipCards.forEach(function (card) {
    function toggleFlip() {
      var flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(flipped));
    }

    card.addEventListener('click', toggleFlip);

    card.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleFlip();
      }
    });
  });
  

})();
