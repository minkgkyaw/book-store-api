import { Schema, model, Types } from "mongoose";

export interface IBook {
  title: string;
  author: string;
  description?: string;
  price?: number;
  uploader: Types.ObjectId;
  cover?: string;
}

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: String,
    price: { type: Number, default: 0.0 },
    uploader: { type: Schema.Types.ObjectId, ref: "User" },
    cover: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.__v;
        delete ret._id;
        return ret;
      },
    },
  }
);

const Book = model<IBook>("Book", BookSchema);

export default Book;
