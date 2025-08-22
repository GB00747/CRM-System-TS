import {createAsyncThunk} from "@reduxjs/toolkit";
import {usersApi} from "@/api/usersApi.ts";
import {
  MetaResponse,
  UserFilters, UserRequest, UserRolesRequest, WithID
} from "@/features/users/usersTypes.ts";
import {Profile} from "@/features/auth/authTypes.ts";
import {logOut} from "@/features/auth/authThunks.ts";

export const getUsers = createAsyncThunk<MetaResponse<Profile>, UserFilters, {
  rejectValue: string
}>(
  'users/getUsers',
  async (params, {rejectWithValue}) => {
    try {
      return await usersApi.getUsers(params)
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.message)
    }
  }
)

export const getUserInfo = createAsyncThunk<Profile, number, {
  rejectValue: string
}>(
  'users/getUserInfo',
  async (id, {rejectWithValue}) => {
    try {
      return await usersApi.getUserProfile(id)
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.message)
    }
  }
)

export const updateUserProfile = createAsyncThunk<Profile, WithID<{updateData: UserRequest}>, {
  rejectValue: string
}>(
  'users/updateUserProfile',
  async ({updateData, id }, {rejectWithValue}) => {
    try {
      return usersApi.updateUserProfile(id, updateData)
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.message)
    }
  }
)

export const deleteUserProfile = createAsyncThunk<number, number, {
  rejectValue: string
}>(
  'users/deleteUserProfile',
  async (id, {rejectWithValue}) => {
    try {
      await usersApi.deleteUserProfile(id)
      return id
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.message)
    }
  }
)

export const blockUserProfile = createAsyncThunk<Profile, number, {
  rejectValue: string
}>(
  'users/blockUserProfile',
  async (id, {rejectWithValue}) => {
    try {
       return await usersApi.blockUserProfile(id)

    } catch (error) {
      console.log(error)
      return rejectWithValue(error.message)
    }
  }
)

export const unblockUserProfile = createAsyncThunk<Profile, number, {
  rejectValue: string
}>(
  'users/unblockUserProfile',
  async (id, {rejectWithValue}) => {
    try {
      return await usersApi.unblockUserProfile(id)
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.message)
    }
  }
)

export const addUserRights = createAsyncThunk<Profile, WithID<{roles: UserRolesRequest}>, {
  rejectValue: string
}>(
  'users/addUserRights',
  async({id, roles}, {rejectWithValue}) => {
    try {
      console.log(roles)
      return await usersApi.addUserRights(id, roles)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)