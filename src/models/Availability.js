const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Availability = sequelize.define('availability_slots', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    host_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    day_of_week: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    is_recurring: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    specific_date: {
        type: DataTypes.DATE
    },
    is_available: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

Availability.belongsTo(User, {
    foreignKey: 'host_id',
    as: 'host',
    onDelete: 'CASCADE'
});

module.exports = Availability;
