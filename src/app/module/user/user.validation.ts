import { z } from 'zod';
// import { USER_ROLE } from '../../conestants/user.contents';

const userAddressSchemaZod = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

const userValidationSchemaZod = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  // fullName: z.string().optional(),

  password: z.string().min(1, 'Password is required'), // Assuming this is a date field
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  address: userAddressSchemaZod.optional(),
  })
});

export default userValidationSchemaZod;
