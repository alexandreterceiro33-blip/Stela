// Stella — Consolidated build (auto-generated from src/ modules)
(function() {

// ═══ MODULE: config.js ═══
const VIEW = { width: 1280, height: 720 };
const WORLD_WIDTH = 7200;

const regions = [
  { id: "meadow", from: 0, to: 780, title: "Campo de flores", subtitle: "o vento sabe os nomes", kind: "meadow", music: [62, 66, 69], weather: "petals" },
  { id: "lake", from: 780, to: 1560, title: "Lago iluminado", subtitle: "onde a água aprende a guardar luz", kind: "lake", music: [57, 61, 64], weather: "mist" },
  { id: "forest", from: 1560, to: 2380, title: "Floresta dos vaga-lumes", subtitle: "toda noite tem um pequeno segredo", kind: "forest", music: [55, 59, 62], weather: "fireflies" },
  { id: "train", from: 2380, to: 3200, title: "Montanhas em movimento", subtitle: "um trem leva os dias devagar", kind: "train", music: [50, 54, 57], weather: "wind" },
  { id: "library", from: 3200, to: 3980, title: "Biblioteca silenciosa", subtitle: "páginas que respiram junto", kind: "library", music: [59, 62, 66], weather: "dust" },
  { id: "garden", from: 3980, to: 4820, title: "Jardim das estrelas", subtitle: "a noite floresce devagar", kind: "garden", music: [57, 60, 64], weather: "stars" },
  { id: "observatory", from: 4820, to: 5550, title: "Observatório", subtitle: "perto o bastante para escutar o céu", kind: "observatory", music: [54, 57, 61], weather: "stars" },
  { id: "hill", from: 5550, to: 6350, title: "Colina do pôr do sol", subtitle: "o mundo aprende a ficar dourado", kind: "hill", music: [64, 67, 71], weather: "leaves" },
  { id: "beach", from: 6350, to: 7200, title: "Praia da manhã", subtitle: "o dia começa antes de tudo", kind: "beach", music: [60, 64, 67], weather: "birds" },
];

const memories = [
  { id: "first-flower", x: 470, y: 510, region: "meadow", icon: "✿", title: "uma flor guardada", text: "Ela se inclina com o vento. Algumas delicadezas não pedem para ser lembradas — elas apenas ficam." },
  { id: "paper-boat", x: 1250, y: 535, region: "lake", icon: "⌁", title: "um barquinho de papel", text: "Nas suas dobras: a promessa de descobrir paisagens novas, mesmo quando o lugar é só ao lado de alguém." },
  { id: "firefly-jar", x: 1990, y: 485, region: "forest", icon: "✦", title: "luz que não se apaga", text: "Um vaga-lume pousa na mão dela. Por um segundo, a floresta inteira parece respirar junto." },
  { id: "train-ticket", x: 2815, y: 535, region: "train", icon: "◇", title: "bilhete sem destino", text: "Há viagens que importam menos pelo lugar onde terminam do que por quem olha a janela com a gente." },
  { id: "pressed-page", x: 3560, y: 500, region: "library", icon: "▤", title: "uma página dobrada", text: "Entre duas páginas, uma flor seca ainda guarda uma cor que só existe na lembrança." },
  { id: "star-seed", x: 4380, y: 475, region: "garden", icon: "✧", title: "semente de estrela", text: "Ela brilha na palma da mão. O céu parece reconhecer quem teve coragem de continuar suave." },
  { id: "lens", x: 5155, y: 510, region: "observatory", icon: "◌", title: "lente voltada ao infinito", text: "No vidro do telescópio, a distância deixa de assustar. Tudo aquilo que importa encontra um jeito de ficar perto." },
  { id: "sunset-ribbon", x: 5940, y: 485, region: "hill", icon: "≈", title: "fita cor de pôr do sol", text: "O vento a leva só um pouco, como se o tempo soubesse que não precisa correr." },
  { id: "shell", x: 6800, y: 545, region: "beach", icon: "◒", title: "concha da manhã", text: "Ao encostar no ouvido, ela não escuta o mar. Escuta uma casa, uma risada, um futuro possível." },
];

const quietPlaces = [
  { x: 260, y: 545, label: "sentar entre as flores", title: "um banco sob o céu", text: "Ela se senta. Por um instante, não há nada a resolver." },
  { x: 1440, y: 540, label: "observar o reflexo", title: "água tranquila", text: "O lago devolve um céu que parece ainda maior." },
  { x: 2250, y: 535, label: "ouvir a floresta", title: "um intervalo de silêncio", text: "O silêncio não está vazio. Ele está cheio de coisas gentis." },
  { x: 3730, y: 520, label: "tocar uma nota no piano", title: "uma nota só", text: "A última nota fica no ar, leve o bastante para não precisar de resposta." },
  { x: 5450, y: 520, label: "olhar pelo telescópio", title: "muito longe, muito perto", text: "Uma estrela acende e, de algum modo, parece que estava esperando por ela." },
];

function regionAt(x) { return regions.find((region) => x >= region.from && x < region.to) || regions[regions.length - 1]; }


// ═══ MODULE: systems.js ═══
class Input {
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

class SaveSystem {
  constructor() { this.key = "stella-save-v1"; }
  load() { try { return JSON.parse(localStorage.getItem(this.key)) || { memories: [], photos: 0 }; } catch { return { memories: [], photos: 0 }; } }
  save(data) { localStorage.setItem(this.key, JSON.stringify(data)); }
}

class AudioSystem {
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

class Particles {
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

const clamp = (number, min, max) => Math.max(min, Math.min(max, number));
const lerp = (a, b, t) => a + (b - a) * t;
function hexMix(a, b, t) { const pa = a.match(/\w\w/g).map((value) => parseInt(value,16)); const pb = b.match(/\w\w/g).map((value) => parseInt(value,16)); return `rgb(${pa.map((value,index) => Math.round(lerp(value,pb[index],t))).join(",")})`; }


// ═══ MODULE: sprite-loader.js ═══
/**
 * SpriteLoader — Async sprite loading with caching, spritesheet atlas support,
 * and preload queue with progress callback.
 *
 * Design: Each sprite or spritesheet frame is stored in a Map keyed by string.
 *         Frames extracted from a sheet are cached as off-screen canvases.
 *         On failure, a magenta placeholder is created (never crashes).
 */
class SpriteLoader {
  constructor() {
    /** @type {Map<string, HTMLImageElement|HTMLCanvasElement>} */
    this.cache = new Map();
    /** @type {{key:string, path:string, fw?:number, fh?:number}[]} */
    this.queue = [];
    this.loaded = 0;
    this.total = 0;
  }

  /* ── Single image ──────────────────────────────────────────── */

  /**
   * Loads a single image and stores it under `key`.
   * @param {string} key
   * @param {string} path
   * @returns {Promise<HTMLImageElement|HTMLCanvasElement>}
   */
  load(key, path) {
    if (this.cache.has(key)) return Promise.resolve(this.cache.get(key));
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => { this.cache.set(key, img); resolve(img); };
      img.onerror = () => {
        console.warn(`[SpriteLoader] failed: ${path}`);
        const fb = this._placeholder(16, 16);
        this.cache.set(key, fb);
        resolve(fb);
      };
      img.src = path;
    });
  }

  /* ── Spritesheet ───────────────────────────────────────────── */

  /**
   * Loads a spritesheet and extracts every frame into cache as
   * `${key}_0`, `${key}_1`, etc.
   * @param {string} key   Base key
   * @param {string} path  Image path
   * @param {number} fw    Frame width
   * @param {number} fh    Frame height
   * @returns {Promise<number>} Total frames extracted
   */
  async loadSheet(key, path, fw, fh) {
    const img = await this.load(`${key}__sheet`, path);
    if (!img.width || !img.height) return 0;
    const cols = Math.floor(img.width / fw);
    const rows = Math.floor(img.height / fh);
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cvs = document.createElement("canvas");
        cvs.width = fw; cvs.height = fh;
        const ctx = cvs.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, c * fw, r * fh, fw, fh, 0, 0, fw, fh);
        this.cache.set(`${key}_${idx}`, cvs);
        idx++;
      }
    }
    return idx;
  }

  /* ── Preload queue ─────────────────────────────────────────── */

  /**
   * Enqueues a sprite or spritesheet for batch loading.
   * @param {string} key
   * @param {string} path
   * @param {number} [fw]  Frame width (omit for single image)
   * @param {number} [fh]  Frame height
   */
  enqueue(key, path, fw, fh) {
    this.queue.push({ key, path, fw, fh });
    this.total++;
  }

  /**
   * Processes the entire queue, calling `onProgress(loaded, total)` after each.
   * @param {function(number,number):void} [onProgress]
   * @returns {Promise<void>}
   */
  async preload(onProgress) {
    this.loaded = 0;
    for (const item of this.queue) {
      if (item.fw && item.fh) {
        await this.loadSheet(item.key, item.path, item.fw, item.fh);
      } else {
        await this.load(item.key, item.path);
      }
      this.loaded++;
      if (onProgress) onProgress(this.loaded, this.total);
    }
    this.queue = [];
  }

  /* ── Accessors ─────────────────────────────────────────────── */

  /** @returns {HTMLImageElement|HTMLCanvasElement|null} */
  get(key) { return this.cache.get(key) || null; }

  /** @returns {HTMLImageElement|HTMLCanvasElement|null} */
  getFrame(key, index) { return this.cache.get(`${key}_${index}`) || null; }

  /** @returns {boolean} */
  has(key) { return this.cache.has(key); }

  /* ── Internals ─────────────────────────────────────────────── */

  _placeholder(w, h) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#ff00ff";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w / 2, h / 2);
    ctx.fillRect(w / 2, h / 2, w / 2, h / 2);
    return c;
  }
}


