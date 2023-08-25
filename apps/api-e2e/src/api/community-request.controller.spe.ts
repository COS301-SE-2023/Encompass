import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import mongoose, { Connection, Schema } from "mongoose";
import { AppModule } from "./app.module";
import request from 'supertest';
import { MongooseModule } from "@nestjs/mongoose";
import exp from "constants";

export interface CommunityRequest extends Document {
    requestUsernames: string[];
}

export const CommunityRequestSchema = new Schema<CommunityRequest>(
    {
      requestUsernames: { type: [String], required: true },
    }
);

const dbUrl = process.env['NX_MONGO_DB_TEST']; 

const connectToDatabase = async () => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(dbUrl);

    console.log('Connected to the database!');

    // Get the Mongoose connection
    const dbConnection = mongoose.connection;

    // Optional: You can add event listeners to handle connection events
    dbConnection.on('error', (error) => {
      console.error('Database connection error:', error);
    });

    dbConnection.on('disconnected', () => {
      console.log('Disconnected from the database');
    });

    // Return the Mongoose connection so you can use it in other parts of your application
    return dbConnection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};


