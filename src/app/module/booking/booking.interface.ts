import mongoose from 'mongoose';

type formData = {
  address?: string;
  arrivalTime?: string;
  city?: string;
  email: string;
  firstName: string;
  lastName: string;
  message?: string;
  phone: string;
};

export type TBooking = {
  userEmail: string; // Foreign key referencing the user
  roomId: mongoose.Schema.Types.ObjectId;

  formData: formData;
  checkIn: string;
  checkOut: string;
  night: number;
  numberOfGuests: number;
  tax: number;
  totalPrice: number;
  totalWithTax: number;
  bookingStatus: 'pending' | 'Booked' | 'cancelled';
  paymentStatus: 'pending' | 'paid';
};

// export type TBooking = {
//     userID: mongoose.Schema.Types.ObjectId; // Foreign key referencing the user
//     roomId: mongoose.Schema.Types.ObjectId; // Foreign key referencing the room
//     checkInDate: string;
//     checkOutDate: string;
//     numberOfNights: number;
//     totalCost: number;
//     bookingStatus: 'pending' | 'Booked' | 'cancelled';
//     paymentStatus: 'pending' | 'paid';
//     bookRoomQTY: number;
//     isCancelled: boolean
//   };
