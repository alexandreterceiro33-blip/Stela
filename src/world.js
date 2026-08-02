/**
 * world.js
 * 
 * Abstração do mundo do jogo.
 * Solicita carregamento de mapas ao MapManager, inicializa o TileMap
 * correspondente e orquestra as Entidades geradas pela EntityFactory.
 */

import { MapManager } from "./map-manager.js";
import { TileMap } from "./tilemap.js";
import { AssetManager } from "./asset-manager.js";
import { EntityFactory } from "./entity-factory.js";
import { LayerType, EntityType } from "./constants.js";

export class World {
  constructor(renderScale) {
    this.activeMapId = null;
    this.tilemap = null;
    this.entities = [];
    this.renderScale = renderScale || 4;
  }

  /**
   * Solicita ao MapManager o carregamento de um mapa e popula o mundo.
   * @param {string} mapId 
   */
  async loadMap(mapId) {
    console.log(`[World] Requesting map load: ${mapId}`);
    const mapPack = await MapManager.load(mapId);
    if (!mapPack) {
      console.error(`[World] Failed to load map: ${mapId}`);
      return false;
    }

    this.activeMapId = mapId;
    
    // 1. Constrói o TileMap a partir dos dados limpos do parser
    this.tilemap = new TileMap(this.renderScale);
    this.tilemap.buildFromParsedData(mapPack.data);
    
    // Associa o tileset configurado no .meta.json (ou default)
    const tilesetId = mapPack.meta?.tileset || "village";
    this.tilemap.tilesetHandle = AssetManager.get("tilesets", tilesetId);

    // 2. Extrai e constrói entidades (Spawns, Portais, NPCs)
    this.entities = [];
    this._instantiateLayer(LayerType.SPAWN, EntityType.PLAYER); // Placeholder para lógica de spawn se for instanciar novo
    this._instantiateLayer(LayerType.PORTAL, EntityType.PORTAL);
    this._instantiateLayer(LayerType.NPC, EntityType.NPC);
    
    console.log(`[World] Map loaded and populated: ${mapId} (${this.entities.length} entities spawned)`);
    return true;
  }

  _instantiateLayer(layerName, entityType) {
    const objects = this.tilemap.getObjects(layerName);
    for (const objData of objects) {
      const entity = EntityFactory.create(entityType, objData);
      if (entity) {
        this.entities.push(entity);
      }
    }
  }

  update(delta) {
    // Atualiza lógica das entidades, animações de tiles, etc
    if (this.tilemap) this.tilemap.update(delta);
    
    // Exemplo: checar colisões com portais
    // para cada portal em this.entities -> se player colidir -> MapManager.load(portal.targetMap)
  }

  getActiveTileMap() {
    return this.tilemap;
  }
}
