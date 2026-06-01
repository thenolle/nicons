import React from 'react'
import type { Icon, IconNode, IconNodeChild, IconProps } from './types'

const SVG_ATTRIBUTE_MAP: Record<string, string> = {
  'class': 'className',
  'fill-opacity': 'fillOpacity',
  'fill-rule': 'fillRule',
  'clip-path': 'clipPath',
  'clip-rule': 'clipRule',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-opacity': 'strokeOpacity',
  'stroke-miterlimit': 'strokeMiterlimit',
  'font-size': 'fontSize',
  'font-family': 'fontFamily',
  'font-weight': 'fontWeight',
  'text-anchor': 'textAnchor',
  'dominant-baseline': 'dominantBaseline',
  'letter-spacing': 'letterSpacing',
  'word-spacing': 'wordSpacing',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'color-interpolation-filters': 'colorInterpolationFilters',
  'flood-color': 'floodColor',
  'flood-opacity': 'floodOpacity',
  'lighting-color': 'lightingColor',
  'marker-end': 'markerEnd',
  'marker-mid': 'markerMid',
  'marker-start': 'markerStart',
  'paint-order': 'paintOrder',
  'shape-rendering': 'shapeRendering',
  'vector-effect': 'vectorEffect',
  'pointer-events': 'pointerEvents',
  'image-rendering': 'imageRendering',
  'xlink:href': 'href',
  'xmlns:xlink': '_skip',
  'xml:space': 'xmlSpace',
}

function svgAttributeToCamel(attribute: string): string {
  return SVG_ATTRIBUTE_MAP[attribute] ?? attribute
}

function renderNode(node: IconNodeChild, index: number): React.ReactElement {
  const [tag, attrs, children] = node
  const { key, ...rest } = attrs
  const mapped = Object.fromEntries(Object.entries(rest).filter(([key]) => svgAttributeToCamel(key) !== '_skip').map(([key, value]) => [svgAttributeToCamel(key), value]))
  return React.createElement(tag, { key: key ?? index, ...mapped }, ...(children?.map((child, index) => renderNode(child, index)) ?? []))
}

/**
 * Creates a typed React icon component from an `IconNode` tree.
 *
 * @param displayName - The component display name (shown in React DevTools).
 * @param iconNode    - The recursive `[tag, attrs, children?]` tree describing SVG children.
 * @returns A fully typed `Icon` component accepting all `IconProps`.
 *
 * @example
 * ```tsx
 * const _Base = createIcon('Star', [
 *   ['path', { d: 'M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z', key: 'star' }]
 * ])
 *
 * export const Star: Icon = React.forwardRef<SVGSVGElement, IconProps>(
 *   (props, ref) => <_Base ref={ref} {...props} />
 * ) as Icon
 * Star.displayName = 'Star'
 * ```
 */
export function createIcon(displayName: string, iconNode: IconNode): Icon {
  const Component = React.forwardRef<SVGElement, IconProps>(({ size = 24, strokeWidth, absoluteStrokeWidth = false, color, className = '', style, children, viewBox = '0 0 24 24', stroke, fill, ...rest }, ref) => {
    const resolvedStroke = stroke ?? color
    const resolvedStrokeWidth = strokeWidth != null ? absoluteStrokeWidth ? (Number(strokeWidth) * 24) / Number(size) : strokeWidth : undefined
    const svgProps: Record<string, unknown> = { ref, xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox, className, style, ...rest }
    if (resolvedStroke !== undefined) svgProps['stroke'] = resolvedStroke
    if (fill !== undefined) svgProps['fill'] = fill
    if (resolvedStrokeWidth !== undefined) svgProps['strokeWidth'] = resolvedStrokeWidth
    return React.createElement('svg', svgProps, ...iconNode.map((node, index) => renderNode(node, index)), children)
  })
  Component.displayName = displayName
  return Component as unknown as Icon
}