import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const CategoryProduct = () => {

    const [products, setProducts] = useState([])
    const [category, setCategory] = useState([])
    const params = useParams()
    const navigate=useNavigate()
    const getProductByCat = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/product/product-category/${params.slug}`)
            setProducts(data?.products)
            setCategory(data?.category)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (params?.slug) getProductByCat()
    }, [params?.slug])
    // console.log(products.category.name)
    return (
        <Layout>
            <div className='container mt-3'>
                <h4 className='text-center'>category : {category?.name} </h4>
                <h6 className='text-center'>{products?.length} result found</h6>
                <div className='row'>
                    <div className='d-flex flex-wrap'>
                        {products?.map(p => (
                            <div className="card m-2" style={{ width: '18rem', height: '485px', backgroundColor: "#6e606045" }} >
                                <img src={`${process.env.REACT_APP_API}/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">{p.description.substring(0, 100)}</p>
                                    <p className="card-text">${p.price}</p>
                                    <button className='btn btn-primary' onClick={() => navigate(`/product/${p.slug}`)}>Details</button>
                                    <button className='btn btn-secondary ms-1'> Add to Cart</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CategoryProduct
