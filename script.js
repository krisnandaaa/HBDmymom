/* =============================================
   script.js — Birthday Website Mama 🌸
   ============================================= */

// Small, non-interactive reminder while there is more content below.
(function initScrollHint() {
  const hint = document.getElementById('scroll-hint');
  if (!hint) return;

  let scheduled = false;
  function updateHint() {
    scheduled = false;
    const page = document.documentElement;
    hint.hidden = page.scrollHeight - window.innerHeight - window.scrollY <= 24;
  }
  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateHint);
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('load', scheduleUpdate);
  if ('ResizeObserver' in window) {
    new ResizeObserver(scheduleUpdate).observe(document.body);
  }
  scheduleUpdate();
})();

// ============================================
// 0. SPLASH SCREEN & MAGIC CURSOR
// ============================================
window.addEventListener('load', () => {
  const splash = document.getElementById('splash-screen');
  if (splash) {
    // Tampilkan splash selama 3 detik setelah halaman selesai dimuat.
    setTimeout(() => {
      splash.classList.add('hidden');
    }, 3000);
  }
});

(function initMagicCursor() {
  let lastSpawn = 0;
  window.addEventListener('pointermove', (e) => {
    const now = Date.now();
    if (now - lastSpawn < 50) return; // limit spawn rate
    lastSpawn = now;

    const particle = document.createElement('div');
    const emojis = ['💖', '✨', '🌸', '💕', '⭐'];
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    particle.style.position = 'fixed';
    particle.style.left = e.clientX + 'px';
    particle.style.top = e.clientY + 'px';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9998';
    particle.style.fontSize = Math.random() * 10 + 12 + 'px';
    particle.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
    particle.style.transform = 'translate(-50%, -50%) scale(1)';
    
    document.body.appendChild(particle);
    
    requestAnimationFrame(() => {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 40 + 20;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist - 30; 
      particle.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${Math.random()*90 - 45}deg) scale(0.5)`;
      particle.style.opacity = '0';
    });

    setTimeout(() => {
      particle.remove();
    }, 1000);
  });
})();

(function initSakura() {
  const canvas = document.getElementById('sakura-canvas');
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });

  // Petal shapes drawn with canvas paths (5-petal flower)
  const PETAL_COLORS = [
    'rgba(255, 182, 210, 0.75)',
    'rgba(255, 154, 186, 0.70)',
    'rgba(255, 210, 228, 0.80)',
    'rgba(252, 130, 174, 0.65)',
    'rgba(255, 235, 245, 0.85)',
    'rgba(240, 120, 165, 0.60)',
  ];

  const NUM_PETALS = 55;
  const petals = [];

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createPetal(isInit) {
    return {
      x: randomBetween(-60, W + 60),
      y: isInit ? randomBetween(-H, H) : randomBetween(-80, -10),
      size: randomBetween(10, 22),
      rotation: randomBetween(0, Math.PI * 2),
      rotationSpeed: randomBetween(-0.03, 0.03),
      speedY: randomBetween(1.2, 2.8),
      speedX: randomBetween(-1.2, 1.2),
      drift: randomBetween(0.4, 1.2),
      driftDir: Math.random() > 0.5 ? 1 : -1,
      driftOffset: randomBetween(0, Math.PI * 2),
      opacity: randomBetween(0.55, 0.9),
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      type: Math.floor(Math.random() * 3), // 0: oval, 1: petal, 2: circle
    };
  }

  // Initialize petals
  for (let i = 0; i < NUM_PETALS; i++) {
    petals.push(createPetal(true));
  }

  function drawPetal(p, t) {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    const s = p.size;
    ctx.fillStyle = p.color;

    if (p.type === 0) {
      // Oval petal
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.6, s, 0, 0, Math.PI * 2);
      ctx.fill();

      // Inner lighter highlight
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.ellipse(-s * 0.12, -s * 0.25, s * 0.22, s * 0.4, 0.3, 0, Math.PI * 2);
      ctx.fill();

    } else if (p.type === 1) {
      // 5-petal cherry blossom flower
      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / 5);
        ctx.beginPath();
        ctx.ellipse(0, -s * 0.55, s * 0.28, s * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      // Center
      ctx.fillStyle = 'rgba(255,230,245,0.9)';
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.18, 0, Math.PI * 2);
      ctx.fill();

    } else {
      // Rounded petal with notch
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.7, -s * 0.6, s * 0.7, s * 0.5, 0, s * 0.9);
      ctx.bezierCurveTo(-s * 0.7, s * 0.5, -s * 0.7, -s * 0.6, 0, -s);
      ctx.fill();
    }

    ctx.restore();
  }

  let lastTime = 0;
  function animate(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 16.67, 3); // cap delta
    lastTime = timestamp;

    ctx.clearRect(0, 0, W, H);

    petals.forEach((p, i) => {
      const t = timestamp * 0.001;
      // Drifting sinusoidal motion
      p.x += p.speedX * dt + Math.sin(t * p.drift + p.driftOffset) * 0.6 * p.driftDir * dt;
      p.y += p.speedY * dt;
      p.rotation += p.rotationSpeed * dt;

      drawPetal(p, t);

      // Reset when out of screen
      if (p.y > H + 60 || p.x < -80 || p.x > W + 80) {
        petals[i] = createPetal(false);
      }
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();


// ============================================
// 2. PHOTO UPLOAD PREVIEW (REMOVED)
// ============================================
// JS upload logic removed. Photos are now placed manually in HTML.


// ============================================
// 3. BLOW THE CANDLE INTERACTION
// ============================================
(function initCandleInteraction() {
  const blowBtn = document.getElementById('blow-btn');
  const modal = document.getElementById('blow-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const cssCake = document.getElementById('css-cake');

  if (!blowBtn || !modal || !closeBtn) return;

  blowBtn.addEventListener('click', () => {
    // Tombol ulang tahun selalu menyalakan lampu kembali terlebih dahulu.
    if (typeof window.turnBirthdayLightsOn === 'function') {
      window.turnBirthdayLightsOn();
    }

    // Animate candle going out
    const candleIcon = blowBtn.querySelector('.candle-icon');
    const candleText = blowBtn.querySelector('.candle-text');

    candleIcon.style.transition = 'all 0.4s';
    candleIcon.textContent = '💨';
    candleText.textContent = 'Lilinnya padam... 🌸';
    blowBtn.style.pointerEvents = 'none';

    // Extinguish the flames on CSS cake
    if (cssCake) {
      cssCake.classList.add('blown-out');
      createCandleSmoke(cssCake);
    }

    // Beri waktu agar asap lilin terlihat sebelum konfeti muncul.
    setTimeout(launchConfetti, 1200);

    // Show modal after delay
    setTimeout(() => {
      modal.classList.add('active');
    }, 2200);
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    const candleIcon = blowBtn.querySelector('.candle-icon');
    const candleText = blowBtn.querySelector('.candle-text');
    candleIcon.textContent = '✨';
    candleText.textContent = 'Selamat Ulang Tahun, Ibuk! 🌸';
    blowBtn.style.background = 'linear-gradient(135deg, hsl(340,80%,80%), hsl(310,70%,85%))';
    blowBtn.style.pointerEvents = 'auto';

    // Reignite candles
    if (cssCake) {
      cssCake.classList.remove('blown-out');
    }
  });

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
})();

function createCandleSmoke(cake) {
  cake.querySelectorAll('.candle').forEach((candle) => {
    for (let index = 0; index < 4; index++) {
      const puff = document.createElement('span');
      puff.className = 'smoke-puff';
      puff.style.setProperty('--smoke-delay', `${index * 0.25}s`);
      puff.style.setProperty('--smoke-x', `${Math.round(Math.random() * 12 - 6)}px`);
      candle.appendChild(puff);
      setTimeout(() => puff.remove(), 3600);
    }
  });
}


// ============================================
// 4. CONFETTI BURST
// ============================================
function launchConfetti() {
  const colors = ['#ff80ab', '#f48fb1', '#ffd1dc', '#ffb3c6', '#fce4ec', '#f8bbd0', '#ff4081', '#c2185b', '#gold'];
  const emojis = ['🌸', '💖', '✨', '🎉', '💕', '🌺', '⭐'];

  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      createConfettiPiece(colors, emojis);
    }, i * 30);
  }
}

function createConfettiPiece(colors, emojis) {
  const piece = document.createElement('div');

  const isEmoji = Math.random() > 0.5;
  if (isEmoji) {
    piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    piece.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      font-size: ${Math.random() * 20 + 14}px;
      pointer-events: none;
      z-index: 9999;
      user-select: none;
      transform: translate(-50%, -50%);
    `;
  } else {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 6;
    const shape = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${shape};
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
    `;
  }

  document.body.appendChild(piece);

  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * 260 + 80;
  const duration = Math.random() * 1200 + 800;

  const vx = Math.cos(angle) * distance;
  const vy = Math.sin(angle) * distance - 150; // upward bias

  piece.animate([
    { transform: `translate(-50%, -50%) scale(1)`, opacity: 1 },
    { transform: `translate(calc(-50% + ${vx}px), calc(-50% + ${vy}px)) scale(0.3) rotate(${Math.random()*720}deg)`, opacity: 0 }
  ], {
    duration,
    easing: 'cubic-bezier(0, 0.9, 0.57, 1)',
    fill: 'forwards'
  }).onfinish = () => piece.remove();
}


// ============================================
// 5. SCROLL-TRIGGERED ANIMATIONS
// ============================================
(function initScrollAnimations() {
  const targets = document.querySelectorAll('.animate-in');

  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el) => observer.observe(el));
})();


// ============================================
// 6. HERO SPARKLES
// ============================================
(function initHeroSparkles() {
  const container = document.getElementById('hero-sparkles');
  if (!container) return;

  function createSparkle() {
    const sparkle = document.createElement('div');
    const size = Math.random() * 8 + 4;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 3;
    const duration = Math.random() * 2 + 1.5;

    sparkle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, rgba(255,200,230,0.9), transparent);
      border-radius: 50%;
      left: ${x}%;
      top: ${y}%;
      pointer-events: none;
      animation: sparkle-anim ${duration}s ${delay}s ease-in-out infinite;
    `;
    container.appendChild(sparkle);
  }

  // Inject keyframe
  const style = document.createElement('style');
  style.textContent = `
    #hero-sparkles {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
    }
    @keyframes sparkle-anim {
      0%, 100% { opacity: 0; transform: scale(0.5); }
      50% { opacity: 0.9; transform: scale(1.4); }
    }
  `;
  document.head.appendChild(style);

  for (let i = 0; i < 28; i++) {
    createSparkle();
  }
})();


// ============================================
// 7. SMOOTH SCROLLING FOR NAV ANCHORS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});
});

