import  { Schema, model,  } from 'mongoose';
import { Product, ProductStatus } from './product.interface';

// Localized string schema
const LocalizedStringSchema = new Schema({
  en: { type: String, required: true },
  ar: { type: String, required: true },
}, { _id: false });

const LocalizedHighlightsSchema = new Schema({
  en: { type: [String], required: true },
  ar: { type: [String], required: true },
}, { _id: false });


// Tech specification schema
const TechSpecificationSchema = new Schema({
  key: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true },
}, { _id: false });



// Review schema
// const ReviewSchema = new Schema({
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
//   rating: { type: Number, min: 1, max: 5, required: true },
//   comment: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now, required: true },
// });

// Product schema
const ProductSchema = new Schema<Product>({
  modelNo: { type: String, required: true },
  sku: { type: String, required: true },
  name: { type: LocalizedStringSchema, required: true },
  type: { type: LocalizedStringSchema, required: true },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  desc: { type: LocalizedStringSchema, required: true },
  stockQty: { type: Number, required: true },
  soldQty: { type: Number, default: 0 },
  price: { type: Number, required: true },
  previousPrice: { type: Number },
  imageURLs: [{ type: String, required: true }],
  subCategoryId: { type: Schema.Types.ObjectId, ref: 'SubCategory', required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  techSpecifications: { type: [TechSpecificationSchema], default: [] },
  status: { type: String, enum: Object.values(ProductStatus), default: ProductStatus.AVAILABLE },
  highlights: { type: LocalizedHighlightsSchema, default: { en: [], ar: [] } },
  releaseDate: { type: Date },
  isDeleted: { type: Boolean, default: false,},
  deletedAt: { type: Date },

  // reviews: { type: [ReviewSchema], default: [] },
}, { timestamps: true });

// Create full-text index
ProductSchema.index({
  'name.en': 'text',
  'name.ar': 'text',
  'desc.en': 'text',
  'desc.ar': 'text',
});


// Update stock method
ProductSchema.methods.updateStock = async function (quantity: number) {
  this.stockQty -= quantity;
  this.soldQty += quantity;
  this.status = this.stockQty <= 0 ? ProductStatus.OUT_OF_STOCK : ProductStatus.AVAILABLE;
  await this.save();
};

// Pre-save hook to check for duplicate ModelNo and update status based on stock
ProductSchema.pre('save', async function (next) {
  if (!this.isNew) {
    this.status = this.stockQty <= 0 ? ProductStatus.OUT_OF_STOCK : ProductStatus.AVAILABLE;
    return next();
  }

  try {
    const existingModelNo = await this.model('Product').findOne({ modelNo: this.modelNo });
    if (existingModelNo) {
      throw new Error('Duplicate Model No detected.');
    }
    this.status = this.stockQty <= 0 ? ProductStatus.OUT_OF_STOCK : ProductStatus.AVAILABLE;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return next(error);
  }

  next();
});

export const ProductModel = model<Product>('Product', ProductSchema);



// /* eslint-disable no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import mongoose, { Schema, model } from "mongoose";
// import { Product } from "./product.interface";

// const LocalizedStringSchema = new mongoose.Schema(
//   {
//     en: { type: String, required: [true, 'English is required'] },
//     ar: { type: String, required: [true, 'Arabic is required'] },
//   },
//   { _id: false },
// );

// // Define a flexible schema for tech specifications
// const TechSpecificationSchema = new Schema({
//   key: { type: String, required: [true, 'Technical specification key is required'] },
//   value: { type: Schema.Types.Mixed, required: [true, 'Technical specification value is required'] },
// }, { _id: false });

// // Define ProductStatus as an enumeration
// export enum ProductStatus {
//   AVAILABLE = 'available',
//   OUT_OF_STOCK = 'out_of_stock',
//   DISCONTINUED = 'discontinued',
//   // Add other statuses as needed
// }

// const ProductSchema = new Schema({
//   ModelNo: { type: String, required: [true, 'Model number is required'] },
//   Name: { type: LocalizedStringSchema, required: [true, 'Product name is required'] },
//   Brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: [true, 'Brand ID is required'] },
//   Desc: { type: LocalizedStringSchema, required: [true, 'Product description is required'] },
//   StockQTY: { type: Number, required: [true, 'Stock quantity is required'] },
//   SoldQTY: { type: Number, default: 0 }, // To track the number of items sold
//   price: { type: Number, required: [true, 'Price is required'] },
//   previousPrice: { type: Number },
//   ImageURL: [{ type: String, required: [true, 'At least one image URL is required'] }],
//   CategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: [true, 'Category ID is required'] },
//   tackSpecification: { type: [TechSpecificationSchema] },
//   Status: { type: String, enum: Object.values(ProductStatus), required: [true, 'Product status is required'], default: ProductStatus.AVAILABLE },
//   ReleaseDate: { type: Date },
//   isDeleted: { type: Boolean, default: false, required: [true, 'isDeleted flag is required'] },
//   deletedAt: { type: Date },
// }, { timestamps: true });

// // Apply the ProductStatus enum as a static property
// Object.assign(ProductSchema.statics, {
//   ProductStatus,
// });
// // Method to update stock quantity
// ProductSchema.methods.updateStock = async function (quantity: number) {
//   this.StockQTY = this.StockQTY - quantity;
//   this.SoldQTY = this.SoldQTY + quantity;
//   if (this.StockQTY <= 0) {
//     this.Status = ProductStatus.OUT_OF_STOCK;
//   } else {
//     this.Status = ProductStatus.AVAILABLE;
//   }
//   await this.save();
// };

// // Pre-save hook to check for duplicate ModelNo
// // Pre-save hook to check for duplicate ModelNo and update status based on stock
// ProductSchema.pre('save', async function (next) {
//   if (!this.isNew) {
//     // Update the status based on stock quantity for existing products
//     if (this.StockQTY <= 0) {
//       this.Status = ProductStatus.OUT_OF_STOCK;
//     } else {
//       this.Status = ProductStatus.AVAILABLE;
//     }
//     return next();
//   }

//   try {
//     const existingModelNo = await this.model('Product').findOne({ ModelNo: this.ModelNo });
//     if (existingModelNo) {
//       throw new Error('Duplicate Model No detected.');
//     }

//     // Set the status based on stock quantity for new products
//     if (this.StockQTY <= 0) {
//       this.Status = ProductStatus.OUT_OF_STOCK;
//     } else {
//       this.Status = ProductStatus.AVAILABLE;
//     }
//   } catch (error: any) {
//     return next(error);
//   }

//   next();
// });



// export const ProductModel = model<Product>('Product', ProductSchema);






// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // import mongoose, { Schema, model } from "mongoose";
// // import { Product } from "./product.interface";



// // const LocalizedStringSchema = new mongoose.Schema(
// //   {
// //     en: { type: String, required:  [true, 'English is required'] },
// //     ar: { type: String, required:  [true, 'Arabic  is required'] },
// //   },
// //   { _id: false },
// // );

// // // Define a flexible schema for tech specifications
// // const TechSpecificationSchema = new Schema({
// //   key: { type: String, required: [true, 'Technical specification key is required'] },
// //   value: { type: Schema.Types.Mixed, required: [true, 'Technical specification value is required'] },
// // }, { _id: false });

// // // const ProductStatus = {
// // //   ACTIVE: 'Active',
// // //   OUTOFSTOCK: 'OutOfStock',
// // //   INACTIVE : 'Inactive ',
// // // };

// // // Define ProductStatus as an enumeration
// // const ProductStatus = Object.freeze({
// //   AVAILABLE: 'available',
// //   OUT_OF_STOCK: 'out_of_stock',
// //   DISCONTINUED: 'discontinued',
// //   // Add other statuses as needed
// // });

// // const ProductSchema = new Schema({
// //   ModelNo: { type: String, required: [true, 'Model number is required'] },
// //   Name: { type: LocalizedStringSchema, required: [true, 'Product name is required'] },
// //   Brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: [true, 'Brand ID is required'] },
// //   Desc: { type: LocalizedStringSchema, required: [true, 'Product description is required'] },
// //   StockQTY: { type: Number, required: [true, 'Stock quantity is required'] },
// //   price: { type: Number, required: [true, 'Price is required'] },
// //   previousPrice: { type: Number },
// //   ImageURL: [{ type: String, required: [true, 'At least one image URL is required'] }],
// //   CategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: [true, 'Category ID is required'] },
// //   SKU: { type: Number, required: [true, 'SKU is required'] },
// //   tackSpecification: { type: [TechSpecificationSchema] },
// //   Status: { type: String, enum: Object.values(ProductStatus), required: [true, 'Product status is required'] },
// //   ReleaseDate: { type: Date },
// //   isDeleted: { type: Boolean, default: false, required: [true, 'isDeleted flag is required'] },
// //   deletedAt: { type: Date },
// // }, { timestamps: true });

// // // Apply the ProductStatus enum as a static property
// // Object.assign(ProductSchema.statics, {
// //   ProductStatus,
// // });


// // ProductSchema.pre('save', async function (next) {
// //   if (!this.isModified('ModelNo') && !this.isModified('SKU')) return next();

// //   try {
// //     const existingModelNo = await this.model('Product').findOne({
// //       ModelNo: this.ModelNo,
// //     });
// //     if (existingModelNo) {
// //       throw new Error('Duplicate Model No detected.');
// //     }

// //     const existingSKU = await this.model('Product').findOne({ SKU: this.SKU });
// //     if (existingSKU) {
// //       throw new Error('Duplicate SKU detected.');
// //     }
// //   } catch (error: any) {
// //     next(error);
// //   }

// //   next();
// // });

// // export const ProductModel = model<Product>('Product', ProductSchema);
