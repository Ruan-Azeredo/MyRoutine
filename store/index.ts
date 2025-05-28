import { configureStore } from '@reduxjs/toolkit';
import { dataSlice } from './reducers/data';
import { authSlice } from './reducers/auth';

export const store = configureStore({
    reducer: {
        data: dataSlice.reducer,
        auth: authSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>