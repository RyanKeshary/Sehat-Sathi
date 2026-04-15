import express from 'express';
import { getDoctorStats, updateDoctorProfile } from '../controllers/doctorController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('doctor', 'admin'));

router.get('/stats', getDoctorStats);
router.put('/profile', updateDoctorProfile);

export default router;
