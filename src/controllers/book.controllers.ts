import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import Book from "../models/Book.model";
import User from "../models/User.model";
import { CreateBookSchema } from "../schema/create-book-schema";
import { MongoIdSchema } from "../schema/mongo-id-schema";
import { UpdateBookSchema } from "../schema/update-book-schema";
import { FindByAuthorsSchema } from "../schema/find-by-authors-schema";
import { FindByUploaderSchema } from "../schema/find-by-uploader-schema";

export const GetAll = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { take, skip } = req.query;

      const limit = take !== undefined ? Number(take) : 50;
      const offset = skip !== undefined ? Number(skip) : 0;

      const books = await Book.find()
        .limit(limit)
        .skip(offset)
        .populate("uploader", ["name", "id"]);

      res.status(200).json(books);
    } catch (err) {
      return next(err);
    }
  }
);

export const CreateBook = expressAsyncHandler(
  async (
    req: Request<unknown, unknown, CreateBookSchema["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { sub: uploader } = req.user;

      const { title, author, description, price, cover } = req.body;

      let book = await Book.create({
        title,
        author,
        uploader,
        description,
        price,
        cover,
      });

      await User.updateMany({ _id: uploader }, { $push: { books: book.id } });

      book = await book.populate("uploader", ["name", "id"]);

      if (!book) return next(createHttpError(409, "Can't create book"));

      res.status(202).json(book);
    } catch (err) {
      return next(err);
    }
  }
);

export const GetById = expressAsyncHandler(
  async (
    req: Request<MongoIdSchema["params"]>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;

    const book = await Book.findById(id).populate("uploader", ["name", "id"]);

    if (!book)
      return next(createHttpError(404, "Your requested book was not found"));

    res.status(200).json(book);
    try {
    } catch (err) {
      return next(err);
    }
  }
);

export const Update = expressAsyncHandler(
  async (
    req: Request<MongoIdSchema["params"], unknown, UpdateBookSchema["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      const { author, title, description, price, cover } = req.body;

      console.log(title);

      const book = await Book.findByIdAndUpdate(
        id,
        { author, title, description, price, cover },
        { new: true }
      ).populate("uploader", ["name", "id"]);

      res.status(200).json(book);
    } catch (err) {
      return next(err);
    }
  }
);

export const Remove = expressAsyncHandler(
  async (
    req: Request<MongoIdSchema["params"], unknown>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { sub: userId } = req.user;
      const { id } = req.params;

      const book = await Book.findByIdAndRemove(id);

      if (!book) return next(createHttpError(404, "Book not found"));

      await User.updateMany({ _id: userId }, { $pull: { books: book._id } });

      res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  }
);

export const ByAuthors = expressAsyncHandler(
  async (
    req: Request<unknown, unknown, FindByAuthorsSchema["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { author } = req.body;

      console.log(author);

      let { take, skip } = req.query;

      const limit = take !== undefined ? Number(take) : 50;
      const offset = skip !== undefined ? Number(skip) : 0;

      const books = await Book.find({ author })
        .populate("uploader", ["name", "id"])
        .limit(limit)
        .skip(offset);

      res.status(200).json(books);
    } catch (err) {
      return next(err);
    }
  }
);

export const ByUploader = expressAsyncHandler(
  async (
    req: Request<unknown, unknown, FindByUploaderSchema["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { uploader } = req.body;
      let { take, skip } = req.query;

      const limit = take !== undefined ? Number(take) : 50;
      const offset = skip !== undefined ? Number(skip) : 0;

      const books = await Book.find({ uploader })
        .populate("uploader", ["name", "id"])
        .limit(limit)
        .skip(offset);

      res.status(200).json(books);
    } catch (err) {
      return next(err);
    }
  }
);
