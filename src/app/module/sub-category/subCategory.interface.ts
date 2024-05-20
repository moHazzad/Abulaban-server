import mongoose from 'mongoose';

export type LocalizedString = {
  en: string;
  ar: string;
  [key: string]: string; // Add this line
};

export type TSubCategory = {
  _id: mongoose.Types.ObjectId;
  categoryTitle: LocalizedString;
  image: string,
  ParentCategory: mongoose.Types.ObjectId | string;
};
