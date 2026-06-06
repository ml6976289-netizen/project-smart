const Availability = require('../models/Availability');

exports.createAvailability = async (req, res) => {
    try {
        const availability = await Availability.create(req.body);

        res.status(201).json(availability);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAvailability = async (req, res) => {
    try {
        const availability = await Availability.findAll({
            where: {
                host_id: req.params.hostId
            }
        });

        res.json(availability);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