// ============================================
// 8. AUDIO & SPECIAL GIFT LOGIC
// ============================================
(function initAudioAndGift() {
  const bgmAudio = document.getElementById('bgm-audio');
  
  const vnBtn = document.getElementById('vn-btn');
  const vnAudio = document.getElementById('vn-audio');
  
  const openGiftBtn = document.getElementById('open-gift-btn');
  const giftClosed = document.getElementById('gift-closed');

  let isBgmPlaying = false;
  let resumeBgmAfterVoice = false;

  // --- BGM Logic ---
  if (bgmAudio) {
    bgmAudio.addEventListener('play', () => {
      isBgmPlaying = true;
    });

    bgmAudio.addEventListener('pause', () => {
      isBgmPlaying = false;
    });

    // Coba putar segera. Jika diblokir browser, interaksi pertama akan memulainya.
    bgmAudio.play().catch(() => {});
    document.addEventListener('pointerdown', function playOnFirstInteraction() {
      if (bgmAudio.paused) bgmAudio.play().catch(() => {});
    }, { once: true, capture: true });
    document.addEventListener('keydown', function playOnFirstKey() {
      if (bgmAudio.paused) bgmAudio.play().catch(() => {});
    }, { once: true });
  }

  // --- Voice Note Logic ---
  if (vnBtn && vnAudio) {
    let isVnPlaying = false;

    vnBtn.addEventListener('click', () => {
      if (isVnPlaying) {
        // Stop VN
        vnAudio.pause();
        vnAudio.currentTime = 0;
        vnBtn.textContent = '▶️ Putar Pesan';
        vnBtn.classList.remove('playing');
        isVnPlaying = false;
        
        if (resumeBgmAfterVoice && bgmAudio) {
          bgmAudio.play().catch(() => {});
        }
        resumeBgmAfterVoice = false;
      } else {
        // Play VN
        if (isBgmPlaying && bgmAudio) {
          resumeBgmAfterVoice = true;
          bgmAudio.pause(); // Pause BGM
        }
        
        vnAudio.play().catch(e => console.log('Audio play failed:', e));
        vnBtn.textContent = '⏹️ Hentikan Pesan';
        vnBtn.classList.add('playing');
        isVnPlaying = true;
      }
    });

    // Auto-resume BGM when VN ends
    vnAudio.addEventListener('ended', () => {
      vnBtn.textContent = '▶️ Putar Pesan';
      vnBtn.classList.remove('playing');
      isVnPlaying = false;
      
      if (resumeBgmAfterVoice && bgmAudio) {
        bgmAudio.play().catch(() => {});
      }
      resumeBgmAfterVoice = false;
    });
  }

  // --- Interactive Gift Logic ---
  const giftModal = document.getElementById('gift-modal');
  const closeGiftModalBtn = document.getElementById('close-gift-modal-btn');
  
  if (openGiftBtn && giftModal && closeGiftModalBtn) {
    openGiftBtn.addEventListener('click', () => {
      // Buka modal kado
      giftModal.classList.add('active');
      
      // Tembakkan konfeti
      launchConfetti();
    });

    closeGiftModalBtn.addEventListener('click', () => {
      giftModal.classList.remove('active');
    });

    // Close on overlay click
    giftModal.addEventListener('click', (e) => {
      if (e.target === giftModal) {
        giftModal.classList.remove('active');
      }
    });
  }
})();


