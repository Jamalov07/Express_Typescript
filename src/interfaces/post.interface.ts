import { Document } from "mongoose";
import { IUser } from "./user.interface";

export interface IPost extends Document {
  title: string;
  image: string;
  description: string;
  owner: IUser['_id'];
}
