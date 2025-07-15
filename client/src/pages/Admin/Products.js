import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import AdminMenu from '../../components/layout/AdminMenu'

const Products = () => {
    const [products, setProducts] = useState([])

    // get all products
    const getAllProducts = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/product/get-product`)
            setProducts(data?.products)
        } catch (error) {
            console.log(error)
            toast.error("something went wrong")
        }
    }
    //lifecycle method
    useEffect(() => {
        getAllProducts()
    }, [])
    return (
        <Layout>
            <div className='row'>
                <div className='col-md-3'>
                    <AdminMenu />
                </div>
                <div className='col-md-9'>
                    <h2 className='text-center'>All Products List</h2>
                    <div className='d-flex flex-wrap'>
                        {products?.map(p => (
                            <Link key={p._id} to={`/dashboard/admin/product/${p.slug}`} className='product-link'>
                                <div className="card m-2" style={{ width: '18rem' , height:'430px', backgroundColor:"#6e606045"}} >
                                    <img src={`${process.env.REACT_APP_API}/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                                    <div className="card-body">
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text">{p.description.substring(0,100)}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Products
