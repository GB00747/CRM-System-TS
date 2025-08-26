import {createSlice} from "@reduxjs/toolkit";
import {
  getProfile,
  initializeAuth,
  logOut,
  signIn,
  signUp,
  updateProfile
} from "@/features/auth/authThunks.ts";
import {Profile} from "@/features/auth/authTypes.ts";

interface AuthState {
  error: string | null;
  isLoading: boolean;
  isLogin: boolean;
  user: Profile | null
}

const initialState: AuthState = {
  error: null,
  isLoading: true,
  isLogin: false,
  user: null,
}


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(signUp.fulfilled, (state) => {
      state.error = null
    })
    builder.addCase(signUp.rejected, (state,action) => {
      state.error = action.payload
    })
    builder.addCase(signIn.fulfilled, (state) => {
      state.isLogin = true
      state.error = null
    })
    builder.addCase(signIn.rejected, (state, action) => {
      state.error = action.payload
    })
    builder.addCase(getProfile.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.user = action.payload
      state.error = null
      state.isLoading = false
      state.isLogin = true
    })
    builder.addCase(getProfile.rejected, (state, action) => {
      state.error = action.payload
      state.isLoading = false
    })
    builder.addCase(updateProfile.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.user = action.payload
      state.error = null
      state.isLoading = false
    })
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.error = action.payload
      state.isLoading = false
    })
    builder.addCase(logOut.fulfilled, (state) => {
      state.error = null
      state.isLogin = false
      state.user = null
    })
    builder.addCase(initializeAuth.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(initializeAuth.fulfilled, (state) => {
      state.isLoading = false
      state.error = null
      state.isLogin = true
    })
    builder.addCase(initializeAuth.rejected, (state, action) => {
      state.error = action.payload
      state.isLoading = false
      state.isLogin = false
    })
  }
})


export const {clearAuthError} = authSlice.actions

export default authSlice.reducer
