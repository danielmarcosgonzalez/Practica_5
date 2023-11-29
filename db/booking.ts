import mongoose from "npm:mongoose@7.6.3";
import { Booking } from "../type.ts";
import ClientModel from "./client.ts";
import RestauranteModel from "./restaurante.ts";
import BookingModel from "./booking.ts";

const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    
    date:{ type: String, default: Date()},
    client:{ type: Schema.Types.ObjectId, required: true, ref: "client" },
    restaurant:{ type: Schema.Types.ObjectId, required: true, ref: "restaurante" }
});

// validacion id client
BookingSchema.path("client").validate(async function(client:mongoose.Types.ObjectId) {
    try {
        if(!mongoose.isValidObjectId(client)) return false;
        const cliente = await ClientModel.findById(client);
        if(!cliente) return false;
        return true;
    } catch (error) {
        return false;
    }
});

// validacion id restaurant
BookingSchema.path("restaurant").validate(async function(restaurant: mongoose.Types.ObjectId){
    try {
        if(!mongoose.isValidObjectId(restaurant)) return false;
        const restaurante = await RestauranteModel.findById(restaurant);
        if(!restaurante) return false;
        return true;
    } catch (error) {
        return false;
    }
});

BookingSchema.pre('save',async function(){
    let _id = this.restaurant;
    const res = await RestauranteModel.findById(_id);
    res?.bookings.push(this._id);
    res?.save();
    _id = this.client;
    const cli = await ClientModel.findById(_id);
    cli?.bookings.push(this._id);
    cli?.save();
});

BookingSchema.pre('deleteOne',{document:false,query:true},async function() {
    const _id = this.getFilter();
    const booking = await BookingModel.findById(_id);
    if(!booking){
        return;
    }
    const res = await RestauranteModel.findOne(booking.restaurant);
    if(!res){
        console.log("Restaurante no encontrado")
    }else{
        const inddelete = res.bookings.indexOf(_id._id);
        if(inddelete!==-1){
             res.bookings.splice(inddelete,1);
             res.save(); 
        }else{
            return;
        }
    }
    const cli = await ClientModel.findById(booking.client);
    if(!cli){
        console.log("Cliente no encontrado")
    }else{
        const indice = cli.bookings.indexOf(_id._id);
        if(indice!==-1){
            cli.bookings.splice(indice,1);
            cli.save();
        }else{
            return;
        }
    }
 });

 BookingSchema.pre('deleteMany',async function(){
    const clients = await ClientModel.find({}).exec();
    clients.forEach((elem)=>{
        elem.bookings=[];            
        elem.save();
    });
});

export type BookingModelType = mongoose.Document & Omit<Booking, "id"> & {client: mongoose.Types.ObjectId; restaurant: mongoose.Types.ObjectId;};
export default mongoose.model<BookingModelType>("Booking", BookingSchema);

