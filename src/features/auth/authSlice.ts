import {createSlice} from "@reduxjs/toolkit";
import {signUp, signIn, getProfile, logOut, initializeAuth} from "@/features/auth/authThunks.ts";

const initialState = {
  profile: {
    username: '',
    email: '',
    phoneNumber: ''
  },
  error: null,
  tokens: {},
  isLoading: true,
  isLogin: false,
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
    builder.addCase(signIn.fulfilled, (state,action) => {
      state.tokens = action.payload
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
      state.profile = action.payload
      state.error = null
      state.isLoading = false
      state.isLogin = true
    })
    builder.addCase(getProfile.rejected, (state, action) => {
      state.error = action.payload
      state.isLoading = false
    })
    builder.addCase(logOut.fulfilled, (state) => {
      state.error = null
      state.isLogin = false
      state.profile = { username: '', email: '', phoneNumber: '' }
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
