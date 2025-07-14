import express from "express"
import {forgotPasswordController, loginController, registerController, updateProfileController} from "../controllers/userController.js"
import {requiredSignIn,isAdmin} from "../middlewares/authMiddleware.js"
// router obj
const router=express.Router()

// register || post
router.post("/register",registerController )

// login || post
router.post("/login",loginController )

//forgot-password 
router.post("/forgot-password",forgotPasswordController )

// protected route
router.get("/user-auth", requiredSignIn, (req,res)=>{
    res.status(200).send({
        ok:true
    })
})

// Admin router protected route
router.get("/admin-auth", requiredSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// update profile
router.put("/profile",requiredSignIn, updateProfileController)



export default router