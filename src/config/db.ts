import mongoose from "mongoose";
import { envConfig } from "./config.ts";

async function connectToDB() {
  try {
    await mongoose.connect(envConfig.mongoConnectionString as string);
    console.log("Database Connected!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export default connectToDB;
