import type { ReactNode } from 'react'
import './PageHeader.css'

interface PageHeaderProps {
  title: string
  subtitle?: string
  /** Status badges or tags rendered next to the title */
  badges?: ReactNode
  /** Primary or contextual action(s) for this page — right-aligned */
  actions?: ReactNode
  /** Optional breadcrumb or back-navigation element */
  breadcrumb?: ReactNode
  className?: string
}

/**
 * PageHeader — generic shared page header shell.
 * Covers all three header families from Page Layout Blueprint:
 *  - Family A (Dashboard/Board): title + subtitle + optional actions
 *  - Family B (Record Detail): title + badges + action zone + breadcrumb
 *  - Family C (Review/Confirmation): compact title + record identity
 *
 * Domain context (e.g., reservation ref, stay status badges)
 * is passed in by the calling page/workflow — not computed here.
 */
export function PageHeader({
  title,
  subtitle,
  badges,
  actions,
  breadcrumb,
  className = '',
}: PageHeaderProps) {
  return (
    <header className={`page-header ${className}`}>
      <div className="page-header__top">
        {breadcrumb && (
          <div className="page-header__breadcrumb">{breadcrumb}</div>
        )}
        <div className="page-header__main">
          <div className="page-header__identity">
            <div className="page-header__title-row">
              <h1 className="page-header__title">{title}</h1>
              {badges && <div className="page-header__badges">{badges}</div>}
            </div>
            {subtitle && (
              <p className="page-header__subtitle">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="page-header__actions">{actions}</div>
          )}
        </div>
      </div>
    </header>
  )
}
