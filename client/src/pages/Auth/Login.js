import React, { useState } from 'react'
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"
import toast from "react-hot-toast"
import "../../styles/AuthStyles.css";
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/auth';


const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setpassword] = useState("")
    const [auth,setAuth]=useAuth()
    const navigate = useNavigate()
    const location=useLocation()

    // form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/auth/login`, {
                email,
                password,
            });
            if (res && res.data.success) {
                toast.success(res.data && res.data.message);
                setAuth({
                    ...auth,
                    user:res.data.user,
                    token:res.data.token
                })
                localStorage.setItem("auth", JSON.stringify(res.data));
                navigate(location.state ||"/")
               
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    return (
        <Layout title={"Login to Geeta'z"}>
            <div className="form-container">

                <form onSubmit={handleSubmit}>
                    <h1 className='mb-3 text-center'>LOGIN</h1>
                    <div className="mb-3">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail1" placeholder='Email' required />
                    </div>

                    <div className="mb-3">
                        <input type="password" value={password} onChange={(e) => setpassword(e.target.value)} className="form-control" id="exampleInputEmail1" placeholder='Password' required />
                    </div>


                    <div className="mb-3">
                      <button type="button" className="btn btn-primary" onClick={()=>{ navigate("/forgot-password")}}>Forgot Password</button>
                    </div>

                    <button type="submit" className="btn btn-primary logi">Login</button>
                </form>
            </div>
        </Layout>
    )
}

export default Login
