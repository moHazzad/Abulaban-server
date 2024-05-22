/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, model } from "mongoose";
import { Product } from "./product.interface";

const LocalizedStringSchema = new mongoose.Schema(
  {
    en: { type: String, required: [true, 'English is required'] },
    ar: { type: String, required: [true, 'Arabic is required'] },
  },
  { _id: false },
);

// Define a flexible schema for tech specifications
const TechSpecificationSchema = new Schema({
  key: { type: String, required: [true, 'Technical specification key is required'] },
  value: { type: Schema.Types.Mixed, required: [true, 'Technical specification value is required'] },
}, { _id: false });

// Define ProductStatus as an enumeration
export enum ProductStatus {
  AVAILABLE = 'available',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
  // Add other statuses as needed
}

const ProductSchema = new Schema({
  ModelNo: { type: String, required: [true, 'Model number is required'] },
  Name: { type: LocalizedStringSchema, required: [true, 'Product name is required'] },
  Brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: [true, 'Brand ID is required'] },
  Desc: { type: LocalizedStringSchema, required: [true, 'Product description is required'] },
  StockQTY: { type: Number, required: [true, 'Stock quantity is required'] },
  SoldQTY: { type: Number, default: 0 }, // To track the number of items sold
  price: { type: Number, required: [true, 'Price is required'] },
  previousPrice: { type: Number },
  ImageURL: [{ type: String, required: [true, 'At least one image URL is required'] }],
  CategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: [true, 'Category ID is required'] },
  tackSpecification: { type: [TechSpecificationSchema] },
  Status: { type: String, enum: Object.values(ProductStatus), required: [true, 'Product status is required'], default: ProductStatus.AVAILABLE },
  ReleaseDate: { type: Date },
  isDeleted: { type: Boolean, default: false, required: [true, 'isDeleted flag is required'] },
  deletedAt: { type: Date },
}, { timestamps: true });

// Apply the ProductStatus enum as a static property
Object.assign(ProductSchema.statics, {
  ProductStatus,
});
// Method to update stock quantity
ProductSchema.methods.updateStock = async function (quantity: number) {
  this.StockQTY = this.StockQTY - quantity;
  this.SoldQTY = this.SoldQTY + quantity;
  if (this.StockQTY <= 0) {
    this.Status = ProductStatus.OUT_OF_STOCK;
  } else {
    this.Status = ProductStatus.AVAILABLE;
  }
  await this.save();
};

// Pre-save hook to check for duplicate ModelNo
// Pre-save hook to check for duplicate ModelNo and update status based on stock
ProductSchema.pre('save', async function (next) {
  if (!this.isNew) {
    // Update the status based on stock quantity for existing products
    if (this.StockQTY <= 0) {
      this.Status = ProductStatus.OUT_OF_STOCK;
    } else {
      this.Status = ProductStatus.AVAILABLE;
    }
    return next();
  }

  try {
    const existingModelNo = await this.model('Product').findOne({ ModelNo: this.ModelNo });
    if (existingModelNo) {
      throw new Error('Duplicate Model No detected.');
    }

    // Set the status based on stock quantity for new products
    if (this.StockQTY <= 0) {
      this.Status = ProductStatus.OUT_OF_STOCK;
    } else {
      this.Status = ProductStatus.AVAILABLE;
    }
  } catch (error: any) {
    return next(error);
  }

  next();
});



export const ProductModel = model<Product>('Product', ProductSchema);






// /* eslint-disable @typescript-eslint/no-explicit-any */
// import mongoose, { Schema, model } from "mongoose";
// import { Product } from "./product.interface";



// const LocalizedStringSchema = new mongoose.Schema(
//   {
//     en: { type: String, required:  [true, 'English is required'] },
//     ar: { type: String, required:  [true, 'Arabic  is required'] },
//   },
//   { _id: false },
// );

// // Define a flexible schema for tech specifications
// const TechSpecificationSchema = new Schema({
//   key: { type: String, required: [true, 'Technical specification key is required'] },
//   value: { type: Schema.Types.Mixed, required: [true, 'Technical specification value is required'] },
// }, { _id: false });

// // const ProductStatus = {
// //   ACTIVE: 'Active',
// //   OUTOFSTOCK: 'OutOfStock',
// //   INACTIVE : 'Inactive ',
// // };

// // Define ProductStatus as an enumeration
// const ProductStatus = Object.freeze({
//   AVAILABLE: 'available',
//   OUT_OF_STOCK: 'out_of_stock',
//   DISCONTINUED: 'discontinued',
//   // Add other statuses as needed
// });

// const ProductSchema = new Schema({
//   ModelNo: { type: String, required: [true, 'Model number is required'] },
//   Name: { type: LocalizedStringSchema, required: [true, 'Product name is required'] },
//   Brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: [true, 'Brand ID is required'] },
//   Desc: { type: LocalizedStringSchema, required: [true, 'Product description is required'] },
//   StockQTY: { type: Number, required: [true, 'Stock quantity is required'] },
//   price: { type: Number, required: [true, 'Price is required'] },
//   previousPrice: { type: Number },
//   ImageURL: [{ type: String, required: [true, 'At least one image URL is required'] }],
//   CategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: [true, 'Category ID is required'] },
//   SKU: { type: Number, required: [true, 'SKU is required'] },
//   tackSpecification: { type: [TechSpecificationSchema] },
//   Status: { type: String, enum: Object.values(ProductStatus), required: [true, 'Product status is required'] },
//   ReleaseDate: { type: Date },
//   isDeleted: { type: Boolean, default: false, required: [true, 'isDeleted flag is required'] },
//   deletedAt: { type: Date },
// }, { timestamps: true });

// // Apply the ProductStatus enum as a static property
// Object.assign(ProductSchema.statics, {
//   ProductStatus,
// });


// ProductSchema.pre('save', async function (next) {
//   if (!this.isModified('ModelNo') && !this.isModified('SKU')) return next();

//   try {
//     const existingModelNo = await this.model('Product').findOne({
//       ModelNo: this.ModelNo,
//     });
//     if (existingModelNo) {
//       throw new Error('Duplicate Model No detected.');
//     }

//     const existingSKU = await this.model('Product').findOne({ SKU: this.SKU });
//     if (existingSKU) {
//       throw new Error('Duplicate SKU detected.');
//     }
//   } catch (error: any) {
//     next(error);
//   }

//   next();
// });

// export const ProductModel = model<Product>('Product', ProductSchema);
