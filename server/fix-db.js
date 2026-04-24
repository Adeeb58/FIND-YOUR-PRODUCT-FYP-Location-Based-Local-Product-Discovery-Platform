
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const fixIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('users');

        try {
            await collection.dropIndex('phone_1');
            console.log('Dropped phone_1 index');
        } catch (e) {
            console.log('Index might not exist or error:', e.message);
        }

        const indexes = await collection.indexes();
        console.log('Current Indexes:', indexes);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixIndexes();
