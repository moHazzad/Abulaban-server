import mongoose from "mongoose";

export type LocalizedString = {
    en: string;
    ar: string;
  };
  
  export type TBrand = {
    _id: mongoose.Types.ObjectId;
    Name: LocalizedString;
    image?: string
  };