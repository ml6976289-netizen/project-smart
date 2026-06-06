const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Availability = require('./Availability');

const Appointment = sequelize.define('appointments', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    host_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    slot_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(
            'pending',
            'accepted',
            'rejected',
            'cancelled',
            'completed'
        ),
        defaultValue: 'pending'
    },
    reason: {
        type: DataTypes.TEXT
    },
    scheduled_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Appointment.belongsTo(User, {
    foreignKey: 'student_id',
    as: 'student',
    onDelete: 'CASCADE'
});

Appointment.belongsTo(User, {
    foreignKey: 'host_id',
    as: 'host',
    onDelete: 'CASCADE'
});

Appointment.belongsTo(Availability, {
    foreignKey: 'slot_id',
    as: 'slot'
});

module.exports = Appointment;
