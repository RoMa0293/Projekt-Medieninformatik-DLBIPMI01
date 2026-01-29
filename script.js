/* =========================
   NAVBAR
========================= */

const toggleButton = document.getElementById('toggleButton');
const navbarLinks = document.querySelector('.navbar__links');
const navbarOverlay = document.getElementById('navbarOverlay');

const MOBILE_BREAKPOINT = 900;

/**
 * Prüft, ob wir uns im Mobile-Breakpoint befinden.
 * Wird an mehreren Stellen benötigt (Menu-Logik, Resize).
 */
function isMobile() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

/**
 * Öffnet das Mobile-Menü inkl. Overlay
 * max-height wird dynamisch gesetzt, damit CSS-Transition greift
 */
function openMenu() {
  toggleButton.classList.add('active');
  navbarLinks.classList.add('active');
  navbarOverlay.classList.add('active');
  navbarLinks.style.maxHeight = navbarLinks.scrollHeight + 'px';
  document.body.classList.add('nav-open');

  // ARIA-Attribute setzen
  toggleButton.setAttribute('aria-expanded', 'true');
  toggleButton.setAttribute('aria-label', 'Menü schließen');
}

/**
 * Schließt das Menü.
 * max-height nur auf Mobile zurücksetzen – Desktop nutzt normales Layout.
 */
function closeMenu() {
  toggleButton.classList.remove('active');
  navbarLinks.classList.remove('active');
  navbarOverlay.classList.remove('active');

  navbarLinks.style.maxHeight = isMobile() ? '0' : '';
  document.body.classList.remove('nav-open');

  // ARIA-Attribute zurücksetzen
  toggleButton.setAttribute('aria-expanded', 'false');
  toggleButton.setAttribute('aria-label', 'Menü öffnen');
}

// Burger-Button
toggleButton.addEventListener('click', e => {
  e.preventDefault();
  navbarLinks.classList.contains('active') ? closeMenu() : openMenu();
});

// Klick auf dunkles Overlay schließt Menü
navbarOverlay.addEventListener('click', closeMenu);

// Navigation-Link → Menü nur auf Mobile schließen
navbarLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (isMobile()) closeMenu();
  });
});


/* =========================
   TIMELINE
========================= */

const timelineButtons = document.querySelectorAll('.about__timeline-btn');
const timelineContent = document.querySelector('.about__timeline-content');

const imgContainer = timelineContent.querySelector('.about__timeline-img');
const textContainer = timelineContent.querySelector('.about__timeline-text');
const h3 = textContainer.querySelector('h3');
const p = textContainer.querySelector('p');

/**
 * Zentrale Datenquelle der Timeline.
 * Buttons referenzieren die Keys über data-year.
 */
const timelineData = {
  2020: {
    img: 'timeline-2020.jpg',
    title: '2020 – Erste Rezeptideen',
    text: 'Alles begann in der heimischen Küche ...'
  },
  2021: {
    img: 'timeline-2021.jpg',
    title: '2021 – Kleinproduktion & Tests',
    text: 'Die erste kleine Produktionscharge ...'
  },
  2022: {
    img: 'timeline-2022.jpg',
    title: '2022 – Markteintritt',
    text: 'Der Online-Shop ging live ...'
  },
  2024: {
    img: 'timeline-2024.jpg',
    title: '2024 – Optimierte Rezepturen',
    text: 'Basierend auf Nutzerfeedback ...'
  },
  2026: {
    img: 'timeline-2026.jpg',
    title: '2026 – Heute & Ausblick',
    text: 'Heute steht Pawlant für eine klare Vision ...'
  }
};

/**
 * Unterschiedliche Border-Radien je nach Layout
 * (horizontal vs. gestapelt)
 */
function getBorderRadius() {
  return window.innerWidth <= 900
    ? '1rem 1rem 0 0'
    : '1rem 0 0 1rem';
}

