import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:{type: String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{
        type:String,
        enum:['admin','cashier','user'],
        default:'cashier'
    },
},
{timestamps:true}
)

export const UserModal = mongoose.model.UserModal || mongoose.model("User",userSchema);