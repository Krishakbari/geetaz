import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/auth'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Checkbox, Radio } from 'antd'
import { Prices } from '../components/Prices'
import { useCart } from '../context/Cart'
// import { Sizes} from "../components/Sizes"

const HomePage = () => {
  const navigate = useNavigate()
  // const [auth, setAuth] = useAuth()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [checked, setChecked] = useState([])
  const [radio, setRadio] = useState([])
  const [total,setTotal]=useState(0)
  const [page,setPage]=useState(1)
  const [loading,setLoading]=useState(false)
  const [cart,setCart]=useCart()

  // 

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
    getTotal()
  }, [])

  //  // get all products     //pela aa hatu p6 paginatation thi niche nu kari lidhu
  //   const getAllProducts = async () => {
  //       try {
  //           const { data } = await axios.get(`${process.env.REACT_APP_API}/product/get-product`)
  //           setProducts(data?.products)
  //       } catch (error) {
  //           console.log(error)
  //           toast.error("something went wrong")
  //       }
  //   }

  // get all products
  const getAllProducts = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${process.env.REACT_APP_API}/product/product-list/${page}`)
      setLoading(false)
      setProducts(data?.products)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  //filter 
  const handleFilter = (value, id) => {
    let all = [...checked]
    if (value) {
      all.push(id)
    } else {
      all = all.filter(c => c !== id)
    }
    setChecked(all)
  }

  //lifecycle method
  useEffect(() => {
    if(!checked.length || !radio.length) getAllProducts()
  }, [checked.length, radio.length])

  useEffect(()=>{
    if(checked.length || radio.length) filterProduct()
  },[checked,radio])

  // filters
  const filterProduct=async()=>{
    try{
      const {data}=await axios.post(`${process.env.REACT_APP_API}/product/product-filter`,{checked,radio})
      setProducts(data?.products)
    }catch(error){
      console.log(error)
    }
  }

  // get total product count
  const getTotal=async()=>{
    try{
      const {data}=await axios.get(`${process.env.REACT_APP_API}/product/product-count`)
      setTotal(data?.total)
    }catch(error){
      console.log(error)
    }
  }

  // load more
  const loadMore=async()=>{
    try{
      setLoading(true)
      const {data}=await axios.get(`${process.env.REACT_APP_API}/product/product-list/${page}`)
      setLoading(false)
      setProducts([...products,  ...data?.products])      //peli products to m nam j and baki ni niche add karavi do
    }catch(error){  
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(()=>{
    if(page === 1) return
    loadMore()
  },[page])

  

  return (
    <Layout title={"All-products"}>
      {/* <pre>
        {JSON.stringify(auth, null, 4)}
      </pre> */}

      <div className='row mt-3 '>
        <div className='col-md-2 ml-5'>
          {/* filter 1 */}
          <h5 className='text-center'>Filter by Category </h5>
          <div className='d-flex flex-column'>
            {categories?.map(c => (
              <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                {c.name}
              </Checkbox>
            ))}

          </div>

          {/* filter 2 */}
          <h5 className='text-center mt-4'>Filter by Price </h5>
          <div className='d-flex flex-column'>
            <Radio.Group onChange={e => setRadio(e.target.value)}>

              {Prices?.map(p => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className='d-flex flex-column'>
            <button className='btn btn-danger mt-5' onClick={()=>{window.location.reload()}}>RESET</button>
          </div>

          {/* filter 3 */}
          {/* <h5 className='text-center mt-4'>Filter by Price </h5>
          <div className='d-flex flex-column'>
            <Radio.Group onChange={e => setRadio(e.target.value)}>

              {Sizes?.map(s => (
                <div key={s._id}>
                  <Radio value={s.array}>{s.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div> */}

        </div>
        <div className='col-md-9'>
          {/* {JSON.stringify(radio, null, 4)} */}
          <h1 className='text-center'>All Products</h1>
          <div className='d-flex flex-wrap'>
            {products?.map(p => (
              <div className="card m-2" style={{ width: '18rem', height: '485px', backgroundColor: "#6e606045" }} >
                <img src={`${process.env.REACT_APP_API}/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description.substring(0, 100)}</p>
                  <p className="card-text">${p.price}</p>


                  <button className='btn btn-primary' onClick={() => navigate(`/product/${p.slug}`)}>Details</button>

                  <button className='btn btn-secondary ms-1' 
                      onClick={()=>{setCart([...cart,p]);
                        localStorage.setItem("cart",JSON.stringify([...cart,p]))
                     toast.success("Items added in cart")}}> Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
          <div className='m-2 p-3'>
            {products && products.length < total  &&(
              <button className='btn btn-warning'
                onClick={(e)=>{
                  e.preventDefault()
                  setPage(page+1)     //initialy 6 product p6 pachha 6 prodct
                }}>
                {loading ? "Loading..." : "Loadmore"}
              </button>
            )}
          </div>
        </div>
      </div>

    </Layout>
  )
}

export default HomePage
