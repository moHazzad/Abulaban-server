// import mongoose from "mongoose";

import mongoose from "mongoose";



export type LocalizedString = {
    en: string;
    ar: string;
  };
  
  export type TCategory = {
    _id: mongoose.Types.ObjectId;
    Name: LocalizedString;
    image: string;
     // Updated to support localization
  };
  
//   export type PopulatedSubCategory = {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     Name: any;
//     id: string;
//     categoryTitle: string;
//     image:string;
//     ParentCategory: TCategory | null;  // Use your main category type here
//     // Other fields of subcategory...
// };
//   export type TRoomCategory = {
//     categoryTitle: LocalizedString; // Updated to support localization
//     bedrooms?: BedroomInfo[];
//   };
  