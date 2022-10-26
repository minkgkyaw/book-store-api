import z from "zod";

const findByAuthorsSchema = z.object({
  body: z.object({
    author: z
      .string({
        required_error: "Author is required",
        invalid_type_error: "Author is invalid type",
      })
      .min(3, "Author must be at least 3 characters")
      .max(100, "Author should be lower than 100 characters"),
  }),
});

export default findByAuthorsSchema;

export type FindByAuthorsSchema = z.infer<typeof findByAuthorsSchema>;
