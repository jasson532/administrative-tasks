import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { News } from 'modules/shared/types/database.types';
import type { LoadingStatus } from 'modules/shared/types/common.types';
import { newsService } from '../services/news.service';
import type { NewsFormData, NewsFilters } from '../types/news.types';

interface NewsState {
  items: News[];
  selectedItem: News | null;
  filters: NewsFilters;
  status: LoadingStatus;
  error: string | null;
}

const initialState: NewsState = {
  items: [],
  selectedItem: null,
  filters: {},
  status: 'idle',
  error: null,
};

export const fetchNews = createAsyncThunk('news/fetchAll', async (filters: NewsFilters | undefined, { rejectWithValue }) => {
  try {
    return await newsService.getAll(filters);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const createNews = createAsyncThunk('news/create', async (data: NewsFormData, { rejectWithValue }) => {
  try {
    return await newsService.create(data);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const updateNews = createAsyncThunk(
  'news/update',
  async ({ id, data }: { id: string; data: Partial<NewsFormData> }, { rejectWithValue }) => {
    try {
      return await newsService.update(id, data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteNews = createAsyncThunk('news/delete', async (id: string, { rejectWithValue }) => {
  try {
    await newsService.delete(id);
    return id;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<NewsFilters>) {
      state.filters = action.payload;
    },
    clearFilters(state) {
      state.filters = {};
    },
    setSelectedItem(state, action: PayloadAction<News | null>) {
      state.selectedItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createNews.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        const index = state.items.findIndex((n) => n.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.items = state.items.filter((n) => n.id !== action.payload);
      });
  },
});

export const { setFilters, clearFilters, setSelectedItem } = newsSlice.actions;
export default newsSlice.reducer;
