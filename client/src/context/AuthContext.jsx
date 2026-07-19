import {
  createContext,
  useEffect,
  useState,
} from "react";

import api from "../services/axios";


export const AuthContext = createContext();


const AuthProvider = ({children}) => {


  const [user,setUser] = useState(null);

  const [loading,setLoading] = useState(true);



  // ======================
  // CHECK USER
  // ======================

  useEffect(()=>{


    const checkUser = async()=>{


      try{


        const res =
          await api.get("/auth/me");


        setUser(res.data);



      }catch(error){


        setUser(null);


      }finally{


        setLoading(false);


      }


    };


    checkUser();


  },[]);





  // ======================
  // EMAIL LOGIN
  // ======================


  const login = async(
    email,
    password
  )=>{


    const res =
      await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );



    setUser(res.data.user);



    return res.data;


  };





  // ======================
  // LOGOUT
  // ======================


  const logout = async()=>{


    try{


      await api.post(
        "/auth/logout"
      );


    }catch(error){


      console.log(error);


    }



    setUser(null);


    localStorage.removeItem(
      "userEmail"
    );


  };





  return (

    <AuthContext.Provider

      value={{

        user,

        setUser,

        login,

        logout,

        loading,

      }}

    >

      {children}


    </AuthContext.Provider>

  );


};



export default AuthProvider;