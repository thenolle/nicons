import type React from 'react'

export type IconNodeChild = [
  elementName: string,
  attributes: Record<string, string>,
  children?: IconNodeChild[]
]

export type IconNode = IconNodeChild[]

export interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: number | string
  strokeWidth?: number | string
  absoluteStrokeWidth?: boolean
  className?: string
}

export type Icon = React.ForwardRefExoticComponent<
  Omit<IconProps, 'ref'> & React.RefAttributes<SVGElement>
>