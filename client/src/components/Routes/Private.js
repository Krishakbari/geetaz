import { useState,useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

export default function PrivateRoute(){
    const [ok,setOk]=useState(false)
    const [auth,setAuth]=useAuth()

        useEffect(()=>{
            const authCheck=async()=>{
                const res=await axios.get(`${process.env.REACT_APP_API}/auth/user-auth`)
                    if(res.data.ok){
                        setOk(true)
                    }
                    else{
                        setOk(false)
                    }
                }
                    // token male to j function ne call karo
                    if(auth?.token) authCheck()
            
        },[auth?.token])

    return ok ? <Outlet/> : <Spinner/>

}

    // outlet thi routing ni functionallity enable thai jashe
    // nested route mate