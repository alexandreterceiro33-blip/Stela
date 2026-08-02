/**
 * tiled-parser.js
 * 
 * Parser oficial para arquivos JSON exportados pelo Tiled Editor.
 * Interpreta nativamente a estrutura e separa as responsabilidades.
 */

import { LayerType } from "./constants.js";

export class TiledParser {
  /**
   * Converte o JSON cru do Tiled em uma estrutura otimizada para o motor.
   * @param {Object} rawJson - O objeto JSON exportado pelo Tiled.
   */
  static parse(rawJson) {
    const mapData = {
      width: rawJson.width,
      height: rawJson.height,
      tileWidth: rawJson.tilewidth,
      tileHeight: rawJson.tileheight,
      tileLayers: new Map(), // Nome -> Data Array
      objectLayers: new Map(), // Nome -> Lista de Objetos
      imageLayers: new Map(),
      groupLayers: new Map()
    };

    // Percorre todas as camadas do JSON e as categoriza
    if (rawJson.layers) {
      rawJson.layers.forEach(layer => {
        this._processLayer(layer, mapData);
      });
    }

    return mapData;
  }

  static _processLayer(layer, mapData) {
    if (!layer.visible) return;

    // Converte o nome da camada (ex: "Ground") para a constante, caso aplicável.
    // O Tiled costuma mandar com a primeira letra maiúscula dependendo do usuário.
    const normalizedName = layer.name.toLowerCase();

    switch (layer.type) {
      case "tilelayer":
        // No futuro, se for 'infinite', haverá chunks ao invés de data plana.
        // A estrutura 'data' é um array 1D
        if (layer.data) {
          mapData.tileLayers.set(normalizedName, new Int16Array(layer.data));
        }
        break;

      case "objectgroup":
        const objects = (layer.objects || []).map(obj => this._processObject(obj));
        mapData.objectLayers.set(normalizedName, objects);
        break;

      case "imagelayer":
        mapData.imageLayers.set(normalizedName, layer);
        break;

      case "group":
        mapData.groupLayers.set(normalizedName, layer);
        // Groups recursivamente contêm camadas
        if (layer.layers) {
          layer.layers.forEach(subLayer => this._processLayer(subLayer, mapData));
        }
        break;
        
      default:
        console.warn(`[TiledParser] Unknown layer type: ${layer.type}`);
    }
  }

  static _processObject(obj) {
    // Extrai propriedades customizadas (Array no Tiled para um Record no JS)
    const customProps = {};
    if (obj.properties) {
      obj.properties.forEach(prop => {
        customProps[prop.name] = prop.value;
      });
    }

    return {
      id: obj.id,
      name: obj.name,
      type: obj.type, // Tipo do objeto definido no Tiled
      x: obj.x,
      y: obj.y,
      width: obj.width,
      height: obj.height,
      rotation: obj.rotation,
      visible: obj.visible,
      properties: customProps, // Acesso via obj.properties["key"]

      // Helper para buscar propriedade com fallback
      getProperty: function(key, defaultValue = null) {
        return this.properties.hasOwnProperty(key) ? this.properties[key] : defaultValue;
      }
    };
  }
}
