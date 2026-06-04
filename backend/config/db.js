import mongoose from 'mongoose';

mongoose.set('bufferCommands', false);

const globalCache = globalThis.__samsMongoose || {
  conn: null,
  promise: null
};

globalThis.__samsMongoose = globalCache;

export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured');
  }

  if (globalCache.conn && mongoose.connection.readyState === 1) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(process.env.MONGO_URI)
      .then((mongooseInstance) => {
        console.log('MongoDB Connected Successfully');
        return mongooseInstance.connection;
      })
      .catch((error) => {
        globalCache.promise = null;
        throw error;
      });
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
};