// Button-Klick: Text + Bild wechseln mit Fade-Animation
timelineButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    timelineButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const data = timelineData[btn.dataset.year];
    const oldImg = imgContainer.querySelector('img');

    textContainer.classList.add('text-fade-out');

    const newImg = document.createElement('img');
    newImg.src = data.img;
    newImg.alt = data.title;
    newImg.style.cssText = `
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
      object-fit:cover;
      opacity:0;
      transition:opacity .5s ease;
      border-radius:${getBorderRadius()};
    `;

    imgContainer.appendChild(newImg);

    // Minimaler Delay, damit Transition zuverlässig greift
    setTimeout(() => {
      newImg.style.opacity = 1;
      h3.textContent = data.title;
      p.textContent = data.text;
      textContainer.classList.remove('text-fade-out');

      setTimeout(() => oldImg.remove(), 500);
    }, 50);
  });
});


/* =========================
   TIMELINE SWIPE (MOBILE)
========================= */

let currentIndex = 0;
const years = Object.keys(timelineData);

// Initial aktiven Button finden
timelineButtons.forEach((btn, i) => {
  if (btn.classList.contains('active')) currentIndex = i;
});

let touchStartX = 0;
let touchEndX = 0;

/**
 * Ermittelt Swipe-Richtung und triggert
 * den entsprechenden Timeline-Button
 */
function handleSwipe() {
  if (Math.abs(touchStartX - touchEndX) < 50) return;

  if (touchStartX > touchEndX && currentIndex < years.length - 1) {
    timelineButtons[++currentIndex].click();
  }

  if (touchStartX < touchEndX && currentIndex > 0) {
    timelineButtons[--currentIndex].click();
  }
}

// Touch nur auf Mobile aktiv
timelineContent.addEventListener('touchstart', e => {
  if (!isMobile()) return;
  touchStartX = e.changedTouches[0].screenX;
});

timelineContent.addEventListener('touchend', e => {
  if (!isMobile()) return;
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

// Index synchron halten bei Button-Klicks
timelineButtons.forEach((btn, index) => {
  btn.addEventListener('click', () => currentIndex = index);
});


/* =========================
   QUIZ
========================= */

const quiz = [
  {
    q: 'Woraus setzt sich der Name Pawlant zusammen?',
    a: ['Paw & Planet', 'Paw & Plant', 'Pet & Plant'],
    correct: 1
  },
  {
    q: 'Welche Fachrichtungen brachten die Gründer:innen ein?',
    a: ['Marketing & Wirtschaft', 'Ernährungswissenschaft & Produktdesign', 'Tiermedizin & IT'],
    correct: 1
  },
  {
    q: 'Welches Ziel verfolgt Pawlant?',
    a: ['Günstige Massenproduktion', 'Gesunde Hundeernährung mit geringem CO₂-Abdruck', 'Trendprodukte'],
    correct: 1
  }
];

let current = 0;

const qEl = document.getElementById('quizQuestion');
const aEl = document.getElementById('quizAnswers');
const fEl = document.getElementById('quizFeedback');
const resetBtn = document.getElementById('quizReset');
const progress = document.getElementById('quizProgress');

function loadQuiz() {
  qEl.textContent = quiz[current].q;
  aEl.innerHTML = '';
  fEl.textContent = '';
  fEl.className = 'quiz__feedback';
  progress.style.width = `${(current / quiz.length) * 100}%`;

  quiz[current].a.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.onclick = () => checkAnswer(btn, i);
    aEl.appendChild(btn);
  });
}

function checkAnswer(button, choice) {
  if (choice === quiz[current].correct) {
    button.classList.add('correct');
    fEl.textContent = '✔️ Richtig!';
    fEl.classList.add('quiz__feedback--correct');
    current++;

    setTimeout(() => current < quiz.length ? loadQuiz() : showResult(), 700);
  } else {
    button.classList.add('wrong');
    fEl.textContent = '❌ Falsch – versuch es nochmal.';
    fEl.classList.add('quiz__feedback--wrong');
  }
}

function showResult() {
  qEl.textContent = '🎉 Perfekt gelöst!';
  aEl.innerHTML = '';
  progress.style.width = '100%';
  fEl.innerHTML = 'Rabattcode: <strong>PAWLANT10</strong>';
  fEl.classList.add('quiz__feedback--correct');
  resetBtn.classList.remove('hidden');
  launchConfetti();
}

resetBtn.onclick = () => {
  current = 0;
  resetBtn.classList.add('hidden');
  clearConfetti();
  loadQuiz();
};

loadQuiz();


/* =========================
   CONFETTI
========================= */

const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');

let confetti = [];
let confettiActive = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();

