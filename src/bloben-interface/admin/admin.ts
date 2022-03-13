import { ROLE } from '../enums';

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminChangePasswordRequest {
  oldPassword: string;
  password: string;
}

export interface GetAdminAccountResponse {
  isLogged: boolean;
  role: ROLE | null;
}

export interface GetUsersResponse {
  id: string;
  username: string;
  isEnabled: boolean;
  role: ROLE;
}

export interface AdminCreateUserRequest {
  username: string;
  password: string;
}

export interface AdminUpdateUserRequest {
  isEnabled: boolean;
  role?: ROLE;
}
