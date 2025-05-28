import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{email: string, password: string}>) => {
            if(
                process.env.NEXT_PUBLIC_EMAIL === action.payload.email &&
                process.env.NEXT_PUBLIC_PASSWORD === action.payload.password
            ){
                state.isAuthenticated = true
            }
        },
        logout: (state) => {
            state.isAuthenticated = false
        }
    }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer