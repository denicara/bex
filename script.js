// ---- State ----
const state = {
  herName: "My Love",
  typingDone: false,
  noClicks: 0
};

// ---- Helpers ----
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

function showStage(id){
  $$(".stage").forEach(st => st.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setName(name){
  state.herName = name || "My Love";
  $("#nameSlot").textContent = state.herName;
  $("#nameSlot2").textContent = state.herName;
}

// ---- Envelope open ----
const envelope = $("#envelope");

function openEnvelope(){
  envelope.classList.add("open");
  // little delay to let animation feel nice
  setTimeout(() => showStage("stageLetter"), 650);
}

envelope.addEventListener("click", openEnvelope);
envelope.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openEnvelope();
});

// ---- Typewriter ----
const typedEl = $("#typedText");
const caret = $("#caret");
const nextBtn = $("#nextBtn");
const skipBtn = $("#skipBtn");
const replayBtn = $("#replayBtn");

const letterText = [
  `I need to get this off my chest.`,
  ``,
  `I'm so nervous...`,
  ``,
  `Sooo I have this very big crush on you and I think you are the prettiest girl in the whole wide world.`,
  `There is this holiday coming up. One of those holidays where I get to celebrate you!!!`,
  ``,
  `It would be the WORLD to me if you could answer this question.`
].join("\n");

let typingTimer = null;
let i = 0;

function resetTyping(){
  clearInterval(typingTimer);
  i = 0;
  state.typingDone = false;
  typedEl.textContent = "";
  nextBtn.disabled = true;
  caret.style.display = "inline-block";
}

function finishTypingInstant(){
  clearInterval(typingTimer);
  typedEl.textContent = letterText;
  state.typingDone = true;
  nextBtn.disabled = false;
  caret.style.display = "none";
}

function startTyping(){
  resetTyping();
  typingTimer = setInterval(() => {
    typedEl.textContent = letterText.slice(0, i);
    i++;

    // keep caret roughly at end by moving it using a hacky measure
    // (good enough visually)
    if (i >= letterText.length){
      finishTypingInstant();
    }
  }, 22);
}

skipBtn.addEventListener("click", finishTypingInstant);
replayBtn.addEventListener("click", startTyping);

nextBtn.addEventListener("click", () => showStage("stageAsk"));

// ---- Ask logic ----
const yesBtn = $("#yesBtn");
const noBtn = $("#noBtn");
const noHint = $("#noHint");

const YT_LINK = "https://youtu.be/REiJQrmglBs?si=P-N3pWTOaCIQeOZL";

const noPhrases = [
  "Babe??",
  "K.",
  "BRO",
  "Benito is crying now...",
  "QIFSHA ROPT"
];

noBtn.addEventListener("click", () => {
  state.noClicks++;

  // 1–3 clicks show your messages
  if (state.noClicks <= 3) {
    noHint.textContent = noPhrases[state.noClicks - 1];
    return;
  }

  // 4th click: open YouTube in a new tab
  if (state.noClicks === 5) {
    noHint.textContent = "so you hate me";
    window.open(YT_LINK, "_blank", "noopener,noreferrer");
    return;
  }

  // 5+ clicks (optional): keep reacting after the video
  noHint.textContent = "okay, you actually hate me";
});

yesBtn.addEventListener("click", () => {
  heartBurst(30);
  showStage("stageYes");

});

// ---- Heart confetti ----
function heartBurst(n=24){
  for (let k = 0; k < n; k++){
    const el = document.createElement("div");
    el.textContent = Math.random() > 0.5 ? "💖" : "💗";
    el.style.position = "fixed";
    el.style.left = (window.innerWidth/2 + (Math.random()*260 - 130)) + "px";
    el.style.top  = (window.innerHeight/2 + (Math.random()*100 - 50)) + "px";
    el.style.fontSize = (Math.random()*18 + 14) + "px";
    el.style.zIndex = "9999";
    el.style.pointerEvents = "none";

    const driftX = (Math.random()*420 - 210);
    const driftY = (Math.random()*520 + 240);

    el.animate([
      { transform: "translate(0,0)", opacity: 1 },
      { transform: `translate(${driftX}px, ${-driftY}px)`, opacity: 0 }
    ], {
      duration: 1200 + Math.random()*700,
      easing: "cubic-bezier(.2,.8,.2,1)"
    });

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }
}


function makeFloatingBears(count = 14) {
  const container = document.querySelector(".floating-bears");
  if (!container) return;

  // clear if rerun
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const b = document.createElement("div");
    b.textContent = "🧸";

    b.style.position = "absolute";
    b.style.left = (Math.random() * 100) + "%";
    b.style.top = (Math.random() * 100) + "%";
    b.style.fontSize = (Math.random() * 18 + 14) + "px";
    b.style.opacity = (Math.random() * 0.35 + 0.15).toFixed(2);

    const dur = (Math.random() * 7 + 7).toFixed(2);
    const delay = (Math.random() * 3).toFixed(2);

    b.style.animation = `bearFloat ${dur}s ease-in-out ${delay}s infinite`;

    container.appendChild(b);
  }
}

// ---- Boot ----
(function init(){
    
    makeFloatingBears(18);
  showStage("stageEnvelope");
  startTyping(); // Preload typing so it's ready when envelope opens
})();
