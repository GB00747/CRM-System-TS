import {Roles} from "@/features/auth/authTypes.ts";

export interface UserFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isBlocked?: boolean | 'all';
  limit?: number;
  offset?: number;
  currentPage?: number;
  pageSize?: number;
}


export interface MetaResponse<T> {
  data: T[];
  meta: {
    totalAmount: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

export interface UserRequest{
  username?: string;
  email?: string;
  phoneNumber?: string;
}


export interface UserRolesRequest {
  roles: Roles []  // при вызове этой апи роли будут обновлены к тому массиву который будет передан
// например если у вас была roles: ['ADMIN'] а вы хотите добавить ['MODERATOR'] то нужно передавать
// старые + новые - roles: ['ADMIN', 'MODERATOR']
}

export type WithID <T> = T & {id: number}