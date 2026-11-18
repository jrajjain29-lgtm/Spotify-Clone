const mongoose = require('mongoose');

 async function connectDB() {

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database connected successfully');
    }
       
    catch (error) {
        console.error('MongoDB connection error:', error);
        // process.exit(1); //basicaly this line will terminate the process if there is an error in connecting to the database 
    }
 }

 module.exports = connectDB;