import mongoose, {  model } from 'mongoose';
// import { RoomCategory, TRoom } from './room.interface';
import AppError from '../../Error/errors/AppError';
import httpStatus from 'http-status';
import { TRoom } from './room.interface';

// const priceOptionSchema = new mongoose.Schema({
//   price: { type: Number, required: [true, 'Price is required'] },
//   currency: { type: String, required: [true, 'Currency is required'] },
//   // taxesAndCharges: { type: Number, required: [true, 'Taxes and charges are required'] },
//   breakfast: { type: String, required: [true, 'Breakfast information is required'] },
//   cancellation: { type: String, required: [true, 'Cancellation policy is required'] },
//   prepayment: { type: String, required: [true, 'Prepayment information is required'] },
//   refundable: { type: Boolean, required: [true, 'Refundable status is required'] },
// });



// const roomSchema = new mongoose.Schema({
//   title: { type: String, required: [true, 'Room title is required'] },
//   // type: { type: [RoomCategorySchema], required: [true, 'Price options are required'] },
//   type: {
//     type: Schema.Types.ObjectId,
//     ref: 'Category',
//     required: true,
// },
//   description: { type: String, required: [true, 'Room description is required'] },
//   maxGuests: { type: Number, required: [true, 'Maximum number of guests is required'] },
//   roomQTY: { type: Number, required: [true, 'Room quantity is required'] },
//   size: { type: String, required: [true, 'Room size is required'] },

//   features: { type: [{ type: String, required: true }], required: [true, 'Room features are required'] },
//   images: { type: [{ type: String, required: true }], required: [true, 'Room images are required'] },
//   priceOptions: { type: [priceOptionSchema], required: [true, 'Price options are required'] },
//   isDeleted: { type: Boolean, default: false },
//   isActive: { type: Boolean, default: true },
// }, { timestamps: true });\



const localizedFeatureSchema = new mongoose.Schema({
  en: { type: String, required: true },
  ar: { type: String, required: true },
  icon: { type: String }
});

const priceOptionSchema = new mongoose.Schema({
  price: { type: Number, required: [true, 'Price is required'] },
  currency: {
    en: { type: String, required: [true, 'English Currency is required'] },
    ar: { type: String, required: [true, 'Arabic Currency is required'] }
  },
  taxesAndCharges: { type: String, required: [true, 'Taxes and charges are required'] },
  breakfast: {
    en: { type: String, required: [true, 'English breakfast information is required'] },
    ar: { type: String, required: [true, 'Arabic breakfast information is required'] }
  },
  cancellation: {
    en: { type: String, required: [true, 'English cancellation policy is required'] },
    ar: { type: String, required: [true, 'Arabic cancellation policy is required'] }
  },
  prepayment: {
    en: { type: String, required: [true, 'English prepayment information is required'] },
    ar: { type: String, required: [true, 'Arabic prepayment information is required'] }
  },
  refundable: { type: Boolean, required: [true, 'Refundable status is required'] },
});


const roomSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: [true, 'English room title is required'] },
    ar: { type: String, required: [true, 'Arabic room title is required'] }
  },
  subTitle: {
    roomOne: {
      en: { type: String, required: [true, 'English subtitle for room one is required'] },
      ar: { type: String, required: [true, 'Arabic subtitle for room one is required'] }
    },
    roomTwo: {
      en: { type: String, required: false },
      ar: { type: String, required: false }
    }
  },
  
  description: {
    en: { type: String, required: [true, 'English room description is required'] },
    ar: { type: String, required: [true, 'Arabic room description is required'] }
  },
  maxGuests: { type: Number, required: [true, 'Maximum number of guests is required'] },
  roomQTY: { type: Number, required: [true, 'Room quantity is required'] },
  size: {
    en: { type: String, required: [true, 'English room size is required'] },
    ar: { type: String, required: [true, 'Arabic room size is required'] }
  },
  features: [localizedFeatureSchema],
  services: [localizedFeatureSchema],
 
  images: { type: [{ type: String, required: true }], required: [true, 'Room images are required'] },
  priceOptions: { type: [priceOptionSchema], required: [true, 'Price options are required'] },
  isDeleted: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  }
}, { timestamps: true });




roomSchema.pre('save', async function (next) {
  // console.log(`Checking for existing room with type: ${this.type}, maxGuests: ${this.maxGuests}`);
  if (this.isNew || this.isModified('title')) {
    const existingRoom = await RoomModel.findOne({
      _id: { $ne: this._id }, // Exclude the current document
      title: this.title,
     
    });

    if (existingRoom) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'A room with this title already exists.',
      );
    }
  }
  next();
});

export const RoomModel = model<TRoom>('Room', roomSchema);
