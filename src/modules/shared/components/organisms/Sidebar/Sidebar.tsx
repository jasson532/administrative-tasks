import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, Newspaper, BookOpen, X, Menu } from 'lucide-react';
import { useAppDispatch, useAppSelector } from 'modules/shared/store/hooks';
import { toggleSidebar, setSidebarOpen } from 'modules/shared/store/slices/uiSlice';
import { ROUTES } from 'modules/shared/constants/routes';
import './Sidebar.scss';

const navItems = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { path: ROUTES.NEWS, label: 'Novedades', icon: Newspaper },
  { path: ROUTES.WORKERS, label: 'Trabajadores', icon: Users },
  { path: ROUTES.TEAMS, label: 'Equipos', icon: Building2 },
  { path: ROUTES.CATALOGS, label: 'Catálogos', icon: BookOpen },
];

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  const handleNavClick = () => {
    // Close sidebar on mobile after clicking a link
    if (window.innerWidth <= 768) {
      dispatch(setSidebarOpen(false));
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => dispatch(setSidebarOpen(false))} />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : 'sidebar--collapsed'}`}>
        <div className="sidebar__header">
          <div className="sidebar__brand">
            <div className="sidebar__logo">ADL</div>
            {sidebarOpen && <span className="sidebar__title">Novedades ADL</span>}
          </div>
          <button className="sidebar__toggle" onClick={() => dispatch(toggleSidebar())} aria-label="Toggle sidebar">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              onClick={handleNavClick}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          {sidebarOpen && (
            <p className="sidebar__version">ADL - v1.0.0</p>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
