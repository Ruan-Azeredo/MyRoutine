import { configureStore } from '@reduxjs/toolkit';
import { dataSlice } from './reducers/data';

export const store = configureStore({
    reducer: {
        data: dataSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>