function launchConfetti() {
  confettiActive = true;
  confetti = Array.from({ length: 180 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    r: Math.random() * 6 + 4,
    d: Math.random() * 4 + 2
  }));
  requestAnimationFrame(drawConfetti);
}

function drawConfetti() {
  if (!confettiActive) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(244,162,97,.85)';
    ctx.fill();
    c.y += c.d;
  });

  if (confetti.some(c => c.y < canvas.height + c.r)) {
    requestAnimationFrame(drawConfetti);
  } else {
    clearConfetti();
  }
}

function clearConfetti() {
  confettiActive = false;
  confetti = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}


/* =========================
   SCROLL TO TOP
========================= */

const scrollTopButton = document.querySelector('.scroll-top');

window.addEventListener('scroll', () => {
  scrollTopButton.style.display =
    window.scrollY > 600 ? 'flex' : 'none';
});

scrollTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* =========================
   PROMO MODAL
========================= */

const promoTab = document.getElementById('promoTab');
const promoOverlay = document.getElementById('promoOverlay');

const modalClose = promoOverlay.querySelector('.modal__close');
const modalCancel = promoOverlay.querySelector('.modal-cancel');
const modalCancel2 = promoOverlay.querySelector('.modal-cancel2');
const tabClose = promoTab.querySelector('.promo-tab__close');

promoTab.addEventListener('click', () => {
  promoOverlay.classList.add('is-active');
});

function closeModal() {
  promoOverlay.classList.remove('is-active');
}

modalClose.addEventListener('click', closeModal);
modalCancel.addEventListener('click', closeModal);
modalCancel2.addEventListener('click', closeModal);

// Klick außerhalb des Modals
promoOverlay.addEventListener('click', e => {
  if (e.target === promoOverlay) closeModal();
});

// Promo-Tab dauerhaft schließen
tabClose.addEventListener('click', e => {
  e.stopPropagation();
  promoTab.style.display = 'none';
});


/* =========================
   PROJEKT HINWEISE / DUMMY LINKS
========================= */

function showProjectHint() {
  const hint = document.createElement('div');
  hint.className = 'project-hint';
  hint.textContent = 'ℹ️ Studienprojekt – Funktion nicht implementiert';
  document.body.appendChild(hint);

  setTimeout(() => hint.remove(), 2500);
}

document.querySelectorAll('.dummy-link').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    showProjectHint();
  });
});


/* =========================
   GLOBAL RESIZE HANDLING
========================= */

/* Reagiert auf Änderungen der Fenstergröße und stellt sicher,
 * dass alle JS-gesteuerten UI-Zustände wieder zum aktuellen
 * Responsive-Layout passen.
 *
 * Wichtig:
 * - CSS Media Queries allein reichen nicht aus,
 *   da einige Zustände (Menu, Canvas, Timeline-Bild)
 *   per JavaScript manipuliert werden.
 */
window.addEventListener('resize', () => {

  /* =========================
     CONFETTI CANVAS
     =========================
     Canvas skaliert sich NICHT automatisch mit dem Viewport.
     Bei Resize müssen Breite & Höhe neu gesetzt werden,
     sonst entstehen unscharfe oder abgeschnittene Effekte.
  */
  resizeCanvas();


  /* =========================
     NAVIGATION RESET (DESKTOP)
     =========================
     Wenn von Mobile → Desktop gewechselt wird, können sonst
     Mobile-Zustände "hängen bleiben":
     - Burger-Menü offen
     - Overlay aktiv
     - Body-Scroll gesperrt
     - Inline max-height blockiert Layout
     
     Deshalb: Desktop-Zustand erzwingen.
  */
  if (!isMobile()) {
    closeMenu();                 // entfernt active-Klassen & Scroll-Lock
    navbarLinks.style.maxHeight = ''; // entfernt Mobile-Inline-Styles
  }


  /* =========================
     TIMELINE BILD ANPASSUNG
     =========================
     Das Timeline-Bild wird dynamisch per JS erzeugt
     und erhält seinen border-radius inline.
     
     Da sich das Layout per Media Query ändert
     (Bild links ↔ Bild oben), muss der Radius
     bei Resize neu gesetzt werden.
  */
  const img = imgContainer.querySelector('img');
  if (img) {
    img.style.borderRadius = getBorderRadius();
  }
});

