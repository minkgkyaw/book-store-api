import { Schema, model, Model, Types } from 'mongoose';
import dotenv from 'dotenv';
import argon2 from 'argon2';
import jwt, { JwtPayload } from 'jsonwebtoken';

dotenv.config();

const secret = process.env.JWT_SECRET || 'jwt_secret';

export interface IUser {
	name: string;
	email: string;
	password: string;
	avatar?: string;
	admin?: boolean;
	books: Types.ObjectId[];
}

interface IUserMethods {
	verifyPassword: (plain: string) => Promise<Boolean>;
	createToken: () => string;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, {}, IUserMethods>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		avatar: String,
		admin: { type: String, default: false },
		books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
			transform: (_doc, ret) => {
				delete ret.password;
				delete ret.__v;
				delete ret._id;
				return ret;
			},
		},
	},
);

UserSchema.pre('save', async function (next) {
	if (!this.isNew) return next();

	try {
		const admin = process.env.ADMIN || 'admin@admin.com';
		if (this.email === admin) {
			this.admin = true;
		}
		this.password = await argon2.hash(this.password);
		return next();
	} catch (err: any) {
		return next(err);
	}
});

UserSchema.methods.verifyPassword = async function (plain: string) {
	try {
		console.log(this.password);
		return await argon2.verify(this.password, plain);
	} catch (error) {
		throw error;
	}
};

UserSchema.methods.createToken = function () {
	const payload = { email: this.email, sub: this._id } as JwtPayload;

	const options = { expiresIn: '1yr' };

	return jwt.sign(payload, secret, options);
};

const User = model<IUser, UserModel>('User', UserSchema);

export default User;
