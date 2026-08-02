import { memories, quietPlaces, regionAt, VIEW, WORLD_WIDTH } from "./config.js";
import { AudioSystem, clamp, Input, Particles, SaveSystem } from "./systems.js";
import { Renderer } from "./renderer.js";

const canvas = document.querySelector("#game");
const renderer = new Renderer(canvas);
const input = new Input();
const saver = new SaveSystem();
const audio = new AudioSystem();
const particles = new Particles();
const $ = (selector) => document.querySelector(selector);
const saved = saver.load();
const state = {
  running: false, paused: false, time: saved.time ?? .71, cameraX: 0, region: regionAt(0), previousRegion: "", found: new Set(saved.memories || []), photos: saved.photos || 0,
  player: { x: saved.position?.x ?? 150, y: saved.position?.y ?? 540, moving: false, sitting: false }, hero: saved.hero || "", author: saved.author || "", finale: { active: false, progress: 0 }, last: 0, saveTimer: 0,
};

function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function updateSigil() { $("#memory-sigil").innerHTML = memories.map((memory) => `<span class="${state.found.has(memory.id) ? "found" : ""}" aria-label="${memory.title}"></span>`).join(""); }
function save() { saver.save({ hero: state.hero, author: state.author, memories: [...state.found], photos: state.photos, time: state.time, position: { x: state.player.x, y: state.player.y } }); }
function showToast(text) { const toast=$("#toast");toast.textContent=text;toast.classList.add("visible");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("visible"),2600); }
function showPlace(region) { const place=$("#place-name");place.innerHTML=`${region.title}<small>${region.subtitle}</small>`;place.classList.add("visible");clearTimeout(showPlace.timer);showPlace.timer=setTimeout(()=>place.classList.remove("visible"),3400); }
function showMoment(title, text, callback) { state.paused=true; const moment=$("#moment");$("#moment-title").textContent=title;$("#moment-text").textContent=text;moment.classList.remove("hidden");$("#moment-close").onclick=()=>{moment.classList.add("hidden");state.paused=false;if(callback)callback();}; }
function collect(memory) { state.found.add(memory.id); state.paused=true; updateSigil(); audio.memory(); save(); showMoment(memory.title, memory.text); if(state.found.size===memories.length) showToast("As estrelas se lembram do caminho para o observatório."); }
function photo() { if (!state.running || state.paused || state.finale.active) return; state.photos += 1; save(); showToast(state.photos === 1 ? "Paisagem guardada." : `Paisagem guardada · ${state.photos} no álbum`); }
function interact() {
  if (!state.running || state.finale.active) return; if (state.paused) { $("#moment-close").click(); return; }
  const target=nearby(); if (!target) return;
  if(target.type === "memory") collect(target.item); else if(target.type === "quiet") { state.player.sitting=target.item.label.includes("sentar");showMoment(target.item.title,target.item.text,()=>state.player.sitting=false); if(target.item.label.includes("piano"))audio.memory(); }
  else if(target.type === "final") beginFinale();
}
function nearby() {
  const memory=memories.find((item)=>!state.found.has(item.id)&&distance(state.player,item)<70); if(memory)return{type:"memory",item:memory};
  const quiet=quietPlaces.find((item)=>distance(state.player,item)<65); if(quiet)return{type:"quiet",item:quiet};
  if(state.found.size===memories.length&&distance(state.player,{x:5185,y:520})<120)return{type:"final"}; return null;
}
function beginFinale() { state.paused=true; state.finale.active=true; $("#interaction").textContent=""; showToast("As memórias se unem acima do observatório."); }
function finishFinale() { $("#finale-signature").textContent=`para ${state.hero}, com carinho — ${state.author}`;$("#finale").classList.remove("hidden"); }
function update(delta) {
  if(!state.running)return; state.time=(state.time+delta/540000)%1; state.region=regionAt(state.player.x); audio.setRegion(state.region); if(state.region.id!==state.previousRegion){state.previousRegion=state.region.id;showPlace(state.region);}
  if(state.finale.active){state.finale.progress+=delta/11000;if(state.finale.progress>=1.08){state.finale.progress=1.08;state.finale.active=false;finishFinale();}return;}
  if(!state.paused){ let dx=0,dy=0; if(input.down("ArrowLeft","KeyA"))dx--;if(input.down("ArrowRight","KeyD"))dx++;if(input.down("ArrowUp","KeyW"))dy--;if(input.down("ArrowDown","KeyS"))dy++;state.player.moving=!!(dx||dy);if(dx||dy){const len=Math.hypot(dx,dy);state.player.x=clamp(state.player.x+dx/len*182*delta/1000,30,WORLD_WIDTH-30);state.player.y=clamp(state.player.y+dy/len*182*delta/1000,420,610);} }
  state.cameraX+=(clamp(state.player.x-VIEW.width*.45,0,WORLD_WIDTH-VIEW.width)-state.cameraX)*Math.min(1,delta/620); particles.update(delta,state.cameraX,state.region.weather); const target=nearby();$("#interaction").innerHTML=target?`<b>E</b> ${target.type==="final"?"deixar as memórias subirem ao céu":target.item.label||"guardar esta lembrança"}`:"";
  if(input.take("KeyE")||input.take("Enter"))interact();if(input.take("KeyF"))photo();if(input.take("KeyQ")){state.player.sitting=!state.player.sitting;showToast(state.player.sitting?"Ela se senta e observa o céu.":"Ela continua a caminhar.");}
  state.saveTimer+=delta;if(state.saveTimer>7500){save();state.saveTimer=0;}
}
function frame(time) { const delta=Math.min(40,time-state.last||0);state.last=time;update(delta);renderer.frame({cameraX:state.cameraX,region:state.region,time,dayTime:state.time,particles,player:state.player,memories,found:state.found,finale:state.finale});requestAnimationFrame(frame); }
function start(event) { event.preventDefault();state.hero=$("#hero-input").value.trim()||"você";state.author=$("#author-input").value.trim()||"alguém que te ama";state.running=true;$("#intro").classList.add("hidden");audio.start();showPlace(state.region);showMoment("uma chegada suave",`Boa noite, ${state.hero}. Não há pressa. O mundo está aqui para ser visto com calma.`);save(); }

$("#start-form").addEventListener("submit",start);$("#photo-button").addEventListener("click",photo);$("#sound-button").addEventListener("click",()=>{const on=audio.toggle();$("#sound-button").textContent=on?"♪":"×";$("#sound-button").setAttribute("aria-label",on?"Desativar som":"Ativar som");});$("#return-button").addEventListener("click",()=>location.reload());
$("#hero-input").value=state.hero;$("#author-input").value=state.author;updateSigil();requestAnimationFrame(frame);
