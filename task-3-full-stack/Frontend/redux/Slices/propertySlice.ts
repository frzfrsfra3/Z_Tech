import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/services/api';

interface PropertyState {
  loading: boolean;
  error: string | null;
  success: boolean; // Add success state
}

const initialState: PropertyState = {
  loading: false,
  error: null,
  success: false, // Initialize success state
};

export const createProperty = createAsyncThunk(
  'properties/createProperty',
  async (payload: { propertyData: any, headers: any }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/properties', payload.propertyData, {
        headers: payload.headers
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create property');
    }
  }
);

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    // Add reset action
    resetPropertyState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false; // Reset success on new submission
      })
      .addCase(createProperty.fulfilled, (state) => {
        state.loading = false;
        state.success = true; // Set success flag
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false; // Ensure success is false on error
      });
  },
});

// Export the reset action
export const { resetPropertyState } = propertySlice.actions;

export default propertySlice.reducer;