/**
 * map-manager.js
 * 
 * Gerenciador principal de mapas.
 * Lida com o ciclo de vida (load, unload, cache) de arquivos .json gerados pelo Tiled,
 * além de consultar os arquivos .meta.json associados.
 */

import { TiledParser } from "./tiled-parser.js";

class MapManagerCore {
  constructor() {
    this.cache = new Map(); // mapId -> Parsed Map Data
    this.metaCache = new Map(); // mapId -> Meta Data
    this.activeMapId = null;
  }

  /**
   * Retorna o mapa ativo atual.
   */
  current() {
    if (!this.activeMapId) return null;
    return {
      id: this.activeMapId,
      data: this.cache.get(this.activeMapId),
      meta: this.metaCache.get(this.activeMapId)
    };
  }

  /**
   * Carrega um mapa e seus metadados. Utiliza cache inteligente.
   * @param {string} mapId - Ex: "village"
   * @returns {Promise<Object>} Dados do mapa parseados
   */
  async load(mapId) {
    if (this.cache.has(mapId)) {
      console.log(`[MapManager] Serving map from cache: ${mapId}`);
      this.activeMapId = mapId;
      return this.current();
    }

    console.log(`[MapManager] Fetching map data: ${mapId}`);
    try {
      // 1. Carrega os arquivos
      const basePath = `assets/maps/${mapId}/${mapId}`;
      const [resJson, resMeta] = await Promise.all([
        fetch(`${basePath}.json`),
        fetch(`${basePath}.meta.json`).catch(() => null) // Meta é opcional para não quebrar testes, mas recomendado
      ]);

      if (!resJson.ok) throw new Error(`HTTP ${resJson.status}`);

      const rawJson = await resJson.json();
      let metaData = {};
      if (resMeta && resMeta.ok) {
        metaData = await resMeta.json();
      }

      // 2. Faz o parsing via TiledParser (sem lógica procedural)
      const parsedData = TiledParser.parse(rawJson);

      // 3. Salva no cache
      this.cache.set(mapId, parsedData);
      this.metaCache.set(mapId, metaData);
      
      this.activeMapId = mapId;
      console.log(`[MapManager] Map loaded successfully: ${mapId}`);
      
      return this.current();

    } catch (e) {
      console.error(`[MapManager] Error loading map ${mapId}:`, e);
      return null;
    }
  }

  /**
   * Descarrega um mapa da memória cache.
   */
  unload(mapId) {
    if (this.cache.has(mapId)) {
      this.cache.delete(mapId);
      this.metaCache.delete(mapId);
      if (this.activeMapId === mapId) this.activeMapId = null;
      console.log(`[MapManager] Unloaded map: ${mapId}`);
    }
  }

  /**
   * Força o recarregamento do mapa atual do disco (útil para desenvolvimento e hot-reload).
   */
  async reload() {
    if (this.activeMapId) {
      const currentMap = this.activeMapId;
      this.unload(currentMap);
      return this.load(currentMap);
    }
    return null;
  }
}

export const MapManager = new MapManagerCore();
