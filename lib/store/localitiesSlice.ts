import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Locality {
  cityName: string;
  localityName: string;
  localityId: string;
  latitude: number;
  longitude: number;
  device_type: string;
}

export const fetchLocalities = createAsyncThunk('localities/fetchLocalities', async () => {
  const response = await axios.get<Locality[]>('/api/localities');
  return response.data;
});

interface LocalitiesState {
  data: Locality[];
  loading: boolean;
  error: string | null;
}

const initialState: LocalitiesState = {
  data: [],
  loading: false,
  error: null,
};

const localitiesSlice = createSlice({
  name: 'localities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocalities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLocalities.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchLocalities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export default localitiesSlice.reducer;