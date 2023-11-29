// @deno-types="npm:@types/express@4"
import { Request, Response } from "npm:express@4.18.2";
import { Booking } from "../type.ts";
import BookingModel from "../db/booking.ts";

export const getBooking = async(req:Request<{ id: string }>, res:Response<Booking | { error: unknown }>)=>{
    try {
        const _id = req.params.id;
        const booking = await BookingModel.findOne({_id}).populate('restaurant','name','Restaurante').populate('client','firstName','Client').exec();
        if(!booking){
            res.status(404).send({error: "Booking not found"});
            return;
        }
        const boo:Booking ={
            id:booking._id.toString(),
            date:booking.date,
            client:booking.client,
            restaurant:booking.restaurant,
        }
        res.status(200).json(boo).send();
    } catch (error) {
        res.status(500).send(error);
        return;
    }
};