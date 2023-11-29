// @deno-types="npm:@types/express@4"
import { Request, Response } from "npm:express@4.18.2";
import { Client } from "../type.ts";
import ClientModel from "../db/client.ts";

export const getCliente = async(req:Request<{ id: string }>, res:Response<Client | { error: unknown }>)=>{
    try {
        const _id = req.params.id;
        const client = await ClientModel.findOne({_id}).populate({path:'bookings',select:'date',model:'Booking',populate:{path:'restaurant',select:'name',model:'Restaurante'}}).exec();
        if(!client){
            res.status(404).send({error: "Client not found"});
            return;
        }
        const cliente:Client ={
            id:client._id.toString(),
            firstName:client.firstName,
            lastName:client.lastName,
            email:client.email,
            phoneNumber:client.phoneNumber,
            DNI:client.DNI,
            bookings:client.bookings
        }
        res.status(200).json(cliente).send();
    } catch (error) {
        res.status(500).send(error);
        return;
    }
};