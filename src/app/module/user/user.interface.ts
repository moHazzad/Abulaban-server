import { USER_ROLE } from "../../conestants/user.contents";

export type UserAddress = {
  street?: string;
  city?: string;
  country?: string;
};

export type TUser = {
  firstName: string;
  lastName: string;
  // fullName?: string
  password: string;
  passwordChangedAt?: Date,
  email: string;
  phone: string;
  role: 'user' | 'admin',
  isActive?: boolean;
  isDeleted?: boolean;
  address?: UserAddress;
};

export type TUserRole = keyof typeof USER_ROLE 