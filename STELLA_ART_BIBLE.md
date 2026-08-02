# 🎨 STELLA — Art Bible

> **Documento vivo**: Este guia define a identidade visual do Stella.
> Nenhum asset pode ser incorporado ao projeto sem estar de acordo com este documento.
> Última atualização: 2026-08-02

---

## 1. Visão Artística

**Stella** é uma experiência contemplativa sobre caminhar, lembrar e observar. O visual deve transmitir:

- **Calma** — nunca agressivo, nunca apressado
- **Calor** — luzes douradas, pôr do sol eterno, aconchego
- **Natureza viva** — o mundo respira, balança, brilha
- **Nostalgia gentil** — pixel art que lembra um sonho bom
- **Simplicidade elegante** — poucos elementos, todos cuidados

O jogo deve parecer um **abraço visual**. Cada tela poderia ser um papel de parede.

---

## 2. Referências Visuais

### Primárias (estilo-alvo)

| Jogo | O que extrair |
|---|---|
| **Eastward** | Nível de detalhe dos tiles, iluminação volumétrica, paleta quente |
| **Stardew Valley** | Organização de tiles, flora abundante, sensação de "lar" |
| **Spiritfarer** | Atmosfera emocional, cores pastel, relação com personagens |

### Secundárias (atmosfera)

| Jogo | O que extrair |
|---|---|
| **A Short Hike** | Escala íntima, exploração sem pressão, natureza acolhedora |
| **To the Moon** | Narrativa emocional, cenários como extensão do sentimento |
| **Sky: Children of the Light** | Luz como linguagem, sensação de vastidão espiritual |

### O que NÃO é Stella

❌ **Genérico RPG Maker** — tiles planos, repetitivos, sem personalidade  
❌ **Medieval pesado** — armaduras, masmorras, dragões  
❌ **Cartunesco exagerado** — olhos gigantes, proporções extremas  
❌ **Escuro/sombrio** — horror, sangue, ambientes opressivos  
❌ **Sci-fi industrial** — metal, concreto, neon  
❌ **Mobile casual** — estilo Candy Crush, flat design extremo  

---

## 3. Paleta de Cores

### Cores primárias (uso frequente)

| Nome | Hex | Uso |
|---|---|---|
| **Warm Ivory** | `#FFF5E1` | Fundo de luz, partículas douradas |
| **Sunset Gold** | `#F2C970` | Iluminação principal, acentos quentes |
| **Blush Rose** | `#E8A0B4` | Flores, personagem principal, memórias |
| **Moss Green** | `#6B9E7D` | Vegetação principal, grama saudável |
| **Deep Forest** | `#2D5E4A` | Sombras de vegetação, profundidade |
| **Sky Lavender** | `#A8B4D6` | Céu, reflexos na água, UI suave |

### Cores secundárias (uso moderado)

| Nome | Hex | Uso |
|---|---|---|
| **Earth Brown** | `#8B6E5A` | Troncos, caminhos, construções de madeira |
| **Stone Grey** | `#7A7E85` | Pedras, ruínas, montanhas |
| **Ocean Teal** | `#4A8B8C` | Água profunda, lagos |
| **Cloud White** | `#E8E4E0` | Nuvens, neblina, névoa |
| **Night Indigo** | `#1E2140` | Céu noturno, sombras profundas |
| **Firefly Yellow** | `#FFE87C` | Vagalumes, estrelas, brilhos |

### Cores de acento (uso raro, impactante)

| Nome | Hex | Uso |
|---|---|---|
| **Memory Amber** | `#F4A942` | Memórias coletáveis, UI de destaque |
| **Petal Pink** | `#F5C6D0` | Pétalas, partículas suaves |
| **Star Silver** | `#D4D7E2` | Estrelas, constelação final |

### Regras de cor

