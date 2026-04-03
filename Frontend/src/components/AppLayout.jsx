import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinkClass = ({ isActive }) => `nav-link fw-semibold ${isActive ? 'active text-accent' : 'text-white'}`

export default function AppLayout({ children }) {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary sticky-top">
        <div className="container-fluid px-4">
          <Link className="navbar-brand fw-bold text-accent" to="/">
            HostelFlow
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navBar">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navBar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-2">
              <li className="nav-item"><NavLink className={navLinkClass} to="/">Home</NavLink></li>
              <li className="nav-item"><NavLink className={navLinkClass} to="/dashboard">Dashboard</NavLink></li>
              <li className="nav-item"><NavLink className={navLinkClass} to="/profile">Profile</NavLink></li>
              <li className="nav-item"><NavLink className={navLinkClass} to="/complaints">Complaints</NavLink></li>
            </ul>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {user ? (
                <>
                  <span className="badge badge-accent px-3 py-2">{user.role}</span>
                  <span className="text-light small text-truncate">{user.registrationNumber}</span>
                  <button className="btn btn-outline-light btn-sm" onClick={logout}>Logout</button>
                </>
              ) : (
                <Link className="btn btn-warning btn-sm" to="/auth">Login</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
