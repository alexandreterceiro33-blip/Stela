/**
 * SpriteLoader — Async sprite loading with caching, spritesheet atlas support,
 * and preload queue with progress callback.
 *
 * Design: Each sprite or spritesheet frame is stored in a Map keyed by string.
 *         Frames extracted from a sheet are cached as off-screen canvases.
 *         On failure, a magenta placeholder is created (never crashes).
 */
export class SpriteLoader {
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
