// // dbConnect.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    // If already connected, return cached connection
    console.log('using cached connection');
    return cached.conn;
  }

  if (!cached.promise) {
    // Establish a new connection and cache the promise
    console.log('using new connection');
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m.connection);
  }

  cached.conn = await cached.promise; // Resolve the promise if not already done
  return cached.conn;
}

export default dbConnect;

// import mongoose from 'mongoose';

// const connection: { isConnected?: number } = {};

// async function dbConnect() {
//   if (connection.isConnected) {
//     return;
//   }

//   try {
//     const db = await mongoose.connect(process.env.MONGODB_URI!);

//     connection.isConnected = db.connections[0].readyState;
//     console.log('MongoDB connected successfully');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//     throw new Error('Could not connect to MongoDB');
//   }
// }

// export default dbConnect;
