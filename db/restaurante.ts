import mongoose from "npm:mongoose@7.6.3";
import { Restaurante } from "../type.ts";
import BookingModel from "./booking.ts";
import  RestauranteModel from "./restaurante.ts"; 

const Schema = mongoose.Schema;

const validateCFI= function(CFI:string){
    const cf = /^([ABCDEFGHJPQRSUVW])(\d{7})([0-9A-J])$/;
    return cf.test(CFI)
};

const RestauranteSchema = new Schema({

    name: {type: String, required: true, unique: true},
    CFI: {type: String, required: true, unique: true, validate:[validateCFI,'Please fill a valid CFI']},
    address: {type: String, required: true},
    bookings: [{type:Schema.Types.ObjectId,ref:"Booking", default: []}]
});

//validacion bookings id
RestauranteSchema.path("bookings").validate(async function(bookings:mongoose.Types.ObjectId[]){
    try {
        if(bookings.some((elem)=> !mongoose.isValidObjectId(elem))) return false;
        const booking = await BookingModel.find({_id:{$in:bookings}});
        return booking.length === booking.length; 
    } catch (error) {
        return false;
    }
});

RestauranteSchema.pre('deleteOne',{query:true,document:false},async function() {
   const _id = this.getFilter();
   const restaurante = await RestauranteModel.findById(_id);
   restaurante?.bookings.forEach((_id)=> BookingModel.deleteOne({_id}).exec());    
});

RestauranteSchema.pre('deleteMany',async function(){
    const reservas = await BookingModel.deleteMany({}).exec();
});

export type RestauranteModelType = mongoose.Document & Omit<Restaurante, "id">& {bookings: Array<mongoose.Types.ObjectId>;};
export default mongoose.model<RestauranteModelType>("Restaurante",RestauranteSchema)