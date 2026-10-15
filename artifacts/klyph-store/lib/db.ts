import mongoose from 'mongoose';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore in restricted environments
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached = global.mongoose ?? (global.mongoose = { conn: null, promise: null });

export default async function connectToDatabase(): Promise<typeof mongoose> {
  const uri =
    process.env.MONGODB_DIRECT_URI ||
    process.env.MONGODB_URI ||
    process.env.MONGODB_URL;
  if (!uri) {
    throw new Error('MONGODB_URI is not configured on the server.');
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch {
      // Ignore in restricted environments
    }
    cached.promise = mongoose.connect(uri, { bufferCommands: false });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
