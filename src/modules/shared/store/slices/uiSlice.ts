import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  activeModal: string | null;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info' | 'warning' | null;
}

const initialState: UiState = {
  sidebarOpen: true,
  activeModal: null,
  toastMessage: null,
  toastType: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    openModal(state, action: PayloadAction<string>) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },
    showToast(state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' | 'warning' }>) {
      state.toastMessage = action.payload.message;
      state.toastType = action.payload.type;
    },
    clearToast(state) {
      state.toastMessage = null;
      state.toastType = null;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, openModal, closeModal, showToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;
