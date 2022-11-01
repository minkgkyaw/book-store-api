import { Router } from 'express';
import {
	GetAll,
	GetById,
	Login,
	Profile,
	Register,
	Remove,
	Update,
} from '../controllers/user.controllers';
import CheckAuth from '../middleware/check-authorization';
import { Validator } from '../middleware/validator';
import loginSchema from '../schema/login-schema';
import mongoIdSchema from '../schema/mongo-id-schema';
import updateUserSchema from '../schema/update-user-schema';

const router = Router();

router.route('/').get(CheckAuth, GetAll);

router
	.route('/profile')
	.get(CheckAuth, Profile)
	.patch(Validator(updateUserSchema), CheckAuth, Update)
	.delete(CheckAuth, Remove);

router.post('/register', Register);

router.post('/login', Validator(loginSchema), Login);

router.get('/:id', Validator(mongoIdSchema), GetById);

export default router;
