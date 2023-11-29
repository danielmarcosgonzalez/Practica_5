// @deno-types="npm:@types/express@4"
import { Request, Response } from "npm:express@4.18.2";

import RestauranteModel from "../db/restaurante.ts";

export const deleteRestaurante = async (req: Request<{ id: string }, {}>, res: Response<string | { error: unknown }>)=>{
    try {
        const _id = req.params.id;
        const restaurant = await RestauranteModel.deleteOne({_id}).exec();
        if(!restaurant){
            res.status(404).send({error:"Restaurant not found"});
            return;
        }
        res.status(200).send("Restaurant delete");
    } catch (error) {
        res.status(500).send(error);
    }
};