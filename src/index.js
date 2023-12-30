// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import app from "./app.js"
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.j";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, 
        ()=>{
            console.log(`server is running at port : ${process.env.PORT}`);
        })
})
.catch((err)=>{
    console.log("MONGO db connection failed !!! ",err);
})



export default connectDB

/*import express from "express"
const app = express();
(async()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error",()=>{
        console.log("ERR", error);
        throw error
       })

       app.listen(process.env.PORT, ()=>{
        console.log(`Ap is listening on port ${process.env.PORT}`);
       })

    } catch (error) {
        console.error("ERROR", error)
        throw err
    }
})()

*/






