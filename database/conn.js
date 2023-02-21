// import mongodb server
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

export default async function connect(){
    // create a mongodb in-memory server 
    const mongoServer = await MongoMemoryServer.create() //this will create a new server each time I restart this server

    //then get the current mongodb URL from the server
    const mongoUri = mongoServer.getUri()

    // now specify this url to the mongoose
    await  mongoose.connect(mongoUri,{dbName: "BooApp"})
    console.log(`MongoDB successfully connected to ${mongoUri}`);
}


