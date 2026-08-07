import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'modules/shared/store';
import MainLayout from 'modules/shared/components/templates/MainLayout/MainLayout';
import DashboardPage from 'modules/dashboard/pages/DashboardPage/DashboardPage';
import NewsListPage from 'modules/news/pages/NewsListPage/NewsListPage';
import NewsPage from 'modules/news/pages/NewsPage/NewsPage';
import WorkersPage from 'modules/workers/pages/WorkersPage/WorkersPage';
import TeamsPage from 'modules/teams/pages/TeamsPage/TeamsPage';
import CatalogsPage from 'modules/catalogs/pages/CatalogsPage/CatalogsPage';
import { ROUTES } from 'modules/shared/constants/routes';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.NEWS} element={<NewsListPage />} />
            <Route path={ROUTES.NEWS_CREATE} element={<NewsPage />} />
            <Route path={ROUTES.WORKERS} element={<WorkersPage />} />
            <Route path={ROUTES.TEAMS} element={<TeamsPage />} />
            <Route path={ROUTES.CATALOGS} element={<CatalogsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
