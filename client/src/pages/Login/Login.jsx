import {
 useState,
 useContext
} from "react";


import {
 FaEye,
 FaEyeSlash
} from "react-icons/fa";


import toast from "react-hot-toast";


import {
 useNavigate,
 useLocation
} from "react-router-dom";


import {
 AuthContext
} from "../../context/AuthContext";



const Login =()=>{


const {
 login
}=useContext(AuthContext);



const [showPassword,setShowPassword]=useState(false);


const [error,setError]=useState("");



const navigate=useNavigate();


const location=useLocation();



const from =
location.state?.from?.pathname || "/";





const handleLogin=async(e)=>{


e.preventDefault();


setError("");



const email =
e.target.email.value;


const password =
e.target.password.value;



try{


await login(
email,
password
);



localStorage.setItem(
"userEmail",
email
);



toast.success(
"Login Successful"
);



navigate(
from,
{
replace:true
}
);



}catch(err){



const msg =
err.response?.data?.message ||
"Login Failed";


setError(msg);


toast.error(msg);


}



};






return (

<div className="min-h-screen flex items-center justify-center">


<div className="bg-[#1b1330] p-8 rounded-xl w-full max-w-md">


<h1 className="text-3xl text-purple-400 font-bold text-center mb-6">

Login

</h1>



<form onSubmit={handleLogin}>


<input

name="email"

type="email"

placeholder="Email"

required

className="
w-full
p-3
mb-4
bg-black
rounded
text-white
"

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

className="
w-full
p-3
bg-black
rounded
text-white
pr-12
"

/>


<button

type="button"

onClick={()=>setShowPassword(!showPassword)}

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

Login

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



export default Login;