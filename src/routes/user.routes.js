import express from 'express';
import { userController } from '../controller/user.controller.js';
import { authGuard, roleGuard, selfGuard } from '../middlewares/guards.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
} from '../validators/user.validator.js';

const router = express.Router();

const {
  register,
  verifyOTP,
  login,
  refreshToken,
  getMe,
  logout,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = userController;

router.post('/register', validate(registerSchema), register);
router.post('/verify-otp', verifyOTP);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refreshToken);
router.get('/me', authGuard, getMe);
router.post('/logout', authGuard, logout);
router.get('/', authGuard, roleGuard('admin'), getAllUsers);
router.get('/:id', authGuard, getUserById);
router.put(
  '/:id',
  authGuard,
  selfGuard,
  validate(updateUserSchema),
  updateUser
);
router.delete('/:id', authGuard, roleGuard('admin'), deleteUser);

export default router;
