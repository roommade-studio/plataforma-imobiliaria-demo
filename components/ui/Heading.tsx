import { cn } from '@/lib/utils'
import styles from './Heading.module.css'

type Tag  = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type Size = 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

interface HeadingProps {
  as?:       Tag
  size?:     Size
  className?: string
  children:  React.ReactNode
}

export default function Heading({ as: Tag = 'h2', size, className, children }: HeadingProps) {
  const visualSize = size ?? Tag
  return (
    <Tag className={cn(styles[`heading--${visualSize}`], className)}>
      {children}
    </Tag>
  )
}
