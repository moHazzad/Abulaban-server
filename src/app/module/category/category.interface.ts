
export type LocalizedString = {
  en: string;
  ar: string;
};

export type BedroomInfo = {
  bedroomNumber: number;
  beds: LocalizedString; // Updated to support localization
};

export type TRoomCategory = {
  categoryTitle: LocalizedString; // Updated to support localization
  bedrooms: BedroomInfo[];
};


// export type BedroomInfo = {
//     bedroomNumber: number;
//     beds: string;
//   };

  
// export type TRoomCategory ={
//     categoryTitle: string;
//     bedrooms: BedroomInfo[];
//   }