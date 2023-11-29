export type Client ={
    id:string,
    firstName:string,
    lastName:string,
    email:string,
    phoneNumber:number,
    DNI:string,
    bookings:Array<string>;
}

export type Restaurante ={
    id:string,
    name: string,
    CFI: string,
    address: string,
    bookings: Array<string>;
}

export type Booking ={
    id:string,
    date:string,
    client:string,
    restaurant:string;
}