import mongoose from 'mongoose';

const MONDODB_URL = process.env.DATABASE_URL

if(!MONDODB_URL){
    throw new Error('Please define the database_url environment varaible inside .env')
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn:null, promise:null};
}


export async function connectDb(){
    if(cached.conn) return  cached.conn;

    if(!cached.promise){
        cached.promise = await mongoose.connect(MONDODB_URL).then((mongoose)=>mongoose);
    }
    cached.conn = await cached.promise;
    return cached.conn
}





