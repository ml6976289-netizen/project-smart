const bcrypt = require('bcryptjs');
const sequelize = require('./src/config/database');
const User = require('./src/models/User');
const Availability = require('./src/models/Availability');
const Appointment = require('./src/models/Appointment');

async function seed() {
    try {
        console.log('Connecting to database and syncing models...');
        await sequelize.sync({ force: true });
        console.log('Database tables cleared and synchronized.');

        const hashedPassword = await bcrypt.hash('123456', 10);

        console.log('Seeding users...');
        const users = await User.bulkCreate([
            {
                id: 1,
                full_name: 'Ahmed Al-Nabulsi',
                email: 'ahmed@iug.edu.ps',
                password_hash: hashedPassword,
                role: 'student',
                department: 'Computer Engineering',
                is_active: 1
            },
            {
                id: 2,
                full_name: 'Sara Al-Khalidi',
                email: 'sara@iug.edu.ps',
                password_hash: hashedPassword,
                role: 'student',
                department: 'Computer Engineering',
                is_active: 1
            },
            {
                id: 3,
                full_name: 'Dr. Walaa Medhat',
                email: 'walaa@iug.edu.ps',
                password_hash: hashedPassword,
                role: 'instructor',
                department: 'Computer Engineering',
                is_active: 1
            },
            {
                id: 4,
                full_name: 'Eng. Belal Shawish',
                email: 'belal@iug.edu.ps',
                password_hash: hashedPassword,
                role: 'instructor',
                department: 'Computer Engineering',
                is_active: 1
            },
            {
                id: 5,
                full_name: 'Admin Office',
                email: 'admin@iug.edu.ps',
                password_hash: hashedPassword,
                role: 'admin',
                department: 'Administration',
                is_active: 1
            },
            {
                id: 6,
                full_name: 'System Admin',
                email: 'sysadmin@iug.edu.ps',
                password_hash: hashedPassword,
                role: 'system_admin',
                department: 'IT Department',
                is_active: 1
            }
        ]);
        console.log('Users seeded.');

        console.log('Seeding availability slots...');
        const slots = await Availability.bulkCreate([
            {
                id: 1,
                host_id: 3,
                day_of_week: 0,
                start_time: '09:00:00',
                end_time: '10:00:00',
                is_recurring: 1,
                is_available: 1
            },
            {
                id: 2,
                host_id: 3,
                day_of_week: 0,
                start_time: '11:00:00',
                end_time: '12:00:00',
                is_recurring: 1,
                is_available: 1
            },
            {
                id: 3,
                host_id: 3,
                day_of_week: 2,
                start_time: '10:00:00',
                end_time: '11:00:00',
                is_recurring: 1,
                is_available: 1
            },
            {
                id: 4,
                host_id: 4,
                day_of_week: 1,
                start_time: '13:00:00',
                end_time: '14:00:00',
                is_recurring: 1,
                is_available: 1
            },
            {
                id: 5,
                host_id: 4,
                day_of_week: 3,
                start_time: '09:00:00',
                end_time: '10:00:00',
                is_recurring: 1,
                is_available: 1
            }
        ]);
        console.log('Availability slots seeded.');

        console.log('Seeding appointments...');
        await Appointment.bulkCreate([
            {
                id: 1,
                student_id: 1,
                host_id: 3,
                slot_id: 1,
                status: 'pending',
                reason: 'Need help with my graduation project topic.',
                scheduled_at: new Date('2025-06-01T09:00:00')
            },
            {
                id: 2,
                student_id: 2,
                host_id: 3,
                slot_id: 2,
                status: 'accepted',
                reason: 'Question about the database assignment.',
                scheduled_at: new Date('2025-06-01T11:00:00')
            },
            {
                id: 3,
                student_id: 1,
                host_id: 4,
                slot_id: 4,
                status: 'pending',
                reason: 'Help with React frontend error.',
                scheduled_at: new Date('2025-06-02T13:00:00')
            }
        ]);
        console.log('Appointments seeded.');

        console.log('Database seeding completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding database failed:', err);
        process.exit(1);
    }
}

seed();
