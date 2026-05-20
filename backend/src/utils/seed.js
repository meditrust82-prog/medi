require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const seed = async () => {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminUsername = process.env.SEED_ADMIN_USERNAME;

  if (!adminEmail || !adminPassword) {
    console.error('ERROR: Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env before seeding');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    await User.create({
      name: adminUsername || 'Admin',
      username: adminUsername ? adminUsername.toLowerCase() : undefined,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    console.log(`Admin user created: ${adminEmail}`);
  } else {
    console.log('Admin already exists');
  }

  await mongoose.disconnect();
  console.log('Done');
};

seed().catch((e) => { console.error(e); process.exit(1); });
