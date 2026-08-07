import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from 'modules/shared/services/supabase/supabaseClient';
import type { Role, City, Arl, Eps, BloodType, NewsType, Dependencia, Holiday } from 'modules/shared/types/database.types';
import type { LoadingStatus } from 'modules/shared/types/common.types';

interface CatalogsState {
  roles: Role[];
  cities: City[];
  arls: Arl[];
  eps: Eps[];
  bloodTypes: BloodType[];
  newsTypes: NewsType[];
  dependencias: Dependencia[];
  holidays: Holiday[];
  status: LoadingStatus;
  error: string | null;
}

const initialState: CatalogsState = {
  roles: [],
  cities: [],
  arls: [],
  eps: [],
  bloodTypes: [],
  newsTypes: [],
  dependencias: [],
  holidays: [],
  status: 'idle',
  error: null,
};

export const fetchAllCatalogs = createAsyncThunk('catalogs/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const [rolesRes, citiesRes, arlsRes, epsRes, bloodTypesRes, newsTypesRes, dependenciasRes, holidaysRes] = await Promise.all([
      supabase.from('adl_roles').select('*').order('name'),
      supabase.from('adl_cities').select('*').order('name'),
      supabase.from('adl_arls').select('*').order('name'),
      supabase.from('adl_eps').select('*').order('name'),
      supabase.from('adl_blood_types').select('*').order('name'),
      supabase.from('adl_news_types').select('*').order('name'),
      supabase.from('adl_dependencias').select('*').order('name'),
      supabase.from('adl_holidays').select('*').order('date'),
    ]);

    if (rolesRes.error) throw rolesRes.error;
    if (citiesRes.error) throw citiesRes.error;
    if (arlsRes.error) throw arlsRes.error;
    if (epsRes.error) throw epsRes.error;
    if (bloodTypesRes.error) throw bloodTypesRes.error;
    if (newsTypesRes.error) throw newsTypesRes.error;
    if (dependenciasRes.error) throw dependenciasRes.error;
    if (holidaysRes.error) throw holidaysRes.error;

    return {
      roles: rolesRes.data as Role[],
      cities: citiesRes.data as City[],
      arls: arlsRes.data as Arl[],
      eps: epsRes.data as Eps[],
      bloodTypes: bloodTypesRes.data as BloodType[],
      newsTypes: newsTypesRes.data as NewsType[],
      dependencias: dependenciasRes.data as Dependencia[],
      holidays: holidaysRes.data as Holiday[],
    };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const catalogsSlice = createSlice({
  name: 'catalogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCatalogs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllCatalogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.roles = action.payload.roles;
        state.cities = action.payload.cities;
        state.arls = action.payload.arls;
        state.eps = action.payload.eps;
        state.bloodTypes = action.payload.bloodTypes;
        state.newsTypes = action.payload.newsTypes;
        state.dependencias = action.payload.dependencias;
        state.holidays = action.payload.holidays;
      })
      .addCase(fetchAllCatalogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default catalogsSlice.reducer;
