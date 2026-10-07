const sections = document.querySelectorAll("section");
const navButtons = document.querySelectorAll("nav button");
const todaysQuests = document.querySelector("#todays-quests");
const today=new Date();
const dayNumber = today.getFullYear() * 400 + today.getMonth() *31 + today.getDate();
const start=(dayNumber * 3) % allQuests.length;
const questSheet = document.querySelector("#quest-sheet");
const sheetContent = document.querySelector("#sheet-content");
const closeSheet = document.querySelector("#close-sheet");






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

for (let i=0; i<3; i++){
  const index = (start+i) % allQuests.length;
  todaysQuests.innerHTML += makeCard(allQuests[index]);
}

navButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    showView(button.dataset.view);
  });
});


function makeSheet(quest){
  let objectives ="";
  quest.objectives.forEach(function(objective){
    objectives += `<li>${objective}</li>`;
  });
  let tip ="";
  if(quest.tip){
    tip = `<p>${quest.tip}</p>`;
  }
  return `
    <div class="badge">${quest.emoji}</div>
    <h2>${quest.title}</h2>
    <p>${quest.description}</p>
    <h3>What to do</h3>
    <ul>${objectives}</ul>
    <p>You'll walk away with ${quest.reward}</p>
    ${tip}
  `;
}
















showView("home");