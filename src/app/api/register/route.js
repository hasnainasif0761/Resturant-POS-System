import { UserModal } from "@/models/User";
import { connectDb } from "@/utils/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const {name,email,password,role} = await req.json();

        // Database sa Connect karo
        await connectDb();

        // Check kare email already register to nahe
        const userExist = await UserModal.findOne({email});
        if(userExist){
            return NextResponse.json(
                {message:"User is Already Register!"},
                {status:400}
            )
        }

        if(role === 'admin'){
            const adminExist = UserModal.findOne({role:'admin'});
            if(adminExist){
                return NextResponse.json(
                    {message:"Admin is Already Register! Please Select Another Role"},
                    {status:'400'}
                )
            }
        }

        const hashedPassword = await bcrypt.hash(password,10);

        // Naya User database ma save kare
        const newUser = new UserModal({
            name,
            email,
            password:hashedPassword,
            role
        });

        await newUser.save()

        return NextResponse.json(
            {message:"Staff Register Successfully....."},
            {status:201}
        )


    } catch (error) {
        return NextResponse.json(
            {message:"Something went wrong!",error:error.message},
            {status:500}
        )
    }    
}