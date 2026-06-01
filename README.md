# nicons

> Typed React SVG icon components. "bring your own icons."

`nicons` provides the primitive to build and ship your own fully typed, tree-shaken React icon components. No bundled icons (yet). No opinions on what your icons look like. This is just the infrastructure to build your own icon library.

## Installation

```bash
npm install nicons
# pnpm add nicons
# yarn add nicons
# bun add nicons
```

**Peer dependency:** React 17 or later.

---

## Quick start

1. Define an icon
```tsx
// src/icons/france-flag.tsx
import React from 'react'
import { createIcon } from 'nicons'
import type { Icon, IconNode, IconProps } from 'nicons'

/**
 * @component @name FranceFlag
 * @description French tricolour flag icon component.
 * @param {Object} props - Icon props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 */
export const __iconNode: IconNode = [
  ['path', { fill: '#000091', d: 'M0 0h213.3v480H0z',     key: 'fr-blue'  }],
  ['path', { fill: '#fff',    d: 'M213.3 0h213.4v480H213.3z', key: 'fr-white' }],
  ['path', { fill: '#e1000f', d: 'M426.7 0H640v480H426.7z',   key: 'fr-red'   }],
]

const _Base = createIcon('FranceFlag', __iconNode)

export const FranceFlag: Icon = React.forwardRef<SVGSVGElement, IconProps>(
  (props, ref) => <_Base ref={ref} viewBox='0 0 640 480' stroke='none' {...props} />
) as Icon
FranceFlag.displayName = 'FranceFlag'

export { FranceFlag as default, FranceFlag as FranceFlagIcon }
```
2. Use it
```tsx
import { FranceFlag } from './icons/france-flag'

export function App() {
  return (
    <div>
      <FranceFlag size={48} />
      <FranceFlag size={24} className='opacity-60' />
    </div>
  )
}
```

---

## API

`createIcon(displayName, iconNode)`  
Creates a typed React Icon component from an IconNode tree.
```ts
import { createIcon } from 'nicons'

const _Base = createIcon('MyIcon', iconNode)
```

| Parameter     | Type       | Description                                   |
| ------------- | ---------- | --------------------------------------------- |
| `displayName` | `string`   | Name shown in React DevTools                  |
| `iconNode`    | `IconNode` | Recursive `[tag, attrs, children?]` node tree |

Returns an `Icon`, a `React.ForwardRefExoticComponent` accepting all `IconProps`.

---

`IconProps`

Every icon component accepts all standard `SVGAttributes<SVGElement>` plus these extras:
| Prop                  | Type               | Default | Description                                                                                            |
| --------------------- | ------------------ | ------- | ------------------------------------------------------------------------------------------------------ |
| `size`                | `number \| string` | `24`    | Sets both `width` and `height` on the SVG                                                              |
| `strokeWidth`         | `number \| string` | —       | SVG stroke width                                                                                       |
| `absoluteStrokeWidth` | `boolean`          | `false` | When `true`, scales stroke width relative to a 24px base so it stays visually consistent at any `size` |
| `className`           | `string`           | `''`    | CSS class applied to the `<svg>` element                                                               |
| `color`               | `string`           | —       | Shorthand for `stroke`                                                                                 |

All other standard SVG props (`fill`, `stroke`, `style`, `viewBox`, `aria-*`, `data-*`, etc.) pass through unchanged.

---

### `IconNode`

The recursive node tree type used to describe SVG children:

```ts
type IconNodeChild = [
  elementName: string,
  attributes: Record<string, string>,
  children?: IconNodeChild[]
]

type IconNode = IconNodeChild[]
```

Each tuple is `[tagName, attrs, optionalChildren]`. The `key` attribute in `attrs` is used as the React element key — always include it for stable rendering.

```ts
const iconNode: IconNode = [
  ['circle', { cx: '12', cy: '12', r: '10', key: 'circle' }],
  ['path',   { d: 'M12 8v4l3 3', key: 'path', 'stroke-linecap': 'round' }],
]
```

Hyphenated SVG attributes (`stroke-linecap`, `fill-rule`, `clip-path`, etc.) are automatically converted to their camelCase React equivalents.

---

### Types

```ts
import type { Icon, IconNode, IconNodeChild, IconProps } from 'nicons'
```

| Type            | Description                                |
| --------------- | ------------------------------------------ |
| `IconNodeChild` | Single `[tag, attrs, children?]` tuple     |
| `IconNode`      | Array of `IconNodeChild`                   |
| `IconProps`     | All props accepted by every icon component |
| `Icon`          | The typed `forwardRef` component shape     |

---

## Patterns

### Stroke-based icon (e.g. Lucide-style)

```tsx
import React from 'react'
import { createIcon } from 'nicons'
import type { Icon, IconNode, IconProps } from 'nicons'

export const __iconNode: IconNode = [
  ['circle', { cx: '12', cy: '12', r: '10', key: 'circle' }],
  ['line',   { x1: '12', y1: '8', x2: '12', y2: '12', key: 'line-v' }],
  ['line',   { x1: '12', y1: '16', x2: '12.01', y2: '16', key: 'line-h' }],
]

const _Base = createIcon('AlertCircle', __iconNode)

export const AlertCircle: Icon = React.forwardRef<SVGSVGElement, IconProps>(
  (props, ref) => (
    <_Base
      ref={ref}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    />
  )
) as Icon
AlertCircle.displayName = 'AlertCircle'

export { AlertCircle as default, AlertCircle as AlertCircleIcon }
```

### Fill-based icon (e.g. flag, logo)

```tsx
const _Base = createIcon('FranceFlag', __iconNode)

export const FranceFlag: Icon = React.forwardRef<SVGSVGElement, IconProps>(
  (props, ref) => <_Base ref={ref} viewBox='0 0 640 480' stroke='none' {...props} />
) as Icon
```

### Nested children

```tsx
export const __iconNode: IconNode = [
  ['defs', { key: 'defs' }, [
    ['linearGradient', { id: 'grad', key: 'grad' }, [
      ['stop', { offset: '0%',   'stop-color': '#ff6b6b', key: 'stop-0' }],
      ['stop', { offset: '100%', 'stop-color': '#feca57', key: 'stop-1' }],
    ]],
  ]],
  ['circle', { cx: '12', cy: '12', r: '10', fill: 'url(#grad)', key: 'circle' }],
]
```

### `absoluteStrokeWidth`

When rendering at non-standard sizes, set `absoluteStrokeWidth` to keep the stroke visually proportional:

```tsx
<MyIcon size={48} strokeWidth={2} absoluteStrokeWidth />
// stroke-width resolves to (2 * 24) / 48 = 1 — same visual weight as size=24 strokeWidth=2
```

---

## Generating icons

The [SVG Icon Maker](https://thenolle.github.io/nicons) tool converts any `.svg` file into a `nicons`-compatible `.tsx` component automatically, including `viewBox` detection, `stroke`/`fill` mode detection, and correct `key` attributes.

---

## Tree-shaking

Each icon is a standalone ES module. Bundlers (Vite, Rollup, webpack 5+) will only include icons you actually import. The `sideEffects: false` field in `package.json` guarantees dead-code elimination.

---

## License

[MIT](LICENSE) © Nolly

> Protect them dolls 🏳️‍⚧️