require("dotenv").config()
require("./database/db").connect()
const User = require("./models/user")
const bycrypt=require("bcryptjs")
const express=require("express")
// const nanoid=require("nanoid")
const jwt=require("jsonwebtoken")
const { v4: uuidv4 } = require('uuid');

const app=express()
app.use(express.json())


function checkpassword(str){
    const splcharacters="\'!@#$%^&*()_-+=[]{};:|?/,.><"
    const nums="1234567890"
    spl=splcharacters.split("")
    nums_split=nums.split("")
  let result1=spl.some(elem=>{
    if(str.includes(elem)){
        return true
    }

    return false
  })
  let result2=nums_split.some(elem=>{
    if(str.includes(elem)){
        return true
    }
    return false
  })
return result1 && result2
}



app.post("/signup",async(req,res)=>{
   try {
        const {first_name,last_name,mobile,email,password,role}=req.body
        // check if length of password is atleast 8 characters
        if(password.length<8){
            return res.status(501).json({
                status:501,
                message:"Passoword must be at least 8 characters"
            })
        }
        if(mobile.toString().length<10){
            return res.status(501).json({
                status:501,
                message:"please enter valid mobile number"
            })
        }
        if(!checkpassword(password)){
            return res.status(501).json({
                status:501,
                message:"Password should contain at least 1 numeric value and 1 spectial character"
            })
        }
        // If any feild is missing will throw an error
        if(!(first_name && last_name && email && mobile && password && role)){
            return res.status(501).json({
                status:501,
                message: "All Fields are required"
            })
        }
        // Check if email alerady exist or not
        const existuseremail= await User.findOne({email})
          // Check if mobile nmuber alerady exist or not
        const existusermobile= await User.findOne({mobile})

        // If email id or mobile no already exists throw error 
        if(existuseremail||existusermobile){
            return res.status(501).json({
                status:501,
                message:"User Already Exists"
            })
        }
// 
        // Hash the user password  and store it into database.
        const userpass=await bycrypt.hash(password,10)
        const user=await User.create({
            first_name,
            last_name,
             mobile,
             email:email.toLowerCase(),
             password:userpass,
             role,
             uid:uuidv4(),
             status:"active"
         })

         return res.status(200).json({
            status:200,
            message: "User Created Successfully"
         })

    } catch (error) {
        console.log(error);
        res.end(error)
    }
   
})

app.post("/login",async(req,res)=>{
    try {
        const {email,password,role}=req.body

        if(!(email && password && role)){
            return  res.status(501).json({
                status:501,
                message:"please enter all the credentials"
            })
         }

         const user=await User.findOne({email})
         if(!user){
            return res.status(501).json({
                status:501,
                message:"User not exist"
            })
         }
         if(user.role!=role){
            return res.status(501).json({
                status:501,
                message:"Credential not matched (Role)"
            })
         }

         if(email && await bycrypt.compare(password,user.password)){
            const token=jwt.sign({
                uid:user.uid,
                email
            },process.env.SECRET,{
                expiresIn:'3d'
            })

            user.token=token
            user.password=undefined
            // to access in header from fromnt end
            return res.status(200).json({
                status:200,
                message:"user logged in Successfully",
                data:user,
                token:token
            })
         }
        
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            status:500,
            message:error
        })
    }
})


app.get("/home",(req,res)=>{
    res.end("home page is here")
})

app.get("/userdetails",async(req,res)=>{
    const {authorization}=req.headers
    const token=authorization.split(" ")[1]
     const verifiedtoken=jwt.verify(token,process.env.SECRET)
    // console.log(req.headers)
    const userdetails=await User.findOne({uid:verifiedtoken.uid})
    res.end(JSON.stringify(userdetails))

})

app.get("/getdata",async(req,res)=>{
    const params=req.query
    console.log(params)
    if(params){
        const users=await User.find(params)
        res.end(JSON.stringify(users))
    }

    
})
module.exports=app