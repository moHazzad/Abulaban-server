import { z } from "zod";

const LocalizedStringSchema = z.object({
  en: z.string({ required_error: 'English text is required' }),
  ar: z.string({ required_error: 'Arabic text is required' })
});


const BedroomInfoSchema = z.object({
  bedroomNumber: z.number().min(1, { message: "Bedroom number must be 1 or greater" }),
  beds: LocalizedStringSchema // Updated to use LocalizedStringSchema
});

  
  // Zod schema for TRoomCategory
  const TRoomCategoryValidationSchema = z.object({
    body: z.object({
      categoryTitle: LocalizedStringSchema, // Updated to use LocalizedStringSchema
      bedrooms: z.array(BedroomInfoSchema).optional()
    })
  });
  

  export default TRoomCategoryValidationSchema;