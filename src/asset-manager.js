/**
 * asset-manager.js
 * 
 * Fachada Única (Singleton) para acesso aos assets.
 * Nenhuma classe do jogo deve conhecer URLs. Todas as requisições
 * são feitas pedindo o ID do asset (ex: "player.idle").
 * 
 * Funcionalidades:
 * - Load de Fontes (via FontFace API)
 * - Load de Sprites (convertendo para Handle SpriteSheet)
 * - Suporte a pacotes de recursos (Resource Packs) via asset-registry
 * - Logs padronizados [AssetManager]
 * - Geração automática de Manifesto Visual no console
 */

import { ASSET_PACKS } from "./asset-registry.js";
import { SpriteSheet } from "./sprite-sheet.js";

class AssetManagerCore {
  constructor() {
    this.handles = new Map();
    this.activePack = "base";
  }

  /**
   * Define o resource pack atual (para DLCs, eventos sazonais, etc).
   */
  setPack(packName) {
    if (ASSET_PACKS[packName]) {
      this.activePack = packName;
      console.log(`[AssetManager] Active pack set to: ${packName}`);
    } else {
      console.error(`[AssetManager] Pack not found: ${packName}`);
    }
  }

  /**
   * Retorna um Handle de asset previamente carregado.
   * @param {string} category - A categoria principal (ex: "player", "tilesets")
   * @param {string} id - O ID específico (ex: "idle", "village")
   * @returns {SpriteSheet | Object | undefined}
   */
  get(category, id) {
    const fullId = `${category}.${id}`;
    const handle = this.handles.get(fullId);
    if (!handle) {
      console.warn(`[AssetManager] Warning: Asset handle missing for '${fullId}'`);
    }
    return handle;
  }

  /**
   * Preload massivo de todos os assets definidos no Asset Registry
   * para o Pack atualmente selecionado.
   * @param {function(number, number)} onProgress Callback opcional de progresso
   * @returns {Promise<boolean>} True quando completo
   */
  async loadAll(onProgress) {
    const pack = ASSET_PACKS[this.activePack];
    if (!pack) {
      console.error(`[AssetManager] No pack loaded.`);
      return false;
    }

    const tasks = [];

    // 1. Queue Fonts
    if (pack.fonts) {
      for (const [id, path] of Object.entries(pack.fonts)) {
        tasks.push(this._loadFont(id, path));
      }
    }

    // 2. Queue Player Sprites
    if (pack.player) {
      for (const [id, config] of Object.entries(pack.player)) {
        tasks.push(this._loadSprite(`player.${id}`, config.path, config.frames, config.fps, config.loop));
      }
    }

    // 3. Queue Tilesets (Single Frame, no animation)
    if (pack.tilesets) {
      for (const [id, path] of Object.entries(pack.tilesets)) {
        tasks.push(this._loadSprite(`tilesets.${id}`, path, 1, 0, false));
      }
    }

    let completed = 0;
    const total = tasks.length;
    
    console.log(`[AssetManager] Beginning preload of ${total} assets from pack '${this.activePack}'...`);

    // Execute with progress tracking
    const promises = tasks.map(p => p.then(() => {
      completed++;
      if (onProgress) onProgress(completed, total);
    }));

    await Promise.allSettled(promises);
    
    this._generateManifest();
    return true;
  }

  /* ── INTERNAL LOADERS ─────────────────────────────────────── */

  async _loadFont(id, path) {
    try {
      const font = new FontFace(id, `url(${path})`);
      const loadedFont = await font.load();
      document.fonts.add(loadedFont);
      this.handles.set(`fonts.${id}`, { id, path, type: 'font' });
      console.log(`[AssetManager] Font loaded: ${id}`);
    } catch (e) {
      console.error(`[AssetManager] Failed to load font: ${id} at ${path}`, e);
    }
  }

  async _loadSprite(fullId, path, frames = 1, fps = 10, loop = true) {
    if (this.handles.has(fullId)) return this.handles.get(fullId);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const sheet = new SpriteSheet(fullId, img, frames, fps, loop);
        this.handles.set(fullId, sheet);
        console.log(`[AssetManager] Sprite loaded: ${fullId}`);
        resolve(sheet);
      };
      img.onerror = () => {
        console.error(`[AssetManager] Failed to load sprite: ${path}`);
        reject(new Error(`Failed to load ${path}`));
      };
      img.src = path;
    });
  }

  /* ── DEBUG & MANIFEST ─────────────────────────────────────── */

  _generateManifest() {
    console.log("[AssetManager] === ASSET MANIFEST ===");
    const categories = new Map();

    for (const [id, handle] of this.handles.entries()) {
      const cat = id.split('.')[0];
      if (!categories.has(cat)) categories.set(cat, []);
      categories.get(cat).push({ id, handle });
    }

    for (const [cat, items] of categories.entries()) {
      console.log(`[AssetManager] Category: ${cat.toUpperCase()}`);
      for (const item of items) {
        if (item.handle instanceof SpriteSheet) {
          const s = item.handle;
          console.log(`  └─ ${item.id} | ${s.sourceWidth}x${s.sourceHeight}px | ${s.frameCount} frames @ ${s.fps}fps`);
        } else {
          console.log(`  └─ ${item.id} | Font | ${item.handle.path}`);
        }
      }
    }
    console.log("[AssetManager] ============================");
  }
}

// Export as Singleton (Facade)
export const AssetManager = new AssetManagerCore();
