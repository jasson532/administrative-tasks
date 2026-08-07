import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import catalogsReducer from './slices/catalogsSlice';
import workersReducer from 'modules/workers/store/workersSlice';
import teamsReducer from 'modules/teams/store/teamsSlice';
import newsReducer from 'modules/news/store/newsSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    catalogs: catalogsReducer,
    workers: workersReducer,
    teams: teamsReducer,
    news: newsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
