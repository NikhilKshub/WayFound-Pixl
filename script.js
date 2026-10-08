const sections = document.querySelectorAll("section");
const navButtons = document.querySelectorAll("nav button");
const todaysQuests = document.querySelector("#todays-quests");
const today=new Date();
const dayNumber = today.getFullYear() * 400 + today.getMonth() *31 + today.getDate();
const start=(dayNumber * 3) % allQuests.length;
const questSheet = document.querySelector("#quest-sheet");
const sheetContent = document.querySelector("#sheet-content");
const closeSheet = document.querySelector("#close-sheet");
const progress = JSON.parse(localStorage.getItem("wayfound-progress")) || {};

function saveProgress(){
  localStorage.setItem("wayfound-progress",JSON.stringify(progress));
}

function getStatus(id){
  if(!progress[id]){
    return "new";
  }
  return progress[id].status;
}



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
  const status = getStatus(quest.id);
  let tag ="";
  if(status === "active"){
    tag = `<span class="tag active">IN PROGRESS</span>`;
  }
  if(status === "done"){
    tag = `<span class="tag done">DONE</span>`;
  }

  return `
    <div class="card" data-id="${quest.id}">
      <span class="badge">${quest.emoji}</span>
      <h3>${quest.title}</h3>
      <p>${quest.description}</p>
      ${tag}
      <span class="duration">${quest.duration}</span>
      <span class="difficulty">${filled}${empty}</span>
    </div>
  `;
}

function showTodaysQuests(){
  todaysQuests.innerHTML = "";
  for(let i=0; i<3; i++){
    const index = (start + i) % allQuests.length;
    todaysQuests.innerHTML += makeCard(allQuests[index]);
  }
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

  const status = getStatus(quest.id);
  let buttons="";
  if(status === "new"){
    buttons = `<button data-action="accept" data-id="${quest.id}">Accept quest</button>`;
  }
  if(status ==="active"){
    buttons = `<button data-action="complete" data-id="${quest.id}">Mark as done</button>`;
  if(status ==="done"){
    buttons = `<p>You finished it.</p>`;
  } 
  }

  return `
    <div class="badge">${quest.emoji}</div>
    <h2>${quest.title}</h2>
    <p>${quest.description}</p>
    <h3>What to do</h3>
    <ul>${objectives}</ul>
    <p>You'll walk away with ${quest.reward}</p>
    ${tip}
    ${buttons}
  `;
}

todaysQuests.addEventListener("click",function(event){
  const card = event.target.closest(".card");
  if(!card) return;
  const id = card.dataset.id;
  const quest = allQuests.find(function(quest){
    return quest.id === id;
  });
  sheetContent.innerHTML = makeSheet(quest);
  questSheet.showModal();
})

closeSheet.addEventListener("click",function(){
  questSheet.close();
});

sheetContent.addEventListener("click",function(event){
  const action = event.target.dataset.action;
  if(!action) return;
  const id = event.target.dataset.id;
  if(action === "accept"){
    progress[id] = {status:"active"};
  }
  if(action === "complete"){
    progress[id] = {status:"done",date: new Date().toDateString()};
  }
  saveProgress();
  const quest = allQuests.find(function(quest){
    return quest.id === id;
  });
  sheetContent.innerHTML = makeSheet(quest);
  showTodaysQuests();
});











showTodaysQuests();
showView("home");