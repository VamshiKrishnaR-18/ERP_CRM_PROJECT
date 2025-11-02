import jwt from "jsonwebtoken";
import {env} from "../config/env.js";
import { AppError } from "../utils/AppError.js";


export const protect = (req, res, next)=>{

    const token = req.headers.authorization?.split(" ")[1];

    console.log(token)

    if(!token) throw new AppError("Not authorized", 401);

    try{
        const decoded = jwt.verify(token, env.jwtSecret);
        req.user = decoded;
        next();
    }catch(err){
        throw new AppError("Invalid or expired token", 401);
    }
};