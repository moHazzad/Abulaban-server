import mongoose from 'mongoose';
import { TCategory } from '../Category/Category.interface';

export type LocalizedString = {
  en: string;
  ar: string;
  [key: string]: string; // Add this line
};

export type TSubCategory = {
  _id: mongoose.Types.ObjectId;
  Name: LocalizedString;
  image: string,
  CategoryId: mongoose.Types.ObjectId | TCategory ;
}
