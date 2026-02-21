import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import Routes
import userRouter from './src/routes/User.routes.js';
import productRouter from './src/routes/Product.routes.js'
import rentalRouter from './src/routes/Rental.routes.js'
import messageRouter from "./src/routes/Message.routes.js";


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

//rental routes
app.use("/api/v1/rentals",rentalRouter);

//message routes
app.use("/api/v1/messages",messageRouter);


app.use((err, req, res, next) => {
    // 1. Ensure statusCode is a valid number. Default to 500 if missing or invalid.
    let statusCode = err.statuscode || err.statusCode || 500;
    
    // Safety check: If statusCode is somehow a string or invalid, force it to 500
    if (isNaN(Number(statusCode))) {
        statusCode = 500;
    }

    // 2. Extract the message
    const message = err.message || "Internal Server Error";

    // 3. Send the response
    res.status(Number(statusCode)).json({
        success: false,
        message: message,
        errors: err.errors || [],
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
});

export { app };