// ═══ MODULE: camera.js ═══
/**
 * Camera — Pixel-perfect camera with configurable scale, smooth follow,
 * screen shake, and coordinate conversion.
 *
 * IMPORTANT DESIGN NOTE:
 * The Stella world currently uses raw pixel coordinates (WORLD_WIDTH = 7200,
 * VIEW = 1280×720). The camera operates in those same coordinates but
 * supports an optional render-scale that will be used when drawing
 * tile-based content at 4× magnification.
 *
 * In "legacy" mode (scale = 1), begin/end are no-ops and the existing
 * procedural renderer keeps working unchanged. In "scaled" mode (scale = 4),
 * begin() applies ctx.scale(4,4) + ctx.translate() so that tiles drawn at
 * 16×16 appear at 64×64 on screen.
 */



class Camera {
  constructor() {
    /** World-pixel offset (top-left corner visible) */
    this.x = 0;
    this.y = 0;
    /** Render scale for tile content (4 = each world-pixel → 4 screen-pixels) */
    this.renderScale = 4;
    /** Smooth follow speed (higher = snappier) */
    this.lerpSpeed = 0.0016;
    /** Current shake magnitude (world-pixels) */
    this.shake = 0;
    this._shakeX = 0;
    this._shakeY = 0;
  }

  /* ── Follow ────────────────────────────────────────────────── */

  /**
   * Smoothly moves the camera to keep `target` roughly centered.
   * @param {{x:number, y:number}} target
   * @param {number} dt  Delta time in ms
   */
  follow(target, dt) {
    const targetX = clamp(
      target.x - VIEW.width * 0.45,
      0,
      WORLD_WIDTH - VIEW.width
    );
    this.x = lerp(this.x, targetX, Math.min(1, dt * this.lerpSpeed));

    // Shake decay
    if (this.shake > 0) {
      this.shake = Math.max(0, this.shake - dt * 0.004);
      this._shakeX = Math.round((Math.random() - 0.5) * this.shake);
      this._shakeY = Math.round((Math.random() - 0.5) * this.shake);
    } else {
      this._shakeX = 0;
      this._shakeY = 0;
    }
  }

  /* ── Transform helpers for SCALED tile rendering ───────────── */

  /**
   * Applies scale + translate so that world content drawn in
   * 16-px tile coordinates appears correctly on the 1280×720 canvas.
   *
   * Call this ONLY around tile/sprite draw calls that use base
   * (pre-scale) coordinates. The procedural renderer that already
   * works in screen-pixels should NOT be wrapped in begin/end.
   */
  beginScaled(ctx) {
    ctx.save();
    ctx.scale(this.renderScale, this.renderScale);
    const sx = Math.round(this.x / this.renderScale) + this._shakeX;
    const sy = Math.round(this.y / this.renderScale) + this._shakeY;
    ctx.translate(-sx, -sy);
  }

  endScaled(ctx) {
    ctx.restore();
  }

  /* ── Coordinate conversion ─────────────────────────────────── */

  /** World-pixel → screen-pixel */
  worldToScreen(wx, wy) {
    return {
      x: Math.round(wx - this.x) + this._shakeX,
      y: Math.round(wy - this.y) + this._shakeY,
    };
  }

  /** Screen-pixel → world-pixel */
  screenToWorld(sx, sy) {
    return {
      x: sx + this.x - this._shakeX,
      y: sy + this.y - this._shakeY,
    };
  }

  /* ── Viewport bounds (world-pixel space) ───────────────────── */

