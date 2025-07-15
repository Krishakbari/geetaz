import React from 'react'
import Layout from '../components/layout/Layout'

const Policy = () => {
  return (
            <Layout title={"Privacy Policy"}>
            <div className="row contactus ">
                <div className="col-md-5 ">
                    <img
                        src="/imgs/pri1.jpg"
                        alt="contactus"
                        style={{ width: "100%" }}
                    />
                </div>
                <div className="col-md-5">
                    At Geeta's Shop, your privacy is our priority. We collect only essential information needed to process orders and enhance your shopping experience, including name, address, payment details, and browsing preferences.
                    Your personal data is securely encrypted and never shared with third parties without consent. We use information solely for order fulfillment, customer support, and personalized recommendations.
                    Cookies help us improve website functionality and remember your preferences. You can disable cookies anytime through browser settings.
                    We implement industry-standard security measures to protect your information. Data is retained only as long as necessary for business purposes or legal requirements.
                </div>
            </div>
        </Layout>
  )
}

export default Policy
