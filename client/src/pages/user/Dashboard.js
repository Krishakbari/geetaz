import React from 'react'
import { useAuth } from '../../context/auth'
import Layout from '../../components/layout/Layout'
import UserMenu from '../../components/layout/UserMenu'

const Dashboard = () => {
  const [auth]=useAuth()
  return (
    <Layout title={"user Dash"}>
      <div className='container-fluid p-3 m-3'>
            <div className='row'>
                <div className='col-md-3'>
                    <UserMenu/>
                </div>
                <div className='col-md-9'>
                    <div className='card w-75 p-3'>
                      <h3>{auth?.user?.name}</h3>
                      <h3>{auth?.user?.email}</h3>
                      <h3>{auth?.user?.address}</h3>
                    </div>
                </div>

            </div>
        </div>
    </Layout>
  )
}

export default Dashboard
