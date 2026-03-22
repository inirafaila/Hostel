import './PagePlaceholder.css'

interface PagePlaceholderProps {
  pageName: string
  layoutFamily: string
  description: string
}

/**
 * PagePlaceholder — used by Phase 1 page shells to indicate this is a
 * scaffold placeholder awaiting Phase 2 implementation.
 * Lives in pages/_shared/ — it is page-layer utility, NOT shared/ (domain-unaware primitives).
 */
export function PagePlaceholder({ pageName, layoutFamily, description }: PagePlaceholderProps) {
  return (
    <div className="page-placeholder">
      <div className="page-placeholder__badge">Phase 1 Scaffold</div>
      <h2 className="page-placeholder__title">{pageName}</h2>
      <div className="page-placeholder__meta">
        <span className="page-placeholder__label">Layout family:</span>
        <span className="page-placeholder__value">{layoutFamily}</span>
      </div>
      <p className="page-placeholder__description">{description}</p>
      <p className="page-placeholder__note">
        This page will be implemented in Phase 2 or Phase 3. The layout shell
        and architecture boundary are in place.
      </p>
    </div>
  )
}
