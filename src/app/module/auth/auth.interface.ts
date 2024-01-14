import { TUser } from "../user/user.interface";

export interface TResister extends Omit<TUser, 'role'> {}

export interface TLogin {
    body:{
        email: string;
    password: string;
    }

}


