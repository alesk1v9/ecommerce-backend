import jwt from 'jsonwebtoken';
import { PayloadProps } from '../types/payload';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from a .env file into process.env

const secret = process.env.JWT_SECRET!; 
// ! is used to tell TS that the value is not null or undefined
const expiration = '24h';

export function signToken(user: PayloadProps): string {
    const payload = { 
        id: user.id,
        email: user.email,
        role: user.role };

    return jwt.sign(payload, secret, { expiresIn: expiration });
};