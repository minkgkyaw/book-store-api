import z from "zod";

const findByUploaderSchema = z.object({
  body: z.object({
    uploader: z
      .string({
        required_error: "Uploader is required",
        invalid_type_error: "Uploader is invalid type",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Uploader id"),
  }),
});

export default findByUploaderSchema;

export type FindByUploaderSchema = z.infer<typeof findByUploaderSchema>;
