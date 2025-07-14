import jwt from "jsonwebtoken"
import { comparedPassword, hashPassword } from "../helpers/authHelpers.js"
import userModel from "../models/UserModel.js"

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body
        // validation
        if (!name) {
            return res.send({ message: "name is required" })
        }
        if (!email) {
            return res.send({ message: "email is required" })
        }
        if (!password) {
            return res.send({ message: "password is required" })
        }
        if (!phone) {
            return res.send({ message: "phoneNumber is required" })
        }
        if (!address) {
            return res.send({ message: "address is required" })
        }
        if (!answer) {
            return res.send({ message: "answer is required" })
        }

        //existing user 
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(500).send({
                success: false,
                message: "already registered",
            })
        }

        // register user
        const hashedPassword = await hashPassword(password)
        const user = await new userModel({ name, email, phone, address, password: hashedPassword, answer }).save()
        res.status(200).send({
            success: true,
            message: "registration successfull",
            user
        })

    } catch (erorr) {
        console.log(erorr)
        res.status(500).send({
            success: false,
            message: "error in registration",
            erorr
        })
    }
}

// / LOGIn
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body

        // validation
        if (!email || !password) {
            return res.status(500).send({
                success: false,
                message: "inavalid email or password",
            })
        }
        // check user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(200).send({
                success: false,
                message: "email is not registerd"
            })
        }
        const match = await comparedPassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid credentials"
            })
        }

        // token
        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.status(200).send({
            success: true,
            message: "Login succesfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            }, token
        })

    } catch (erorr) {
        console.log(erorr)
        res.status(500).send({
            success: false,
            message: "error in Login",
            erorr
        })
    }
}

//FORGOT PASSWORD
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            res.status(400).send({ message: "Email is required" });
        }
        if (!answer) {
            res.status(400).send({ message: "answer is required" });
        }
        if (!newPassword) {
            res.status(400).send({ message: "New Password is required" });
        }
        //check
        const user = await userModel.findOne({ email, answer });
        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email Or Answer",
            });
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error,
        });
    }
};


// update
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);
    
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
            },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated SUccessfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong in update profile",
            error,
        });
    }
}

