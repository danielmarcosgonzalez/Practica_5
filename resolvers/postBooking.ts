// @deno-types="npm:@types/express@4"
import { Request, Response } from "npm:express@4.18.2";
import BookingModel from "../db/booking.ts";

export const postBooking= async(req: Request, res: Response)=>{
    try {
        const{date,client,restaurant}=req.body;
        const alreadyExists = await BookingModel.findOne({ date,client,restaurant }).exec();
        if (alreadyExists) {
          res.status(400).send("Booking already exists");
          return;
        }

        const newBooking = new BookingModel({date,client,restaurant});
        await newBooking.save();
        res.status(200).send({
            id:newBooking._id.toString(),
            date:newBooking.date,
            client:newBooking.client,
            restaurant:newBooking.restaurant
          });
    
    } catch (error) {
        res.status(500).send(error.message);
        return;
    }
};