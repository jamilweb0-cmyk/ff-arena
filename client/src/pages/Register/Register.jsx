import {
useState
} from "react";

import api from "../../services/axios";

import toast from "react-hot-toast";

import {
FaEye,
FaEyeSlash
} from "react-icons/fa";



const Register=()=>{


const [showPassword,setShowPassword]=useState(false);


const [error,setError]=useState("");




const handleRegister=async(e)=>{


e.preventDefault();


const form=e.target;



try{


await api.post(
"/auth/register",
{

name:
form.name.value,

email:
form.email.value,

password:
form.password.value,

}

);



toast.success(
"Account Created"
);



form.reset();



}catch(err){


setError(
err.response?.data?.message ||
"Registration Failed"
);


}


};





return(


<div className="min-h-screen flex items-center justify-center">


<div className="bg-[#1b1330] p-8 rounded-xl w-full max-w-md">


<h1 className="text-3xl text-purple-400 text-center mb-6">

Register

</h1>



<form onSubmit={handleRegister}>


<input

name="name"

placeholder="Name"

required

className="w-full p-3 mb-4 bg-black rounded text-white"

/>


<input

name="email"

type="email"

placeholder="Email"

required

className="w-full p-3 mb-4 bg-black rounded text-white"

/>



<div className="relative">


<input

name="password"

type={
showPassword
?
"text"
:
"password"
}

placeholder="Password"

required

className="w-full p-3 bg-black rounded text-white pr-12"

/>


<button

type="button"

onClick={()=>
setShowPassword(!showPassword)
}

className="
absolute
right-4
top-3
text-gray-400
"

>


{
showPassword
?
<FaEyeSlash/>
:
<FaEye/>
}


</button>


</div>




<button

className="
w-full
mt-5
bg-purple-600
p-3
rounded
"

>

Register

</button>


</form>




{
error &&
<p className="text-red-500 mt-4">

{error}

</p>
}



</div>


</div>


);


};


export default Register;