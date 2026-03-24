const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: './config/config.env' });

const User = require('./models/User');

const exampleUsers = [
    {
        name: 'Alice Member',
        email: 'member@cowork.io',
        tel: '081-234-5678',
        password: 'password123',
        role: 'user',
    },
    {
        name: 'Admin User',
        email: 'admin@cowork.io',
        tel: '092-345-6789',
        password: 'admin1234',
        role: 'admin',
    },
];

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    for (const userData of exampleUsers) {
        const existing = await User.findOne({ email: userData.email });
        if (existing) {
            console.log(`⚠️  Skipped — ${userData.email} already exists`);
            continue;
        }
        await User.create(userData);
        console.log(`✅  Created ${userData.role}: ${userData.email} / ${userData.password}`);
    }

    console.log('\nDone. Credentials:');
    console.log('  Member  → member@cowork.io  / password123');
    console.log('  Admin   → admin@cowork.io   / admin1234');

    await mongoose.disconnect();
    process.exit(0);
};

seed().catch((err) => {
    console.error('Seeder error:', err);
    process.exit(1);
});
