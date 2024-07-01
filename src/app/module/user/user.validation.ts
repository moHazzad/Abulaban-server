import { z } from 'zod';

const AddressSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

export const RegisterSchema = z.object({
  body: z.object({
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    profile: z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      phone: z.string().min(1),
      email: z.string().email(),
    }),
    shippingAddress: AddressSchema.optional(),
    // billingAddress: AddressSchema.optional(),
    isDelete: z.boolean().default(false)
  })
  })
  .refine((data) => data.body.password === data.body.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
    
  });

export const LoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
  password: z.string().min(6),
    })
  
});



// export default userSchemaZod;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

// import { z } from 'zod';
// import { UserRole, UserStatus } from './user.interface';

// const addressSchemaZod = z.object({
//   street: z.string().min(1, 'Street is required'),
//   city: z.string().min(1, 'City is required'),
//   state: z.string().min(1, 'State is required'),
//   postalCode: z.string().min(1, 'Postal code is required'),
//   country: z.string().optional(),
// });

// const profileSchemaZod = z.object({
//   firstName: z.string().min(1, 'First name is required'),
//   lastName: z.string().min(1, 'Last name is required'),
//   phone: z.string().optional(),
// });

// const userSchemaZod = z.object({
//   body: z.object({
//   username: z.string().min(1, 'Username is required'),
//   email: z.string().email('Invalid email address'),
//   passwordHash: z.string().min(6, 'Password must be at least 6 characters long'),
//   role: z.nativeEnum(UserRole).optional().default(UserRole.User),
//   status: z.nativeEnum(UserStatus).optional().default(UserStatus.Active),
//   profile: profileSchemaZod,
//   address: addressSchemaZod.optional(),

//  })
// });

// export default userSchemaZod;
