import './dotenv-loader.js'
import express from "express";
import cors from "cors"
import appRoutes from "./routes/appRoutes.js"
import inventoryRoutes from "./routes/inventoryRoutes.js" 
import customerRoutes from "./routes/customerRoutes.js"
import { connectDB } from "./config.js/db.js";


const app = express()
const PORT = process.env.PORT || 5001;

app.use(
    cors({
    origin: ["http://localhost:5173", "https://foushack.vercel.app"]}
));


app.use(express.json());
app.use("/admin", appRoutes);
app.use('/uploads', express.static('uploads'));
app.use("/customer", customerRoutes);
app.use("/inventory", inventoryRoutes); // Add this line



connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log("Listening on 5001");
    });
});