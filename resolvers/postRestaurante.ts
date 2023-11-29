// @deno-types="npm:@types/express@4"
import { Request, Response } from "npm:express@4.18.2";
import RestauranteModel from "../db/restaurante.ts";

export const postRestaurante= async(req: Request, res: Response)=>{
    try {
        const{name,CFI,address,bookings}=req.body;
        const alreadyExists = await RestauranteModel.findOne({ CFI }).exec();
        if (alreadyExists) {
          res.status(400).send("Restaurant already exists");
          return;
        }

        const newRestaurant = new RestauranteModel({name,CFI,address,bookings});
        await newRestaurant.save();
        res.status(200).send({
            id:newRestaurant._id.toString(),
            name:newRestaurant.name,
            CFI:newRestaurant.CFI,
            address:newRestaurant.address,
            bookings:newRestaurant.bookings
          });
    
    } catch (error) {
        res.status(500).send(error.message);
        return;
    }
};