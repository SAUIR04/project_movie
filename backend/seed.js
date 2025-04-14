import mongoose from "mongoose";

import dotenv from "dotenv";
import User from "./models/users.js";
dotenv.config();

const seedAdmin = async () => {
    try {
        //Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");

        //Check if admin exists
 const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
        console.log("Admin already exists");
        return;
    }
     const adminUser = new User({
        username: "admin",// change this username 
        password: "admin@12",//userShema.pre will hash this password
        role: "admin"
     });

    await adminUser.save();
    console.log("Admin  user created successfully");

    } catch (error) {
        console.error("Error creating admin ", error);
        process.exit(1);
    } finally {
        mongoose.connection.close();
    }
}
seedAdmin();