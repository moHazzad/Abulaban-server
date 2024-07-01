import { USER_ROLE } from "../../conestants/user.contents";

/* eslint-disable no-unused-vars */
export enum UserRole {
  super = 'super',
  admin = 'admin',
  user = 'user',
}

export enum UserStatus {
  Active = 'Active',
  Suspended = 'Suspended',
  Deleted = 'Deleted',
}

export interface ILogin {
  email: string;
  password: string;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface User extends Document {
  password: string;
  role: UserRole;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress?: Address;
  // billingAddress?: Address;
  status: UserStatus;
  lastLoginDate: Date;
  isDelete: boolean,
  createdAt: Date;
  updatedAt: Date;
}

export type TUserRole = keyof typeof USER_ROLE 

// import mongoose from 'mongoose';

// export type Address = {
//   address: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   Province: string;
//   country: string;
// };

// export type Profile = {
//   firstName: string;
//   lastName: string;
//   phone: string;
// };

// export enum UserRole {
//   SuperAdmin = 'superAdmin',
//   Admin = 'admin',
//   User = 'user',
// }

// export enum UserStatus {
//   Active = 'Active',
//   Suspended = 'Suspended',
//   Deleted = 'Deleted'
// }

// export interface User extends mongoose.Document {
//   email: string;
//   passwordHash: string;
//   role: UserRole;
//   profile: Profile;
//   status: UserStatus;
//   shippingAddress: Address;
//   billingAddress: Address;
//   lastLoginDate: Date;
//   createdAt: Date;
//   updatedAt: Date;
// }

// import mongoose from 'mongoose';

// export type Address = {
//   address: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   Province:string;
//   country: string;
// };

// export type Profile = {
//   firstName: string;
//   lastName: string;
//   phone: string;
// };

// export enum UserRole {
//   superAdmin = 'superAdmin',
//   admin = 'admin',
//   user = 'user',
// }

// export enum UserStatus {
//   Active = 'Active',
//   Suspended = 'Suspended',
//   Deleted = 'Deleted'
// }

// export interface User extends mongoose.Document {
//   username: string;
//   email: string;
//   passwordHash: string;
//   role: UserRole;
//   profile: Profile;
//   status: UserStatus;
//   shippingAddress: Address;
//   billingAddress: Address;
//   lastloginDate: Date;
//   createdAt: Date;
//   updatedAt: Date;
// }
