const sections = document.querySelectorAll("section");
const navButtons = document.querySelectorAll("nav button");
const todaysQuests = document.querySelector("#todays-quests");
const today=new Date();
const dayNumber = today.getFullYear() * 400 + today.getMonth() *31 + today.getDate();
const start=(dayNumber * 3) % allQuests.length;
const questSheet = document.querySelector("#quest-sheet");
const sheetContent = document.querySelector("#sheet-content");
const closeSheet = document.querySelector("#close-sheet");
const logList = document.querySelector("#log-list");
const emptyMessage = document.querySelector("#empty-message");
const surpriseBtn = document.querySelector("#surprise-btn");
const packList = document.querySelector("#pack-list");
const packQuests = document.querySelector("#pack-quests");
let openPackId = "";
const packHeader = document.querySelector("#pack-header");
const progress = JSON.parse(localStorage.getItem("wayfound-progress")) || {};


// functions 
function saveProgress(){
  try{
    localStorage.setItem("wayfound-progress", JSON.stringify(progress));
  } catch (error){
    alert("The photo is too big to save.")
  }
}

function getStatus(id){
  if(!progress[id]){
    return "new";
  }
  return progress[id].status;
}

function findQuest(id){
  return allQuests.find(function(quest){
    return quest.id === id;
  })
}

