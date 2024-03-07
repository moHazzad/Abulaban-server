export type LocalizedString = {
    en: string;
    ar: string;
  };
  
  export type TMainCategory = {
    Name: LocalizedString;
    ParentCategory?: null
     // Updated to support localization
  };
  
//   export type TRoomCategory = {
//     categoryTitle: LocalizedString; // Updated to support localization
//     bedrooms?: BedroomInfo[];
//   };
  