/**
 * events.js
 * 
 * Registro de scripts assíncronos e cinemáticas que são referenciados
 * pelos dados exportados do Tiled.
 */

import { eventManager } from "./event-manager.js";

eventManager.register("sign_village", async ({ state, showMoment }) => {
  return new Promise(resolve => {
    showMoment(
      "Aviso na Placa", 
      "Bem-vindo à Vila Sunnyside! Tenha cuidado com as pedras no caminho.", 
      resolve
    );
  });
});

eventManager.register("old_man_intro", async ({ state, showMoment }) => {
  return new Promise(resolve => {
    showMoment(
      "Senhor Grisalho", 
      "O clima está ótimo hoje, não acha? O outono traz ventos nostálgicos...", 
      resolve
    );
  });
});
