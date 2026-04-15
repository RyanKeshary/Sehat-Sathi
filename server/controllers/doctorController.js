import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import { formatResponse } from '../utils/responseFormatter.js';
import { AppError } from '../middleware/errorMiddleware.js';

/**
 * Get Doctor Dashboard Stats
 */
export const getDoctorStats = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return next(new AppError('Doctor profile not found', 404));

    // Get today's range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayAppointments = await Appointment.find({
      doctor: doctor._id,
      scheduledAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const pendingCount = todayAppointments.filter(a => a.status === 'pending').length;
    const completedCount = todayAppointments.filter(a => a.status === 'completed').length;

    // Calculate monthly revenue estimate
    const monthlyAppointments = await Appointment.countDocuments({
      doctor: doctor._id,
      status: 'completed',
      createdAt: { $gte: new Date(new Date().setDate(1)) }
    });

    formatResponse(res, 200, 'Doctor stats fetched', {
      todayCount: todayAppointments.length,
      pendingCount,
      completedCount,
      monthlyRevenue: monthlyAppointments * doctor.consultationFee,
      experienceYears: doctor.experienceYears,
      rating: doctor.rating.average
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Doctor Profile
 */
export const updateDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    formatResponse(res, 200, 'Profile updated', doctor);
  } catch (error) {
    next(error);
  }
};
