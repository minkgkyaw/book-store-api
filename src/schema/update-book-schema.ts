import z from 'zod';

const updateBookSchema = z.object({
	body: z.object({
		title: z
			.string({
				required_error: 'Title is required',
				invalid_type_error: 'Title is invalid type',
			})
			.min(3, 'Title must be at least 3 characters')
			.max(100, 'Title should be lower than 100 characters')
			.optional(),
		author: z
			.string({
				required_error: 'Author is required',
				invalid_type_error: 'Author is invalid type',
			})
			.min(3, 'Author must be at least 3 characters')
			.max(60, 'Author should be lower than 60 characters')
			.optional(),
		description: z
			.string({
				required_error: 'Description is required',
				invalid_type_error: 'Description is invalid type',
			})
			.max(2000, 'Description should be lower than 60 characters')
			.optional(),
		cover: z
			.string({
				required_error: 'Cover is required',
				invalid_type_error: 'Cover is invalid type',
			})
			.url('Cover should be a url')
			.optional(),
		price: z
			.string({
				required_error: 'Price is required',
				invalid_type_error: 'Price is invalid type',
			})
			.max(6, 'Price should be lower than 6 characters')
			.optional(),
	}),
});

export default updateBookSchema;

export type UpdateBookSchema = z.infer<typeof updateBookSchema>;
