import express from "express";
import http from "http";
import consola from "consola";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import toobusy from "./middleware/toobusy";
import notFoundHandler from "./middleware/not-found-handler";
import ErrorHandler from "./middleware/error-handler";
import userRoutes from "./routes/user.routes";
import dotenv from "dotenv";
import bookRoutes from "./routes/book.routes";
import CheckAuth from "./middleware/check-authorization";

dotenv.config();
const app = express();

// global middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(toobusy);

// routers
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/books", CheckAuth, bookRoutes);

// error handler
app.use(notFoundHandler);
app.use(ErrorHandler);

const server = http.createServer(app);

const port = process.env.PORT || 5000;

server.listen(port, async () => {
  const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/book-store";
  await mongoose.connect(dbUrl);
  consola.info("Connected to DB");
  consola.success(`Server listening on ${port}`);
});
