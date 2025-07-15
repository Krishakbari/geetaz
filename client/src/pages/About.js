import React from 'react'
import Layout from '../components/layout/Layout'

const About = () => {
  return (
  <Layout title={"About us - Geeta'z"}>
            <div className="row contactus ">
                <div className="col-md-5 ">
                    <img src="/imgs/about.jpeg" alt="contactus" style={{ width: "100%" }}/>
                </div>
                <div className="col-md-5">
                    <p className="text-justify mt-2">
                        Discover curated fashion that speaks to your unique personality at <b>Geeta'z Shop</b>. We believe every individual deserves to express themselves through exceptional style choices. Our carefully selected collection features trendy apparel, accessories, and lifestyle products that blend quality with affordability.
                        From everyday essentials to statement pieces, we offer versatile options for every occasion. Whether you're updating your wardrobe or searching for that perfect gift, our personalized shopping experience ensures you find exactly what you're looking for.
                        At Nukilla's Shop, style meets substance. Shop with confidence, express your authentic self, and join our community of fashion-forward individuals who refuse to blend in.
                        Your style, your story, your Geeta'z.
                    </p>
                </div>
            </div>
        </Layout>
  )
}

export default About
