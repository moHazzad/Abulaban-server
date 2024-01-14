// import { z } from 'zod';
// import { TRoomCategory } from './room.interface';

// const RoomValidationSchema = z.object({

//   body: z.object({
//     RoomCategory: z
//       .enum(['Standard', 'Deluxe', 'Suite', 'Superior', 'Executive'])
//       .refine((value) => typeof value === 'string', {
//         message: 'Room category must be a string',
//       }),
//     RoomPrice: z.number().refine((value) => value >= 0, {
//       message: 'Room price must be a non-negative number',
//     }),
//     RoomCapacity: z.number().refine((value) => value > 0, {
//       message: 'Room capacity must be a positive number',
//     }),
//     RoomDetails: z.string(),
//     Images: z.array(z.string()),
//     RoomQTY: z.number().refine((value) => value >= 0, {
//       message: 'Room quantity must be a non-negative number',
//     }),
//     RoomStatus: z.boolean(),
//   }),
// });

// const PriceOptionValidationSchema = z.object({
//   price: z.number({ required_error: 'Price is required' }),
//   currency: z.string({ required_error: 'Currency is required' }),
//   taxesAndCharges: z.number({ required_error: 'Taxes and charges are required' }),
//   breakfast: z.string({ required_error: 'Breakfast information is required' }),
//   cancellation: z.string({ required_error: 'Cancellation policy is required' }),
//   prepayment: z.string({ required_error: 'Prepayment information is required' }),
//   refundable: z.boolean({ required_error: 'Refundable status is required' }),
// });

// const RoomValidationSchema = z.object({
//   body: z.object({
//     title: z.string({ required_error: 'Room title is required' }),
//     type: z.string({ required_error: 'At least one category option is required' }),
//     description: z.string({ required_error: 'Room description is required' }),
//     maxGuests: z.number({ required_error: 'Maximum number of guests is required' }),
//     roomQTY: z.number({ required_error: 'Room quantity is required' }),
//     size: z.string({ required_error: 'Room size is required' }),
    
//     features: z.array(z.string({ required_error: 'At least one feature must be specified' })),
//     images: z.array(z.string({ required_error: 'At least one feature must be specified' })),
//     priceOptions: z.array(PriceOptionValidationSchema).nonempty({ message: 'At least one price option is required' }),
//   }),
// });

// export default RoomValidationSchema;


import { z } from 'zod';

const LocalizedStringValidationSchema = z.object({
  en: z.string({ required_error: 'English text is required' }),
  ar: z.string({ required_error: 'Arabic text is required' }),
});

const PriceOptionValidationSchema = z.object({
  price: z.number({ required_error: 'Price is required' }),
  currency: z.string({ required_error: 'Currency is required' }),
  taxesAndCharges: z.string({ required_error: 'Taxes and charges are required' }),
  breakfast: LocalizedStringValidationSchema,
  cancellation: LocalizedStringValidationSchema,
  prepayment: LocalizedStringValidationSchema,
  refundable: z.boolean({ required_error: 'Refundable status is required' }),
});

const RoomValidationSchema = z.object({
  body: z.object({
    title: LocalizedStringValidationSchema,
    type: z.string({ required_error: 'Room category is required' }),
    description: LocalizedStringValidationSchema,
    maxGuests: z.number({ required_error: 'Maximum number of guests is required' }),
    roomQTY: z.number({ required_error: 'Room quantity is required' }),
    size: LocalizedStringValidationSchema,
    features: z.array(LocalizedStringValidationSchema),
    services: z.array(LocalizedStringValidationSchema),
    images: z.array(z.string({ required_error: 'At least one image URL must be specified' })),
    priceOptions: z.array(PriceOptionValidationSchema).nonempty({ message: 'At least one price option is required' }),
  }),
});

export default RoomValidationSchema;

