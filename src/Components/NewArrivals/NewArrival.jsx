import React from "react"
import { useNewArrivals } from "../../Context/new-arrival-context"
import { ProductCard } from "../../index"
import Lottie from "lottie-react"
import LoadingLottie from "../../Assets/Lottie/loading-0.json"

function NewArrivals()
{
    const { newArrivalsProductList, loading, error } = useNewArrivals()

    if (error) {
        return (
            <div className='new-arrivals-container'>
                <div style={{textAlign: 'center', padding: '2rem'}}>
                    <h3>Unable to load new arrivals</h3>
                    <p>Please check your internet connection and try again.</p>
                </div>
            </div>
        )
    }

    return (
        <div className='new-arrivals-container'>
        {
          loading || newArrivalsProductList.length===0 ? (
            <Lottie 
              animationData={LoadingLottie}
              loop={true}
              style={{height: 380, margin: "auto"}}
            />
          ) : (
            newArrivalsProductList.map( product=> 
              (
                <ProductCard key={product._id} productdetails={product}/>
              )
            )
          )
        }
      </div>
    )
}

export { NewArrivals };
