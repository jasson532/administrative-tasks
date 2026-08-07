import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Team } from 'modules/shared/types/database.types';
import type { LoadingStatus } from 'modules/shared/types/common.types';
import { teamsService } from '../services/teams.service';
import type { TeamFormData } from '../types/teams.types';

interface TeamsState {
  teams: Team[];
  status: LoadingStatus;
  error: string | null;
}

const initialState: TeamsState = {
  teams: [],
  status: 'idle',
  error: null,
};

export const fetchTeams = createAsyncThunk('teams/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await teamsService.getAll();
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const createTeam = createAsyncThunk('teams/create', async (data: TeamFormData, { rejectWithValue }) => {
  try {
    return await teamsService.create(data);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const updateTeam = createAsyncThunk(
  'teams/update',
  async ({ id, data }: { id: string; data: Partial<TeamFormData> }, { rejectWithValue }) => {
    try {
      return await teamsService.update(id, data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteTeam = createAsyncThunk('teams/delete', async (id: string, { rejectWithValue }) => {
  try {
    await teamsService.delete(id);
    return id;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.teams.push(action.payload);
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        const index = state.teams.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.teams[index] = action.payload;
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.teams = state.teams.filter((t) => t.id !== action.payload);
      });
  },
});

export default teamsSlice.reducer;
