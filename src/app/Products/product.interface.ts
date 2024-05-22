/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
import { Document, Types } from 'mongoose';
// import { TBrand } from '../module/brand/brand.interface';
// import { TSubCategory } from '../module/sub-category/subCategory.interface';

interface LocalizedString {
  en: string;
  ar: string;
}

interface TechSpecification {
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

 enum ProductStatus {
  AVAILABLE = 'available',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued'
}

interface TBrand extends Document {
  Name: LocalizedString;
}

interface TSubCategory extends Document {
  categoryTitle: LocalizedString;
}

export interface Product extends Document {
  ModelNo: string;
  Name: LocalizedString;
  Brand: Types.ObjectId | TBrand;
  Desc: LocalizedString;
  StockQTY: number;
  SoldQTY: number;
  price: number;
  previousPrice?: number;
  ImageURL: string[];
  CategoryId: Types.ObjectId | TSubCategory;
  tackSpecification?: TechSpecification[];
  Status: ProductStatus;
  ReleaseDate?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  // eslint-disable-next-line no-unused-vars
  updateStock(quantity: number): Promise<void>;
}



// import mongoose from "mongoose";
// import { TSubCategory } from "../module/sub-category/subCategory.interface";

// export interface LocalizedString  {
//   en: string;
//   ar: string;
//   [key: string]: string; // Add this line
// }
  
// export type TechSpecification = {
//   [key: string]: string | number; // Allows any string as a key, and the value can be a string or a number
// };
  
//   export enum ProductStatus {
//     Available = "Active",
//     OutOfStock = "OutOfStock",
//     INACTIVE  = "Inactive ",
// }

// export type Product = {
//     ModelNo: string;
//     Name: LocalizedString ;
//     Brand: mongoose.Schema.Types.ObjectId ;
//     Desc: LocalizedString;
//     StockQTY: number;
//     price:number;
//     previousPrice?: number;
//     ImageURL: string[];
//     CategoryId: mongoose.Schema.Types.ObjectId | TSubCategory ;
//     SKU: number;
//     tackSpecification?: TechSpecification;
//     Status: ProductStatus;
//     ReleaseDate?: Date;  // Optional field if you track product release dates
//     isDeleted: boolean,
//     deletedAt?: Date,
// };


  // export type PopulatedProduct = {
  //   ModelNo: string;
  //   Name: LocalizedString ;
  //   Brand: string;
  //   Desc: LocalizedString;
  //   StockQTY: number;
  //   price:number;
  //   previousPrice?: number;
  //   ImageURL: string[];
  //   CategoryId: TSubCategory | mongoose.Schema.Types.ObjectId; // Assuming this links to another collection/document
  //   SKU: number;
  //   tackSpecification?: TechSpecification;
  //   Status: ProductStatus;
  //   ReleaseDate?: Date;  // Optional field if you track product release dates
  // }