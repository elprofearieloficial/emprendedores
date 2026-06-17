const canvases = ["networkCanvas", "finalCanvas"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

function makeNetwork(canvas, options = {}) {
  const ctx = canvas.getContext("2d");
  const dots = [];
  let width = 0;
  let height = 0;
  const count = options.count || 92;

  function reset() {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    dots.length = 0;
    for (let i = 0; i < count; i += 1) {
      dots.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        r: 1.2 + Math.random() * 1.9
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const dot of dots) {
      dot.x += dot.vx;
      dot.y += dot.vy;
      if (dot.x < 0 || dot.x > width) dot.vx *= -1;
      if (dot.y < 0 || dot.y > height) dot.vy *= -1;
    }

    for (let i = 0; i < dots.length; i += 1) {
      for (let j = i + 1; j < dots.length; j += 1) {
        const a = dots[i];
        const b = dots[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 132) {
          const alpha = (1 - distance / 132) * 0.38;
          ctx.strokeStyle = `rgba(74, 255, 242, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const dot of dots) {
      ctx.fillStyle = "rgba(113, 255, 246, 0.82)";
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  reset();
  draw();
  window.addEventListener("resize", reset);
}

canvases.forEach((canvas, index) => makeNetwork(canvas, { count: index === 0 ? 110 : 74 }));

const flowSections = Array.from(document.querySelectorAll("main > section"));
flowSections.forEach((section, index) => {
  if (!section.id) {
    section.id = `pagina-${index + 1}`;
  }
});

flowSections.slice(0, -1).forEach((section, index) => {
  const arrow = document.createElement("a");
  arrow.className = "flow-link";
  arrow.href = `#${flowSections[index + 1].id}`;
  arrow.setAttribute("aria-label", "Avanzar a la siguiente sección");
  section.appendChild(arrow);
});

const topbar = document.querySelector(".topbar");
const links = Array.from(document.querySelectorAll("nav a"));
const sections = links
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function setActiveNav() {
  const offset = (topbar?.offsetHeight || 0) + 80;
  let active = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top - offset <= 0) {
      active = section;
    }
  }
  links.forEach((link) => {
    const selected = link.getAttribute("href") === `#${active.id}`;
    link.toggleAttribute("aria-current", selected);
  });
}

window.addEventListener("scroll", setActiveNav, { passive: true });
setActiveNav();
