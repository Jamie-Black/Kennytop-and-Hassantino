document.addEventListener('DOMContentLoaded', ()=> {
  // Defensive selection to avoid "null" errors
  const themeToggle = document.getElementById('themeToggle');
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('primaryNav');
  const hero = document.querySelector('.hero');

  // --- Theme persistence & toggle ---
  try {
    const savedTheme = localStorage.getItem('ktTheme');
    if (savedTheme === 'light') document.body.classList.add('dark');
    if (themeToggle) {
      themeToggle.textContent = document.body.classList.contains('dark') ? '🌙' : '☀️';
      themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('dark');
        themeToggle.textContent = isLight ? '🌙' : '☀️';
        localStorage.setItem('ktTheme', isLight ? 'dark' : 'dark');
      });
    }
  } catch (err) {
    console.warn('Theme toggle failed:', err);
  }

  // --- Mobile menu toggle ---
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      nav.setAttribute('aria-hidden', String(!isOpen));
    });

    // close nav when clicking a link (mobile)
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          menuBtn.setAttribute('aria-expanded', 'false');
          nav.setAttribute('aria-hidden', 'true');
        }
      });
    });

    // close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        nav.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // --- Hero Carousel (slides + dynamic text) ---
  try {
    const slides = Array.from(document.querySelectorAll('.slide'));
    const heroTitle = document.getElementById('heroTitle');
    const heroDesc  = document.getElementById('heroDesc');

    if (slides.length && heroTitle && heroDesc) {
      let index = 0;
      function applyText(i) {
        const s = slides[i];
        heroTitle.textContent = s.dataset.title || heroTitle.textContent;
        heroDesc.textContent  = s.dataset.desc  || heroDesc.textContent;
      }
      applyText(0);

      function goTo(n) {
        slides.forEach(s => s.classList.remove('active'));
        slides[n].classList.add('active');
        applyText(n);
        index = n;
      }
      function next() { goTo((index + 1) % slides.length); }

      let interval = setInterval(next, 5000);

      // pause on hover/touch
      if (hero) {
        hero.addEventListener('mouseenter', ()=> clearInterval(interval));
        hero.addEventListener('mouseleave', ()=> interval = setInterval(next, 5000));
        hero.addEventListener('touchstart', ()=> clearInterval(interval), {passive:true});
        hero.addEventListener('touchend', ()=> interval = setInterval(next, 5000));
      }
    }
  } catch (err) {
    console.warn('Carousel failed:', err);
  }

  // --- Modal for collection (delegated) ---
  try {
    const modal = document.getElementById('watchModal');
    const modalClose = document.getElementById('modalClose');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalDesc = document.getElementById('modalDesc');

    document.addEventListener('click', (e) => {
      const btn = e.target.closest && e.target.closest('.view-btn');
      if (btn) {
        if (modal && modalImg && modalTitle && modalPrice && modalDesc) {
          modalImg.src = btn.dataset.img || '';
          modalTitle.textContent = btn.dataset.title || '';
          modalPrice.textContent = btn.dataset.price || '';
          modalDesc.textContent = btn.dataset.desc || '';
          modal.classList.add('show');
          modal.setAttribute('aria-hidden', 'false');
        }
      }
    });

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        modal && modal.classList.remove('show');
        modal && modal.setAttribute('aria-hidden', 'true');
      });
    }

    if (modal) {
      modal.addEventListener('click', e => {
        if (e.target === modal) {
          modal.classList.remove('show');
          modal.setAttribute('aria-hidden', 'true');
        }
      });
    }

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  } catch (err) {
    console.warn('Modal failed:', err);
  }
});

// Open order form with selected watch
function openForm(watch) {
  document.getElementById("orderForm").style.display = "flex";
  document.getElementById("watchName").value = watch;
}

function closeForm() {
  document.getElementById("orderForm").style.display = "none";
}

// Open form and set product name
function openForm(productName) {
  document.getElementById("orderForm").style.display = "flex";
  document.getElementById("watchName").value = productName;
}

// Close form
function closeForm() {
  document.getElementById("orderForm").style.display = "none";
}

// Handle submit → redirect to WhatsApp
document.getElementById("orderFormSubmit").addEventListener("submit", function(e) {
  e.preventDefault();

  let name = document.getElementById("customerName").value;
  let email = document.getElementById("customerEmail").value;
  let phone = document.getElementById("customerNumber").value;
  let phone2 = document.getElementById("customerNumber2").value;
  let address = document.getElementById("customerAddress").value;
  let product = document.getElementById("watchName").value;

  let message = `Hello, I want to order:\n\n📌 Product: ${product}\n👤 Name: ${name}\n📞 Phone: ${phone}\n📧 📞 Phone 2: ${phone2}\n📧 Email: ${email}\n🏠 Address: ${address}`;
  
  let whatsappNumber = "+234818793 4334"; // 👉 Replace with your WhatsApp number
  let url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
  closeForm();
});


// Timeline animation on scroll
const timelineItems = document.querySelectorAll(".timeline-item");

function showTimelineItems() {
  const triggerBottom = window.innerHeight * 0.85;

  timelineItems.forEach(item => {
    const itemTop = item.getBoundingClientRect().top;

    if (itemTop < triggerBottom) {
      item.classList.add("show");
    }
  });
}

window.addEventListener("scroll", showTimelineItems);
showTimelineItems();

  (function(){
    emailjs.init("65TB-Hg7Cd_q6CnnX"); // replace with your EmailJS public key
  })();

  document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    emailjs.sendForm("service_a0tvigb", "template_5oorzjk", this)
      .then(function() {
        alert("✅ Message sent successfully!");
      }, function(error) {
        alert("❌ Failed to send message. Please try again.");
        console.log("EmailJS Error:", error);
      });
      document.getElementById("contact-form").reset();
  });
  
  // ====== Review Carousel ======
let reviewIndex = 0;
const reviewSlides = document.querySelectorAll(".review-slide");
const reviewDots = document.querySelectorAll(".review-indicators .dot");

function showReviewSlide(index) {
  reviewSlides.forEach((slide, i) => {
    slide.classList.remove("active");
    reviewDots[i].classList.remove("active");
    if (i === index) {
      slide.classList.add("active");
      reviewDots[i].classList.add("active");
    }
  });
}

function nextReviewSlide() {
  reviewIndex = (reviewIndex + 1) % reviewSlides.length;
  showReviewSlide(reviewIndex);
}

// Auto-change every 5 seconds
setInterval(nextReviewSlide, 7000);

// Allow click on dots
reviewDots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    reviewIndex = i;
    showReviewSlide(reviewIndex);
  });
});