1. **Jamais usar preto puro** (`#000000`). A sombra mais escura é `#1E2140`.
2. **Jamais usar branco puro** (`#FFFFFF`). O branco mais claro é `#FFF5E1`.
3. **Saturação máxima: 60%** — cores devem ser sempre suaves.
4. **Contraste suave** — transições graduais, sem bordas duras de cor.
5. **A paleta pode variar por bioma**, mas sempre dentro do mesmo espectro quente.

### Variações por bioma

| Região | Dominante | Acento |
|---|---|---|
| **Campo (Meadow)** | Moss Green + Sunset Gold | Blush Rose (flores) |
| **Lago (Lake)** | Ocean Teal + Sky Lavender | Warm Ivory (reflexos) |
| **Floresta (Forest)** | Deep Forest + Moss Green | Firefly Yellow |
| **Montanhas (Train)** | Stone Grey + Sky Lavender | Earth Brown |
| **Biblioteca (Library)** | Earth Brown + Night Indigo | Memory Amber |
| **Jardim (Garden)** | Moss Green + Petal Pink | Star Silver |
| **Observatório** | Night Indigo + Star Silver | Sunset Gold |
| **Colina (Hill)** | Sunset Gold + Moss Green | Blush Rose |
| **Praia (Beach)** | Warm Ivory + Ocean Teal | Cloud White |

---

## 4. Resolução e Escala

### Especificações técnicas

| Parâmetro | Valor |
|---|---|
| **Tile base** | 16×16 pixels |
| **Fator de escala** | 4× |
| **Tile na tela** | 64×64 pixels |
| **Canvas** | 1280×720 (20×11.25 tiles visíveis) |
| **Formato** | PNG com transparência (alpha channel) |
| **Smoothing** | `imageSmoothingEnabled = false` (pixel-perfect) |

### Escala dos elementos

| Elemento | Tamanho em tiles | Pixels (base) | Pixels (tela) |
|---|---|---|---|
| Tile de chão | 1×1 | 16×16 | 64×64 |
| Personagem | 1×1.5 | 16×24 | 64×96 |
| Árvore pequena | 2×3 | 32×48 | 128×192 |
| Árvore grande | 3×4 | 48×64 | 192×256 |
| Casa pequena | 3×3 | 48×48 | 192×192 |
| Construção grande | 5×4 | 80×64 | 320×256 |
| Objeto pequeno (banco) | 1×1 | 16×16 | 64×64 |
| Objeto médio (poço) | 2×2 | 32×32 | 128×128 |

### Regras de escala

1. **Tudo deve caber em múltiplos de 16px** no tamanho base.
2. **Personagens** têm 16px de largura e 24px de altura (1×1.5 tiles).
3. **A câmera nunca faz zoom fracionado** — sempre 4× inteiro.
4. **Objetos nunca ficam "flutuando"** — devem se alinhar à grid.

---

## 5. Estilo de Iluminação

### Filosofia

A luz no Stella é **emocional**, não realista. Ela cria humor, não apenas visibilidade.

### Tipos de iluminação

| Tipo | Descrição | Quando usar |
|---|---|---|
| **Luz ambiente** | Gradiente vertical suave (céu → chão) | Sempre ativo |
| **Luz direcional** | Tom dourado vindo do oeste | Pôr do sol, colina |
| **Luz pontual** | Halo circular suave | Lanternas, velas, vagalumes |
| **Glow** | Brilho difuso ao redor de objetos | Memórias, estrelas |
| **Vignette** | Escurecimento nas bordas da tela | Sempre ativo (sutil) |

### Regras de iluminação

1. **Nunca escurecer demais** — mesmo à "noite", o mundo tem luz suficiente para ser bonito.
2. **A luz quente (dourada/âmbar) domina** — luz fria só em reflexos d'água e céu noturno.
3. **Sombras são coloridas**, não pretas — usar tons de roxo/azul escuro.
4. **Cada bioma tem sua "hora do dia"** definida pela iluminação:
   - Meadow = manhã dourada
   - Forest = fim de tarde esverdeado
   - Beach = amanhecer rosado
   - Observatory = noite estrelada (mas iluminada)

---

