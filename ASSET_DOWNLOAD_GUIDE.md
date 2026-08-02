# Asset Download Guide — Stella (Atualizado)

Apenas packs **gratuitos com licença comercial** estão listados aqui.
Packs com versão gratuita restrita a uso não-comercial foram excluídos.

---

## Análise de Licenças

| Pack | Preço | Uso Comercial (grátis) | Decisão |
|---|---|---|---|
| **Sunnyside World** | $0 (name your price) | **SIM** | **BAIXAR** |
| **Mystic Woods** | $0 (name your price) | **NÃO** (só premium) | **EXCLUÍDO** |
| **Sprout Lands UI** | $0 (name your price) | **NÃO** (premium = $3.99) | **EXCLUÍDO** |
| **Rainy Hearts** | Grátis (DaFont) | **SIM** (100% Free) | **BAIXAR** |

> **Nota**: Mystic Woods e Sprout Lands UI oferecem versões gratuitas, mas suas
> licenças restringem uso comercial à versão paga. Como estamos construindo
> um jogo que pode ser vendido, esses packs foram removidos da lista.

---

## Packs para Baixar (2 packs)

### 1. Sunnyside World — PACK ÂNCORA

**Prioridade máxima.** Preenche ~60% da biblioteca visual.

| Campo | Valor |
|---|---|
| Autor | Daniel Diggle |
| URL | https://danieldiggle.itch.io/sunnyside |
| Preço | Gratuito (name your own price, mínimo $0) |
| Licença | Uso livre em projetos comerciais e não-comerciais |
| Restrições | Não revender assets. Não usar para NFTs/IA. |
| Resolução | **16×16** (perfeito para nosso projeto) |
| Avaliação | 4.8/5 (334 avaliações) |
| Tamanho | ~10 MB por arquivo |

**Conteúdo incluído:**
- 20 ações de personagem (idle, walk, run, attack, fish, swim, etc.)
- 7 estilos de cabelo animados
- Tileset completo: terra, falésias, caminhos, água, vegetação, cercas, muros, prédios
- Interiores
- UI: ícones, emotes, barras
- 11 tipos de plantação com 5 estágios de crescimento
- Inimigos: Goblins, Esqueletos
- Autotiles

**Como baixar:**
1. Acesse https://danieldiggle.itch.io/sunnyside
2. Clique em **"Download Now"**
3. Na tela de pagamento, clique **"No thanks, just take me to the downloads"**
4. Baixe **ambos** os arquivos:
   - `Sunnyside_World_ASSET_PACK_V2.1.zip` (10 MB) — Pack principal
   - `Sunnyside World - Human - 4,6,8 way movement - BETA` (404 KB) — Animações extras
5. Extraia para `.asset-staging-20260802/sunnyside_world/`

---

### 2. Rainy Hearts — Fonte Pixel

| Campo | Valor |
|---|---|
| Autor | Camellina |
| URL | https://www.dafont.com/rainy-hearts.font |
| Preço | Gratuito |
| Licença | 100% Free (confirmado pelo autor no DaFont) |
| Tamanho | ~8 KB |
| Uso ideal | Diálogos, textos narrativos, descrições |

**Como baixar:**
1. Acesse https://www.dafont.com/rainy-hearts.font
2. Clique no botão **"Download"** (canto superior direito da preview)
3. Extraia o ZIP — contém `rainyhearts.ttf`
4. Copie `rainyhearts.ttf` para `.asset-staging-20260802/fonts/`

---

## Após baixar

Execute o script de organização para copiar tudo para `assets/`:

```powershell
powershell -ExecutionPolicy Bypass -File tools/organize-assets.ps1
```

> O script vai detectar automaticamente os novos arquivos e organizá-los.

---

## Alternativas gratuitas pesquisadas

Para compensar a exclusão do Mystic Woods e do Sprout Lands UI, podemos usar:

### Para Natureza/Floresta (substituindo Mystic Woods)
- O **Sunnyside World** já inclui vegetação, árvores, e natureza suficiente
- No futuro: pesquisar packs CC0 em https://opengameart.org com tag "16x16 nature"

### Para UI (substituindo Sprout Lands)
- Já temos o **Kenney Pixel UI Pack** (CC0) com 26 elementos organizados
- É funcional o suficiente para MVP. UI customizada pode ser criada depois

### Checklist pós-download
- [ ] Sunnyside World extraído em `.asset-staging-20260802/sunnyside_world/`
- [ ] Rainy Hearts `.ttf` em `.asset-staging-20260802/fonts/`
- [ ] Script de organização executado
- [ ] Verificar pasta `assets/` contém os novos arquivos
