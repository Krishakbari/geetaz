import { useState, useEffect,useContext,createContext } from "react";
const CartContext=createContext()

const CartProvider=({children})=>{
    const [cart,setCart]=useState([])

    useEffect(()=>{
        let existingcartItem=localStorage.getItem("cart")
        if(existingcartItem) setCart(JSON.parse(existingcartItem))
    },[])
    return(
        <CartContext.Provider value={[cart,setCart]}>
            {children}
        </CartContext.Provider>
    )    
}

// custom hook
const useCart=()=> useContext(CartContext)

export{useCart,CartProvider}