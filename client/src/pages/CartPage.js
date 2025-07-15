import React, { useEffect, useState, useRef } from 'react'
import Layout from '../components/layout/Layout'
import { useCart } from '../context/Cart'
import { useAuth } from '../context/auth'
import { useNavigate } from 'react-router-dom'
import dropin from 'braintree-web-drop-in'
import axios from 'axios'
import toast from 'react-hot-toast'

const CartPage = () => {
    const [cart, setCart] = useCart()
    const [auth, setAuth] = useAuth()
    const navigate = useNavigate()
    const [clientToken, setClientToken] = useState("");
    const [dropinInstance, setDropinInstance] = useState(null);
    const [loading, setLoading] = useState(false);
    const dropinContainerRef = useRef(null);

    // total price
    const totalPrice = () => {
        try {
            let total = 0;
            cart?.map((item) => {
                total = total + item.price;
            });
            return total.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
            });
        } catch (error) {
            console.log(error);
        }
    };

    // del item
    const removeCart = (pid) => {
        try {
            let myCart = [...cart]
            let index = myCart.findIndex(item => item._id === pid)
            myCart.splice(index, 1)
            setCart(myCart)
            localStorage.setItem("cart", JSON.stringify(myCart))
        } catch (error) {
            console.log(error)
        }
    }

    // get payment gateway token
    const getToken = async () => {
        try {
            console.log('Fetching client token...');
            const { data } = await axios.get(`${process.env.REACT_APP_API}/product/braintree/token`);
            console.log('Client token received:', data?.clientToken ? 'Success' : 'Failed');
            setClientToken(data?.clientToken);
        } catch (error) {
            console.error('Error fetching token:', error);
            toast.error('Failed to load payment options');
        }
    };

    // Initialize Braintree Drop-in
    const initializeDropin = async () => {
        if (!clientToken || !dropinContainerRef.current) return;

        try {
            // Destroy existing instance if it exists
            if (dropinInstance) {
                await dropinInstance.teardown();
                setDropinInstance(null);
            }

            console.log('Initializing Braintree Drop-in...');
            
            const instance = await dropin.create({
                authorization: clientToken,
                container: dropinContainerRef.current,
                paypal: {
                    flow: 'vault'
                },
                card: {
                    overrides: {
                        fields: {
                            number: {
                                placeholder: '1111 1111 1111 1111'
                            },
                            cvv: {
                                placeholder: '123'
                            },
                            expirationDate: {
                                placeholder: 'MM/YY'
                            }
                        }
                    }
                }
            });

            setDropinInstance(instance);
            console.log('Braintree Drop-in initialized successfully');
        } catch (error) {
            console.error('Error initializing Drop-in:', error);
            toast.error('Failed to initialize payment form');
        }
    };

    useEffect(() => {
        if (auth?.token) {
            getToken();
        }
    }, [auth?.token]);

    useEffect(() => {
        if (clientToken) {
            initializeDropin();
        }
        
        // Cleanup function
        return () => {
            if (dropinInstance) {
                dropinInstance.teardown().catch(console.error);
            }
        };
    }, [clientToken]);

    // handlePayment
    const handlePayment = async () => {
        if (!dropinInstance) {
            toast.error('Payment form not ready');
            return;
        }

        try {
            setLoading(true);
            console.log('Requesting payment method...');
            
            const { nonce } = await dropinInstance.requestPaymentMethod();
            console.log('Payment nonce received:', nonce ? 'Success' : 'Failed');
            
            const { data } = await axios.post(`${process.env.REACT_APP_API}/product/braintree/payment`, { 
                nonce, 
                cart 
            });
            
            console.log('Payment processed:', data);
            setLoading(false);
            localStorage.removeItem("cart");
            setCart([]);
            navigate("/dashboard/user/orders");
            toast.success("Payment completed successfully");
        } catch (error) {
            console.error('Payment error:', error);
            setLoading(false);
            
            if (error.name === 'DropinError' && error.message.includes('No payment method')) {
                toast.error('Please select a payment method');
            } else {
                toast.error('Payment failed: ' + (error.message || 'Unknown error'));
            }
        }
    };

    return (
        <Layout>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        <h1 className='text-center bg-light p-2 mb-2'>
                            {`Hello ${auth?.token && auth?.user?.name}`}
                        </h1>
                        <h4 className='text-center'>
                            {cart?.length ? `You Have ${cart.length} items in cart... ${auth?.token ? " " : "Please login to checkout"}` : "Your cart is empty"}
                        </h4>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-8'>
                        {
                            cart?.map((p, index) => (
                                <div key={p._id || index} className='row mb-2 p-2 card flex-row'>
                                    <div className='col-md-4'>
                                        <img 
                                            src={`${process.env.REACT_APP_API}/product/product-photo/${p._id}`} 
                                            className="card-img-top" 
                                            alt={p.name} 
                                            height={"200px"} 
                                            style={{objectFit: 'cover'}}
                                        />
                                    </div>
                                    <div className='col-md-8'>
                                        <p><strong>{p.name}</strong></p>
                                        <p>{p.description?.substring(0, 40)}...</p>
                                        <p>${p.price} <b>Only</b></p>
                                        <button 
                                            className='btn btn-danger' 
                                            onClick={() => removeCart(p._id)}
                                        >
                                            REMOVE
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className='col-md-4 text-center'>
                        <h2>Cart Summary</h2>
                        <p>Total | Checkout | Payment</p>
                        <hr />
                        <h4>Total : {totalPrice()}</h4>
                        
                        {auth?.user?.address ? (
                            <div className='mb-3'>
                                <h4>Current Address</h4>
                                <h5>{auth?.user?.address}</h5>
                                <button 
                                    className='btn btn-outline-warning'
                                    onClick={() => navigate("/dashboard/user/profile")}
                                >
                                    Update Address
                                </button>
                            </div>
                        ) : (
                            <div className='mb-3'>
                                {auth?.token ? (
                                    <button 
                                        className='btn btn-outline-warning' 
                                        onClick={() => navigate("/dashboard/user/profile")}
                                    >
                                        Update Address
                                    </button>
                                ) : (
                                    <button 
                                        className="btn btn-outline-warning" 
                                        onClick={() => navigate("/login", { state: "/cart" })}
                                    >
                                        Please Login to checkout
                                    </button>
                                )}
                            </div>
                        )}
                        
                        <div className='mt-2'>
                            {/* Debug info */}
                            <div className="mb-2">
                                <small className="text-muted">
                                    Token: {clientToken ? '✓' : '✗'} | 
                                    Cart: {cart?.length || 0} items | 
                                    Auth: {auth?.token ? '✓' : '✗'} |
                                    Drop-in: {dropinInstance ? '✓' : '✗'}
                                </small>
                            </div>
                            
                            {!clientToken ? (
                                <div className="alert alert-info">
                                    Loading payment options...
                                </div>
                            ) : !cart?.length ? (
                                <div className="alert alert-warning">
                                    Your cart is empty
                                </div>
                            ) : (
                                <>
                                    {/* Braintree Drop-in container */}
                                    <div 
                                        ref={dropinContainerRef}
                                        className="mb-3"
                                        style={{ minHeight: '200px' }}
                                    />

                                    <button 
                                        className="btn btn-primary mt-3" 
                                        onClick={handlePayment} 
                                        disabled={loading || !dropinInstance || !auth?.user?.address}
                                    >
                                        {loading ? "Processing..." : "Make Payment"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CartPage