function findPack(id){
  return packs.find(function(pack){
    return pack.id === id;
  })
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

navButtons.forEach(function(button){
  if(button.dataset.view === name){
    button.classList.add("current");
  } else {
    button.classList.remove("current");
  }
});

function makeCard(quest) {
  const filled = "●".repeat(quest.difficulty);
  const empty = "○".repeat(5 - quest.difficulty);
  const status = getStatus(quest.id);
  let tag = "";
  if (status === "active") {
    tag = `<span class="tag active">IN PROGRESS</span>`;
  }
  if (status === "done") {
    tag = `<span class="tag done">DONE</span>`;
  }
  return `
    <div class="card" data-id="${quest.id}" data-pack="${quest.pack}">
      ${tag}
      <span class="badge">${quest.emoji}</span>
      <h3>${quest.title}</h3>
      <p>${quest.description}</p>
      <div class="card-footer">
        <span class="duration">${quest.duration}</span>
        <span class="difficulty">${filled}${empty}</span>
      </div>
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
  const pack = findPack(quest.pack);
  let objectives = "";
  quest.objectives.forEach(function(objective){
    objectives += `<li>${objective}</li>`;
  });
  let tip = "";
  if(quest.tip){
    tip = `
      <p><span class="label">Tip</span> ${quest.tip}</p>
    `;
  }
  const status = getStatus(quest.id);
  let buttons = "";
  if(status === "new"){
    buttons = `<button data-action="accept" data-id="${quest.id}">Accept quest</button>`;
  }
  if(status === "active"){
    buttons = `
      <label>How did it go?</label>
      <textarea placeholder="How did it really go? Optional."></textarea>
      <label>Photo is optional</label>
      <input type="file" accept="image/*">
      <button data-action="complete" data-id="${quest.id}">Mark as done</button>
    `;
  }
  if(status === "done"){
    const doneDate = new Date(progress[quest.id].doneAt).toDateString();
    buttons = `<p class="done-stamp">DONE · ${doneDate}</p>`;
  }
  return `
    <div data-pack="${quest.pack}">
      <div class="sheet-head">
        <div class="badge">${quest.emoji}</div>
        <p class="label">${pack.name}</p>
        <h2>${quest.title}</h2>
        <p>${quest.description}</p>
      </div>
      <div class="sheet-todo">
        <p class="label">What to do</p>
        <ul>${objectives}</ul>
      </div>
      <div class="sheet-reward">
        <p class="label">You'll walk away with</p>
        <p class="reward-text">${quest.reward}</p>
        ${tip}
      </div>
      <div class="sheet-action">
        ${buttons}
      </div>
    </div>
  `;
}

function makeLogEntry(id){
  const record = progress[id];
  const quest = findQuest(id);
  const pack = findPack(quest.pack);
  let note="";
  if(record.note !== ""){
    note=`<p>${record.note}</p>`;
  }
  let photo="";
  if(record.photo !== ""){
    photo=`<img src="${record.photo}" alt="Quest photo">`;
  }
  return `
    <div class="log-entry" data-pack="${quest.pack}">
      <div class="log-entry-top">
        <span class="badge">${quest.emoji}</span>
        <span class="pack-name">${pack.name}</span>
      </div>
      <h3>${quest.title}</h3>
      <p class="log-date">${new Date(record.doneAt).toDateString()}</p>
      <p>${quest.description}</p>
      ${note}
      ${photo}
    </div>
  `;
}

function showLogbook(){
  logList.innerHTML="";
  const doneIds = Object.keys(progress).filter(function(id){
    return progress[id].status === "done";
  });
  doneIds.sort(function(a,b){
    return progress[b].doneAt - progress[a].doneAt;
  });
  doneIds.forEach(function(id){
    logList.innerHTML += makeLogEntry(id);
  });
  if(doneIds.length ===0){
    emptyMessage.classList.remove("hidden");
  } else {
    emptyMessage.classList.add("hidden");
  }
}

function redraw(id){
  showLogbook();
  const quest = findQuest(id);
  sheetContent.innerHTML = makeSheet(quest);
  showTodaysQuests();
  showPacks();
  showPackQuests();
}

function finishQuest(id,note,photo){
  progress[id]={status:"done",doneAt:Date.now(),note:note,photo:photo};
  saveProgress();
  redraw(id);
}

function shrinkPhoto(file, whenDone){
  const reader= new FileReader();
  reader.onload = function(){
    const img = new Image();
    img.src = reader.result;
    img.onload = function(){
      const scale = Math.min(1, 600 / img.width);
      const width = img.width * scale;
      const height = img.height * scale;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      whenDone(canvas.toDataURL("image/jpeg", 0.7));
    };
  };
  reader.readAsDataURL(file);
}

function openSheet(quest){
  sheetContent.innerHTML = makeSheet(quest);
  questSheet.showModal();
}

function pickRandomQuest(){
  const fresh = allQuests.filter(function(quest){
    return getStatus(quest.id) === "new";
  });
  let list = fresh;
  if(fresh.length === 0){
    list = allQuests;
  }
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

function questsInPack(packId){
  return allQuests.filter(function(quest){
    return quest.pack === packId;
  });
}

function showPacks(){
  packList.innerHTML = "";
  packs.forEach(function(pack){
    packList.innerHTML += makePack(pack);
  });
}

function makePack(pack){
  const quests = questsInPack(pack.id);
  const done = quests.filter(function(quest){
    return getStatus(quest.id) === "done";
  }).length;
  let selected = "";
  if(pack.id === openPackId){
    selected = " selected";
  }
  return `
    <div class="pack${selected}" data-id="${pack.id}" data-pack="${pack.id}">
      <span class="badge">${pack.coverEmoji}</span>
      <h3>${pack.name}</h3>
      <span>${done} of ${quests.length} done</span>
    </div>
  `;
}

function showPackQuests(){
  packQuests.innerHTML ="";
  if(openPackId === ""){
    packHeader.innerHTML ="";
    packQuests.innerHTML = "<p>Pick a pack to see its quests</p>";
    return;
  }
  const pack = findPack(openPackId);
  packHeader.innerHTML = `
    <h3>${pack.name}</h3>
    <p>${pack.description}</p>
  `;
  questsInPack(openPackId).forEach(function(quest){
    packQuests.innerHTML += makeCard(quest);
  });
}

// Listeners 

surpriseBtn.addEventListener("click",function(){
  openSheet(pickRandomQuest());
});

packList.addEventListener("click",function(event){
  const pack =event.target.closest(".pack");
  if(!pack) return;
  openPackId = pack.dataset.id;
  showPacks();
  showPackQuests();
});

function openFromCard(event){
  const card = event.target.closest(".card");
  if(!card) return;
  const id = card.dataset.id;
  const quest = findQuest(id);
  openSheet(quest);
}
todaysQuests.addEventListener("click",openFromCard);
packQuests.addEventListener("click",openFromCard);
closeSheet.addEventListener("click",function(){
  questSheet.close();
});

sheetContent.addEventListener("click",function(event){
  const action = event.target.dataset.action;
  if(!action) return;
  const id = event.target.dataset.id;
  if(action === "accept"){
    progress[id] = {status:"active"};
    saveProgress();
    redraw(id);
  }
  if(action === "complete"){
    const note = sheetContent.querySelector("textarea").value;
    const input = sheetContent.querySelector("input");
    const file = input.files[0];
    if(!file){
      finishQuest(id, note, "");
      return;
    }
    shrinkPhoto(file, function(photo){
      finishQuest(id, note, photo);
    });
  }
});


showTodaysQuests();
showLogbook();
showPacks();
showPackQuests();
showView("home");