// ============================================
// 9. MAKE A WISH (DARK MODE)
// ============================================
(function initMakeAWish() {
  const wishBtn = document.getElementById('wish-toggle');
  const darkOverlay = document.getElementById('dark-overlay');
  const cakeSection = document.getElementById('cake');

  if (!wishBtn || !darkOverlay) return;

  const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

  async function showCountdown() {
    const countdown = document.createElement('div');
    countdown.className = 'wish-countdown';
    countdown.setAttribute('role', 'status');
    countdown.setAttribute('aria-live', 'assertive');
    countdown.innerHTML = `
      <span class="wish-countdown-label">Siapkan permohonan terbaikmu...</span>
      <strong class="wish-countdown-number">3</strong>
    `;
    document.body.appendChild(countdown);

    const number = countdown.querySelector('.wish-countdown-number');
    for (const value of ['3', '2', '1']) {
      number.textContent = value;
      number.classList.remove('pop');
      void number.offsetWidth;
      number.classList.add('pop');
      await wait(1100);
    }

    number.textContent = '✨';
    countdown.querySelector('.wish-countdown-label').textContent = 'Saatnya membuat permohonan!';
    await wait(1000);
    countdown.classList.add('finished');
    await wait(250);
    countdown.remove();
  }

  function turnLightsOn() {
    document.body.classList.remove('wish-mode');
    darkOverlay.classList.remove('active');
    wishBtn.classList.remove('active');
    wishBtn.textContent = '🌙 Matikan Lampu Sekarang';
    wishBtn.setAttribute('aria-pressed', 'false');
    wishBtn.disabled = false;
    document.querySelector('.wish-countdown')?.remove();
  }

  // Dapat dipanggil tombol "Selamat Ulang Tahun" pada bagian kue.
  window.turnBirthdayLightsOn = turnLightsOn;
  wishBtn.setAttribute('aria-pressed', 'false');

  wishBtn.addEventListener('click', async () => {
    wishBtn.disabled = true;
    document.body.classList.add('wish-mode');
    darkOverlay.classList.add('active');
    wishBtn.classList.add('active');
    wishBtn.setAttribute('aria-pressed', 'true');

    await showCountdown();

    // Arahkan pengguna ke kue setelah hitung mundur selesai.
    if (cakeSection) {
      cakeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();
