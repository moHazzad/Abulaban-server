import mongoose, { model } from 'mongoose';
import { TUser } from './user.interface';
import bcrypt from 'bcrypt';
import { USER_ROLE } from '../../conestants/user.contents';

const userAddressSchema = new mongoose.Schema({
  street: { type: String },
  city: { type: String },
  country: { type: String },
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, 'First name is required'] },
  lastName: { type: String, required: [true, 'Last name is required'] },
  // fullName: { type: String  },

  password: {
    type: String,
    required: true,
    select: 0,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
  },
  passwordChangedAt: {
    type: Date,
    default: null,
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLE), // ['user', 'admin']
    default: USER_ROLE.admin,
  },
  phone: { type: String, required: [true, 'Phone number is required'] },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  address: { type: userAddressSchema, required: false },
  
  
}, { timestamps: true,
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true }
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  if (this.isModified('email')) {
    const existingUser = await UserModel.findOne({ email: this.email });
    if (existingUser) {
      return next(new Error(`a user with '${this.email}' already exists`));
    }
  }

  next();
});

// userSchema.methods.toJSON = function () {
//   const user = this.toObject({ virtuals: true }); // Ensure virtuals are included
//   delete user.password;
//   delete user.id;
//   return user;
// };

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Explicitly set the `toObject` option to include virtuals
// userSchema.set('toObject', { virtuals: true });

export const UserModel = model<TUser>('User', userSchema);
