import { z } from 'zod';
import { ProductStatus } from './product.interface';

// Define localized string schema
const LocalizedStringSchema = z.object({
  en: z.string().min(1, 'English name is required'),
  ar: z.string().min(1, 'Arabic name is required')
});

// Define technical specification schema (as key-value pairs, optional)
const TechSpecificationSchema = z.record(z.union([z.string(), z.number()])).optional();

// Define product status schema based on enum
const ProductStatusSchema = z.nativeEnum(ProductStatus);

// Define the main Product validation schema
const ProductValidationSchema = z.object({
 body: z.object({
  ModelNo: z.string().min(1, 'Model number is required'),
  Name: LocalizedStringSchema,
  Brand: z.string().min(1, 'Brand is required'),
  Desc: LocalizedStringSchema,
  StockQTY: z.number().min(0, 'Stock quantity cannot be negative'),
  price: z.number().min(0, 'Price must be a positive number'),
  previousPrice: z.number().min(0, 'Previous price must be a positive number').optional(),
  ImageURL: z.array(z.string().url('Must be a valid URL')),
  CategoryId: z.string().regex(/^[0-9a-fA-F]{24}$/,'CategoryId must be a valid MongoDB ObjectId',),
  SKU: z.number().min(1, 'SKU is required'),
  TechSpecification: TechSpecificationSchema,
  Status: ProductStatusSchema,
  ReleaseDate: z.date().optional()
 })
});

export default ProductValidationSchema;