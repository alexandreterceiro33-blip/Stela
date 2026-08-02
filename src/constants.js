/**
 * constants.js
 * 
 * Centralização de constantes do jogo.
 * Previne "magic strings" e garante consistência em toda a arquitetura.
 */

export const LayerType = {
  GROUND: "ground",
  PATH: "path",
  WATER: "water",
  DECORATION: "decoration",
  COLLISION: "collision",
  OBJECT: "object",
  ABOVE: "above",
  SHADOW: "shadow",
  LIGHT: "light",
  WEATHER: "weather",
  INTERACTION: "interaction",
  NPC: "npc",
  SPAWN: "spawn",
  PORTAL: "portal",
  DEBUG: "debug"
};

export const EntityType = {
  PLAYER: "player",
  NPC: "npc",
  PORTAL: "portal",
  ITEM: "item",
  ANIMAL: "animal",
  LIGHT: "light"
};
