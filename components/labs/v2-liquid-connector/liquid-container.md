# Liquid container (LiquidEject)

Documento de handoff del experimento **liquid eject** en labs: un ancla con un solo SVG path deformable y un anexo DOM que se eyecta hacia arriba con sensación gooey, sin filtro CSS `gooey` / blur de fusión.

**Demo:** [`/labs`](../../../app/labs/page.tsx) → sección “Liquid eject”  
**Código:** [`liquid-eject.tsx`](./liquid-eject.tsx) · [`test-v2.tsx`](./test-v2.tsx) (demo) · [`gooey-path.ts`](./gooey-path.ts)

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
- Tras despegarse, revela contenido: blur 8→0, opacity→1, width/height → `annexWidth`/`annexHeight` (o medido si no se pasan)

### Secuencia pedida (open)

1. **Idle** — ancla como un rect redondeado normal; anexo invisible en el centro
2. **Impulso / windup** — squash del ancla (`scaleY`↓, `scaleX`↑) + hendidura suave en el centro del borde superior del path
3. **Eject + stretch** — el anexo sube *pasando* el flush; el bulto crece en sync y forma un cuello líquido visible (~`STRETCH_GAP` px de aire + embed en el disco)
4. **Detach** — solo cerca del pico del stretch el cuello se corta; squash + spring de rebote en el ancla; el anexo se expande y revela

El color del path y el fondo del disco anexo deben ser **el mismo** para que el cuello se lea continuo.

---

## Qué construimos

### API

Compound component estilo shadcn: root + `Anchor` / `Annex` con props nativas de HTML. `Anchor` y `Annex` son polimórficos (`as` + `asChild` vía `@radix-ui/react-slot`).

```tsx
<LiquidEject
  open={open}
  fill="#1c1c1e"
  radius={18}
  annexSize={40}
  annexWidth={240}
  annexHeight={100}
  clearGap={10}
>
  <LiquidEject.Anchor
    as="button"
    type="button"
    onClick={() => setOpen((v) => !v)}
    aria-expanded={open}
  >
    Now Playing
  </LiquidEject.Anchor>
  <LiquidEject.Annex role="region" aria-label="Details">
    Contenido que se revela al abrir.
  </LiquidEject.Annex>
</LiquidEject>

// o con asChild (el hijo provee el tag)
<LiquidEject.Anchor asChild>
  <a href="/now-playing">Now Playing</a>
</LiquidEject.Anchor>
```

| Prop | Rol |
|------|-----|
| `open` | Dispara open / close |
| `fill` | Color del path SVG y del disco anexo |
| `radius` | Radio del path (no CSS `border-radius` en el ancla) |
| `annexSize` | Diámetro del disco en idle / vuelo (independiente del tamaño abierto) |
| `annexWidth` | Ancho del anexo abierto (px); si falta, se mide el contenido |
| `annexHeight` | Alto del anexo abierto (px); si falta, se mide el contenido |
| `clearGap` | Separación (px) entre bottom del anexo y top del ancla cuando está abierto |
| `speed` | 0→1 mapea a springs (`springFromSpeed`) |
| `as` (Anchor/Annex) | Tag HTML (`div` por defecto); p. ej. `button`, `a`, `section` |
| `asChild` (Anchor/Annex) | Fusiona props en el hijo único vía Radix `Slot` |

Root también acepta `React.ComponentProps<"div">` (`className`, `id`, event handlers, …).

La medición off-screen siempre usa `div` neutros (no `as` / `asChild`) para no distorsionar el tamaño.

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
2. **Eject + stretch** — `annexY → annexLiftY(..., STRETCH_GAP)` (pasado el flush); `topDisplace → neckBulge(STRETCH_GAP)` (puente + embed en el disco); campana más estrecha al crecer
3. **Detach** — cerca del pico (~94% del travel y bulge ≥ 85%); `topDisplace → 0`; squash corto + spring rebote marcado en el ancla
4. **Reveal** — blur 8→0, content opacity→1, size→`annexWidth`/`annexHeight` (o medido), `annexY → annexLiftY(..., clearGap)`

### Close (espejo; se añadió en iteración)

1. **Collapse** — content off, blur in, vuelve a disco; se acerca a `STRETCH_GAP` con bulge de puente
2. **Re-dock** — `detached → false` al reenganchar; asienta a flush con bulge de merge
3. **Retract** — disco + bulto bajan juntos hasta el centro del ancla
4. **Absorb** — anexo opacity→0, path flat, squash + spring de asentamiento

El bulge del cuello de stretch es `STRETCH_GAP + NECK_EMBED`, capado a `annexSize * 1.55`. El `borderRadius` del anexo morphéa pill → radius con el reveal.

`prefers-reduced-motion`: salta al estado final abierto o cerrado.

---

## Iteraciones durante el build

1. **Modelo v2 previo** — había un `GooeyPair` de dos paneles + cintura (`gooeyPairPath`). Se reemplazó por el modelo ancla+anexo de un solo path.
2. **Paso 4 “quién se expande”** — en el brief el expand/blur/opacity se atribuyó al ancla; se interpretó (y confirmó en uso) como el **anexo**. El ancla solo hace squash/rebote.
3. **Animación de cierre** — al principio el close era un fade/shrink corto; se reescribió como espejo del open (collapse → re-dock → retract → absorb).
4. **“Por encima del ancla”** — no era z-index: el travel fijo (~24px) dejaba el anexo solapado. Se calculó lift dinámico para que quede **totalmente arriba en Y**, con `clearGap` al abrir.
5. **Pico en el path** — dent/bulge se veía puntiagudo. Se corrigió con tangente horizontal en el apex y handles más anchos proporcionales a la amplitud.
6. **Cuello corto / detach temprano** — el corte ocurría ~80% del travel a flush (aún solapados), así que nunca se veía stretch. Se añadió fase `STRETCH_GAP` + `NECK_EMBED`, detach ~94%, travel spring más suave y campana más estrecha al estirar.
7. **API shadcn** — se extrajo `liquid-eject.tsx`; Anchor/Annex tipan props nativas HTML y son polimórficos (`as` + `asChild`/`Slot`).

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
| [`liquid-eject.tsx`](./liquid-eject.tsx) | `LiquidEject` compound + springs + polymorphic Anchor/Annex |
| [`test-v2.tsx`](./test-v2.tsx) | Scrub + labs demo |
| [`app/labs/page.tsx`](../../../app/labs/page.tsx) | Monta `LiquidEjectDemo` |

Relacionado: demo en [`app/labs/page.tsx`](../../../app/labs/page.tsx).

---

## Criterio de “se ve bien”

Open legible: idle → squash+hendidura → bulto sync con disco que sube **y estira un cuello** → corte cerca del pico → rebote → reveal blureado.  
Close legible: collapse → reenganche con cuello → flush → bajada conjunta → absorción.  
Scrub de `topDisplace`: campana redonda, sin pico en crest ni valley.
