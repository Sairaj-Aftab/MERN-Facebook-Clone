import mongoose from 'mongoose';

// Connection MongoDB
const connectMongoDB = async () => {

    try {
        const connect = await mongoose.connect(process.env.MONGODB);
        console.log(`MongoDB connection is ready on Host : ${mongoose.connection.host}`.bgCyan.red);
    } catch (error) {
        console.log(error);
    }
}

export default connectMongoDB;