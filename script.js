const mediaData = [
  { name: "RTVC", value: 3 },
  { name: "Cambio", value: 3 },
  { name: "Juventud Med", value: 2 },
  { name: "BBC", value: 2 },
  { name: "El Espectador", value: 2 },
  { name: "Latinus", value: 1 },
  { name: "Política para políticos", value: 1 },
  { name: "La silla vacía", value: 1 },
  { name: "Telemundo", value: 1 },
  { name: "La Base", value: 1 },
  { name: "BW", value: 1 },
  { name: "El Colombiano", value: 1 },
  { name: "SIC Noticias", value: 1 },
  { name: "CNN", value: 1 },
  { name: "Telemedellín", value: 1 },
  { name: "Canal Uno", value: 1 },
  { name: "TeleAntioquia", value: 1 },
  { name: "Señal Colombia", value: 1 }
];

const menuItems = document.querySelectorAll(".menu-item");
const panels = document.querySelectorAll(".content-panel");
const counters = document.querySelectorAll(".counter");
const barChart = document.getElementById("barChart");
const segmentA = document.querySelector(".segment-a");
const segmentB = document.querySelector(".segment-b");
const scene = document.querySelector(".scene");

const donutCircumference = 2 * Math.PI * 76;
const percentNo = 64.52;
const percentYes = 35.48;

function setActiveSection(sectionId) {
  menuItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.section === sectionId);
  });

  panels.forEach((panel) => {
    const isActive = panel.id === sectionId;
    panel.classList.toggle("active", isActive);
    if (isActive) {
      panel.classList.remove("panel-enter");
      void panel.offsetWidth;
      panel.classList.add("panel-enter");
    }
  });

  if (sectionId === "graficos") {
    animateBars();
    animateDonut();
  }
}

function animateCounter(element) {
  const target = Number(element.dataset.target);
  const suffix = element.dataset.suffix || "";
  const isDecimal = target % 1 !== 0;
  const duration = 1500;
  const startTime = performance.now();

  function updateCounter(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    element.textContent = `${isDecimal ? current.toFixed(2) : Math.round(current)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = `${isDecimal ? target.toFixed(2) : target}${suffix}`;
    }
  }

  requestAnimationFrame(updateCounter);
}

function runCounters() {
  counters.forEach((counter) => animateCounter(counter));
}

function buildBarChart() {
  const maxValue = Math.max(...mediaData.map((item) => item.value));

  mediaData.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "bar-row";

    const label = document.createElement("span");
    label.className = "bar-label";
    label.textContent = item.name;

    const track = document.createElement("div");
    track.className = "bar-track";

    const fill = document.createElement("div");
    fill.className = "bar-fill";
    fill.dataset.width = `${(item.value / maxValue) * 100}%`;
    fill.style.transitionDelay = `${index * 45}ms`;
    track.appendChild(fill);

    const value = document.createElement("span");
    value.className = "bar-value";
    value.textContent = item.value;

    row.append(label, track, value);
    barChart.appendChild(row);
  });
}

function animateBars() {
  const fills = document.querySelectorAll(".bar-fill");
  fills.forEach((fill) => {
    fill.style.width = "0";
  });

  requestAnimationFrame(() => {
    fills.forEach((fill) => {
      fill.style.width = fill.dataset.width;
    });
  });
}

function animateDonut() {
  const segmentALength = donutCircumference * (percentNo / 100);
  const segmentBLength = donutCircumference * (percentYes / 100);

  segmentA.style.strokeDasharray = `${segmentALength} ${donutCircumference}`;
  segmentB.style.strokeDasharray = `${segmentBLength} ${donutCircumference}`;
  segmentA.style.strokeDashoffset = donutCircumference;
  segmentB.style.strokeDashoffset = donutCircumference - segmentALength + 16;

  requestAnimationFrame(() => {
    segmentA.style.strokeDashoffset = 0;
    segmentB.style.strokeDashoffset = -(segmentALength + 10);
  });
}

function setupNavigation() {
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      setActiveSection(item.dataset.section);
    });
  });
}

function setupParallax() {
  window.addEventListener("mousemove", (event) => {
    const offsetX = (event.clientX / window.innerWidth - 0.5) * 16;
    const offsetY = (event.clientY / window.innerHeight - 0.5) * 16;
    scene.style.transform = `translate3d(${offsetX * -0.2}px, ${offsetY * -0.2}px, 0)`;
  });
}

buildBarChart();
setupNavigation();
setupParallax();
runCounters();

setTimeout(() => {
  animateBars();
  animateDonut();
}, 450);
