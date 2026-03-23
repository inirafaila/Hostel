import { Outlet } from 'react-router-dom'
import { NavRail } from './NavRail'
import { PageFrame } from './PageFrame'
import { OverlayMount } from './OverlayMount'
import './AppShell.css'

/**
 * AppShell — global page frame.
 * Renders the persistent NavRail + scrollable PageFrame.
 * Overlay portal (modals/drawers/panels) is mounted separately via OverlayMount.
 *
 * Layout: CSS Grid — nav column + main content column.
 */
export function AppShell() {
  return (
    <>
      <div className="app-shell">
        <NavRail />
        <PageFrame>
          <Outlet />
        </PageFrame>
      </div>
      <OverlayMount />
    </>
  )
}
