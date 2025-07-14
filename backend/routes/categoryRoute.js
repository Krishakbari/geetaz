import express from "express"
import {isAdmin, requiredSignIn} from "./../middlewares/authMiddleware.js"
import { allCategoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controllers/categoryController.js"
const router=express.Router()

// ROutes

// create cate
router.post('/create-category',requiredSignIn, isAdmin, createCategoryController)

// update
router.put('/update-category/:id',requiredSignIn, isAdmin, updateCategoryController)

// get all category
router.get('/get-category', allCategoryController)

// get one category
router.get('/single-category/:slug', singleCategoryController)

// del
router.delete("/del-category/:id",requiredSignIn,isAdmin, deleteCategoryController)
export default router