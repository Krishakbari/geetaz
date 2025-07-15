import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useCart } from '../context/Cart'
import toast from 'react-hot-toast'

const ProducrDetails = () => {
    const params = useParams()
    const [product, setProduct] = useState({})         //single pro atle object {}
    const [relatedProducts, setRelatedProducts] = useState([])
    const [cart, setCart] = useCart()


    // get product
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/product/get-product/${params.slug}`)
            setProduct(data?.product)
            getSimilarProduct(data?.product._id, data?.product.category._id)
        } catch (error) {
            console.log(error)
        }
    }

    // get similar product
    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/product/related-product/${pid}/${cid}`)
            setRelatedProducts(data?.products)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (params?.slug) getProduct()

    }, [params?.slug])

    return (
        <Layout>
            <h1 className='mt-3'>Details</h1>
            {/* {JSON.stringify(product,null,4)} */}
            <div className='row container'>
                <div className='col-md-4'>
                    <img src={`${process.env.REACT_APP_API}/product/product-photo/${product._id}`} className="card-img-top" alt={product.name}
                        height={300} />
                </div>
                <div className='col-md-6 '>
                    <h1 className='text-center'>Product Details</h1> <hr></hr>
                    <h5>Name: {product.name}</h5>
                    <h5>Desc: {product.description}</h5>
                    <h5>Price: {product.price}</h5>
                    <h5>Name: {product?.category?.name}</h5>
                    <h5>Size: {product.size}</h5>
                    <button className='btn btn-secondary ms-1'
                        onClick={() => {
                            setCart([...cart, product]);
                            localStorage.setItem("cart", JSON.stringify([...cart, product]))
                            toast.success("Items added in cart")
                        }}> Add to Cart</button>
                </div>
            </div>
            <hr></hr>
            <div className='row container'>
                {/* <h1>{JSON.stringify(relatedProducts,null,4)}</h1> */}
                <h1 className='mt-10'>Similar Products</h1>
                {relatedProducts.length < 1 && (<p className='text-center'>No Similar Product Found</p>)}
                <div className='d-flex flex-wrap'>
                    {relatedProducts?.map(p => (
                        <div className="card m-2" style={{ width: '18rem', height: '490px', backgroundColor: "#6e606045" }} >
                            <img src={`${process.env.REACT_APP_API}/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                            <div className="card-body">
                                <h5 className="card-title">{p.name}</h5>
                                <p className="card-text">{p.description.substring(0, 100)}</p>
                                <p className="card-text ">${p.price}
                                    <button className='btn btn-secondary ms-1'
                                        onClick={() => {
                                            setCart([...cart, p]);
                                            localStorage.setItem("cart", JSON.stringify([...cart, p]))
                                            toast.success("Items added in cart")
                                        }}> Add to Cart</button>
                                </p>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default ProducrDetails
