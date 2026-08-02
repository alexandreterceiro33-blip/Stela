/**
 * portal.js
 * 
 * Entidade responsável por transições entre mapas.
 * Representa um volume (AABB) invisível no mapa que, ao ser ativado 
 * (por colisão ou interação), dispara o carregamento da próxima região.
 */

export class Portal {
  constructor(x, y, width, height, targetMap, targetSpawn) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    this.targetMap = targetMap;
    this.targetSpawn = targetSpawn;
    
    // Configurações de transição
    this.transitionEffect = "fade";
    this.transitionDuration = 1000;
  }

  /**
   * Checa se um ponto (ex: pés do jogador) colide com a AABB do portal.
   */
  contains(px, py) {
    return px >= this.x && px <= this.x + this.width &&
           py >= this.y && py <= this.y + this.height;
  }
}
