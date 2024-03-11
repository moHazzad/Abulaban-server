import mongoose from "mongoose";

export type LocalizedString = {
    en: string;
    ar: string;
  };
  
  export type TSubCategory = {
    categoryTitle: LocalizedString;
    ParentCategory: mongoose.Types.ObjectId | string;
  };