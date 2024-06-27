import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { User, UserRole, UserStatus } from './user.interface';

const UserSchema: Schema = new Schema({
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.user },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, unique: true, required: true },
  },
  status: { type: String, enum: Object.values(UserStatus), default: UserStatus.Active },
  lastLoginDate: { type: Date },
}, { timestamps: true });

// Middleware for hashing password before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const UserModel = mongoose.model<User>('User', UserSchema);
export default UserModel;



// /* eslint-disable @typescript-eslint/no-this-alias */
// import mongoose, { Schema, model } from 'mongoose';
// import bcrypt from 'bcrypt';
// import { Address, Profile, User, UserRole, UserStatus } from './user.interface'; // Assuming this file is named user.interface.ts
// // import AppError from '../../Error/errors/AppError';
// // import httpStatus from 'http-status';

// const addressSchema = new Schema<Address>({
//   street: { type: String, required: true },
//   city: { type: String, required: true },
//   state: { type: String, required: true },
//   postalCode: { type: String, required: true },
//   country: { type: String },
// }, { _id: false });

// const profileSchema = new Schema<Profile>({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   phone: { type: String },
// }, { _id: false });

// const userSchema = new mongoose.Schema<User>({
//   username: { type: String, required: true },
//   email: { type: String, required: true, unique: true, lowercase: true },
//   passwordHash: { type: String, required: true },
//   role: { type: String, enum: Object.values(UserRole), default: UserRole.User },
//   profile: profileSchema,
//   address: addressSchema,
//   status: { type: String, enum: Object.values(UserStatus), default: UserStatus.Active },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// // // Example of middleware to handle status changes or checks
// // userSchema.pre<User>('save', async function (next) {
// //   if (this.isModified('status') && this.status === UserStatus.Deleted) {
// //     // Handle actions specific to when a user is marked as deleted, such as cleanup
// //     throw new AppError(httpStatus.UNAUTHORIZED, `You are not authorized to create  `);
// //   }
// //   next();
// // });

// // Pre-save middleware to handle email duplication and other validations
// userSchema.pre('save', async function (next) {
//   const user = this;

//   // Check for email duplication
//   if (user.isModified('email')) {
//     const existingUser = await mongoose.model('User').findOne({ email: user.email });
//     if (existingUser) {
//       return next(new Error('Email already exists'));
//     }
//   }

//   // Password hashing
//   if (user.isModified('passwordHash')) {
//     user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
//   }

//   next();
// });

// export const UserModel = model<User>('User', userSchema);



