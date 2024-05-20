import { z } from 'zod';
import { UserRole, UserStatus } from './user.interface';

const addressSchemaZod = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().optional(),
});

const profileSchemaZod = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

const userSchemaZod = z.object({
  body: z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  passwordHash: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.nativeEnum(UserRole).optional().default(UserRole.User),
  status: z.nativeEnum(UserStatus).optional().default(UserStatus.Active),
  profile: profileSchemaZod,
  address: addressSchemaZod.optional(),
  
 })
});

export default userSchemaZod;


// import { z } from 'zod';
// // import { USER_ROLE } from '../../conestants/user.contents';

// const userAddressSchemaZod = z.object({
//   street: z.string().optional(),
//   city: z.string().optional(),
//   country: z.string().optional(),
// });

// const userValidationSchemaZod = z.object({
//   body: z.object({
//     firstName: z.string().min(1, 'First name is required'),
//   lastName: z.string().min(1, 'Last name is required'),
//   // fullName: z.string().optional(),

//   password: z.string().min(1, 'Password is required'), // Assuming this is a date field
//   email: z.string().email('Invalid email format').min(1, 'Email is required'),
//   phone: z.string().min(1, 'Phone number is required'),
//   isActive: z.boolean().optional(),
//   isDeleted: z.boolean().optional(),
//   address: userAddressSchemaZod.optional(),
//   })
// });

// export default userValidationSchemaZod;
