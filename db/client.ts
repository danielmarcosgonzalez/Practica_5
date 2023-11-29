import mongoose from "npm:mongoose@7.6.3";
import { Client } from "../type.ts";
import BookingModel from "./booking.ts";

const Schema = mongoose.Schema;

const validateEmail = function(email:string) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const validateNumberPhone = function(phoneNumber:number){
    const a = phoneNumber.toString().length;
    return a === 9
};

const validateDNI = function(DNI:string){
    const va = /^(\d{8}[A-HJ-NP-TV-Z])$/;
    return va.test(DNI)
};

const ClientSchema = new Schema({
    
    firstName:{type: String, required: true},
    lastName:{type: String, required: true},
    email:{type: String, required: true, unique: true, validate:[validateEmail,'Please fill a valid email address']},
    phoneNumber:{type: Number, unique: true, validate:[validateNumberPhone,'Please fill a valid numberPhone']},
    DNI:{type: String, required: true, unique: true, validate:[validateDNI,'Please fill a valid DNI']},
    bookings:[{type:Schema.Types.ObjectId,ref:"Booking",default: []}] 
});

//validacion bookings id
ClientSchema.path("bookings").validate(async function(bookings:mongoose.Types.ObjectId[]){
    try {
        if(bookings.some((elem)=> !mongoose.isValidObjectId(elem))) return false;
        const booking = await BookingModel.find({_id:{$in:bookings}});
        return booking.length === booking.length;      
    } catch (error) {
        return false;
    }
});

export type ClientModelType = mongoose.Document & Omit<Client,"id"> & {bookings: Array<mongoose.Types.ObjectId>;};
export default mongoose.model<ClientModelType>("Client", ClientSchema);

