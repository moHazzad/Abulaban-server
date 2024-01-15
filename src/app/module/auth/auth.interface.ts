import { TUser } from "../user/user.interface";

export interface TResister extends Omit<TUser, 'role'> {}

export interface TLogin {
    
    email: string;
    password: string;


}


