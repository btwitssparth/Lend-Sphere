import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Your frontend URL
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log(`🔌 User connected: ${socket.id}`);

        // Join a specific chat room based on Rental ID
        socket.on("join_chat", (rentalId) => {
            socket.join(rentalId);
            console.log(`User joined chat room: ${rentalId}`);
        });

        // Handle typing indicators (Optional but great for UX)
        socket.on("typing", ({ rentalId, isTyping }) => {
            socket.to(rentalId).emit("user_typing", isTyping);
        });

        socket.on("disconnect", () => {
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    });

    return io;
};

// Utility function to use the io instance in your controllers
export const getIo = () => {
    if (!io) {
        throw new Error("Socket.io is not initialized!");
    }
    return io;
};