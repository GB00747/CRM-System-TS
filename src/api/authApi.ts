import axiosInstance from "@/api/axiosInstance.ts";
import {
  UserRegistration,
  AuthData,
  RefreshToken,
  Token, UserResponse,
} from "@/features/auth/authTypes";

import {AxiosRequestConfig} from 'axios'


export const authApi = {
  async register(registerData: UserRegistration): Promise<UserResponse> {
    try {
      const response = await axiosInstance.post("/auth/signup", registerData);
      return response.data;
    } catch (error) {
      throw error
    }
  },

  async signIn(authData: AuthData): Promise<Token> {
    try {
      const response = await axiosInstance.post<Token>("/auth/signin", authData);
      return response.data;
    } catch (error) {
      throw error
    }

  },

  async refreshTokens(refreshToken: RefreshToken): Promise<Token> {
    try {
      const response = await axiosInstance.post<Token>("/auth/refresh", refreshToken);
      return response.data;
    } catch (error) {
      throw error
    }

  },

  async getProfile(config: AxiosRequestConfig): Promise<UserResponse> {
    try {
      const response = await axiosInstance.get("/user/profile", config);
      return response.data;
    } catch (error) {
      throw error
    }

  },
  async logOut(config: AxiosRequestConfig): Promise<string> {
    try {
      const response = await axiosInstance.post('/user/logout', null, config)
      return response.data
    } catch (error) {
      throw error
    }
  }
};
