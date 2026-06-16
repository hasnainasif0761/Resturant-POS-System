import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
    name:{type:String,required:true},
    barcode:{type:String,default:""},
    category:{type: mongoose.Schema.Types.ObjectId, ref:"Category", required:true},
    isActive:{type:Boolean,default:true},
    image:{type: String,default:"https://placehold.co/100x100?text=No+Image"},
    variants:[
        {
            title:{type:String,required:true},
            price:{type:String,required:true}
        }
    ]
},{timestamps:true})

// modals ko change karke models kar diya
export const ProductModal = mongoose.models.Product || mongoose.model("Product", ProductSchema);
