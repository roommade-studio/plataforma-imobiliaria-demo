'use client'

import styles from './ProgressRing.module.css'

interface ProgressRingProps {
  value:      number   // 0–100
  size?:      number   // px, default 80
  stroke?:    number   // px, default 8
  label?:     string
  sublabel?:  string
  color?:     string   // CSS var or hex, default uses --btn-primary-background
}

export default function ProgressRing({
  value,
  size   = 80,
  stroke = 8,
  label,
  sublabel,
  color,
}: ProgressRingProps) {
  const r       = (size - stroke) / 2
  const circ    = 2 * Math.PI * r
  const offset  = circ - (Math.min(Math.max(value, 0), 100) / 100) * circ
  const cx      = size / 2

  return (
    <div className={styles.ring} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {/* Track */}
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke="var(--card-border)"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke={color ?? 'var(--btn-primary-background)'}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cx})`}
          className={styles.ring__arc}
        />
      </svg>
      {(label || sublabel) && (
        <div className={styles.ring__center}>
          {label    && <span className={styles.ring__label}>{label}</span>}
          {sublabel && <span className={styles.ring__sublabel}>{sublabel}</span>}
        </div>
      )}
    </div>
  )
}
