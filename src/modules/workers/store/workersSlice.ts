import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Worker } from 'modules/shared/types/database.types';
import type { LoadingStatus } from 'modules/shared/types/common.types';
import { workersService } from '../services/workers.service';
import type { WorkerFormData } from '../types/workers.types';

interface WorkersState {
  workers: Worker[];
  selectedWorker: Worker | null;
  status: LoadingStatus;
  error: string | null;
}

const initialState: WorkersState = {
  workers: [],
  selectedWorker: null,
  status: 'idle',
  error: null,
};

export const fetchWorkers = createAsyncThunk('workers/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await workersService.getAll();
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const createWorker = createAsyncThunk('workers/create', async (data: WorkerFormData, { rejectWithValue }) => {
  try {
    return await workersService.create(data);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const updateWorker = createAsyncThunk(
  'workers/update',
  async ({ id, data }: { id: string; data: Partial<WorkerFormData> }, { rejectWithValue }) => {
    try {
      return await workersService.update(id, data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteWorker = createAsyncThunk('workers/delete', async (id: string, { rejectWithValue }) => {
  try {
    await workersService.delete(id);
    return id;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const workersSlice = createSlice({
  name: 'workers',
  initialState,
  reducers: {
    setSelectedWorker(state, action) {
      state.selectedWorker = action.payload;
    },
    clearSelectedWorker(state) {
      state.selectedWorker = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.workers = action.payload;
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createWorker.fulfilled, (state, action) => {
        state.workers.push(action.payload);
      })
      .addCase(updateWorker.fulfilled, (state, action) => {
        const index = state.workers.findIndex((w) => w.id === action.payload.id);
        if (index !== -1) state.workers[index] = action.payload;
      })
      .addCase(deleteWorker.fulfilled, (state, action) => {
        state.workers = state.workers.filter((w) => w.id !== action.payload);
      });
  },
});

export const { setSelectedWorker, clearSelectedWorker } = workersSlice.actions;
export default workersSlice.reducer;
