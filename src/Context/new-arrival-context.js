import { useState, useContext, createContext, useEffect} from 'react'
import axios from 'axios'

const NewArrivalsContext = createContext()

let NewArrivalsProvider = ({children}) => 
{
    const [ newArrivalsProductList, setNewArrivalsProductList ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState(null)

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                setLoading(true)
                setError(null)
                console.log('Fetching new arrivals...')
                const productsAvailableData = await axios.get('https://bookztron-server.vercel.app/api/home/newarrivals')
                console.log('New arrivals data:', productsAvailableData.data)
                
                if (productsAvailableData.data && productsAvailableData.data.newArrivalList) {
                    setNewArrivalsProductList([...productsAvailableData.data.newArrivalList])
                } else {
                    console.warn('No new arrivals data found')
                    setNewArrivalsProductList([])
                }
            }
            catch(error) {
                console.error("Error fetching new arrivals: ", error)
                setError(error)
                setNewArrivalsProductList([])
            } finally {
                setLoading(false)
            }
        }
        
        fetchNewArrivals()
    },[])

    return (
        <NewArrivalsContext.Provider value={{
            newArrivalsProductList, 
            setNewArrivalsProductList,
            loading,
            error
        }}>
            {children}
        </NewArrivalsContext.Provider>
    )
}

let useNewArrivals = () => useContext(NewArrivalsContext)

export { NewArrivalsProvider, useNewArrivals }
