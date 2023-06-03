import { IUser } from "./../interfaces/user.interface";
import { Schema, model, Document } from "mongoose";

const userSchema: Schema = new Schema(
  {
    fullname: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = model<IUser & Document>("User", userSchema);

export default userModel;
