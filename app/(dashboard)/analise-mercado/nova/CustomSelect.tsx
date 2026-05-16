'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import styles from './CustomSelect.module.css'

export interface SelectOption {
  value: string
  label: string
}

interface Props {
  label:        string
  value:        string
  onChange:     (value: string) => void
  options:      SelectOption[]
  placeholder?: string
  required?:    boolean
}

interface ListPos { top: number; left: number; width: number }

export default function CustomSelect({
  label, value, onChange, options, placeholder = 'Selecione...', required,
}: Props) {
  const [open, setOpen]       = useState(false)
  const [pos,  setPos]        = useState<ListPos>({ top: 0, left: 0, width: 0 })
  const fieldRef              = useRef<HTMLDivElement>(null)
  const triggerRef            = useRef<HTMLButtonElement>(null)
  const selected              = options.find(o => o.value === value)

  /* Close when clicking outside */
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      const target = e.target as Node
      /* ignore clicks on the portal list itself (it has no common ancestor) */
      if (fieldRef.current?.contains(target)) return
      const list = document.getElementById('cs-portal-active')
      if (list?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  function toggle() {
    if (!open && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 4, left: r.left, width: r.width })
    }
    setOpen(p => !p)
  }

  function pick(val: string) {
    onChange(val)
    setOpen(false)
  }

  return (
    <div className={styles.field} ref={fieldRef}>
      <label className={styles.label}>
        {label}{required && <span className={styles.req}> *</span>}
      </label>

      <button
        ref={triggerRef}
        type="button"
        className={cn(styles.trigger, open && styles['trigger--open'])}
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={cn(styles.trigger__text, !selected && styles['trigger__text--empty'])}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={cn(styles.chevron, open && styles['chevron--open'])}
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && createPortal(
        <ul
          id="cs-portal-active"
          className={styles.list}
          role="listbox"
          style={{ top: pos.top, left: pos.left, width: pos.width }}
        >
          {options.map(o => {
            const active = o.value === value
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={active}
                className={cn(styles.option, active && styles['option--active'])}
                onMouseDown={e => { e.preventDefault(); pick(o.value) }}
              >
                <span>{o.label}</span>
                {active && (
                  <svg
                    className={styles.check}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </li>
            )
          })}
        </ul>,
        document.body,
      )}
    </div>
  )
}
