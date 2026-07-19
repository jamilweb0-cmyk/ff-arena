const express = require("express");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");


const User = require("../models/User");


const verifyToken =
require("../middleware/verifyToken");



const router =
express.Router();



const JWT_SECRET =
process.env.JWT_SECRET;



// =================
// REGISTER
// =================


router.post(
"/register",
async(req,res)=>{


try{


const {
name,
email,
password
}=req.body;



const exists =
await User.findOne({
email
});



if(exists){

return res.status(400).send({

message:"User already exists"

});

}



const hash =
await bcrypt.hash(
password,
10
);



const user =
new User({

name,

email,

password:hash,

provider:"email"

});



await user.save();



res.status(201).send({

message:"Registration Successful"

});



}catch(error){


res.status(500).send({

message:error.message

});


}


});






// =================
// LOGIN
// =================


router.post(
"/login",
async(req,res)=>{


try{


const {
email,
password
}=req.body;



const user =
await User.findOne({
email
});



if(!user){


return res.status(404).send({

message:"User not found"

});


}



const match =
await bcrypt.compare(
password,
user.password
);



if(!match){


return res.status(400).send({

message:"Wrong password"

});


}




const token =
jwt.sign(

{

email:user.email

},

JWT_SECRET,

{

expiresIn:"7d"

}

);





res.cookie(
"token",
token,
{

httpOnly:true,

secure:
process.env.NODE_ENV==="production",

sameSite:
process.env.NODE_ENV==="production"
?
"none"
:
"lax",


maxAge:
7*24*60*60*1000,


path:"/",


}

);





res.send({

message:"Login successful",


user:{

_id:user._id,

name:user.name,

email:user.email,

photo:user.photo,

}


});




}catch(error){


res.status(500).send({

message:error.message

});


}


});






// =================
// ME
// =================


router.get(
"/me",
verifyToken,
async(req,res)=>{


try{


const user =
await User.findOne({

email:req.user.email

})

.select("-password");



if(!user){

return res.status(404).send({

message:"User not found"

});

}



res.send(user);



}catch(error){


res.status(500).send({

message:error.message

});


}


});







// =================
// LOGOUT
// =================


router.post(
"/logout",
(req,res)=>{


res.clearCookie(
"token",
{

httpOnly:true,

secure:
process.env.NODE_ENV==="production",

sameSite:
process.env.NODE_ENV==="production"
?
"none"
:
"lax",


path:"/",


}

);



res.send({

message:"Logout successful"

});


});





router.get(
"/test",
(req,res)=>{

res.send(
"Auth Route Working"
);

});



module.exports =
router;