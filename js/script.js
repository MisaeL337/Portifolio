document.addEventListener('DOMContentLoaded', () => {
  // 1. Rolagem suave para links âncora
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 2. Cursor de respingo
  const cursor = document.createElement("div");
  cursor.classList.add("cursor");
  document.body.appendChild(cursor);

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  // 3. Scroll Reveal
  const reveals = document.querySelectorAll(".reveal-scroll");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach((reveal) => observer.observe(reveal));

  // 4. Dividir Texto
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

  // 5. Lógica de envio de formulário
  const form = document.querySelector("form");
  if (form) {
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
  }

  // 6. Lógica do Carrossel de Portfólio
  const carousel = document.getElementById('portfolio-carousel');
  if (carousel) {
    const track = carousel.querySelector('.portfolio-track');
    const cards = Array.from(track.children);
    const nextButton = carousel.querySelector('.next-btn');
    const prevButton = carousel.querySelector('.prev-btn');

    let currentIndex = 0;

    // Função para obter a largura do card e o gap
    const getCardWidth = () => {
      if (cards.length === 0) return 0;
      const cardStyle = window.getComputedStyle(cards[0]);
      const trackStyle = window.getComputedStyle(track);
      const cardWidth = cards[0].offsetWidth;
      const cardMargin = parseFloat(cardStyle.marginLeft) + parseFloat(cardStyle.marginRight);
      const trackGap = parseFloat(trackStyle.gap) || 0;
      return cardWidth + cardMargin + trackGap;
    };

    // Função para mover para o slide e atualizar botões
    const moveToSlide = (index) => {
      const slideWidth = getCardWidth();
      track.style.transform = `translateX(-${index * slideWidth}px)`;
      currentIndex = index;

      // Habilita/desabilita botões
      prevButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex >= cards.length - 1;
    };

    nextButton.addEventListener("click", () => {
      if (currentIndex < cards.length - 1) {
        moveToSlide(currentIndex + 1);
      }
    });

    prevButton.addEventListener("click", () => {
      if (currentIndex > 0) {
        moveToSlide(currentIndex - 1);
      }
    });

    // Atualiza o carrossel no carregamento e redimensionamento da janela
    window.addEventListener('resize', () => moveToSlide(currentIndex));
    moveToSlide(0); // Inicializa o carrossel
  }
});
