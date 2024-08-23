import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface WeatherResponse {
  status: number;
  message: string;
  device_type: number;
  locality_weather_data: {
    temperature: number;
    humidity: number;
    wind_speed: number;
    wind_direction: number;
    rain_intensity: number;
    rain_accumulation: number;
  };
}

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (localityId: string) => {
    const options = {
      method: 'GET',
      url: 'https://www.weatherunion.com/gw/weather/external/v0/get_locality_weather_data',
      params: { locality_id: localityId },
      headers: { 'X-Zomato-Api-Key': `${apiKey}` },
    };

    try {
      const response = await axios.request<WeatherResponse>(options);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred');
    }
  }
);

interface WeatherState {
  data: WeatherResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  data: null,
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export default weatherSlice.reducer;