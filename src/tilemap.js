/**
 * tilemap.js
 * 
 * Container de dados visuais do mapa ativo.
 * Não possui lógica de carregamento, parsing ou regras de bioma.
 * Apenas segura as Tile Layers (para desenho rápido) e Object Layers
 * para consultas (ex: colisões AABB).
 */

import { LayerType } from "./constants.js";

export const TILE = 16; 

export class TileMap {
  /**
   * @param {number} renderScale 
   */
  constructor(renderScale = 4) {
    this.tileSize = TILE;
    this.scale = renderScale;

    // Dimensões em tiles
    this.cols = 0;
    this.rows = 0;

    // Dados crus de cada camada
    this.tileLayers = new Map();
    this.objectLayers = new Map();

    // Handle do AssetManager (ex: Village TileSet)
    this.tilesetHandle = null;

    this._animTimer = 0;
  }

  /**
   * Popula a estrutura a partir do output do TiledParser.
   * @param {Object} parsedData 
   */
  buildFromParsedData(parsedData) {
    this.cols = parsedData.width;
    this.rows = parsedData.height;
    this.tileLayers = parsedData.tileLayers;
    this.objectLayers = parsedData.objectLayers;
  }

  /**
   * Obtém os objetos customizados de uma layer específica.
   * @param {string} layerName - Constante LayerType
   * @returns {Array<Object>}
   */
  getObjects(layerName) {
    return this.objectLayers.get(layerName) || [];
  }

  /**
   * Obtém a lista de AABBs (Axis-Aligned Bounding Boxes) da camada de colisão.
   * Útil para o motor de física não-grid-based.
   */
  getCollisions() {
    return this.getObjects(LayerType.COLLISION).map(obj => ({
      x: obj.x,
      y: obj.y,
      width: obj.width,
      height: obj.height,
      type: obj.type || "solid"
    }));
  }

  update(dt) {
    this._animTimer += dt;
    // Animação de tiles pode ser implementada aqui consultando o tilesetHandle
  }

  /**
   * Renders one layer. Call between camera.beginScaled / endScaled.
   */
  render(ctx, camera, layerName, overrideTilesetHandle = null) {
    const data = this.tileLayers.get(layerName);
    if (!data) return;

    const handle = overrideTilesetHandle || this.tilesetHandle;

    // Visible tile range (cull off-screen)
    const bounds = camera.getTileBounds(this.tileSize);
    const c0 = Math.max(0, bounds.left - 1);
    const c1 = Math.min(this.cols - 1, bounds.right + 1);
    const r0 = Math.max(0, bounds.top - 1);
    const r1 = Math.min(this.rows - 1, bounds.bottom + 1);

    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        let id = data[r * this.cols + c];
        if (id === 0) continue;
        
        // No Tiled, os GIDs (Global IDs) são baseados em 1 (id-1 para a imagem)
        const frameIdx = id - 1; 

        const px = c * this.tileSize;
        const py = r * this.tileSize;

        if (handle) {
          handle.drawFrame(ctx, px, py, this.tileSize, this.tileSize, frameIdx);
        } else {
          // Fallback debug color
          ctx.fillStyle = `hsl(${(id * 40) % 360}, 60%, 40%)`;
          ctx.fillRect(px, py, this.tileSize, this.tileSize);
        }
      }
    }
  }
}