  /**
   * Returns the world-pixel rectangle currently visible.
   * Useful for culling.
   */
  getBounds() {
    return {
      left: this.x,
      top: this.y,
      right: this.x + VIEW.width,
      bottom: this.y + VIEW.height,
    };
  }

  /**
   * Returns bounds in tile-coordinate space (base 16px).
   */
  getTileBounds(tileSize = 16) {
    const s = this.renderScale;
    return {
      left: Math.floor(this.x / s / tileSize),
      top: Math.floor(this.y / s / tileSize),
      right: Math.ceil((this.x + VIEW.width) / s / tileSize),
      bottom: Math.ceil((this.y + VIEW.height) / s / tileSize),
    };
  }

  /** Triggers a screen shake */
  addShake(amount) { this.shake = Math.min(this.shake + amount, 20); }
}


// ═══ MODULE: tilemap.js ═══
/**
 * TileMap — Multi-layered tile-based world renderer.
 *
 * The world is divided into a grid of 16×16-pixel cells.
 * Three layers allow depth ordering:
 *   ground     → terrain, paths, water (drawn behind everything)
 *   decoration → flowers, furniture, objects (same depth as entities)
 *   above      → tree canopies, roofs (drawn in front of the player)
 *
 * Each cell stores an integer tile-ID. Zero means empty.
 * When actual sprites are available, the renderer draws them;
 * otherwise it falls back to coloured rectangles from the Art Bible palette.
 *
 * Coordinate contract:
 *   - Tiles are addressed by (col, row) in base units.
 *   - Rendering uses the Camera's beginScaled/endScaled to draw at 4×.
 *   - The world in tile-space is (WORLD_WIDTH / renderScale / tileSize) cols
 *     wide and (VIEW.height / renderScale / tileSize) rows tall.
 */


const TILE = 16; // base pixel size of a tile

class TileMap {
  /**
   * @param {number} [renderScale=4]  Must match Camera.renderScale
   */
  constructor(renderScale = 4) {
    this.tileSize = TILE;
    this.scale = renderScale;

    // World dimensions in tile coordinates
    this.cols = Math.ceil(WORLD_WIDTH / this.scale / this.tileSize);  // ~113
    this.rows = Math.ceil(VIEW.height / this.scale / this.tileSize);  // ~12

    /** @type {Record<string, Int16Array>} */
    this.layers = {
      ground: new Int16Array(this.rows * this.cols),
      decoration: new Int16Array(this.rows * this.cols),
      above: new Int16Array(this.rows * this.cols),
    };

    /** Animated tile definitions: tileId → { frames: number[], fps: number } */
    this.animatedTiles = new Map();
    this._animTimer = 0;

    // Seed a procedural demo world so the tilemap is not blank
    this._generateDemo();
  }

  /* ── Tile CRUD ─────────────────────────────────────────────── */

  setTile(layer, col, row, id) {
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return;
    this.layers[layer][row * this.cols + col] = id;
  }

  getTile(layer, col, row) {
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return 0;
    return this.layers[layer][row * this.cols + col];
  }

  /* ── Animated tiles ────────────────────────────────────────── */

  /**
   * Registers an animated tile type.
   * @param {number} tileId    The ID stored in the layer data
   * @param {number[]} frames  Sprite frame indices to cycle through
   * @param {number} fps       Animation speed
   */
  defineAnimatedTile(tileId, frames, fps) {
    this.animatedTiles.set(tileId, { frames, fps, frameTime: 1000 / fps, idx: 0 });
  }

  update(dt) {
    this._animTimer += dt;
    for (const anim of this.animatedTiles.values()) {
      anim.idx = Math.floor(this._animTimer / anim.frameTime) % anim.frames.length;
    }
  }

  /* ── Rendering ─────────────────────────────────────────────── */

  /**
   * Renders one layer. Call between camera.beginScaled / endScaled.
   * @param {CanvasRenderingContext2D} ctx
   * @param {import("./camera.js").Camera} camera
   * @param {string} layerName
   * @param {import("./sprite-loader.js").SpriteLoader} [sprites]
   */
  render(ctx, camera, layerName, sprites) {
    const data = this.layers[layerName];
    if (!data) return;

    // Visible tile range (cull off-screen)
    const bounds = camera.getTileBounds(this.tileSize);
    const c0 = Math.max(0, bounds.left - 1);
    const c1 = Math.min(this.cols - 1, bounds.right + 1);
    const r0 = Math.max(0, bounds.top - 1);
    const r1 = Math.min(this.rows - 1, bounds.bottom + 1);

    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        let id = data[r * this.cols + c];
        if (id === 0) continue;

        const px = c * this.tileSize;
        const py = r * this.tileSize;

        // Animated tile? Swap to current frame's ID
        const anim = this.animatedTiles.get(id);
        if (anim) id = anim.frames[anim.idx];

        // Try sprite, fall back to color
        const sprite = sprites && sprites.getFrame("tiles", id);
        if (sprite) {
          ctx.drawImage(sprite, px, py, this.tileSize, this.tileSize);
        } else {
          ctx.fillStyle = this._fallbackColor(id);
          ctx.fillRect(px, py, this.tileSize, this.tileSize);
        }
      }
    }
  }

  /* ── Fallback palette (Art Bible colours) ──────────────────── */

  _fallbackColor(id) {
    switch (id) {
      case 1: return "#6B9E7D"; // Moss Green — grass
      case 2: return "#5A8A6A"; // Grass variant
      case 3: return "#8B6E5A"; // Earth Brown — dirt
      case 4: return "#2D5E4A"; // Deep Forest — tree canopy
      case 5: return "#5C4033"; // Trunk
      case 6: return "#4A8B8C"; // Ocean Teal — water
      case 7: return "#D8C393"; // Sand
      case 8: return "#7A7E85"; // Stone Grey
      case 9: return "#E8A0B4"; // Blush Rose — flowers
      case 10: return "#F2C970"; // Sunset Gold — highlight
      default: return "#FF00FF"; // Missing
    }
  }

  /* ── Demo world ────────────────────────────────────────────── */

  _generateDemo() {
    const seeded = (v) => ((Math.sin(v * 12.9898) * 43758.5453) % 1 + 1) % 1;
    const groundRow = 8; // ~ground level in tile space

    for (let c = 0; c < this.cols; c++) {
      const variation = Math.floor(Math.sin(c * 0.08) * 1.5);
      const gRow = groundRow + variation;

      // Ground and below = dirt, top = grass
      for (let r = gRow; r < this.rows; r++) {
        this.setTile("ground", c, r, r === gRow ? 1 : 3);
      }

      // Occasional trees
      const chance = seeded(c * 0.37);
      if (chance > 0.78 && gRow > 1) {
        this.setTile("decoration", c, gRow - 1, 5); // trunk
        this.setTile("above", c, gRow - 2, 4);       // canopy
      }

      // Occasional flowers
      if (chance > 0.4 && chance < 0.55) {
        this.setTile("decoration", c, gRow - 1, 9);
      }
    }
  }

  /* ── Serialization (for future map editor) ─────────────────── */

  toJSON() {
    const out = {};
    for (const [name, data] of Object.entries(this.layers)) {
      out[name] = Array.from(data);
    }
    return { cols: this.cols, rows: this.rows, tileSize: this.tileSize, layers: out };
  }

  fromJSON(json) {
    this.cols = json.cols;
    this.rows = json.rows;
    for (const [name, arr] of Object.entries(json.layers)) {
      this.layers[name] = new Int16Array(arr);
    }
  }
}


