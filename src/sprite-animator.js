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
export class SpriteAnimator {
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
