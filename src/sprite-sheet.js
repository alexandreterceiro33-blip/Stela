/**
 * sprite-sheet.js
 * 
 * Abstração pura de dados (Handle) para spritesheets.
 * Permite que o Renderer desenhe frames específicos sem precisar 
 * calcular dimensões da imagem, slices ou fps.
 * 
 * ECS Friendly: Um SpriteComponent seguraria uma referência para esta classe.
 */

export class SpriteSheet {
  /**
   * @param {string} id - O identificador único (ex: "player.idle")
   * @param {HTMLImageElement} image - A imagem carregada
   * @param {number} frameCount - Total de frames horizontais (strips)
   * @param {number} fps - Velocidade de animação
   * @param {boolean} loop - Se a animação se repete
   */
  constructor(id, image, frameCount = 1, fps = 10, loop = true) {
    this.id = id;
    this.image = image;
    this.frameCount = frameCount;
    this.fps = fps;
    this.loop = loop;
    
    this.sourceWidth = image.width;
    this.sourceHeight = image.height;
    
    if (frameCount === 0) {
      // 0 é a flag para Tileset (Grid 2D de 16x16)
      this.isTileset = true;
      this.frameWidth = 16;
      this.frameHeight = 16;
      this.cols = Math.floor(this.sourceWidth / 16);
    } else {
      this.isTileset = false;
      this.frameWidth = this.sourceWidth / Math.max(1, frameCount);
      this.frameHeight = this.sourceHeight;
    }
  }

  /**
   * Obtém o índice do frame baseado no tempo do jogo.
   * Útil para o Character AnimationComponent.
   * @param {number} time - Tempo decorrido (em ms)
   * @returns {number} O índice do frame atual
   */
  getFrameIndex(time) {
    if (this.frameCount <= 1) return 0;
    
    // Converter time (ms) para segundos e multiplicar pelo fps
    const rawFrame = (time / 1000) * this.fps;
    
    if (this.loop) {
      return Math.floor(rawFrame % this.frameCount);
    } else {
      return Math.min(Math.floor(rawFrame), this.frameCount - 1);
    }
  }

  /**
   * Função utilitária para o Renderer desenhar um frame da SpriteSheet.
   * O Renderer apenas repassa as coordenadas de mundo e o frameIndex calculado.
   */
  drawFrame(ctx, x, y, width, height, frameIndex = 0) {
    let sx, sy;

    if (this.isTileset) {
      sx = (frameIndex % this.cols) * this.frameWidth;
      sy = Math.floor(frameIndex / this.cols) * this.frameHeight;
    } else {
      const safeFrame = Math.max(0, Math.min(frameIndex, this.frameCount - 1));
      sx = safeFrame * this.frameWidth;
      sy = 0;
    }
    
    ctx.drawImage(
      this.image, 
      sx, sy, this.frameWidth, this.frameHeight, // Source Rect
      x, y, width, height                       // Dest Rect
    );
  }
}
