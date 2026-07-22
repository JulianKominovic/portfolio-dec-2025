# Liquid container (LiquidEject)

Documento de handoff del experimento **liquid eject** en labs: un ancla con un solo SVG path deformable y un anexo DOM que se eyecta hacia arriba con sensación gooey, sin filtro CSS `gooey` / blur de fusión.

**Demo:** [`/labs`](../../../app/labs/page.tsx) → sección “Liquid eject”  
**Código:** [`test-v2.tsx`](./test-v2.tsx) · [`gooey-path.ts`](./gooey-path.ts)

---

## Pedido inicial

Construir un efecto liquid/gooey **solo con SVG** (un path fill plano), compuesto por dos piezas:

### 1. Base / ancla

- `div` transparente, `position: relative`
- Sin border, outline, shadows, filter ni backdrop-filter (romperían la ilusión)
- SVG absoluto `inset-0` (con overflow visible hacia arriba) que ocupa todo el ancla
- Un solo `<path>` de color plano; el `border-radius` se traduce al atributo `d`
- Es la pieza que más se anima: impulso, hendidura, bulto/cuello, retracción y rebote

### 2. Componente anexo

- Cualquier React/HTML hijo, inicialmente compacto (disco ~40px), `opacity: 0`, `overflow: hidden`
- Parte desde el centro del ancla y se despliega **hacia arriba en el eje Y**
- Tras despegarse, revela contenido: blur 8→0, opacity→1, width/height → target medido

### Secuencia pedida (open)

1. **Idle** — ancla como un rect redondeado normal; anexo invisible en el centro
2. **Impulso / windup** — squash del ancla (`scaleY`↓, `scaleX`↑) + hendidura suave en el centro del borde superior del path
3. **Eject** — el anexo sube; la hendidura se invierte en un bulto que crece en sync (cuello visual)
4. **Detach** — al quedar el anexo claro del ancla, el cuello se corta rápido (top flat de nuevo); squash + spring de rebote en el ancla; el anexo se expande y revela

El color del path y el fondo del disco anexo deben ser **el mismo** para que el cuello se lea continuo.

---

## Qué construimos

### API

```tsx
<LiquidEject open={open} fill="#1c1c1e" radius={18} annexSize={40} clearGap={10}>
  <LiquidEject.Anchor>Now Playing</LiquidEject.Anchor>
  <LiquidEject.Annex>
    Contenido que se revela al abrir.
  </LiquidEject.Annex>
</LiquidEject>
```

| Prop | Rol |
|------|-----|
| `open` | Dispara open / close |
| `fill` | Color del path SVG y del disco anexo |
| `radius` | Radio del path (no CSS `border-radius` en el ancla) |
| `annexSize` | Diámetro del disco en idle / vuelo |
| `clearGap` | Separación (px) entre bottom del anexo y top del ancla cuando está abierto |
| `speed` | 0→1 mapea a springs (`springFromSpeed`) |

`LiquidEjectScrub` + demo permiten inspeccionar `topDisplace` sin spring.

### Path: `anchorSurfacePath`

En [`gooey-path.ts`](./gooey-path.ts):

- `topDisplace === 0` → `roundedRectPath` (idle)
- `topDisplace < 0` → **hendidura** (apex más abajo en el centro del top)
- `topDisplace > 0` → **bulto** (apex más arriba; overflow por encima del box)

La campana usa dos cúbicas shoulder→apex→shoulder con **tangente horizontal en el crest/valley** (handles en `y = apexY`), para que no se lea como pico afilado. Los handles horizontales crecen con la amplitud.

### Posición del anexo en Y

`annexY` es el offset del **centro** del anexo respecto al centro del ancla (negativo = arriba).

```ts
annexLiftY(anchorH, annexH, gap) = -(anchorH / 2 + annexH / 2 + gap)
```

Con eso, el borde inferior del anexo queda exactamente `gap` px por encima del borde superior del ancla. Al expandir el anexo en el reveal, se anima también `annexY` para que el bottom se mantenga estacionado arriba (no crezca hacia abajo metiéndose en el ancla).

### z-index

- Mientras está “conectado” (`detached === false`): anexo **detrás** del ancla (`zIndex: 0`), ancla `1`
- Tras detach: anexo delante (`zIndex: 2`) para el reveal

---

## Timeline de animación

### Open

1. **Windup (~150ms)** — squash + dent (`topDisplace → -8`) + disco anexo visible
2. **Eject** — `annexY → annexLiftY(..., 0)` (flush con el top del ancla); `topDisplace` crece en sync (bulto/cuello)
3. **Detach** — `topDisplace → 0` rápido; squash corto + spring rebote marcado en el ancla
4. **Reveal** — blur 8→0, content opacity→1, size→medido, `annexY → annexLiftY(..., clearGap)`

### Close (espejo; se añadió en iteración)

1. **Collapse** — content off, blur in, vuelve a disco; permanece arriba
2. **Re-dock** — bulto del SVG crece hasta el disco; `detached → false`
3. **Retract** — disco + bulto bajan juntos hasta el centro del ancla
4. **Absorb** — anexo opacity→0, path flat, squash + spring de asentamiento

`prefers-reduced-motion`: salta al estado final abierto o cerrado.

---

## Iteraciones durante el build

1. **Modelo v2 previo** — había un `GooeyPair` de dos paneles + cintura (`gooeyPairPath`). Se reemplazó por el modelo ancla+anexo de un solo path.
2. **Paso 4 “quién se expande”** — en el brief el expand/blur/opacity se atribuyó al ancla; se interpretó (y confirmó en uso) como el **anexo**. El ancla solo hace squash/rebote.
3. **Animación de cierre** — al principio el close era un fade/shrink corto; se reescribió como espejo del open (collapse → re-dock → retract → absorb).
4. **“Por encima del ancla”** — no era z-index: el travel fijo (~24px) dejaba el anexo solapado. Se calculó lift dinámico para que quede **totalmente arriba en Y**, con `clearGap` al abrir.
5. **Pico en el path** — dent/bulge se veía puntiagudo. Se corrigió con tangente horizontal en el apex y handles más anchos proporcionales a la amplitud.

---

## Restricciones visuales (no romper)

En el **ancla** no usar:

- `border` / `outline`
- `box-shadow`
- `filter` / `backdrop-filter`
- `border-radius` como única fuente de forma (la forma vive en el SVG `d`)

El contenido del ancla (texto/icono) va en un layer encima del SVG.

---

## Archivos

| Archivo | Qué hace |
|---------|----------|
| [`gooey-path.ts`](./gooey-path.ts) | `roundedRectPath`, `anchorSurfacePath`, (legacy) `gooeyPairPath` |
| [`test-v2.tsx`](./test-v2.tsx) | `LiquidEject`, scrub, demo, springs |
| [`app/labs/page.tsx`](../../../app/labs/page.tsx) | Monta `LiquidEjectDemo` |

Relacionado: demo en [`app/labs/page.tsx`](../../../app/labs/page.tsx).

---

## Criterio de “se ve bien”

Open legible: idle → squash+hendidura → bulto sync con disco que sube **hasta quedar claro del ancla** → corte de cuello → rebote → reveal blureado.  
Close legible: collapse arriba → reenganche → bajada conjunta → absorción.  
Scrub de `topDisplace`: campana redonda, sin pico en crest ni valley.
