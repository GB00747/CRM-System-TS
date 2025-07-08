import {
  AuthData,
  UserResponse,
  UserRegistration,
  Token
} from "@/features/auth/authTypes";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {authApi} from "@/api/authApi.ts";
import {tokenStorage} from "@/features/auth/services/tokenStorage.ts";



export const signUp = createAsyncThunk<UserResponse, UserRegistration, {
  rejectValue: string
}>(
  "auth/signUp",
  async (formData, {rejectWithValue}) => {
    try {
      return await authApi.register(formData);
    } catch (error) {
      console.log(error)
      if (!error.response) {
        return rejectWithValue("Сервер недоступен. Попробуйте позже.");
      }
      const status = error.response.status;

      switch (status) {
        case 400:
          return rejectWithValue("Проверьте корректность заполнения полей.");
        case 409:
          return rejectWithValue("Пользователь с таким логином или email уже существует.");
        case 500:
          return rejectWithValue("На сервере произошла ошибка. Повторите позже.");
        default:
          return rejectWithValue("Неизвестная ошибка при регистрации");
      }
    }
  }
);


export const signIn = createAsyncThunk<Token, AuthData, { rejectValue: string }>(
  "auth/signIn",
  async (authData, {rejectWithValue}) => {
    try {
      const tokens = await authApi.signIn(authData);
      const {accessToken, refreshToken} = tokens

      tokenStorage.setAccessToken(accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      return tokens;

    } catch (error) {
      if (!error.response) {
        return rejectWithValue('Сервер недоступен. Попробуйте позже.')
      }
      console.log(error)
      switch (error.response.status) {
        case 400:
          return rejectWithValue("Проверьте корректность заполнения полей.")
        case 401:
          return rejectWithValue('Неправильные логин или пароль')
        case 500:
          return rejectWithValue("На сервере произошла ошибка. Повторите позже.")
        default:
          return rejectWithValue('Неизвестная ошибка при входе в систему')
      }
    }
  }
)

export const getRefreshToken = createAsyncThunk<Token, void, { rejectValue: string }>(
  'auth/getRefreshToken',
  async (_, {rejectWithValue}) => {

    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      return rejectWithValue('Нет рефреш токена в Local Storage')
    }

    try {
      const newTokens = await authApi.refreshTokens({refreshToken})

      tokenStorage.setAccessToken(newTokens.accessToken)
      localStorage.setItem('refreshToken', newTokens.refreshToken)

      console.log('Получены новые токены', newTokens)

      return newTokens
    } catch (error) {
      if (!error.response) {
        return rejectWithValue('Проверьте соединение с интернетом')
      }
      console.log(error.response)
      switch (error.response.status) {
        case 400:
          return rejectWithValue('Рефреш токен передан в некорректном формате')
        case 401:
          return rejectWithValue('Рефреш токен истек')
        case 500:
          return rejectWithValue('На сервере произошла ошибка. Повторите позже.')
        default:
          return rejectWithValue('Неизвестная ошибка при получение refreshToken')
      }
    }
  }
)

export const getProfile = createAsyncThunk<UserResponse, void, {
  rejectValue: string
}>(
  "auth/getProfile",
  async (_, {dispatch, rejectWithValue}) => {
    try {
      const token = tokenStorage.getAccessToken()
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
      const response = await authApi.getProfile(config)
      console.log('Данные профиля получены', response)
      return response

    } catch (error) {
      if (!error.response) {
        return rejectWithValue('Проверьте соединение с интернетом ')
      }

      if (error.response.status === 401) {
        try {
          const newTokens = await (dispatch(getRefreshToken())).unwrap()

          const config = {
            headers: {
              Authorization: `Bearer ${newTokens.accessToken}`
            }
          }

          const response = await authApi.getProfile(config)
          console.log('Сработало обновление токена')
          return response
        } catch (error) {
          return rejectWithValue('Сессия истекла. Пожалуйста, войдите заново.')
        }
      }

      switch (error.response.status) {
        case 400:
          return rejectWithValue('Юзер не найден')
        case 500:
          return rejectWithValue('На сервере произошла ошибка. Повторите позже.')
        default:
          return rejectWithValue('Неизвестная ошибка при получении данных пользователя')
      }
    }
  }
);

export const logOut = createAsyncThunk(
  'auth/logOut',
  async (_, {rejectWithValue}) => {
    const accessToken = tokenStorage.getAccessToken()
    const config = {headers: {Authorization: `Bearer ${accessToken}`}}

    try {
      const response = await authApi.logOut(config)

      tokenStorage.clearAccessToken()
      localStorage.removeItem('refreshToken')

      console.log('Пользователь вышел из системы', response)
      return response
    } catch (error) {
      if (!error.response) {
        return rejectWithValue('Проверьте соединение с интернетом')
      }
      switch (error.response.status) {
        case 401:
          return rejectWithValue("Не удалось получить данные пользователя. Пожалуйста, перезагрузите страницу или войдите заново."
          )
        case 500:
          return rejectWithValue('На сервере произошла ошибка. Повторите позже.')
        default:
          return rejectWithValue('Неизвестная ошибка при логауте')
      }
    }
  }
)

export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, {dispatch, rejectWithValue}) => {

    try {
      await dispatch(getRefreshToken()).unwrap()
      await dispatch(getProfile()).unwrap()
      console.log('Восстановлены токены при перезагрузке')
      return true
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)