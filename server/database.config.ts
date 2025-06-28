import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from './entity/user.entity';
import { Post } from './entity/post.entity';

const envFile = process.env.NODE_ENV === 'development' ? '.env.local' : '.env.production';
dotenv.config({ path: envFile });

if (!process.env.MONGODB_URL) {
  throw new Error("MONGODB_URL is required, ensure MongoDB is configured");
}

export const AppDataSource = new DataSource({
  type: 'mongodb',
  url: process.env.MONGODB_URL,
  entities: [User, Post],
  synchronize: true, // Set to false in production
  logging: process.env.NODE_ENV === 'production',
});

export async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('MongoDB connection established successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}