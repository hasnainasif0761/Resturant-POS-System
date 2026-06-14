import NextAuth from "next-auth";
import { connectDb } from "./utils/db";
import mongoose from "mongoose";
import { UserModal } from "./models/User";
import bcrypt from 'bcryptjs'

export const {handlers, auth, signIn, signOut} = NextAuth({
    providers:[
        Credentials({
            name:'Credentials',
            credentials:{
                email: {label:"Email", type:"email"},
                password:{label:"Password",type:"password"}
            },
             async authorize(credentials){
                await connectDb()

                const user = await UserModal.findOne({email:credentials?.email});
                if(!user){
                    throw new Error('No User Found with this email!');
                }

                // Password Match Karna ha
                const isPasswordCorrect = await bcrypt.compare(
                    credentials?.password,
                    user.password
                )

                if(!isPasswordCorrect){
                    throw new Error('Invalid Password!')
                }

                // agar sab sahe ha to user ka data id name return kar do
                return{
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
             }
        })
    ],
    callbacks:{
        // JWP Tokens ma Role Add karna ka leya ha
        async jwt({token,user}){
            if(user){
                token.role = user.role
            }
            return token
        },
        // Session ma bhe Role pass karo taka frontent ma bhe access hu sakhaye
        async session({session,token}){
            if(token?.role){
                session.user.role = token.role
            }
            return session
        }
    },
    pages:{
        signIn:"/login",
    },
    secret: process.env.AUTH_SECRET
})




