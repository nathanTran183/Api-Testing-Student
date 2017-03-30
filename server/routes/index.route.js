import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import classRoutes from './class.route';
import accInfoRoutes from './accInfo.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount class routes at /classes
router.use('/classes', classRoutes);

// mount account info routes at /accInfo
router.use('/accInfo', accInfoRoutes);

export default router;
