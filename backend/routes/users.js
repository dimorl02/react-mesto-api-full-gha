const userRouter = require('express').Router();
const { validateUserId, validateUpdateProfile, validateUpdateAvatar } = require('../middlewares/validation');
const {
  getUsers,
  getUser,
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUser);
userRouter.get('/:userId', validateUserId, getUser);
userRouter.patch('/me', validateUpdateProfile, updateUserProfile);
userRouter.patch('/me/avatar', validateUpdateAvatar, updateUserAvatar);

module.exports = userRouter;