## 6. Estilo dos Elementos

### Árvores

- **Copas arredondadas**, nunca pontiagudas (exceto pinheiros).
- **2-3 tons de verde** por copa (base, médio, highlight).
- **Troncos finos**, cor de terra quente.
- **Sway animation** — balanço suave no vento (2-4 frames, loop).
- **Sombra no chão** — elipse escura semitransparente.

### Construções

- **Madeira e pedra** como materiais principais.
- **Telhados inclinados** com 2-3 tons.
- **Janelas iluminadas** (ponto de luz âmbar no interior).
- **Proporções aconchegantes** — construções parecem "abraçáveis".
- **Sem ângulos retos perfeitos** — leve irregularidade orgânica.

### Objetos

- **Detalhados mas legíveis** — cada objeto reconhecível em 16×16.
- **Sombra integrada** ao sprite (não projetada separadamente).
- **Cores harmônicas** com o bioma onde serão usados.
- **Objetos interativos** têm um sutil highlight/outline para feedback visual.

### Água

- **Animada** — mínimo 3 frames de ondulação.
- **Reflexos** via overlay semitransparente (não espelhamento real).
- **Bordas suaves** — transição gradual terra→água.
- **Cor varia por bioma** — teal para lago, azul profundo para oceano, verde-água para rio.

### Flora (flores, arbustos, grama)

- **Flores coloridas** — rosa, amarelo, lavanda (nunca vermelho vivo).
- **Grama animada** — 2 frames de balanço sutil.
- **Variação** — pelo menos 3 variantes de cada tipo de planta.
- **Espalhamento orgânico** — nunca em grid perfeito.

---

## 7. Personagens

### Proportions

- **Head-to-body ratio**: 1:1.5 (cabeça grande, corpo compacto)
- **Olhos simples** — 2 pixels, expressivos pela posição.
- **Sem outline preto grosso** — outline de 1px na cor mais escura do sprite.
- **Paleta limitada** por personagem — máximo 6 cores.

### Animações obrigatórias

| Animação | Frames | FPS |
|---|---|---|
| Idle | 4 | 4 |
| Walk (4 direções) | 6 | 8 |
| Sit | 2 | 2 |
| Interact | 4 | 6 |

### Stella (protagonista)

