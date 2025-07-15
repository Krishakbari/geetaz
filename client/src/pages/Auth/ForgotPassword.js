import React, { useState } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import "../../styles/AuthStyles.css";
import Layout from '../../components/layout/Layout';

const ForgotPassword = () => {

    const [email, setEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [answer, setAnswer] = useState("")
    const navigate = useNavigate()

    // form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/auth/forgot-password", {
                email,
                newPassword,
                answer
            });
            if (res && res.data.success) {
                toast.success(res.data && res.data.message);
               
                navigate("/login");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };
  return (
   <Layout title="Forgot-password">
     <div className="form-container">

                <form onSubmit={handleSubmit}>
                    <h1 className='mb-3 text-center'>RESET_PASSWORD</h1>
                    <div className="mb-3">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail1" placeholder='Email' required />
                    </div>

                    <div className="mb-3">
                        <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} className="form-control" id="exampleInputEmail1" placeholder="your friend name[secutury'Q]" required />
                    </div>

                    <div className="mb-3">
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control" id="exampleInputEmail1" placeholder='NewPassword' required />
                    </div>

                    <button type="submit" className="btn btn-primary forg">Reset</button>
                </form>
            </div>
   </Layout>
  )
}

export default ForgotPassword
