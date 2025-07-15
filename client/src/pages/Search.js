import React from 'react'
import Layout from '../components/layout/Layout'
import { useSearch } from '../context/Search'

const Search = () => {

    const [searchState,setSearchState]=useSearch()

  return (
    <Layout title={"Search-Result"}>
      <div className='container'>
        <div className='text-center'>
            <h1>Search Result</h1>
            <h6>{searchState ?.results.length < 1 ? "No Producs Found" :  `Found ${searchState?.results.length}`}</h6>
             <div className='d-flex flex-wrap mt-4'>
            {searchState?.results.map(p => (
              <div className="card m-2" style={{ width: '18rem', height: '485px', backgroundColor: "#6e606045" }} >
                <img src={`${process.env.REACT_APP_API}/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description.substring(0, 100)}</p>
                  <p className="card-text">${p.price}</p>
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

export default Search