- **Cabelo**: tom roxo escuro (#49324A)
- **Roupa**: rosa suave (#C8789D)
- **Calça**: azul-escuro (#313046)
- **Pele**: tom pêssego (#F1CAAA)
- **Expressão**: serena, contemplativa — nunca agressiva.

### NPCs

- **Silhueta distinta** de Stella (altura, chapéu, acessório).
- **Paleta harmônica** mas diferente da protagonista.
- **Personalidade visual** — cada NPC é reconhecível mesmo a 16px.

---

## 8. Interface (UI)

### Filosofia

A UI do Stella é **invisível** quando não é necessária. Quando aparece, é **parte da estética**.

### Regras

1. **Mínimo de elementos na tela** — sem HUD permanente.
2. **Caixas de diálogo** com bordas arredondadas, fundo semitransparente escuro.
3. **Fonte pixel** legível — mínimo 8px, idealmente "Rainy Hearts" ou similar.
4. **Cores de UI** seguem a paleta do jogo — nunca cinza puro.
5. **Animação de entrada/saída** — fade + slide suave, nunca popup instantâneo.
6. **Ícones** usam a mesma paleta dos sprites do jogo.
7. **Botões** têm estado hover com leve glow ou mudança de cor.

### Estilo visual da UI

| Elemento | Estilo |
|---|---|
| **Fundo de diálogo** | `#1E2140` com 85% opacidade, borda 1px `#A8B4D6` |
| **Texto principal** | `#FFF5E1` (Warm Ivory) |
| **Texto de acento** | `#F2C970` (Sunset Gold) |
| **Botões** | Fundo `#2D5E4A`, texto `#FFF5E1`, hover: `#6B9E7D` |
| **Ícones** | Sprites 16×16 da paleta do jogo |

---

## 9. Partículas e Efeitos

### Tipos de partículas

| Partícula | Tamanho | Cor | Movimento |
|---|---|---|---|
| **Pétalas** | 2-4px | Blush Rose / Petal Pink | Queda diagonal + balanço |
| **Folhas** | 3-5px | Moss Green / Earth Brown | Queda lenta + rotação |
| **Vagalumes** | 1-2px | Firefly Yellow | Flutuação + pulse de opacidade |
| **Poeira** | 1px | Cloud White (20% opacidade) | Flutuação horizontal |
| **Brilho** | 1-2px | Star Silver / Memory Amber | Flash + fade |
| **Neve** | 1-3px | Cloud White | Queda lenta + drift lateral |
| **Chuva** | 1×4px | Sky Lavender (40% opacidade) | Queda rápida diagonal |
| **Neblina** | Grande overlay | Cloud White (10-15% opacidade) | Drift horizontal lento |

### Regras de efeitos

1. **Partículas são sempre sutis** — nunca dominam a cena.
2. **Máximo 120 partículas** simultâneas por performance.
3. **Parallax** — mínimo 3 camadas (fundo, meio, frente).
4. **Reflexos d'água** — overlay com blend mode e ondulação.
5. **Sombras** — nunca projetadas em tempo real; integradas ao sprite ou elipse simples.

---

## 10. Animação

### Princípios

1. **Tudo que é vivo se move** — água, grama, árvores, personagens.
2. **Lento e suave** — framerate de animação entre 2-8 FPS.
3. **Loops contínuos** — sem paradas bruscas.
4. **Easing natural** — movimentos orgânicos, não lineares.

### Especificações

| Tipo | Frames | FPS | Loop |
|---|---|---|---|
| Água (ondulação) | 3-4 | 4 | Sim |
| Grama (balanço) | 2 | 3 | Sim |
| Árvore (sway) | 4 | 3 | Sim |
| Flor (balanço) | 2-3 | 2 | Sim |
| Personagem idle | 4 | 4 | Sim |
| Personagem walk | 6 | 8 | Sim |
| Vagalume (pulse) | 4 | 6 | Sim |
| UI (fade in) | — | 60 (CSS/code) | Não |

---

## 11. Checklist de Aprovação de Assets

Antes de incorporar qualquer asset ao projeto, verificar:

- [ ] **Estilo**: Combina com as referências visuais (Eastward/Stardew)?
- [ ] **Paleta**: Cores dentro do espectro definido neste documento?
- [ ] **Resolução**: Base 16×16 (ou múltiplo)?
- [ ] **Escala**: Proporções compatíveis com os outros assets?
- [ ] **Formato**: PNG com transparência?
- [ ] **Outline**: Sem outline preto grosso (1px na cor mais escura)?
- [ ] **Iluminação**: Integrada ou compatível com o sistema de luz?
- [ ] **Licença**: CC0, MIT, ou comercial clara?
- [ ] **Consistência**: Ao lado de outros assets do projeto, parece do mesmo jogo?

**Se qualquer item falhar, o asset é descartado.**

---

## 12. Nomenclatura de Arquivos

### Padrão

```
[categoria]_[subcategoria]_[nome]_[variante]_[frame].png
```

### Exemplos

```
tile_grass_base_01.png
tile_grass_flowers_02.png
tree_oak_summer_01.png
char_stella_walk_right_01.png
char_stella_walk_right_02.png
obj_bench_wooden_01.png
ui_dialog_box_default.png
particle_petal_pink_01.png
sfx_footstep_grass_01.ogg
```

### Regras

1. **Tudo em snake_case minúsculo**.
2. **Sem espaços, acentos ou caracteres especiais**.
3. **Frames numerados com 2 dígitos** (01, 02, ...).
4. **Variantes numeradas** quando houver alternativas visuais.
5. **Prefixo indica categoria** (tile_, char_, obj_, ui_, particle_, sfx_, music_).
