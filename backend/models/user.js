const mongoose=require("mongoose")

const UserSchema=new mongoose.Schema({
    uid:{
        type:String
    },
    first_name:{
        type:String
    },
    last_name:{
        type:String
    },
    email:{
        type:String
    },
    mobile:{
        type:Number
    },
    password:{
        type:String
    },
    role:{
        type:String,
        enum: ["admin", "member", "trainer"]
    },
    status:{
        type:String,
        enum:["active","inactive"]
    }

})

module.exports=mongoose.model("gymuser",UserSchema)