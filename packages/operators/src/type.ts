export type Colors = 'blue' | 'cyan' | 'purple'

export interface CardItem {
  title: string
  author: string[]
  tag: string[]
  id: string
  desc: string
  link: string
}

export interface OperatorItem {
  title: string
  children: CardItem[]
  color?: Colors
}

export interface Category {
  title: string
  children: CardItem[]
}

export type Data = Category[]
