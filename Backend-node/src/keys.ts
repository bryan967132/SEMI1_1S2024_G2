import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: envPath });

export default {
    database: {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    }
};
