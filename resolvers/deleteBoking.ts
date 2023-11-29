// @deno-types="npm:@types/express@4"
import { Request, Response } from "npm:express@4.18.2";

import BookingModel from "../db/booking.ts";

export const deleteBooking = async (  req: Request<{ id: string }, {}>, res: Response<string | { error: unknown }>)=>{
    try {
        const _id = req.params.id;
        const booking = await BookingModel.deleteOne({_id}).exec();
        if(!booking){
            res.status(404).send({error: "Booking not found"});
            return;
        }
        res.status(200).send("Booking delete");
    } catch (error) {
        res.status(500).send(error);
    }
    };