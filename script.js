const sections = document.querySelectorAll("section");
const navButtons = document.querySelectorAll("nav button");
const todaysQuests = document.querySelector("#todays-quests");

function showView(name) {
  sections.forEach(function(section) {
    if (section.id === name) {
      section.classList.remove("hidden");
    } else {
      section.classList.add("hidden");
    }
  });
}

function makeCard(quest) {
  const filled = "●".repeat(quest.difficulty);
  const empty = "○".repeat(5 - quest.difficulty);

  return `
    <div class="card" data-id="${quest.id}">
      <span class="badge">${quest.emoji}</span>
      <h3>${quest.title}</h3>
      <p>${quest.description}</p>
      <span class="duration">${quest.duration}</span>
      <span class="difficulty">${filled}${empty}</span>
    </div>
  `;
}

allQuests.slice(0, 3).forEach(function(quest) {
  todaysQuests.innerHTML += makeCard(quest);
});

navButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    showView(button.dataset.view);
  });
});

showView("home");