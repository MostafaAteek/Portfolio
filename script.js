/* 1. BACKGROUND CANVAS — animated circuit / grid lines */
(function initCanvas() {
  var canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  var ctx    = canvas.getContext('2d');
  var W, H, nodes = [];
  var NEON = 'rgba(0, 255, 136, ';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createNodes(count) {
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Move nodes
    nodes.forEach(function(n) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // Draw connections
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx   = nodes[j].x - nodes[i].x;
        var dy   = nodes[j].y - nodes[i].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          var alpha = (1 - dist / 160) * 0.18;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = NEON + alpha + ')';
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(function(n) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = NEON + '0.3)';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  createNodes(Math.min(60, Math.floor(W * H / 18000)));
  draw();

  window.addEventListener('resize', function() {
    resize();
    createNodes(Math.min(60, Math.floor(W * H / 18000)));
  });
})();


/* 2. CURSOR GLOW */
(function initCursorGlow() {
  var glow = document.getElementById('cursorGlow');
  if (!glow) return;

  document.addEventListener('mousemove', function(e) {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();


/* ============================================================
   3. TYPING ANIMATION
   ============================================================ */
(function initTyping() {
  var el = document.getElementById('typedText');
  if (!el) return;

  var phrases = [
    'Front-End Developer',
    'Software Engineering Student',
    'Angular Developer',
    'UI/UX Enthusiast',
    'Web Performance Optimizer',
  ];

  var pi = 0, ci = 0, del = false;

  function tick() {
    var cur = phrases[pi];

    if (!del) {
      el.textContent = cur.slice(0, ci + 1);
      ci++;
      if (ci === cur.length) {
        del = true;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 85);
    } else {
      el.textContent = cur.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        del = false;
        pi  = (pi + 1) % phrases.length;
        setTimeout(tick, 380);
        return;
      }
      setTimeout(tick, 45);
    }
  }

  tick();
})();


/* ============================================================
   4. STICKY NAVBAR
   ============================================================ */
(function initNavbar() {
  var header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', function() {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
})();


/* ============================================================
   5. BURGER MENU
   ============================================================ */
(function initBurger() {
  var burger  = document.getElementById('burger');
  var navList = document.getElementById('navLinks');
  if (!burger || !navList) return;

  burger.addEventListener('click', function() {
    var open = navList.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  navList.querySelectorAll('.nav-link').forEach(function(link) {
    link.addEventListener('click', function() {
      navList.classList.remove('open');
      burger.classList.remove('open');
    });
  });
})();


/* ============================================================
   6. ACTIVE NAV LINK ON SCROLL
   ============================================================ */
(function initActiveNav() {
  var sections = document.querySelectorAll('section[id]');
  var links    = document.querySelectorAll('.nav-link');
  if (!sections.length) return;

  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        var id = e.target.id;
        links.forEach(function(l) {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });

  sections.forEach(function(s) { obs.observe(s); });
})();


/* ============================================================
   7. CUSTOM AOS (Animate On Scroll)
   ============================================================ */
(function initAOS() {
  var els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;

  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('aosIn');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  els.forEach(function(el) { obs.observe(el); });
})();


/* ============================================================
   8. SKILL BARS + SOFT SKILL BARS
   ============================================================ */
(function initSkillBars() {
  // Technical skill bars
  var fills = document.querySelectorAll('.sb-fill');
  // Soft skill bars
  var softFills = document.querySelectorAll('.soft-fill');
  var allFills = Array.prototype.slice.call(fills).concat(Array.prototype.slice.call(softFills));
  if (!allFills.length) return;

  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.style.width = (e.target.getAttribute('data-w') || 0) + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  allFills.forEach(function(f) { obs.observe(f); });
})();


/* ============================================================
   9. COUNT-UP NUMBERS
   ============================================================ */
(function initCountUp() {
  var counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (!e.isIntersecting) return;
      var el     = e.target;
      var target = parseInt(el.getAttribute('data-target'), 10) || 0;
      var start  = 0;
      var step   = Math.ceil(target / 40);
      obs.unobserve(el);

      var t = setInterval(function() {
        start += step;
        if (start >= target) { start = target; clearInterval(t); }
        el.textContent = start;
      }, 28);
    });
  }, { threshold: 0.7 });

  counters.forEach(function(c) { obs.observe(c); });
})();


/* ============================================================
   10. SCROLL TO TOP
   ============================================================ */
(function initScrollTop() {
  var btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', function() {
    btn.classList.toggle('vis', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ============================================================
   11. CONTACT FORM
   ============================================================ */
(function initContactForm() {
  var form   = document.getElementById('contactForm');
  var status = document.getElementById('cfStatus');
  if (!form || !status) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var name    = (form.querySelector('[name="name"]').value    || '').trim();
    var email   = (form.querySelector('[name="email"]').value   || '').trim();
    var message = (form.querySelector('[name="message"]').value || '').trim();

    // Validate
    if (!name || !email || !message) {
      setStatus('Please fill in all required fields.', 'err');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('Please enter a valid email address.', 'err');
      return;
    }

    // Submit (simulated)
    var btn    = form.querySelector('button[type="submit"]');
    btn.disabled     = true;
    btn.textContent  = 'Sending…';

    setTimeout(function() {
      setStatus('Message sent successfully! I\'ll be in touch soon 🚀', 'ok');
      form.reset();
      btn.disabled    = false;
      btn.innerHTML   = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
    }, 1600);
  });

  function setStatus(msg, cls) {
    status.textContent = msg;
    status.className   = 'cf-status ' + cls;
    setTimeout(function() {
      status.textContent = '';
      status.className   = 'cf-status';
    }, 5500);
  }
})();