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
  return `
    <div class="card" data-id="${quest.id}">
      <h3>${quest.title}</h3>
      <p>${quest.description}</p>
      <span>${quest.duration}</span>
      <span>${quest.difficulty}</span>
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