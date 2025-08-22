import axiosInstance from "@/api/axiosInstance.ts";
import {
  UserFilters,
  MetaResponse,
  UserRequest,
  UserRolesRequest
} from "@/features/users/usersTypes.ts";
import {Profile} from "@/features/auth/authTypes.ts";

export const usersApi = {
  async getUsers(params: UserFilters): Promise<MetaResponse<Profile>> {
    console.log(params)
    try {
      const response = await axiosInstance.get('/admin/users', {
        params: {
          ...params
        }
      })
      console.log(response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },
  async getUserProfile(id: number): Promise<Profile> {
    try {
      const response = await axiosInstance.get(`/admin/users/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
  async updateUserProfile(id: number, userInfo: UserRequest): Promise<Profile> {
    try {
      const response = await axiosInstance.put(`admin/users/${id}`, userInfo)
      return response.data
    } catch (error) {
      throw error
    }

  },
  async deleteUserProfile(id: number): Promise<boolean> {
    try {
      const response = await axiosInstance.delete(`admin/users/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
  async blockUserProfile(id: number) : Promise<Profile> {
    try {
      const response = await axiosInstance.post(`admin/users/${id}/block`)
      return response.data
    } catch (error) {
      throw error
    }
  },
  async unblockUserProfile(id: number): Promise<Profile> {
    try {
      const response = await axiosInstance.post(`admin/users/${id}/unblock`)
      return response.data
    } catch (error) {
      throw error
    }
  },
  async addUserRights(id: number, roles: UserRolesRequest) : Promise<Profile> {
    try {
      const response = await axiosInstance.post(`admin/users/${id}/rights`, {roles})
      return response.data
    } catch (error) {
      throw error
    }
  }
}

