import cors from "cors"
import { AppError } from "../utils/AppError";

const allowedOrigins = (process.env.CORS_ORIGIN || "")
.split(",").map(o=>o.trim()).filter(Boolean);

export const corsMidlleware = cors({
    origin: (origin, callback)=>{
        if(!origin || allowedOrigins.includes(origin)){
            return callback(null, true);
        }
        return callback(new AppError("Not allowed by CORS"));
    },

    credentials:true,
    methods:["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders:["Content-Type", "Authorization"],
})