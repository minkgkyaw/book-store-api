import { Router } from "express";
import { Validator } from "../middleware/validator";
import {
  ByAuthors,
  ByUploader,
  CreateBook,
  GetAll,
  GetById,
  Remove,
  Update,
} from "../controllers/book.controllers";
import createBookSchema from "../schema/create-book-schema";
import mongoIdSchema from "../schema/mongo-id-schema";
import updateBookSchema from "../schema/update-book-schema";
import findByAuthorsSchema from "../schema/find-by-authors-schema";
import findByUploaderSchema from "../schema/find-by-uploader-schema";

const router = Router();

router.route("/").get(GetAll).post(Validator(createBookSchema), CreateBook);

router.get("/by_authors", Validator(findByAuthorsSchema), ByAuthors);
router.get("/by_uploader", Validator(findByUploaderSchema), ByUploader);

router
  .route("/:id")
  .get(Validator(mongoIdSchema), GetById)
  .patch(Validator(mongoIdSchema), Validator(updateBookSchema), Update)
  .delete(Validator(mongoIdSchema), Remove);

export default router;
