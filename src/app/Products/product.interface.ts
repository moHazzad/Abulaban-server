/* eslint-disable no-unused-vars */
import mongoose from "mongoose";
import { TSubCategory } from "../module/sub-category/subCategory.interface";

export interface LocalizedString  {
  en: string;
  ar: string;
  [key: string]: string; // Add this line
}
  
export type TechSpecification = {
  [key: string]: string | number; // Allows any string as a key, and the value can be a string or a number
};
  
  export enum ProductStatus {
    Available = "Active",
    OutOfStock = "OutOfStock",
    INACTIVE  = "Inactive ",
}

export type Product = {
    ModelNo: string;
    Name: LocalizedString ;
    Brand: string;
    Desc: LocalizedString;
    StockQTY: number;
    price:number;
    previousPrice?: number;
    ImageURL: string[];
    CategoryId: mongoose.Schema.Types.ObjectId | TSubCategory ;
    SKU: number;
    tackSpecification?: TechSpecification;
    Status: ProductStatus;
    ReleaseDate?: Date;  // Optional field if you track product release dates
    isDeleted: boolean,
    deletedAt?: Date,
};


  export type PopulatedProduct = {
    ModelNo: string;
    Name: LocalizedString ;
    Brand: string;
    Desc: LocalizedString;
    StockQTY: number;
    price:number;
    previousPrice?: number;
    ImageURL: string[];
    CategoryId: TSubCategory | mongoose.Schema.Types.ObjectId; // Assuming this links to another collection/document
    SKU: number;
    tackSpecification?: TechSpecification;
    Status: ProductStatus;
    ReleaseDate?: Date;  // Optional field if you track product release dates
  }