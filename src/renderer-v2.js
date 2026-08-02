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
import { VIEW } from "./config.js";
import { Camera } from "./camera.js";
import { TileMap } from "./tilemap.js";
import { SpriteAnimator } from "./sprite-animator.js";
import { AssetManager } from "./asset-manager.js";
import { Lighting2D } from "./lighting.js";
import { Renderer as ProceduralRenderer } from "./renderer.js";

export class RendererV2 {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;

    // New subsystems
    this.camera   = new Camera();
    this.lighting = new Lighting2D();
    // The animator is kept for legacy/standalone animations if needed, but 
    // the Character state machine and SpriteSheet handle time-based frames directly.
    this.animator = new SpriteAnimator();

    // Old renderer for procedural fallback
    this.procedural = new ProceduralRenderer(canvas);

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
      cameraX, world, time, dayTime,
      particles, player, memories = [], found = new Set(), finale = null,
    } = state;
    const region = world.currentRegion || { kind: "village", from: 0 };

    const ctx = this.ctx;
    ctx.imageSmoothingEnabled = false;

    // Sync the camera position with the game's cameraX
    this.camera.x = cameraX;

    // Update subsystems
    this.lighting.update(dayTime, 16);
    this.lighting.moveLight("player", player.x - cameraX, player.y);
    const tilemap = world.getActiveTileMap();
    if (tilemap) tilemap.update(16);

    // Clear
    ctx.clearRect(0, 0, VIEW.width, VIEW.height);

    // ── 1. Sky ────────────────────────────────────────────────
    const night = this.procedural.sky(dayTime, region);

    // ── 2. Parallax backgrounds (hills + distant elements) ───
    if (!this.spritesReady) {
      this.procedural.hills(cameraX, region, time);
      
      // ── 3. Landmark (region-specific structures) ─────────────
      this.procedural.landmark(cameraX, region, time);
    }

    // ── 4. World content ─────────────────────────────────────
    if (this.spritesReady && tilemap) {
      // Tile-based rendering at 4× scale
      this.camera.beginScaled(ctx);
      tilemap.render(ctx, this.camera, "ground", tilemap.tilesetHandle);
      tilemap.render(ctx, this.camera, "decoration", tilemap.tilesetHandle);
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
    if (this.spritesReady && tilemap) {
      this.camera.beginScaled(ctx);
      tilemap.render(ctx, this.camera, "above", tilemap.tilesetHandle);
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

    // ── 11. Debug ────────────────────────────────────────────
    if (window.DEBUG_MAP) {
      this._renderDebug(ctx, tilemap, world.entities, cameraX);
    }
  }

  /* ── Sprite-based player (future) ──────────────────────────── */

  _drawSpritePlayer(ctx, player, cameraX, time) {
    const handle = AssetManager.get("player", player.currentState);
    
    if (handle) {
      const frameIdx = handle.getFrameIndex(time);
      // O pivot original (procedural) era no centro inferior, vamos ajustar 
      // a posição de desenho para que o centro inferior do sprite de 16x24 (na escala 4x: 64x96)
      // encaixe no player.x, player.y.
      const width = 64;
      const height = 96;
      const drawX = Math.round(player.x - cameraX) - (width / 2);
      
      // Pequeno bobbing baseado no estado
      const bobbing = player.currentState === "walk" ? Math.sin(time / 75) * 2 : 
                      player.currentState === "idle" ? Math.sin(time / 1000) * 0.7 : 0;
                      
      const drawY = Math.round(player.y) - height + bobbing;
      
      handle.drawFrame(ctx, drawX, drawY, width, height, frameIdx);
    } else {
      this.procedural.player(player, cameraX, time);
    }
  }

  /* ── Debug Mode ────────────────────────────────────────────── */

  _renderDebug(ctx, tilemap, entities, cameraX) {
    if (!tilemap) return;
    
    ctx.font = "10px ui-monospace, monospace";
    ctx.textBaseline = "top";

    this.camera.beginScaled(ctx);

    // Helper to draw info box
    const drawInfo = (x, y, lines, color) => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(x, y, 100, lines.length * 12 + 4);
      ctx.fillStyle = color;
      lines.forEach((l, i) => ctx.fillText(l, x + 2, y + 2 + i * 12));
    };

    // 1. Draw Collisions (AABB)
    const collisions = tilemap.getCollisions();
    ctx.lineWidth = 1;
    for (const c of collisions) {
      ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
      ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
      ctx.fillRect(c.x, c.y, c.width, c.height);
      ctx.strokeRect(c.x, c.y, c.width, c.height);
      drawInfo(c.x, c.y, [`ID: ${c.id || '-'}`, `L: Collision`], "#FFAAAA");
    }

    // 2. Draw Interactions / Lights / Spawns from Tilemap objects
    const drawObjects = (layerName, strokeColor, fillColor) => {
      for (const obj of tilemap.getObjects(layerName)) {
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
        
        let props = Object.entries(obj.properties || {}).map(([k,v]) => `${k}:${v}`);
        drawInfo(obj.x, obj.y, [`ID: ${obj.id}`, `L: ${layerName}`, ...props], strokeColor);
      }
    };

    drawObjects("interaction", "#00FFFF", "rgba(0, 255, 255, 0.3)");
    drawObjects("light", "#FFFF00", "rgba(255, 255, 0, 0.3)");
    drawObjects("spawn", "#00FF00", "rgba(0, 255, 0, 0.3)");

    // 3. Draw Entities (Player, NPC, Portal)
    for (const ent of entities) {
      if (ent.constructor.name === "Portal") {
        ctx.fillStyle = "rgba(100, 0, 255, 0.4)";
        ctx.strokeStyle = "rgba(100, 0, 255, 0.8)";
        ctx.fillRect(ent.x, ent.y, ent.width, ent.height);
        ctx.strokeRect(ent.x, ent.y, ent.width, ent.height);
        drawInfo(ent.x, ent.y, [`Portal`, `To: ${ent.targetMap}`], "#DDAAFF");
      } else if (ent.constructor.name === "Character") {
        const hb = ent.getWorldHitbox();
        ctx.strokeStyle = "#00FF00";
        ctx.strokeRect(hb.x, hb.y, hb.width, hb.height);
        
        // Draw interaction box
        const ibox = ent.getInteractionBox(16);
        ctx.strokeStyle = "#00FFFF";
        ctx.setLineDash([2, 2]);
        ctx.strokeRect(ibox.x, ibox.y, ibox.width, ibox.height);
        ctx.setLineDash([]);
        
        drawInfo(ent.x - 20, ent.y - 30, [`Facing: ${ent.facing}`, `X:${Math.round(ent.x)} Y:${Math.round(ent.y)}`], "#00FF00");
      }
    }

    this.camera.endScaled(ctx);

    // UI na tela
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(10, 10, 250, 70);
    ctx.fillStyle = "#00FF00";
    ctx.fillText(`DEBUG_MAP: Ativo`, 15, 15);
    ctx.fillText(`Camera X: ${Math.round(cameraX)}`, 15, 30);
    ctx.fillText(`Colisões AABB: ${collisions.length}`, 15, 45);
    ctx.fillText(`Entidades Ativas: ${entities.length}`, 15, 60);
  }
}
