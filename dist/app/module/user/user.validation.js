"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
const addressSchemaZod = zod_1.z.object({
    street: zod_1.z.string().min(1, 'Street is required'),
    city: zod_1.z.string().min(1, 'City is required'),
    state: zod_1.z.string().min(1, 'State is required'),
    postalCode: zod_1.z.string().min(1, 'Postal code is required'),
    country: zod_1.z.string().optional(),
});
const profileSchemaZod = zod_1.z.object({
    firstName: zod_1.z.string().min(1, 'First name is required'),
    lastName: zod_1.z.string().min(1, 'Last name is required'),
    phone: zod_1.z.string().optional(),
});
const userSchemaZod = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(1, 'Username is required'),
        email: zod_1.z.string().email('Invalid email address'),
        passwordHash: zod_1.z.string().min(6, 'Password must be at least 6 characters long'),
        role: zod_1.z.nativeEnum(user_interface_1.UserRole).optional().default(user_interface_1.UserRole.User),
        status: zod_1.z.nativeEnum(user_interface_1.UserStatus).optional().default(user_interface_1.UserStatus.Active),
        profile: profileSchemaZod,
        address: addressSchemaZod.optional(),
    })
});
exports.default = userSchemaZod;
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
