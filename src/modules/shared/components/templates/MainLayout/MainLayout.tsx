import { Outlet } from 'react-router-dom';
import { useAppSelector } from 'modules/shared/store/hooks';
import Sidebar from '../../organisms/Sidebar/Sidebar';
import Header from '../../organisms/Header/Header';
import Toast from '../../molecules/Toast/Toast';
import './MainLayout.scss';

const MainLayout = () => {
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  return (
    <div className="layout">
      <Sidebar />
      <Header />
      <main className={`layout__main ${sidebarOpen ? 'layout__main--sidebar-open' : 'layout__main--sidebar-collapsed'}`}>
        <div className="layout__content">
          <Outlet />
        </div>
      </main>
      <Toast />
    </div>
  );
};

export default MainLayout;
