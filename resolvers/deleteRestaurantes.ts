// @deno-types="npm:@types/express@4"
import { Request, Response } from "npm:express@4.18.2";

import RestauranteModel from "../db/restaurante.ts";

export const deleteRestaurantes = async (req: Request<{}, {}>, res: Response<string | { error: unknown }>)=>{
    try {
        const restaurant = await RestauranteModel.deleteMany({}).exec();
        if(!restaurant){
            res.status(404).send({error:"Restaurant not found"});
            return;
        }
        res.status(200).send("Restaurants removed");
    } catch (error) {
        res.status(500).send(error);
    }
};