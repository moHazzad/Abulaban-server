/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { model } from "mongoose";
import { Product } from "./product.interface";



const LocalizedStringSchema = new mongoose.Schema(
  {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  { _id: false },
);

const TechSpecificationSchema = new mongoose.Schema(
  {
    // Dynamic schema for technical specifications as key-value pairs
  },
  { _id: false, strict: false } // Allow any set of fields
);

const ProductStatus = {
  ACTIVE: 'Active',
  OUTOFSTOCK: 'OutOfStock',
  INACTIVE : 'Inactive ',
};

const ProductSchema = new mongoose.Schema({
  ModelNo: { type: String, required: true, unique: true },
  Name: { type: LocalizedStringSchema, required: true },
  Brand: { type: String, required: true },
  Desc: { type: LocalizedStringSchema, required: true },
  StockQTY: { type: Number, required: true, min: [0, 'Stock quantity cannot be negative.'] },
  price: { type: Number, required: true, min: [0, 'Price must be positive.'] },
  previousPrice: { type: Number, min: [0, 'Previous price must be positive.'], default: null },
  ImageURL: [{ type: String, match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/, 'Please fill a valid image URL.'] }],
  CategoryId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'SubCategory' }, // Assuming you might have a Category model
  SKU: { type: Number, required: true, unique: true },
  TechSpecification: { type: TechSpecificationSchema }, // Using the tech specs schema
  Status: { type: String, enum: Object.values(ProductStatus), default: ProductStatus.ACTIVE },
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
  ReleaseDate: { type: Date, default: new Date() }, // No default value here, making it truly optional
}, { timestamps: true });


ProductSchema.pre('save', async function (next) {
  if (!this.isModified('ModelNo') && !this.isModified('SKU')) return next();

  try {
    const existingModelNo = await this.model('Product').findOne({
      ModelNo: this.ModelNo,
    });
    if (existingModelNo) {
      throw new Error('Duplicate Model No detected.');
    }

    const existingSKU = await this.model('Product').findOne({ SKU: this.SKU });
    if (existingSKU) {
      throw new Error('Duplicate SKU detected.');
    }
  } catch (error: any) {
    next(error);
  }

  next();
});

export const ProductModel = model<Product>('Product', ProductSchema);
