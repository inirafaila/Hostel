import type { ReactNode } from 'react'
import './PageFrame.css'

interface PageFrameProps {
  children: ReactNode
}

/**
 * PageFrame — the scrollable main content area that hosts all page content.
 * This wraps the router Outlet and provides the base scroll container.
 */
export function PageFrame({ children }: PageFrameProps) {
  return (
    <main className="page-frame" id="main-content">
      {children}
    </main>
  )
}
