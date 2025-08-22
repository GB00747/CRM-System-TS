import {
  AuthData,
  Profile,
  Token,
  UserRegistration,
  UserResponse
} from "@/features/auth/authTypes";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {authApi} from "@/api/authApi.ts";
import {tokenStorage} from "@/features/auth/services/tokenStorage.ts";
import {UserRequest} from "@/features/users/usersTypes.ts";


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

  export const getProfile = createAsyncThunk<Profile, void, {
    rejectValue: string
  }>(
    "auth/getProfile",
    async (_, {rejectWithValue}) => {
      try {
        const response = await authApi.getProfile()
        console.log('Данные профиля получены', response)
        return response
      } catch (error) {
        if (!error.response) {
          return rejectWithValue('Проверьте соединение с интернетом ')
        }
        switch (error.response.status) {
          case 400:
            return rejectWithValue('Юзер не найден')
          case 401:
            return rejectWithValue('Сессия истекла. Пожалуйста, войдите заново.')
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
      const config = { headers: { Authorization: `Bearer ${accessToken}` } }

      try {
        await authApi.logOut(config)
      } catch (error) {
        if (!error.response) {
          return rejectWithValue('Проверьте соединение с интернетом')
        }
        switch (error.response.status) {
          case 500:
            return rejectWithValue('На сервере произошла ошибка. Повторите позже.')
          default:
            return rejectWithValue('Неизвестная ошибка при логауте')
        }
      } finally {
        tokenStorage.clearAccessToken()
        localStorage.removeItem('refreshToken')
      }
    }
  )


  export const initializeAuth = createAsyncThunk(
    'auth/initializeAuth',
    async (_, {dispatch, rejectWithValue}) => {

      try {
        await dispatch(getRefreshToken()).unwrap()
        const user = await dispatch(getProfile()).unwrap()
        console.log('Восстановлены токены при перезагрузке')
        console.log(user)
        return user
      } catch (error) {
        return rejectWithValue(error)
      }
    }
  )

  export const updateProfile = createAsyncThunk<Profile, UserRequest, { rejectValue: string }>(
    'auth/updateProfile',
    async (updateUserInfo: UserRequest, {rejectWithValue}) => {
      try {
        const response = await authApi.updateProfile(updateUserInfo)
        if (!response) {
          throw new Error('No data in response');
        }
        return response
      } catch (error) {
        return rejectWithValue(error)
      }
    }
  )