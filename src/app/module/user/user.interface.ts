/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';

export type Address = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string; // Optional for admin/moderator
};

export type Profile = {
  firstName: string;
  lastName: string;
  phone?: string; // Optional for admin/moderator
};

export enum UserRole {
  User = 'user',
  Admin = 'admin',
  Moderator = 'moderator'
}

export enum UserStatus {
  Active = 'Active',
  Suspended = 'Suspended',
  Deleted = 'Deleted' // Optional, if you want to manage soft-deletes
}

export interface User extends mongoose.Document {
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  profile: Profile;
  status: UserStatus; // New field for user status
  address?: Address; // Optional for admin/moderator
  createdAt: Date;
  updatedAt: Date;
}



// import { USER_ROLE } from "../../conestants/user.contents";

// export type UserAddress = {
//   street?: string;
//   city?: string;
//   country?: string;
// };

// export type TUser = {
//   firstName: string;
//   lastName: string;
//   // fullName?: string
//   password: string;
//   passwordChangedAt?: Date,
//   email: string;
//   phone: string;
//   role: 'user' | 'admin',
//   isActive?: boolean;
//   isDeleted?: boolean;
//   address?: UserAddress;
// };

// export type TUserRole = keyof typeof USER_ROLE 