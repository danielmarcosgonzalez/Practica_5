// @deno-types="npm:@types/express@4"
import { Request, Response } from "npm:express@4.18.2";
import ClientModel from "../db/client.ts";

export const postCliente =async (req: Request, res: Response) => {
    try {
      const {firstName,lastName,email,phoneNumber,DNI,bookings} =req.body;
      
      const alreadyExists = await ClientModel.findOne({ DNI }).exec();
      if (alreadyExists) {
        res.status(400).send("Client already exists");
        return;
      }

      const newClient = new ClientModel({firstName,lastName,email,phoneNumber,DNI,bookings});
      await newClient.save();

      res.status(200).send({
        id:newClient._id.toString(),
        firstName:newClient.firstName,
        lastName:newClient.lastName,
        email:newClient.email,
        phoneNumber:newClient.phoneNumber,
        DNI:newClient.DNI,
        bookings:newClient.bookings
      });

    } catch (error) {
        res.status(500).send(error.message);
        return;
    }
};