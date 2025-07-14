import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import morgan from "morgan"
import {concurrently} from "concurrently"
import connectDb from "./utils/db.js"
import authRoutes from "./routes/userRoute.js"
import categoryRoutes from "./routes/categoryRoute.js"
import productRoute from "./routes/productRoute.js"


const app=express()

dotenv.config()
// connect DB
connectDb()
// mw
app.use(cors())
app.use(morgan("dev"))      //niche a request 6e a show kare
app.use(express.json())

// routes
app.use("/auth",authRoutes)
app.use("/category",categoryRoutes)
app.use("/product",productRoute)

app.get("/",(req,res)=>{
    res.send("kl")
})
app.listen(process.env.PORT)