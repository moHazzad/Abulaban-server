/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { model } from 'mongoose';
import { TBooking } from './booking.interface';
// import { RoomModel } from '../room/room.model';


const formDataSchema = new mongoose.Schema({
    address: String,
    arrivalTime: String,
    city: String,
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    message: String,
    phone: { type: String, required: true }
  });
  
  const bookingSchema = new mongoose.Schema({
    userEmail: { type: String, required: true, ref: 'User' }, // Assuming a User model exists
    roomId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Room' }, // Assuming a Room model exists
  
    formData: { type: formDataSchema, required: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    night: { type: Number, required: true },
    numberOfGuests: { type: Number, required: true },
    tax: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    totalWithTax: { type: Number, required: true },
    bookingStatus: { 
      type: String, 
      required: true, 
      enum: [ 'Booked', 'cancelled','completed'],
      default:"Booked"
    },
    paymentStatus: { 
      type: String, 
      required: true, 
      enum: ['pending', 'paid'],
      default:"pending"
    }
  },{timestamps:true});

// const bookingSchema = new Schema({
//   userID: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//   },
//   roomId: {
//       type: Schema.Types.ObjectId,
//       ref: 'Room',
//       required: true,
//   },
//   checkInDate: {
//       type: String,
//       required: true,
//   },
//   checkOutDate: {
//       type: String,
//       required: true,
//   },
//   numberOfNights: {
//       type: Number,
//       required: true,
//   },
//   totalCost: {
//       type: Number,
//       required: true,
//   },
//   bookingStatus: {
//     type: String,
//     enum: ['pending', 'Booked', 'cancelled'],
//     required: true,
//     default:"pending"
//   },
//   paymentStatus: {
//       type: String,
//       enum: ['pending', 'paid'],
//       required: true,
//       default:"pending"
//   },
//   bookRoomQTY: {
//       type: Number,
//       required: true,
//   },
//   isCancelled:{
//     type : Boolean ,
//     default : false
//   }
// }, { timestamps: true });




// bookingSchema.pre('save', async function(next) {
    // 'this' refers to the booking document being saved
//     console.log('Room ID:', this.roomID);
// console.log('Check-in Date:', this.checkInDate);
// console.log('Check-out Date:', this.checkOutDate);
// console.log('Requested Room Quantity:', this.bookRoomQTY);

    // try {
    //     const overlappingBookings = await BookingModel.find({
    //         roomID: this.roomID,
    //         $or: [
    //             { checkInDate: { $lte: this.checkOutDate }, checkOutDate: { $gt: this.checkInDate } }
    //         ],
    //         _id: { $ne: this._id } // Exclude the current booking if it's an update
    //     });

    //     // Calculate total booked rooms for the given room type within the date range
    //     const totalBookedRooms = overlappingBookings.reduce((sum, booking) => sum + booking.bookRoomQTY, 0);
    //     // console.log('Total Booked Rooms:', totalBookedRooms);
        
    //     // Fetch the total room quantity from the room collection
    //     const room = await RoomModel.findById(this.roomID);
    //     if (!room) {
    //         return next(new Error('Room not found'));
    //     }
        
    //     // Check if enough rooms are available
    //     if (room.type - totalBookedRooms < this.bookRoomQTY) {
    //         // console.log('Total Room Quantity:', room.RoomQTY);
    //         return next(new Error(`rooms available ${room.type - totalBookedRooms}. Please reduce the quantity or choose another room or date.`));
    //     }

    //     // Proceed with the booking
    //     next();
    // } catch (error:any) {
    //     // Handle any errors that occur during the booking process
        
    //     next(error);
    // }
// });




const BookingModel = model<TBooking>('Booking', bookingSchema);

export default BookingModel;
