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
import { VIEW } from "./config.js";
import { clamp } from "./systems.js";

export class Lighting2D {
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

  /** Removes all lights from the system (e.g. on map load) */
  clearAll() { this.lights.clear(); }

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
