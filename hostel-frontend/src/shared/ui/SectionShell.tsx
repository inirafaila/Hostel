import type { ReactNode } from 'react'
import './SectionShell.css'

interface SectionShellProps {
  /** Section title (displayed as heading) */
  title?: string
  /** Alert rendered inside the section — for section-level issues */
  alert?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * SectionShell — generic section wrapper.
 * Used to create consistent section structure within detail pages.
 * Includes a slot for section-level alerts (per Page Layout Blueprint alert placement rules).
 * Content is provided by the calling page/workflow.
 */
export function SectionShell({ title, alert, children, className = '' }: SectionShellProps) {
  return (
    <section className={`section-shell ${className}`}>
      {title && <h2 className="section-shell__title">{title}</h2>}
      {alert && <div className="section-shell__alert">{alert}</div>}
      <div className="section-shell__content">{children}</div>
    </section>
  )
}
