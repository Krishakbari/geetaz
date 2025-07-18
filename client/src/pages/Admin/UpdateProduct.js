import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import AdminMenu from '../../components/layout/AdminMenu'
import { Select } from 'antd'
const { Option } = Select


const UpdateProduct = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [categories, setCategories] = useState([])
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [size, setSize] = useState("")
    const [photo, setPhoto] = useState("")
    const [category, setCategory] = useState("")
    const [quantity, setQuantity] = useState("")
    const [shipping, setShipping] = useState("")
    const [description, setDescription] = useState("")
    const [id, setId] = useState("")         //category apdi id na basis per 6e atle

    //get single product
    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/product/get-product/${params.slug}`)
            setName(data.product.name)
            setId(data.product._id)
            setDescription(data.product.description)
            setPrice(data.product.price)
            setSize(data.product.size)
            setQuantity(data.product.quantity)
            setCategory(data.product.category._id)
            setShipping(data.product.shipping)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getSingleProduct()
        // eslint-disable-next-line
    }, [])

    // Get all categories
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/category/get-category`)
            if (data?.success) {
                setCategories(data?.category)
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong in getting category")
        }
    }

    useEffect(() => {
        getAllCategory()
    }, [])

    // update product
    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            const productData = new FormData()  //built in web api
            productData.append("name", name)
            productData.append("description", description)
            productData.append("price", price)
            productData.append("size", size)
            photo && productData.append("photo", photo)

            productData.append("quantity", quantity)
            productData.append("category", category)
            const { data } = axios.put(`${process.env.REACT_APP_API}/product/update-product/${id}`, productData)

            if (data?.success) {
                toast.error(data?.message)
            } else {
                toast.success("Product Updated Successfully")
                navigate("/dashboard/admin/products")
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }
    //   delete
    const handleDelete = async () => {
        try {
            let answer = window.prompt("Type 'yes' to delete this product.")
            if (!answer) return

            const { data } = await axios.delete(`${process.env.REACT_APP_API}/product/del-product/${id}`)
            toast.success("product deleted successfully")
            navigate("/dashboard/admin/products")
        } catch (error) {
            console.log(error)
            toast.error("something went wrong")
        }
    }

    return (
        <Layout title={"Dashboard-UpdateProducts"}>
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <h2>UpdateProduct Product</h2>
                        <div className='m-1 w-75'>
                            <Select variant="borderless"
                                placeholder="Select a category"
                                size='large'
                                showSearch
                                className='form-select mb-3' onChange={(value) => { setCategory(value) }} value={category} >

                                {categories?.map(c => (
                                    <Option key={c._id} value={c._id}>
                                        {c.name}
                                    </Option>
                                ))}

                            </Select>
                            <div className='mb-3'>
                                <label className='btn btn-outline-secondary col-md-12 mt-3'>
                                    {photo ? photo.name : " Upload photo"}
                                    <input type='file' name='photo' accept='image/*' onChange={(e) => setPhoto(e.target.files[0])} hidden />
                                </label>
                            </div>
                            <div className='mb-3'>
                                {photo ? (
                                    <div className='text-center'>
                                        <img src={URL.createObjectURL(photo)} alt='profuct_photo' height={'200px'} className='img img-responsive' />
                                    </div>
                                ) : (
                                    <div className='text-center'>
                                        <img src={`${process.env.REACT_APP_API}/product/product-photo/${id}`} alt='profuct_photo' height={'200px'} className='img img-responsive' />
                                    </div>
                                )}
                            </div>
                            <div className='mb-3'>
                                <input type='text' value={name} placeholder='Write a name' className='form-control' onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <textarea
                                    type="text"
                                    value={description}
                                    placeholder="write a description"
                                    className="form-control"
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="number"
                                    value={price}
                                    placeholder="write a Price"
                                    className="form-control"
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="number"
                                    value={size}
                                    placeholder="write a size"
                                    className="form-control"
                                    onChange={(e) => setSize(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="number"
                                    value={quantity}
                                    placeholder="write a quantity"
                                    className="form-control"
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <Select
                                    variant="borderless"
                                    placeholder="Select Shipping "
                                    size="large"
                                    showSearch
                                    className="form-select mb-3"
                                    onChange={(value) => {
                                        setShipping(value);
                                    }}
                                    value={shipping ? "Yes" : "No"}
                                >
                                    <Option value="0">No</Option>
                                    <Option value="1">Yes</Option>
                                </Select>
                            </div>
                            <div className="mb-3">
                                <button className="btn btn-primary" onClick={handleUpdate}>
                                    UPDATE PRODUCT
                                </button>
                            </div>
                            <div className="mb-3">
                                <button className="btn btn-danger" onClick={handleDelete}>
                                    DELETE PRODUCT
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UpdateProduct
