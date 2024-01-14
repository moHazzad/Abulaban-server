"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
// import { USER_ROLE } from '../../conestants/user.contents';
const userAddressSchemaZod = zod_1.z.object({
    street: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
});
const userValidationSchemaZod = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().min(1, 'First name is required'),
        lastName: zod_1.z.string().min(1, 'Last name is required'),
        // fullName: z.string().optional(),
        password: zod_1.z.string().min(1, 'Password is required'), // Assuming this is a date field
        email: zod_1.z.string().email('Invalid email format').min(1, 'Email is required'),
        phone: zod_1.z.string().min(1, 'Phone number is required'),
        isActive: zod_1.z.boolean().optional(),
        isDeleted: zod_1.z.boolean().optional(),
        address: userAddressSchemaZod.optional(),
    })
});
exports.default = userValidationSchemaZod;
