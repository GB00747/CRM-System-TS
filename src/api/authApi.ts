import axiosInstance from "@/api/axiosInstance.ts";
import {
  UserRegistration,
  AuthData,
  RefreshToken,
  Token, UserResponse,
} from "@/features/auth/authTypes";


export const authApi = {
  register: async (data: UserRegistration) => {
    console.log("Register payload:", data);
    const response = await axiosInstance.post("/auth/signup", data);
    return response.data;
  },

  login: async (data: AuthData): Promise<Token> => {
    const response = await axiosInstance.post<Token>("/auth/signin", data);
    return response.data;
  },

  refresh: async (data: RefreshToken): Promise<Token> => {
    const response = await axiosInstance.post<Token>("/auth/refresh", data);
    return response.data;
  },

  getProfile: async () : Promise<UserResponse> => {
    const response = await axiosInstance.get("/user/profile");
    return response.data;
  }
};
