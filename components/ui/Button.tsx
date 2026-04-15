import Link from 'next/link'
import { cn } from '@/lib/utils'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'tertiary' | 'danger'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?:  Variant
  size?:     Size
  full?:     boolean
  iconOnly?: boolean
  className?: string
  children:  React.ReactNode
}

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    as?: 'button'
    href?: never
  }

type ButtonAsLink = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    as: 'link'
    href: string
  }

type ButtonProps = ButtonAsButton | ButtonAsLink

export default function Button({
  variant  = 'primary',
  size     = 'md',
  full     = false,
  iconOnly = false,
  className,
  children,
  as,
  ...props
}: ButtonProps) {
  const classes = cn(
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    full     && styles['btn--full'],
    iconOnly && styles['btn--icon'],
    className,
  )

  if (as === 'link') {
    const { href, ...linkProps } = props as ButtonAsLink
    return (
      <Link href={href} className={classes} {...(linkProps as Record<string, unknown>)}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
