const mongoose = require('mongoose');

// MongoDB connection URL
const dbURL = 'mongodb://mongo:27017/mydatabase'; // Replace with your MongoDB URL

// Create a Mongoose connection to the MongoDB server
mongoose.connect(dbURL, {
  useNewUrlParser: true,

});

// Get the default connection
const db = mongoose.connection;

// Event handlers for the Mongoose connection
db.on('connected', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Export the Mongoose connection object and a function to open the connection
module.exports = {
  mongoose,
  connect: () => {
    return new Promise((resolve, reject) => {
      db.once('open', () => {
        console.log('MongoDB connection is open');
        resolve();
      });

      db.on('error', (err) => {
        console.error(`MongoDB connection error: ${err}`);
        reject(err);
      });
    });
  },
};
