// @deno-types="npm:@types/express@4"
import express from "npm:express@4.18.2";
import mongoose from "npm:mongoose@7.6.3";
import { Request, Response } from "npm:express@4.18.2";
import {load} from "https://deno.land/std@0.204.0/dotenv/mod.ts";

import { postCliente } from "./resolvers/postCliente.ts";
import { postRestaurante } from "./resolvers/postRestaurante.ts";
import { getCliente } from "./resolvers/getCliente.ts";
import { getRestaurante } from "./resolvers/getRestaurante.ts";
import { postBooking } from "./resolvers/postBooking.ts";
import { getBooking } from "./resolvers/getBooking.ts";
import { deleteBooking } from "./resolvers/deleteBoking.ts";
import { deleteRestaurante } from "./resolvers/deleteRestaurante.ts";
import { deleteRestaurantes } from "./resolvers/deleteRestaurantes.ts";

const env = await load();

const MONGO_URL = env.MONGO_URL || Deno.env.get("MONGO_URL");//Primero la variable del archivo env y la otra variable de entorno del sistema operativo

if(!MONGO_URL){
    console.error("Url not found");
    Deno.exit(1);
}

try{

  await mongoose.connect(MONGO_URL);
  console.info("Mongo connected");
  const app = express();
  app.use(express.json());
  
  app.get("/",async(req:Request, res: Response)=>{
    res.status(200).send("Bienvenido a la api de gestion de clientes, restaurantes y reservas");
  })

  app.post("/client", postCliente)
  .post("/restaurant",postRestaurante)
  .post("/booking",postBooking)
  .get("/client/:id",getCliente)
  .get("/restaurant/:id",getRestaurante)
  .get("/booking/:id",getBooking)
  .delete("/booking/:id",deleteBooking)
  .delete("/restaurant/:id",deleteRestaurante)
  .delete("/restaurant",deleteRestaurantes)
  
  app.listen(3000,()=>{
    console.log("Server started on port 3000")
  })
  
  }catch(e){
    console.error(e);
  }
  