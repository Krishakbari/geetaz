import slugify from "slugify"
import categoryModel from "../models/categorymodel.js"

export const createCategoryController=async(req,res)=>{
    try{
        const {name} =req.body
        if(!name){
            return res.status(401).send({
                message:"name is required"
            })
        }
        const existinfcategory=await categoryModel.findOne({name})
        if(existinfcategory){
             return res.status(200).send({
                success:true,
                message:"category already exist"
            })
        }

        const category=await new categoryModel({name, slug:slugify(name)}).save()
        return res.status(201).send({
                success:true,
                message:"New category created",
                category
            })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in category"
        })
    }
}


//update
export const updateCategoryController=async(req,res)=>{
    try{
        const {name}=req.body
        const {id}=req.params
        const category=await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
        res.status(200).send({
            success:true,
            message:"updating category succesfully",
            category
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error while updating category"
        })
    }
}


// all category
export const allCategoryController=async(req,res)=>{
    try{
        const category=await categoryModel.find({})
        res.status(200).send({
            success:true,
            message:"getting all category",
            category
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error while retriving category"
        })
    }
}


// single cate
export const singleCategoryController=async(req,res)=>{
    try{
        const {slug}=req.params
        const category=await categoryModel.findOne({slug})
        res.status(200).send({
            message:"get single cage successfully",
            category
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error while one category"
        })
    }
}


// del
export const deleteCategoryController=async(req,res)=>{
    try{
        const {id}=req.params
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            success:"del succesfull"
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error while del category"
        })
    }
}