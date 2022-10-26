import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import User from "../models/User.model";
import { CreateUserSchema } from "../schema/create-user-schema";
import { LoginSchema } from "../schema/login-schema";
import { MongoIdSchema } from "../schema/mongo-id-schema";
import { UpdateUserSchema } from "../schema/update-user-schema";
import argon2 from "argon2";
import Book from "../models/Book.model";

export const GetAll = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { take, skip } = req.query;

      const limit = take !== undefined ? Number(take) : 50;
      const offset = skip !== undefined ? Number(skip) : 0;
      const user = await User.find().skip(offset).limit(limit);

      res.status(200).json({
        meta: {
          total: user.length,
        },
        data: user,
        links: {
          self: "https://mkk-book-store.herokuapp.com/api/v1/users",
          users: "https://mkk-book-store.herokuapp.com/api/v1/users",
          books: "https://mkk-book-store.herokuapp.com/api/v1/books",
        },
      });
    } catch (err) {
      return next(err);
    }
  }
);

export const Register = expressAsyncHandler(
  async (
    req: Request<unknown, unknown, CreateUserSchema["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    const newUser = new User(req.body);
    const user = await newUser.save();

    if (!user) return next(createHttpError(409, "Failed to register user"));

    const token = user.createToken();

    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 356,
      httpOnly: true,
    });
    res.status(202).json({
      meta: {
        message: "Register success",
        id: user.id,
      },
      data: {
        token,
      },
      links: {
        self: "https://mkk-book-store.herokuapp.com/api/v1/usersregister",
        users: "https://mkk-book-store.herokuapp.com/api/v1/users",
        books: "https://mkk-book-store.herokuapp.com/api/v1/books",
      },
    });
  }
);

export const Login = expressAsyncHandler(
  async (
    req: Request<unknown, unknown, LoginSchema["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user)
        return next(createHttpError(404, "Incorrect email or password"));

      const isMatchPwd = await user.verifyPassword(req.body.password);

      if (!isMatchPwd)
        return next(createHttpError(403, "Incorrect email or password"));

      const token = user.createToken();

      res
        .cookie("token", token, {
          maxAge: 1000 * 60 * 60 * 24 * 365,
          httpOnly: true,
        })
        .status(200)
        .json({
          meta: {
            message: "Login successful",
            id: user.id,
          },
          data: {
            token,
          },
          links: {
            self: "https://mkk-book-store.herokuapp.com/api/v1/users/login",
            users: "https://mkk-book-store.herokuapp.com/api/v1/users",
            books: "https://mkk-book-store.herokuapp.com/api/v1/books",
          },
        });
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
    try {
      const user = await User.findById(req.params.id).populate("books", [
        "id",
        "title",
        "author",
      ]);

      if (!user) return next(createHttpError(404, "User not found"));

      res.status(200).json({
        meta: {
          message: "User found",
          id: user.id,
        },
        data: User,
        links: {
          self: `https://mkk-book-store.herokuapp.com/api/v1/users/${user.id}`,
          users: "https://mkk-book-store.herokuapp.com/api/v1/users",
          books: "https://mkk-book-store.herokuapp.com/api/v1/books",
        },
      });
    } catch (err) {
      return next(err);
    }
  }
);

export const Profile = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const profile = await User.findOne({
        id: user?.sub,
        email: user?.email,
      });

      if (!profile)
        return next(createHttpError(404, "Can't find your profile"));

      res.status(200).json({
        meta: { id: profile.id },
        data: profile,
        links: {
          self: "https://mkk-book-store.herokuapp.com/api/v1/users/profile",
          users: "https://mkk-book-store.herokuapp.com/api/v1/users",
          books: "https://mkk-book-store.herokuapp.com/api/v1/books",
        },
      });
    } catch (err) {
      return next(err);
    }
  }
);

export const Update = expressAsyncHandler(
  async (
    req: Request<unknown, {}, UpdateUserSchema["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { sub: id } = req.user;

      console.log(id);

      const { name, email, password, avatar } = req.body;
      let updatedPassword;
      if (password !== undefined) {
        updatedPassword = await argon2.hash(password);
      }

      const user = await User.findByIdAndUpdate(
        id,
        {
          name,
          email,
          avatar,
          password: updatedPassword,
        },
        { new: true }
      );

      if (!user) return next(createHttpError(404, "User not found"));

      res
        .status(200)
        .json({
          meta: { message: "Successfully updated" },
          data: user,
          links: {
            self: "https://mkk-book-store.herokuapp.com/api/v1/users/profile",
            users: "https://mkk-book-store.herokuapp.com/api/v1/users",
            books: "https://mkk-book-store.herokuapp.com/api/v1/books",
          },
        });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }
);

export const Remove = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sub: id } = req.user;

      const user = await User.findByIdAndRemove(id);

      if (!user) return next(createHttpError(404, "User not found"));

      await Book.deleteMany({ uploader: user?._id });

      res.clearCookie("token").sendStatus(204);
    } catch (err) {
      return next(err);
    }
  }
);
