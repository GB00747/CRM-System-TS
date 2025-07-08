import axiosInstance from "@/api/axiosInstance.ts";
import {
  UserRegistration,
  AuthData,
  RefreshToken,
  Token, UserResponse,
} from "@/features/auth/authTypes";

import {AxiosRequestConfig} from 'axios'


export const authApi = {
  async register(formData: UserRegistration): Promise<UserResponse> {
    const response = await axiosInstance.post("/auth/signup", formData);
    console.log('Данные зарегистрированы:', response.data)
    return response.data;
  },

  async signIn(authData: AuthData): Promise<Token> {
    const response = await axiosInstance.post<Token>("/auth/signin", authData);
    console.log('Токены:', response.data)
    return response.data;
  },

  async refreshTokens(refreshToken: RefreshToken): Promise<Token> {
    const response = await axiosInstance.post<Token>("/auth/refresh", refreshToken);
    return response.data;
  },

  async getProfile(config: AxiosRequestConfig): Promise<UserResponse> {
    const response = await axiosInstance.get("/user/profile", config);
    return response.data;
  },
  async logOut (config: AxiosRequestConfig): Promise<string> {
    const response = await axiosInstance.post('/user/logout',null,config)
    return response.data
  }
};
