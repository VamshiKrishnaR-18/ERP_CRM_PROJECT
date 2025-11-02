import app from "./app.js";
import dotenv from "dotenv";
import {connectDb} from "./config/db.js";
import {env} from './config/env.js';
import recurringInvoiceService from "./services/recurringInvoiceService.js";
import backupService from "./services/backupService.js";

dotenv.config();

const startServer = async()=>{
  try {

    await connectDb();

    // Initialize recurring invoice service (this starts the cron jobs)
    console.log("Initializing recurring invoice automation...");

    // Initialize backup service (this starts the backup cron jobs)
    console.log("Initializing backup automation...");

    app.listen(env.port, ()=>{
      console.log(`Server is running on port ${env.port}`);
      console.log("Recurring invoice automation is active");
      console.log("Backup automation is active");
    });
    
  } catch (err) {
    console.error("Failed to start server: ",  err);
    process.exit(1);
  }
}

startServer();