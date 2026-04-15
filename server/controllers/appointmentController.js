import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import { AppError } from '../middleware/errorMiddleware.js';
import { formatResponse } from '../utils/responseFormatter.js';
import { io } from '../server.js';

/**
 * Book a new appointment
 */
export const bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, scheduledAt, type, symptoms, urgencyLevel, reasonForVisit } = req.body;
    
    // Find patient record for current user
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return next(new AppError('Patient profile not found', 404));

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return next(new AppError('Doctor not found', 404));

    // Create appointment
    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctor._id,
      scheduledAt,
      type,
      symptoms,
      urgencyLevel,
      reasonForVisit,
      status: 'pending',
    });

    // Notify doctor via socket if online
    io.to(`doctor_${doctor._id}`).emit('new-appointment', appointment);

    formatResponse(res, 201, 'Appointment booked successfully', appointment);
  } catch (error) {
    next(error);
  }
};

/**
 * Get appointments for current user (Patient or Doctor)
 */
export const getMyAppointments = async (req, res, next) => {
  try {
    let query = {};
    
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      query = { patient: patient._id };
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      query = { doctor: doctor._id };
    }

    const appointments = await Appointment.find(query)
      .populate('doctor patient')
      .sort({ scheduledAt: 1 });

    formatResponse(res, 200, 'Appointments fetched', appointments);
  } catch (error) {
    next(error);
  }
};

/**
 * Update appointment status (Doctor/Admin)
 */
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, consultationSummary, followUpDate } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, consultationSummary, followUpDate },
      { new: true, runValidators: true }
    );

    if (!appointment) return next(new AppError('Appointment not found', 404));

    // Notify patient
    io.to(`patient_${appointment.patient}`).emit('appointment-updated', appointment);

    formatResponse(res, 200, 'Appointment updated', appointment);
  } catch (error) {
    next(error);
  }
};
