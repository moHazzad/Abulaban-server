/* eslint-disable no-unused-vars */
import { Document, Types } from 'mongoose';
import { TBrand } from '../brand/brand.interface';
import { TSubCategory } from '../sub-category/subCategory.interface';
import { TCategory } from '../Category/Category.interface';
import { LanguageKey } from '../../utils/Common.interface';

// export interface Review extends Document {
//   userId: Types.ObjectId;
//   productId: Types.ObjectId;
//   rating: number;
//   comment: string;
//   createdAt: Date;
// }

export interface SearchParams {
  query: string;
  lang: string;
  limit?: number;
  page?: number;
}

export interface GetProductsParams {
  lang: LanguageKey;
  page?: number;
  limit?: number;
  category?: string;
  brands?: string[];
}

interface LocalizedString {
  en: string;
  ar: string;
}

interface LocalizedHighlights {
  en: string[];
  ar: string[];
}


interface TechSpecification {
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

// eslint-disable-next-line no-unused-vars
export enum ProductStatus {
  AVAILABLE = 'available',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued'
}

export interface Product extends Document {
  modelNo: string;
  name: LocalizedString;
  brand: Types.ObjectId | TBrand;
  desc: LocalizedString;
  stockQty: number;
  type: LocalizedString;
  soldQty: number;
  price: number;
  previousPrice?: number;
  imageURLs: string[];
  subCategoryId: Types.ObjectId | TSubCategory;
  categoryId: Types.ObjectId | TCategory;
  techSpecifications?: TechSpecification[];
  status: ProductStatus;
  releaseDate?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  highlights: LocalizedHighlights;
  // eslint-disable-next-line no-unused-vars
  updateStock(quantity: number): Promise<void>;
}

export type CreateProductInput = Omit<Product, '_id' | 'updateStock' | 'deletedAt' | 'releaseDate'>;
// interface TBrand extends Document {
//   Name: LocalizedString;
// }

// interface TCategory extends Document {
//   Name: LocalizedString;
// }

// interface TSubCategory extends Document {
//   Name: LocalizedString;
// }