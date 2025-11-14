import express from 'express';
import { UserController } from '../controller/user.controller.js';

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/refresh-token', UserController.refreshToken);
router.post('/logout', UserController.logout);

router.route('/:id')
  .put(UserController.update)
  .delete(UserController.delete);

export { router as userRouter };
