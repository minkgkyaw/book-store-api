import z from 'zod';

const loginSchema = z.object({
	body: z.object({
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
	}),
});

export default loginSchema;

export type LoginSchema = z.infer<typeof loginSchema>;
