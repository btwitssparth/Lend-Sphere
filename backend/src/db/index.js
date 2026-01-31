import mongoose  from "mongoose";
const DB_Name="LendSphere";


const connectDb= async () => {
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        console.log(`\n MongoDB connected successfully!!!DB host: ${connectionInstance.connection.host} `)

        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

export default connectDb;