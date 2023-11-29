// @deno-types="npm:@types/express@4"
import { Request, Response } from "npm:express@4.18.2";
import { Restaurante } from "../type.ts";
import RestauranteModel from "../db/restaurante.ts";

export const getRestaurante = async(req:Request<{ id: string }>, res:Response<Restaurante | { error: unknown }>)=>{
    try {
        const _id = req.params.id;
        const restaurant = await RestauranteModel.findOne({_id}).populate({path:'bookings',select:'date',model:'Booking',populate:{path:'client',select:'firstName',model:'Client'}}).exec();
        if(!restaurant){
            res.status(404).send({error: "Restaurant not found"});
            return;
        }
        const restaurante:Restaurante ={
            id:restaurant._id.toString(),
            name:restaurant.name,
            CFI:restaurant.CFI,
            address:restaurant.address,
            bookings:restaurant.bookings
        }
        res.status(200).json(restaurante).send();
    } catch (error) {
        res.status(500).send(error);
        return;
    }
};