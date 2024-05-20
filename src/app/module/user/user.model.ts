/* eslint-disable @typescript-eslint/no-this-alias */
import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { Address, Profile, User, UserRole, UserStatus } from './user.interface'; // Assuming this file is named user.interface.ts
// import AppError from '../../Error/errors/AppError';
// import httpStatus from 'http-status';

const addressSchema = new Schema<Address>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String },
}, { _id: false });

const profileSchema = new Schema<Profile>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
}, { _id: false });

const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.User },
  profile: profileSchema,
  address: addressSchema,
  status: { type: String, enum: Object.values(UserStatus), default: UserStatus.Active },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// // Example of middleware to handle status changes or checks
// userSchema.pre<User>('save', async function (next) {
//   if (this.isModified('status') && this.status === UserStatus.Deleted) {
//     // Handle actions specific to when a user is marked as deleted, such as cleanup
//     throw new AppError(httpStatus.UNAUTHORIZED, `You are not authorized to create  `);
//   }
//   next();
// });

// Pre-save middleware to handle email duplication and other validations
userSchema.pre('save', async function (next) {
  const user = this;

  // Check for email duplication
  if (user.isModified('email')) {
    const existingUser = await mongoose.model('User').findOne({ email: user.email });
    if (existingUser) {
      return next(new Error('Email already exists'));
    }
  }

  // Password hashing
  if (user.isModified('passwordHash')) {
    user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
  }

  next();
});

export const UserModel = model<User>('User', userSchema);







// import mongoose, { model } from 'mongoose';
// import { TUser } from './user.interface';
// import bcrypt from 'bcrypt';
// import { USER_ROLE } from '../../conestants/user.contents';

// const userAddressSchema = new mongoose.Schema({
//   street: { type: String },
//   city: { type: String },
//   country: { type: String },
// });

// const userSchema = new mongoose.Schema({
//   firstName: { type: String, required: [true, 'First name is required'] },
//   lastName: { type: String, required: [true, 'Last name is required'] },
//   // fullName: { type: String  },

//   password: {
//     type: String,
//     required: true,
//     select: 0,
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
//   },
//   passwordChangedAt: {
//     type: Date,
//     default: null,
//   },
//   role: {
//     type: String,
//     enum: Object.values(USER_ROLE), // ['user', 'admin']
//     default: USER_ROLE.admin,
//   },
//   phone: { type: String, required: [true, 'Phone number is required'] },
//   isActive: { type: Boolean, default: true },
//   isDeleted: { type: Boolean, default: false },
//   address: { type: userAddressSchema, required: false },
  
  
// }, { timestamps: true,
//   toJSON: { virtuals: true }, 
//   toObject: { virtuals: true }
// });

// userSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 12);
//   }

//   if (this.isModified('email')) {
//     const existingUser = await UserModel.findOne({ email: this.email });
//     // If an existing user is found with the same email
//     if (existingUser) {
//       // If the found user is marked as deleted
//       if (existingUser.isDeleted) {
//         return next(new Error('This email is associated with a deleted account. Please contact admin for account recovery.'));
//       } else {
//         // If attempting to save the same user (e.g., during update operations), allow it
//         if (existingUser._id.equals(this._id)) {
//           return next();
//         }
//         // An active user with this email already exists
//         return next(new Error('An account with this email already exists.'));
//       }
//     }
//   }

//   next();
// });

// // userSchema.methods.toJSON = function () {
// //   const user = this.toObject({ virtuals: true }); // Ensure virtuals are included
// //   delete user.password;
// //   delete user.id;
// //   return user;
// // };

// userSchema.virtual('fullName').get(function () {
//   return `${this.firstName} ${this.lastName}`;
// });

// // Explicitly set the `toObject` option to include virtuals
// // userSchema.set('toObject', { virtuals: true });

// export const UserModel = model<TUser>('User', userSchema);
