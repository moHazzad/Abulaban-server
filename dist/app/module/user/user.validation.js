"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = exports.RegisterSchema = void 0;
const zod_1 = require("zod");
const AddressSchema = zod_1.z.object({
    address: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    postalCode: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
});
exports.RegisterSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().min(6),
        confirmPassword: zod_1.z.string().min(6),
        profile: zod_1.z.object({
            firstName: zod_1.z.string().min(1),
            lastName: zod_1.z.string().min(1),
            phone: zod_1.z.string().min(1),
            email: zod_1.z.string().email(),
        }),
        shippingAddress: AddressSchema.optional(),
        // billingAddress: AddressSchema.optional(),
        isDelete: zod_1.z.boolean().default(false)
    })
})
    .refine((data) => data.body.password === data.body.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});
exports.LoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
    })
});
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
