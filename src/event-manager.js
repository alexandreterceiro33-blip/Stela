/**
 * event-manager.js
 * 
 * Gerenciador de eventos e cinemáticas.
 * Mapas e objetos referenciam IDs de eventos (ex: "observatory_intro").
 * Este sistema intercepta esses IDs e executa as lógicas de gameplay
 * correspondentes de forma isolada.
 */

export class EventManager {
  constructor() {
    this.events = new Map();
    this.activeEvent = null;
  }

  /**
   * Registra a lógica de um evento.
   * @param {string} eventId 
   * @param {function} scriptFn 
   */
  register(eventId, scriptFn) {
    this.events.set(eventId, scriptFn);
  }

  /**
   * Executa um evento, suspendendo controles ou o que o script definir.
   * @param {string} eventId 
   * @param {Object} context - Objeto com referências para game state, player, etc.
   */
  async trigger(eventId, context) {
    if (this.activeEvent) {
      console.warn(`[EventManager] Event already running. Ignoring ${eventId}`);
      return;
    }

    const script = this.events.get(eventId);
    if (!script) {
      console.warn(`[EventManager] Unknown event triggered: ${eventId}`);
      return;
    }

    console.log(`[EventManager] Starting event: ${eventId}`);
    this.activeEvent = eventId;
    
    try {
      await script(context);
    } catch (e) {
      console.error(`[EventManager] Error executing event ${eventId}:`, e);
    } finally {
      console.log(`[EventManager] Completed event: ${eventId}`);
      this.activeEvent = null;
    }
  }
}

// Singleton export
export const eventManager = new EventManager();