// ═══ MODULE: sprite-animator.js ═══
/**
 * SpriteAnimator — Frame-based animation state machine.
 *
 * Usage:
 *   const anim = new SpriteAnimator();
 *   anim.define("walk_right", [0,1,2,3,4,5], 8, true);
 *   anim.define("idle",       [0,1,2,3],     4, true);
 *   anim.play("idle");
 *
 *   // In update loop:
 *   anim.update(dt);
 *   const frameIdx = anim.getCurrentFrame(); // index into the frames array
 */
class SpriteAnimator {
  constructor() {
    /** @type {Map<string, AnimDef>} */
    this.animations = new Map();
    /** Name of the currently playing animation (null = nothing) */
    this.currentAnim = null;
    /** Elapsed time within the current frame (ms) */
    this.frameTimer = 0;
    /** Current index into the frames array */
    this.frameIndex = 0;
    /** Set to true on the tick a frame changes (useful for footstep SFX etc.) */
    this.frameChanged = false;
  }

  /* ── Define ────────────────────────────────────────────────── */

  /**
   * Registers an animation.
   * @param {string}   name
   * @param {number[]} frames  Frame indices (into a spritesheet, for example)
   * @param {number}   fps     Playback speed
   * @param {boolean}  loop
   */
  define(name, frames, fps = 8, loop = true) {
    this.animations.set(name, {
      frames,
      frameTime: 1000 / fps,
      loop,
      onComplete: null,
      onFrame: null,
    });
  }

  /* ── Play ──────────────────────────────────────────────────── */

  /**
   * Switches to `name` if not already playing.
   * @param {string}   name
   * @param {Function} [onComplete]  Called when a non-looping animation ends
   * @returns {this}
   */
  play(name, onComplete) {
    if (this.currentAnim === name) return this;
    if (!this.animations.has(name)) return this;
    this.currentAnim = name;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameChanged = true;
    const a = this.animations.get(name);
    a.onComplete = onComplete || null;
    return this;
  }

  /** Force-restart the current animation from frame 0 */
  restart() {
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameChanged = true;
    return this;
  }

  /* ── Update ────────────────────────────────────────────────── */

  /**
   * Advance animation by `dt` milliseconds.
   * @param {number} dt
   */
  update(dt) {
    this.frameChanged = false;
    if (!this.currentAnim) return;

    const a = this.animations.get(this.currentAnim);
    this.frameTimer += dt;

    while (this.frameTimer >= a.frameTime) {
      this.frameTimer -= a.frameTime;
      this.frameIndex++;
      this.frameChanged = true;

      if (this.frameIndex >= a.frames.length) {
        if (a.loop) {
          this.frameIndex = 0;
        } else {
          this.frameIndex = a.frames.length - 1;
          this.frameChanged = false;
          if (a.onComplete) { a.onComplete(); a.onComplete = null; }
          return;
        }
      }

      if (a.onFrame) a.onFrame(this.frameIndex);
    }
  }

  /* ── Queries ───────────────────────────────────────────────── */

  /** Returns the frame value (e.g. spritesheet frame index) for the current tick. */
  getCurrentFrame() {
    if (!this.currentAnim) return 0;
    const a = this.animations.get(this.currentAnim);
    return a.frames[this.frameIndex];
  }

  /** The string name of the active animation */
  get current() { return this.currentAnim; }

  /** Whether the animator currently has a playing animation */
  get playing() { return this.currentAnim !== null; }

  /**
   * Registers a per-frame callback for a specific animation.
   * @param {string} name
   * @param {function(number):void} cb  Receives the new frameIndex
   */
  onFrame(name, cb) {
    const a = this.animations.get(name);
    if (a) a.onFrame = cb;
    return this;
  }
}


// ═══ MODULE: lighting.js ═══
/**
 * Lighting2D — Ambient + Point-light system for the Stella project.
 *
 * How it works:
 * 1. An off-screen canvas (same size as the game canvas) is filled with the
 *    current "ambient darkness" colour — a warm Night Indigo (#10142B) whose
 *    opacity depends on the day/night cycle. During daytime the overlay is
 *    nearly transparent; at night it becomes dense.
 *
 * 2. Point lights ERASE darkness by drawing radial gradients with
 *    `destination-out` composite, effectively punching bright holes.
 *
 * 3. The light canvas is composited onto the main canvas with `multiply`,
 *    tinting the scene. (The "erased" areas remain bright.)
 *
 * 4. A subtle vignette is added on top for cinematic framing.
 *
 * This approach guarantees the Art Bible rule: "Nunca escurecer demais."
 */



class Lighting2D {
  constructor() {
    /** @type {Map<string, PointLight>} */
    this.lights = new Map();

    // Ambient state
    this.ambientIntensity = 1.0;   // 1 = full daylight, 0.15 = darkest night

    // Off-screen buffer (created lazily)
    /** @type {HTMLCanvasElement} */
    this._canvas = null;
    /** @type {CanvasRenderingContext2D} */
    this._ctx = null;
  }

  /* ── Lights ────────────────────────────────────────────────── */

  /**
   * Adds (or updates) a point light.
   * @param {string} id        Unique key
   * @param {number} x         World-pixel X
   * @param {number} y         World-pixel Y
   * @param {number} radius    In world-pixels
   * @param {string} [color]   CSS colour (used for warm tint, not critical)
   * @param {number} [intensity]  0–1
   * @param {number} [flicker]    Random intensity variation (0–0.3 typical)
   */
  addLight(id, x, y, radius, color = "#F2C970", intensity = 1.0, flicker = 0) {
    this.lights.set(id, { x, y, radius, color, intensity, flicker, base: intensity });
  }

  removeLight(id) { this.lights.delete(id); }

