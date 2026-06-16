# Mundial 2026 · Fixture

App web premium para visualizar el fixture completo del Mundial FIFA 2026: fase
de grupos (12 grupos, tablas y partidos) y fase eliminatoria (bracket de dos
lados con la Copa del Mundo en el centro). Toda la UI está en español y los
horarios se muestran en hora de Argentina (`America/Argentina/Buenos_Aires`).

## Stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS** — sistema de diseño dark premium con glassmorphism
- **Framer Motion** — microinteracciones y transiciones
- **TanStack Query** — fetching, cache y polling inteligente
- **date-fns + date-fns-tz** — formato de fechas en horario argentino
- **Lucide React** — íconos

## Scripts

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo (http://localhost:5173)
npm run build      # build de producción
npm run preview    # previsualizar el build
npm run gen:data   # regenerar el mock src/data/worldcup-2026.mock.json
```

## Arquitectura

```
src/
├── components/            # Componentes reutilizables (AppShell, HeroHeader,
│                          # MatchCard, StandingsTable, Flag, TrophyCenterpiece…)
├── features/
│   ├── groups/            # GroupsView, GroupCard
│   └── knockout/          # KnockoutBracket, KnockoutRoundColumn, KnockoutMatchCard
├── services/worldCupData/ # Capa de datos desacoplada (adaptadores intercambiables)
├── hooks/                 # useWorldCupData (polling), useOnlineStatus, usePageVisibility
├── types/                 # Modelo de datos del frontend
├── utils/                 # date.ts (TZ Argentina), domain.ts (selectores)
└── data/                  # worldcup-2026.mock.json (fixture de demostración)
```

### Capa de datos

La UI **nunca** tiene datos hardcodeados: consume siempre el
`WorldCupDataService`, que resuelve el proveedor según la configuración:

1. **API real** si `VITE_SPORTS_API_BASE_URL` está definida (`ApiAdapter`).
2. **Mock local** en caso contrario (`MockAdapter`).

Para conectar una API real, copiá `.env.example` a `.env` y completá:

```bash
VITE_SPORTS_API_BASE_URL=https://api.tu-proveedor.com/v3
VITE_SPORTS_API_KEY=tu-api-key
```

Si el proveedor usa otro esquema de respuesta, el único lugar a tocar es
`ApiAdapter.normalize()` — mapeás el payload crudo al modelo `WorldCupData` y
toda la UI sigue funcionando sin cambios. Para agregar un proveedor distinto,
creá una clase que implemente `WorldCupDataAdapter`.

### Polling inteligente

`useWorldCupData` ajusta la frecuencia de refresco automáticamente:

| Situación                | Frecuencia |
| ------------------------ | ---------- |
| Hay partidos en vivo     | 30 s       |
| Sin partidos en vivo     | 5 min      |
| Pestaña oculta           | 10 min     |
| Al volver a la pestaña   | refresco inmediato |

Ante un error de actualización se mantiene la última data válida en pantalla y
se muestra un aviso no intrusivo.

## Estados de UI cubiertos

Loading (skeletons premium), error, vacío, offline (banner), en vivo (badge +
minuto + animación sutil), finalizado (ganador destacado) y partido futuro
(`vs` + fecha/hora). La app no se rompe si faltan estadio, ciudad, resultado o
equipos aún no definidos (placeholders tipo "Ganador Grupo A").

## Asset del trofeo

El bracket usa `/assets/world-cup-trophy.png` si existe; si no, cae
automáticamente al placeholder premium `/assets/world-cup-trophy.svg` (silueta
abstracta). Siempre con `alt="Trofeo de la Copa del Mundo"`.

## Accesibilidad

Contraste AA, navegación por teclado con foco visible, tablas con headers
correctos, banderas con texto alternativo, y la información de clasificación y
estado no depende solo del color (marcadores e íconos además del color).

## Carga manual de resultados (modo predictor)

La app funciona como tu propio **predictor editable**:

- **Cargás los goles** de cada partido de grupo en los inputs de cada card.
- Las **posiciones se recalculan solas** aplicando las reglas oficiales de la
  FIFA (ver `src/utils/standings.ts`):
  1. puntos → 2. diferencia de gol → 3. goles a favor; y si siguen empatados,
  4. puntos / 5. DG / 6. GF en el **enfrentamiento directo** entre los igualados.
- La clasificación se marca sola: **1º y 2º** (directo) + los **8 mejores
  terceros**.
- El **bracket se autocompleta**: mientras un grupo no termina, sus clasificados
  aparecen en **gris (probables, según la posición actual)**; cuando se cargan
  los 3 partidos de cada equipo, quedan **confirmados con su bandera a color**.
- Podés seguir cargando la eliminatoria: los ganadores **se propagan** por las
  llaves (con penales si hay empate).
- Todo se **guarda en `localStorage`**, así que sigue ahí la próxima vez que
  abrís la página. Botón "Reiniciar resultados" para empezar de cero.

Cuando se conecta una API real (`VITE_SPORTS_API_BASE_URL`), esos resultados
llegan automáticamente desde la fuente en vivo.

## Datos

El principio es **no inventar nada**. Lo que muestra el mock es 100% real y
verificable:

- **48 selecciones y 12 grupos**: reales, del sorteo oficial (Washington D.C.,
  5 de diciembre de 2025), con banderas y nombres en español.
- **Enfrentamientos de cada grupo**: reales (round-robin — cada equipo juega
  contra los otros tres).
- **Estructura del torneo y bracket**: real (12 grupos, mejores terceros,
  R32 → R16 → cuartos → semis → final).

Lo que el mock **no** incluye, porque no es verificable sin una fuente en vivo:

- **Marcadores y resultados**: ninguno (no se fabrican).
- **Estado "en vivo"**: ninguno (no se inventa qué se está jugando).
- **Fechas, horarios y sedes exactos**: marcados como "a confirmar".

Todo eso se completa automáticamente al conectar una API real mediante
`VITE_SPORTS_API_BASE_URL` (ver sección _Capa de datos_). La UI ya soporta
marcadores, penales, minuto de juego, estado en vivo y horarios en hora
Argentina en cuanto la fuente los provea.

Fuentes del sorteo:
[FIFA](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/final-draw-results) ·
[ESPN](https://www.espn.com/soccer/story/_/id/48939282/2026-fifa-world-cup-fixtures-results-match-schedule-group-stage-knockout-rounds-bracket)
