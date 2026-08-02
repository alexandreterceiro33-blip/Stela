export class Input {
  constructor() { this.keys = new Set(); this.pressed = new Set(); this.bind(); }
  bind() {
    addEventListener("keydown", (event) => {
      if (event.target.matches("input")) return;
      if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","KeyA","KeyD","KeyW","KeyS","KeyE","KeyF","KeyQ","Enter"].includes(event.code)) event.preventDefault();
      if (!this.keys.has(event.code)) this.pressed.add(event.code); this.keys.add(event.code);
    });
    addEventListener("keyup", (event) => this.keys.delete(event.code));
  }
  down(...keys) { return keys.some((key) => this.keys.has(key)); }
  take(key) { const active = this.pressed.has(key); this.pressed.delete(key); return active; }
  clear() { this.keys.clear(); this.pressed.clear(); }
}

export class SaveSystem {
  constructor() { this.key = "stella-save-v1"; }
  load() { try { return JSON.parse(localStorage.getItem(this.key)) || { memories: [], photos: 0 }; } catch { return { memories: [], photos: 0 }; } }
  save(data) { localStorage.setItem(this.key, JSON.stringify(data)); }
}

export class AudioSystem {
  constructor() { this.context = null; this.master = null; this.enabled = false; this.timer = null; this.chord = [60,64,67]; this.biome = ""; }
  start() {
    if (this.enabled) return;
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.master = this.context.createGain(); this.master.gain.value = .055; this.master.connect(this.context.destination); this.enabled = true; this.schedule();
  }
  toggle() { if (!this.enabled) { this.start(); return true; } this.master.gain.value = this.master.gain.value ? 0 : .055; return this.master.gain.value > 0; }
  setRegion(region) { if (region.id === this.biome) return; this.biome = region.id; this.chord = region.music; }
  note(midi, seconds = 1.9, at = this.context?.currentTime || 0) {
    if (!this.enabled || !this.master.gain.value) return;
    const frequency = 440 * Math.pow(2, (midi - 69) / 12); const gain = this.context.createGain(); const oscillator = this.context.createOscillator();
    oscillator.type = "sine"; oscillator.frequency.setValueAtTime(frequency, at); gain.gain.setValueAtTime(.001, at); gain.gain.exponentialRampToValueAtTime(.13, at + .035); gain.gain.exponentialRampToValueAtTime(.001, at + seconds);
    oscillator.connect(gain).connect(this.master); oscillator.start(at); oscillator.stop(at + seconds + .08);
  }
  schedule() { this.timer = setInterval(() => { if (!this.enabled || !this.master.gain.value) return; const root = this.chord[Math.floor(Math.random() * this.chord.length)]; this.note(root + (Math.random() > .72 ? 12 : 0), 2.6); if (Math.random() > .48) this.note(this.chord[1], 1.7, this.context.currentTime + .28); }, 3100); }
  memory() { if (!this.enabled) return; this.note(79, 1.8); this.note(83, 2.5, this.context.currentTime + .18); }
}

export class Particles {
  constructor() { this.items = Array.from({ length: 120 }, (_, index) => this.make(index)); }
  make(index) { return { x: Math.random() * 1400, y: Math.random() * 720, speed: 7 + Math.random() * 16, size: 1 + Math.random() * 3, phase: Math.random() * 6.28, kind: index % 5 }; }
  update(delta, cameraX, weather) { for (const item of this.items) { item.x -= item.speed * delta / 1000; item.y += Math.sin(item.phase += delta / 1500) * .2; if (item.x < cameraX - 90) { item.x = cameraX + 1370; item.y = 70 + Math.random() * 590; item.kind = Math.floor(Math.random() * 5); } item.weather = weather; } }
  draw(ctx, cameraX, time) {
    for (const item of this.items) {
      const x = item.x - cameraX, y = item.y; if (x < -20 || x > 1300) continue;
      let color = "rgba(255,238,194,.25)"; if (item.weather === "fireflies") color = "rgba(255,236,130,.75)"; if (item.weather === "leaves" || item.weather === "petals") color = item.kind % 2 ? "rgba(239,163,174,.58)" : "rgba(252,216,169,.58)"; if (item.weather === "mist") color = "rgba(225,236,244,.16)";
      ctx.fillStyle = color; ctx.globalAlpha = .34 + Math.sin(time / 700 + item.phase) * .17; ctx.fillRect(Math.round(x), Math.round(y), item.size, item.size); ctx.globalAlpha = 1;
    }
  }
}

export const clamp = (number, min, max) => Math.max(min, Math.min(max, number));
export const lerp = (a, b, t) => a + (b - a) * t;
export function hexMix(a, b, t) { const pa = a.match(/\w\w/g).map((value) => parseInt(value,16)); const pb = b.match(/\w\w/g).map((value) => parseInt(value,16)); return `rgb(${pa.map((value,index) => Math.round(lerp(value,pb[index],t))).join(",")})`; }
