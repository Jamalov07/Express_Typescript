import { IPost } from "./../interfaces/post.interface";
import { Document, Schema, model } from "mongoose";

const postSchema: Schema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const postModel = model<IPost & Document>("Post", postSchema);

export default postModel;
