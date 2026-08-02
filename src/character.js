/**
 * character.js
 * 
 * Entidade de Personagem baseada em Máquina de Estados.
 * Agora com sistema de colisão AABB integrado.
 */

export class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    
    // Máquina de estados
    this.currentState = "idle";
    
    // Hitbox relativa ao (x,y) (o x,y costuma ser o centro-inferior)
    this.hitbox = {
      offsetX: -10,
      offsetY: -8,
      width: 20,
      height: 8
    };

    // Configurações
    this.speed = 182;
    this.facing = "right"; // "right", "left", "up", "down"
  }

  setState(newState) {
    if (this.currentState !== newState) {
      this.currentState = newState;
    }
  }

  /**
   * Checa colisão entre dois AABBs.
   */
  _checkAABB(x1, y1, w1, h1, x2, y2, w2, h2) {
    return (
      x1 < x2 + w2 &&
      x1 + w1 > x2 &&
      y1 < y2 + h2 &&
      y1 + h1 > y2
    );
  }

  /**
   * Tenta mover para X e Y, deslizando (sliding) caso bloqueado em um eixo.
   */
  move(dx, dy, delta, collisions, mapBounds) {
    if (this.currentState === "sit" || this.currentState === "interact") {
      return; 
    }

    if (dx !== 0 || dy !== 0) {
      this.setState("walk");
      
      // Atualiza direção para eventos/debug
      if (Math.abs(dx) > Math.abs(dy)) {
        this.facing = dx > 0 ? "right" : "left";
      } else {
        this.facing = dy > 0 ? "down" : "up";
      }

      const len = Math.hypot(dx, dy);
      const moveX = (dx / len) * this.speed * (delta / 1000);
      const moveY = (dy / len) * this.speed * (delta / 1000);
      
      // Hitbox dimensions
      const hWidth = this.hitbox.width;
      const hHeight = this.hitbox.height;

      // 1. Resolve X axis
      const nextX = this.x + moveX;
      const hitX = nextX + this.hitbox.offsetX;
      const hitY_forX = this.y + this.hitbox.offsetY;

      let collidesX = false;
      for (const col of collisions) {
        if (this._checkAABB(hitX, hitY_forX, hWidth, hHeight, col.x, col.y, col.width, col.height)) {
          collidesX = true;
          break;
        }
      }

      if (!collidesX) {
        this.x = Math.max(mapBounds.minX, Math.min(mapBounds.maxX, nextX));
      }

      // 2. Resolve Y axis
      const nextY = this.y + moveY;
      // Note que usamos this.x validado para testar Y
      const hitX_forY = this.x + this.hitbox.offsetX; 
      const hitY = nextY + this.hitbox.offsetY;

      let collidesY = false;
      for (const col of collisions) {
        if (this._checkAABB(hitX_forY, hitY, hWidth, hHeight, col.x, col.y, col.width, col.height)) {
          collidesY = true;
          break;
        }
      }

      if (!collidesY) {
        this.y = Math.max(mapBounds.minY, Math.min(mapBounds.maxY, nextY));
      }

    } else {
      this.setState("idle");
    }
  }

  /**
   * Obtém a hitbox atual no mundo.
   */
  getWorldHitbox() {
    return {
      x: this.x + this.hitbox.offsetX,
      y: this.y + this.hitbox.offsetY,
      width: this.hitbox.width,
      height: this.hitbox.height
    };
  }

  /**
   * Retorna um pequeno AABB projetado à frente do jogador para detectar interações.
   */
  getInteractionBox(range = 20) {
    let ix = this.x + this.hitbox.offsetX;
    let iy = this.y + this.hitbox.offsetY;
    let iw = this.hitbox.width;
    let ih = this.hitbox.height;

    switch (this.facing) {
      case "up": iy -= range; break;
      case "down": iy += range; break;
      case "left": ix -= range; break;
      case "right": ix += range; break;
    }

    return { x: ix, y: iy, width: iw, height: ih };
  }

  interact(durationMs, onComplete) {
    this.setState("interact");
    setTimeout(() => {
      this.setState("idle");
      if (onComplete) onComplete();
    }, durationMs);
  }

  toggleSit() {
    this.setState(this.currentState === "sit" ? "idle" : "sit");
  }
}
