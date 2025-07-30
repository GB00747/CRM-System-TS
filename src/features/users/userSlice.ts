import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
  addUserRights,
  blockUserProfile,
  deleteUserProfile,
  getUserInfo,
  getUsers, unblockUserProfile,
  updateUserProfile
} from "@/features/users/usersThunks.ts";
import {MetaResponse, UserFilters} from "@/features/users/usersTypes.ts";
import {Profile} from "@/features/auth/authTypes.ts";



interface UserState {
  users: null | MetaResponse<Profile>;
  singleUser: null | Profile;
  error: null | string;
  pending: true | false;
  tableParams: UserFilters;
  total: number;
  search?: string;
}



const initialState: UserState = {
  users: null,
  singleUser: null,
  error: null,
  pending: false,
  tableParams: {},
  total: 20,
  search: ''
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setTableParams: (state, action: PayloadAction<UserFilters>) => {
      state.tableParams = {...action.payload};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state) => {
      state.error = null;
      state.pending = true;
    })
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.users = action.payload
      state.total = action.payload.meta.totalAmount
      state.error = null;
      state.pending = false;
    })
    builder.addCase(getUsers.rejected, (state, action) => {
      state.error = action.payload
      state.pending = false
    })
    builder.addCase(getUserInfo.pending, (state) => {
      state.error = null;
      state.pending = true;
    })
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      state.singleUser = action.payload
      state.error = null;
      state.pending = false;
    })
    builder.addCase(getUserInfo.rejected, (state, action) => {
      state.error = action.payload
      state.pending = false
    })
    builder.addCase(updateUserProfile.pending, (state) => {
      state.error = null;
      state.pending = true;
    })
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.singleUser = action.payload;
      state.error = null;
      state.pending = false;
    })
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.error = action.payload
      state.pending = false
    })
    builder.addCase(deleteUserProfile.pending, (state) => {
      state.error = null;
      state.pending = true;
    })
    builder.addCase(deleteUserProfile.fulfilled, (state, action) => {
      if (state.users) {
        state.users.data = state.users.data.filter(user => user.id !== action.payload)
      }
      state.error = null;
      state.pending = false;
    })
    builder.addCase(deleteUserProfile.rejected, (state, action) => {
      state.error = action.payload
      state.pending = false
    })
    builder.addCase(blockUserProfile.pending, (state) => {
      state.error = null;
      state.pending = true;
    })
    builder.addCase(blockUserProfile.fulfilled, (state, action) => {
      if (state.users) {
        state.users.data = state.users.data.map(user =>
          user.id === action.payload.id ? action.payload : user
        );
      }

      state.error = null;
      state.pending = false;
    })
    builder.addCase(blockUserProfile.rejected, (state, action) => {
      state.error = action.payload
      state.pending = false
    })
    builder.addCase(unblockUserProfile.pending, (state) => {
      state.error = null;
      state.pending = true;
    })
    builder.addCase(unblockUserProfile.fulfilled, (state, action) => {
      if (state.users) {
        state.users.data = state.users.data.map(user =>
          user.id === action.payload.id ? action.payload : user
        );
      }

      state.error = null;
      state.pending = false;
    })
    builder.addCase(unblockUserProfile.rejected, (state, action) => {
      state.error = action.payload
      state.pending = false
    })
    builder.addCase(addUserRights.pending, (state) => {
      state.error = null;
      state.pending = true;
    })
    builder.addCase(addUserRights.fulfilled, (state, action) => {
      if (state.users) {
        state.users.data = state.users.data.map(user =>
          user.id === action.payload.id ? action.payload : user
        );
      }

      state.error = null;
      state.pending = false;
    })
    builder.addCase(addUserRights.rejected, (state, action) => {
      state.error = action.payload
      state.pending = false
    })
  }
})


export const { setTableParams } = userSlice.actions;
export default userSlice.reducer