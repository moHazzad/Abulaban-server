
import { z } from 'zod';

const LocalizedStringValidationSchema = z.object({
  en: z.string({ required_error: 'English text is required' }),
  ar: z.string({ required_error: 'Arabic text is required' }),
  icon: z.string({ required_error: 'icon is required' }).optional(),
});

const PriceOptionValidationSchema = z.object({
  price: z.number({ required_error: 'Price is required' }),
  currency: LocalizedStringValidationSchema,
  taxesAndCharges: z.string({ required_error: 'Taxes and charges are required' }),
  breakfast: LocalizedStringValidationSchema,
  cancellation: LocalizedStringValidationSchema,
  prepayment: LocalizedStringValidationSchema,
  refundable: z.boolean({ required_error: 'Refundable status is required' }),
});

const SubTitleValidationSchema = z.object({
  roomOne: LocalizedStringValidationSchema,
  roomTwo: LocalizedStringValidationSchema.optional(),
});

const RoomValidationSchema = z.object({
  body: z.object({
    title: LocalizedStringValidationSchema,
    subTitle: SubTitleValidationSchema,
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

