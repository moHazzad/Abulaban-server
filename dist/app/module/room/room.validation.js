"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const LocalizedStringValidationSchema = zod_1.z.object({
    en: zod_1.z.string({ required_error: 'English text is required' }),
    ar: zod_1.z.string({ required_error: 'Arabic text is required' }),
    icon: zod_1.z.string({ required_error: 'icon is required' }).optional(),
});
const PriceOptionValidationSchema = zod_1.z.object({
    price: zod_1.z.number({ required_error: 'Price is required' }),
    currency: LocalizedStringValidationSchema,
    taxesAndCharges: zod_1.z.string({ required_error: 'Taxes and charges are required' }),
    breakfast: LocalizedStringValidationSchema,
    cancellation: LocalizedStringValidationSchema,
    prepayment: LocalizedStringValidationSchema,
    refundable: zod_1.z.boolean({ required_error: 'Refundable status is required' }),
});
const SubTitleValidationSchema = zod_1.z.object({
    roomOne: LocalizedStringValidationSchema,
    roomTwo: LocalizedStringValidationSchema.optional(),
});
const RoomValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: LocalizedStringValidationSchema,
        subTitle: SubTitleValidationSchema,
        type: zod_1.z.string({ required_error: 'Room category is required' }),
        description: LocalizedStringValidationSchema,
        maxGuests: zod_1.z.number({ required_error: 'Maximum number of guests is required' }),
        roomQTY: zod_1.z.number({ required_error: 'Room quantity is required' }),
        size: LocalizedStringValidationSchema,
        features: zod_1.z.array(LocalizedStringValidationSchema),
        services: zod_1.z.array(LocalizedStringValidationSchema),
        images: zod_1.z.array(zod_1.z.string({ required_error: 'At least one image URL must be specified' })),
        priceOptions: zod_1.z.array(PriceOptionValidationSchema).nonempty({ message: 'At least one price option is required' }),
    }),
});
exports.default = RoomValidationSchema;
