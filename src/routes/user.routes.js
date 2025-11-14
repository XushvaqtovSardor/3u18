import express from 'express';
import {register,login,getAllUsers,getUserById,updateUser,deleteUser,} from '../controller/user.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {registerSchema,loginSchema,updateUserSchema,} from '../validators/user.validator.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/', authenticate, authorize('admin'), getAllUsers);
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, validate(updateUserSchema), updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

export default router;
