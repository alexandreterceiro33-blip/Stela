/**
 * game-v2.js — Stella game loop (Tiled JSON Pipeline).
 */
import { VIEW } from "./config.js";
import { AudioSystem, clamp, Input, Particles, SaveSystem } from "./systems.js";
import { RendererV2 } from "./renderer-v2.js";
import { AssetManager } from "./asset-manager.js";
import { Character } from "./character.js";
import { World } from "./world.js";
import { eventManager } from "./event-manager.js";
import { LayerType } from "./constants.js";

const canvas = document.querySelector("#game");
const renderer = new RendererV2(canvas);
const input = new Input();
const saver = new SaveSystem();
const audio = new AudioSystem();
const particles = new Particles();
const $ = (selector) => document.querySelector(selector);
const saved = saver.load();

// Initial state, without guessing positions yet
const state = {
  running: false, paused: false, time: saved.time ?? .71, cameraX: 0, 
  previousRegion: "",
  player: new Character(0, 0), // Will be overridden by Map spawn
  world: new World(4),
  hero: saved.hero || "", author: saved.author || "",
  saveTimer: 0,
};

// Register events
import "./events.js";

// Global Keyboard Debug Toggle
window.addEventListener("keydown", (e) => {
  if (e.code === "F3") {
    e.preventDefault();
    window.DEBUG_MAP = !window.DEBUG_MAP;
    console.log(`[Debug] Map Overlay: ${window.DEBUG_MAP ? 'ON' : 'OFF'}`);
  }
});

function save() { saver.save({ hero: state.hero, author: state.author, time: state.time, position: { x: state.player.x, y: state.player.y } }); }
function showToast(text) { const toast=$("#toast");toast.textContent=text;toast.classList.add("visible");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("visible"),2600); }
function showMoment(title, text, callback) { state.paused=true; const moment=$("#moment");$("#moment-title").textContent=title;$("#moment-text").textContent=text;moment.classList.remove("hidden");$("#moment-close").onclick=()=>{moment.classList.add("hidden");state.paused=false;if(callback)callback();}; }

function interact() {
  if (!state.running) return; 
  if (state.paused) { $("#moment-close").click(); return; }

  // AABB interaction check against entities and interactable objects
  const box = state.player.getInteractionBox(16);
  const tilemap = state.world.getActiveTileMap();
  if (!tilemap) return;

  // 1. Check NPC / Entities
  for (const ent of state.world.entities) {
    if (ent.constructor.name === "Character" && ent !== state.player) {
      if (state.player._checkAABB(box.x, box.y, box.width, box.height, ent.x - 8, ent.y - 16, 16, 16)) {
        if (ent.dialog) {
          eventManager.trigger(ent.dialog, { state, showMoment });
          return;
        }
      }
    }
  }

  // 2. Check Interactable Layer Objects from TileMap
  const interactions = tilemap.getObjects(LayerType.INTERACTION);
  for (const inter of interactions) {
    if (state.player._checkAABB(box.x, box.y, box.width, box.height, inter.x, inter.y, inter.width, inter.height)) {
      const eventId = inter.properties?.event;
      if (eventId) {
        eventManager.trigger(eventId, { state, showMoment });
        return;
      }
    }
  }
}

function update(delta) {
  if(!state.running)return; state.time=(state.time+delta/540000)%1; 
  
  if(!state.paused){
    let dx=0,dy=0;
    if(input.down("ArrowLeft","KeyA"))dx--;if(input.down("ArrowRight","KeyD"))dx++;
    if(input.down("ArrowUp","KeyW"))dy--;if(input.down("ArrowDown","KeyS"))dy++;
    
    const tilemap = state.world.getActiveTileMap();
    const collisions = tilemap ? tilemap.getCollisions() : [];
    
    // Limits based on map size
    const mapBounds = tilemap ? {
      minX: 0, maxX: tilemap.cols * 16,
      minY: 0, maxY: tilemap.rows * 16
    } : { minX:0, maxX:9999, minY:0, maxY:9999 };

    state.player.move(dx, dy, delta, collisions, mapBounds);
  }

  // Camera follow (Lerp)
  state.cameraX += ((state.player.x - VIEW.width * 0.45) - state.cameraX) * Math.min(1, delta/620);
  particles.update(delta, state.cameraX, "clear");

  // Interaction UI hints (optional simple nearby check)
  // For true AABB we could poll it here to show the "E" button
  const box = state.player.getInteractionBox(16);
  const tilemap = state.world.getActiveTileMap();
  let canInteract = false;
  if (tilemap) {
    for (const inter of tilemap.getObjects(LayerType.INTERACTION)) {
      if (state.player._checkAABB(box.x, box.y, box.width, box.height, inter.x, inter.y, inter.width, inter.height)) canInteract = true;
    }
  }
  $("#interaction").innerHTML = canInteract ? `<b>E</b> observar` : "";
  
  if(input.take("KeyE")||input.take("Enter")) interact();
  
  if(input.take("KeyQ")){
    state.player.toggleSit();
    showToast(state.player.currentState==="sit"?"Ela descansa.":"Ela continua a caminhar.");
  }
  state.saveTimer+=delta;if(state.saveTimer>7500){save();state.saveTimer=0;}
}

function frame(time) {
  const delta=Math.min(40,time-state.last||0);
  state.last=time;
  update(delta);
  renderer.frame({
    cameraX: state.cameraX,
    world: state.world,
    time,
    dayTime: state.time,
    particles,
    player: state.player
  });
  requestAnimationFrame(frame);
}

async function start(event) {
  event.preventDefault();
  state.hero=$("#hero-input").value.trim()||"você";
  state.author=$("#author-input").value.trim()||"alguém que te ama";
  $("#intro").classList.add("hidden");
  
  // Pipeline Oficial: AssetManager (Preload) -> MapManager (Tiled) -> World (Populate) -> Renderer
  await AssetManager.loadAll();
  renderer.spritesReady = true;

  const success = await state.world.loadMap("village");
  if (success) {
    // Busca spawn do player
    const spawn = state.world.getActiveTileMap().getObjects(LayerType.SPAWN).find(s => s.type === "player");
    if (spawn) {
      state.player.x = spawn.x;
      state.player.y = spawn.y;
    }

    // Configura Iluminação via Tiled Properties
    renderer.lighting.clearAll();
    renderer.lighting.addLight("player", 0, 0, 140, "#FFE09A", 0.9, 0.08); // Player local light
    const lights = state.world.getActiveTileMap().getObjects(LayerType.LIGHT);
    for (const l of lights) {
      renderer.lighting.addLight(`map_${l.id}`, l.x, l.y, l.properties?.radius || 100, l.properties?.color || "#FFFFFF", 1.0, l.properties?.flicker ? 0.2 : 0);
    }
  }

  state.running=true;
  audio.start();
  showMoment("uma chegada suave",`Boa noite, ${state.hero}. Não há pressa. O mundo está aqui para ser visto com calma.`);
  save();
}

$("#start-form").addEventListener("submit", start);
$("#sound-button").addEventListener("click", () => {
  const on = audio.toggle();
  $("#sound-button").textContent = on ? "♪" : "×";
  $("#sound-button").setAttribute("aria-label", on ? "Desativar som" : "Ativar som");
});
$("#hero-input").value = state.hero;
$("#author-input").value = state.author;
requestAnimationFrame(frame);
