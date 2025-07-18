import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Select } from "antd"
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import AdminMenu from '../../components/layout/AdminMenu'
const { Option } = Select

const CreateProduct = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [photo, setPhoto] = useState("")
  const [size, setSize] = useState("")
  const [category, setCategory] = useState("")
  const [quantity, setQuantity] = useState("")
  const [shipping, setShipping] = useState("")
  const [description, setDescription] = useState("")

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

  // create product
  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const productData = new FormData()  //built in web api
      productData.append("name", name)
      productData.append("description", description)
      productData.append("price", price)
      productData.append("size", size)
      productData.append("photo", photo)
      productData.append("quantity", quantity)
      productData.append("category", category)
      const { data } = axios.post(`${process.env.REACT_APP_API}/product/create-product`, productData)

      if (data?.success) {
        toast.error(data?.message)
      } else {
        toast.success("Product Created Successfully")
        navigate("/dashboard/admin/products")
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }
  return (
    <Layout title={"Dashboard-CreateProducts"}>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h2>CreateProduct</h2>
            <div className='m-1 w-75'>
              <Select variant="borderless"
                placeholder="Select a category"
                size='large'
                showSearch
                className='form-select mb-3' onChange={(value) => { setCategory(value) }} >

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
                {photo && (   //retuen karavu hoi tyare (
                  <div className='text-center'>
                    <img src={URL.createObjectURL(photo)} alt='profuct_photo' height={'200px'} className='img img-responsive' />
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
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleCreate}>
                  CREATE PRODUCT
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CreateProduct
