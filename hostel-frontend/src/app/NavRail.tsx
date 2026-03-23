import { NavLink, useLocation } from 'react-router-dom'
import './NavRail.css'

const navItems = [
  { to: '/',            label: 'Dashboard',          icon: '⊞' },
  { to: '/arrivals',    label: 'Arrival Board',       icon: '⤓' },
  { to: '/maintenance', label: 'Maintenance',          icon: '⚙' },
  { to: '/housekeeping',label: 'Housekeeping',         icon: '✦' },
  { to: '/receivables', label: 'Receivables',          icon: '₿' },
  { to: '/expenses',    label: 'Expenses',             icon: '₾' },
  { to: '/inventory',   label: 'Inventory',            icon: '⊟' },
]

/**
 * NavRail — persistent global navigation sidebar.
 * Desktop-first. Contains all top-level route links.
 * Reservation Detail and Stay Detail are accessed via routing from
 * the Arrival Board / Dashboard rather than top-level nav links.
 */
export function NavRail() {
  const { pathname } = useLocation()

  const checkIsActive = (currPath: string, linkTo: string) => {
    if (currPath === linkTo) return true
    if (linkTo === '/') return currPath === '/'
    if (linkTo === '/arrivals' && currPath.startsWith('/reservations')) return true
    if (linkTo === '/inventory' && currPath.startsWith('/stays')) return true
    if (linkTo === '/receivables' && currPath.startsWith('/folios')) return true
    return currPath.startsWith(linkTo)
  }

  return (
    <nav className="nav-rail" aria-label="Main navigation">
      <div className="nav-rail__header">
        <span className="nav-rail__logo">Hostel</span>
        <span className="nav-rail__logo-sub">Management</span>
      </div>

      <ul className="nav-rail__list" role="list">
        {navItems.map(({ to, label, icon }) => (
          <li key={to} className="nav-rail__item">
            <NavLink
              to={to}
              end={to === '/'}
              className={() =>
                `nav-rail__link${checkIsActive(pathname, to) ? ' nav-rail__link--active' : ''}`
              }
              aria-label={label}
            >
              <span className="nav-rail__icon" aria-hidden="true">{icon}</span>
              <span className="nav-rail__label">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="nav-rail__footer">
        <span className="nav-rail__version">MVP · Phase 1</span>
      </div>
    </nav>
  )
}
