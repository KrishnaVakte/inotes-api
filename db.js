import mongoose from 'mongoose'
import dotenv from 'dotenv'
const a = dotenv.config()

const mongoURI = process.env.DATABASE;

export default async function connectToMongo(){
   await mongoose.connect(mongoURI).then((e)=>{
        console.log("MongoDB database connection established successfully");
    }).catch((err)=>{
        console.log("error")
    })

}