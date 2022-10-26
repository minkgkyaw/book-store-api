import z from 'zod';

const createUserSchema = z.object({
	body: z.object({
		name: z
			.string({
				required_error: 'Name is required',
				invalid_type_error: 'Name is invalid type',
			})
			.min(3, 'Name must be at least 3 characters')
			.max(50, 'Name should be lower than 50 characters'),
		email: z
			.string({
				required_error: 'Email is required',
				invalid_type_error: 'Email is invalid type',
			})
			.email('Email is invalid format'),
		password: z
			.string({
				required_error: 'Password is required',
				invalid_type_error: 'Password is invalid type',
			})
			.min(6, 'Password must be at least 6 characters')
			.max(60, 'Password should be lower than 60 characters'),
		avatar: z
			.string({
				required_error: 'Avatar is required',
				invalid_type_error: 'Avatar is invalid type',
			})
			.url('Avatar should be a url')
			.optional(),
	}),
});

export default createUserSchema;

export type CreateUserSchema = z.infer<typeof createUserSchema>;
