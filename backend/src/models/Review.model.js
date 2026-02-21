import mongoose,{Schema} from 'mongoose';
const reviewSchema = new Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    rental:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Rental",
        required:true

    },
    reviewer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    comment:{
        type:String,
        required:true,
        maxlength:500

    }

},
{
    timestamps:true
});

export const Review = mongoose.model("Review",reviewSchema);
