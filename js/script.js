// Cursor de respingo
const cursor = document.createElement("div");
cursor.classList.add("cursor");
document.body.appendChild(cursor);

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

// Scroll Reveal
const reveals = document.querySelectorAll(".reveal-scroll");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.1 });

reveals.forEach((reveal) => observer.observe(reveal));

// Dividir Texto
document.querySelectorAll(".split-text").forEach((el) => {
  const text = el.innerText;
  el.innerHTML = "";
  text.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.innerText = char;
    span.style.animationDelay = `${i * 0.03}s`;
    el.appendChild(span);
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const submitBtn = form.querySelector("button[type='submit']");

  // Cria elemento de feedback
  const feedback = document.createElement("div");
  feedback.id = "form-feedback";
  feedback.style.display = "none";
  feedback.style.marginTop = "12px";
  feedback.style.fontWeight = "bold";
  form.appendChild(feedback);

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // evita o envio normal do form
    submitBtn.disabled = true;
    const origText = submitBtn.textContent;
    submitBtn.textContent = "Enviando...";

    const formData = new FormData(form);

    try {
      // Envia os dados para o FormSubmit
      await fetch(form.action, {
        method: form.method || "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      // Exibe feedback de sucesso
      feedback.style.display = "block";
      feedback.style.color = "green";
      feedback.textContent = "✅ Mensagem enviada! Obrigado.";

      form.reset(); // limpa os campos
    } catch (err) {
      feedback.style.display = "block";
      feedback.style.color = "red";
      feedback.textContent = "❌ Erro ao enviar. Tente novamente.";
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = origText;
    }
  });
});

// Lógica do Carrossel de Portfólio
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".portfolio-track");
  if (!track) return;

  const cards = Array.from(track.children);
  const nextButton = document.querySelector(".next-btn");
  const prevButton = document.querySelector(".prev-btn");

  let currentIndex = 0;
  const itemsPerPage = 2; // Mostrar 2 projetos por vez

  const updateCarousel = () => {
    const cardWidth = cards[0].offsetWidth;
    const gap = parseInt(window.getComputedStyle(track).gap);
    const moveDistance = (cardWidth + gap) * currentIndex;
    track.style.transform = `translateX(-${moveDistance}px)`;

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex >= cards.length - itemsPerPage;
  };

  nextButton.addEventListener("click", () => {
    // Avança para a próxima página de projetos
    currentIndex = Math.min(currentIndex + itemsPerPage, cards.length - itemsPerPage);
    updateCarousel();
  });

  prevButton.addEventListener("click", () => {
    currentIndex = Math.max(currentIndex - itemsPerPage, 0);
    updateCarousel();
  });

  // Atualiza o carrossel no carregamento e redimensionamento da janela
  window.addEventListener('resize', updateCarousel);
  updateCarousel();
});
