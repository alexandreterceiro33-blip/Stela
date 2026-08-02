/**
 * entity-factory.js
 * 
 * Fábrica centralizada para criação de entidades do mundo.
 * O MapManager e o World instanciam objetos interceptados do Tiled
 * passando-os para esta fábrica, que decide a classe final da entidade.
 */

import { EntityType } from "./constants.js";
import { Character } from "./character.js";
import { Portal } from "./entities/portal.js";

export class EntityFactory {
  /**
   * Cria uma entidade com base no tipo especificado.
   * @param {string} type - Tipo da entidade (ex: EntityType.PLAYER)
   * @param {Object} spawnData - Dados extraídos do objeto Tiled (x, y, properties, etc)
   * @returns {Object|null} A instância da entidade, ou null se não for reconhecida
   */
  static create(type, spawnData) {
    const { x, y, properties } = spawnData;

    switch (type) {
      case EntityType.PLAYER:
        console.log(`[EntityFactory] Instantiating Player at (${x}, ${y})`);
        return new Character(x, y);

      case EntityType.NPC:
        console.log(`[EntityFactory] Instantiating NPC at (${x}, ${y})`);
        const npc = new Character(x, y);
        // Aplica propriedades customizadas, como rota ou diálogo
        if (spawnData.getProperty) {
          npc.dialog = spawnData.getProperty("dialog", null);
        }
        return npc;

      case EntityType.PORTAL:
        console.log(`[EntityFactory] Instantiating Portal at (${x}, ${y})`);
        const targetMap = spawnData.getProperty ? spawnData.getProperty("targetMap") : null;
        const targetSpawn = spawnData.getProperty ? spawnData.getProperty("targetSpawn") : null;
        return new Portal(x, y, spawnData.width, spawnData.height, targetMap, targetSpawn);

      default:
        console.warn(`[EntityFactory] Unknown entity type requested: ${type}`);
        return null;
    }
  }
}
