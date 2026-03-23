import type { ReactNode } from 'react'
import './SidebarActionRail.css'

export interface SidebarActionSection {
  id: string
  title?: string
  children: ReactNode
}

interface SidebarActionRailProps {
  sections: SidebarActionSection[]
  className?: string
}

/**
 * SidebarActionRail — right-side action column for detail layouts.
 * Accepts sections (primary actions, status, secondary actions, links).
 * Used inside the DetailSidebarLayout sidebar slot.
 *
 * Domain-unaware: section content provided by calling context.
 * Each section is independently grouped with an optional title.
 */
export function SidebarActionRail({ sections, className = '' }: SidebarActionRailProps) {
  return (
    <div className={`sidebar-rail ${className}`}>
      {sections.map(section => (
        <div key={section.id} className="sidebar-rail__section">
          {section.title && (
            <p className="sidebar-rail__section-title">{section.title}</p>
          )}
          <div className="sidebar-rail__section-body">{section.children}</div>
        </div>
      ))}
    </div>
  )
}
