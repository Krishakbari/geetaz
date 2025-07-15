import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import AdminMenu from '../../components/layout/AdminMenu'
import CategoryForm from '../../components/Form/CategoryForm'
import { Modal } from 'antd'
import Layout from '../../components/layout/Layout'

function CreateCategory() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState("")
  const [visible, setVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [updatedName, setUpdatedName] = useState("")

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API}/category/create-category`, { name })
      if (data?.success) {
        toast.success(`${name} is created`)
        setName("") // Clear the form
        getAllCategory()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong in input form")
    }
  }

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

  // Update category
  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.put(`${process.env.REACT_APP_API}/category/update-category/${selectedCategory._id}`, { 
        name: updatedName 
      })
      if (data?.success) {
        toast.success(`${updatedName} is updated`)
        setSelectedCategory(null)
        setUpdatedName("")
        setVisible(false)
        getAllCategory()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }

  // Delete category
  const handleDelete = async (pId) => {
    try {
      const { data } = await axios.delete(`${process.env.REACT_APP_API}/category/del-category/${pId}`)
      if (data?.success) {
        toast.success('Category is deleted')
        getAllCategory()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }

  return (
    <Layout title={"Dashboard-CreateCategory"}>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h2>Manage Category</h2>
            <div className='p-3 w-50'>
              <CategoryForm handleSubmit={handleSubmit} value={name} setvalue={setName}/>
            </div>
            <div className='w-75'>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>
                        <button 
                          className='btn btn-primary me-5' 
                          onClick={() => {
                            setVisible(true);
                            setUpdatedName(c.name)
                            setSelectedCategory(c)
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className='btn btn-danger'
                          onClick={() => {
                            handleDelete(c._id)
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal 
              onCancel={() => setVisible(false)} 
              footer={null} 
              open={visible}
              title="Update Category"
            >
              <CategoryForm 
                value={updatedName}   
                setvalue={setUpdatedName} 
                handleSubmit={handleUpdate}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CreateCategory