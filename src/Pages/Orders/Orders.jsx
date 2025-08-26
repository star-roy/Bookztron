import "./Orders.css"
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode"
import axios from "axios";
import { Link, useLocation } from "react-router-dom"
import { 
    ProductOrderCard,
    useWishlist,
    useCart,
    useOrders
} from "../../index"
import Lottie from 'lottie-react';
import GuyWithBookLottie from "../../Assets/Icons/guy_with_book.json"

function Orders()
{
    const { userWishlist, dispatchUserWishlist } = useWishlist()
    const { userCart, dispatchUserCart } = useCart()
    const { userOrders, dispatchUserOrders } = useOrders()
    const { pathname } = useLocation();
  
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(()=>{
        const token=localStorage.getItem('token')

        if(token)
        {
            const user = jwtDecode(token)
            if(!user)
            {
                localStorage.removeItem('token')
            }
            else
            {
                if(userOrders.length===0)
                {
                    (async function getUpdatedWishlistAndCart()
                    {
                        let updatedUserInfo = await axios.get(
                        "https://bookztron-server.vercel.app/api/user",
                        {
                            headers:
                            {
                            'x-access-token': localStorage.getItem('token'),
                            }
                        })
                        if(updatedUserInfo.data.status==="ok")
                        {
                            dispatchUserOrders({type: "UPDATE_USER_ORDERS",payload: updatedUserInfo.data.user.orders})                   
                            if(userWishlist.length===0)
                            {
                                dispatchUserWishlist({type: "UPDATE_USER_WISHLIST",payload: updatedUserInfo.data.user.wishlist})
                                
                            }
                            if(userCart.length===0)
                            {
                                dispatchUserCart({type: "UPDATE_USER_CART",payload: updatedUserInfo.data.user.cart})
                            }
                        }
                    })()
                }
            }
        }
        else
        {
            dispatchUserOrders({type: "UPDATE_USER_ORDERS",payload: []})
        }   
    },[dispatchUserCart, dispatchUserOrders, dispatchUserWishlist, userCart.length, userOrders.length, userWishlist.length])

    return (
        <div className="orders-content-container">
            <h2>{userOrders.length} {userOrders===1?"item":"items"} in your Orders</h2>
            {
                userOrders.length === 0
                ? (
                    <div className="no-orders-message-container">
                            <Lottie 
                                animationData={GuyWithBookLottie}
                                loop={true}
                                style={{height: 350, width: 350}}
                            />
                            <h2>You have not placed any orders</h2>
                            <Link to="/cart">
                                <button className=" solid-primary-btn">Go to cart</button>
                            </Link>
                    </div>
                )
                : (
                    <div className="orders-container">
                        {
                            userOrders.map( (productDetails, index)=>    
                                <ProductOrderCard key={index} productDetails={productDetails}/>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

export { Orders }
