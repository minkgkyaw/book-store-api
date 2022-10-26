import z from 'zod';

const mongoIdSchema = z.object({
	params: z.object({
		id: z
			.string({
				invalid_type_error: 'Id is not valid',
				required_error: 'Id is required',
			})
			.regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID'),
	}),
});

export default mongoIdSchema;

export type MongoIdSchema = z.infer<typeof mongoIdSchema>;
