export interface UserRegistration {
  login: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  date: string;
  isAdmin: boolean;
  isBlocked: boolean;
  phoneNumber: string;
}


export interface AuthData {
  login: string;
  password: string;
}

export interface RefreshToken {
  refreshToken: string;
}

export interface Profile {
  id: number;
  username: string;
  email: string;
  date: string;
  isBlocked: boolean;
  roles: Role[];
  phoneNumber: string;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export type Role = "ADMIN" | "USER" | "MODERATOR";

export enum Roles {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  USER = "USER"
}