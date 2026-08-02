/**
 * asset-registry.js
 * 
 * Registro centralizado de todos os assets do jogo.
 * Nenhuma outra classe deve possuir caminhos hardcoded ("assets/...")
 * 
 * A estrutura suporta múltiplos packs (Resource Packs). 
 * O AssetManager utilizará essas configurações para gerar os Handles.
 */

export const ASSET_PACKS = {
  base: {
    fonts: {
      "rainyhearts": "assets/fonts/rainyhearts.ttf"
    },
    
    tilesets: {
      "village": "assets/tilesets/village/tileset_ss_spr_tileset_sunnysideworld_16px.png"
    },
    
    player: {
      "idle": { path: "assets/characters/player/char_human_idle_base_idle_strip9.png", frames: 9, fps: 8, loop: true },
      "walk": { path: "assets/characters/player/char_human_walking_base_walk_strip8.png", frames: 8, fps: 12, loop: true },
      "sit":  { path: "assets/characters/player/char_human_doing_base_doing_strip8.png", frames: 8, fps: 6, loop: true }
    }
    
    // Futuras categorias: sfx, music, vfx...
  },

  // Exemplo de como um DLC ou evento sazonal seria configurado no futuro:
  // winter: {
  //   tilesets: { "village": "assets/tilesets/village/winter_village.png" },
  //   player: { "idle": { path: "assets/characters/player/winter_idle.png", ... } }
  // }
};
