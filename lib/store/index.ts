import { configureStore } from '@reduxjs/toolkit';
import localitiesReducer from './localitiesSlice';
import weatherReducer from './weatherSlice';

export const store = configureStore({
  reducer: {
    localities: localitiesReducer,
    weather: weatherReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;