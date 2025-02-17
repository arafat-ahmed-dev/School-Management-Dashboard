import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const connectToDatabase = async () => {
  try {
    const result = await prisma.$connect();
    console.log(result);
    console.log('Connected to database');
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw new Error('Failed to connect to database');
  }
};

export default connectToDatabase;
