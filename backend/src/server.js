import express from "express";
import dotenv from "dotenv";
import cors from "cors"

import appRoutes from "./routes/appRoutes.js"
import customerRoutes from "./routes/customerRoutes.js"
import { connectDB } from "./config.js/db.js";


const app = express()
const PORT = process.env.PORT || 5001;
dotenv.config();

app.use(
    cors(
    {origin: "http://localhost:5173",}
));
app.use(express.json());
app.use("/admin/", appRoutes);
app.use("/", customerRoutes);

app.use('/uploads', express.static('uploads'));


connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log("Listening on 5001");
    });
});