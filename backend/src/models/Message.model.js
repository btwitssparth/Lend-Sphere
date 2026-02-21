import mongoose,{Schema} from "mongoose";

const messageSchema = new Schema(
    {
        rental:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Rental',
            required:true
        },
        sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        receiver:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        text:{
            type:String,
            required:true,
            trim:true
        }
    },
    {timestamps:true}
)

export const Message= mongoose.model("Message",messageSchema);