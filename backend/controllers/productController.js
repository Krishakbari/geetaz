import slugify from "slugify"
import productModel from "../models/productModel.js"
import categoryModel from "../models/categorymodel.js"
import fs from "fs"
import braintree from "braintree"
import OrderModel from "../models/OrderModel.js"
import dotenv from "dotenv"
dotenv.config()

// payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});



// create product
export const createProductController = async (req, res) => {
    try {
        const { name, description, slug, price, category, quantity, shipping, size } = req.fields
        const { photo } = req.files
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "name is required" })
            case !price:
                return res.status(500).send({ error: "price is required" })
            case !description:
                return res.status(500).send({ error: "desc is required" })
            case !category:
                return res.status(500).send({ error: "category is required" })
            case !quantity:
                return res.status(500).send({ error: "quantity is required" })
            case !size:
                return res.status(500).send({ error: "size is required" })
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "photo is required and should less than 1mb" })
        }
        const products = new productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }

        await products.save()
        res.status(201).send({
            success: true,
            message: "created successfully",
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in product creating"
        })
    }
}

// get all product
export const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate("category").select("-photo").sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            total_count: products.length,
            message: "all products",
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in product getting",
            error,
        })
    }
}


// single pro
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate("category")
        res.status(200).send({
            success: true,
            message: "single product getting",
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in single product getting",
            error,
        })
    }
}


// grt photo
export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo")
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in getting product pic",
            error,
        })
    }
}


// del
export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success: true,
            message: "product deleted successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in del product",
            error,
        })
    }
}


// update
export const updateProductController = async (req, res) => {
    try {
        const { name, description, slug, price, category, quantity, shipping, size } = req.fields
        const { photo } = req.files
        // validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "name is required" })
            case !price:
                return res.status(500).send({ error: "price is required" })
            case !description:
                return res.status(500).send({ error: "desc is required" })
            case !category:
                return res.status(500).send({ error: "category is required" })
            case !quantity:
                return res.status(500).send({ error: "quantity is required" })
            case !size:
                return res.status(500).send({ error: "size is required" })
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "photo is required and should less than 1mb" })
        }
        const products = await productModel.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: "updated successfully",
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in product updating"
        })
    }
}

// product filter
export const productFilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body
        let args = {}
        if (checked.length > 0) args.category = checked
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }
        // if(radio.length)        args.size= {$gte : radio[0], $lte:radio[1]}
        const products = await productModel.find(args)
        res.status(200).send({
            success: true,
            total_counts: products.length,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in product filter"
        })
    }
}

// count
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in product count"
        })
    }
}

// product list based on page
export const productListController = async (req, res) => {
    try {
        const perPage = 6
        const page = req.params.page ? req.params.page : 1            //default 1
        const products = await productModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in product count"
        })
    }
}


// search 
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params
        const results = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },         //case sensitive ignore karva "i"
                { description: { $regex: keyword, $options: "i" } }         //case sensitive ignore karva "i"
            ]
        }).select("-photo")
        res.json(results)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in product count"
        })
    }
}


// similar product
export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid }
        }).select("-photo").populate("category")
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in similar category"
        })
    }
}


// get product by cate
export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const products = await productModel.find({ category }).populate("category");
        res.status(200).send({
            success: true,
            category,
            products,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in  category producr"
        })
    }
}

// payment gateway api for token
export const braintreeTokenController=async(req,res)=>{
    try{
        gateway.clientToken.generate({}, function(err, response){
            if(err){
                res.status(500).send(err)
            }else{
                res.send(response)
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in  getting payment token"
        })
    }
}


//for payment 
export const braintreePaymentsController=async(req,res)=>{
    try{
        const {nonce ,cart} =req.body
        let total=0
        cart.map((i) => {
            total += i.price
        })
        let newTransaction=gateway.transaction.sale({
            amount : total,
            paymentMethodNonce:nonce,
            options:{
                submitForSettlement:true,
            },
        },
        function(error,result){
            if(result){
                const order=new OrderModel({
                    products:cart,
                    payment:result,
                    buyer:req.user._id          //requre signin na mw per thi mali jashe
                }).save()
                res.json({ok:true})
            }else{
                res.status(200).send(error)
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in  token"
        })
    }
}