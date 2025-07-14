import express from "express"
import { isAdmin, requiredSignIn } from "../middlewares/authMiddleware.js"
import { braintreePaymentsController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFilterController, productListController, productPhotoController,relatedProductController,searchProductController,updateProductController } from "../controllers/productController.js"
import formidable from "express-formidable"
const router=express.Router()

// routes
router.post("/create-product" ,requiredSignIn,isAdmin,formidable() ,createProductController)

// get products
router.get("/get-product", getProductController)

// single product
router.get("/get-product/:slug",getSingleProductController)

// get photo
router.get("/product-photo/:pid",productPhotoController)

// del product
router.delete("/del-product/:pid",deleteProductController)

// update
router.put("/update-product/:pid" ,requiredSignIn,isAdmin,formidable() ,updateProductController)

// filter
router.post("/product-filter",productFilterController)

// p count
router.get("/product-count",productCountController)

// p per page
router.get("/product-list/:page",productListController)

// serch produc
router.get("/search/:keyword",searchProductController)

// similar product
router.get("/related-product/:pid/:cid",relatedProductController)

// category wise product
router.get("/product-category/:slug",productCategoryController)

// payment route..get token from braintree
router.get("/braintree/token", braintreeTokenController)

// payment
router.post("/braintree/payment",requiredSignIn, braintreePaymentsController)
export default router