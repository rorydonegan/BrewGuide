const $ = (id) => document.getElementById(id);
const screens = document.querySelectorAll(".screen");

function show(id) {
  screens.forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
}

document.querySelectorAll("[data-method]").forEach((btn) => {
  btn.addEventListener("click", () => show("recipe"));
});

$("backHome")?.addEventListener("click", () => show("home"));
$("startBrew")?.addEventListener("click", () => show("brew"));
$("backRecipe")?.addEventListener("click", () => show("recipe"));

let step = 0;
const steps = [
  ["Bloom", "60g", "45 seconds"],
  ["Pour", "to 200g", "steady spiral"],
  ["Pour", "to 340g", "slow centre pour"],
  ["Drawdown", "Wait", "target 2:45–3:15"]
];

function renderStep() {
  const [title, main, sub] = steps[step];
  $("stepTitle").textContent = title;
  $("stepMain").textContent = main;
  $("stepSub").textContent = sub;
  $("prevStep").disabled = step === 0;
  $("nextStep").textContent = step === steps.length - 1 ? "Finish" : "Next";
}

$("prevStep")?.addEventListener("click", () => {
  if (step > 0) step--;
  renderStep();
});

$("nextStep")?.addEventListener("click", () => {
  if (step < steps.length - 1) {
    step++;
    renderStep();
  } else {
    step = 0;
    renderStep();
    show("home");
  }
});

renderStep();
