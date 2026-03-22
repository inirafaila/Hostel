import { createPortal } from 'react-dom'

/**
 * OverlayMount — portal root for modals, drawers, and panels.
 * Renders into #overlay-root which sits outside #root in index.html,
 * ensuring overlays always stack above all page content.
 *
 * In Phase 2+, an overlay context/provider will be wired here
 * to manage modal/drawer state globally.
 */
export function OverlayMount() {
  const overlayRoot = document.getElementById('overlay-root')
  if (!overlayRoot) return null

  // Placeholder: overlay portal active, ready for modal/drawer content in Phase 2
  return createPortal(null, overlayRoot)
}
