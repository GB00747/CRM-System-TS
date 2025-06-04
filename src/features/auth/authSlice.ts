import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "@/api/authApi";
import {
  AuthData,
  UserResponse,
  UserRegistration,
  Token,
} from "@/features/auth/authTypes";


interface AuthState {
  user: UserResponse | null;
  error: string ;
  status: "idle" | "success" | "error";
}

const initialState: AuthState = {
  user: null,
  error: '',
  status: 'idle',
};


export const register = createAsyncThunk<UserResponse,UserRegistration,{ rejectValue: string } >(
  "auth/register",
  async (data, {rejectWithValue}) => {
    try {
      return await authApi.register(data);

    } catch (error: any) {
      if (!error.response) {
        return rejectWithValue("Сервер недоступен. Попробуйте позже.");
      }
      const status = error.response.status;

      switch (status) {
        case 400:
          return rejectWithValue("Проверьте корректность заполнения полей.");
        case 409:
          return rejectWithValue("Пользователь с таким логином или email уже существует.");
        case 422:
          return rejectWithValue("Некорректные данные. Проверьте формат ввода.");
        case 500:
          return rejectWithValue("На сервере произошла ошибка. Повторите позже.");
        default:
          return rejectWithValue(error.response.data?.message || "Ошибка регистрации.");
      }
    }
  }
);



export const login = createAsyncThunk<Token, AuthData, { rejectValue: string } >(
  "auth/login",
  async (data, {rejectWithValue}) => {
    try {
      const tokens = await authApi.login(data);
      const {accessToken, refreshToken} = tokens

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      return tokens;

    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Ошибка входа");
    }
  }
);


export const getProfile = createAsyncThunk<UserResponse, void, { rejectValue: string }>(
  "auth/getProfile",
  async (_, {rejectWithValue}) => {
    try {
      return await authApi.getProfile()
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Ошибка получения данных пользователя");
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      localStorage.setItem("accessToken", action.payload);
      state.status = "success";
    },
    logout(state) {
      state.user = null;
      state.status = "idle";
      state.error = '';
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.error = '';
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload ?? "Неизвестная ошибка регистрации.";
      })


      .addCase(login.fulfilled, (state) => {
        state.error = '';
        state.status = 'success'
      })


      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.error = action.payload ?? 'Неизвестная ошибка при получении профиля'
      })
  },
});

export const {setAccessToken, logout} = authSlice.actions
export default authSlice.reducer;
