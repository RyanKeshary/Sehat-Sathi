import express from 'express';
import { bookAppointment, getMyAppointments, updateAppointmentStatus } from '../controllers/appointmentController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', restrictTo('patient'), bookAppointment);
router.get('/my', getMyAppointments);
router.patch('/:id/status', restrictTo('doctor', 'admin'), updateAppointmentStatus);

export default router;
