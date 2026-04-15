import { cn } from '@/lib/utils'
import styles from './Input.module.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:    string
  hint?:     string
  error?:    string
  required?: boolean
}

export default function Input({
  label,
  hint,
  error,
  required,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={styles.field}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(styles.label, required && styles['label--required'])}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(styles.input, error && styles['input--error'], className)}
        {...props}
      />
      {hint  && !error && <span className={styles.hint}>{hint}</span>}
      {error &&           <span className={styles.error}>{error}</span>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?:    string
  hint?:     string
  error?:    string
  required?: boolean
}

export function Textarea({
  label,
  hint,
  error,
  required,
  className,
  id,
  ...props
}: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={styles.field}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(styles.label, required && styles['label--required'])}
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(styles.input, styles.textarea, error && styles['input--error'], className)}
        {...props}
      />
      {hint  && !error && <span className={styles.hint}>{hint}</span>}
      {error &&           <span className={styles.error}>{error}</span>}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?:    string
  hint?:     string
  error?:    string
  required?: boolean
  children:  React.ReactNode
}

export function Select({
  label,
  hint,
  error,
  required,
  className,
  id,
  children,
  ...props
}: SelectProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={styles.field}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(styles.label, required && styles['label--required'])}
        >
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={cn(styles.input, styles.select, error && styles['input--error'], className)}
        {...props}
      >
        {children}
      </select>
      {hint  && !error && <span className={styles.hint}>{hint}</span>}
      {error &&           <span className={styles.error}>{error}</span>}
    </div>
  )
}
