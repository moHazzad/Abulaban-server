/* eslint-disable no-unused-vars */

// import mongoose from "mongoose";




// export type PriceOption = {
//   price: number;
//   currency: string;
//   taxesAndCharges: number;
//   breakfast: string;
//   cancellation: string;
//   prepayment: string;
//   refundable: boolean;
// };

// export type TRoom = {
//   title: string;
//   type: mongoose.Schema.Types.ObjectId;
//   description: string;
//   maxGuests: number;
//   roomQTY: number;
//   size: string;
//   features: string[];
//   images: string[];
//   priceOptions: PriceOption[];
// };

import mongoose from "mongoose";

export type RoomQuery = {
  type?: mongoose.Types.ObjectId;
  maxGuests?: { $gte: number };
  // Add other properties as needed, potentially with MongoDB query operators
};

export type SortOrder = 'asc' | 'desc';
// export type MaxGuestsType = number | null;

export type LanguageKey = 'en' | 'ar';

export type PriceOption = {
  price: number;
  currency: {
    en: string;
    ar: string;
  };
  taxesAndCharges: string;
  breakfast: {
    en: string;
    ar: string;
  };
  cancellation: {
    en: string;
    ar: string;
  };
  prepayment: {
    en: string;
    ar: string;
  };
  refundable: boolean;
};

export type LocalizedString = {
  en: string;
  ar: string;
  icon: string;
};

export type TRoom = {
  title: LocalizedString;
  type: mongoose.Schema.Types.ObjectId;
  description: LocalizedString;
  maxGuests: number;
  roomQTY: number;
  size: LocalizedString;
  features: LocalizedString[];
  services: LocalizedString[];
  images: string[];
  priceOptions: PriceOption[];
};
