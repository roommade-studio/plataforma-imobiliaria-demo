'use client'

import { useEffect } from 'react'
import ReactDOM from 'react-dom'
import styles from './Modal.module.css'

interface ModalProps {
  isOpen:      boolean
  onClose:     () => void
  title:       string
  children:    React.ReactNode
  footer?:     React.ReactNode
  maxWidth?:   string
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '32rem',
}: ModalProps) {
  /* Lock body scroll when open */
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  /* Close on Escape */
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null
  if (typeof document === 'undefined') return null

  const content = (
    <div
      className={styles.overlay}
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{ '--modal-max-width': maxWidth } as React.CSSProperties}
      >
        {/* Header */}
        <div className={styles.modal__header}>
          <h2 id="modal-title" className={styles.modal__title}>{title}</h2>
          <button
            type="button"
            className={styles.modal__close}
            onClick={onClose}
            aria-label="Fechar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6"  y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.modal__body}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={styles.modal__footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  return ReactDOM.createPortal(content, document.body)
}
