# Stella

Uma vertical slice de jogo indie contemplativo para navegador. Stella é uma caminhada sem combate, pontuação ou falha: a viajante explora cenários, encontra memórias, fotografa paisagens e completa uma constelação.

## Executar

Abra `index.html` com dois cliques em um navegador moderno. Não há dependências, servidor ou serviços externos.

## Controles

- `WASD` ou setas: caminhar
- `E` / `Enter`: interagir com uma memória ou lugar silencioso
- `F`: guardar uma paisagem no álbum
- `Q`: sentar e observar

O som começa apenas após a entrada no mundo, por respeitar a política dos navegadores. O botão no alto à direita alterna o áudio.

## Arquitetura

- `src/config.js`: regiões, memórias e pontos de interação.
- `src/systems.js`: entrada, save local, áudio procedural e partículas.
- `src/renderer.js`: renderização do mundo, parallax, iluminação, cenários e constelação final.
- `src/game.js`: estado, progressão, câmera, interações e UI.

`script.js` é a versão consolidada carregada pelo navegador, criada a partir dos módulos acima para que o jogo também funcione ao abrir o arquivo diretamente.

Os dados de progresso ficam em `localStorage` sob a chave `stella-save-v1`.
