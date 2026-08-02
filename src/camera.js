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
import { VIEW, WORLD_WIDTH } from "./config.js";
import { clamp, lerp } from "./systems.js";

export class Camera {
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
