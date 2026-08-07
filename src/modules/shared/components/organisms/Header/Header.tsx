import { useLocation } from 'react-router-dom';
import { Bell, Search, Menu, Moon, Sun } from 'lucide-react';
import { useAppDispatch, useAppSelector } from 'modules/shared/store/hooks';
import { toggleSidebar } from 'modules/shared/store/slices/uiSlice';
import { useTheme } from 'modules/shared/hooks/useTheme';
import './Header.scss';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/news': 'Novedades',
  '/news/create': 'Nueva Novedad',
  '/workers': 'Trabajadores',
  '/teams': 'Equipos',
  '/catalogs': 'Catálogos',
};

const Header = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const pageTitle = pageTitles[location.pathname] || 'Novedades ADL';
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={`header ${sidebarOpen ? 'header--sidebar-open' : 'header--sidebar-collapsed'}`}>
      <div className="header__left">
        <button className="header__menu-btn" onClick={() => dispatch(toggleSidebar())} aria-label="Abrir menú">
          <Menu size={22} />
        </button>
        <h1 className="header__title">{pageTitle}</h1>
      </div>

      <div className="header__right">
        <div className="header__search">
          <Search size={16} className="header__search-icon" />
          <input type="text" placeholder="Buscar..." className="header__search-input" />
        </div>
        <button className="header__theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button className="header__notification" aria-label="Notificaciones">
          <Bell size={20} />
          <span className="header__notification-badge">3</span>
        </button>
        <div className="header__avatar">
          <span>AD</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
