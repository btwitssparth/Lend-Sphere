import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import Routes
import userRouter from './src/routes/User.routes.js';
import productRouter from './src/routes/Product.routes.js'

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());


// ..............Routes............
//User Routes
app.use("/api/v1/users", userRouter); 
// Product Routes
app.use("/api/v1/products",productRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statuscode || err.statusCode || 500; // Handle your lowercase 'statuscode'
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
});


export { app };