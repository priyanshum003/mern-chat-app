import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { server } from './socket';

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI as string, {
    dbName: process.env.MONGO_DB_NAME,
}).then(() => {
    console.log('MongoDB connected');

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error(err.message);
    process.exit(1);
});