  /** Move a light (common for player-attached light) */
  moveLight(id, x, y) {
    const l = this.lights.get(id);
    if (l) { l.x = x; l.y = y; }
  }

  /* ── Update ────────────────────────────────────────────────── */

  /**
   * Recalculates ambient intensity from the day/night cycle and
   * updates flickering lights.
   * @param {number} dayTime   0–1 fraction through the day
   * @param {number} dt        Delta time ms (for future smooth transitions)
   */
  update(dayTime, dt) {
    // dayTime 0.0 = midnight, 0.5 = noon
    const sun = Math.sin(dayTime * Math.PI);
    this.ambientIntensity = clamp(0.15 + sun * 0.85, 0.15, 1.0);

    for (const l of this.lights.values()) {
      if (l.flicker > 0) {
        l.intensity = clamp(l.base + (Math.random() - 0.5) * l.flicker, 0.1, 1.5);
      }
    }
  }

  /* ── Render ────────────────────────────────────────────────── */

  /**
   * Composites the lighting overlay onto `ctx`.
   * Must be called AFTER all world + entity rendering, BEFORE UI.
   *
   * @param {CanvasRenderingContext2D} ctx     Main canvas context
   * @param {import("./camera.js").Camera} camera
   */
  render(ctx, camera) {
    // Lazy-init the off-screen buffer
    if (!this._canvas) {
      this._canvas = document.createElement("canvas");
      this._canvas.width = VIEW.width;
      this._canvas.height = VIEW.height;
      this._ctx = this._canvas.getContext("2d");
    }
    const lc = this._ctx;
    const cw = VIEW.width;
    const ch = VIEW.height;

    // ─── 1. Fill with darkness ────────────────────────────────
    lc.globalCompositeOperation = "source-over";
    lc.globalAlpha = 1;
    const darkness = 1 - this.ambientIntensity; // 0 at noon, 0.85 at midnight
    lc.fillStyle = `rgba(16, 20, 43, ${darkness})`; // Night Indigo from Art Bible
    lc.fillRect(0, 0, cw, ch);

    // ─── 2. Punch light holes ─────────────────────────────────
    lc.globalCompositeOperation = "destination-out";
    for (const l of this.lights.values()) {
      const sx = Math.round(l.x - camera.x) + camera._shakeX;
      const sy = Math.round(l.y - camera.y) + camera._shakeY;
      const sr = l.radius;

      // Cull
      if (sx < -sr || sx > cw + sr || sy < -sr || sy > ch + sr) continue;

      const grad = lc.createRadialGradient(sx, sy, 0, sx, sy, sr);
      grad.addColorStop(0, `rgba(255,255,255,${l.intensity})`);
      grad.addColorStop(0.6, `rgba(255,255,255,${l.intensity * 0.4})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");
      lc.fillStyle = grad;
      lc.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
    }

    // ─── 3. Vignette (additive darkness at edges) ─────────────
    lc.globalCompositeOperation = "source-over";
    const vig = lc.createRadialGradient(cw / 2, ch / 2, ch * 0.35, cw / 2, ch / 2, cw * 0.75);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(5,6,17,0.42)");
    lc.fillStyle = vig;
    lc.fillRect(0, 0, cw, ch);

    // ─── 4. Composite onto main canvas ────────────────────────
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.drawImage(this._canvas, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();
  }
}


// ═══ MODULE: renderer.js ═══



const seeded = (value) => ((Math.sin(value * 12.9898) * 43758.5453) % 1 + 1) % 1;
const fill = (ctx, x, y, width, height, color) => { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), width, height); };

class Renderer {
  constructor(canvas) { this.canvas = canvas; this.ctx = canvas.getContext("2d"); this.ctx.imageSmoothingEnabled = false; }
  sky(time, region) {
    const night = 1 - Math.sin(time * Math.PI); const dawn = clamp(Math.sin((time + .02) * Math.PI), 0, 1);
    let top = hexMix("10152e", "6c7995", dawn), bottom = hexMix("242846", "f1bc9b", dawn); if (time > .56 && time < .82) { const t = (time - .56) / .26; top = hexMix("637a9e", "543e70", t); bottom = hexMix("f0c19e", "e68491", t); } if (time > .82 || time < .08) { top = "#10142b"; bottom = "#2a2851"; }
    const gradient = this.ctx.createLinearGradient(0, 0, 0, VIEW.height); gradient.addColorStop(0, top); gradient.addColorStop(.72, bottom); gradient.addColorStop(1, bottom); this.ctx.fillStyle = gradient; this.ctx.fillRect(0,0,VIEW.width,VIEW.height);
    if (region.kind === "beach") { fill(this.ctx,0,515,VIEW.width,205,"#406680"); } else fill(this.ctx,0,530,VIEW.width,190, region.kind === "forest" ? "#203d43" : "#426a62");
    return night;
  }
  hills(cameraX, region, time) {
    const ctx = this.ctx; const colors = region.kind === "train" ? ["#53627e","#384863","#293b55"] : ["#65758a","#526b73","#385a5c"];
    colors.forEach((color, layer) => { ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0,530); for (let x = -80; x < 1380; x += 70) { const world = (x + cameraX * (.15 + layer * .12)) / 120; const y = 325 + layer * 65 + Math.sin(world) * (28 + layer * 8) + Math.cos(world * .45) * 22; ctx.lineTo(x,y); } ctx.lineTo(1280,720); ctx.lineTo(0,720); ctx.fill(); });
    if (region.kind === "train") { for(let i=0;i<10;i++) { const x = ((i*173-cameraX*.14)%1450)-80; const height=60+seeded(i)*180; fill(ctx,x,350-height,4,height,"#2a344e"); ctx.beginPath(); ctx.moveTo(x-35,350-height);ctx.lineTo(x+3,290-height);ctx.lineTo(x+40,350-height);ctx.fillStyle="#2a344e";ctx.fill(); } }
    if (time > .8 || time < .12) { ctx.fillStyle="rgba(255,243,196,.75)"; for(let i=0;i<54;i++){ const x=(i*139-cameraX*.05)%1320;const y=20+(i*61)%330;fill(ctx,x,y,i%7?1:2,i%7?1:2,"rgba(255,244,202,.72)"); } }
  }
  tree(x, y, scale, color, light) { const c=this.ctx; fill(c,x-5*scale,y,10*scale,34*scale,"#493c44"); c.fillStyle=color;c.beginPath();c.arc(x,y-12*scale,25*scale,0,Math.PI*2);c.fill();c.beginPath();c.arc(x-17*scale,y+2*scale,17*scale,0,Math.PI*2);c.fill();c.beginPath();c.arc(x+18*scale,y+3*scale,18*scale,0,Math.PI*2);c.fill(); fill(c,x-10*scale,y-20*scale,9*scale,5*scale,light); }
  flora(cameraX, region, time) {
    const ctx=this.ctx; const start=Math.floor((cameraX-120)/80)*80; for(let world=start;world<cameraX+1380;world+=34){ const z=seeded(world*.18); const x=world-cameraX; const y=520+seeded(world*.11)*150; if (z>.43 && region.kind!=="library" && region.kind!=="observatory") { const sway=Math.sin(time/500+world)*2; fill(ctx,x,y,2,12,"#2b544c"); fill(ctx,x-3+sway,y-3,7,5,z>.7?"#efa4bd":"#f1cf85"); fill(ctx,x,y-5,2,3,"#ffe7af"); } if(z>.76) this.tree(x,y-24, .55+seeded(world)*.45, region.kind==="forest"?"#1f4344":"#315559", "#587b6d"); }
  }
  landmark(cameraX, region, time) {
    const ctx=this.ctx; const x=region.from+390-cameraX; const ground=535;
    if(region.kind==="lake"){ fill(ctx,0,460,1280,260,"#2d5d75"); for(let i=0;i<33;i++){const px=(i*103-cameraX*.2)%1340;const py=470+(i*47)%230;fill(ctx,px,py,25+(i%4)*10,2,"rgba(190,219,223,.34)");} const reflection=ctx.createLinearGradient(0,460,0,650);reflection.addColorStop(0,"rgba(253,220,177,.22)");reflection.addColorStop(1,"rgba(253,220,177,0)");ctx.fillStyle=reflection;ctx.fillRect(x-105,445,210,190); }
    if(region.kind==="forest"){ for(let i=0;i<20;i++){const tx=region.from+i*63-cameraX;this.tree(tx,470+(i%3)*30,1.1,"#183a3d","#315a57");} }
    if(region.kind==="train"){ const rail=530; fill(ctx,0,rail,1280,5,"#3c384a"); for(let i=0;i<17;i++) fill(ctx,i*86-(cameraX%86),rail+5,54,4,"#795c55"); const trainX=x+Math.sin(time/13000)*105; fill(ctx,trainX-120,405,210,68,"#633b4b"); fill(ctx,trainX-95,386,115,87,"#724555"); fill(ctx,trainX-70,404,27,23,"#f2cd9f");fill(ctx,trainX-30,404,27,23,"#f2cd9f");fill(ctx,trainX+10,404,27,23,"#f2cd9f");fill(ctx,trainX+50,404,27,23,"#f2cd9f"); fill(ctx,trainX+90,435,35,38,"#553343"); }
    if(region.kind==="library"){ fill(ctx,x-200,220,400,310,"#4f3d4c"); fill(ctx,x-220,205,440,22,"#372d42"); for(let row=0;row<4;row++)for(let col=0;col<20;col++){fill(ctx,x-182+col*18,250+row*52,12,37,["#bd7d72","#c59e64","#727ca7","#897393"][Math.floor(seeded(row*22+col)*4)]);} fill(ctx,x-30,420,58,110,"#2b2738"); fill(ctx,x-4,435,12,95,"#e4bd87"); }
    if(region.kind==="garden"){ for(let i=0;i<4;i++){ctx.strokeStyle="rgba(239,213,192,.65)";ctx.lineWidth=5;ctx.beginPath();ctx.arc(x-155+i*103,435,42,Math.PI,0);ctx.stroke();fill(ctx,x-155+i*103-45,435,90,7,"#4a4d55");} }
    if(region.kind==="observatory"){ fill(ctx,x-145,350,290,180,"#40394d"); ctx.beginPath();ctx.arc(x,350,104,Math.PI,0);ctx.fillStyle="#5f5977";ctx.fill();ctx.beginPath();ctx.arc(x,350,74,Math.PI,0);ctx.fillStyle="#79719a";ctx.fill();fill(ctx,x-18,438,36,92,"#28283d");fill(ctx,x-6,450,12,80,"#e7c091"); }
    if(region.kind==="hill"){ ctx.fillStyle="#6e755d";ctx.beginPath();ctx.moveTo(0,530);ctx.quadraticCurveTo(320,330,650,440);ctx.quadraticCurveTo(1000,520,1280,365);ctx.lineTo(1280,720);ctx.lineTo(0,720);ctx.fill(); }
    if(region.kind==="beach"){ fill(ctx,0,520,1280,200,"#d8c393"); for(let i=0;i<23;i++){const px=(i*71-cameraX*.3)%1320;fill(ctx,px,548+(i*31)%158,4,2,"#f5e2b0");} for(let i=0;i<14;i++){const px=(i*133-cameraX*.12)%1350;const py=425+(i*51)%100;fill(ctx,px,py,2,1,"#1c2b3e");fill(ctx,px+2,py+1,2,1,"#1c2b3e");} }
  }
  memory(ctx, item, cameraX, found, time) { const x=item.x-cameraX,y=item.y; if(x<-40||x>1320)return; ctx.save();ctx.translate(x,y);const pulse=1+Math.sin(time/430+item.x)*.12;ctx.globalAlpha=found?.16:.92;ctx.fillStyle=found?"#f0ca96":"#fff0bb";ctx.beginPath();ctx.arc(0,0,found?7:10*pulse,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;ctx.fillStyle=found?"#e0a77d":"#fff8dc";ctx.font="22px Georgia";ctx.textAlign="center";ctx.fillText(item.icon,0,7);ctx.restore(); }
  player(player, cameraX, time) { const ctx=this.ctx,x=Math.round(player.x-cameraX),y=Math.round(player.y); const bob=player.moving?Math.sin(time/75)*2:Math.sin(time/1000)*.7; ctx.save();ctx.translate(x,y+bob);ctx.fillStyle="rgba(17,18,32,.25)";ctx.beginPath();ctx.ellipse(0,18,16,4,0,0,Math.PI*2);ctx.fill();fill(ctx,-8,4,16,15,"#c8789d");fill(ctx,-6,18,4,9,"#313046");fill(ctx,2,18,4,9,"#313046");ctx.fillStyle="#f1caaa";ctx.beginPath();ctx.arc(0,-3,10,0,Math.PI*2);ctx.fill();ctx.fillStyle="#49324a";ctx.beginPath();ctx.arc(0,-6,11,Math.PI,0);ctx.lineTo(10,2);ctx.lineTo(-10,2);ctx.fill();fill(ctx,-10,-4,3,16,"#49324a");fill(ctx,7,-3,3,18,"#49324a");if(player.sitting){fill(ctx,-11,18,21,5,"#c8789d");fill(ctx,-12,22,8,4,"#313046");}ctx.restore(); }
  vignette() { const c=this.ctx;const g=c.createRadialGradient(640,360,240,640,360,850);g.addColorStop(.55,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(5,6,17,.42)");c.fillStyle=g;c.fillRect(0,0,1280,720); }
  frame({ cameraX, region, time, dayTime, particles, player, memories, found, finale }) { const night=this.sky(dayTime,region);this.hills(cameraX,region,time);this.landmark(cameraX,region,time);this.flora(cameraX,region,time);for(const memory of memories)this.memory(this.ctx,memory,cameraX,found.has(memory.id),time);particles.draw(this.ctx,cameraX,time);this.player(player,cameraX,time); if(night>.62){this.ctx.globalCompositeOperation="screen";const glow=this.ctx.createRadialGradient(player.x-cameraX,player.y,5,player.x-cameraX,player.y,105);glow.addColorStop(0,"rgba(255,222,154,.18)");glow.addColorStop(1,"rgba(255,222,154,0)");this.ctx.fillStyle=glow;this.ctx.fillRect(player.x-cameraX-110,player.y-110,220,220);this.ctx.globalCompositeOperation="source-over";} if(finale?.active)this.constellation(finale);this.vignette(); }
  constellation(finale) { const c=this.ctx; const progress=clamp(finale.progress,0,1); c.fillStyle=`rgba(8,9,22,${progress*.6})`;c.fillRect(0,0,1280,720); c.save();c.translate(640,300);c.strokeStyle=`rgba(255,233,184,${progress})`;c.lineWidth=2; c.beginPath();for(let a=0;a<=Math.PI*2;a+=.05){const r=13*(1-Math.sin(a));const x=16*Math.pow(Math.sin(a),3);const y=-(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a)); if(a===0)c.moveTo(x*8,y*8);else c.lineTo(x*8,y*8);}c.stroke();for(let i=0;i<52*progress;i++){const a=i/52*Math.PI*2;const x=16*Math.pow(Math.sin(a),3)*8;const y=-(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a))*8;c.fillStyle="#fff1b5";c.fillRect(x-1,y-1,3,3);}c.restore(); }
}


// ═══ MODULE: renderer-v2.js ═══
/**
 * RendererV2 — Sprite-ready rendering pipeline for Stella.
 *
 * Architecture:
 *   sky → parallax hills → landmarks → tilemap(ground) → tilemap(decoration)
 *   → entities (memories, player) → tilemap(above) → particles
 *   → lighting → constellation/finale
 *
 * The renderer is fully backwards-compatible. With `spritesReady = false`
 * (the default), it delegates EVERY visual to the original procedural
 * Renderer. This means the game works identically on day one.
 *
 * Once actual sprites are loaded and `spritesReady` is set to true,
 * sprite-based paths activate and the procedural fallbacks fade out.
 */








class RendererV2 {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;

    // New subsystems
    this.sprites  = new SpriteLoader();
    this.camera   = new Camera();
    this.tilemap  = new TileMap(this.camera.renderScale);
    this.lighting = new Lighting2D();
    this.animator  = new SpriteAnimator();

    // Old renderer for procedural fallback
    this.procedural = new Renderer(canvas);

    /**
     * Master switch. Set to true after loading sprites to activate
     * the tile/sprite rendering paths.
     */
    this.spritesReady = false;

    /**
     * Whether to use the new Lighting2D system even in procedural mode.
     * Enable this once you like the lighting look.
     */
    this.useLighting = true;

    // Register a persistent player light
    this.lighting.addLight("player", 0, 0, 140, "#FFE09A", 0.9, 0.08);
  }

  /* ── Public API ────────────────────────────────────────────── */

  /**
   * Renders one complete frame. Drop-in replacement for the old Renderer.frame().
   * @param {Object} state  The game state object
   */
  frame(state) {
    const {
      cameraX, region, time, dayTime,
      particles, player, memories, found, finale,
    } = state;

    const ctx = this.ctx;
    ctx.imageSmoothingEnabled = false;

    // Sync the camera position with the game's cameraX
    this.camera.x = cameraX;

    // Update subsystems
    this.lighting.update(dayTime, 16);
    this.lighting.moveLight("player", player.x - cameraX, player.y);
    this.tilemap.update(16);

    // Clear
    ctx.clearRect(0, 0, VIEW.width, VIEW.height);

    // ── 1. Sky ────────────────────────────────────────────────
    const night = this.procedural.sky(dayTime, region);

    // ── 2. Parallax backgrounds (hills + distant elements) ───
    this.procedural.hills(cameraX, region, time);

    // ── 3. Landmark (region-specific structures) ─────────────
    this.procedural.landmark(cameraX, region, time);

    // ── 4. World content ─────────────────────────────────────
    if (this.spritesReady) {
      // Tile-based rendering at 4× scale
      this.camera.beginScaled(ctx);
      this.tilemap.render(ctx, this.camera, "ground", this.sprites);
      this.tilemap.render(ctx, this.camera, "decoration", this.sprites);
      this.camera.endScaled(ctx);
    } else {
      // Procedural flora (trees, flowers, grass)
      this.procedural.flora(cameraX, region, time);
    }

    // ── 5. Memories / Interactive objects ─────────────────────
    for (const mem of memories) {
      this.procedural.memory(ctx, mem, cameraX, found.has(mem.id), time);
    }

    // ── 6. Player ────────────────────────────────────────────
    if (this.spritesReady) {
      this._drawSpritePlayer(ctx, player, cameraX, time);
    } else {
      this.procedural.player(player, cameraX, time);
    }

    // ── 7. Above layer (tree canopies, roofs) ────────────────
    if (this.spritesReady) {
      this.camera.beginScaled(ctx);
      this.tilemap.render(ctx, this.camera, "above", this.sprites);
      this.camera.endScaled(ctx);
    }

    // ── 8. Particles ─────────────────────────────────────────
    particles.draw(ctx, cameraX, time);

    // ── 9. Lighting ──────────────────────────────────────────
    if (this.useLighting) {
      this.lighting.render(ctx, this.camera);
    } else {
      // Legacy glow + vignette
      if (night > 0.62) {
        ctx.globalCompositeOperation = "screen";
        const glow = ctx.createRadialGradient(
          player.x - cameraX, player.y, 5,
          player.x - cameraX, player.y, 105
        );
        glow.addColorStop(0, "rgba(255,222,154,.18)");
        glow.addColorStop(1, "rgba(255,222,154,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(player.x - cameraX - 110, player.y - 110, 220, 220);
        ctx.globalCompositeOperation = "source-over";
      }
      this.procedural.vignette();
    }

    // ── 10. Finale constellation ─────────────────────────────
    if (finale?.active) {
      this.procedural.constellation(finale);
    }
  }

  /* ── Sprite-based player (future) ──────────────────────────── */

  _drawSpritePlayer(ctx, player, cameraX, time) {
    // When sprites are loaded, this will draw the animated character.
    // For now, fall back to procedural.
    const key = player.moving ? "walk" : "idle";
    const frame = this.sprites.getFrame(`char_stella_${key}`, this.animator.getCurrentFrame());
    if (frame) {
      const x = Math.round(player.x - cameraX) - 32;
      const y = Math.round(player.y) - 48 + (player.moving ? Math.sin(time / 75) * 2 : Math.sin(time / 1000) * 0.7);
      ctx.drawImage(frame, x, y, 64, 96); // 16×24 at 4× scale
    } else {
      // Fallback
      this.procedural.player(player, cameraX, time);
    }
  }

  /* ── Sprite loading helper ─────────────────────────────────── */

  /**
   * Loads all game assets. Call once at startup.
   * @param {function(number,number):void} [onProgress]
   * @returns {Promise<boolean>} true if sprites loaded successfully
   */
  async loadAssets(onProgress) {
    // TODO: Enqueue actual sprite paths here when assets are downloaded
    // Example:
    // this.sprites.enqueue("tiles", "assets/tilesets/forest/tileset.png", 16, 16);
    // this.sprites.enqueue("char_stella_walk", "assets/characters/player/stella_walk.png", 16, 24);

    if (this.sprites.total > 0) {
      await this.sprites.preload(onProgress);
      this.spritesReady = true;
      return true;
    }
    return false;
  }
}


// ═══ MODULE: game-v2.js ═══
/**
 * game-v2.js — Stella game loop using RendererV2.
 *
 * This is a drop-in replacement for game.js. The only difference is
 * that it instantiates RendererV2 instead of the old Renderer, gaining:
 *   - Sprite-based rendering (when assets are loaded)
 *   - Lighting2D with day/night cycle
 *   - Camera with shake support
 *   - TileMap for future level design
 *
 * All gameplay logic is IDENTICAL to game.js.
 */




const canvas = document.querySelector("#game");
const renderer = new RendererV2(canvas);
const input = new Input();
const saver = new SaveSystem();
const audio = new AudioSystem();
const particles = new Particles();
const $ = (selector) => document.querySelector(selector);
const saved = saver.load();
const state = {
  running: false, paused: false, time: saved.time ?? .71, cameraX: 0, region: regionAt(0), previousRegion: "",
  found: new Set(saved.memories || []), photos: saved.photos || 0,
  player: { x: saved.position?.x ?? 150, y: saved.position?.y ?? 540, moving: false, sitting: false },
  hero: saved.hero || "", author: saved.author || "",
  finale: { active: false, progress: 0 }, last: 0, saveTimer: 0,
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
  if(target.type === "memory") collect(target.item);
  else if(target.type === "quiet") { state.player.sitting=target.item.label.includes("sentar");showMoment(target.item.title,target.item.text,()=>state.player.sitting=false); if(target.item.label.includes("piano"))audio.memory(); }
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
  if(!state.running)return; state.time=(state.time+delta/540000)%1; state.region=regionAt(state.player.x); audio.setRegion(state.region);
  if(state.region.id!==state.previousRegion){state.previousRegion=state.region.id;showPlace(state.region);}
  if(state.finale.active){state.finale.progress+=delta/11000;if(state.finale.progress>=1.08){state.finale.progress=1.08;state.finale.active=false;finishFinale();}return;}
  if(!state.paused){
    let dx=0,dy=0;
    if(input.down("ArrowLeft","KeyA"))dx--;if(input.down("ArrowRight","KeyD"))dx++;
    if(input.down("ArrowUp","KeyW"))dy--;if(input.down("ArrowDown","KeyS"))dy++;
    state.player.moving=!!(dx||dy);
    if(dx||dy){
      const len=Math.hypot(dx,dy);
      state.player.x=clamp(state.player.x+dx/len*182*delta/1000,30,WORLD_WIDTH-30);
      state.player.y=clamp(state.player.y+dy/len*182*delta/1000,420,610);
    }
  }
  // Camera follow
  state.cameraX+=(clamp(state.player.x-VIEW.width*.45,0,WORLD_WIDTH-VIEW.width)-state.cameraX)*Math.min(1,delta/620);
  particles.update(delta,state.cameraX,state.region.weather);
  const target=nearby();
  $("#interaction").innerHTML=target?`<b>E</b> ${target.type==="final"?"deixar as memórias subirem ao céu":target.item.label||"guardar esta lembrança"}`:"";
  if(input.take("KeyE")||input.take("Enter"))interact();
  if(input.take("KeyF"))photo();
  if(input.take("KeyQ")){state.player.sitting=!state.player.sitting;showToast(state.player.sitting?"Ela se senta e observa o céu.":"Ela continua a caminhar.");}
  state.saveTimer+=delta;if(state.saveTimer>7500){save();state.saveTimer=0;}
}

function frame(time) {
  const delta=Math.min(40,time-state.last||0);
  state.last=time;
  update(delta);
  renderer.frame({
    cameraX: state.cameraX,
    region: state.region,
    time,
    dayTime: state.time,
    particles,
    player: state.player,
    memories,
    found: state.found,
    finale: state.finale,
  });
  requestAnimationFrame(frame);
}

function start(event) {
  event.preventDefault();
  state.hero=$("#hero-input").value.trim()||"você";
  state.author=$("#author-input").value.trim()||"alguém que te ama";
  state.running=true;
  $("#intro").classList.add("hidden");
  audio.start();
  showPlace(state.region);
  showMoment("uma chegada suave",`Boa noite, ${state.hero}. Não há pressa. O mundo está aqui para ser visto com calma.`);
  save();

  // Attempt to load sprites (non-blocking, game starts with procedural fallback)
  renderer.loadAssets((loaded, total) => {
    console.log(`[Assets] ${loaded}/${total}`);
  }).then(ok => {
    if (ok) console.log("[Assets] Sprite rendering activated.");
    else console.log("[Assets] No sprites enqueued, using procedural rendering.");
  });
}

$("#start-form").addEventListener("submit", start);
$("#photo-button").addEventListener("click", photo);
$("#sound-button").addEventListener("click", () => {
  const on = audio.toggle();
  $("#sound-button").textContent = on ? "♪" : "×";
  $("#sound-button").setAttribute("aria-label", on ? "Desativar som" : "Ativar som");
});
$("#return-button").addEventListener("click", () => location.reload());
$("#hero-input").value = state.hero;
$("#author-input").value = state.author;
updateSigil();
requestAnimationFrame(frame);


})();
