import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/Message.model.js";
import { Rental } from "../models/Rental.model.js";
import { getIo } from "../socket.js"; // 🔥 THIS WAS MISSING!

// get messages for a rental
const getMessages = asyncHandler(async(req,res)=>{
    const { rentalId } = req.params;
    const userId= req.user._id;
    
    const rental = await Rental.findById(rentalId).populate("product");
    if(!rental){
        throw new ApiError(404,"Rental not found");
    }

    const isRenter = rental.renter.toString() === userId.toString();
    const isLender = rental.product.owner.toString() === userId.toString();

    if(!isRenter && !isLender){
        throw new ApiError(403,"Not Authorized");
    }
    
    const messages= await Message.find({rental:rentalId})
    .sort({createdAt:1})

    const isChatLocked = ["Pending", "Completed", "Cancelled"].includes(rental.status);

    return res.status(200).json(new ApiResponse(200,{messages,isChatLocked},"Messages fetched successfully"));
});


//send a message
const sendMessages = asyncHandler(async (req, res) => {
    const { rentalId, text } = req.body;
    const senderId = req.user._id;

    if (!text || text.trim() === "") {
        throw new ApiError(400, "Message text cannot be empty");
    }
    const rental = await Rental.findById(rentalId).populate('product');
    if (!rental) {
        throw new ApiError(404, "Rental not found");
    }

    const isRenter = rental.renter.toString() === senderId.toString();
    const isLender = rental.product.owner.toString() === senderId.toString();

    if (!isRenter && !isLender) throw new ApiError(403, "Not Authorized");
    if (rental.status === "Pending") throw new ApiError(403, "Chat unlocks after approval");
    if (["Completed", "Cancelled"].includes(rental.status)) throw new ApiError(403, "Chat is closed for completed or cancelled rentals");

    const receiverId = isRenter ? rental.product.owner : rental.renter;

    //save to db
    const newMessage = await Message.create({
        rental: rentalId,
        sender: senderId,
        receiver: receiverId,
        text
    });

    // Fire the socket now that it is imported!
    const io = getIo();
    io.to(rentalId).emit("receive_message", newMessage);
    
    return res.status(201).json(new ApiResponse(201, newMessage, "Message sent successfully"));
});


export { getMessages, sendMessages };