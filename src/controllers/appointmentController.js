const Appointment = require('../models/Appointment');

exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll();
        res.json(appointments);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createAppointment = async (req, res) => {
    try {

        const {
            student_id,
            host_id,
            slot_id,
            reason,
            scheduled_at
        } = req.body;

        const appointment = await Appointment.create({
            student_id,
            host_id,
            slot_id,
            reason,
            scheduled_at
        });

        res.status(201).json(appointment);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAppointment = async (req, res) => {
    try {

        const appointment = await Appointment.findByPk(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                message: 'Appointment not found'
            });
        }

        await appointment.update(req.body);

        res.json(appointment);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {

        const appointment = await Appointment.findByPk(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                message: 'Appointment not found'
            });
        }

        await appointment.destroy();

        res.json({
            message: 'Appointment deleted'
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
